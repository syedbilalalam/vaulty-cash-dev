import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

const API_BASE = 'http://localhost:8080/api';

export function AppProvider({ children }) {
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

  // Helper for API calls
  const apiCall = useCallback(async (url, options = {}) => {
    try {
      const res = await fetch(`${API_BASE}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: 'Network error. Is the backend running?' };
    }
  }, []);

  // Refresh current customer data from backend
  const refreshCustomer = useCallback(async () => {
    if (!currentCustomer) return;
    const res = await apiCall(`/account/${currentCustomer.id}`);
    if (res.success) {
      setCurrentCustomer(res.data);
    }
  }, [currentCustomer, apiCall]);

  const registerCustomer = useCallback(async (data) => {
    const { name, age, gender, email, phone, password, pin, balance } = data;
    if (!name?.trim() || !age || !gender?.trim() || !email?.trim() || !phone?.trim() || !password?.trim() || pin === '' || pin === undefined || pin === null) {
      showToast('Please fill in all fields.', 'error'); return;
    }
    if (password.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }
    if (pin < 1000 || pin > 9999) { showToast('PIN must be exactly 4 digits.', 'error'); return; }
    if (age < 18) { showToast('You must be at least 18 years old.', 'error'); return; }

    const res = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, age: Number(age), gender, email, phone, password, pin: Number(pin), balance: Number(balance) || 0 }),
    });

    if (res.success) {
      showToast(res.message, 'success');
      showScreen('login');
    } else {
      showToast(res.message, 'error');
    }
  }, [showToast, showScreen, apiCall]);

  const loginCustomer = useCallback(async (phone, password) => {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });

    if (res.success) {
      setCurrentCustomer(res.data);
      showToast(`Welcome back, ${res.data.name}!`, 'success');
      showScreen('dashboard');
    } else {
      showToast(res.message, 'error');
    }
  }, [showToast, showScreen, apiCall]);

  const logout = useCallback(() => {
    const name = currentCustomer?.name;
    setCurrentCustomer(null);
    showToast(`${name} signed out.`, 'info');
    showScreen('welcome');
  }, [currentCustomer, showToast, showScreen]);

  const transferMoney = useCallback(async (accNum, amount, pin) => {
    if (!accNum || isNaN(amount) || isNaN(pin)) { showToast('Fill in all fields.', 'error'); return false; }
    if (amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }

    const res = await apiCall('/transaction/transfer', {
      method: 'POST',
      body: JSON.stringify({
        senderId: currentCustomer.id,
        receiverAccountNumber: accNum,
        amount: Number(amount),
        pin: Number(pin),
      }),
    });

    if (res.success) {
      showToast(res.message, 'success');
      await refreshCustomer();
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  }, [currentCustomer, showToast, apiCall, refreshCustomer]);

  const depositMoney = useCallback(async (amount) => {
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }

    const res = await apiCall('/transaction/deposit', {
      method: 'POST',
      body: JSON.stringify({ customerId: currentCustomer.id, amount: Number(amount) }),
    });

    if (res.success) {
      showToast(res.message, 'success');
      await refreshCustomer();
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  }, [currentCustomer, showToast, apiCall, refreshCustomer]);

  const withdrawMoney = useCallback(async (amount, pin) => {
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }
    if (isNaN(pin)) { showToast('Enter your PIN.', 'error'); return false; }

    const res = await apiCall('/transaction/withdraw', {
      method: 'POST',
      body: JSON.stringify({ customerId: currentCustomer.id, amount: Number(amount), pin: Number(pin) }),
    });

    if (res.success) {
      showToast(res.message, 'success');
      await refreshCustomer();
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  }, [currentCustomer, showToast, apiCall, refreshCustomer]);

  const changePassword = useCallback(async (oldPwd, newPwd, confirm) => {
    if (!oldPwd || !newPwd || !confirm) { showToast('Fill all fields.', 'error'); return false; }
    if (newPwd.length < 6) { showToast('New password must be at least 6 characters.', 'error'); return false; }
    if (newPwd !== confirm) { showToast('Passwords do not match.', 'error'); return false; }

    const res = await apiCall(`/account/${currentCustomer.id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd, confirmPassword: confirm }),
    });

    if (res.success) {
      showToast(res.message, 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  }, [currentCustomer, showToast, apiCall]);

  const changePIN = useCallback(async (oldPin, newPin, confirm) => {
    if (isNaN(oldPin) || isNaN(newPin) || isNaN(confirm)) { showToast('Fill all fields.', 'error'); return false; }

    const res = await apiCall(`/account/${currentCustomer.id}/pin`, {
      method: 'PUT',
      body: JSON.stringify({ oldPin: Number(oldPin), newPin: Number(newPin), confirmPin: Number(confirm) }),
    });

    if (res.success) {
      showToast(res.message, 'success');
      await refreshCustomer();
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  }, [currentCustomer, showToast, apiCall, refreshCustomer]);

  const editInfo = useCallback(async (name, email, phone) => {
    if (!name || !email || !phone) { showToast('Fill all fields.', 'error'); return false; }

    const res = await apiCall(`/account/${currentCustomer.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, email, phone }),
    });

    if (res.success) {
      setCurrentCustomer(res.data);
      showToast(res.message, 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  }, [currentCustomer, showToast, apiCall]);

  const getMyTransactions = useCallback(async () => {
    if (!currentCustomer) return [];
    const res = await apiCall(`/transaction/statement/${currentCustomer.id}`);
    if (res.success) {
      return res.data || [];
    }
    return [];
  }, [currentCustomer, apiCall]);

  return (
    <AppContext.Provider value={{
      currentCustomer,
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
