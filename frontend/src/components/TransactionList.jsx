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
  const { cls, icon, sign, desc } = getTxInfo(t, currentCustomer);
  return (
    <div className="tx-item">
      <div className={`tx-icon ${cls}`}>{icon}</div>
      <div className="tx-info">
        <div className="tx-desc">{desc}</div>
        <div className="tx-sub">{t.type}</div>
      </div>
      <div className={`tx-amount ${cls}`}>
        {sign}PKR {t.amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
      </div>
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
