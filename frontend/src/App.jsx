import { AppProvider, useApp } from './context/AppContext';
import Toast from './components/Toast';
import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

function AppRouter() {
  const { screen } = useApp();
  return (
    <>
      <Toast />
      {screen === 'welcome'   && <WelcomePage />}
      {screen === 'register'  && <RegisterPage />}
      {screen === 'login'     && <LoginPage />}
      {screen === 'dashboard' && <DashboardPage />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
