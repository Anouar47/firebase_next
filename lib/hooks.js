import { useState,useEffect } from "react";
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { collection, doc, onSnapshot } from "firebase/firestore";
import {firestore} from '../lib/firebase'

export function useUserData()
{
    const [user] = useAuthState(auth);
  const [username,setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;
  
    if (user) {
      const usersRef = collection(firestore, "users");
      const docRef = doc(usersRef, user.uid);
  
      unsubscribe = onSnapshot(docRef, (doc) => {
        setUsername(doc.data()?.username);
        // console.log(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }
  
    return unsubscribe;
  }, [user]);
  return {user,username};
}