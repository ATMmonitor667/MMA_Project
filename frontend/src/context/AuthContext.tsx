import { createContext, useContext, useState, useEffect } from 'react';
import { User, Wallet } from '../types';
import * as authApi from '../api/auth';
import { getWallet } from '../api/cards';

interface AuthContextType {
  user: User | null;
  token: string | null;
  wallet: Wallet | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('mma_token');
    const storedUser = localStorage.getItem('mma_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      authApi.getProfile()
        .then((data) => {
          setUser(data.data.user);
          return getWallet();
        })
        .then((data) => setWallet(data.data.wallet))
        .catch(() => {
          localStorage.removeItem('mma_token');
          localStorage.removeItem('mma_user');
          setUser(null);
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    const { user: u, token: t } = data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('mma_token', t);
    localStorage.setItem('mma_user', JSON.stringify(u));
    try {
      const walletData = await getWallet();
      setWallet(walletData.data.wallet);
    } catch {
      // wallet will be created on first use
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await authApi.register(username, email, password);
    const { user: u, token: t } = data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('mma_token', t);
    localStorage.setItem('mma_user', JSON.stringify(u));
    try {
      const walletData = await getWallet();
      setWallet(walletData.data.wallet);
    } catch {
      // wallet will be created on first use
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWallet(null);
    localStorage.removeItem('mma_token');
    localStorage.removeItem('mma_user');
  };

  const refreshWallet = async () => {
    try {
      const data = await getWallet();
      setWallet(data.data.wallet);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, wallet,
      isAuthenticated: !!user,
      isLoading,
      login, register, logout, refreshWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
