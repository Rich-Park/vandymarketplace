import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SellItemForm from '../components/SellItemForm';
import * as dataload from '../firebaseFunctions/dataload';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { auth } from "../firebaseConfig";

jest.spyOn(console, 'error').mockImplementation(() => {});

// mock 3 items in db
jest.mock('firebase/firestore', () => {
    const originalModule = jest.requireActual('firebase/firestore');
    return {
        ...originalModule,
        getDocs: jest.fn(() => {
            return {
                size: 3, // Simulating 3 items
            };
        }),
    };
});


//form should successfully submit when given the right information
test('it should submit the form with valid data', async () => {
    // Mock the getUserID function to return a user ID
    URL.createObjectURL = jest.fn((blob) => `blob:${blob}`);

    dataload.getUserID = jest.fn(() => Promise.resolve('user'));
    const mockUser = {
        email: 'user2@vanderbilt.edu',
    };
    auth.currentUser = mockUser;

    render(
        <MemoryRouter>
            <SellItemForm />
        </MemoryRouter>
    );


    const productNameInput = screen.getByPlaceholderText('Product Name');
    const priceInput = screen.getByPlaceholderText('Price (USD)');
    const descriptionInput = screen.getByPlaceholderText('Enter a description of your item...');
    const imageInput = screen.getByTestId('upload-images-input');
    const submitButton = screen.getByText('Submit');

    const imageFile = new File(['(binary content)'], 'logo192.png', { type: 'image/png' });


    fireEvent.change(productNameInput, { target: { value: 'Sample Product' } });
    fireEvent.change(priceInput, { target: { value: '100' } });
    fireEvent.change(descriptionInput, { target: { value: 'Sample description' } });
    fireEvent.change(imageInput, { target: { files: [imageFile] } });
    // Submit the form
    fireEvent.click(submitButton);

    // Access the form elements to retrieve the updated values
    const updatedProductName = productNameInput.value;
    const updatedPrice = priceInput.value;
    const updatedDescription = descriptionInput.value;

    // Check if the form inputs are updated correctly
    expect(updatedProductName).toBe('Sample Product');
    expect(updatedPrice).toBe('100');
    expect(updatedDescription).toBe('Sample description');
});

//be able to upload the image, and then change image to a different one
test('it should be able to delete the image', async () => {
    // Mock the getUserID function to return a user ID
    URL.createObjectURL = jest.fn((blob) => `blob:${blob}`);

    dataload.getUserID = jest.fn(() => Promise.resolve('user'));
    const mockUser = {
        email: 'user2@vanderbilt.edu',
    };
    auth.currentUser = mockUser;

    render(
        <MemoryRouter>
            <SellItemForm />
        </MemoryRouter>
    );
    const productNameInput = screen.getByPlaceholderText('Product Name');
    const priceInput = screen.getByPlaceholderText('Price (USD)');
    const descriptionInput = screen.getByPlaceholderText('Enter a description of your item...');
    const imageInput = screen.getByTestId('upload-images-input');
    const submitButton = screen.getByText('Submit');
    const clearImageButton = screen.getByText('Clear Image');

    const imageFile = new File(['(binary content)'], 'logo192.png', { type: 'image/png' });
    fireEvent.change(productNameInput, { target: { value: 'Sample Product' } });
    fireEvent.change(priceInput, { target: { value: '100' } });
    fireEvent.change(descriptionInput, { target: { value: 'Sample description' } });
    fireEvent.change(imageInput, { target: { files: [imageFile] } });
    fireEvent.change(imageInput, { target: { files: [imageFile] } });
    expect(imageInput.files[0]).toEqual(imageFile);

    // empty file
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });

    fireEvent.click(clearImageButton)
    expect(imageInput.files[0]).toEqual(emptyFile);

    fireEvent.change(imageInput, { target: { files: [imageFile] } });
    expect(imageInput.files[0]).toEqual(imageFile);
    fireEvent.click(submitButton);
    const consoleErrorSpy = jest.spyOn(console, 'debug');
    consoleErrorSpy.mockImplementation(() => {});
});

//can only post 3 items per hour
test('should limit items per hour', async () => {
    // Mock the getUserID function to return a user ID
    URL.createObjectURL = jest.fn((blob) => `blob:${blob}`);
    dataload.getUserID = jest.fn(() => Promise.resolve('user'));
    const mockUser = {
      email: 'user2@vanderbilt.edu',
    };
    auth.currentUser = mockUser;
  
    jest.mock('firebase/firestore', () => {
      const originalModule = jest.requireActual('firebase/firestore');
      return {
        ...originalModule,
        getDocs: jest.fn(() => {
          return {
            size: 3, // Simulating 3 items
          };
        }),
      };
    });
  
    render(
      <MemoryRouter>
        <SellItemForm />
      </MemoryRouter>
    );
  
    const productNameInput = screen.getByPlaceholderText('Product Name');
    const priceInput = screen.getByPlaceholderText('Price (USD)');
    const descriptionInput = screen.getByPlaceholderText('Enter a description of your item...');
    const imageInput = screen.getByTestId('upload-images-input');
    const submitButton = screen.getByText('Submit');
    const imageFile = new File(['(binary content)'], 'logo192.png', { type: 'image/png' });
    
    fireEvent.change(productNameInput, { target: { value: 'Sample Product' } });
    fireEvent.change(priceInput, { target: { value: '100' } });
    fireEvent.change(descriptionInput, { target: { value: 'Sample description' } });
    fireEvent.change(imageInput, { target: { files: [imageFile] } });
  
    expect(imageInput.files[0]).toEqual(imageFile);
  
    fireEvent.click(submitButton);
  
    const consoleErrorSpy = jest.spyOn(console, 'debug');
    consoleErrorSpy.mockImplementation(() => {});
  
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    const errorMessage = screen.getByText("Submission limit exceeded. You may only post 3 items every hour. Try again later.");
    expect(errorMessage).toBeInTheDocument();
  });