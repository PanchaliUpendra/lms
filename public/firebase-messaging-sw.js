importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCJuzRYn0VK5F7WlwivYK5WqJ8KXOrqxNI",
  authDomain: "lmstesting-5c422.firebaseapp.com",
  projectId: "lmstesting-5c422",
  storageBucket: "lmstesting-5c422.appspot.com",
  messagingSenderId: "123179514488",
  appId: "1:123179514488:web:4b86d1cba90a0438d3cb8d",
  measurementId: "G-JK08WXWL7D"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});