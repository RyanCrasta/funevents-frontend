import { NEXT_URL } from '@/config';
import { useRouter } from 'next/router';
import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// provider wraps around rest of our application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [error, setError] = useState({ message: '' });

  const router = useRouter();

  // Register User
  const register = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      setError(null);
      router.push('/');
    } else {
      setError({ message: data.message });
    }
  };

  // Login User
  const login = async ({ email, password }) => {
    const res = await fetch(`${NEXT_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      setError(null);
      router.push('/');
    } else {
      setError({ message: data.message });
    }
  };

  // Logout user
  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
      router.push('/');
    }
  };

  // check if user logged in, so that user persists
  // througout browser refreshes
  const checkUserLoggedIn = async () => {
    const res = await fetch(`${NEXT_URL}/api/user`, {
      method: 'GET',
    });

    const userdata = await res.json();

    if (res.ok) {
      setUser(userdata.user);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        register,
        login,
        logout,
        checkUserLoggedIn,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
