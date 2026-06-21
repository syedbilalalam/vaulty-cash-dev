import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SecurityPanel() {
  const { changePassword, changePIN } = useApp();

  const [pwd, setPwd] = useState({ old: '', new: '', confirm: '' });
  const [pin, setPin] = useState({ old: '', new: '', confirm: '' });

  const handleChangePwd = async () => {
    const ok = await changePassword(pwd.old, pwd.new, pwd.confirm);
    if (ok) setPwd({ old: '', new: '', confirm: '' });
  };

  const handleChangePin = async () => {
    const ok = await changePIN(pin.old, pin.new, pin.confirm);
    if (ok) setPin({ old: '', new: '', confirm: '' });
  };

  return (
    <div>
      <div className="section-title">🔒 Security</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>

        {/* Change Password */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>Change Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" placeholder="Current password" value={pwd.old} onChange={e => setPwd(p => ({ ...p, old: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="New password" value={pwd.new} onChange={e => setPwd(p => ({ ...p, new: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" placeholder="Repeat new password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleChangePwd}>Update Password</button>
        </div>

        {/* Change PIN */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>Change PIN</h3>
          <div className="form-group">
            <label>Current PIN</label>
            <input type="password" placeholder="••••" maxLength="4" value={pin.old} onChange={e => setPin(p => ({ ...p, old: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>New PIN</label>
            <input type="password" placeholder="••••" maxLength="4" value={pin.new} onChange={e => setPin(p => ({ ...p, new: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Confirm New PIN</label>
            <input type="password" placeholder="••••" maxLength="4" value={pin.confirm} onChange={e => setPin(p => ({ ...p, confirm: e.target.value }))} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleChangePin}>Update PIN</button>
        </div>

      </div>
    </div>
  );
}
