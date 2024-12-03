import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { authContext } from "../contexts/AuthContext";
import useFollowUser from "../hooks/Following";
import { dataRendingContext } from "../contexts/DataRending";
import { liveChatContext } from "./LiveChatContext";
import config from "../hooks/Config";
import { uiContext } from "../contexts/UiContext";

const FriendCard = ({object}) => {
    const [followedMe,setFollowedMe] = useState(null);
    const {getDate} = useContext(dataRendingContext);
    const {setFriendSelected} = useContext(liveChatContext)
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
    }
    const cardStyle2 = {
        backgroundColor :  theme.bgColor2,
    }
    const textStyle = {
        color : theme.color,
    }
    const textStyle2 = {
        color : theme.color2,
    }
    const {currentUser} = useContext(authContext);

    const {id,first_name,last_name,username,picture,last_message,last_message_date,unread_chats} = object;
    const history = useHistory();
    const cardClicked = () => {
        history.push(`/dm/room/${id}/`)
        setFriendSelected("selected") // to make the room container visible in wide screen
    }

    return ( 
        <div className="user-card" key={id} onClick={(e) => cardClicked(e)} style={cardStyle}>
                <div className="post-col1 relative" style={cardStyle2}>
                    { followedMe && <div className="follow-me" style={textStyle2}>follows you</div>}
                    <Link to={`/main/profile/${id}`} className='child-link' onClick={(e) => {e.stopPropagation()}} >
                        <img src={`${config.BASE_URL}${picture}`} alt={`user-pic`} className='profile-image'/>
                    </Link>
                </div>

                <div className="m-col" >
                    <div className="post-header">
                        <div className="f-post-userdata">
                            <span className="u-post-name" style={textStyle}> 
                            { first_name ? `${first_name} ${last_name}` : 'Anonymous_user'}
                            </span>
                            
                            <span className="u-post-username "  style={textStyle2}>@{username}</span>
                        </div>
                        <div className="msg-date"  style={textStyle2}>
                            {getDate(last_message_date)}
                            {(unread_chats > 0) && 
                                <div className="message-notif-icon">
                                    {unread_chats}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="last-msg"  style={textStyle2}>
                        {object && last_message}
                    </div>

                </div>
        </div>
     );
}
 
export default FriendCard;