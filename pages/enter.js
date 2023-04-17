import{auth,firestore,googleAuthProvider} from '../lib/firebase';
import {  doc, collection, getDoc, writeBatch } from "firebase/firestore";
import {signInWithPopup} from "firebase/auth";
import { useCallback, useContext,useState,useEffect } from "react";
import { UserContext } from "@/lib/context";
import debounce from 'lodash.debounce';

export default function Enter(props) {
    const {user,username} = useContext(UserContext);
    
    return(
        <main>
            {user ? 
            !username ? <UsernameForm />: <SignOutButton/>
            :
            <SignInButton/>
            }
        </main>
    )
}
function SignInButton() {
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            // User signed in successfully.
            const user = result.user;
            // console.log(user);
          } catch (error) {
            // Handle errors here.
            // console.log(error);
          }

    };
    return (<button className="btn-google" onClick = {signInWithGoogle}>
        <img src={'/google_logo.jpg'} /> Sign in with Google

    </button>
    );

}

function SignOutButton() {
    return <button onClick={()=>auth.signOut()}>Sign Out</button> ;

}

function UsernameForm() {
const [formValue,setFormValue] = useState('');
const [isValid,setIsValid] = useState(false);
const [loading,setLoading] = useState(false);

const {user,username} = useContext(UserContext);

useEffect(() => {
    checkUsername(formValue);
  
    
  }, [formValue])

const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
        setFormValue(val);
        setLoading(false);
        setIsValid(false);
      }
  
      if (re.test(val)) {
        setFormValue(val);
        setLoading(true);
        setIsValid(false);
      }
    };

const checkUsername = useCallback(
debounce(async (username) => {
    if (username.length >= 3) {
        const usersRef = collection(firestore, "usernames");
        const ref= doc(usersRef,`${username}`);
        const docSnapshot = await getDoc(ref);
        const exists = docSnapshot.exists();
        // console.log(exists);
        console.log('Firestore Read Executed !');
        setIsValid(!exists);
        setLoading(false);


    }
},500),[]);

const onSubmit = async (e) => {
    e.preventDefault();
    const userDoc = collection(firestore, "users");
    const userRef= doc(userDoc,`${user.uid}`);
    const usernameDoc = collection(firestore, "usernames");
    const usernameRef= doc(usernameDoc,`${formValue}`);
    // const usernameDoc = firestore.doc(`usernames/${formValue}`);

    const batch = writeBatch(firestore);
    batch.set(userRef, {username : formValue,photoURL:user.photoURL,displayName:user.displayName});
    batch.set(usernameRef, {uid:user.uid});

    await batch.commit();
};





return (
    !username && (
        <section>
        <h3>Pick a Username</h3>
        <form onSubmit={onSubmit}>
            <input name='username' placeholder='Username' value={formValue} onChange={onChange}/>
            <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
            <button type='submit' className='btn-green' disabled={!isValid}> Pick </button>
            <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>

        </form>
        </section>
    )

);

}
function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
  }