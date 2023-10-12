import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // User data 

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token) {
      // If authenticated, set the user data in the context
      setUser({ token, userId }); 
    }
  }, []);

  const login = (userData) => {
    //store the token in localStorage for persistence
    localStorage.setItem('token', userData.token);
    
    //set the user data in context
    setUser(userData);
  };

  const logout = () => {

    // Remove the user data from state and localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    //set to default value
    setUser(null);

  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
