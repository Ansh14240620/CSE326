// ===================================================
// Step 1: Firebase Project Configuration
// ===================================================

const firebaseConfig = {
  apiKey: "AIzaSyBstZ29pNBj1WpFhJOXmGMiA-eIw7qAw2M",
  authDomain: "cse326-ca.firebaseapp.com",
  projectId: "cse326-ca",
  storageBucket: "cse326-ca.firebasestorage.app",
  messagingSenderId: "775577519097",
  appId: "1:775577519097:web:6bfb8cd1da0e4854927328",
  measurementId: "G-FHJR60XDM9"
};

// Initialize Firebase services
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
