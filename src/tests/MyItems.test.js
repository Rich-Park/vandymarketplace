import { render, screen, fireEvent, act } from "@testing-library/react";
import MyItems from "../components/MyItems";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import * as dataload from "../firebaseFunctions/dataload";
dataload.getUserID = jest.fn(() => Promise.resolve("user"));

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => () => {}, // Provide a mock implementation
}));

// Mock the auth object
jest.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: {
      email: "user@vanderbilt.edu",
    },
  }),
}));

// Mock the Firestore functions properly
jest.mock("firebase/firestore", () => {
  const data = [
    {
      id: "gnlXgIc8FSQtAmqS0xLa",
      description: "test",
      email: "user@vanderbilt.edu",
      imageURLs: [
        "https://firebasestorage.googleapis.com/v0/b/vandymarketplace.appspot.com/o/myleshshin%2Fflow.png?alt=media&token=98886048-af92-4dc3-b905-d2938f37504c",
      ],
      likesCount: 0,
      price: 42,
      productName: "scottiehottie",
      sellerId: "user",
      tags: ["Electronics", "Furniture", "Books", "Appliances", "Home Decor"],
      timestamp: { seconds: 1698939526, nanoseconds: 691000000 },
    },
  ];

  return {
    getFirestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          collection: jest.fn(() => ({
            getDocs: jest.fn(async () => {
              // Simulate fetching data from Firestore
              const result = data.map((item) => ({
                data: () => item,
                id: item.id,
              }));
              return result;
            }),
          })),
          get: jest.fn(async () => {
            return {
              id: "some-user-id",
            };
          }),
        })),
        getDocs: jest.fn(async () => {
          // Simulate fetching data from Firestore
          const result = data.map((item) => ({
            data: () => item,
            id: item.id,
          }));
          return result;
        }),
      })),
    })),
  };
});

// Mock the loader functions to return an array with a specified object
jest.mock("../firebaseFunctions/dataload", () => ({
  AllSellItemsLoader: jest.fn(() =>
    Promise.resolve([
      {
        id: "gnlXgIc8FSQtAmqS0xLa",
        description: "test",
        email: "user@vanderbilt.edu",
        imageURLs: [
          "https://firebasestorage.googleapis.com/v0/b/vandymarketplace.appspot.com/o/myleshshin%2Fflow.png?alt=media&token=98886048-af92-4dc3-b905-d2938f37504c",
        ],
        likesCount: 0,
        price: 42,
        productName: "scottiehottie",
        sellerId: "user",
        tags: ["Electronics", "Furniture", "Books", "Appliances", "Home Decor"],
        timestamp: { seconds: 1698939526, nanoseconds: 691000000 },
      },
    ])
  ),
  QueryItemsLoader: jest.fn(() =>
    Promise.resolve([
      {
        id: "gnlXgIc8FSQtAmqS0xLa",
        description: "test",
        email: "user@vanderbilt.edu",
        imageURLs: [
          "https://firebasestorage.googleapis.com/v0/b/vandymarketplace.appspot.com/o/myleshshin%2Fflow.png?alt=media&token=98886048-af92-4dc3-b905-d2938f37504c",
        ],
        likesCount: 0,
        price: 42,
        productName: "scottiehottie",
        sellerId: "user",
        tags: ["Electronics", "Furniture", "Books", "Appliances", "Home Decor"],
        timestamp: { seconds: 1698939526, nanoseconds: 691000000 },
      },
    ])
  ),
}));

// test that all of the item you posted is displayed
describe("MyItems component", () => {
  it("should render a header, search bar, and image gallery", async () => {
    render(
      <MemoryRouter>
        <MyItems />
      </MemoryRouter>
    );

    // Wrap the test code that updates state in act
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      // Wait for the component to update
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).not.toBeNull();

      fireEvent.change(searchInput, { target: { value: "test" } });

      const searchButton = screen.getByText("Search");
      expect(searchButton).not.toBeNull();

      fireEvent.click(searchButton);
    });
  });
});
