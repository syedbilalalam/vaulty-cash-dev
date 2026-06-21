import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionList } from '../components/TransactionList';

export default function HomePanel() {
  const { currentCustomer, setActivePanel, getMyTransactions } = useApp();
  const [myTx, setMyTx] = useState([]);

  useEffect(() => {
    getMyTransactions().then(data => setMyTx((data || []).slice(-5).reverse()));
  }, [getMyTransactions]);

  return (
    <div>
      <div className="balance-card">
        <div className="balance-label">Available Balance</div>
        <div className="balance-amount">
          <span className="currency">PKR</span>
          {currentCustomer?.balance.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
        </div>
        <div className="balance-meta">
          <div className="balance-meta-item">
            <div className="lbl">Account No.</div>
            <div className="val">{currentCustomer?.accountNumber}</div>
          </div>
          <div className="balance-meta-item">
            <div className="lbl">IBAN</div>
            <div className="val">{currentCustomer?.iban}</div>
          </div>
        </div>
      </div>

      <div className="section-title">Quick Actions</div>
      <div className="quick-actions">
        <button className="qa-btn" onClick={() => setActivePanel('transfer')}>
          <div className="icon">↗️</div><div className="text">Transfer</div>
        </button>
        <button className="qa-btn" onClick={() => setActivePanel('deposit')}>
          <div className="icon">💳</div><div className="text">Deposit</div>
        </button>
        <button className="qa-btn" onClick={() => setActivePanel('withdraw')}>
          <div className="icon">💸</div><div className="text">Withdraw</div>
        </button>
        <button className="qa-btn" onClick={() => setActivePanel('statement')}>
          <div className="icon">📄</div><div className="text">Statement</div>
        </button>
      </div>

      <div className="section-title">Recent Transactions</div>
      <TransactionList transactions={myTx} />
    </div>
  );
}
