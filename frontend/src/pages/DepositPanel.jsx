import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function DepositPanel() {
  const { depositMoney } = useApp();
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    const ok = depositMoney(parseFloat(amount));
    if (ok) setAmount('');
  };

  return (
    <div>
      <div className="section-title">💳 Deposit Cash</div>
      <div className="card" style={{ maxWidth: 400 }}>
        <div className="form-group">
          <label>Amount to Deposit (PKR)</label>
          <input type="number" placeholder="5000" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleDeposit}>Deposit ✓</button>
      </div>
    </div>
  );
}
