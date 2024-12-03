import { faArrowUp, faBasketShopping, faDeleteLeft, faDownLeftAndUpRightToCenter, faEdit, faExchangeAlt, faEye, faFlag, faHandHolding, faHandshakeSimpleSlash, faJoint, faTimesCircle, faTrash, faUserCheck, faUserPlus, faUserSlash, faVolumeMute} from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons/faComment";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faRotate } from "@fortawesome/free-solid-svg-icons/faRotate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { dataRendingContext } from "../contexts/DataRending";
import { authContext } from "../contexts/AuthContext";
import { uiContext } from "../contexts/UiContext";
import useLikeData from "../hooks/likeData";
import useFollowUser from "../hooks/Following";
import useAction from "../hooks/ActionsHooks";
import config from "../hooks/Config";
import VideoPlayer from "./VideoPlayer";
import { fa6 } from "@fortawesome/free-solid-svg-icons/fa6";

const PostCard = ({object,doDelete,ishover,cardType,isParentCard}) => {
    const {filetypeChecker,setIsParent} = useContext(dataRendingContext);
    const {currentUser} = useContext(authContext);
    const {id,body,likes,file,shares,reposts,views,date,postcomments,replies} = object;
    const {first_name,last_name,username} = object.user? object.user : {};
    const {likeData} = useLikeData();
    const [liked,setLiked] = useState(
        likes.find((id) => id===currentUser.id) ? 'liked' : 'notliked'
    )
    const [numLikes,setNumLikes] = useState(likes? likes.length : '')
    const history = useHistory();
    const [followed,setFollowed] = useState(null) 
    // const [followedMe,setFollowedMe] = useState(null) 
    const {followUser} = useFollowUser();
    const {sendAction} = useAction();

    const owner = (currentUser.id === object.user.id) ? true : false
    const { setCommentFormType,setShowCForm,
            setShowUForm,setClickedObjectId,getDate} = useContext(dataRendingContext);
    const {showCardDD,hideAllDD,theme} = useContext(uiContext);

    const noInterest = (e) => {
        sendAction(`/posts/post/${id}/interest/`)
    }
    const follow = (e) => {
        e.stopPropagation();
        followUser(`/accounts/user/${id}/follow/`);
        setFollowed(!followed);
    }
    const deleting = (e,id) => {
        e.stopPropagation();
        document.querySelector(`#comment-form-dialog-${id}`).showModal();
    }
    const hideDialog = (e) => {
        e.stopPropagation();
        hideAllDD();
        document.querySelector(`#comment-form-dialog-${id}`).close();
    }
    const confirmDeletion = (e,Id) => {
        e.stopPropagation();
        document.querySelector(`#comment-form-dialog-${id}`).close();
        // console.log(id,cardType);
        if (cardType === 'post'){
            doDelete(`/posts/post/${Id}/`,Id)
        }else{
            doDelete(`/posts/post/${Id}/comment/`,Id)
        }
    }
    const update = (e,objectId) => {
        if (isParentCard == true){
            setIsParent(true)
        }else{
            setIsParent(false)
        }
        setShowUForm(true);
        setCommentFormType(cardType);
        setClickedObjectId(objectId);
    }
    const commentClick = (objectId) => {
        setCommentFormType(cardType); //if ist comment or post
        setClickedObjectId(objectId);
        // console.log(cardType);
        setShowCForm(true);
    }
    const like =(e,id) => {
        e.stopPropagation();
        if(liked === 'liked'){
            setLiked('notliked');
            setNumLikes(numLikes - 1)
        }else{
            setLiked('liked')
            setNumLikes(numLikes + 1)
        }
        likeData(`/posts/${cardType}-like/${id}/`);
    }
   
    const setHover = (hover='yes') =>{
        if (hover !== "yes") {
        const PostCard = document.querySelector('.post-card');
        PostCard.addEventListener("mouseover",() => {
            PostCard.style.backgroundColor = `unset`;
        });
        }
    }
    const cardClicked = () => {
        if (window.location.pathname !== `/${cardType}/${id}/`){
            history.push(`/main/${cardType}/${id}/`)
        }
    }
    const imageClicked = (e) => {
        e.stopPropagation();
        window.location = `${config.BASE_URL}${file}`
    }
    useEffect(() => {
        setHover(ishover);
    })
    const cardStyle = {
        backgroundColor : theme.bgColor,
        borderBottom : `1px solid ${theme.color2}`,
    }
    const textStyle = {
        color : theme.color,
    }
    const textStyle2 = {
        color : theme.color2,
    }
    const iconStyle = {
        color : theme.iconColor,
    }
    
    return ( 
        <div className="post-card "  id={`card_${id}-${cardType}`} onClick={(e) => cardClicked(e)} style={cardStyle}>
                <dialog className="comment-form-dialog room-dialog" id={`comment-form-dialog-${id}`}>
                    <form action="" className="flex-center-colum">
                        <div className="dialog-question  room-dialog-text">
                            Are you sure you want permanently<span className="delete">delete</span> this {cardType}?
                        </div>
                        <button type="button" className="cancel-dialog room-dialog-btn" onClick={hideDialog}>no cancel</button>
                        <button type="button" className="confirm-action room-dialog-btn dlt-txt" onClick={(e) => {confirmDeletion(e,id)}}>yes delete!</button>
                    </form>
                </dialog>


                <div className="post-col1 " onClick={(e) => {e.stopPropagation()}}>
                    <Link to={`/main/profile/${object.user.id}`} className='child-link' onClick={(e) => {e.stopPropagation()}} >
                        {/* <img src={process.env.PUBLIC_URL+`/image/GQkndUQakAM7Hq6.png`} className='profile-image' /> */}
                        <img src={`${config.BASE_URL}${object? object.user.picture : null}`} alt={`user picture`} className='profile-image'/>
                    </Link>
                </div>
                <div className="post-col2 bordered">
                    <div className="post-header relative">
                                <div className="post-userdata" >
                                    <span className="post-name" style={textStyle}> 
                                    { first_name ? `${first_name} ${last_name}` : 'Anonymous_user'}
                                    </span>
                                    <span className="post-username" style={textStyle2} >@{username}</span>
                                    <span className="post-date" style={textStyle2} >{getDate(date)}</span>
                                </div>
                                <div className="post-dot" onClick={(e) => {showCardDD(e,`dot-${id}_${cardType}`)}} style={{cardStyle}}>
                                    <div className="post-dot-container dropdown hidden" id={`dot-${id}_${cardType}`}>
                                        {owner && <div className="child-lin flex ">
                                            <FontAwesomeIcon className="dd-icon " icon={faTrash}/>
                                            <span className="" onClick={(e) => {deleting(e,id)}}>Delete {cardType}</span>
                                        </div>}
                                        {owner && <div className="child-lin flex" onClick={(e) => {update(e,id)}}>
                                            <FontAwesomeIcon className="dd-icon" icon={faEdit}/>
                                            
                                            <span className="" >Update {cardType} </span>
                                        </div>}
                                        {!owner && <div className="flex " >
                                            <FontAwesomeIcon className="dd-icon " icon={faTimesCircle}/>
                                            <span className=""  onClick={(e) => {noInterest(e)}}>Not interested in </span>
                                        </div>}
                                        <div className=" child-link">
                                            
                                        </div>

                                        {(!owner && !followed) && <div className=" flex"  onClick={(e) => {follow(e)}}>
                                            <FontAwesomeIcon className="dd-icon" icon={faUserPlus}/> 
                                            <span className=""> follow  @{username}</span>
                                        </div>}
                                        {(!owner && followed) && <div className=" flex"   onClick={(e) => {follow(e)}}>
                                            <FontAwesomeIcon className="dd-icon" icon={faUserCheck}/>
                                            <span className=""> unfollow  @{username}</span>
                                        </div>}
                                            
                                        {!owner &&  <div className=" child-link flex">
                                            <FontAwesomeIcon className="dd-icon" icon={faVolumeMute}/>
                                            <span className=""> Mute  @{username}</span>
                                        </div>}
                                        {!owner &&  <div className=" child-link flex">
                                            <FontAwesomeIcon className="dd-icon" icon={faUserSlash}/>
                                            <span className=""> Block  @{username}</span>
                                        </div>}
                                        {!owner &&  <div className=" child-link flex">
                                            <FontAwesomeIcon className="dd-icon" icon={faFlag}/>
                                            <span className=""> Report Post</span>
                                        </div>}
                                    </div>
                                    <FontAwesomeIcon icon={faEllipsisV} style={iconStyle}/>
                                </div>
                    </div>
                    <div className="post-txt" style={textStyle} >
                        {body}
                    </div>
                    <div className="post-media">
                        { file && filetypeChecker(file)[0] === "video" &&
                            <VideoPlayer 
                                filepath = {`${config.BASE_URL}${file}`}
                                videotype = {`video/${filetypeChecker(file)[1]}`}
                                className={'videoplayer'}
                            />  
                        }
                        {file && filetypeChecker(file)[0] === "image"&& 
                        <img src={`${config.BASE_URL}${file}`} alt={file} srcSet="" className="post-image" onDoubleClick={(e) => {
                            imageClicked(e)}} onclick = {(e) => {e.stopPropagation()}} />
                        }
                        {file && filetypeChecker(file)[0] === "audio" && 
                        <audio src={`${config.BASE_URL}${file}`} controls className="audio-player CAP" 
                        />
                        }
                    </div>
                            
                    {/* the post navbar */}
                    <div className="postnav">
                                <div className='post-nav-link child-link' id ="comment-${id}" onClick={(e) => {
                                    e.stopPropagation();
                                    commentClick(id);
                                }}>
                                    <div className=""  style={textStyle2}>
                                        <FontAwesomeIcon icon={faComment} className="comment" style={textStyle2}/>{postcomments? postcomments.length : replies.length}
                                    </div>
                                </div>

                                <Link to="##" className='post-nav-link child-link' id ="repost-${id}">
                                    <div className=""  style={textStyle2}>
                                        <FontAwesomeIcon icon={faRotate} className="comment"  style={textStyle2}/>{reposts.length}
                                    </div>
                                </Link>

                                <div className='post-nav-link child-link' >
                                    <div className="like" style={textStyle2} >
                                        <FontAwesomeIcon icon={faHeart} className={`comment ${liked}`} style={textStyle2} id ={`${cardType}like-${id}`}
                                    onClick={(e) => {like(e,id)}} />{numLikes}

                                    </div>
                                </div>

                                <Link to="##" className='post-nav-link child-link' id ="view-${id}">
                                    <div className="view"  style={textStyle2}>
                                        <FontAwesomeIcon icon={faEye} className="comment"  style={textStyle2}/>{views}
                                    </div>
                                </Link>

                                <Link to="##" className='post-nav-link child-link' id = {`share-${id}`}>
                                    <div className="share"  style={textStyle2}>
                                        <FontAwesomeIcon icon={faArrowUp} className="comment"  style={textStyle2}/>{shares.length}
                                    </div>
                                </Link>
                    </div>
                </div>
        </div>
     );
}
 
export default PostCard;