import AuthCheck from "@/components/AuthCheck";
import { firestore, Stimestamp } from "@/lib/firebase";
import styles from '../../styles/Admin.module.css';
import { auth } from "@/lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import {doc,getDoc } from "firebase/firestore";

export default function AdminPostEdit(props) {
    return(
        <AuthCheck>
            <PostManager />

        </AuthCheck>
       
    )
}
function PostManager(){

    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query || {};
    // console.log(firestore,auth.currentUser.uid,slug,"this is user");

    // const ref = doc(firestore, 'users', auth.currentUser.uid, 'posts', slug);
    // const [post, loading, error] = useDocument(ref);
    // console.log(error,loading,"posts vamooos");
    const getPost = async () => {
        const postRef = doc(firestore, 'users', auth.currentUser.uid, 'posts', slug);
        try {
          const docSnap = await getDoc(postRef);
          if (docSnap.exists()) {
            return docSnap.data();
          } else {
            console.log('No such document!');
          }
        } catch (e) {
          console.log('Error fetching document: ', e);
        }
        return postRef
      }
      
      // To use it:
      const [post, setPost] = useState(null);
      
      useEffect(() => {
        const fetchPost = async () => {
          const post = await getPost();
          setPost(post);
        };
        fetchPost();
      }, []);


    return(
        <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={getPost} defaultValues={post} preview={preview} />
          </section>

          <aside>
          <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
    )
}

// function PostForm({defaultValues,postRef,preview})
// {
//     const {register,handleSubmit,reset,watch} = useForm({defaultValues,mode:'onChange'})

//     const updatePost = async ({ content, published }) => {
//         await postRef.update({
//           content,
//           published,
//           updatedAt: Stimestamp(),
//         });
    
//         reset({ content, published });
    
//         toast.success('Post updated successfully!')
//       };

//     return (
//         <form onSubmit={handleSubmit(updatePost)}>
//         {preview && (
//           <div className="card">
//             <ReactMarkdown>{watch('content')}</ReactMarkdown>
//           </div>
//         )}
  
//         <div className={preview ? styles.hidden : styles.controls}>
    
//           <textarea name="content" ref={register}></textarea>
  
//           <fieldset>
//             <input className={styles.checkbox} name="published" type="checkbox" {...register('test', { required: true })}/>
//             <label>Published</label>
//           </fieldset>
  
//           <button type="submit" className="btn-green">
//             Save Changes
//           </button>
//         </div>
//       </form>
//     )
// }

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch } = useForm({
      defaultValues,
      mode: 'onChange',
    });
  
    const updatePost = async ({ content, published }) => {
        if(postRef)

     { await postRef.update({
        content,
        published,
        updatedAt: Stimestamp(),
      });}
  
      reset({ content, published });
  
      toast.success('Post updated successfully!');
    };
  
    return (
      <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="card">
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
          </div>
        )}
  
        <div className={preview ? styles.hidden : styles.controls}>
          <textarea name="content" {...register('content')} />
  
          <fieldset>
            <input
              className={styles.checkbox}
              type="checkbox"
              {...register('published', { required: true })}
            />
            <label>Published</label>
          </fieldset>
  
          <button type="submit" className="btn-green">
            Save Changes
          </button>
        </div>
      </form>
    );
  }