import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { loginCustomer, setScreen } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const ok = await loginCustomer(phone, password);
    setLoading(false);
    if (ok) {
      setPhone('');
      setPassword('');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in with your phone number and password.</p>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="03XX-XXXXXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={handleLogin}>
          Sign In
        </button>
        <div className="auth-footer">
          No account yet? <a onClick={() => setScreen('register')}>Open one free</a>
        </div>
        <div className="auth-footer" style={{ marginTop: 6 }}>
          <a onClick={() => setScreen('welcome')}>← Back to home</a>
        </div>
      </div>
    </div>
  );
}
