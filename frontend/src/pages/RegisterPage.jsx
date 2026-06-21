import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RegisterPage() {
  const { registerCustomer, setScreen } = useApp();
  const [form, setForm] = useState({
    name: '', age: '', gender: '', email: '', phone: '',
    password: '', pin: '', balance: '',
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    registerCustomer({
      ...form,
      age: parseInt(form.age),
      pin: parseInt(form.pin),
      balance: parseFloat(form.balance),
    });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Open an Account</h2>
        <p className="subtitle">Fill in your details — takes under a minute.</p>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="e.g. Muhammad Ali" value={form.name} onChange={set('name')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label>Age</label>
            <input type="number" placeholder="25" min="18" value={form.age} onChange={set('age')} />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select value={form.gender} onChange={set('gender')}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="03XX-XXXXXXX" value={form.phone} onChange={set('phone')} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label>4-Digit PIN</label>
            <input type="number" placeholder="1234" max="9999" min="1000" value={form.pin} onChange={set('pin')} />
          </div>
          <div className="form-group">
            <label>Initial Balance (PKR)</label>
            <input type="number" placeholder="5000" min="0" value={form.balance} onChange={set('balance')} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
          Create Account
        </button>
        <div className="auth-footer">
          Already have an account?{' '}
          <a onClick={() => setScreen('login')}>Sign in</a>
        </div>
      </div>
    </div>
  );
}
