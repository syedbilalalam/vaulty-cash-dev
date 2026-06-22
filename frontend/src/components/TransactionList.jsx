import { useState } from 'react';
import { useApp } from '../context/AppContext';

function getTxInfo(t, currentCustomer) {
  const isDeposit  = t.type === 'Deposit';
  const isWithdraw = t.type === 'Withdraw';
  const isCredit   = t.receiverName === currentCustomer?.name && !isWithdraw;
  const cls        = isDeposit ? 'credit' : isWithdraw ? 'debit' : isCredit ? 'credit' : 'transfer';
  const icons      = { credit: '⬇️', debit: '⬆️', transfer: '↔️' };
  const sign       = isDeposit ? '+' : isWithdraw ? '-' : isCredit ? '+' : '-';
  const desc       = t.type === 'Deposit'   ? 'Cash Deposit'
                   : t.type === 'Withdraw'  ? 'Cash Withdrawal'
                   : isCredit               ? `Received from ${t.senderName}`
                   :                          `Sent to ${t.receiverName}`;
  return { cls, icon: icons[cls] || '↔️', sign, desc };
}

export function TransactionItem({ t }) {
  const { currentCustomer } = useApp();
  const [expanded, setExpanded] = useState(false);
  const { cls, icon, sign, desc } = getTxInfo(t, currentCustomer);
  
  const formatDate = (ts) => {
    if (!ts) return "Unknown Date";
    const d = new Date(ts);
    return d.toLocaleString();
  };

  return (
    <div className={`tx-item-container ${expanded ? 'expanded' : ''}`}>
      <div className="tx-item" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <div className={`tx-icon ${cls}`}>{icon}</div>
        <div className="tx-info">
          <div className="tx-desc">{desc}</div>
          <div className="tx-sub">{t.type} {expanded ? '▲' : '▼'}</div>
        </div>
        <div className={`tx-amount ${cls}`}>
          {sign}PKR {t.amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
        </div>
      </div>
      {expanded && (
        <div className="tx-details" style={{ padding: '15px', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--slate)' }}>
          <div style={{ marginBottom: '8px' }}><strong>Time of transfer:</strong> {formatDate(t.timestamp)}</div>
          <div style={{ marginBottom: '8px' }}><strong>Amount:</strong> PKR {t.amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</div>
          <div style={{ marginBottom: '8px' }}>
            {t.type === 'Deposit' ? (
              <>
                <strong>Transfer from:</strong> {t.depositMethod === 'B2B_TRANSFER' ? 'B2B Transfer' : t.depositMethod === 'BANK_LOAN' ? 'Bank Loan' : 'Cash Deposit'}
              </>
            ) : (
              <>
                <strong>Transfer from:</strong><br />
                Name: {t.senderName}<br />
                Account No: {t.senderAccountNumber || 'N/A'}<br />
                IBAN Number: {t.senderIban || 'N/A'}
              </>
            )}
          </div>
          <div>
            <strong>Transfer to:</strong><br />
            Name: {t.receiverName}<br />
            Account No: {t.receiverAccountNumber || 'N/A'}<br />
            IBAN Number: {t.receiverIban || 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
}

export function TransactionList({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <div className="tx-empty">No transactions yet.</div>;
  }
  return (
    <div className="tx-list">
      {transactions.map((t, i) => <TransactionItem key={i} t={t} />)}
    </div>
  );
}
