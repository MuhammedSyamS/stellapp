'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import '../landing.css';

interface RoadmapItem {
  priority: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function RoadmapPage() {
  const [slideIndex, setSlideIndex] = useState(2); // Start at index 2 (the real Card 1)
  const [disableTransition, setDisableTransition] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const items: RoadmapItem[] = [
    {
      priority: 'Priority 1',
      title: 'Official Meta API Integration',
      description: 'Upgrade to the official WhatsApp Cloud API for enhanced reliability, richer message formats, and extra interactive features directly in chat.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
        </svg>
      )
    },
    {
      priority: 'Priority 2',
      title: 'Telegram Mini App',
      description: 'Native Telegram integration using identical phone-verified userdata. Access your wallet effortlessly without leaving your favorite Telegram chats.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      )
    },
    {
      priority: 'Priority 3',
      title: 'Cross-Chain Bridging',
      description: 'Bridge and swap assets natively across different blockchain networks via intent-based messaging without manual bridging interfaces.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
          <polyline points="16 3 21 8 16 13"></polyline>
          <line x1="21" y1="8" x2="9" y2="8"></line>
          <polyline points="8 21 3 16 8 11"></polyline>
          <line x1="3" y1="16" x2="15" y2="16"></line>
        </svg>
      )
    },
    {
      priority: 'Priority 4',
      title: 'EVM Supported Chains',
      description: 'Expand compatibility to Ethereum, Polygon, Arbitrum, and other EVM-compatible networks for a broader DeFi ecosystem.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
          <path d="M12 2L2 12l10 10 10-10L12 2z"></path>
          <path d="M12 2v20"></path>
          <path d="M2 12h20"></path>
        </svg>
      )
    },
    {
      priority: 'Priority 5',
      title: 'Stellar On & Off-Ramps',
      description: 'Frictionless fiat-to-crypto conversions globally. Buy and cash out crypto directly to your bank account using Stellar\'s anchor network.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
          <rect x="3" y="11" width="18" height="11" rx="2"></rect>
          <path d="M12 2L3 7v4h18V7L12 2z"></path>
          <line x1="12" y1="11" x2="12" y2="22"></line>
        </svg>
      )
    },
    {
      priority: 'Priority 6',
      title: 'AI Portfolio Automation',
      description: 'Built-in AI algorithms providing personalized investment insights, auto-rebalancing assets, and yield optimization strategies.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
          <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <line x1="9" y1="1" x2="9" y2="4"></line>
          <line x1="15" y1="1" x2="15" y2="4"></line>
          <line x1="9" y1="20" x2="9" y2="23"></line>
          <line x1="15" y1="20" x2="15" y2="23"></line>
          <line x1="20" y1="9" x2="23" y2="9"></line>
          <line x1="20" y1="15" x2="23" y2="15"></line>
          <line x1="1" y1="9" x2="4" y2="9"></line>
          <line x1="1" y1="15" x2="4" y2="15"></line>
        </svg>
      )
    },
  ];

  // We place 2 clones at both ends to allow smooth peak preview without flashing empty spaces
  const clonedItems = [
    items[items.length - 2], // Card 5
    items[items.length - 1], // Card 6
    ...items,                // Card 1, 2, 3, 4, 5, 6
    items[0],                // Card 1
    items[1],                // Card 2
  ];

  // Derive logical active index from slideIndex
  const activeIndex = (slideIndex - 2 + items.length) % items.length;

  const handleNext = () => {
    if (disableTransition) return;
    setSlideIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (disableTransition) return;
    setSlideIndex((prev) => prev - 1);
  };

  // Jump handler when transition ends on clones
  const handleTransitionEnd = () => {
    if (slideIndex === 8) { // Card 1 clone on right
      setDisableTransition(true);
      setSlideIndex(2); // Jump to Card 1 real
    } else if (slideIndex === 1) { // Card 6 clone on left
      setDisableTransition(true);
      setSlideIndex(7); // Jump to Card 6 real
    }
  };

  // Force reflow and re-enable transitions after jumping
  useEffect(() => {
    if (disableTransition) {
      if (trackRef.current) {
        // Read offsetHeight to force browser to repaint instantly with transition: none
        trackRef.current.offsetHeight;
      }
      setDisableTransition(false);
    }
  }, [disableTransition]);

  // Auto-scroll loop
  useEffect(() => {
    if (isDragging || isHovered || disableTransition) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slideIndex, isDragging, isHovered, disableTransition]);

  // Drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disableTransition) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setDragOffset(0);
  };

  // Drag move
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  // Drag end
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If dragged past threshold, slide card
    const threshold = 70;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  return (
    <div style={{ overflowX: 'hidden', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Disable scroll snapping and add custom carousel styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        html {
          scroll-snap-type: none !important;
        }
        
        .roadmap-carousel-section {
          padding: 80px 5% 120px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .carousel-wrapper {
          position: relative;
          width: 100%;
          margin-top: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .carousel-viewport {
          width: 100%;
          overflow: visible; /* Allows peak card previewing */
          padding: 40px 0;
          position: relative;
          cursor: grab;
        }

        .carousel-viewport:active {
          cursor: grabbing;
        }

        .carousel-track {
          display: flex;
          gap: 20px;
          transform: translate3d(calc(50% - 145px - ${slideIndex * 310}px + ${dragOffset}px), 0, 0);
          /* Disable transition during active drag or instant jumps */
          transition: ${isDragging || disableTransition ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'};
        }

        /* Adjust offset for mobile screens */
        @media (max-width: 768px) {
          .carousel-track {
            transform: translate3d(calc(50% - 120px - ${slideIndex * 255}px + ${dragOffset}px), 0, 0);
          }
        }

        .carousel-card {
          flex: 0 0 290px;
          width: 290px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          opacity: 0.25;
          transform: scale(0.9);
          cursor: pointer;
          text-align: left;
          user-select: none;
        }

        @media (max-width: 768px) {
          .carousel-card {
            flex: 0 0 240px;
            width: 240px;
            padding: 20px;
          }
        }

        .carousel-card.active {
          opacity: 1;
          transform: scale(1.05);
          border-color: var(--accent-1);
          background: rgba(129, 199, 132, 0.05);
          box-shadow: 0 10px 40px rgba(129, 199, 132, 0.15);
        }

        .carousel-card h3 {
          font-size: 20px;
          margin-bottom: 10px;
          color: var(--text-primary);
          font-weight: 700;
        }

        .carousel-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          font-size: 15px;
        }

        /* Navigation buttons style */
        .carousel-controls {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }

        .carousel-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .carousel-btn:hover {
          background: rgba(129, 199, 132, 0.1);
          border-color: var(--accent-1);
          color: var(--accent-1);
          transform: scale(1.08);
          box-shadow: 0 0 20px rgba(129, 199, 132, 0.2);
        }

        .carousel-btn:active {
          transform: scale(0.95);
        }

        /* Indicators */
        .carousel-indicators {
          display: flex;
          gap: 12px;
          margin-top: 35px;
        }

        .indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .indicator-dot.active {
          background: var(--accent-1);
          width: 28px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(129, 199, 132, 0.5);
        }
      `}} />

      {/* Premium Hero Backgrounds */}
      <div className="mesh-bg"></div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-grid-overlay"></div>

      {/* NAVBAR */}
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
          <Link href="/#products" className="nav-text-link">Products</Link>
          <Link href="/roadmap" className="nav-text-link">Roadmap</Link>
          <div className="magnetic-wrap">
            <Link href="/login" className="nav-btn glass-btn" style={{ background: 'rgba(129, 199, 132, 0.1)', borderColor: 'rgba(129, 199, 132, 0.3)', color: '#81C784' }}>Login to Dashboard</Link>
          </div>
          <div className="magnetic-wrap">
            <Link href="/#connect" className="nav-btn glass-btn">Connect WhatsApp</Link>
          </div>
        </div>
      </nav>

      {/* ROADMAP SECTION */}
      <section className="roadmap-carousel-section" style={{ marginTop: '140px' }}>
        <div className="bento-header">
          <h2 style={{ fontSize: '56px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Product <span className="highlight" style={{ color: 'var(--accent-1)' }}>Roadmap</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '18px' }}>
            Swipe/drag cards or click the arrows to navigate milestones
          </p>
        </div>

        <div className="carousel-wrapper">
          <div 
            className="carousel-viewport"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); handleDragEnd(); }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div 
              className="carousel-track" 
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
            >
              {clonedItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`carousel-card ${idx === slideIndex ? 'active' : ''}`}
                  onClick={() => !isDragging && setSlideIndex(idx)}
                >
                  {item.icon}
                  <span className="roadmap-date">{item.priority}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={handlePrev} aria-label="Previous priority">
              ←
            </button>
            <button className="carousel-btn" onClick={handleNext} aria-label="Next priority">
              →
            </button>
          </div>

          {/* Indicators */}
          <div className="carousel-indicators">
            {items.map((_, idx) => (
              <div
                key={idx}
                className={`indicator-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setSlideIndex(idx + 2)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="glass" style={{ textAlign: 'center', padding: '30px 20px', borderTop: '1px solid var(--glass-border)', marginTop: '80px' }}>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>&copy; 2026 Stellapp. Built on Stellar. Hosted on Railway.</p>
      </footer>
    </div>
  );
}
