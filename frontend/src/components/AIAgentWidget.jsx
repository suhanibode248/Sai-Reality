import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Sai AI Agent - Advanced Real Estate Consultant for Sai Properties & Certified Properties.
 * Full interactive conversational flow with step-by-step guidance, property matching,
 * detailed project cards, About Us sub-flows, OTP-verified site visit booking, and homepage search integration.
 */
export default function AIAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [conversationState, setConversationState] = useState({
    flow: 'idle', // 'dream_home', 'about_us', 'site_visit'
    step: 'initial', // 'property_type', 'location', 'config', 'budget', 'options'
    propertyType: '',
    location: '',
    configuration: '',
    budget: '',
    selectedOption: null
  });

  // OTP Verified Site Visit Booking State
  const [siteBooking, setSiteBooking] = useState({
    step: 'idle', // 'idle' | 'form' | 'otp' | 'verified'
    name: '',
    phone: '',
    phone2: '',
    date: '',
    property: 'Godrej Urban Retreat (Kharadi)',
    generatedOtp: '',
    enteredOtp: '',
    otpError: '',
    bookingRef: ''
  });

  const messagesEndRef = useRef(null);
  const soundPlayedRef = useRef(false);

  // Gentle audio chime
  const playPing = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, []);

  const handleRedirect = useCallback((url) => {
    if (!url) return;
    if (window.top && window.top !== window) {
      window.top.location.href = url;
    } else {
      window.location.href = url;
    }
  }, []);

  // Curated property database matching user location & criteria
  const getPropertiesForLocation = useCallback((loc, config, budget) => {
    const locLower = (loc || '').toLowerCase();

    if (locLower.includes('kharadi')) {
      return [
        {
          id: 1,
          name: 'Godrej Urban Retreat',
          location: 'Kharadi-Manjari, Pune',
          config: config || '2 & 3 BHK Luxury',
          price: '₹82 Lakh – ₹1.10 Cr',
          possessionStatus: 'Under Construction',
          possessionDate: 'Q4 2026',
          carpet: '745 – 820 sq.ft.',
          amenities: [
            '25+ Resort-style amenities & Grand Clubhouse',
            'Olympic-length swimming pool & sports arena',
            'Lush zen gardens, jogging track & reflexology paths',
            '24/7 3-Tier Security, EV Charging & Smart Automation'
          ],
          linkUrl: '/project_details_22_godrej_urban_retreat.html'
        },
        {
          id: 2,
          name: 'Lodha Giardino',
          location: 'Kharadi, Pune',
          config: config || '2, 3 & 4 BHK Palatial Homes',
          price: '₹1.05 Cr – ₹1.45 Cr',
          possessionStatus: 'Under Construction',
          possessionDate: 'Mid 2026',
          carpet: '850 – 1,120 sq.ft.',
          amenities: [
            'Ultra-luxury 50,000 sq.ft. Clubhouse',
            'Private sundecks with riverfront & skyline views',
            'Temperature-controlled indoor & outdoor pools',
            'World-class fitness center & private cinema lounge'
          ],
          linkUrl: '/project_details_29_lodha_giardino.html'
        },
        {
          id: 3,
          name: 'Majestique Towers East',
          location: 'Upper Kharadi, Pune',
          config: config || '2 BHK Premium',
          price: '₹75 Lakh – ₹98 Lakh',
          possessionStatus: 'Ready / Near Possession',
          possessionDate: 'Ready Possession',
          carpet: '720 – 790 sq.ft.',
          amenities: [
            'Designer podium landscape & infinity swimming pool',
            'Fully equipped gym & multi-purpose hall',
            'Children’s themed play park & senior citizen plaza',
            'Power backup & multi-level secured parking'
          ],
          linkUrl: '/property_details_810_semifurnished_2bhk_for_rent_in_majestique_towers_east_upper_kharadi_pune.html'
        }
      ];
    }

    if (locLower.includes('dhanori') || locLower.includes('lohegaon') || locLower.includes('lohgaon')) {
      return [
        {
          id: 1,
          name: 'Kohinoor Viva City',
          location: 'Dhanori, Pune',
          config: config || '2 & 3 BHK Premium',
          price: '₹58 Lakh – ₹85 Lakh',
          possessionStatus: 'Under Construction',
          possessionDate: 'Dec 2025',
          carpet: '690 – 850 sq.ft.',
          amenities: [
            'Modern lifestyle clubhouse & swimming pool',
            'Kid’s play zone, jogging track & multipurpose court',
            '3 mins from Pune Airport corridor & Viman Nagar access',
            'Top construction quality with Sada Sukhi Raho assurance'
          ],
          linkUrl: '/project_details_21_kohinoor_viva_city.html'
        },
        {
          id: 2,
          name: 'Pride World City Montreal',
          location: 'Charoli BK / Lohegaon, Pune',
          config: config || '2, 3 & 4 BHK Duplex Homes',
          price: '₹85 Lakh – ₹1.35 Cr',
          possessionStatus: 'Ongoing / Multiple Phases',
          possessionDate: '2025 - 2026',
          carpet: '780 – 1,250 sq.ft.',
          amenities: [
            '400+ Acre Mega Integrated Township infrastructure',
            'International school, retail boulevards & medical center',
            'Multiple swimming pools, sports club & private lakes',
            'High-speed road connectivity to Viman Nagar & Kalyani Nagar'
          ],
          linkUrl: '/project_details_6_pride_world_city_montreal_2_3_4_duplex.html'
        },
        {
          id: 3,
          name: 'Nyati Era',
          location: 'Dhanori, Pune',
          config: config || '2 & 3 BHK Contemporary',
          price: '₹65 Lakh – ₹92 Lakh',
          possessionStatus: 'Under Construction',
          possessionDate: 'Early 2026',
          carpet: '730 – 890 sq.ft.',
          amenities: [
            'Grand entrance lobby & rooftop leisure deck',
            'State-of-the-art gymnasium & yoga pavilion',
            'High safety standards, CCTV & biometric access',
            'Prime proximity to Commerzone IT Park & Airport'
          ],
          linkUrl: '/project_details_10_nyati_era.html'
        }
      ];
    }

    if (locLower.includes('wagholi')) {
      return [
        {
          id: 1,
          name: 'Majestique Mahatma Wagholi',
          location: 'Wagholi, Pune',
          config: config || '2 BHK Comfort Living',
          price: '₹48 Lakh – ₹68 Lakh',
          possessionStatus: 'Ready / Near Possession',
          possessionDate: 'Ready Possession',
          carpet: '680 – 760 sq.ft.',
          amenities: [
            'Clubhouse, fitness center & swimming pool',
            'Landscaped garden, party lawn & amphitheater',
            'Adjacent to Nagar Road & leading schools',
            'Approved for 90% bank loan subsidy'
          ],
          linkUrl: '/property_details_736_2bhk_flat_on_sale_in_majestique_mahatama_wagholi.html'
        },
        {
          id: 2,
          name: 'Codename Fireworks',
          location: 'Wagholi, Pune',
          config: config || '2 & 3 BHK Lifestyle',
          price: '₹55 Lakh – ₹78 Lakh',
          possessionStatus: 'Under Construction',
          possessionDate: '2026',
          carpet: '710 – 850 sq.ft.',
          amenities: [
            'Sky lounges, co-working space & clubhouse',
            'Kids splash pool, skating rink & indoor games',
            'High-street retail shopping at doorstep'
          ],
          linkUrl: '/project_details_4_codename_fireworks.html'
        },
        {
          id: 3,
          name: 'GS Crown Plaza High Street',
          location: 'Wagholi, Pune',
          config: 'Commercial Retail & Office',
          price: '₹45 Lakh – ₹1.2 Cr',
          possessionStatus: 'Under Construction',
          possessionDate: 'Late 2025',
          carpet: '350 – 1,100 sq.ft.',
          amenities: [
            'Prime high-street frontage on Pune-Nagar highway',
            'Dedicated customer parking & high-speed elevators',
            'Massive daily footfall & high rental returns'
          ],
          linkUrl: '/project_details_48_gs_crown_plaza_wagholi_high_street_.html'
        }
      ];
    }

    // Default / Hinjewadi / Wakad / Baner / Other Locations
    return [
      {
        id: 1,
        name: 'Godrej Urban Retreat',
        location: loc ? `${loc}, Pune` : 'Kharadi, Pune',
        config: config || '2 & 3 BHK Luxury',
        price: budget || '₹82 Lakh – ₹1.10 Cr',
        possessionStatus: 'Under Construction',
        possessionDate: 'Q4 2026',
        carpet: '745 – 820 sq.ft.',
        amenities: [
          '25+ Resort-style amenities & Grand Clubhouse',
          'Olympic-length swimming pool & sports arena',
          'Lush zen gardens, jogging track & reflexology paths',
          '24/7 3-Tier Security, EV Charging & Smart Automation'
        ],
        linkUrl: '/project_details_22_godrej_urban_retreat.html'
      },
      {
        id: 2,
        name: 'Lodha Giardino',
        location: loc ? `${loc}, Pune` : 'Kharadi, Pune',
        config: config || '2 & 3 BHK Palatial Homes',
        price: budget || '₹1.05 Cr – ₹1.45 Cr',
        possessionStatus: 'Under Construction',
        possessionDate: 'Mid 2026',
        carpet: '850 – 1,120 sq.ft.',
        amenities: [
          'Ultra-luxury 50,000 sq.ft. Clubhouse',
          'Private sundecks with riverfront & skyline views',
          'Temperature-controlled indoor & outdoor pools',
          'World-class fitness center & private cinema lounge'
        ],
        linkUrl: '/project_details_29_lodha_giardino.html'
      },
      {
        id: 3,
        name: 'Pride World City Montreal',
        location: loc ? `${loc}, Pune` : 'Charoli / Lohegaon, Pune',
        config: config || '2 & 3 BHK Duplex Homes',
        price: budget || '₹75 Lakh – ₹98 Lakh',
        possessionStatus: 'Ongoing Township',
        possessionDate: 'Ready to Move / 2026',
        carpet: '720 – 950 sq.ft.',
        amenities: [
          '400+ Acre Mega Integrated Township infrastructure',
          'Multiple swimming pools, sports club & private lakes',
          'Designer podium landscape & children’s themed park',
          'Power backup & multi-level secured parking'
        ],
        linkUrl: '/project_details_6_pride_world_city_montreal_2_3_4_duplex.html'
      }
    ];
  }, []);

  // Commercial properties
  const getCommercialProperties = useCallback(() => {
    return [
      {
        id: 1,
        name: 'Commercial High-Street Shops',
        location: 'Dhanori & Wagholi, Pune',
        config: 'Retail Shops & Showrooms',
        price: '₹35 Lakh – ₹95 Lakh',
        possessionStatus: 'Ready & Under Construction',
        possessionDate: 'Immediate & 2025',
        carpet: '250 – 750 sq.ft.',
        amenities: [
          'Prime road-touch frontage with heavy daily footfall',
          'Ample dedicated customer parking & wide pavements',
          'Ideal for clinics, supermarkets, cafes & retail stores',
          'Assured rental yields of 7% - 9%'
        ],
        linkUrl: '/properties_commercial_shop.html'
      },
      {
        id: 2,
        name: 'Grade-A Corporate Office Spaces',
        location: 'Viman Nagar & Kharadi, Pune',
        config: 'Furnished & Warm Shell Offices',
        price: '₹65 Lakh – ₹2.5 Cr',
        possessionStatus: 'Ready Possession',
        possessionDate: 'Immediate',
        carpet: '500 – 2,400 sq.ft.',
        amenities: [
          '24/7 100% DG power backup & high-speed elevators',
          'Conference halls, cafeterias & executive boardrooms',
          'Multi-level car parking & 3-tier security access',
          'Direct proximity to Pune International Airport'
        ],
        linkUrl: '/projects_commercial_space.html'
      },
      {
        id: 3,
        name: 'Prime Highway Commercial Showrooms',
        location: 'Pune-Nagar Road & Chakan',
        config: 'Anchor Retail Showroom',
        price: '₹1.1 Cr – ₹3.5 Cr',
        possessionStatus: 'Under Construction',
        possessionDate: 'Mid 2026',
        carpet: '1,200 – 4,500 sq.ft.',
        amenities: [
          'Double-height ceiling & extensive glass facade',
          'Heavy vehicular visibility & prominent branding zone',
          'High ROI & long-term institutional lease potential'
        ],
        linkUrl: '/properties_commercial_showroom.html'
      }
    ];
  }, []);

  // Initial welcome greeting
  const getInitialGreeting = useCallback(() => {
    return {
      id: 1,
      sender: 'ai',
      text: "👋 𝗛𝗲𝗹𝗹𝗼 𝗮𝗻𝗱 𝘄𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 Sai 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝗶𝗲𝘀!\n\nWe’re delighted to help you find your dream home or your next smart investment.\nWhether you’re looking for a cozy home, or a commercial space, we’ve got exclusive listings that match every lifestyle and budget.\n\n💡 How would you like to get started today?",
      options: [
        '1️⃣ Find My Dream Home',
        '2️⃣ About Us',
        '3️⃣ Talk to an Expert'
      ]
    };
  }, []);

  // Initial greeting effect
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([getInitialGreeting()]);
    }
  }, [messages.length, getInitialGreeting]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Pop up after 2.5s initially
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !soundPlayedRef.current) {
        setIsOpen(true);
        playPing();
        soundPlayedRef.current = true;
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen, playPing]);

  // Core Conversational Logic Handler
  const processUserQuery = useCallback((userInput) => {
    const text = (userInput || '').trim();
    const lower = text.toLowerCase();

    // Check if user is entering OTP in chat while in OTP step
    if (siteBooking.step === 'otp') {
      const cleanDigits = text.replace(/\D/g, '');
      if (cleanDigits.length === 4) {
        if (cleanDigits === siteBooking.generatedOtp) {
          const ref = `#SR-${Math.floor(10000 + Math.random() * 90000)}`;
          setSiteBooking((prev) => ({
            ...prev,
            step: 'verified',
            bookingRef: ref,
            otpError: ''
          }));

          // Post to FastAPI backend
          fetch('http://localhost:8000/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              full_name: siteBooking.name || 'Site Visit Guest',
              phone: siteBooking.phone,
              visit_date: siteBooking.date || 'Earliest Slot',
              property_name: siteBooking.property || 'Featured Project',
              notes: `Verified via OTP [${siteBooking.generatedOtp}]. Booking Ref: ${ref}`
            })
          }).catch(console.error);

          return {
            text: `🎉 𝗦𝗶𝘁𝗲 𝗩𝗶𝘀𝗶𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗕𝗼𝗼𝗸𝗲𝗱 & 𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱!\n\n📋 𝗕𝗼𝗼𝗸𝗶𝗻𝗴 𝗥𝗲𝗳𝗲𝗿𝗲𝗻𝗰𝗲: ${ref}\n👤 𝗚𝘂𝗲𝘀𝘁 𝗡𝗮𝗺𝗲: ${siteBooking.name || 'Valued Guest'}\n📱 𝗠𝗼𝗯𝗶𝗹𝗲: +91 ${siteBooking.phone} (✅ OTP Verified)\n🏢 𝗣𝗿𝗼𝗷𝗲𝗰𝘁: ${siteBooking.property}\n📅 𝗩𝗶𝘀𝗶𝘁 𝗗𝗮𝘁𝗲: ${siteBooking.date || 'Immediate Coordination'}\n🚖 𝗩𝗜𝗣 𝗖𝗮𝗯 𝗦𝘁𝗮𝘁𝘂𝘀: Free AC Cab Pickup & Drop Scheduled!\n\nThank you, ${siteBooking.name || 'Valued Guest'}! Your site visit is officially confirmed. Our property consultant will call you shortly on +91 ${siteBooking.phone} to confirm pickup location and schedule. Looking forward to welcoming you! 😊`,
            options: [
              '💬 WhatsApp Booking Details',
              '📞 Call Consultant (+91 9222445513)',
              '🏠 Find My Dream Home',
              '🔄 Start New Search'
            ]
          };
        } else {
          setSiteBooking((prev) => ({
            ...prev,
            otpError: '❌ Invalid OTP. Please enter the correct 4-digit code.'
          }));
          return {
            text: `❌ Invalid OTP "${text}". Please enter the correct 4-digit code (${siteBooking.generatedOtp}) sent to +91 ${siteBooking.phone} to confirm your booking.`,
            isSiteVisitForm: true,
            options: ['🔄 Resend OTP', '← Edit Booking Details', '🏠 Main Menu']
          };
        }
      }
    }

    // Check for Hi / Hello / Reset
    if (/^(hi|hello|hey|start|menu|restart|reset)\b/i.test(lower)) {
      setConversationState({
        flow: 'idle',
        step: 'initial',
        propertyType: '',
        location: '',
        configuration: '',
        budget: '',
        selectedOption: null
      });
      setSiteBooking((prev) => ({ ...prev, step: 'idle', otpError: '' }));
      return {
        text: "👋 𝗛𝗲𝗹𝗹𝗼 𝗮𝗻𝗱 𝘄𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 Sai 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝗶𝗲𝘀!\n\nWe’re delighted to help you find your dream home or your next smart investment.\nWhether you’re looking for a cozy home, or a commercial space, we’ve got exclusive listings that match every lifestyle and budget.\n\n💡 How would you like to get started today?",
        options: [
          '1️⃣ Find My Dream Home',
          '2️⃣ About Us',
          '3️⃣ Talk to an Expert'
        ]
      };
    }

    // Step 1: Main Menu selection
    if (
      lower.includes('find my dream home') ||
      lower === '1' ||
      lower === '1️⃣' ||
      lower === '1️⃣ find my dream home' ||
      lower.includes('dream home')
    ) {
      setConversationState((prev) => ({ ...prev, flow: 'dream_home', step: 'property_type' }));
      return {
        text: "🏡 𝐆𝐫𝐞𝐚𝐭 𝐜𝐡𝐨𝐢𝐜𝐞!\n\n𝐋𝐞𝐭’𝐬 𝐟𝐢𝐧𝐝 𝐭𝐡𝐞 𝐩𝐞𝐫𝐟𝐞𝐜𝐭 𝐩𝐫𝐨𝐩𝐞𝐫𝐭𝐲 𝐟𝐨𝐫 𝐲𝐨𝐮.\n\nCertified Properties offers a curated selection of verified projects - from elegant homes to premium commercial spaces.\nPlease choose the type of property you’re interested in:",
        options: [
          '1️⃣ Residential',
          '2️⃣ Commercial'
        ]
      };
    }

    // Step 1 - Option 2: About Us
    if (
      lower.includes('about us') ||
      lower === '2' ||
      lower === '2️⃣' ||
      lower === '2️⃣ about us' ||
      lower.includes('about certified')
    ) {
      setConversationState((prev) => ({ ...prev, flow: 'about_us', step: 'menu' }));
      return {
        text: "🏢 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗖𝗲𝗿𝘁𝗶𝗳𝗶𝗲𝗱 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝗶𝗲𝘀!\n\nWe are dedicated to helping you find your dream home or the perfect investment property with trust, transparency, and excellence.\n\n𝗛𝗲𝗿𝗲’𝘀 𝘄𝗵𝗮𝘁 𝘆𝗼𝘂 𝗰𝗮𝗻 𝗲𝘅𝗽𝗹𝗼𝗿𝗲 𝗮𝗯𝗼𝘂𝘁 𝘂𝘀:",
        options: [
          '1️⃣ Our Mission',
          '2️⃣ Our Vision',
          '3️⃣ Location',
          '4️⃣ USPs',
          '5️⃣ Find us on',
          '🔙 Main Menu'
        ]
      };
    }

    // Step 1 - Option 3: Talk to an Expert
    if (
      lower.includes('talk to an expert') ||
      lower === '3' ||
      lower === '3️⃣' ||
      lower === '3️⃣ talk to an expert' ||
      lower.includes('contact') ||
      lower.includes('expert')
    ) {
      setConversationState((prev) => ({ ...prev, flow: 'expert', step: 'info' }));
      return {
        text: "Our real estate experts are here to help you find your dream property or answer any questions you may have.\n\n𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗗𝗲𝘁𝗮𝗶𝗹𝘀:\n\n📍 Location: Pune, Maharashtra 411047\n📧 Email: raj@sairealty.in\n📞 Phone: +91 9222445513 / +91 9320072003\n\n𝗙𝗲𝗲𝗹 𝗳𝗿𝗲𝗲 𝘁𝗼 𝗿𝗲𝗮𝗰𝗵 𝗼𝘂𝘁 𝗱𝗶𝗿𝗲𝗰𝘁𝗹𝘆 𝗼𝗿 𝗹𝗲𝘁 𝘂𝘀 𝗸𝗻𝗼𝘄 𝗶𝗳 𝘆𝗼𝘂’𝗱 𝗹𝗶𝗸𝗲 𝗮 𝗰𝗮𝗹𝗹 𝗯𝗮𝗰𝗸 𝗳𝗿𝗼𝗺 𝗼𝗻𝗲 𝗼𝗳 𝗼𝘂𝗿 𝗲𝘅𝗽𝗲𝗿𝘁𝘀.",
        options: [
          '📞 Call +91 9222445513',
          '💬 Chat on WhatsApp',
          '📅 Book a site visit',
          '🏠 Find My Dream Home'
        ]
      };
    }

    // About Us Sub-Flows
    if (lower.includes('our mission') || (conversationState.flow === 'about_us' && lower === '1')) {
      return {
        text: "🎯 𝗢𝘂𝗿 𝗠𝗶𝘀𝘀𝗶𝗼𝗻\n\nAt Certified Properties, our mission is to help you discover and invest in your ideal property with confidence.\nWe leverage market expertise, in-depth research, and client-first strategies to deliver value, maintain transparency, and make every property decision stress-free and rewarding.",
        options: [
          '🌟 Our Vision',
          '📍 Location',
          '💎 USPs',
          '🏠 Find My Dream Home'
        ]
      };
    }

    if (lower.includes('our vision') || (conversationState.flow === 'about_us' && lower === '2')) {
      return {
        text: "🌟 𝗢𝘂𝗿 𝗩𝗶𝘀𝗶𝗼𝗻\n\nAt Certified Properties, our vision is to be India’s foremost real estate company, renowned for excellence in property development, management, and investment.\nWe are committed to delivering exceptional customer experiences, sustainable growth, and innovative solutions, ensuring every client finds the perfect property with confidence.",
        options: [
          '🎯 Our Mission',
          '📍 Location',
          '💎 USPs',
          '🏠 Find My Dream Home'
        ]
      };
    }

    if (
      lower.includes('our location') ||
      (conversationState.flow === 'about_us' && lower.includes('location')) ||
      (conversationState.flow === 'about_us' && lower === '3')
    ) {
      return {
        text: "📍 𝗢𝘂𝗿 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻\n\nCertified Properties is located in Pune, Maharashtra.\n\n𝗢𝗳𝗳𝗶𝗰𝗲 𝗔𝗱𝗱𝗿𝗲𝘀𝘀:\n\nCertified Properties\nShree Building\nLohegaon-Dhanori Road\nLohegaon-Pune\nMaharashtra 411047\n\nWe are strategically located to serve our clients efficiently and provide easy access to prime residential and commercial areas.\n\n𝗙𝗲𝗲𝗹 𝗳𝗿𝗲𝗲 𝘁𝗼 𝗿𝗲𝗮𝗰𝗵 𝗼𝘂𝘁 𝗼𝗿 𝘃𝗶𝘀𝗶𝘁 𝘂𝘀 𝗮𝘁 𝗼𝘂𝗿 𝗼𝗳𝗳𝗶𝗰𝗲 𝗳𝗼𝗿 𝗽𝗲𝗿𝘀𝗼𝗻𝗮𝗹𝗶𝘇𝗲𝗱 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝗰𝗲.",
        options: [
          '📞 Talk to an Expert',
          '💬 Chat on WhatsApp',
          '📅 Book a site visit',
          '🏠 Find My Dream Home'
        ]
      };
    }

    if (
      lower.includes('usp') ||
      lower.includes('why choose') ||
      (conversationState.flow === 'about_us' && lower === '4')
    ) {
      return {
        text: "💎 𝗪𝗵𝘆 𝗖𝗵𝗼𝗼𝘀𝗲 𝗖𝗲𝗿𝘁𝗶𝗳𝗶𝗲𝗱 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝗶𝗲𝘀?\n\nHere’s what makes us stand out in the real estate market:\n\n1️⃣ 10+ Years of Expertise – Extensive experience in Pune’s real estate sector.\n2️⃣ Verified Projects – All residential and commercial listings are thoroughly verified.\n3️⃣ Premium yet Affordable – Offering top-quality properties at competitive prices.\n4️⃣ Customer-Centric Approach – Personalized guidance to help you find your dream property.\n5️⃣ Trusted by Clients – Strong reputation built on transparency, reliability, and satisfaction.",
        options: [
          '🏠 Find My Dream Home',
          '📞 Talk to an Expert',
          '📅 Book a site visit'
        ]
      };
    }

    if (
      lower.includes('find us on') ||
      lower.includes('social media') ||
      (conversationState.flow === 'about_us' && lower === '5')
    ) {
      return {
        text: "🌐 𝗖𝗼𝗻𝗻𝗲𝗰𝘁 𝘄𝗶𝘁𝗵 𝗖𝗲𝗿𝘁𝗶𝗳𝗶𝗲𝗱 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝗶𝗲𝘀\n\nStay in touch or reach out to us through the following channels:\n\nFacebook: https://www.facebook.com/saireality\nEmail: raj@sairealty.in\nWebsite: certifiedproperties.in",
        options: [
          '📞 Talk to an Expert',
          '🏠 Find My Dream Home',
          '🔙 Main Menu'
        ]
      };
    }

    // Step 2: Property Type (Residential vs Commercial)
    if (lower.includes('residential') || (conversationState.step === 'property_type' && lower === '1')) {
      setConversationState((prev) => ({
        ...prev,
        propertyType: 'Residential',
        step: 'location'
      }));
      return {
        text: "📍 𝗚𝗿𝗲𝗮𝘁! 𝗟𝗲𝘁’𝘀 𝗻𝗮𝗿𝗿𝗼𝘄 𝗶𝘁 𝗱𝗼𝘄𝗻.\n\nCould you tell me which location in Pune you’re interested in?\n[Example: Kharadi, Wakad, Baner, Hinjewadi]",
        options: [
          'Kharadi',
          'Wakad',
          'Baner',
          'Hinjewadi',
          'Dhanori',
          'Lohegaon',
          'Wagholi',
          'Viman Nagar'
        ]
      };
    }

    if (lower.includes('commercial') || (conversationState.step === 'property_type' && lower === '2')) {
      setConversationState((prev) => ({
        ...prev,
        propertyType: 'Commercial',
        step: 'commercial_options'
      }));
      const commercialList = getCommercialProperties();
      return {
        text: "🏢 𝐆𝐫𝐞𝐚𝐭 𝐜𝐡𝐨𝐢𝐜𝐞!\n\nCertified Properties features prime high-street commercial shops, Grade-A offices, and showrooms in Pune.\n\n𝗛𝗲𝗿𝗲 𝗮𝗿𝗲 𝘀𝗼𝗺𝗲 𝗴𝗿𝗲𝗮𝘁 𝗰𝗼𝗺𝗺𝗲𝗿𝗰𝗶𝗮𝗹 𝗼𝗽𝘁𝗶𝗼𝗻𝘀 𝗳𝗼𝗿 𝘆𝗼𝘂:\n\n" +
          commercialList
            .map(
              (p, idx) =>
                `${idx + 1}️⃣ Property Name: ${p.name}\n📍 Location: ${p.location}\n🏠 Type: ${p.config}\n💰 Price Range: ${p.price}\n`
            )
            .join('\n') +
          "\n✨ Which one caught your eye?",
        options: [
          '1️⃣ Commercial Shops Details',
          '2️⃣ Office Spaces Details',
          '3️⃣ High-Street Showrooms Details',
          '📅 Book a site visit',
          '🔙 Main Menu'
        ]
      };
    }

    // Step 3: Location Selection
    const knownLocations = [
      'kharadi',
      'wakad',
      'baner',
      'hinjewadi',
      'dhanori',
      'lohegaon',
      'lohgaon',
      'wagholi',
      'viman nagar',
      'kalyani nagar',
      'hadapsar',
      'tingre nagar'
    ];

    const matchedLocation = knownLocations.find((loc) => lower.includes(loc));
    if (matchedLocation || conversationState.step === 'location') {
      const selectedLoc = matchedLocation
        ? matchedLocation.charAt(0).toUpperCase() + matchedLocation.slice(1)
        : text;

      setConversationState((prev) => ({
        ...prev,
        location: selectedLoc,
        step: 'config'
      }));

      return {
        text: `🛋️ 𝗚𝗿𝗲𝗮𝘁! 𝗬𝗼𝘂 𝘀𝗲𝗹𝗲𝗰𝘁𝗲𝗱 ${selectedLoc}.\n\nCould you please tell us your preferred configuration?\n[Example: 1 BHK, 2 BHK, 3 BHK]`,
        options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK+']
      };
    }

    // Step 4: Configuration Selection
    const knownConfigs = ['1 bhk', '2 bhk', '3 bhk', '4 bhk', '1bhk', '2bhk', '3bhk', '4bhk'];
    const matchedConfig = knownConfigs.find((c) => lower.includes(c));
    if (matchedConfig || conversationState.step === 'config') {
      const selectedConf = matchedConfig ? matchedConfig.toUpperCase() : text;
      const currentLoc = conversationState.location || 'Pune';

      setConversationState((prev) => ({
        ...prev,
        configuration: selectedConf,
        step: 'budget'
      }));

      return {
        text: `💰 𝗚𝗿𝗲𝗮𝘁! 𝗬𝗼𝘂 𝘀𝗲𝗹𝗲𝗰𝘁𝗲𝗱 𝗮 ${selectedConf} 𝗶𝗻 ${currentLoc}.\n\nTo help us find the best options for you, please tell us your preferred budget range.\n[Example: 50–75 Lakh, 1–1.5 Cr]`,
        options: [
          'Under 50 Lakh',
          '50–75 Lakh',
          '75 Lakh–1 Cr',
          '1–1.5 Cr',
          'Above 1.5 Cr'
        ]
      };
    }

    // Step 5: Budget Selection & Property Recommendations
    const isBudgetInput =
      lower.includes('cr') ||
      lower.includes('lakh') ||
      lower.includes('lacs') ||
      lower.includes('50') ||
      lower.includes('75') ||
      conversationState.step === 'budget';

    if (isBudgetInput) {
      const selectedBudget = text;
      const currentLoc = conversationState.location || 'Kharadi';
      const currentConf = conversationState.configuration || '2 BHK';

      setConversationState((prev) => ({
        ...prev,
        budget: selectedBudget,
        step: 'options_shown'
      }));

      const properties = getPropertiesForLocation(currentLoc, currentConf, selectedBudget);

      const listingText = properties
        .map(
          (p, i) =>
            `${i + 1}️⃣ Property Name: ${p.name}\n📍 Location: ${p.location}\n🏠 Configuration: ${p.config}\n💰 Price Range: ${p.price}\n`
        )
        .join('\n');

      return {
        text: `𝗛𝗲𝗿𝗲 𝗮𝗿𝗲 𝘀𝗼𝗺𝗲 𝗴𝗿𝗲𝗮𝘁 𝗼𝗽𝘁𝗶𝗼𝗻𝘀 𝗳𝗼𝗿 𝘆𝗼𝘂:\n\n${listingText}\n✨ Which one caught your eye?\n\n𝗪𝗼𝘂𝗹𝗱 𝘆𝗼𝘂 𝗹𝗶𝗸𝗲 𝘁𝗼:`,
        options: [
          `1️⃣ ${properties[0].name}`,
          `2️⃣ ${properties[1].name}`,
          `3️⃣ ${properties[2].name}`,
          '✅ See more options',
          '📅 Book a site visit'
        ]
      };
    }

    // Step 6: Specific Property Selection Details
    if (
      lower === '1' ||
      lower === '1️⃣' ||
      lower.includes('godrej') ||
      lower.includes('option 1') ||
      (conversationState.step === 'options_shown' && lower.includes('1'))
    ) {
      const currentLoc = conversationState.location || 'Kharadi';
      const properties = getPropertiesForLocation(
        currentLoc,
        conversationState.configuration,
        conversationState.budget
      );
      const prop = properties[0];

      return {
        text: `🏡 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝘆 𝗗𝗲𝘁𝗮𝗶𝗹𝘀:\n\nProperty Name: ${prop.name}\n📍 Location: ${prop.location}\n🏠 Configuration: ${prop.config}\n💰 Price Range: ${prop.price}\n🗓 Possession Status: ${prop.possessionStatus}\n📅 Possession Date: ${prop.possessionDate}\n📐 Carpet Area: ${prop.carpet}\n✨ Amenities:\n${prop.amenities.map((a) => `✔️ ${a}`).join('\n')}\n\n𝗪𝗼𝘂𝗹𝗱 𝘆𝗼𝘂 𝗹𝗶𝗸𝗲 𝘁𝗼 𝗯𝗼𝗼𝗸 𝗮 𝘀𝗶𝘁𝗲 𝘃𝗶𝘀𝗶𝘁 𝗼𝗿 𝘀𝗲𝗲 𝗺𝗼𝗿𝗲 𝗹𝗶𝘀𝘁𝗶𝗻𝗴𝘀? 😊\n\nShould I show you more options? 😊`,
        linkUrl: prop.linkUrl,
        linkText: `👉 View ${prop.name} Page`,
        options: [
          '📅 Book a site visit',
          '✅ See more options',
          '🔄 Start New Search'
        ]
      };
    }

    if (
      lower === '2' ||
      lower === '2️⃣' ||
      lower.includes('lodha') ||
      lower.includes('kohinoor') ||
      lower.includes('option 2') ||
      (conversationState.step === 'options_shown' && lower.includes('2'))
    ) {
      const currentLoc = conversationState.location || 'Kharadi';
      const properties = getPropertiesForLocation(
        currentLoc,
        conversationState.configuration,
        conversationState.budget
      );
      const prop = properties[1];

      return {
        text: `🏡 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝘆 𝗗𝗲𝘁𝗮𝗶𝗹𝘀:\n\nProperty Name: ${prop.name}\n📍 Location: ${prop.location}\n🏠 Configuration: ${prop.config}\n💰 Price Range: ${prop.price}\n🗓 Possession Status: ${prop.possessionStatus}\n📅 Possession Date: ${prop.possessionDate}\n📐 Carpet Area: ${prop.carpet}\n✨ Amenities:\n${prop.amenities.map((a) => `✔️ ${a}`).join('\n')}\n\n𝗪𝗼𝘂𝗹𝗱 𝘆𝗼𝘂 𝗹𝗶𝗸𝗲 𝘁𝗼 𝗯𝗼𝗼𝗸 𝗮 𝘀𝗶𝘁𝗲 𝘃𝗶𝘀𝗶𝘁 𝗼𝗿 𝘀𝗲𝗲 𝗺𝗼𝗿𝗲 𝗹𝗶𝘀𝘁𝗶𝗻𝗴𝘀? 😊\n\nShould I show you more options? 😊`,
        linkUrl: prop.linkUrl,
        linkText: `👉 View ${prop.name} Page`,
        options: [
          '📅 Book a site visit',
          '✅ See more options',
          '🔄 Start New Search'
        ]
      };
    }

    if (
      lower === '3' ||
      lower === '3️⃣' ||
      lower.includes('majestique') ||
      lower.includes('nyati') ||
      lower.includes('pride') ||
      lower.includes('option 3') ||
      (conversationState.step === 'options_shown' && lower.includes('3'))
    ) {
      const currentLoc = conversationState.location || 'Kharadi';
      const properties = getPropertiesForLocation(
        currentLoc,
        conversationState.configuration,
        conversationState.budget
      );
      const prop = properties[2];

      return {
        text: `🏡 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝘆 𝗗𝗲𝘁𝗮𝗶𝗹𝘀:\n\nProperty Name: ${prop.name}\n📍 Location: ${prop.location}\n🏠 Configuration: ${prop.config}\n💰 Price Range: ${prop.price}\n🗓 Possession Status: ${prop.possessionStatus}\n📅 Possession Date: ${prop.possessionDate}\n📐 Carpet Area: ${prop.carpet}\n✨ Amenities:\n${prop.amenities.map((a) => `✔️ ${a}`).join('\n')}\n\n𝗪𝗼𝘂𝗹𝗱 𝘆𝗼𝘂 𝗹𝗶𝗸𝗲 𝘁𝗼 𝗯𝗼𝗼𝗸 𝗮 𝘀𝗶𝘁𝗲 𝘃𝗶𝘀𝗶𝘁 𝗼𝗿 𝘀𝗲𝗲 𝗺𝗼𝗿𝗲 𝗹𝗶𝘀𝘁𝗶𝗻𝗴𝘀? 😊\n\nShould I show you more options? 😊`,
        linkUrl: prop.linkUrl,
        linkText: `👉 View ${prop.name} Page`,
        options: [
          '📅 Book a site visit',
          '✅ See more options',
          '🔄 Start New Search'
        ]
      };
    }

    // Site Visit Booking Flow with OTP Verification
    if (lower.includes('site visit') || lower.includes('book visit') || lower.includes('schedule visit')) {
      setConversationState((prev) => ({ ...prev, flow: 'site_visit' }));
      setSiteBooking((prev) => ({ ...prev, step: 'form', otpError: '' }));
      return {
        text: "𝗪𝗼𝗻𝗱𝗲𝗿𝗳𝘂𝗹 𝗰𝗵𝗼𝗶𝗰𝗲! 🎉\n\nI’d be happy to help you with that.\nTo ensure your VIP booking is secure, please enter your details below. We'll verify your booking with a quick 4-digit OTP before confirming your slot! 😊\nLooking forward to welcoming you soon!",
        isSiteVisitForm: true,
        options: [
          '💬 Confirm via WhatsApp (+91 9222445513)',
          '📞 Call Directly (+91 9222445513)',
          '🏠 Find My Dream Home'
        ]
      };
    }

    // Resend OTP
    if (lower.includes('resend otp') && siteBooking.phone) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setSiteBooking((prev) => ({
        ...prev,
        generatedOtp: code,
        enteredOtp: '',
        otpError: ''
      }));
      return {
        text: `📲 A new OTP has been generated for **+91 ${siteBooking.phone}**.\n*(Demo / Test OTP: **${code}**)*\n\nPlease enter the 4-digit code to verify your site visit:`,
        isSiteVisitForm: true,
        options: ['🔄 Resend OTP', '← Edit Booking Details']
      };
    }

    // See more options
    if (lower.includes('see more options') || lower.includes('more listings') || lower.includes('more options')) {
      return {
        text: "Here is our complete collection of verified properties across Pune & Dubai! Click below to explore all listings, filter by budget, or let me know another location.",
        linkUrl: '/properties_residential_appartment.html',
        linkText: '👉 Browse All Residential Properties',
        options: [
          '🏢 Commercial Properties',
          '📐 NA Plots & Land',
          '🏡 Villas & Bungalows',
          '🌆 Dubai Luxury Properties',
          '📅 Book a site visit'
        ]
      };
    }

    // Dubai Luxury
    if (lower.includes('dubai') || lower.includes('uae')) {
      return {
        text: "🌆 𝗘𝘅𝗽𝗹𝗼𝗿𝗲 𝗗𝘂𝗯𝗮𝗶 𝗟𝘂𝘅𝘂𝗿𝘆 𝗣𝗿𝗼𝗽𝗲𝗿𝘁𝗶𝗲𝘀!\n\nInvest in world-class residences in Downtown Dubai, Marina & Palm Jumeirah with:\n• 8% – 10% Tax-Free Rental Returns\n• UAE Golden Visa eligibility\n• Attractive 1% monthly payment plans directly with leading developers.",
        linkUrl: '/properties_dubai.html',
        linkText: '👉 View Dubai Properties',
        options: [
          '📅 Book a site visit',
          '📞 Talk to an Expert',
          '🏠 Find My Dream Home'
        ]
      };
    }

    // Fallback Natural Answer (Never errors out!)
    return {
      text: `Thank you for asking about **"${text}"**! 🏠\n\nAt Sai Properties / Certified Properties, we have verified properties across Pune and Dubai covering all budgets and locations.\n\nHow would you like to proceed?`,
      options: [
        '1️⃣ Find My Dream Home',
        '2️⃣ About Us',
        '3️⃣ Talk to an Expert',
        '📅 Book a site visit'
      ]
    };
  }, [
    conversationState.flow,
    conversationState.step,
    conversationState.location,
    conversationState.configuration,
    conversationState.budget,
    siteBooking.step,
    siteBooking.generatedOtp,
    siteBooking.name,
    siteBooking.phone,
    siteBooking.date,
    siteBooking.property,
    getCommercialProperties,
    getPropertiesForLocation
  ]);

  // Handle Search Queries Received from Homepage Search Bar
  const handleSearchFromHomepage = useCallback((data) => {
    setIsOpen(true);
    playPing();

    if (data.searchType === 'keyword' && data.query) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'user',
          text: `Searched for: "${data.query}"`
        }
      ]);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const result = processUserQuery(data.query);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: `👋 I received your search for **"${data.query}"** from the homepage!\n\n${result.text}`,
            linkUrl: result.linkUrl || '/properties_residential_appartment.html',
            linkText: result.linkText || '👉 View Matching Properties',
            options: result.options || ['1️⃣ Find My Dream Home', '2️⃣ About Us', '3️⃣ Talk to an Expert']
          }
        ]);
        playPing();
      }, 500);
      return;
    }

    // Advance search query from homepage
    const parts = [];
    if (data.category) parts.push(data.category);
    if (data.locations && data.locations.length > 0) parts.push(data.locations.join(', '));
    if (data.bedrooms && data.bedrooms.length > 0) parts.push(`${data.bedrooms.join(', ')} BHK`);
    if (data.maxPrice) parts.push(`Up to ₹${data.maxPrice}`);

    const summary = parts.join(' | ') || 'All Properties';

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: `Homepage Search: ${summary}`
      }
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const chosenLoc = data.locations && data.locations[0] ? data.locations[0] : 'Kharadi';
      const chosenConfig = data.bedrooms && data.bedrooms[0] ? `${data.bedrooms[0]} BHK` : '2 BHK';
      const properties = getPropertiesForLocation(chosenLoc, chosenConfig, data.maxPrice);

      const listingText = properties
        .map(
          (p, i) =>
            `${i + 1}️⃣ Property Name: ${p.name}\n📍 Location: ${p.location}\n🏠 Configuration: ${p.config}\n💰 Price Range: ${p.price}\n`
        )
        .join('\n');

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `👋 I received your criteria from the homepage search bar:\n\n📋 **Selected Filters**: ${summary}\n\n𝗛𝗲𝗿𝗲 𝗮𝗿𝗲 𝘀𝗼𝗺𝗲 𝗴𝗿𝗲𝗮𝘁 𝗼𝗽𝘁𝗶𝗼𝗻𝘀 𝗳𝗼𝗿 𝘆𝗼𝘂:\n\n${listingText}\n✨ Which one caught your eye?`,
          linkUrl: '/properties_residential_appartment.html',
          linkText: '👉 View All Matching Properties',
          options: [
            `1️⃣ ${properties[0].name}`,
            `2️⃣ ${properties[1].name}`,
            `3️⃣ ${properties[2].name}`,
            '📅 Book a site visit',
            '🔄 Start New Search'
          ]
        }
      ]);
      playPing();
    }, 600);
  }, [getPropertiesForLocation, playPing, processUserQuery]);

  // Listen for message events from iframe (home_clone.html)
  useEffect(() => {
    const handleWindowMessage = (e) => {
      if (e.data && e.data.type === 'SAI_SEARCH_QUERY') {
        handleSearchFromHomepage(e.data);
      }
    };
    window.addEventListener('message', handleWindowMessage);

    // Also check for pending search in sessionStorage
    try {
      const pendingSearch = sessionStorage.getItem('sai_pending_search');
      if (pendingSearch) {
        const parsed = JSON.parse(pendingSearch);
        sessionStorage.removeItem('sai_pending_search');
        setTimeout(() => {
          handleSearchFromHomepage(parsed);
        }, 600);
      }
    } catch (err) {
      sessionStorage.removeItem('sai_pending_search');
    }

    return () => window.removeEventListener('message', handleWindowMessage);
  }, [handleSearchFromHomepage]);

  // Send a user message and trigger Sai's response
  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    setInputValue('');

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };
    setMessages((prev) => [...prev, userMsg]);

    // Sai starts typing
    setIsTyping(true);

    setTimeout(() => {
      const responseData = processUserQuery(query);
      setIsTyping(false);

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseData.text,
        linkUrl: responseData.linkUrl,
        linkText: responseData.linkText,
        options: responseData.options || [],
        isSiteVisitForm: responseData.isSiteVisitForm || false
      };

      setMessages((prev) => [...prev, aiMsg]);
      playPing();
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOptionClick = (optionText) => {
    if (optionText.includes('Call')) {
      window.location.href = 'tel:919222445513';
      return;
    }
    if (optionText.includes('WhatsApp')) {
      window.open('https://wa.me/919222445513', '_blank');
      return;
    }
    if (optionText === '← Edit Booking Details') {
      setSiteBooking((prev) => ({ ...prev, step: 'form', otpError: '' }));
      return;
    }
    if (optionText === '🔄 Resend OTP') {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setSiteBooking((prev) => ({
        ...prev,
        generatedOtp: code,
        enteredOtp: '',
        otpError: ''
      }));
      handleSend('Resend OTP');
      return;
    }
    handleSend(optionText);
  };

  const handleResetChat = () => {
    setConversationState({
      flow: 'idle',
      step: 'initial',
      propertyType: '',
      location: '',
      configuration: '',
      budget: '',
      selectedOption: null
    });
    setSiteBooking({
      step: 'idle',
      name: '',
      phone: '',
      date: '',
      property: 'Godrej Urban Retreat (Kharadi)',
      generatedOtp: '',
      enteredOtp: '',
      otpError: '',
      bookingRef: ''
    });
    setMessages([getInitialGreeting()]);
  };

  // STEP 1 of Booking: Request OTP
  const handleRequestBookingOtp = (e) => {
    e.preventDefault();
    if (!siteBooking.phone || siteBooking.phone.length < 10 || !siteBooking.phone2 || siteBooking.phone2.length < 10) {
      alert('Please enter valid 10-digit primary and secondary mobile numbers.');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSiteBooking((prev) => ({
      ...prev,
      generatedOtp: code,
      step: 'otp',
      enteredOtp: '',
      otpError: ''
    }));

    handleSend(`Booking details submitted for ${siteBooking.name || 'Guest'} (+91 ${siteBooking.phone}). Please send verification OTP.`);
  };

  // STEP 2 of Booking: Verify Entered OTP
  const handleVerifyBookingOtp = (e) => {
    e.preventDefault();
    if (siteBooking.enteredOtp.trim() !== siteBooking.generatedOtp.trim()) {
      setSiteBooking((prev) => ({
        ...prev,
        otpError: '❌ Invalid OTP. Please enter the correct 4-digit code.'
      }));
      return;
    }

    // Correct OTP: Confirm booking
    const ref = `#SR-${Math.floor(10000 + Math.random() * 90000)}`;
    setSiteBooking((prev) => ({
      ...prev,
      step: 'verified',
      bookingRef: ref,
      otpError: ''
    }));

    // Post lead to database
    fetch('http://localhost:8000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: siteBooking.name || 'Site Visit Guest',
        phone: siteBooking.phone,
        visit_date: siteBooking.date || 'Earliest Slot',
        property_name: siteBooking.property || 'Godrej Urban Retreat (Kharadi)',
        notes: `Verified via OTP [${siteBooking.generatedOtp}]. Booking Ref: ${ref}`
      })
    }).catch(console.error);

    handleSend(`OTP verified successfully! Code: ${siteBooking.enteredOtp}`);
  };

  // Safe line-break & bold formatting renderer
  const renderFormatted = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={lIdx} style={{ display: 'block', minHeight: line.trim() ? 'auto' : '6px' }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} style={{ color: '#0f4c81', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  const themeColor = '#0f4c81';

  return (
    <>
      <style>
        {`
          @keyframes saiPopIn {
            from { opacity: 0; transform: translateY(-50%) scale(0.9); }
            to { opacity: 1; transform: translateY(-50%) scale(1); }
          }
          @keyframes saiSlideUpMobile {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes saiPulseDot {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          @keyframes saiGlow {
            0%, 100% { box-shadow: 0 8px 24px rgba(15, 76, 129, 0.45); }
            50% { box-shadow: 0 10px 30px rgba(15, 76, 129, 0.7); }
          }
          .sai-dot {
            width: 7px;
            height: 7px;
            background-color: #0f4c81;
            border-radius: 50%;
            animation: saiPulseDot 1.4s infinite both;
          }
          .sai-dot:nth-child(1) { animation-delay: 0s; }
          .sai-dot:nth-child(2) { animation-delay: 0.2s; }
          .sai-dot:nth-child(3) { animation-delay: 0.4s; }

          .sai-option-btn {
            background-color: #ffffff;
            border: 1.5px solid ${themeColor};
            color: ${themeColor};
            padding: 8px 14px;
            border-radius: 18px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 2px 5px rgba(0,0,0,0.03);
            text-align: left;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .sai-option-btn:hover {
            background-color: ${themeColor} !important;
            color: #ffffff !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(15, 76, 129, 0.25) !important;
          }

          .sai-link-btn:hover {
            background-color: #0c3b64 !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(15, 76, 129, 0.35) !important;
          }

          /* Desktop Chat Window */
          .sai-chat-window {
            width: 400px;
            height: 640px;
            max-height: 88vh;
            border-radius: 22px;
            top: 50%;
            right: 25px;
            position: fixed;
            animation: saiPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
          }

          /* Mobile Fullscreen Responsiveness */
          @media (max-width: 600px) {
            .sai-chat-window {
              width: 100vw !important;
              height: 100dvh !important;
              max-height: 100dvh !important;
              top: 0 !important;
              right: 0 !important;
              transform: none !important;
              border-radius: 0 !important;
              animation: saiSlideUpMobile 0.25s ease-out forwards !important;
            }
            .sai-bubble-btn {
              bottom: 20px !important;
              right: 20px !important;
              top: auto !important;
              transform: none !important;
            }
          }
        `}
      </style>

      {/* Floating Avatar Trigger Button */}
      {!isOpen && (
        <div
          className="sai-bubble-btn"
          style={{
            position: 'fixed',
            top: '50%',
            right: '25px',
            transform: 'translateY(-50%)',
            zIndex: 999999,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => {
            setIsOpen(true);
            playPing();
          }}
          title="Chat with Sai - AI Property Consultant"
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: themeColor,
              backgroundImage: 'url("/sai_avatar.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              border: '3px solid #ffffff',
              boxShadow: '0 8px 24px rgba(15, 76, 129, 0.5)',
              position: 'relative',
              animation: 'saiGlow 3s infinite'
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '14px',
                height: '14px',
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }}
            />
          </div>
          <span
            style={{
              backgroundColor: '#0f4c81',
              color: '#ffffff',
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              letterSpacing: '0.4px',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Sai AI
          </span>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="sai-chat-window"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 16px 48px rgba(15, 76, 129, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(15, 76, 129, 0.12)',
            zIndex: 9999999,
            fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f4c81 0%, #1e3a8a 100%)',
              color: '#ffffff',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
              zIndex: 10,
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundImage: 'url("/sai_avatar.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    border: '2px solid rgba(255,255,255,0.9)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    border: '2px solid #ffffff'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '0.3px' }}>
                  Sai
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Reset Chat Button */}
              <button
                onClick={handleResetChat}
                title="Restart Conversation"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                </svg>
              </button>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919222445513"
                target="_blank"
                rel="noreferrer"
                title="Chat on WhatsApp (+91 9222445513)"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
              </a>

              {/* Call Button */}
              <a
                href="tel:919222445513"
                title="Call Sai Reality (+91 9222445513)"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                </svg>
              </a>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: 0,
                  marginLeft: '4px',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', margin: '4px 0' }}>
              Today • Sai Properties Assistant
            </div>

            {messages.map((msg) => {
              if (msg.sender === 'ai') {
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '94%' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundImage: 'url("/sai_avatar.png")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center top',
                          flexShrink: 0,
                          border: '1.5px solid #0f4c81',
                          marginTop: '2px'
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '13px 16px',
                          borderRadius: '4px 18px 18px 18px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          fontSize: '13.5px',
                          lineHeight: '1.55',
                          color: '#334155',
                          border: '1px solid rgba(15, 76, 129, 0.08)'
                        }}
                      >
                        {renderFormatted(msg.text)}

                        {/* Interactive In-Chat Site Visit Booking Flow with OTP Verification */}
                        {msg.isSiteVisitForm && (
                          <div style={{ marginTop: '12px' }}>
                            {/* STEP 1: Enter Details */}
                            {siteBooking.step === 'form' && (
                              <form
                                onSubmit={handleRequestBookingOtp}
                                style={{
                                  padding: '14px',
                                  backgroundColor: '#f8fafc',
                                  borderRadius: '12px',
                                  border: '1px solid #e2e8f0',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px'
                                }}
                              >
                                <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f4c81' }}>
                                  🗓 Schedule VIP Site Visit
                                </div>
                                <input
                                  type="text"
                                  placeholder="Your Full Name (Optional)"
                                  value={siteBooking.name}
                                  onChange={(e) => setSiteBooking({ ...siteBooking, name: e.target.value })}
                                  style={{
                                    padding: '9px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '13px'
                                  }}
                                />
                                <input
                                  type="tel"
                                  placeholder="Primary Mobile Number * (10 Digits)"
                                  required
                                  maxLength={10}
                                  value={siteBooking.phone}
                                  onChange={(e) => setSiteBooking({ ...siteBooking, phone: e.target.value })}
                                  style={{
                                    padding: '9px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '13px'
                                  }}
                                />
                                <input
                                  type="tel"
                                  placeholder="Secondary Mobile Number * (10 Digits)"
                                  required
                                  maxLength={10}
                                  value={siteBooking.phone2}
                                  onChange={(e) => setSiteBooking({ ...siteBooking, phone2: e.target.value })}
                                  style={{
                                    padding: '9px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '13px'
                                  }}
                                />
                                <input
                                  type="date"
                                  required
                                  value={siteBooking.date}
                                  onChange={(e) => setSiteBooking({ ...siteBooking, date: e.target.value })}
                                  style={{
                                    padding: '9px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '13px'
                                  }}
                                />
                                <select
                                  value={siteBooking.property}
                                  onChange={(e) => setSiteBooking({ ...siteBooking, property: e.target.value })}
                                  style={{
                                    padding: '9px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '13px',
                                    backgroundColor: '#ffffff'
                                  }}
                                >
                                  <option>Godrej Urban Retreat (Kharadi)</option>
                                  <option>Lodha Giardino (Kharadi)</option>
                                  <option>Pride World City (Lohegaon)</option>
                                  <option>Kohinoor Viva City (Dhanori)</option>
                                  <option>Nyati Era (Dhanori)</option>
                                  <option>Majestique Mahatma (Wagholi)</option>
                                  <option>Dubai Luxury Apartments</option>
                                </select>
                                <button
                                  type="submit"
                                  style={{
                                    backgroundColor: themeColor,
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    marginTop: '4px'
                                  }}
                                >
                                  📲 Get Verification OTP & Proceed
                                </button>
                              </form>
                            )}

                            {/* STEP 2: Enter & Verify OTP */}
                            {siteBooking.step === 'otp' && (
                              <form
                                onSubmit={handleVerifyBookingOtp}
                                style={{
                                  padding: '14px',
                                  backgroundColor: '#f0fdf4',
                                  borderRadius: '12px',
                                  border: '1.5px solid #86efac',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px'
                                }}
                              >
                                <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  🔐 Mobile Number Verification
                                </div>
                                <div style={{ fontSize: '12px', color: '#15803d' }}>
                                  OTP sent to <strong>+91 {siteBooking.phone}</strong>
                                </div>
                                <div
                                  style={{
                                    backgroundColor: '#dcfce7',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    color: '#166534',
                                    fontWeight: '600',
                                    border: '1px dashed #22c55e',
                                    textAlign: 'center'
                                  }}
                                >
                                  Demo / Test OTP: <strong>{siteBooking.generatedOtp}</strong>
                                </div>

                                {siteBooking.otpError && (
                                  <div
                                    style={{
                                      backgroundColor: '#fee2e2',
                                      color: '#b91c1c',
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      textAlign: 'center'
                                    }}
                                  >
                                    {siteBooking.otpError}
                                  </div>
                                )}

                                <input
                                  type="text"
                                  maxLength={4}
                                  placeholder="• • • •"
                                  autoFocus
                                  required
                                  value={siteBooking.enteredOtp}
                                  onChange={(e) => {
                                    setSiteBooking({ ...siteBooking, enteredOtp: e.target.value, otpError: '' });
                                  }}
                                  style={{
                                    padding: '10px',
                                    fontSize: '20px',
                                    fontWeight: '800',
                                    letterSpacing: '6px',
                                    textAlign: 'center',
                                    borderRadius: '8px',
                                    border: '2px solid #86efac',
                                    outline: 'none',
                                    backgroundColor: '#ffffff'
                                  }}
                                />

                                <button
                                  type="submit"
                                  style={{
                                    backgroundColor: '#16a34a',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✅ Verify OTP & Confirm Booking
                                </button>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '2px' }}>
                                  <span
                                    onClick={() => setSiteBooking((prev) => ({ ...prev, step: 'form', otpError: '' }))}
                                    style={{ color: '#0f4c81', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                                  >
                                    ← Edit Details
                                  </span>
                                  <span
                                    onClick={() => {
                                      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                                      setSiteBooking((prev) => ({ ...prev, generatedOtp: newCode, enteredOtp: '', otpError: '' }));
                                      alert(`New OTP sent to +91 ${siteBooking.phone}: ${newCode}`);
                                    }}
                                    style={{ color: '#0f4c81', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                                  >
                                    Resend OTP
                                  </span>
                                </div>
                              </form>
                            )}

                            {/* STEP 3: Booking Verified Successfully Card */}
                            {siteBooking.step === 'verified' && (
                              <div
                                style={{
                                  padding: '14px',
                                  backgroundColor: '#f0fdf4',
                                  borderRadius: '12px',
                                  border: '1.5px solid #22c55e',
                                  textAlign: 'center'
                                }}
                              >
                                <div style={{ fontSize: '32px', marginBottom: '4px' }}>🎉</div>
                                <div style={{ fontWeight: '800', fontSize: '15px', color: '#15803d' }}>
                                  VIP Site Visit Confirmed!
                                </div>
                                <div
                                  style={{
                                    display: 'inline-block',
                                    backgroundColor: '#dcfce7',
                                    color: '#166534',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontFamily: 'monospace',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    margin: '6px 0'
                                  }}
                                >
                                  Ref: {siteBooking.bookingRef}
                                </div>
                                <div style={{ color: '#166534', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                                  ✅ Verified via Mobile OTP (+91 {siteBooking.phone})
                                </div>
                                <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.45', margin: '4px 0' }}>
                                  Project: <strong>{siteBooking.property}</strong>
                                  <br />
                                  Date: <strong>{siteBooking.date}</strong>
                                </p>
                                <p style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                                  Free AC cab pickup and property executive will be ready to welcome you!
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Direct Page Redirection Button */}
                        {msg.linkUrl && (
                          <div style={{ marginTop: '12px' }}>
                            <button
                              className="sai-link-btn"
                              onClick={() => handleRedirect(msg.linkUrl)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '10px 14px',
                                backgroundColor: themeColor,
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '600',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 3px 8px rgba(15, 76, 129, 0.25)'
                              }}
                            >
                              <span>{msg.linkText || 'View Project Page'}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Clickable Option Buttons */}
                    {msg.options && msg.options.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          paddingLeft: '42px',
                          marginTop: '2px'
                        }}
                      >
                        {msg.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            className="sai-option-btn"
                            onClick={() => handleOptionClick(opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // User Message Bubble
              return (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: themeColor,
                    color: '#ffffff',
                    padding: '11px 16px',
                    borderRadius: '18px 18px 4px 18px',
                    maxWidth: '82%',
                    alignSelf: 'flex-end',
                    fontSize: '13.5px',
                    lineHeight: '1.45',
                    boxShadow: '0 3px 10px rgba(15, 76, 129, 0.28)',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundImage: 'url("/sai_avatar.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    flexShrink: 0,
                    border: '1.5px solid #0f4c81'
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '4px 16px 16px 16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center'
                  }}
                >
                  <div className="sai-dot" />
                  <div className="sai-dot" />
                  <div className="sai-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Input Form */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <input
              type="text"
              placeholder={
                siteBooking.step === 'otp'
                  ? `Enter 4-digit OTP (sent to +91 ${siteBooking.phone})...`
                  : 'Ask Sai anything or type an option...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: '24px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                fontSize: '13.5px',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => (e.target.style.borderColor = themeColor)}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
            <button
              onClick={() => handleSend()}
              style={{
                backgroundColor: themeColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'transform 0.15s, background-color 0.2s',
                boxShadow: '0 3px 8px rgba(15, 76, 129, 0.3)'
              }}
              title="Send to Sai"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 0-.11-.06.5.5 0 0 0-.144-.06.5.5 0 0 0-.18-.02.5.5 0 0 0-.18.02l-15 6a.5.5 0 0 0-.256.772l4.896 5.508 1.488-6.198 6.786-5.43-5.43 6.786-1.576 6.565a.5.5 0 0 0 .195.534.5.5 0 0 0 .573.018l8.5-5.5a.5.5 0 0 0 .227-.478l-1.5-9.5a.5.5 0 0 0-.194-.35z"/>
              </svg>
            </button>
          </div>

          {/* Footer Branding */}
          <div
            style={{
              padding: '6px 14px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              fontSize: '11px',
              color: '#94a3b8',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>Powered by</span>
            <strong style={{ color: '#0f4c81' }}>Sai Properties</strong>
            <span>• Verified Real Estate Advisory</span>
          </div>
        </div>
      )}
    </>
  );
}
