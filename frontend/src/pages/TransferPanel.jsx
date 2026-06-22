import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function TransferPanel() {
  const { transferMoney } = useApp();
  const [accNum, setAccNum] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [transferType, setTransferType] = useState('account'); // 'account' or 'iban'

  const handleTransfer = async () => {
    const ok = await transferMoney(accNum, parseFloat(amount), pin);
    if (ok) { setAccNum(''); setAmount(''); setPin(''); }
  };

  return (
    <div>
      <div className="section-title">💸 Bank Transfer</div>
      <div className="card" style={{ maxWidth: 500 }}>
        <div className="form-group" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input type="radio" name="transferType" checked={transferType === 'account'} onChange={() => setTransferType('account')} />
            Account Number
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input type="radio" name="transferType" checked={transferType === 'iban'} onChange={() => setTransferType('iban')} />
            IBAN Number
          </label>
        </div>
        <div className="form-group">
          <label>Receiver's {transferType === 'account' ? "Account Number" : "IBAN Number"}</label>
          <input type="text" placeholder={transferType === 'account' ? "e.g. ACC2" : "e.g. PK00BANK2"} value={accNum} onChange={e => setAccNum(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Amount (PKR)</label>
          <input type="number" placeholder="1000" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Your 4-Digit PIN</label>
          <input type="password" placeholder="••••" maxLength="4" value={pin} onChange={e => setPin(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleTransfer}>Send Money ↗</button>
      </div>
    </div>
  );
}
