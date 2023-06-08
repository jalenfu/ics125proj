// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAPQLVsvywtLHZ9HnTYj3Zo035qW7V50o",
  authDomain: "ics125-2195d.firebaseapp.com",
  projectId: "ics125-2195d",
  storageBucket: "ics125-2195d.appspot.com",
  messagingSenderId: "725039446313",
  appId: "1:725039446313:web:204f968972cf91e2d05f38",
  measurementId: "G-PE9XRKBTVR"
};

// Initialize Firebase
let app;
if (firebase.apps.length == 0){ //checks if there are existing firebase instances
    app = initializeApp(firebaseConfig);
}
else
{
    app = firebase.app()
}
