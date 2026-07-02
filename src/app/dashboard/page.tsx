'use client';

import React, { useEffect, useState } from 'react';
import './dashboard.css';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
}

interface User {
  id: string;
  phoneNumber: string;
  username: string | null;
  stellarPublic: string;
  evmAddress: string;
  onboarded: boolean;
  balances: {
    xlm: string;
    usdc: string;
  };
  contacts: Contact[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<'stellar' | 'evm' | null>(null);

  useEffect(() => {
    // Simulating loading to make it feel authentic
    const timer = setTimeout(() => {
      setUser({
        id: 'mock-uuid-12345',
        phoneNumber: '5491134567890',
        username: 'syam',
        stellarPublic: 'GBBD4QNSTNAA2MA2LIADO57IL3ZCYCVW27566TC4H7SV23R3CQDU4VE3',
        evmAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        onboarded: true,
        balances: {
          xlm: '1425.8450',
          usdc: '350.00',
        },
        contacts: [
          { id: '1', name: 'Pedro', phoneNumber: '+54 9 11 2345-6789', createdAt: new Date().toISOString() },
          { id: '2', name: 'Juan', phoneNumber: '+54 9 11 9876-5432', createdAt: new Date().toISOString() },
          { id: '3', name: 'Maria', phoneNumber: '+54 9 11 5555-1234', createdAt: new Date().toISOString() },
        ],
      });
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleCopy = (text: string, type: 'stellar' | 'evm') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('stellapp_token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="loader"></div>
        <p>Loading your secure Stellapp Dashboard...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="dashboard-loading-container">
        <div className="error-card">
          <h2>🔒 Access Denied</h2>
          <p>{error || 'Please log in to access this page.'}</p>
          <button onClick={() => window.location.href = '/login'} className="retry-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Calculate estimated USD balance (Assume XLM = $0.12 USD for estimation)
  const xlmUSDVal = parseFloat(user.balances.xlm) * 0.12;
  const usdcUSDVal = parseFloat(user.balances.usdc);
  const totalUSD = (xlmUSDVal + usdcUSDVal).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <span className="logo-text">Stellapp</span>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span className="icon">📊</span> Overview
          </a>
          <a href="#" className="nav-item">
            <span className="icon">👥</span> Contacts
          </a>
          <a href="#" className="nav-item">
            <span className="icon">📜</span> History
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="dashboard-main">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1>Welcome back!</h1>
            <p className="header-subtitle">Managed Wallet for +{user.phoneNumber}</p>
          </div>
          <div className="network-badge">
            <span className="status-dot"></span> Testnet Active
          </div>
        </header>

        {/* BALANCE HERO CARD */}
        <section className="balance-hero-section">
          <div className="balance-hero-card">
            <h3>Estimated Wallet Value</h3>
            <div className="main-balance">${totalUSD} <span className="currency-unit">USD</span></div>
            <p className="balance-meta">Directly accessible via WhatsApp bot commands</p>
          </div>
        </section>

        {/* ASSET GRID */}
        <section className="dashboard-section">
          <h2 className="section-title">Your Assets</h2>
          <div className="asset-grid">
            {/* XLM Card */}
            <div className="asset-card">
              <div className="asset-header">
                <div className="asset-icon xlm">🚀</div>
                <div>
                  <h4>Stellar Lumens</h4>
                  <span className="asset-code">XLM</span>
                </div>
              </div>
              <div className="asset-body">
                <div className="asset-amount">
                  {parseFloat(user.balances.xlm).toLocaleString('en-US', { minimumFractionDigits: 4 })}
                </div>
                <div className="asset-usd">${xlmUSDVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
              </div>
            </div>

            {/* USDC Card */}
            <div className="asset-card">
              <div className="asset-header">
                <div className="asset-icon usdc">💵</div>
                <div>
                  <h4>USD Coin</h4>
                  <span className="asset-code">USDC</span>
                </div>
              </div>
              <div className="asset-body">
                <div className="asset-amount">
                  {parseFloat(user.balances.usdc).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="asset-usd">${usdcUSDVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS & CONTACTS */}
        <div className="info-grid">
          {/* WALLET KEYS */}
          <div className="info-card">
            <h3 className="card-title">Stellar Address & Configuration</h3>
            <div className="key-group">
              <label>Federated Username</label>
              <div className="key-display highlight-text">
                {user.username ? `${user.username}*stellapp.com` : 'No username set yet. Set in chat!'}
              </div>
            </div>
            <div className="key-group">
              <label>Stellar Public Key</label>
              <div className="key-display-copy">
                <code>{user.stellarPublic}</code>
                <button onClick={() => handleCopy(user.stellarPublic, 'stellar')} className="copy-btn">
                  {copiedKey === 'stellar' ? 'Copied! ✅' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="key-group">
              <label>Base Sepolia EVM Address</label>
              <div className="key-display-copy">
                <code>{user.evmAddress}</code>
                <button onClick={() => handleCopy(user.evmAddress, 'evm')} className="copy-btn">
                  {copiedKey === 'evm' ? 'Copied! ✅' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* RECENT CONTACTS */}
          <div className="info-card">
            <h3 className="card-title">WhatsApp Contacts</h3>
            <div className="contacts-list">
              {user.contacts.length === 0 ? (
                <div className="empty-contacts">
                  <p>No contacts saved yet.</p>
                  <span className="hint">Try sending "/save [name] [phone]" in WhatsApp!</span>
                </div>
              ) : (
                user.contacts.map((c) => (
                  <div className="contact-item" key={c.id}>
                    <div className="contact-avatar">{c.name.substring(0, 2).toUpperCase()}</div>
                    <div className="contact-details">
                      <h4>{c.name}</h4>
                      <p>{c.phoneNumber}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
