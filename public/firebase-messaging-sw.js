// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDJEOpDEk0nj-seANxM-r62YQJNKhd7t0I",
  authDomain: "flangoo-56894.firebaseapp.com",
  projectId: "flangoo-56894",
  storageBucket: "flangoo-56894.appspot.com",
  messagingSenderId: "741455193600",
  appId: "1:741455193600:web:3d2381030683e5d9dc1ae5",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/flangoo_144.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
