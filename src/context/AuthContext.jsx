import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setUser as saveUser, isLoggedIn as checkLoggedIn, setLoggedIn, registerUser, loginUser, loginDemoUser, initializeUserData, logoutUser as doLogout, getSettings, setSettings as saveSettings } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettingsState] = useState({ darkMode: true, currency: 'INR', notifications: true });

  useEffect(() => {
    if (checkLoggedIn()) {
      const u = getUser();
      if (u) { setUser(u); setSettingsState(getSettings(u.id)); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  const handleAuth = (result) => {
    if (result.success) {
      const u = { ...result.user }; delete u.password;
      setUser(u); saveUser(u); setLoggedIn(true);
      initializeUserData(u.id); setSettingsState(getSettings(u.id));
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{
      user, setUser: (u) => { setUser(u); saveUser(u); }, loading,
      login: (e, p) => handleAuth(loginUser(e, p)),
      register: (n, e, p) => handleAuth(registerUser(n, e, p)),
      demoLogin: () => { const u = loginDemoUser(); handleAuth({success:true, user:u}); },
      logout: () => { doLogout(); setUser(null); },
      settings, updateSettings: (s) => { setSettingsState(s); if(user) saveSettings(user.id, s); }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);