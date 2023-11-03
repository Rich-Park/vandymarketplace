import * as dataload from '../firebaseFunctions/dataload';

const request = require('supertest');
const transporter = require('nodemailer').createTransport();
const { app, server } = require('../backend/server');

jest.mock('../backend/server', () => {
const originalModule = jest.requireActual('../backend/server');
return {
...originalModule,
sendEmail: jest.fn(() => Promise.resolve()),
};
});

jest.mock('nodemailer', () => ({
createTransport: jest.fn(() => {
return {
sendMail: jest.fn(() => Promise.resolve()),
};
}),
}));

describe('sendEmail function', () => {
dataload.getUserID = jest.fn(() => Promise.resolve('user'));
afterAll((done) => {
// Close the server after all tests are completed
server.close(() => {
done();
});
});

//email sends successfully
it('should send an email when POST /send-email is called', async () => {
// Wait for the test to be ready
await new Promise(resolve => setTimeout(resolve, 1000));
const sendEmailMock = jest.fn();
sendEmailMock.mockResolvedValue(); // This will prevent the function from throwing an error

const mailOptions = {
from: 'sender@example.com',
to: 'recipient@example.com',
subject: 'Test Email',
text: 'This is a test email.',
};

// Await the transporter.sendMail() method
await transporter.sendMail(mailOptions);

const response = await request(app)
.post('/send-email')
.send({
sellerEmail: 'seller@example.com',
productName: 'Test Product',
productPrice: 100,
offerPrice: 90,
message: 'Interested in your product',
userEmail: 'user@example.com',
});

// Ensure the response indicates a successful email sending
expect(response.status).toBe(200);
expect(response.body.message).toBe('Email sent successfully');
});
});

