/**
 * EduAtlas - Firebase Configuration
 * Firebase Auth + Firestore 초기화
 */

const firebaseConfig = {
  apiKey: "AIzaSyAIl1FZ1U-m0o-tVV35CsFahHb26LiJ-tY",
  authDomain: "geoproject-8fc76.firebaseapp.com",
  projectId: "geoproject-8fc76",
  storageBucket: "geoproject-8fc76.firebasestorage.app",
  messagingSenderId: "1035160323856",
  appId: "1:1035160323856:web:51630c09b1c9fb94ce8795",
  measurementId: "G-37W7M5MYH4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
