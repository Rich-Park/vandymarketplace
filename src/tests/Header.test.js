import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header';
import * as dataload from '../firebaseFunctions/dataload';
import { useNavigate } from 'react-router-dom';

dataload.getUserID = jest.fn(() => Promise.resolve('user'));

jest.mock('../authentication/logout', () => ({
  logout: jest.fn(),
}));

// Mocking auth object for testing
jest.mock('../firebaseConfig', () => ({
  auth: {
    currentUser: {
      photoURL: 'mocked_user_image_url',
    },
  },
}));

// Mocking the navigate function for react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Header component', () => {
  test('Header component displays the app name and buttons', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const appNameElement = screen.getByText('Vandy Market');
    expect(appNameElement).toBeTruthy();

    const sellItemButton = screen.getByText('Sell Item');
    expect(sellItemButton).toBeTruthy();

    const userImage = screen.getByRole('img');
    expect(userImage).toBeTruthy();
  });

  test('Header component shows user options when menu button is clicked', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const menuButton = screen.getByRole('img');
    fireEvent.click(menuButton);

    const homeMenuItem = screen.getByText('Home');
    const favoritesMenuItem = screen.getByText('Favorites');
    const myItemsMenuItem = screen.getByText('My Items');
    const logOutMenuItem = screen.getByText('Log Out');

    expect(homeMenuItem).toBeTruthy();
    expect(favoritesMenuItem).toBeTruthy();
    expect(myItemsMenuItem).toBeTruthy();
    expect(logOutMenuItem).toBeTruthy();
  });

//   test('Header component handles log out when Log Out is clicked', () => {
//     render(
//       <Router>
//         <Header />
//       </Router>
//     );

//     const menuButton = screen.getByRole('img');
//     fireEvent.click(menuButton);

//     const logOutMenuItem = screen.getByText('Log Out');
//     fireEvent.click(logOutMenuItem);

//     expect(useNavigate).toHaveBeenCalled();
//   });

  test('Clicking "Favorites" button navigates to /favorites', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <Router>
        <Header />
      </Router>
    );

    const menuButton = screen.getByRole('img');
    fireEvent.click(menuButton);

    const favoritesMenuItem = screen.getByText('Favorites');
    fireEvent.click(favoritesMenuItem);

    expect(navigate).toHaveBeenCalledWith('/favorites');
  });

  test('Clicking "Home" button navigates to /home', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <Router>
        <Header />
      </Router>
    );

    const menuButton = screen.getByRole('img');
    fireEvent.click(menuButton);

    const homeMenuItem = screen.getByText('Home');
    fireEvent.click(homeMenuItem);

    expect(navigate).toHaveBeenCalledWith('/');
  });

  test('Clicking "My Items" button navigates to /my-items', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <Router>
        <Header />
      </Router>
    );

    const menuButton = screen.getByRole('img');
    fireEvent.click(menuButton);

    const myItemsMenuItem = screen.getByText('My Items');
    fireEvent.click(myItemsMenuItem);

    expect(navigate).toHaveBeenCalledWith('/my-items');
  });
});

// Isolating this last test with a different Jest mock
// describe('Header component (isolated logout test)', () => {
  jest.mock('../authentication/logout', () => ({
    logout: () => {
      throw new Error('Logout failed');
    },
  }));

  test('logout fails', async () => {
    const originalConsoleError = console.error;
    const errorMessages = [];

    console.error = (message) => {
      errorMessages.push(message);
    };

    render(
      <Router>
        <Header />
      </Router>
    );

    const menuButton = screen.getByRole('img');
    fireEvent.click(menuButton);

    const logOutMenuItem = screen.getByText('Log Out');

    fireEvent.click(logOutMenuItem);

    await waitFor(() => {
      expect(errorMessages).toContain('Error logging out:');
    });

    console.error = originalConsoleError;
  });
// });
