import { useApp } from '../context/AppContext';
import { TransactionList } from '../components/TransactionList';

export default function StatementPanel() {
  const { getMyTransactions } = useApp();
  const myTx = getMyTransactions();

  return (
    <div>
      <div className="section-title">📄 Account Statement</div>
      <TransactionList transactions={myTx} />
    </div>
  );
}
