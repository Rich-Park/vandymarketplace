import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ItemCard from "../components/ItemCard";
import "@testing-library/jest-dom/extend-expect";
import { getUserID } from "../firebaseFunctions/dataload";
import { likeItem, unlikeItem } from "../firebaseFunctions/firebaseWrite";

// Mock Firebase functions and other dependencies
jest.mock("../firebaseFunctions/dataload");
jest.mock("../firebaseFunctions/firebaseWrite");
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

const mockItem = {
  id: "1",
  imageURLs: ["https://example.com/image.jpg"],
  productName: "Test Product",
  likesCount: 5,
  price: "50",
  sellerId: "seller123",
};

describe("ItemCard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock implementations
    getUserID.mockResolvedValue("testUserId");
    likeItem.mockResolvedValue(null);
    unlikeItem.mockResolvedValue(null);
  });

  it("displays the product details, contact, and favorite buttons correctly", () => {
    render(<ItemCard item={mockItem} myItems={false} />);

    // Check for the product image
    const productImage = screen.getByAltText(`Image of ${mockItem.name}`);
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute("src", mockItem.imageURLs[0]);

    // Check for product name
    expect(screen.getByText(mockItem.productName)).toBeInTheDocument();

    // Check for product price
    expect(screen.getByText(mockItem.price)).toBeInTheDocument();

    // Check for likes count
    expect(
      screen.getByText(mockItem.likesCount.toString())
    ).toBeInTheDocument();

    // Check for favorite button (using aria-label for accessibility)
    expect(screen.getByLabelText("Favorite Button")).toBeInTheDocument();

    // Check for contact button (using aria-label for accessibility)
    expect(screen.getByLabelText("Contact Button")).toBeInTheDocument();
  });

  it("changes the favorite icon and increments likesCount when favorite button is clicked", async () => {
    render(<ItemCard item={mockItem} myItems={false} />);

    // Find favorite button and click it
    const favoriteButton = screen.getByLabelText("Favorite Button");
    fireEvent.click(favoriteButton);

    // Wait for the heart icon to turn red
    await waitFor(() => {
      const favoriteIcon = screen.getByLabelText("favorite-icon");
      expect(window.getComputedStyle(favoriteIcon).color).toBe("red");
    });

    // Check if likes count is incremented by one
    const incrementedLikesCount = mockItem.likesCount + 1;
    expect(
      screen.getByText(incrementedLikesCount.toString())
    ).toBeInTheDocument();
  });

  it("opens the modal when the contact seller button is clicked", async () => {
    const openModalMock = jest.fn();

    render(
      <ItemCard item={mockItem} openModal={openModalMock} myItems={false} />
    );

    // Find the contact seller button and click it
    const contactButton = screen.getByLabelText("Contact Button");
    fireEvent.click(contactButton);

    // Check if the openModal prop function was called
    expect(openModalMock).toHaveBeenCalledWith(mockItem);
  });

  it("handles double-click events correctly", async () => {
    const handleItemDoubleClickMock = jest.fn();
  
    render(
      <ItemCard
        item={mockItem}
        onDoubleClick={handleItemDoubleClickMock}
        myItems={false}
      />
    );
  
    // Find the item card and simulate a double click
    const itemCard = screen.getByText(/Test Product/i);
    fireEvent.doubleClick(itemCard);
  
    // Check if the onDoubleClick prop function was called
    expect(handleItemDoubleClickMock).toHaveBeenCalledWith(mockItem);
  });

  it("handles delete button click", async () => {
    const onDeleteMock = jest.fn();

    render(<ItemCard item={mockItem} myItems={true} onDelete={onDeleteMock} />);

    // Find the delete button and click it
    const deleteButton = screen.getByLabelText("Delete Button");
    fireEvent.click(deleteButton);

    // Check if the onDelete prop function was called
    expect(onDeleteMock).toHaveBeenCalledWith(mockItem.id);
  });

  it("changes the favorite icon and decrements likesCount when favorite button is clicked", async () => {
    render(<ItemCard item={mockItem} myItems={false} />);
  
    // Find favorite button and click it
    const favoriteButton = screen.getByLabelText("Favorite Button");
    fireEvent.click(favoriteButton);
  
    // Wait for the heart icon to turn red
    await waitFor(() => {
      const favoriteIcon = screen.getByLabelText("favorite-icon");
      expect(window.getComputedStyle(favoriteIcon).color).toBe("red");
    });
  
    // Check if likes count is incremented by one
    const incrementedLikesCount = mockItem.likesCount + 1;
    expect(
      screen.getByText(incrementedLikesCount.toString())
    ).toBeInTheDocument();
  
    // Click the favorite button again to "unlike"
    fireEvent.click(favoriteButton);
  
    // Wait for the heart icon to revert to its original color
    await waitFor(() => {
      const favoriteIcon = screen.getByLabelText("favorite-icon");
      expect(window.getComputedStyle(favoriteIcon).color).not.toBe("red");
    });
  
    // Check if likes count is decremented by one
    const decrementedLikesCount = mockItem.likesCount;
    expect(
      screen.getByText(decrementedLikesCount.toString())
    ).toBeInTheDocument();
  });
  

});
