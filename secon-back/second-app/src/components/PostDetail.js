import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import PostCard from "./Card";
// import useFetch from "./useFetch";
import { useContext, useEffect, useState } from "react";
import CommentForm from '../CommentForm';
import { dataRendingContext } from "../contexts/DataRending";
import { authContext } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import UpdateForm from "./UpdateForm";
import useDeleteData from "../hooks/DeleteData";
import { uiContext } from "../contexts/UiContext";

const PostDetail = () => {
    const {error} = useContext(authContext);
    const history = useHistory();
    const {id:postId} = useParams();
    const [visible ,setVisible] = useState("hidden");
    const postUrl = `/posts/post/${postId}/`;
    const commentsUrl = `/posts/post/${postId}/comments`;
    const {theme} = useContext(uiContext)
    const cardStyle2 = {
        backgroundColor : theme.bgColor2,
    }
    const textStyle = {
        color : theme.color,
    }
    
    const  {post,setPost,fetchPost,isParent,setIsParent} = useContext(dataRendingContext);
    const  {comments,setComments,fetchComments,showCForm,showUForm} = useContext(dataRendingContext)
    const {doDelete} = useDeleteData(comments,setComments);
    useEffect(() => {
        fetchPost(postUrl);
        fetchComments(commentsUrl)
    },[])
    return (
        <div className="post-detail-page relative ">
           <header className="flex center-v profile-header " style={cardStyle2}>
                <Link to='/'>
                    <div className="mr-10 ml-10"><i className="fa-solid fa-arrow-left"></i></div>
                </Link>
                <div className="names">
                <FontAwesomeIcon icon={faArrowLeft} style={textStyle} onClick={() => {history.go(-1)}} className="comment" />
                    <span className="bold ml-10" style={textStyle}> Post</span>
                </div>
            </header>
            {error && <div className="error-container">{error}</div>}

            <div className="mt-45">
                {post && <PostCard object = {post} doDelete={doDelete} ishover ='no' cardType='post' isParentCard={true}/>}
            </div>

            <div className="book-mark" style={textStyle}>
                Bookmark
            </div>

            <div className="comment-in">
            {comments && 
            comments
            .map((comment) => 
                    <PostCard object={comment} doDelete={doDelete} ishover ='no' cardType='comment' key={comment.id}/>
            )}
            </div>

            {!(comments && comments.length >= 1) && <div className="no-data"> No comments for the post</div>}
            {showCForm &&
                <CommentForm  data={comments} setData={setComments}/>
            }
            {(showUForm && !isParent) && <UpdateForm  data={comments} setData={setComments}/> }
            {(showUForm && isParent) && <UpdateForm  data={post} setData={setPost}/> }
        </div>
    );
}
 
export default PostDetail