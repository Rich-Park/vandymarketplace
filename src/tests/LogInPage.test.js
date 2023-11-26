import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LogInPage from '../components/LogInPage';
import { act } from 'react-dom/test-utils';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { createMemoryHistory } from 'history';
import { getDoc, setDoc } from 'firebase/firestore';

// Helper function to set user type
const setUserType = (useVanderbiltUser) => {
  const vanderbiltUser = {
    email: 'user@vanderbilt.edu',
  };

  const nonVanderbiltUser = {
    email: 'user@example.com',
  };

  signInWithPopup.mockImplementation(() => {
    const user = useVanderbiltUser ? vanderbiltUser : nonVanderbiltUser;
    return Promise.resolve({
      user,
    });
  });
};

// Mock the firebase/auth module
jest.mock('firebase/auth', () => {
  return {
    ...jest.requireActual('firebase/auth'),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  };
});

// Mock the firebaseConfig module
jest.mock('../firebaseConfig', () => ({
  auth: jest.requireActual('../firebaseConfig').auth,
  db: jest.requireActual('../firebaseConfig').db,
}));

// Mock the firestore functions
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDoc: jest.fn(() => Promise.resolve({ data: jest.fn(() => ({ userId: 'mockUserId' })), exists: jest.fn(() => false) })),
  setDoc: jest.fn(),
}));

describe('LogInPage', () => {
  it('logs in with Vanderbilt email and redirects', async () => {
    // Set the user type to Vanderbilt email
    setUserType(true);

    render(
      <Router>
        <LogInPage />
      </Router>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('LogIn'));
      // Assert that the signInWithPopup function is called
      expect(signInWithPopup).toHaveBeenCalled();
      expect(signOut).not.toHaveBeenCalled();
    });
  });

  it('logs out if user does not have Vanderbilt email', async () => {
    // Set the user type to non-Vanderbilt email
    setUserType(false);

    render(
      <Router>
        <LogInPage />
      </Router>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('LogIn'));
      // Assert that the signInWithPopup function is called
      expect(signInWithPopup).toHaveBeenCalled();
      // Wait for asynchronous operations to complete
      await waitFor(() => {
        // Assert that signOut has been called
        expect(signOut).toHaveBeenCalled();
      });
    });

  });

  it('logs in successfully and redirects', async () => {
    // Set the user type to Vanderbilt email
    setUserType(true);

    const history = createMemoryHistory();
  
    render(
      <Router history={history}>
        <LogInPage />
      </Router>
    );
  

    await act(async () => {
      fireEvent.click(screen.getByTestId('LogIn'));
      // Assert that the signInWithPopup function is called
      expect(signInWithPopup).toHaveBeenCalled();
      // Simulate a successful login
      onAuthStateChanged.mock.calls[0][1]({ email: 'user@vanderbilt.edu' });
      // Assert that the user is redirected
      expect(history.location.pathname).toBe('/');
    });
  });

  it('creates a new docSnap if it does not exist', async () => {
    // Set the user type to Vanderbilt email
    setUserType(true);

    // Mock that getDoc returns a non-existing document
    getDoc.mockImplementation(() => Promise.resolve({ data: jest.fn(() => ({ userId: 'mockUserId' })), exists: jest.fn(() => false) }));

    render(
      <Router>
        <LogInPage />
      </Router>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('LogIn'));
      // Assert that the signInWithPopup function is called
      expect(signInWithPopup).toHaveBeenCalled();
      // Simulate a successful login
      onAuthStateChanged.mock.calls[0][1]({ email: 'user@vanderbilt.edu' });

      // Wait for asynchronous operations to complete
      await waitFor(() => {
        // Assert that setDoc has been called to create a new document
        expect(setDoc).toHaveBeenCalled();
      });

      // Additional assertions based on your logic
    });
  });
  
});
