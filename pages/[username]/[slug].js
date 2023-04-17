import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { query,where,getDoc,collectionGroup,getDocs,collection,doc} from 'firebase/firestore';

export async function getStaticProps({params}){

    const {username,slug} = params;
    const userDoc = await getUserWithUsername(username);
    let post;
    let path;
    if (userDoc) {
       //const userDocs = userDoc.data();
       //console.log(userDocs);
        const postRef = collection(userDoc.ref, "posts");
        const postQuery = query(postRef, where("slug", "==", slug));
        const postsQuerySnapshot = await getDocs(postQuery);
        const postDoc = postsQuerySnapshot.docs[0];
        post = postToJSON(postDoc);
        console.log("OK VAMOS",post,"finally come on guys");

        //path = postRef.path;}
        path = postDoc.ref.path;    }
    
        return {
            props: { post, path: path ?? null },
            revalidate: 5000,
          };
        }
        export async function getStaticPaths() {
            const querySnapshot = await getDocs(collectionGroup(firestore, 'posts'));
          
            const paths = querySnapshot.docs.map((doc) => {
              const { slug, username } = doc.data();
              return {
                params: { username, slug },
              }
            });
            //console.log("these are the fucking paths",paths);
            return {
              paths,
              fallback: 'blocking',
            };
          }
    

          export default function Post(props) {
            //console.log(props,"props path");
            const postRef = doc(firestore, props.path);
            const [realtimePost] = useDocumentData(postRef);
          
            const post = realtimePost || props.post;
            //console.log(post,"this is the post");
          
            return (
              <main className={styles.container}>
          
                <section>
                  <PostContent post={post} />
                </section>
          
                <aside className="card">
                  <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                  </p>
          
                </aside>
              </main>
            );
          }