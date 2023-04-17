import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, query, where,getDocs ,limit} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Timestamp,serverTimestamp } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBjKx6uTGiG72FbHRf8OqDGNNwPcl81_Ps",
    authDomain: "nextfirebaseblog.firebaseapp.com",
    projectId: "nextfirebaseblog",
    storageBucket: "nextfirebaseblog.appspot.com",
    messagingSenderId: "282482831672",
    appId: "1:282482831672:web:5fe5a1a74f54268aeb51cd",
    measurementId: "G-ECFBV14WG6"
  };

  const firebaseApp = initializeApp(firebaseConfig);


  export const auth = getAuth(firebaseApp);
  export const googleAuthProvider = new GoogleAuthProvider();
  export const firestore = getFirestore(firebaseApp);
  export const storage = getStorage(firebaseApp);

  // Helper functions

/**
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
 export async function getUserWithUsername(username) {
  // username = "travis";
  //console.log(username,"what username are talking here niggas");
  const q = query(collection(firestore, "users"), where("username", "==", username), limit(1));
  const querySnapshot = await getDocs(q);
  //console.log(querySnapshot);
  const userDoc = querySnapshot.docs[0];
  //console.log(userDoc.data());
  return userDoc;
  
    
  
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
 export function postToJSON(doc) {
  const data = doc?.data();
  // console.log(data,"let's see the fucking data for fucks sake im tired of this")
  const createdAt = data?.createdAt ? data.createdAt.toMillis() : 0;
  const updatedAt = data?.updatedAt ? data.updatedAt.toMillis() : 0;
  
  return {
    ...data,
    createdAt,
    updatedAt,
  };
}


export const fromMillis = Timestamp.fromMillis;
