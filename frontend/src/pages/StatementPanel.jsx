import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionList } from '../components/TransactionList';

export default function StatementPanel() {
  const { getMyTransactions } = useApp();
  const [myTx, setMyTx] = useState([]);

  useEffect(() => {
    getMyTransactions().then(setMyTx);
  }, [getMyTransactions]);

  return (
    <div>
      <div className="section-title">📄 Account Statement</div>
      <TransactionList transactions={myTx} />
    </div>
  );
}
