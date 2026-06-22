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
      showToast('Please fill in all fields.', 'error'); return false;
    }
    
    // Auto-format phone: if user typed 10 digits (e.g. 3001234567), prepend 0 to make it 11 digits (03001234567)
    let processedPhone = phone.replace(/\s/g, '');
    if (processedPhone.length === 10 && processedPhone.startsWith('3')) {
      processedPhone = '0' + processedPhone;
    }

    if (!/^\d{11}$/.test(processedPhone)) {
      showToast('Phone number must be exactly 11 digits (e.g. 03XXXXXXXXX).', 'error'); return false;
    }
    if (password.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return false; }
    if (!/^\d{4}$/.test(pin)) { showToast('PIN must be exactly 4 digits.', 'error'); return false; }
    if (age < 18) { showToast('You must be at least 18 years old.', 'error'); return false; }

    const res = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, age: Number(age), gender, email, phone: processedPhone, password, pin: pin.toString(), balance: Number(balance) || 0 }),
    });

    if (res.success) {
      showToast(res.message, 'success');
      showScreen('login');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
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
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  }, [showToast, showScreen, apiCall]);

  const logout = useCallback(() => {
    const name = currentCustomer?.name;
    setCurrentCustomer(null);
    showToast(`${name} signed out.`, 'info');
    showScreen('welcome');
  }, [currentCustomer, showToast, showScreen]);

  const transferMoney = useCallback(async (accNum, amount, pin) => {
    if (!accNum || isNaN(amount) || !pin) { showToast('Fill in all fields.', 'error'); return false; }
    if (amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }

    const res = await apiCall('/transaction/transfer', {
      method: 'POST',
      body: JSON.stringify({
        senderId: currentCustomer.id,
        receiverIdentifier: accNum,
        amount: Number(amount),
        pin: pin.toString(),
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

  const depositMoney = useCallback(async (amount, pin, depositMethod) => {
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount.', 'error'); return false; }
    if (!pin) { showToast('Enter your PIN.', 'error'); return false; }

    const res = await apiCall('/transaction/deposit', {
      method: 'POST',
      body: JSON.stringify({ customerId: currentCustomer.id, amount: Number(amount), pin: pin.toString(), depositMethod }),
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
    if (!pin) { showToast('Enter your PIN.', 'error'); return false; }

    const res = await apiCall('/transaction/withdraw', {
      method: 'POST',
      body: JSON.stringify({ customerId: currentCustomer.id, amount: Number(amount), pin: pin.toString() }),
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
    if (!oldPin || !newPin || !confirm) { showToast('Fill all fields.', 'error'); return false; }

    const res = await apiCall(`/account/${currentCustomer.id}/pin`, {
      method: 'PUT',
      body: JSON.stringify({ oldPin: oldPin.toString(), newPin: newPin.toString(), confirmPin: confirm.toString() }),
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

  const getCardDetails = useCallback(async (pin) => {
    if (!pin) { showToast('Enter your PIN.', 'error'); return null; }
    const res = await apiCall(`/account/${currentCustomer.id}/card`, {
      method: 'POST',
      body: JSON.stringify({ customerId: currentCustomer.id, pin: pin.toString() }),
    });
    if (res.success) {
      return res.data;
    } else {
      showToast(res.message, 'error');
      return null;
    }
  }, [currentCustomer, showToast, apiCall]);

  return (
    <AppContext.Provider value={{
      currentCustomer,
      screen, setScreen: showScreen,
      activePanel, setActivePanel,
      toast,
      registerCustomer, loginCustomer, logout,
      transferMoney, depositMoney, withdrawMoney,
      changePassword, changePIN, editInfo,
      getMyTransactions, getCardDetails,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
