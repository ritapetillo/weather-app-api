import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyAMyTz8eJtEBTgLDB-wDjcNvGGNIF0mYZg",
  authDomain: "weatherapp-304613.firebaseapp.com",
  projectId: "weatherapp-304613",
  storageBucket: "weatherapp-304613.appspot.com",
  messagingSenderId: "908481375907",
  appId: "1:908481375907:web:b6532c82d410321dcd1916",
  measurementId: "G-0QHDQ8V9PB",
};

firebase.initializeApp(firebaseConfig)
export default firebase