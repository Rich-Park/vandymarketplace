import React from "react";
import { render, screen } from "@testing-library/react";
import { getUserID } from "../firebaseFunctions/dataload";
import { doc, getDoc } from "firebase/firestore";
import Favorites from "../components/Favorites";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../firebaseFunctions/dataload", () => ({
  getUserID: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getFirestore: jest.fn(), // Add this line to mock getFirestore
}));

describe("<Favorites />", () => {
  it("renders liked items properly", async () => {
    // Mock return values for Firebase calls
    getUserID.mockResolvedValue("testUserID");

    const mockDocData = {
      exists: true,
      data: () => ({
        likedItems: [
          { itemId: "item1", sellerId: "seller1" },
          { itemId: "item2", sellerId: "seller2" },
        ],
      }),
    };

    const mockItemData = {
      exists: true,
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
