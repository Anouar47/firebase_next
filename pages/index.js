
import { query,collectionGroup, where, orderBy, limit, getDocs,startAfter } from "firebase/firestore";
import { useState } from 'react';
import Loader from '../components/Loader'
import { firestore,fromMillis,postToJSON } from '@/lib/firebase';
import PostFeed from '@/components/PostFeed';
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT));
  const postsQuerySnapshot = await getDocs(postsQuery);
  const posts = postsQuerySnapshot.docs.map((doc) => postToJSON(doc));
  // console.log(posts,"come on nigger I'm tired of this")

  return {
    props: { posts },
  };
}



export default function Home(props) {
  const [posts,setPosts] = useState(props.posts);
  const [loading,setLoading] = useState(false);
  const [postsEnd,setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length -1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt):last.createdAt;
    const postsQuery = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT),startAfter(cursor));
    const postsQuerySnapshot = await getDocs(postsQuery);
    const newPosts = postsQuerySnapshot.docs.map((doc) => doc.data());
    setPosts(posts.concat(newPosts));
    setLoading(false);
    if (newPosts.length < LIMIT)
    {
      setPostsEnd(true);

    }




  }

  return (
    <div>
      <PostFeed posts = {posts} />
      {! loading && !postsEnd && <button onClick={getMorePosts}>Load More Posts</button>}

        <Loader show={loading} />
        {postsEnd && 'No more Posts'}
    </div>
   
  )
}
