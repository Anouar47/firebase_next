import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername } from "@/lib/firebase";
import { collection, query as firestoreQuery, where, orderBy, limit, getDocs } from "firebase/firestore";
import { postToJSON } from "@/lib/firebase";

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserWithUsername(username);

  if(!userDoc){
    return {
      notFound:true,
    };
  }
  let user = null;
  let posts = null;
  if (userDoc) {
    user = userDoc.data();
    const postsRef = collection(userDoc.ref, "posts");
    const postsQuery = firestoreQuery(postsRef, where("published", "==", true), orderBy("createdAt", "desc"), limit(5));
    const postsQuerySnapshot = await getDocs(postsQuery);
    posts = postsQuerySnapshot.docs.map((doc) => postToJSON(doc));
  }
  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
