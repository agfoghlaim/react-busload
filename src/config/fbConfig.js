//import * as firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

var firebaseConfig = {
  apiKey: "AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs",
  authDomain: "busload-8ae3c.firebaseapp.com",
  databaseURL: "https://busload-8ae3c.firebaseio.com",
  projectId: "busload-8ae3c",
  storageBucket: "gs://busload-8ae3c.appspot.com/",
  messagingSenderId: "403334506746",
  appId: "1:403334506746:web:bc8e738bf317ce2e"
};

firebase.initializeApp(firebaseConfig);

export default firebase;

