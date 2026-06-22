import { useState } from 'react';
import { useApp } from '../context/AppContext';

const DEPOSIT_METHODS = [
  { value: 'CASH', label: '💵 Cash Deposit' },
  { value: 'B2B_TRANSFER', label: '🏦 B2B Transfer' },
  { value: 'BANK_LOAN', label: '📋 Bank Loan' },
];

export default function DepositPanel() {
  const { depositMoney } = useApp();
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [depositMethod, setDepositMethod] = useState('CASH');

  const handleDeposit = async () => {
    const ok = await depositMoney(parseFloat(amount), pin, depositMethod);
    if (ok) { setAmount(''); setPin(''); setDepositMethod('CASH'); }
  };

  return (
    <div>
      <div className="section-title">💳 Deposit Cash</div>
      <div className="card" style={{ maxWidth: 450 }}>
        <div className="form-group">
          <label>Deposit Method</label>
          <select value={depositMethod} onChange={e => setDepositMethod(e.target.value)}>
            {DEPOSIT_METHODS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount to Deposit (PKR)</label>
          <input type="number" placeholder="5000" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Your 4-Digit PIN</label>
          <input type="password" placeholder="••••" maxLength="4" value={pin} onChange={e => setPin(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleDeposit}>Deposit ✓</button>
      </div>
    </div>
  );
}
