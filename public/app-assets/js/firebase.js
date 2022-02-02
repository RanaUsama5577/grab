// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import * as fbstorage from "https://www.gstatic.com/firebasejs/9.2.0/firebase-storage.js";
import * as fbfirestore from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";
import * as realtimeDb from "https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js";

var firebaseConfig = {
    apiKey: "AIzaSyD8QC6ZsR64favCseZEHUvtNTadH_Iz7PE",
    authDomain: "grab-yo-groceries.firebaseapp.com",
    databaseURL: "https://grab-yo-groceries.firebaseio.com",
    projectId: "grab-yo-groceries",
    storageBucket: "grab-yo-groceries.appspot.com",
    messagingSenderId: "418215715550",
    appId: "1:418215715550:web:53fce5dc6d5a3adf97984f",
    measurementId: "G-2EQ0JYR8JW"
};
// Initialize Firebase
export  const app = initializeApp(firebaseConfig);
export let auth = fbauth;
export let db = fbfirestore.getFirestore(app);
export let doc = fbfirestore.doc;
export let getDoc = fbfirestore.getDoc;
export let storage = fbstorage;
export let getDocs = fbfirestore.getDocs;
export let query = fbfirestore.query;
export let where = fbfirestore.where;
export let orderBy = fbfirestore.orderBy;
export let setdoc = fbfirestore.setDoc;
export let timestamp = fbfirestore.Timestamp;
export let collection = fbfirestore.collection;
export let addDoc = fbfirestore.addDoc;
export let setDoc = fbfirestore.setDoc;
export let updateDoc = fbfirestore.updateDoc;
export let deleteDoc = fbfirestore.deleteDoc;
export let serverTimestamp = fbfirestore.serverTimestamp;
export let onSnapshot = fbfirestore.onSnapshot;
// Realtime
export let realdb = realtimeDb.getDatabase();
export let ref = realtimeDb.ref;
export let get = realtimeDb.get;
export let child = realtimeDb.child;
export let onValue = realtimeDb.onValue;
export let runTransaction   = realtimeDb.runTransaction;
export let updateNode   = realtimeDb.update;
export let setNode   = realtimeDb.set;
export let removeNode   = realtimeDb.remove;
export let queryReal   = realtimeDb.query;
export let orderByChild   = realtimeDb.orderByChild;
export let equalTo   = realtimeDb.equalTo;