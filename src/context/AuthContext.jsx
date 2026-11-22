import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../api/auth';
import { TOKEN_KEY } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(token));

  const persist = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.me();
        if (active) setUser(response.data.user);
      } catch {
        if (active) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, []); // hydrate once on mount

  const login = useCallback(
    async (credentials) => {
      const response = await authAPI.login(credentials);
      persist(response.data.token, response.data.user);
      return response.data.user;
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      const response = await authAPI.register(payload);
      persist(response.data.token, response.data.user);
      return response.data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const clearSession = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('tutorly:unauthorized', clearSession);
    return () => window.removeEventListener('tutorly:unauthorized', clearSession);
  }, []);

  const updateUser = useCallback((changes) => {
    setUser((current) => ({ ...current, ...changes }));
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, updateUser }),
    [user, token, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
