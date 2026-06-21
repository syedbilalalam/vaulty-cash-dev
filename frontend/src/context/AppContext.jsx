import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [screen, setScreen] = useState('welcome'); // welcome | register | login | dashboard
  const [activePanel, setActivePanel] = useState('home');
  const [toast, setToast] = useState({ msg: '', type: '', visible: false });
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = 'info') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3200);
  }, []);

  const showScreen = useCallback((name) => {
    setScreen(name);
    if (name === 'dashboard') setActivePanel('home');
  }, []);

  const registerCustomer = useCallback((data) => {
    const { name, age, gender, email, phone, password, pin, balance } = data;
    if (!name || !age || !gender || !email || !phone || !password || !pin) {
      showToast('Please fill in all fields.', 'error'); return;
    }
    if (password.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }
    if (pin < 1000 || pin > 9999) { showToast('PIN must be exactly 4 digits.', 'error'); return; }
    if (age < 18) { showToast('You must be at least 18 years old.', 'error'); return; }
    if (customers.find(c => c.phone === phone)) { showToast('Phone number already registered.', 'error'); return; }

    const accountNumber = 'ACC' + (customers.length + 1);
    const iban = 'PK00BANK' + (customers.length + 1);
    const newCustomer = { name, age, gender, email, phone, password, pin: Number(pin), balance: Number(balance) || 0, accountNumber, iban };
    setCustomers(prev => [...prev, newCustomer]);
    showToast(`Account created! Your Account No: ${accountNumber}`, 'success');
    showScreen('login');
  }, [customers, showToast, showScreen]);

  const loginCustomer = useCallback((phone, password) => {
    const c = customers.find(x => x.phone === phone && x.password === password);
    if (!c) { showToast('Incorrect phone number or password.', 'error'); return; }
    setCurrentCustomer(c);
    showToast(`Welcome back, ${c.name}!`, 'success');
    showScreen('dashboard');
  }, [customers, showToast, showScreen]);

  const logout = useCallback(() => {
    const name = currentCustomer?.name;
    setCurrentCustomer(null);
    showToast(`${name} signed out.`, 'info');
    showScreen('welcome');
  }, [currentCustomer, showToast, showScreen]);

  const updateCurrentCustomer = useCallback((updates) => {
    setCurrentCustomer(prev => ({ ...prev, ...updates }));
    setCustomers(prev => prev.map(c => c.accountNumber === currentCustomer?.accountNumber ? { ...c, ...updates } : c));
  }, [currentCustomer]);

  const transferMoney = useCallback((accNum, amount, pin) => {
    if (!accNum || isNaN(amount) || isNaN(pin)) { showToast('Fill in all fields.', 'error'); return false; }
    if (amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }
    if (currentCustomer.pin !== Number(pin)) { showToast('Incorrect PIN.', 'error'); return false; }
    if (accNum === currentCustomer.accountNumber) { showToast('You cannot transfer to your own account.', 'error'); return false; }
    const receiver = customers.find(c => c.accountNumber === accNum);
    if (!receiver) { showToast('Account not found.', 'error'); return false; }
    if (currentCustomer.balance < amount) { showToast('Insufficient balance.', 'error'); return false; }

    const newBalance = currentCustomer.balance - amount;
    setCustomers(prev => prev.map(c => {
      if (c.accountNumber === currentCustomer.accountNumber) return { ...c, balance: newBalance };
      if (c.accountNumber === accNum) return { ...c, balance: c.balance + amount };
      return c;
    }));
    setCurrentCustomer(prev => ({ ...prev, balance: newBalance }));
    setTransactions(prev => [...prev, { senderName: currentCustomer.name, receiverName: receiver.name, amount, type: 'Bank Transfer' }]);
    showToast(`PKR ${amount.toLocaleString()} sent to ${receiver.name}.`, 'success');
    return true;
  }, [currentCustomer, customers, showToast]);

  const depositMoney = useCallback((amount) => {
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }
    const newBalance = currentCustomer.balance + amount;
    setCurrentCustomer(prev => ({ ...prev, balance: newBalance }));
    setCustomers(prev => prev.map(c => c.accountNumber === currentCustomer.accountNumber ? { ...c, balance: newBalance } : c));
    setTransactions(prev => [...prev, { senderName: 'Cash Deposit', receiverName: currentCustomer.name, amount, type: 'Deposit' }]);
    showToast(`PKR ${amount.toLocaleString()} deposited. New balance: PKR ${newBalance.toLocaleString('en-PK', { minimumFractionDigits: 2 })}.`, 'success');
    return true;
  }, [currentCustomer, showToast]);

  const withdrawMoney = useCallback((amount, pin) => {
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }
    if (isNaN(pin)) { showToast('Enter your PIN.', 'error'); return false; }
    if (currentCustomer.balance < amount) { showToast('Insufficient balance.', 'error'); return false; }
    if (currentCustomer.pin !== Number(pin)) { showToast('Incorrect PIN.', 'error'); return false; }
    const newBalance = currentCustomer.balance - amount;
    setCurrentCustomer(prev => ({ ...prev, balance: newBalance }));
    setCustomers(prev => prev.map(c => c.accountNumber === currentCustomer.accountNumber ? { ...c, balance: newBalance } : c));
    setTransactions(prev => [...prev, { senderName: currentCustomer.name, receiverName: 'Cash Withdrawal', amount, type: 'Withdraw' }]);
    showToast(`PKR ${amount.toLocaleString()} withdrawn. Remaining: PKR ${newBalance.toLocaleString('en-PK', { minimumFractionDigits: 2 })}.`, 'success');
    return true;
  }, [currentCustomer, showToast]);

  const changePassword = useCallback((oldPwd, newPwd, confirm) => {
    if (!oldPwd || !newPwd || !confirm) { showToast('Fill all fields.', 'error'); return false; }
    if (currentCustomer.password !== oldPwd) { showToast('Current password is incorrect.', 'error'); return false; }
    if (newPwd.length < 6) { showToast('New password must be at least 6 characters.', 'error'); return false; }
    if (newPwd !== confirm) { showToast('Passwords do not match.', 'error'); return false; }
    updateCurrentCustomer({ password: newPwd });
    showToast('Password changed successfully.', 'success');
    return true;
  }, [currentCustomer, updateCurrentCustomer, showToast]);

  const changePIN = useCallback((oldPin, newPin, confirm) => {
    if (isNaN(oldPin) || isNaN(newPin) || isNaN(confirm)) { showToast('Fill all fields.', 'error'); return false; }
    if (currentCustomer.pin !== Number(oldPin)) { showToast('Current PIN is incorrect.', 'error'); return false; }
    if (newPin < 1000 || newPin > 9999) { showToast('New PIN must be 4 digits.', 'error'); return false; }
    if (Number(newPin) !== Number(confirm)) { showToast('PINs do not match.', 'error'); return false; }
    updateCurrentCustomer({ pin: Number(newPin) });
    showToast('PIN changed successfully.', 'success');
    return true;
  }, [currentCustomer, updateCurrentCustomer, showToast]);

  const editInfo = useCallback((name, email, phone) => {
    if (!name || !email || !phone) { showToast('Fill all fields.', 'error'); return false; }
    updateCurrentCustomer({ name, email, phone });
    showToast('Information updated.', 'success');
    return true;
  }, [updateCurrentCustomer, showToast]);

  const getMyTransactions = useCallback(() => {
    return transactions.filter(t => t.senderName === currentCustomer?.name || t.receiverName === currentCustomer?.name);
  }, [transactions, currentCustomer]);

  return (
    <AppContext.Provider value={{
      customers, transactions, currentCustomer,
      screen, setScreen: showScreen,
      activePanel, setActivePanel,
      toast,
      registerCustomer, loginCustomer, logout,
      transferMoney, depositMoney, withdrawMoney,
      changePassword, changePIN, editInfo,
      getMyTransactions,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
