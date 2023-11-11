import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LogInPage from '../components/LogInPage';
import { act } from 'react-dom/test-utils';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

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

describe('LogInPage', () => {
  it('logs in with Vanderbilt email and redirects', async () => {
    // Set the user type to Vanderbilt email
    setUserType(true);

    render(
      <Router>
        <LogInPage />
      </Router>
    );

    fireEvent.click(screen.getByTestId('LogIn'));

    expect(signInWithPopup).toHaveBeenCalled();
    expect(signOut).not.toHaveBeenCalled();

  });

  it('logs out if user does not have Vanderbilt email', async () => {
    // Set the user type to non-Vanderbilt email
    setUserType(false);

    render(
      <Router>
        <LogInPage />
      </Router>
    );

    fireEvent.click(screen.getByTestId('LogIn'));

    // Assert that the signInWithPopup function is called
    expect(signInWithPopup).toHaveBeenCalled();

    await waitFor(() => {
        // Assert that signOut has been called
        expect(signOut).toHaveBeenCalled();
    });

  });
});