const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
// const { initializeApp } = require("firebase/app");

// const firebaseConfig = {
//   apiKey: process.env.APIKEY,
//   authDomain: process.env.AUTHDOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDERID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID,
// };

// const firebase = initializeApp(firebaseConfig);
// const storage = getStorage(firebase);

// export default {storage,ref, uploadBytes, getDownloadURL}


// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgJMdAZefrjV1mYPK6rE5xZykD7IR_eH8",
  authDomain: "node-f2350.firebaseapp.com",
  projectId: "node-f2350",
  storageBucket: "node-f2350.appspot.com",
  messagingSenderId: "456459731934",
  appId: "1:456459731934:web:33f90e36b43f8a696fd34f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
module.exports = {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
};
