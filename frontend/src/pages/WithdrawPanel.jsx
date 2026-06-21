import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function WithdrawPanel() {
  const { withdrawMoney } = useApp();
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  const handleWithdraw = () => {
    const ok = withdrawMoney(parseFloat(amount), parseInt(pin));
    if (ok) { setAmount(''); setPin(''); }
  };

  return (
    <div>
      <div className="section-title">🏧 Withdraw Cash</div>
      <div className="card" style={{ maxWidth: 400 }}>
        <div className="form-group">
          <label>Amount to Withdraw (PKR)</label>
          <input type="number" placeholder="1000" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Your 4-Digit PIN</label>
          <input type="password" placeholder="••••" maxLength="4" value={pin} onChange={e => setPin(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}
