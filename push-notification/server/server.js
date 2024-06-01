const webPush = require('web-push'); // Import the web-push library for handling push notifications
const express = require('express'); // Import the Express library for creating the server
const bodyParser = require('body-parser'); // Import body-parser to parse JSON bodies
const cors = require('cors'); // Import the cors package to handle Cross-Origin Resource Sharing
const app = express(); // Create an Express application
const port = 3001; // Define the port on which the server will run

// Generate VAPID keys for push notifications. These keys should only be generated once and stored securely.
const vapidKeys = webPush.generateVAPIDKeys();

// Set the VAPID details, including the contact email and the generated public and private keys
webPush.setVapidDetails(
  'mailto:example@yourdomain.org', // Contact email for the VAPID keys
  vapidKeys.publicKey, // Public VAPID key
  vapidKeys.privateKey // Private VAPID key
);

let subscription = null; // Variable to store the push subscription

app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json()); // Use body-parser to parse JSON bodies

// Route to handle subscription requests
app.post('/subscribe', (req, res) => {
  subscription = req.body; // Save the subscription object
  res.status(201).json({}); // Send a response indicating the subscription was successful
});

// Route to manually trigger a notification
app.get('/sendNotification', (req, res) => {
  // Create a payload with a random number
  const payload = JSON.stringify({ title: 'Push Notification', body: `Random number: ${Math.floor(Math.random() * 100)}` });
  // Send the notification using the subscription object
  webPush.sendNotification(subscription, payload).catch(error => console.error(error));
  res.status(200).json({}); // Send a response indicating the notification was sent
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server started on port ${port}`); // Log that the server has started
  console.log(`Public VAPID Key: ${vapidKeys.publicKey}`); // Log the public VAPID key
});

// Send a notification every 10 seconds
setInterval(() => {
  if (subscription) { // Check if a subscription exists
    // Create a payload with a random number
    const payload = JSON.stringify({ title: 'Push Notification', body: `Random number: ${Math.floor(Math.random() * 100)}` });
    // Send the notification using the subscription object
    webPush.sendNotification(subscription, payload).catch(error => console.error(error));
  }
}, 10000); // 10000 milliseconds = 10 seconds
