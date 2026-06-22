import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function VirtualCardPanel() {
  const { currentCustomer, getCardDetails } = useApp();
  const [pin, setPin] = useState('');
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const handleReveal = async () => {
    setLoading(true);
    const data = await getCardDetails(pin);
    if (data) {
      setCard(data);
      setShowFull(true);
    }
    setLoading(false);
  };

  const formatCardNumber = (num) => {
    if (!num) return '•••• •••• •••• ••••';
    const clean = num.replace(/\s/g, '');
    const groups = clean.match(/.{1,4}/g) || [];
    if (showFull) return groups.join(' ');
    // Mask first 12 digits
    return groups.map((g, i) => i < 3 ? '••••' : g).join(' ');
  };

  const maskedCardFromLogin = currentCustomer?.maskedCardNumber;

  return (
    <div>
      <div className="section-title">💳 Virtual Debit Card</div>

      {/* Card Visual */}
      <div className="virtual-card">
        <div className="vc-chip">
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
            <rect x="1" y="1" width="34" height="26" rx="4" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
            <line x1="1" y1="10" x2="35" y2="10" stroke="#D4AF37" strokeWidth="1"/>
            <line x1="1" y1="18" x2="35" y2="18" stroke="#D4AF37" strokeWidth="1"/>
            <line x1="12" y1="1" x2="12" y2="27" stroke="#D4AF37" strokeWidth="1"/>
            <line x1="24" y1="1" x2="24" y2="27" stroke="#D4AF37" strokeWidth="1"/>
          </svg>
        </div>
        <div className="vc-number mono">
          {card ? formatCardNumber(card.cardNumber) : (maskedCardFromLogin ? formatCardNumber(maskedCardFromLogin) : '•••• •••• •••• ••••')}
        </div>
        <div className="vc-bottom">
          <div className="vc-holder">
            <div className="vc-label">CARD HOLDER</div>
            <div className="vc-value">{currentCustomer?.name?.toUpperCase() || 'CUSTOMER'}</div>
          </div>
          <div className="vc-expiry">
            <div className="vc-label">EXPIRES</div>
            <div className="vc-value">{card?.cardExpiry || currentCustomer?.cardExpiry || '••/••'}</div>
          </div>
          <div className="vc-cvv-box">
            <div className="vc-label">CVV</div>
            <div className="vc-value">{showFull && card ? card.cvv : '•••'}</div>
          </div>
        </div>
        <div className="vc-brand">VAULTY</div>
      </div>

      {/* PIN to reveal */}
      {!card ? (
        <div className="card" style={{ maxWidth: 450, marginTop: 24 }}>
          <p style={{ color: 'var(--slate)', fontSize: '.9rem', marginBottom: 16 }}>
            Enter your 4-digit PIN to reveal full card details.
          </p>
          <div className="form-group">
            <label>Your 4-Digit PIN</label>
            <input
              type="password"
              placeholder="••••"
              maxLength="4"
              value={pin}
              onChange={e => setPin(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleReveal} disabled={loading}>
            {loading ? 'Verifying...' : 'Reveal Card Details 🔓'}
          </button>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: 450, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: 'var(--success)', fontSize: '.9rem', fontWeight: 600 }}>
              ✅ Card details revealed
            </p>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowFull(f => !f)}
            >
              {showFull ? '🙈 Mask' : '👁️ Show Full'}
            </button>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 12 }}
            onClick={() => { setCard(null); setPin(''); setShowFull(false); }}
          >
            🔒 Lock Card Details
          </button>
        </div>
      )}
    </div>
  );
}
