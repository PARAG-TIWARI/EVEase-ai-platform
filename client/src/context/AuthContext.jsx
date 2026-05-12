import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // For frontend template logic, we will mock login based on explicit selections.
  const login = (username, selectedRole) => {
    let role = 'user';
    let isPremium = false;

    if (selectedRole === 'admin') {
      role = 'admin';
    } else if (selectedRole === 'premium') {
      role = 'user';
      isPremium = true;
    }

    setUser({
      username: username,
      role: role,
      isPremium: isPremium
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
