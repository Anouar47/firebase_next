import Metatags from "@/components/Metatags";
import AuthCheck from "@/components/AuthCheck";
export default function AdminPostPage({props }) {
    return(
        <main>
            <Metatags title = "Admin Page"/>
            <AuthCheck>
            <h1>Edit Post</h1>
            </AuthCheck>
            
        </main>
    )
}