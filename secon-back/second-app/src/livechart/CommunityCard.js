import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { authContext } from "../contexts/AuthContext";
import { dataRendingContext } from "../contexts/DataRending";
import { liveChatContext } from "./LiveChatContext";
import useGetUser from "../hooks/useGetUser";
import useAction from "../hooks/ActionsHooks";
import config from "../hooks/Config";
import { uiContext } from "../contexts/UiContext";

const CommunityCard = ({object,usage}) => {
    const {getDate} = useContext(dataRendingContext);
    const {setFriendSelected} = useContext(liveChatContext)
    const {error,user :sender,setUser,fetchUser} = useGetUser()
    const {currentUser} = useContext(authContext);
    // const {id,first_name,last_name,username,last_message,last_message_date} = object;
    const {id,name,members,last_message_sender,last_message,date,picture,unread_chat} = object;
    const member = members.find((id) => id == currentUser.id)
    const {sendAction} = useAction("EXIT",`/community/room/${id}/`)
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
    }
    const cardStyle2 = {
        backgroundColor :  theme.bgColor,
    }
    const textStyle = {
        color : theme.color,
    }
    const textStyle2 = {
        color : theme.color2,
    }
    
    const history = useHistory();
    const cardClicked = () => {
            if (member){
                history.push(`/community/room/${id}/`)
                setFriendSelected("selected")
            } // to make the room container visible in wide screen
    }
    const handleJoin = (e) => {
        sendAction(`/livechat/join-community/${id}/`);
    }
    useEffect(() => {
        if (last_message_sender){
            fetchUser(`/accounts/user/${last_message_sender}/`)
        }
    },[])
    return ( 
        <div className="user-card  hidden " onClick={(e) => cardClicked(e)} style={cardStyle}>
                <div className="post-col1" style={cardStyle2}>
                    <Link to={`/community`} className='child-link' onClick={(e) => {e.stopPropagation()}} >
                        <img src={`${config.BASE_URL}${picture}`} className='profile-image' />
                    </Link>
                </div>
                <div className="m-col ">
                    <div className="post-header relative ">
                        <div className="post-userdata ">
                            <span className="post-name nmw " style={textStyle}> 
                            { name }
                            </span>
                        </div>
                        <div className="msg-date  " style={textStyle2}>
                             {getDate(date)}
                            {unread_chat >= 1 && <div className="message-notif-icon">
                               {unread_chat}
                            </div>}
                        </div>
                    </div>

                    {(!member && usage == 'search') && <span className="join-btn" onClick={(e) => {handleJoin(e)}}> join community</span>}
                    {last_message && <div className="last-msg" style={textStyle2}>
                        {sender && sender.username}: {last_message}
                    </div>}
                    { (!last_message && !usage)&& <div className="last-msg" style={textStyle2}>
                        new group!
                    </div>}
                </div>
        </div>
     );
}
 
export default CommunityCard;