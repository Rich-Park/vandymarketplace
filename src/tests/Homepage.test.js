import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import HomePage from "../components/HomePage";
import { MemoryRouter } from "react-router-dom";
import * as firebaseAuth from "firebase/auth";
import { collection, getDoc, getDocs, query } from "firebase/firestore";

// Mock the useNavigate hook and Firebase functions
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  getAuth: () => ({
    currentUser: {
      email: "user@vanderbilt.edu",
    },
  }),
}));

jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    doc: jest.fn(),
    collection: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    orderBy: jest.fn(),
    query: jest.fn(),
  };
});

// Mock Firestore collection and getDocs
collection.mockImplementation(() => ({
  query: jest.fn(() => ({
    orderBy: jest.fn(() => ({
      getDocs: jest.fn(),
    })),
  })),
}));

query.mockImplementation(() => ({
  orderBy: jest.fn(() => ({
    getDocs: jest.fn(),
  })),
}));

getDoc.mockImplementation(() =>
  Promise.resolve({
    exists: jest.fn(() => true), // Make sure this returns true or false as needed for your test
    data: jest.fn(() => ({
      /* mock data */
    })),
  })
);

// Mock data you expect to receive from Firestore
const mockFirestoreDocs = [
  {
    id: "1",
    exists: jest.fn(() => true),
    data: jest.fn(() => ({
      /* Document data */
    })),
  },
  // ... other mock documents
];

// Mock implementation of getDocs to return the mock documents
getDocs.mockImplementation(() => Promise.resolve({ docs: mockFirestoreDocs }));

describe("HomePage component", () => {
  let consoleErrorMock;

  beforeEach(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  it("updates selected price and affects image gallery", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const priceFilter = screen.getByTestId('Price option');

    // Simulate selecting a new price option
    fireEvent.change(priceFilter, { target: { value: 'option2' } });

    // You might want to mock the response from Firestore based on the selected price option
    // and then verify that ImageGallery renders items based on this selection

    // Example: Check if an item with a specific text or test id appears in the ImageGallery
    // await screen.findByText('Item for 25$ - 50$ range');
    // or
    // await screen.findByTestId('item-specific-to-option2');
  });

  it("should open the description modal on double click", async () => {
    // Set up mock data for the item
    const mockItem = {
      id: "1",
      productName: "Test Product",
      description: "This is a test description",
      // ... other item properties
    };

    // Mock Firestore response
    getDocs.mockImplementation(() => Promise.resolve({ docs: [mockItem] }));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Wait for async operations and updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    // Find the ItemCard element and simulate double click
    const itemCard = screen.getByTestId("test"); // Adjust the test id based on your implementation
    fireEvent.doubleClick(itemCard);

    // Check if the modal opened with the correct content
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  });

  it("should render a header, search bar, and image gallery", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Wrap the test code that updates state in act
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      // Wait for the component to update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).not.toBeNull();

      fireEvent.change(searchInput, { target: { value: "test" } });
    });
  });

  it("should correctly render when user is authenticated", async () => {
    // Mock user being authenticated
    firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: "user@example.com" }); // Simulate an authenticated user
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  });

  it("should log an error when the Firestore document does not exist", async () => {
    firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: "user@example.com" }); // Simulate authenticated user
    });

    // Mock getDoc to simulate non-existing document
    getDoc.mockResolvedValue({ exists: () => false });

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, "error");

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Wait for async effects to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    // Check if console.error was called
    expect(consoleSpy).toHaveBeenCalledWith("Could not find document.");

    // Clean up the spy
    consoleSpy.mockRestore();
  });

  it("should redirect to login page if user is not authenticated", async () => {
    // Mock user not being authenticated
    firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  });
});
