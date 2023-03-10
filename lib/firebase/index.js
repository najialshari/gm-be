const { initializeApp } = require("firebase/app");


const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDERID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

const firebase = initializeApp(firebaseConfig);
const { getStorage } = require("firebase/storage");
// var defaultStorage = firebase.storage();
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = getStorage(firebase);



module.exports = {
  storage, ref, uploadBytes, getDownloadURL
}
