import { useApp } from '../context/AppContext';
import HomePanel from './HomePanel';
import TransferPanel from './TransferPanel';
import DepositPanel from './DepositPanel';
import WithdrawPanel from './WithdrawPanel';
import StatementPanel from './StatementPanel';
import VirtualCardPanel from './VirtualCardPanel';
import ProfilePanel from './ProfilePanel';
import SecurityPanel from './SecurityPanel';

const NAV_ITEMS = [
  { id: 'home',      icon: '🏠', label: 'Home' },
  { id: 'transfer',  icon: '↗️', label: 'Transfer' },
  { id: 'deposit',   icon: '💳', label: 'Deposit' },
  { id: 'withdraw',  icon: '💸', label: 'Withdraw' },
  { id: 'statement', icon: '📄', label: 'Statement' },
  { id: 'card',      icon: '🏧', label: 'Virtual Card' },
];

const SETTINGS_ITEMS = [
  { id: 'profile',  icon: '👤', label: 'Profile' },
  { id: 'security', icon: '🔒', label: 'Security' },
];

const PANEL_MAP = {
  home:      <HomePanel />,
  transfer:  <TransferPanel />,
  deposit:   <DepositPanel />,
  withdraw:  <WithdrawPanel />,
  statement: <StatementPanel />,
  card:      <VirtualCardPanel />,
  profile:   <ProfilePanel />,
  security:  <SecurityPanel />,
};

export default function DashboardPage() {
  const { currentCustomer, activePanel, setActivePanel, logout } = useApp();

  return (
    <div className="screen-dashboard">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-brand">
          <span className="mark">🏦</span>
          Vaulty Cash
        </div>
        <div className="topbar-user">
          <div className="topbar-user-info">
            <div className="name">{currentCustomer?.name}</div>
            <div className="acc mono">{currentCustomer?.accountNumber}</div>
          </div>
          <div className="avatar">{currentCustomer?.name?.[0]?.toUpperCase()}</div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="dash-body">
        {/* Sidenav */}
        <nav className="sidenav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePanel === item.id ? 'active' : ''}`}
              onClick={() => setActivePanel(item.id)}
            >
              <span className="nav-icon">{item.icon}</span> {item.label}
            </button>
          ))}

          <div className="sidenav-label">Settings</div>

          {SETTINGS_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePanel === item.id ? 'active' : ''}`}
              onClick={() => setActivePanel(item.id)}
            >
              <span className="nav-icon">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* Main panel */}
        <div className="main-panel">
          {PANEL_MAP[activePanel] || <HomePanel />}
        </div>
      </div>
    </div>
  );
}
