import {
    doc,
    collection,
    addDoc,
    runTransaction,
    increment,
    arrayUnion,
    arrayRemove,
  } from "firebase/firestore";
  import {
    ref,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  import { storeItemsSell, likeItem, unlikeItem } from "../firebaseFunctions/firebaseWrite";
  import { db, storage } from "../firebaseConfig";
  
  // Mock Firebase functions
  jest.mock("firebase/firestore");
  jest.mock("firebase/storage");
  
  describe("Firebase Functions", () => {
    const userId = "testUserId";
    const sellerId = "testSellerId";
    const itemId = "testItemId";
    const formItem = {
      productName: "Test Product",
      email: "test@example.com",
      price: "50",
      description: "Test description",
      images: [{ name: "image1.jpg" }],
      tags: ["tag1", "tag2"],
      timestamp: 123456789,
    };
  
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
  
    describe("storeItemsSell", () => {
      it("should store items for sale", async () => {
        
        // Mock Storage
        uploadBytes.mockResolvedValue({});
        getDownloadURL.mockResolvedValue("mockImageUrl");
  
        await storeItemsSell(userId, formItem);
  
        // Assertions
        expect(doc).toHaveBeenCalledWith(db, "users", userId);
        expect(collection).toHaveBeenCalledWith(doc(), "ItemsToSell");
        expect(uploadBytes).toHaveBeenCalledTimes(1); // Two images in form_item.images
        expect(addDoc).toHaveBeenCalledWith(
            collection(doc(db, "users", userId), "ItemsToSell"),  // Correct collection path
            {
              productName: formItem.productName,
              email: formItem.email,
              price: parseFloat(formItem.price),
              description: formItem.description,
              imageURLs: ["mockImageUrl"], // Two images uploaded
              tags: formItem.tags,
              timestamp: formItem.timestamp,
              likesCount: 0,
              sellerId: userId,
              itemName: expect.arrayContaining([
                expect.stringContaining(`${userId}/`), // Check for userId in each element
                expect.stringContaining("_image1.jpg"),
              ]),
            }
          );    

      });
    });
  
    describe("likeItem", () => {
      it("should like an item", async () => {
        // Mock functions
        const runTransactionMock = jest.fn();
  
        // Mock Firestore
        doc.mockReturnValue({
          get: jest.fn(() => Promise.resolve({ exists: () => true })),
        });
        runTransaction.mockImplementation(runTransactionMock);
  
        await likeItem(userId, sellerId, itemId);
  
        // Assertions
        expect(doc).toHaveBeenCalledWith(db, "users", userId);
        expect(doc).toHaveBeenCalledWith(db, "users", sellerId);
        expect(doc).toHaveBeenCalledWith(doc(), "ItemsToSell", itemId);
        expect(runTransactionMock).toHaveBeenCalled();
        // Additional assertions for the content of the transaction callback are recommended
      });
    });
  
    describe("unlikeItem", () => {
      it("should unlike an item", async () => {
        // Mock functions
        const runTransactionMock = jest.fn();
  
        // Mock Firestore
        doc.mockReturnValue({
          get: jest.fn(() => Promise.resolve({ exists: () => true })),
        });
        runTransaction.mockImplementation(runTransactionMock);
  
        await unlikeItem(userId, sellerId, itemId);
  
        // Assertions
        expect(doc).toHaveBeenCalledWith(db, "users", userId);
        expect(doc).toHaveBeenCalledWith(db, "users", sellerId);
        expect(doc).toHaveBeenCalledWith(doc(), "ItemsToSell", itemId);
        expect(runTransactionMock).toHaveBeenCalled();
        // Additional assertions for the content of the transaction callback are recommended
      });
    });
  });