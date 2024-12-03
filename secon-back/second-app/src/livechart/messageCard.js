import { useContext, useEffect } from "react";
import { authContext } from "../contexts/AuthContext";
import { dataRendingContext } from "../contexts/DataRending";
import { liveChatContext } from "./LiveChatContext";
import useGetUser from "../hooks/useGetUser";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa0 } from "@fortawesome/free-solid-svg-icons/fa0";
import { faBan, faBasketShopping, faCheck, faCheckCircle, faCheckDouble, faCheckToSlot, faFlag, faLongArrowDown, faMarker, faUnlock, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons/faCheckSquare";
import { uiContext } from "../contexts/UiContext";
import config from "../hooks/Config";
import VideoPlayer from "../components/VideoPlayer";

const MessageCard = ({chat,group,messageReader,deleteMessage,deleteMessageForAll}) => {
    const history = useHistory()
    const {currentUser} = useContext(authContext);
    const {showCardDD} = useContext(uiContext);
    const {getTime,filetypeChecker} = useContext(dataRendingContext);
    
    const {messageDC,setMessageDC,refreshHome,setRefreshHome} = useContext(liveChatContext);
    const userId = currentUser.id ;
    const {message,user_from,user_to,date,id,media,read} = chat ;
    
    const senderStyle = (userId == user_from.id)?  "right-message": 'left-message'

    const sender =(userId == user_from.id)? true: false 

    const dateSide= (userId == user_from.id)?  "flex-end": 'flex-start'

    const MesssageClick = (e) => {
        showCardDD(e,`msg-details-${id}`)
    }
    useEffect(() => {
        if (!read && !group){ // not inside group also the message not read
            messageReader();
            setRefreshHome(!refreshHome);
        }
    })
    return (
        <div className="flex relative">
           <div className={`post-dot-container dropdown hidden  message-details`} id={`msg-details-${id}`}>
                        {/* { sender && <div className="flex" >
                                <FontAwesomeIcon className="dd-icon" icon={faFlag}/>
                                <span className="" onClick={(e) => {}}>edit </span>
                        </div>} */}
                        { sender && <div className="flex" >
                                <FontAwesomeIcon className="dd-icon" icon={faFlag}/>
                                <span className="" onClick={(e) => {deleteMessageForAll(id)}}>delete for every one</span>
                        </div>}
                        {<div className="flex" >
                               <FontAwesomeIcon className="dd-icon" icon={faBan}/>
                                <span className="" onClick={(e) => {deleteMessage(`/livechat/chatroom/delete/${id}/forme`,id)}}>delete for me </span>
                        </div>}
            </div>

            { senderStyle === 'left-message' && <span  className="left-image">
                    <img src={`${config.BASE_URL}${user_from.picture}`} alt={`user`} className='left-image-size' />
            </span>}

            <div className={`message-card relative ${senderStyle}`} onDoubleClick={(e) => {MesssageClick(e)}}>
                <div className=" mssg-in-card">
                    {group && <div className="user-from" onClick={() => {history.push(`/main/profile/${user_from.id}`)}}>
                            <span >{user_from.username}</span>
                    </div>}
                        {media && <div className="message-media">
                                {filetypeChecker(media)[0] === "video" &&
                                    <VideoPlayer 
                                        filepath = {`${config.BASE_URL}${media}`}
                                        videotype = {`video/${filetypeChecker(media)[1]}`}
                                        className={'videoplayerDM'}
                                    />  
                                }
                                {
                                filetypeChecker(media)[0] === "image"&& 
                                <img src={`${config.BASE_URL}${media}`} alt={media} srcSet="" className="post-image" onDoubleClick={(e) => {
                                    }} onClick = {(e) => {e.stopPropagation()}} />
                                }
                                { filetypeChecker(media)[0] === "audio" && 
                                <audio  src={`${config.BASE_URL}${media}`} controls className="audio-playerdm CAP" 
                                > not suppeoted</audio>
                                }
                        </div>} 

                        <div className=" message relative ">
                                {message}
                            {<span className={`message-foot ${dateSide} `}>
                                <span className="date">{getTime(date)}</span>

                                { sender && 
                                <span className="date msg-status">
                                {/* <FontAwesomeIcon icon={faCheck}  className="check-icon"/>     */}
                                {!read && <FontAwesomeIcon icon={faCheckDouble}  className="check-icon"/>}    
                                {read && <FontAwesomeIcon icon={faCheckDouble} className="checkD-icon"/>}    
                                </span>}
                            </span>}
                    </div>
                    </div>
                </div>
            {/* message card end  */}
        </div> 
     ); 
}
 
export default MessageCard;