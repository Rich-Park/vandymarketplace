const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors"); // Import the cors middleware
const http = require("http");

const app = express();
const port = process.env.PORT || 8080;

// Middleware to allow cross-origin requests
app.use(cors());
// Middleware to parse JSON data
app.use(bodyParser.json());

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "noreply.vandymarketplace@gmail.com",
    pass: "cedr mjdb zykl fskv",
  },
});

const server = http.createServer(app);

// Define a route to send emails
app.post("/send-email", async (req, res) => {
  try {
    const {
      sellerEmail,
      productName,
      productPrice,
      offerPrice,
      message,
      userEmail,
    } = req.body;

    // Email content
    const mailOptions = {
      from: "noreply.vandymarketplace@gmail.com", // No Reply email
      to: sellerEmail, // Seller's email
      subject: "New Vandy Marketplace Offer!",
      text: `
You have a new message regarding your post on ${productName}.
You originally listed it for $${productPrice}!

Here is the interested buyer's information:
Buyer's Email: ${userEmail}
Buyer's Offer Price: $${offerPrice}
Message: ${message}

Send them an email back if you are interested in selling to them!
- The Vandy Marketplace Team
    `,
    };
    // Send the email
    console.log("Mail delivery processing");
    await sendEmail(transporter, mailOptions);

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error); // Log the specific error
    res.status(500).json({ error: "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Function to send an email
async function sendEmail(transporter, mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Internal server error");
  }
}

module.exports = { app, server };