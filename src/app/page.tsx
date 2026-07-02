'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import PixelBlast from './PixelBlast';
import './landing.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Text Reveal Animation
    const heroTitle = document.querySelector(".hero h1") as HTMLElement;
    if (heroTitle && !heroTitle.dataset.animated) {
      heroTitle.dataset.animated = "true";
      const text = heroTitle.innerHTML;
      const splitText = text.split(/(<br\/>|<span[^>]*>|<\/span>|\s+)/).filter(Boolean);
      
      heroTitle.innerHTML = "";
      splitText.forEach(part => {
          if (part.startsWith("<")) {
              heroTitle.innerHTML += part;
          } else if (part.trim() !== "") {
              const span = document.createElement("span");
              span.innerHTML = part + " ";
              heroTitle.appendChild(span);
          } else {
              heroTitle.innerHTML += " ";
          }
      });

      gsap.from(".hero h1 span", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.2
      });
    }

    gsap.from(".hero p", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.8
    });

    gsap.from(".cta-group .primary-btn, .cta-group .secondary-btn", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 1.2
    });

    // 2. Scroll-Triggered Bento Cards
    gsap.from(".bento-header", {
        scrollTrigger: {
            trigger: ".bento-features",
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.utils.toArray(".bento-card").forEach((card: any, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.1
        });
    });

    // 3. Scroll-Triggered FAQ
    gsap.from(".faq-title", {
        scrollTrigger: {
            trigger: ".faq-section",
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.utils.toArray(".faq-item").forEach((item: any, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: ".faq-section",
                start: "top 60%",
                toggleActions: "play none none reverse"
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: index * 0.1 + 0.3
        });
    });

    // 4. Navbar Scroll Blur Effect
    const navbar = document.querySelector(".navbar") as HTMLElement;
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(12, 13, 16, 0.8)";
            navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
        } else {
            navbar.style.background = "transparent";
            navbar.style.boxShadow = "none";
        }
    };
    window.addEventListener("scroll", handleScroll);

    // Magnetic Buttons
    const magneticWraps = document.querySelectorAll(".magnetic-wrap");
    magneticWraps.forEach(wrap => {
        const btn = wrap.querySelector(".nav-btn");
        wrap.addEventListener("mousemove", (e: any) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
        });
        wrap.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, { scope: containerRef });

  // PixelBlast is now loaded via React component

  const toggleFaq = (e: React.MouseEvent<HTMLButtonElement>) => {
    const faqItem = e.currentTarget.parentElement;
    if (!faqItem) return;
    const isActive = faqItem.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    if (!isActive) {
        faqItem.classList.add('active');
    }
  };

  const toggleKeyboard = () => {
    const keyboard = document.getElementById('mockup-keyboard');
    const inputSpan = document.querySelector('#mockup-input span') as HTMLElement;
    if (keyboard && inputSpan) {
      keyboard.classList.toggle('active');
      inputSpan.innerHTML = keyboard.classList.contains('active') ? 'Send 10 USDC to shijas|' : 'Message';
      inputSpan.style.color = keyboard.classList.contains('active') ? '#fff' : '#d1d7db';
    }
  };

  useEffect(() => {
    setTimeout(() => {
        const typing = document.querySelector('.typing');
        if (typing) {
            typing.innerHTML = "✅ Transaction successful! Sent 10 USDC to shijas*stellapp.com.<br><br>Tx Hash: <code>a7f8...9b2c</code><div class='msg-time'>10:42 AM</div>";
            typing.classList.remove('typing');
        }
    }, 3000);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Premium Hero Backgrounds */}
      <div className="mesh-bg"></div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-grid-overlay"></div>

      <nav className="navbar glass">
          <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                      <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#81C784"/>
                          <stop offset="1" stopColor="#173F35"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#81C784"/>
                          <stop offset="1" stopColor="#2E7D32"/>
                      </linearGradient>
                      <linearGradient id="paint2_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#81C784"/>
                          <stop offset="1" stopColor="#173F35"/>
                      </linearGradient>
                  </defs>
              </svg>
              <span>Stellapp</span>
          </Link>
          <div className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <a href="#products" className="nav-text-link">Products</a>
              <Link href="/roadmap" className="nav-text-link">Roadmap</Link>
              <div className="magnetic-wrap">
                  <Link href="/login" className="nav-btn glass-btn" style={{ background: 'rgba(129, 199, 132, 0.1)', borderColor: 'rgba(129, 199, 132, 0.3)', color: '#81C784' }}>Login to Dashboard</Link>
              </div>
              <div className="magnetic-wrap">
                  <a href="#connect" className="nav-btn glass-btn">Connect WhatsApp</a>
              </div>
          </div>
      </nav>

      <header className="section hero">
          <div className="hero-badge-wrap">
              <div className="badge glass">💬 Web3 on WhatsApp</div>
          </div>
          <h1 className="hero-title">Send, Receive, Deploy on <br/><span className="text-gradient" style={{ background: 'linear-gradient(90deg, #81C784 0%, #2E7D32 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WhatsApp</span></h1>
          
          {/* Phone Mockup Visual */}
          <div className="phone-container">
              <div className="phone-button silent"></div>
              <div className="phone-button volume-up"></div>
              <div className="phone-button volume-down"></div>
              <div className="phone-button power"></div>
              
              <div className="phone-mockup glass">
                  <div className="phone-notch">
                      <div className="camera-lens"></div>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#222', marginLeft: '6px' }}></div>
                  </div>
                  <div className="phone-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="contact-info" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <div style={{ color: '#0a84ff', display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: '2px' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                              <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '16px' }}>S</div>
                              <div className="contact-name" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                  <span style={{ fontSize: '15px', color: '#e9edef', fontWeight: 600, lineHeight: 1.2 }}>Stellapp</span>
                                  <span style={{ fontSize: '9px', color: '#8696a0', fontWeight: 400, lineHeight: 1.1 }}>tap here for contact info</span>
                              </div>
                          </div>
                      </div>
                      <div style={{ display: 'flex', gap: '18px', color: '#0a84ff' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                  </div>
                  <div className="phone-body">
                      <div className="message received">
                          👋 Welcome to Stellapp! Your Stellar address is ready.
                          <div className="msg-time">10:41 AM</div>
                      </div>
                      <div className="message sent">
                          Send 10 USDC to shijas
                          <div className="msg-time">10:42 AM <span className="msg-check">✓✓</span></div>
                      </div>
                      <div className="message received typing">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                      </div>
                  </div>
                  <div className="phone-footer">
                      <div style={{ color: '#0a84ff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </div>
                      <div className="input-bar" id="mockup-input" style={{ cursor: 'pointer' }} onClick={toggleKeyboard}>
                          <span>Message</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', color: '#0a84ff', alignItems: 'center' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                      </div>
                  </div>
                  
                  <div className="phone-keyboard" id="mockup-keyboard">
                      <div className="key-row">
                          <div className="key">Q</div><div className="key">W</div><div className="key">E</div><div className="key">R</div><div className="key">T</div>
                          <div className="key">Y</div><div className="key">U</div><div className="key">I</div><div className="key">O</div><div className="key">P</div>
                      </div>
                      <div className="key-row" style={{ padding: '0 10px' }}>
                          <div className="key">A</div><div className="key">S</div><div className="key">D</div><div className="key">F</div>
                          <div className="key">G</div><div className="key">H</div><div className="key">J</div><div className="key">K</div><div className="key">L</div>
                      </div>
                      <div className="key-row">
                          <div className="key wide">⇧</div><div className="key">Z</div><div className="key">X</div><div className="key">C</div><div className="key">V</div>
                          <div className="key">B</div><div className="key">N</div><div className="key">M</div><div className="key wide">⌫</div>
                      </div>
                      <div className="key-row">
                          <div className="key wide" style={{ fontSize: '14px' }}>123</div>
                          <div className="key space">space</div>
                          <div className="key wide" style={{ fontSize: '14px', background: 'var(--accent-1)', color: '#000', fontWeight: 600 }}>Send</div>
                      </div>
                  </div>
              </div>
          </div>

          <p className="hero-desc">Harness the speed of the Stellar network right from your chats. Move money instantly, trade tokens, and launch smart contracts using just a text message.</p>
          <div className="cta-group">
              <a href="#connect" className="primary-btn" style={{ background: 'var(--accent-1)', color: 'var(--bg-color)', fontWeight: 700, borderRadius: '30px', padding: '15px 30px' }}>Start Chatting</a>
              <Link href="/login" className="secondary-btn glass" style={{ borderRadius: '30px', padding: '15px 30px' }}>Open Dashboard</Link>
          </div>
      </header>

      <section id="features" className="section bento-features" style={{ position: 'relative' }}>
          <div className="features-bg">
              <div className="features-orb orb-1"></div>
              <div className="features-orb orb-2"></div>
              <div className="features-orb orb-3"></div>
          </div>
          
          <div className="bento-container">
              <div className="bento-header">
                  <h2>With Stellapp, crypto is <span className="highlight">simple.</span></h2>
              </div>
              
              <div className="bento-grid">
                  <div className="bento-card full-width light-card">
                      <div className="bento-content">
                          <h3>Send money to your contacts across the world instantly</h3>
                          <p>Send money anywhere in the world instantly with no banks and near-zero fees. If your contacts have WhatsApp, they have Stellapp.</p>
                      </div>
                      <div className="bento-icon">
                          <svg width="130" height="130" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(129, 199, 132, 0.25))' }}>
                              <g clipPath="url(#globeClip)">
                                  <path 
                                      fillRule="evenodd" 
                                      clipRule="evenodd" 
                                      d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" 
                                      fill="var(--accent-1)" 
                                  />
                              </g>
                              <defs>
                                  <clipPath id="globeClip">
                                      <rect width="16" height="16" fill="white"/>
                                  </clipPath>
                              </defs>
                          </svg>
                      </div>
                  </div>
                  
                  <div className="bento-card half-width dark-card">
                      <div className="bento-icon-centered">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 12px rgba(129, 199, 132, 0.25))' }}>
                              {/* Wallet Base */}
                              <rect x="15" y="30" width="70" height="45" rx="8" fill="var(--bg-color)" stroke="var(--accent-1)" strokeWidth="2"/>
                              
                              {/* Wallet Flap/Strap */}
                              <path d="M85 45H65C62.2386 45 60 47.2386 60 50C60 52.7614 62.2386 55 65 55H85" fill="var(--accent-2)" stroke="var(--accent-1)" strokeWidth="2"/>
                              <circle cx="72" cy="50" r="3" fill="var(--accent-1)"/>
                              
                              {/* Floating Crypto Coins */}
                              <g style={{ transform: 'translateY(-5px)' }}>
                                  {/* USDC-like coin */}
                                  <circle cx="40" cy="25" r="12" fill="#2775ca"/>
                                  <circle cx="40" cy="25" r="9" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                  <path d="M38 22V28M42 22V28M37 25H43" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                  
                                  {/* Stellar/XLM-like coin */}
                                  <circle cx="65" cy="18" r="10" fill="var(--accent-1)"/>
                                  <circle cx="65" cy="18" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                                  <path d="M62 16L68 20M62 20L68 16" stroke="var(--bg-color)" strokeWidth="1.5" strokeLinecap="round"/>
                              </g>
                              
                              {/* Connecting nodes/network lines */}
                              <path d="M25 45L45 45" stroke="var(--accent-3)" strokeWidth="2" strokeDasharray="4 4"/>
                              <circle cx="25" cy="45" r="2" fill="var(--accent-3)"/>
                              <circle cx="45" cy="45" r="2" fill="var(--accent-3)"/>
                          </svg>
                      </div>
                      <div className="bento-content centered">
                          <h3>Crypto & DeFi, One Message Away</h3>
                          <p>Buy, sell, and hold crypto such as XLM or USDC with just a text. We manage the wallet infrastructure for you, making Web3 completely effortless.</p>
                      </div>
                  </div>
                  
                  <div className="bento-card half-width light-card">
                      <div className="bento-icon-centered">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(46, 125, 50, 0.1))' }}>
                              {/* Code compilation terminal box */}
                              <rect x="15" y="20" width="70" height="60" rx="10" fill="var(--accent-2)" stroke="var(--accent-3)" strokeWidth="2"/>
                              <path d="M15 32H85" stroke="var(--accent-3)" strokeWidth="1.5"/>
                              {/* Terminal dots */}
                              <circle cx="23" cy="26" r="2.5" fill="#ef4444"/>
                              <circle cx="30" cy="26" r="2.5" fill="#eab308"/>
                              <circle cx="37" cy="26" r="2.5" fill="#22c55e"/>
                              {/* Code brackets and prompt */}
                              <path d="M26 44L34 50L26 56" stroke="var(--accent-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <rect x="39" y="53" width="14" height="3" fill="var(--accent-1)" rx="1.5">
                                  <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/>
                              </rect>
                              {/* Floating Sparkles */}
                              <path d="M72 42L74 46L78 48L74 50L72 54L70 50L66 48L70 46L72 42Z" fill="var(--accent-1)" opacity="0.8"/>
                          </svg>
                      </div>
                      <div className="bento-content centered">
                          <h3>Deploy Smart Contracts in Chat</h3>
                          <p>Launch Soroban smart contracts directly from WhatsApp. Describe your idea, and your AI assistant will write, test, and deploy it on Stellar.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section id="faq" className="section faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-container">
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      Is my crypto safe on WhatsApp?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>Yes. Stellapp provides a secure, fully-managed custodial wallet. We handle all the complex key management on our enterprise-grade backend. WhatsApp acts as a fast, authenticated channel to communicate your intents to our AI, executing your transactions safely and instantly.</p>
                  </div>
              </div>
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      What are the fees?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>Stellapp is built on the Stellar network, meaning transactions cost a fraction of a cent. We charge zero additional fees for standard transfers and swaps.</p>
                  </div>
              </div>
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      Can I really deploy smart contracts from chat?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>Absolutely. Our AI agent translates your natural language requirements into Rust code, compiles it for Soroban, and guides you through the deployment process—all within your WhatsApp chat.</p>
                  </div>
              </div>
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      Which assets are supported?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>We support all native Stellar assets including XLM, USDC, EURC, and AQUA. We are also rolling out cross-chain bridging capabilities for EVM assets.</p>
                  </div>
              </div>
          </div>
      </section>

      <footer className="glass">
          <p>&copy; 2026 Stellapp. Built on Stellar. Hosted on Railway.</p>
      </footer>
    </div>
  );
}
