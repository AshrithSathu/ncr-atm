// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwzwZFgbKVT3Vd0BU4LcIWo5aCJ0hIZRo",
  authDomain: "weplan-9cd24.firebaseapp.com",
  projectId: "weplan-9cd24",
  storageBucket: "weplan-9cd24.appspot.com",
  messagingSenderId: "203215448943",
  appId: "1:203215448943:web:94041b1e8ba9f1e4a5d69a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
