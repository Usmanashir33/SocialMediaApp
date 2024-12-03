import {Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import './profile.css';
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons/faCalendarAlt";
import useGetUser from "../hooks/useGetUser";
import { dataRendingContext } from "../contexts/DataRending";
import useFollowUser from "../hooks/Following";
import { authContext } from "../contexts/AuthContext";
import UserUpdateForm from "./UserUpdateForm";
import { liveChatContext } from "../livechart/LiveChatContext";
import config from "../hooks/Config";
import ImageViewer from "./ImageViewer";
import { uiContext } from "../contexts/UiContext";

const Profile = () => {
    const {pk} = useParams(); // this is the user id
    const history = useHistory();
    const {user,setUser,fetchUser} = useGetUser();
    const [followers,setFollowers] = useState(0) ;
    const [followings,setFollowings] = useState(0) ;
    const {userTotal,showUserForm,setShowUserForm} = useContext(dataRendingContext);
    const {currentUser} = useContext(authContext);
    const {setFriendSelected,friendSelected} = useContext(liveChatContext);
    const {followUser} = useFollowUser();
    const myProfile = (currentUser && (currentUser.id === pk))? true : false ;
    const [followed,setFollowed] = useState(null) ;
    const [showImage,setShowImage] = useState(false);
    const [imageLink,setImageLink] = useState('');
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
        // height: `100%`
    }
    const cardStyle2 = {
        backgroundColor : theme.bgColor2,
    }
    const btnStyle = {
        backgroundColor : theme.bgColor2,
        color : theme.color ,
    }
    const rIStyle = {
        backgroundColor : theme.bgColor2,
        borderColor : theme.bgColor ,
    }
    const textStyle = {
        color : theme.color,
    }
    const titleStyle = {
        backgroundColor : `unset`,
        color : theme.iconColor
    }
    const textStyle2 = {
        color : theme.color2,
    }
    const iconStyle = {
        color : theme.iconColor,
    }
    const setDate = (date) => {
        let DATE = new Date(date)
        return DATE.toDateString();
    }
    useEffect(() => {
        fetchUser(`/accounts/user/${pk}/`);
    },[pk])
    useEffect(() => {
        if (user){
            setFollowers(user.followers.length)
            setFollowings(user.followings.length)
            setFollowed(
                user ? user.followers.includes(currentUser.id) : false
            )
        }
    },[user]);
    const bigImage = (e) => {
        let url = e.target.src
        if (url) {
            setImageLink(url);
            setShowImage(true)
        }
    }
    const follow = (e) => {
        setFollowers(
            followed? followers - 1 : followers + 1
        )
        setFollowed(!followed)
        followUser(`/accounts/user/${pk}/follow/`)
    }
    const hitDm = (e) => {
        history.push(`/dm/room/${pk}/`);
        if (!friendSelected){
            setFriendSelected('selected');
        }
    }
    return ( 
    //     page start
        <div className="profile main-page " style={cardStyle}>
            { showImage && <ImageViewer  pictureLink={imageLink}  setShowImage = {setShowImage}/>}
            <div className=" relative">

                <header className="flex profile-header fixed-header" style={cardStyle2}>
                    <div className="mr-back" onClick={() => {history.go(-1)}}>
                        <FontAwesomeIcon icon={faArrowLeft} style={textStyle}/>
                    </div>
                    <div className="names">
                        <span className="bold name" style={textStyle}>
                            { (user && user.first_name) ? `${user.first_name} ${user.last_name}` : 'Anonymous_user'}

                        </span>
                        <span className="counter muted-txt small-txt block" style={textStyle2}> {userTotal}</span>
                    </div>
                </header>

                <div className="profile-images relative">
                    <img src={`${config.BASE_URL}${user? user.picture : null}`} alt={`u-pic`} onDoubleClick={(e) => {
                        bigImage(e)
                    }} className='wide-img'/>
                    <img src={`${config.BASE_URL}${user? user.picture : null}`} alt={`u-pic`} onDoubleClick={(e) => {
                        bigImage(e)
                    }} className='rounded-img' style={rIStyle}/>
                </div>
        
                <div className="user-buttons">
                    {(!myProfile) && <div className="simple-link">
                        <button type="button" onClick={(e) => {hitDm(e)}} className="user-btn">message</button>
                    </div>}

                {(!myProfile && !followed) && <div className="simple-link"  >
                        <button type="button" onClick={(e) => {follow(e)}} className="user-btn">follow</button>
                    </div>}
                {(!myProfile && followed) && <div className="simple-link"  >
                        <button type="button" onClick={(e) => {follow(e)}} className="followed">unfollow</button>
                    </div>}

                { myProfile && <div className="simple-link">
                        <button type="button" className="user-btn" onClick={(e) => {setShowUserForm(true)}}>Edit Profile</button>
                    </div>}
                </div>
        
                <div className="user-info">
                    <div className=""id='profile-fullname' style={textStyle}>
                    {user ? user.first_name : ""} {user ? user.last_name : ""}
                        <span className="block" id="profile-username" style={textStyle2}>@{user && user.username} </span>
                    </div>
                    
                    { (user) && <div className="header-title" style={titleStyle}>
                        {user.profile.title}
                    </div>}
                    <div className="address ">
                        <span className=" mr-10" id="profile-address " style={textStyle2}>
                            <FontAwesomeIcon 
                                icon={faLocationDot} 
                                className="adjust-icon mr-10"
                                style={iconStyle}
                            />
                            {user && user.profile.address}
                        </span>
        
                        <span className="mr-10" id="profile-date-joined" style={textStyle2}>
                        <FontAwesomeIcon 
                                icon={faCalendarAlt} 
                                className="adjust-icon mr-10"
                                style={iconStyle}
                            />
                            {user && setDate(user.date_joined)}
                        </span>
                    </div>
        
                    <div className="follow">
                        <Link to={`/main/followers/${pk}`} style={textStyle2}> <span className="followers ml-10"style={textStyle}>{followers}</span> followers </Link>
                        <Link to={`/main/followings/${pk}`} style={textStyle2}> <span className="following "style={textStyle} > {followings} </span> followings </Link>
                    </div>
                </div>

                <nav className="additional-data ">
                    <NavLink to={`/main/profile/${pk}`}  style={btnStyle}exact onClick={(e) => {}}  className="post-section header-link">Posts</NavLink>
                    <NavLink to={`/main/profile/${pk}/replies`} style={btnStyle} onClick={(e) => {}} className="replies-section header-link">Replies</NavLink>
                    <NavLink to={`/main/profile/${pk}/media`} style={btnStyle} onClick={(e) => {}} className="media-section header-link">Media</NavLink>
                    <NavLink to={`/main/profile/${pk}/likes`} style={btnStyle} onClick={(e) => {}} className="likes-section header-link">Likes</NavLink>
                </nav>

            </div>
            {showUserForm && <UserUpdateForm data = {user} setData={setUser}/>}
        </div>
    // page ends 
     );
}
 
export default Profile;