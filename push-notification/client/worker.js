self.addEventListener('push', event => { // Listen for push events
    const data = event.data.json(); // Parse the incoming data as JSON
    self.registration.showNotification(data.title, { // Show a notification with the parsed data
      body: data.body // Set the body of the notification to the body field from the data
    });
  });
  