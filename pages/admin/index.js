import Metatags from "@/components/Metatags";
import styles from '../../styles/Admin.module.css';
import PostFeed from '../../components/PostFeed';
import AuthCheck from "@/components/AuthCheck";
import { collection,doc,setDoc,query,orderBy } from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "@/lib/context";
import { useCollection } from 'react-firebase-hooks/firestore';
import { useState } from "react";
import kebabCase from "lodash.kebabcase";
import { firestore, auth, Stimestamp} from '../../lib/firebase';
import toast from 'react-hot-toast';


export default function AdminPostPage({ props }) {
  return (
    <main>
      <Metatags title="Admin Page" />
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}
function PostList() {
  const postsRef = collection(
    firestore,
    "users",
    auth.currentUser.uid,
    "posts"
  );
  const postsQuery = query(postsRef, orderBy("createdAt"));
  const [postsSnapshot] = useCollection(postsQuery);
  const posts = postsSnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    //const ref = doc(firestore, `users/${uid}/posts/${slug}`);
    const ref = doc(firestore, 'users', uid, 'posts', slug);
    const data = {
        title,
        slug,
        uid,
        username,
        published: false,
        content: '# hello world!',
        createdAt: Stimestamp(),
        updatedAt: Stimestamp(),
        heartCount: 0,
      };

      await setDoc(ref, data);
      toast.success('Post created!')

      // Imperative navigation after doc is set
      router.push(`/admin/${slug}`);

  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article"
        className={styles.input}
      />
      <p>
        <strong>Slug: </strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
