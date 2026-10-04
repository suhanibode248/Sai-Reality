// =========================================================
//  Certified Properties – main.js
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

    /* -------------------------------------------------------
       1. Popup Callback Modal – shows after 4s (once per session)
    ------------------------------------------------------- */
    const callbackModal = document.getElementById('callbackModal');
    if (callbackModal && !sessionStorage.getItem('modalShown')) {
        setTimeout(function () {
            const bsModal = new bootstrap.Modal(callbackModal);
            bsModal.show();
            sessionStorage.setItem('modalShown', '1');
        }, 4000);
    }

    /* -------------------------------------------------------
       2. Login / Register Toggle  (login.html)
    ------------------------------------------------------- */
    const loginTab    = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm   = document.getElementById('loginFormSection');
    const regForm     = document.getElementById('registerFormSection');

    function showLogin() {
        if (!loginForm || !regForm) return;
        loginForm.classList.remove('d-none');
        regForm.classList.add('d-none');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    }
    function showRegister() {
        if (!loginForm || !regForm) return;
        regForm.classList.remove('d-none');
        loginForm.classList.add('d-none');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
    if (loginTab)    loginTab.addEventListener('click', showLogin);
    if (registerTab) registerTab.addEventListener('click', showRegister);

    /* -------------------------------------------------------
       3. Mock Auth – localStorage login state
    ------------------------------------------------------- */
    const loginFormEl = document.getElementById('mockLoginForm');
    const regFormEl   = document.getElementById('mockRegisterForm');
    updateNavAuth();

    if (loginFormEl) {
        loginFormEl.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = loginFormEl.querySelector('input[type="email"]').value.trim();
            const pass  = loginFormEl.querySelector('input[type="password"]').value;
            if (!email || !pass) { showAlert(loginFormEl, 'Please fill in all fields.', 'danger'); return; }
            // Simple mock check – any valid email+password works
            const name = email.split('@')[0];
            localStorage.setItem('cp_user', JSON.stringify({ name, email }));
            showAlert(loginFormEl, 'Login successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1400);
        });
    }

    if (regFormEl) {
        regFormEl.addEventListener('submit', function (e) {
            e.preventDefault();
            const inputs = regFormEl.querySelectorAll('input');
            const name  = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const phone = inputs[2].value.trim();
            const pass  = inputs[3].value;
            const conf  = inputs[4].value;
            if (!name || !email || !phone || !pass) { showAlert(regFormEl, 'Please fill in all fields.', 'danger'); return; }
            if (pass !== conf)  { showAlert(regFormEl, 'Passwords do not match.', 'danger'); return; }
            if (pass.length < 6){ showAlert(regFormEl, 'Password must be at least 6 characters.', 'warning'); return; }
            localStorage.setItem('cp_user', JSON.stringify({ name, email }));
            showAlert(regFormEl, 'Account created! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1400);
        });
    }

    // Logout button
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('cp_user');
            window.location.href = 'login.html';
        });
    });

    function updateNavAuth() {
        const userStr = localStorage.getItem('cp_user');
        const loginLinks  = document.querySelectorAll('.nav-login-link');
        const logoutWraps = document.querySelectorAll('.nav-user-wrap');
        const userNameEls = document.querySelectorAll('.nav-user-name');
        if (userStr) {
            const user = JSON.parse(userStr);
            loginLinks.forEach(el  => el.classList.add('d-none'));
            logoutWraps.forEach(el => el.classList.remove('d-none'));
            userNameEls.forEach(el => el.textContent = user.name);
        } else {
            loginLinks.forEach(el  => el.classList.remove('d-none'));
            logoutWraps.forEach(el => el.classList.add('d-none'));
        }
    }

    function showAlert(formEl, msg, type) {
        let existing = formEl.querySelector('.form-alert');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'alert alert-' + type + ' form-alert mt-3 py-2 px-3';
        div.style.fontSize = '14px';
        div.textContent = msg;
        formEl.appendChild(div);
    }

    /* -------------------------------------------------------
       4. Animated Counters
    ------------------------------------------------------- */
    const counters = document.querySelectorAll('.counter-num');
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el  = entry.target;
                const end = parseInt(el.getAttribute('data-target'));
                let cur = 0;
                const step = Math.ceil(end / 60);
                const timer = setInterval(() => {
                    cur += step;
                    if (cur >= end) { cur = end; clearInterval(timer); }
                    el.textContent = cur.toLocaleString();
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));

    /* -------------------------------------------------------
       5. Back to Top Button
    ------------------------------------------------------- */
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function () {
            backBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* -------------------------------------------------------
       6. Smooth scroll for anchor links
    ------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* -------------------------------------------------------
       7. Properties Filter (properties.html)
    ------------------------------------------------------- */
    const filterForm = document.getElementById('propertyFilterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Visual feedback – in a real app this would filter cards
            const cards = document.querySelectorAll('.prop-card');
            cards.forEach(c => {
                c.closest('.prop-col').style.opacity = '0.4';
                setTimeout(() => c.closest('.prop-col').style.opacity = '1', 600);
            });
        });
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) resetBtn.addEventListener('click', () => filterForm.reset());
    }

    /* -------------------------------------------------------
       8. Navbar active link highlight
    ------------------------------------------------------- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-navbar .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });

    /* -------------------------------------------------------
       9. Property Filtering (properties.html)
    ------------------------------------------------------- */
    if (window.location.pathname.includes('properties.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query') ? urlParams.get('query').toLowerCase() : null;
        const type = urlParams.get('type') ? urlParams.get('type').toLowerCase() : null;
        
        const propCards = document.querySelectorAll('.prop-col');
        let count = 0;
        
        propCards.forEach(col => {
            const card = col.querySelector('.prop-card');
            if (!card) return;
            const title = (card.querySelector('.prop-title') ? card.querySelector('.prop-title').innerText : '').toLowerCase();
            const text = (card.querySelector('.card-body') ? card.querySelector('.card-body').innerText : '').toLowerCase();
            
            let match = true;
            
            if (query && !title.includes(query) && !text.includes(query)) {
                match = false;
            }
            if (type && !title.includes(type) && !text.includes(type)) {
                match = false;
            }
            
            if (match) {
                col.style.display = 'block';
                count++;
            } else {
                col.style.display = 'none';
            }
        });
        
        const grid = document.querySelector('.row.g-4');
        if (count === 0 && grid) {
            const msg = document.createElement('div');
            msg.className = 'col-12 text-center py-5 no-props-msg';
            msg.innerHTML = '<h4>No properties found matching your criteria.</h4>';
            grid.appendChild(msg);
        }
    }

});
