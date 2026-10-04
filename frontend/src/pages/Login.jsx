import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../api/config.js'
import styles from './Login.module.css'

/**
 * Login.jsx — Login + Register page (mirrors the original login.html)
 *
 * Tabs:
 *   [Login]    → username + password → POST /login → navigate /home
 *   [Register] → Step 1: choose role (Landlord / Tenant)
 *                Step 2A: Landlord registration form → POST /register
 *                Step 2B: Tenant/Buyer registration form → POST /register
 */
function Login() {
  const navigate = useNavigate()

  // Which main tab is active: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login')

  const switchToLogin    = () => { setActiveTab('login');    setMessage(null) }
  const switchToRegister = () => { setActiveTab('register'); setMessage(null); setRegStep('chooseRole') }

  // Shared message state
  const [message, setMessage] = useState(null) // { type: 'success'|'error', text }

  // Background slider state
  const [bgIndex, setBgIndex] = useState(0)
  // Added ?v=1 to bypass aggressive browser caching that might prevent new images from showing
  const images = ['/login_bg.png?v=1', '/login_bg_2.png?v=1', '/login_bg_3.png?v=1']

  React.useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex(prev => (prev + 1) % images.length)
    }, 3500) // Sped up to 3.5 seconds so it's immediately obvious
    return () => clearInterval(timer)
  }, [images.length])

  // ── Left panel content changes based on tab/role ─────────────────────────
  const leftPanels = {
    login: {
      title: 'Welcome Back!',
      desc: 'Your trusted real estate partner in Pune. Log in to access exclusive property listings and personalised services.',
      benefits: ['Browse 1000+ verified properties', 'No brokerage — always', 'Free site visits', '100% loan assistance', 'Secure & trusted platform'],
    },
    chooseRole: {
      title: 'Join Our Platform',
      desc: "Choose your role to get a personalised experience. Whether you own a property or looking for one — we've got you covered.",
      benefits: ['Landlord: List & manage your properties', 'Tenant: Find the perfect home', 'Buyer: Explore investment options', 'Free registration', '24/7 support'],
    },
    landlord: {
      title: '🏢 Landlord Benefits',
      desc: 'List your property and reach thousands of verified buyers and tenants across Pune — for free.',
      benefits: ['Free property listing', 'Reach 10,000+ active seekers', 'No commission on deals', 'Professional photo support', 'Dedicated relationship manager'],
    },
    tenant: {
      title: '🔑 Tenant / Buyer Benefits',
      desc: 'Find your dream home with zero brokerage and get free site visits arranged by our team.',
      benefits: ['Zero brokerage — always', '1000+ verified listings', 'Free site visits arranged', '100% home loan assistance', 'Instant callback support'],
    },
  }

  // Which left panel to show
  const [leftKey, setLeftKey] = useState('login')
  const panel = leftPanels[leftKey] || leftPanels.login

  return (
    <div className={styles.pageWrap}>

      {/* ── Left branding panel ── */}
      <div className={styles.leftPanel}>
        {/* Background Slider */}
        {images.map((img, idx) => (
          <div 
            key={idx}
            className={styles.bgSlide}
            style={{
              backgroundImage: `url('${img}')`,
              opacity: bgIndex === idx ? 1 : 0
            }}
          />
        ))}
        <div className={styles.bgOverlay} />

        {/* Content */}
        <div className={styles.leftContent}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <img src="/logo.png" alt="Sai Reality Logo" style={{ height: '85px', objectFit: 'contain' }} />
          </div>
          <h2 className={styles.leftTitle}>{panel.title}</h2>
          <p className={styles.leftDesc}>{panel.desc}</p>
        <ul className={styles.benefits}>
          {panel.benefits.map((b, i) => (
            <li key={i}><i className="fa fa-check-circle" /><span>{b}</span></li>
          ))}
        </ul>
        <div className={styles.contactInfo}>
          <p><i className="fa fa-phone" /> +91 9222445513 | +91 9320072003</p>
          <p><i className="fa fa-envelope" /> support@saireality.in</p>
        </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
              onClick={switchToLogin}
              type="button"
            >
              <i className="fa fa-sign-in-alt" /> Login
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'register' ? styles.tabActive : ''}`}
              onClick={switchToRegister}
              type="button"
            >
              <i className="fa fa-user-plus" /> Register
            </button>
          </div>

          {/* Alert message */}
          {message && (
            <div className={message.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
              <i className={message.type === 'success' ? 'fa fa-check-circle' : 'fa fa-exclamation-circle'} />
              {' '}{message.text}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {activeTab === 'login' && (
            <LoginForm
              setMessage={setMessage}
              navigate={navigate}
              setLeftKey={setLeftKey}
              switchToRegister={switchToRegister}
            />
          )}

          {/* ── REGISTER SECTION ── */}
          {activeTab === 'register' && (
            <RegisterSection
              setMessage={setMessage}
              setLeftKey={setLeftKey}
              switchToLogin={switchToLogin}
              navigate={navigate}
            />
          )}

        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LOGIN FORM
═══════════════════════════════════════════════════════════ */
function LoginForm({ setMessage, navigate, setLeftKey, switchToRegister }) {
  const [username, setUsername]       = useState('')
  const [password, setPassword]       = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [loading, setLoading]         = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'Please enter both username and password.' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res  = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message })
        sessionStorage.setItem('cp_logged_in', 'true')
        sessionStorage.setItem('cp_user', username.trim())
        setTimeout(() => navigate('/home'), 1200)
      } else {
        const msg = data.detail?.message || data.message || 'Invalid username or password'
        setMessage({ type: 'error', text: msg })
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot connect to the server. Please make sure the backend is running.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4 className={styles.formHeading}>Welcome Back <span>👋</span></h4>
      <p className={styles.formSub}>Login as Landlord or Tenant – same form for both.</p>

      <form onSubmit={handleSubmit} noValidate>
        <FormField id="login-user" label="Username *" icon="fa-user">
          <input
            id="login-user" type="text" className={styles.input}
            placeholder="Enter your username"
            value={username} onChange={e => setUsername(e.target.value)}
            autoComplete="username" disabled={loading}
          />
        </FormField>

        <FormField id="login-pass" label="Password *" icon="fa-lock">
          <input
            id="login-pass" type={showPass ? 'text' : 'password'} className={styles.input}
            placeholder="Enter your password"
            value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password" disabled={loading}
          />
          <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(v => !v)} tabIndex={-1}>
            <i className={showPass ? 'fa fa-eye-slash' : 'fa fa-eye'} />
          </button>
        </FormField>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <><span className={styles.spinner} /> Logging in…</> : <><i className="fa fa-sign-in-alt" /> Login to Account</>}
        </button>

        <div className={styles.divider}><span>or continue with</span></div>
        <div className={styles.socialBtns}>
          <button type="button" className={styles.socialBtn}><i className="fab fa-google" style={{color:'#ea4335'}} /> Google</button>
          <button type="button" className={styles.socialBtn}><i className="fab fa-facebook-f" style={{color:'#1877f2'}} /> Facebook</button>
        </div>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <button type="button" className={styles.linkBtn} onClick={switchToRegister}>Register here</button>
        </p>
      </form>

      <p className={styles.hint}>
        <i className="fa fa-info-circle" /> Use <strong>admin</strong> / <strong>admin123</strong> to log in.
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   REGISTER SECTION (Step 1: choose role → Step 2: form)
═══════════════════════════════════════════════════════════ */
function RegisterSection({ setMessage, setLeftKey, switchToLogin, navigate }) {
  // 'chooseRole' | 'landlord' | 'tenant'
  const [regStep, setRegStep] = useState('chooseRole')
  const [selectedRole, setSelectedRole] = useState(null)

  const selectRole = (role) => {
    setSelectedRole(role)
    setLeftKey(role)
  }

  const proceed = () => {
    if (!selectedRole) return
    setRegStep(selectedRole)
    setLeftKey(selectedRole)
  }

  const goBack = () => {
    setRegStep('chooseRole')
    setLeftKey('chooseRole')
    setSelectedRole(null)
    setMessage(null)
  }

  return (
    <div>
      {/* ── Step 1: Choose Role ── */}
      {regStep === 'chooseRole' && (
        <div>
          <h4 className={styles.formHeading}>Create Account <span>🏠</span></h4>
          <p className={styles.formSub}>Choose your role to get started with the right experience.</p>

          <p className={styles.roleLabel}>I am a…</p>
          <div className={styles.roleCards}>
            {/* Landlord card */}
            <div
              className={`${styles.roleCard} ${styles.landlordCard} ${selectedRole === 'landlord' ? styles.roleSelected : ''}`}
              onClick={() => selectRole('landlord')}
            >
              {selectedRole === 'landlord' && <span className={styles.checkBadge}><i className="fa fa-check" /></span>}
              <div className={`${styles.roleIcon} ${styles.landlordIcon}`}><i className="fa fa-building" /></div>
              <h6>Landlord</h6>
              <p>I have a property and want to list it for sale or rent</p>
            </div>

            {/* Tenant card */}
            <div
              className={`${styles.roleCard} ${styles.tenantCard} ${selectedRole === 'tenant' ? styles.roleSelected : ''}`}
              onClick={() => selectRole('tenant')}
            >
              {selectedRole === 'tenant' && <span className={styles.checkBadgeTenant}><i className="fa fa-check" /></span>}
              <div className={`${styles.roleIcon} ${styles.tenantIcon}`}><i className="fa fa-user" /></div>
              <h6>Tenant / Buyer</h6>
              <p>I'm looking for a property to buy, rent or lease</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.submitBtn}
            onClick={proceed}
            disabled={!selectedRole}
            style={!selectedRole ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            Continue <i className="fa fa-arrow-right" />
          </button>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <button type="button" className={styles.linkBtn} onClick={switchToLogin}>Login here</button>
          </p>
        </div>
      )}

      {/* ── Step 2A: Landlord Form ── */}
      {regStep === 'landlord' && (
        <LandlordForm
          setMessage={setMessage}
          goBack={goBack}
          switchToLogin={switchToLogin}
          navigate={navigate}
        />
      )}

      {/* ── Step 2B: Tenant Form ── */}
      {regStep === 'tenant' && (
        <TenantForm
          setMessage={setMessage}
          goBack={goBack}
          switchToLogin={switchToLogin}
          navigate={navigate}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LANDLORD REGISTRATION FORM
═══════════════════════════════════════════════════════════ */
function LandlordForm({ setMessage, goBack, switchToLogin, navigate }) {
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    propertyType: '', numProperties: '', location: '', purpose: '',
    password: '', confirmPassword: '', terms: false,
  })
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.email || !form.propertyType || !form.password) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' }); return
    }
    if (form.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' }); return
    }
    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' }); return
    }
    if (!form.terms) {
      setMessage({ type: 'error', text: 'Please accept the Terms & Conditions.' }); return
    }
    setLoading(true); setMessage(null)
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName, phone: form.phone, email: form.email,
          role: 'Landlord', property_type: form.propertyType,
          num_properties: form.numProperties, location: form.location,
          purpose: form.purpose, password: form.password,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '✅ Landlord account created! Redirecting to login…' })
        setTimeout(() => { switchToLogin(); setMessage(null) }, 2000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed. Please try again.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot connect to the server.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className={styles.roleBadge} style={{ background: '#fdf0ff', color: '#e244ee', border: '1px solid #e244ee' }}>
        <i className="fa fa-building" /> Registering as Landlord
        <button type="button" className={styles.backLink} onClick={goBack}>← Change</button>
      </div>
      <h4 className={styles.formHeading}>Landlord Registration</h4>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.row2}>
          <FormField label="Full Name *" icon="fa-user">
            <input type="text" className={styles.input} placeholder="Your full name" value={form.fullName} onChange={set('fullName')} disabled={loading} />
          </FormField>
          <FormField label="Phone Number *" icon="fa-phone">
            <input type="tel" className={styles.input} placeholder="10-digit mobile number" maxLength={10} value={form.phone} onChange={set('phone')} disabled={loading} />
          </FormField>
        </div>

        <FormField label="Email Address *" icon="fa-envelope">
          <input type="email" className={styles.input} placeholder="Enter your email address" value={form.email} onChange={set('email')} disabled={loading} />
        </FormField>

        <div className={styles.row2}>
          <FormField label="Property Type *" icon="fa-home">
            <select className={styles.input} value={form.propertyType} onChange={set('propertyType')} disabled={loading}>
              <option value="">Select property type</option>
              <option>Residential Apartment</option>
              <option>Commercial Space</option>
              <option>Commercial Shop</option>
              <option>Bungalow</option>
              <option>Open Plot / Land</option>
              <option>Multiple Types</option>
            </select>
          </FormField>
          <FormField label="No. of Properties *" icon="fa-layer-group">
            <select className={styles.input} value={form.numProperties} onChange={set('numProperties')} disabled={loading}>
              <option value="">How many properties?</option>
              <option>1</option><option>2 – 5</option><option>6 – 10</option><option>10+</option>
            </select>
          </FormField>
        </div>

        <div className={styles.row2}>
          <FormField label="Property Location *" icon="fa-location-dot">
            <select className={styles.input} value={form.location} onChange={set('location')} disabled={loading}>
              <option value="">Select location</option>
              <option>Lohegaon</option><option>Kharadi</option><option>Dhanori</option>
              <option>Wagholi</option><option>Viman Nagar</option><option>Hadapsar</option>
              <option>Hinjewadi</option><option>Kalyani Nagar</option><option>Other</option>
            </select>
          </FormField>
          <FormField label="Purpose *" icon="fa-bullseye">
            <select className={styles.input} value={form.purpose} onChange={set('purpose')} disabled={loading}>
              <option value="">Sell / Rent / Both</option>
              <option>Sell Only</option><option>Rent Only</option><option>Both Sell & Rent</option>
            </select>
          </FormField>
        </div>

        <div className={styles.row2}>
          <FormField label="Password *" icon="fa-lock">
            <input type={showPass ? 'text' : 'password'} className={styles.input} placeholder="Min 6 characters" value={form.password} onChange={set('password')} disabled={loading} />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(v => !v)} tabIndex={-1}>
              <i className={showPass ? 'fa fa-eye-slash' : 'fa fa-eye'} />
            </button>
          </FormField>
          <FormField label="Confirm Password *" icon="fa-lock">
            <input type={showConf ? 'text' : 'password'} className={styles.input} placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} disabled={loading} />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowConf(v => !v)} tabIndex={-1}>
              <i className={showConf ? 'fa fa-eye-slash' : 'fa fa-eye'} />
            </button>
          </FormField>
        </div>

        <div className={styles.checkRow}>
          <input type="checkbox" id="lTerms" checked={form.terms} onChange={set('terms')} disabled={loading} />
          <label htmlFor="lTerms">
            I agree to the <a href="#" className={styles.magentaLink}>Terms & Conditions</a> and confirm all my property details are genuine.
          </label>
        </div>

        <button type="submit" className={`${styles.submitBtn} ${styles.magentaBtn}`} disabled={loading}>
          {loading ? <><span className={styles.spinner} /> Registering…</> : <><i className="fa fa-building" /> Register as Landlord</>}
        </button>
      </form>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TENANT / BUYER REGISTRATION FORM
═══════════════════════════════════════════════════════════ */
function TenantForm({ setMessage, goBack, switchToLogin, navigate }) {
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    lookingFor: '', propertyType: '', location: '', budget: '',
    password: '', confirmPassword: '', terms: false,
  })
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.email || !form.password) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' }); return
    }
    if (form.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' }); return
    }
    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' }); return
    }
    if (!form.terms) {
      setMessage({ type: 'error', text: 'Please accept the Terms & Conditions.' }); return
    }
    setLoading(true); setMessage(null)
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName, phone: form.phone, email: form.email,
          role: 'Tenant', looking_for: form.lookingFor,
          property_type: form.propertyType, location: form.location,
          budget: form.budget, password: form.password,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '✅ Account created successfully! Redirecting to login…' })
        setTimeout(() => { switchToLogin(); setMessage(null) }, 2000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed. Please try again.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot connect to the server.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className={styles.roleBadge} style={{ background: '#fff0f0', color: '#dc3545', border: '1px solid #dc3545' }}>
        <i className="fa fa-user" /> Registering as Tenant / Buyer
        <button type="button" className={styles.backLink} onClick={goBack}>← Change</button>
      </div>
      <h4 className={styles.formHeading}>Tenant / Buyer Registration</h4>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.row2}>
          <FormField label="Full Name *" icon="fa-user">
            <input type="text" className={styles.input} placeholder="Your full name" value={form.fullName} onChange={set('fullName')} disabled={loading} />
          </FormField>
          <FormField label="Phone Number *" icon="fa-phone">
            <input type="tel" className={styles.input} placeholder="10-digit mobile number" maxLength={10} value={form.phone} onChange={set('phone')} disabled={loading} />
          </FormField>
        </div>

        <FormField label="Email Address *" icon="fa-envelope">
          <input type="email" className={styles.input} placeholder="Enter your email address" value={form.email} onChange={set('email')} disabled={loading} />
        </FormField>

        <div className={styles.row2}>
          <FormField label="Looking For *" icon="fa-search">
            <select className={styles.input} value={form.lookingFor} onChange={set('lookingFor')} disabled={loading}>
              <option value="">Buy / Rent / Lease</option>
              <option>Buy</option><option>Rent</option><option>Lease</option>
            </select>
          </FormField>
          <FormField label="Property Type *" icon="fa-home">
            <select className={styles.input} value={form.propertyType} onChange={set('propertyType')} disabled={loading}>
              <option value="">Select type</option>
              <option>1 BHK Apartment</option><option>2 BHK Apartment</option>
              <option>3 BHK Apartment</option><option>4 BHK Apartment</option>
              <option>Commercial Space</option><option>Shop / Showroom</option>
              <option>Bungalow</option><option>Plot / Land</option>
            </select>
          </FormField>
        </div>

        <div className={styles.row2}>
          <FormField label="Preferred Location *" icon="fa-location-dot">
            <select className={styles.input} value={form.location} onChange={set('location')} disabled={loading}>
              <option value="">Select location</option>
              <option>Lohegaon</option><option>Kharadi</option><option>Dhanori</option>
              <option>Wagholi</option><option>Viman Nagar</option><option>Hadapsar</option>
              <option>Hinjewadi</option><option>Kalyani Nagar</option><option>Any Location</option>
            </select>
          </FormField>
          <FormField label="Budget (₹) *" icon="fa-indian-rupee-sign">
            <select className={styles.input} value={form.budget} onChange={set('budget')} disabled={loading}>
              <option value="">Select budget</option>
              <option>Below ₹10,000/mo</option><option>₹10,000 – ₹20,000/mo</option>
              <option>₹20,000 – ₹40,000/mo</option><option>₹40,000 – ₹70,000/mo</option>
              <option>Above ₹70,000/mo</option><option>Below ₹30 Lakhs</option>
              <option>₹30 – ₹60 Lakhs</option><option>₹60 L – ₹1 Cr</option>
              <option>Above ₹1 Cr</option>
            </select>
          </FormField>
        </div>

        <div className={styles.row2}>
          <FormField label="Password *" icon="fa-lock">
            <input type={showPass ? 'text' : 'password'} className={styles.input} placeholder="Min 6 characters" value={form.password} onChange={set('password')} disabled={loading} />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(v => !v)} tabIndex={-1}>
              <i className={showPass ? 'fa fa-eye-slash' : 'fa fa-eye'} />
            </button>
          </FormField>
          <FormField label="Confirm Password *" icon="fa-lock">
            <input type={showConf ? 'text' : 'password'} className={styles.input} placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} disabled={loading} />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowConf(v => !v)} tabIndex={-1}>
              <i className={showConf ? 'fa fa-eye-slash' : 'fa fa-eye'} />
            </button>
          </FormField>
        </div>

        <div className={styles.checkRow}>
          <input type="checkbox" id="tTerms" checked={form.terms} onChange={set('terms')} disabled={loading} />
          <label htmlFor="tTerms">
            I agree to the <a href="#" className={styles.magentaLink}>Terms & Conditions</a>
          </label>
        </div>

        <button type="submit" className={`${styles.submitBtn} ${styles.redBtn}`} disabled={loading}>
          {loading ? <><span className={styles.spinner} /> Registering…</> : <><i className="fa fa-user" /> Register as Tenant / Buyer</>}
        </button>
      </form>
    </div>
  )
}

/* ── Reusable FormField wrapper ─────────────────────────── */
function FormField({ id, label, icon, children }) {
  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.inputIcon}><i className={`fa ${icon}`} /></span>}
        {children}
      </div>
    </div>
  )
}

export default Login
