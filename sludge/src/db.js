import  firebase from 'firebase';
import "firebase/database";

const config = {
    apiKey: "AIzaSyCNcP0Zvnnl0OBTrxEFjjQJ3sGnZ7xbm5w",
  authDomain: "fire-chat-403aa.firebaseapp.com",
  databaseURL: "https://fire-chat-403aa-default-rtdb.firebaseio.com",
  projectId: "fire-chat-403aa",
  storageBucket: "fire-chat-403aa.appspot.com",
  messagingSenderId: "392708135798",
  appId: "1:392708135798:web:76fbf57e15116609a3b857"
}

const db = firebase.initializeApp(config);
export default db;