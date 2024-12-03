import { useContext, useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import PostCard from "./components/Card";
import { authContext } from "./contexts/AuthContext";
import { dataRendingContext } from "./contexts/DataRending";
import UpdateForm from "./components/UpdateForm";
import useDeleteData from "./hooks/DeleteData";
import { uiContext } from "./contexts/UiContext";

const Posts = () => {
    const {error} = useContext(authContext);
    const { posts,fetchPosts,setPosts,showCForm,showUForm,refreshPosts} = useContext(dataRendingContext);
    const {doDelete} = useDeleteData(posts,setPosts);
   
    useEffect(() => {
        fetchPosts("/posts/posts/");
    },[refreshPosts])
    
    return (
        <div className="posts-container" >
           { posts && posts.map(post => (
                // insert your card
                <PostCard object = {post} doDelete={doDelete} cardType='post' key={post.id} />
            ))}
            {error && <div className="error-container">{error}</div>}
            {/* insert commenting form  */}
            {showCForm && <CommentForm /> }
            {showUForm && <UpdateForm  data={posts} setData={setPosts}/> }
        </div>
    );
}
 
export default Posts;