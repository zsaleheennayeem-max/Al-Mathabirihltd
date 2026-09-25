import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  adminProfile: any | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginDemoAdmin: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo admin token in session
    const demoUser = sessionStorage.getItem('equip_demo_admin');
    if (demoUser) {
      try {
        const parsed = JSON.parse(demoUser);
        setAdminProfile(parsed);
        setToken('demo_admin_preview_token');
      } catch (e) {
        sessionStorage.removeItem('equip_demo_admin');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          // Fetch admin profile
          const res = await fetch('/api/admin/me', {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setAdminProfile(data.dbUser || data.user);
          }
        } catch (err) {
          console.error('Error fetching auth token:', err);
        }
      } else {
        setUser(null);
        setToken(null);
        if (!sessionStorage.getItem('equip_demo_admin')) {
          setAdminProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      setUser(result.user);

      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminProfile(data.dbUser || data.user);
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginDemoAdmin = () => {
    const demoProfile = {
      id: 1,
      name: 'Executive Super Admin',
      email: 'admin@equipworkforce.com',
      role: 'super_admin',
    };
    sessionStorage.setItem('equip_demo_admin', JSON.stringify(demoProfile));
    setAdminProfile(demoProfile);
    setToken('demo_admin_preview_token');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      sessionStorage.removeItem('equip_demo_admin');
      setUser(null);
      setToken(null);
      setAdminProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        token,
        loading,
        loginWithGoogle,
        logout,
        loginDemoAdmin,
        isAdmin: Boolean(adminProfile || user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
