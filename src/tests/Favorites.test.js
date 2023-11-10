import React from "react";
import { render, waitFor, screen, getByText } from "@testing-library/react";
import { getUserID } from "../firebaseFunctions/dataload";
import { doc, getDoc } from "firebase/firestore";
import Favorites from "../components/Favorites";
import { BrowserRouter as Router } from "react-router-dom";
import * as firebaseAuth from "firebase/auth";

jest.mock("../firebaseFunctions/dataload", () => ({
  getUserID: jest.fn(),
}));
jest.mock("../firebaseConfig", () => ({
  auth: {
    currentUser: {
      photoURL: "mockPhotoUrl",
    },
  },
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getFirestore: jest.fn(), // Add this line to mock getFirestore
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Setting up the mock return values
firebaseAuth.getAuth.mockReturnValue({
  currentUser: {
    uid: "testUserId",
    // ...other properties of currentUser
  },
  onAuthStateChanged: firebaseAuth.onAuthStateChanged,
});

jest.mock("../firebaseConfig", () => {
  return {
    auth: {
      onAuthStateChanged: jest.fn().mockImplementation((callback) => {
        callback({
          /* mock user object */
        }); // mock user data
        return jest.fn(); // mock unsubscribe function
      }),
    },
  };
});

describe("<Favorites />", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();

    // Mock the onAuthStateChanged to simulate a user being authenticated
    firebaseAuth.onAuthStateChanged.mockImplementation((callback) => {
      const unsubscribe = () => {}; // Mock the unsubscribe function
      callback({ uid: "testUser" }); // Simulate an authenticated user
      return unsubscribe;
    });
  });

  it("renders liked items properly", async () => {
    // Mock return values for Firebase calls
    getUserID.mockResolvedValue("testUserID");
    firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: "testUserID" }); // Simulate a user being signed in
      return jest.fn(); // Mock unsubscribe function
    });

    const mockDocData = {
      exists: () => true,
      data: () => ({
        likedItems: [
          { itemId: "item1", sellerId: "seller1" },
          { itemId: "item2", sellerId: "seller2" },
        ],
      }),
    };

    const mockItemData = {
      exists: () => true,
      data: () => ({ productName: "testItem", price: 100 }),
    };

    doc.mockReturnValue({});
    getDoc
      .mockResolvedValueOnce(mockDocData)
      .mockResolvedValueOnce(mockItemData)
      .mockResolvedValueOnce(mockItemData);

    // Render component
    render(
      <Router>
        <Favorites />
      </Router>
    );
  });
});
