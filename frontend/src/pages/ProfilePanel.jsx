import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function ProfilePanel() {
  const { currentCustomer, editInfo } = useApp();
  const c = currentCustomer;

  const [name, setName] = useState(c?.name || '');
  const [email, setEmail] = useState(c?.email || '');
  const [phone, setPhone] = useState(c?.phone || '');

  useEffect(() => {
    setName(c?.name || '');
    setEmail(c?.email || '');
    setPhone(c?.phone || '');
  }, [c]);

  const handleSave = () => editInfo(name, email, phone);

  return (
    <div>
      <div className="section-title">👤 My Profile</div>

      <div className="profile-header">
        <div className="avatar-lg">{c?.name?.[0]?.toUpperCase()}</div>
        <div className="profile-info">
          <h2>{c?.name}</h2>
          <p>{c?.email}</p>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-cell"><div className="lbl">Age</div><div className="val">{c?.age}</div></div>
        <div className="info-cell"><div className="lbl">Gender</div><div className="val">{c?.gender}</div></div>
        <div className="info-cell"><div className="lbl">Phone</div><div className="val">{c?.phone}</div></div>
        <div className="info-cell"><div className="lbl">Email</div><div className="val">{c?.email}</div></div>
        <div className="info-cell"><div className="lbl">Account No.</div><div className="val mono">{c?.accountNumber}</div></div>
        <div className="info-cell"><div className="lbl">IBAN</div><div className="val mono">{c?.iban}</div></div>
      </div>

      <div className="section-title" style={{ marginTop: 8 }}>Edit Information</div>
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="form-group">
          <label>New Name</label>
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>New Email</label>
          <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>New Phone Number</label>
          <input type="tel" placeholder="03XX-XXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}
