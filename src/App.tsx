import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { CarRegistration } from './pages/CarRegistration';
import { User } from './types';
import { storageUtils } from './utils/storage';

type AppState = 'registration' | 'login' | 'car-registration';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('registration');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = storageUtils.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentState('car-registration');
    }
  }, []);

  const handleRegistrationComplete = () => {
    setCurrentState('login');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentState('car-registration');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentState('login');
  };

  const handleGoToRegistration = () => {
    setCurrentState('registration');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            currentState === 'registration' ? (
              <Registration onRegistrationComplete={handleRegistrationComplete} />
            ) : currentState === 'login' ? (
              <Login 
                onLoginSuccess={handleLoginSuccess} 
                onGoToRegistration={handleGoToRegistration}
              />
            ) : currentUser ? (
              <CarRegistration user={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;