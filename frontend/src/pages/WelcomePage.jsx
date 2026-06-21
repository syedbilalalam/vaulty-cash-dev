import { useApp } from '../context/AppContext';

export default function WelcomePage() {
  const { setScreen } = useApp();
  return (
    <div id="screen-welcome" style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at 60% 30%, #0e2a4a 0%, var(--navy) 70%)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72,
        background: 'linear-gradient(135deg, var(--teal), var(--teal2))',
        borderRadius: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', margin: '0 auto 24px',
        boxShadow: '0 0 40px rgba(0,201,167,.25)',
      }}>🏦</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
        lineHeight: 1.1,
        marginBottom: 12,
      }}>
        Vaulty Cash<br /><span className="teal">Bank</span>
      </h1>
      <p style={{ color: 'var(--slate)', fontSize: '1.05rem', marginBottom: 40, maxWidth: 400 }}>
        Secure, modern banking at your fingertips. Manage accounts, transfers and statements — all in one place.
      </p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => setScreen('login')}>Sign In</button>
        <button className="btn btn-outline" onClick={() => setScreen('register')}>Open Account</button>
      </div>
    </div>
  );
}
