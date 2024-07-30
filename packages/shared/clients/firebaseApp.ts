// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYJcFhkeBKw9dRKfiQlyFlxET3kEBZ3gE",
  authDomain: "dubbie-studio.firebaseapp.com",
  projectId: "dubbie-studio",
  storageBucket: "dubbie-studio.appspot.com",
  messagingSenderId: "167219761986",
  appId: "1:167219761986:web:cd12d446fad0534dee6edb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage, app };
