import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import PostCard from "./Card";
// import useFetch from "./useFetch";
import { useContext, useEffect, useState } from "react";
import CommentForm from '../CommentForm';
import useFetchData from "../hooks/fetchData";
import { dataRendingContext } from "../contexts/DataRending";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import UpdateForm from "./UpdateForm";
import useDeleteData from "../hooks/DeleteData";
import { uiContext } from "../contexts/UiContext";

const CommentDetail = () => {
    const {id:commentId} = useParams();
    const history = useHistory();
    // console.log(commentId);
    const commentUrl = `/posts/post/${commentId}/comment/`;
    const repliesUrl = `/posts/comment/${commentId}/replies/`;
    const {replies,setReplies,fetchReplies,showCForm,showUForm,isParent} = useContext(dataRendingContext);
    const {doDelete} = useDeleteData(replies,setReplies);
    const {data:comment,fetchData:fetchComment,setData:setComment} = useFetchData() ;
    const {theme} = useContext(uiContext)
    const cardStyle2 = {
        backgroundColor : theme.bgColor2,
    }
    const textStyle = {
        color : theme.color,
    }
    
    useEffect(() => {
        fetchComment(commentUrl);
        // fetchData(commentUrl);
        fetchReplies(repliesUrl);
   },[commentId])
    return (
        <div className="post-detail-page relative">
           <header className="flex center-v profile-header" style={cardStyle2}>
                <Link to='/'>
                    <div className="mr-10 ml-10"><i className="fa-solid fa-arrow-left"></i></div>
                </Link>
                <div className="names">
                <FontAwesomeIcon icon={faArrowLeft} style={textStyle} onClick={() => {history.go(-1)}} className="comment" />
                    <span className="bold ml-10" style={textStyle}> Replies </span>
                </div>
            </header>
            <div className="mt-45">
                {comment && 
                    <PostCard object = {comment} doDelete={doDelete} ishover ='no' cardType='comment' isParentCard={true} key={commentId}/>
                    }
            </div>
            <div className="book-mark">
                Bookmark
            </div>
            <div className="comment-in">
            {replies && 
            replies.map((reply) => 
                <PostCard object={reply} doDelete={doDelete} ishover ='no'cardType='comment' key={reply.id} />
            )}
            </div>

            {showCForm &&
                <CommentForm  data={replies} setData={setReplies}/>
            }
            {(showUForm && !isParent) && <UpdateForm  data={replies} setData={setReplies}/> }
            {(showUForm && isParent) && <UpdateForm  data={comment} setData={setComment}/> }
            {!(replies && replies.length >= 1) && <div className="no-data"> No replies available now</div>}

        </div>
    );
}
 
export default CommentDetail