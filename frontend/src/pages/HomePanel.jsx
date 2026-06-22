import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionList } from '../components/TransactionList';

export default function HomePanel() {
  const { currentCustomer, setActivePanel, getMyTransactions } = useApp();
  const [myTx, setMyTx] = useState([]);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    getMyTransactions().then(data => setMyTx((data || []).slice(-5).reverse()));
  }, [getMyTransactions]);

  return (
    <div>
      <div className="balance-card">
        <div className="balance-label">
          Available Balance
          <button
            className="eye-toggle"
            onClick={() => setBalanceVisible(v => !v)}
            title={balanceVisible ? 'Hide balance' : 'Show balance'}
            aria-label={balanceVisible ? 'Hide balance' : 'Show balance'}
          >
            {balanceVisible ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
        </div>
        <div className="balance-amount">
          <span className="currency">PKR</span>
          {balanceVisible
            ? currentCustomer?.balance.toLocaleString('en-PK', { minimumFractionDigits: 2 })
            : '••••••••'}
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
        <button className="qa-btn" onClick={() => setActivePanel('card')}>
          <div className="icon">🏧</div><div className="text">Virtual Card</div>
        </button>
      </div>

      <div className="section-title">Recent Transactions</div>
      <TransactionList transactions={myTx} />
    </div>
  );
}
