import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { authContext } from "../contexts/AuthContext";
import useFollowUser from "../hooks/Following";
import config from "../hooks/Config";
import { uiContext } from "../contexts/UiContext";

const UserCard = ({object,usage=''}) => {
    const [followed,setFollowed] = useState(null) 
    const [followedMe,setFollowedMe] = useState(null) 
    const addingMode = usage == 'adding'
    // console.log(addingMode);
    const {currentUser} = useContext(authContext);
    const {id,first_name,last_name,username,picture} = object;
    const history = useHistory();
    const {followUser} = useFollowUser();
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
    }
    const cardStyle2 = {
        backgroundColor : theme.bgColor2,
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
    const btnStyle = {
        backgroundColor :  theme.iconColor,
        color : theme.color2,
    }
    const myProfile = (currentUser && (currentUser.id == id))? true : false ;
    const cardClicked = () => {
        if( !addingMode){
            history.push(`/main/profile/${id}/`)
        } else{
            return
        }
    }
    const follow = (e) => {
        e.stopPropagation();
        followUser(`/accounts/user/${id}/follow/`)
        setFollowed(!followed)
    }
    useEffect(() => {
        if (object){
            setFollowed(
                object? object.followers.includes(currentUser.id) : false
            )
            setFollowedMe(
                currentUser ? currentUser.followers.includes(id) : false
            )
        }
    },[])
    return ( 
        <div className={`user-card ${addingMode? 'Cadding-mode':''}`} key={id} onClick={(e) => cardClicked(e)} style={cardStyle}>
                <div className="post-col" style={cardStyle2}>
                    { followedMe && <div className="follow-me" style={textStyle2}>follows you</div>}
                    <Link to={`/main/profile/${id}`} className='child-link' onClick={(e) => {e.stopPropagation()}} >
                        {/* <img src={process.env.PUBLIC_URL+`/image/GQkndUQakAM7Hq6.png`} className='profile-image' /> */}
                        <img src={`${config.BASE_URL}${picture}`} alt={`${picture}`} className='profile-image'/>
                    </Link>
                </div>
                <div className="m-col">
                    <div className="post-header">
                        <div className="u-post-userdata">
                            <span className="u-post-name"  style={textStyle}> 
                            { first_name ? `${first_name} ${last_name}` : 'Anonymous_user'}
                            </span>
                            <span className="u-post-username"  style={textStyle2}>@{username}</span>
                        </div>
                    </div>
                    <div className={`last-msg ${addingMode? 'adding-mode':''}`}  style={textStyle}>
                        {object && object?.profile?.title}
                    </div>
                </div>

                {/* <div className="u-buttons border"> */}
                {(!myProfile && !followed && !addingMode && followedMe) && <div className=""  >
                    <button type="button" onClick={(e) => {follow(e)}} className="user-btn"  style={btnStyle} >follow back</button>
                </div>}
                {(!myProfile && !followed && !addingMode && !followedMe) && <div className=""  >
                    <button type="button" onClick={(e) => {follow(e)}} className="user-btn"   style={btnStyle} >follow</button>
                </div>}
               {(!myProfile && followed && !addingMode) && <div className=""  style={cardStyle} >
                    <button type="button" onClick={(e) => {follow(e)}} className="followed"  style={textStyle} >unfollow</button>
                </div>}
                {/* </div> */}
        </div>
     );
}
 
export default UserCard;