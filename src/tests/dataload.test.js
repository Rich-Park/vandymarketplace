// firebaseFunctions.test.js

import { render, screen } from '@testing-library/react';
import {
  getUserID,
} from '../firebaseFunctions/dataload'; // Adjust the path accordingly

jest.mock('../firebaseConfig', () => ({
  auth: {
    currentUser: {
      email: 'test@example.com', // Mock the current user email for testing
    },
  },
  db: {}, // Mock the database object
}));

// Mock the necessary Firestore functions
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
}));

// Mock the necessary functions from firebase storage
jest.mock('firebase/storage', () => ({
  ...jest.requireActual('firebase/storage'),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('Firebase Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test getUserID function
  describe('getUserID', () => {
    it('should get user ID', async () => {
        // Mock Firestore response
        const mockData = { exists: () => true, data: () => ({ userId: 'mockUserId' }) };
        const getDocMock = jest.spyOn(require('firebase/firestore'), 'getDoc').mockResolvedValue(mockData);
    
        const userId = await getUserID();
    
        expect(getDocMock).toHaveBeenCalled();
        expect(userId).toEqual('mockUserId');
      });
    
      it('should handle error when document does not exist', async () => {
        // Mock Firestore response
        const mockData = { exists: () => false };
        const getDocMock = jest.spyOn(require('firebase/firestore'), 'getDoc').mockResolvedValue(mockData);
    
        console.error = jest.fn(); // Mock console.error to prevent it from being printed in the test
    
        const userId = await getUserID();
    
        expect(getDocMock).toHaveBeenCalled();
        expect(userId).toEqual('');
        expect(console.error).toHaveBeenCalledWith('Could not find document.');
      });
  });

});
