
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { logout } from '../authentication/logout';

jest.mock('../firebaseConfig', () => ({
    auth: {
      currentUser: null, // or mock user data as needed
      signOut: jest.fn(() => Promise.resolve()), // mock the signOut function
    },
}));

describe('Logout Functionality', () => {
  it('should call signOut function on button click', async () => {
    render(
      // Render your component or create a minimal mock component if necessary
    );

    // Call the logout function
    logout();

    // Wait for the asynchronous operation to complete
    await waitFor(() => {});

    // Assert that the signOut function was called

    expect(require('../firebaseConfig').auth.signOut).toHaveBeenCalled();
  });
});
