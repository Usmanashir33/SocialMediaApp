import { useContext, useEffect } from "react";
import useFetchFriends from "./FetchChatFriends";
import FriendCard from "./FriendCard";
import { liveChatContext } from "./LiveChatContext";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { uiContext } from "../contexts/UiContext";

const HomeChart = () => {
    const history = useHistory();
    const userss = []
    const {messageCome,friendSelected,setFriendSelected} = useContext(liveChatContext);
    const {error,users,setUsers,fetchFriends} = useFetchFriends(`/livechat/chathome/`);
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
    const iconStyle = {
        color : theme.iconColor,
    }
    useEffect(() => {
        fetchFriends();
         // retrive the page if back from detail in narrow screen
    },[messageCome])
    // },[])

    return ( 
        <div className="chat-home custom-overflow" style={cardStyle}>
            <header className="room-header" style={cardStyle2}>
                <div className="names">
                    <div className="names">
                        <span className="bold name ml-10" style={textStyle}>
                            Friends
                        </span>
                    </div>
                    <br />
                    <div className="header-title">
                       {/* chats && chats.profile.title  */}
                    </div>
                </div>
                <div className="back-icon mr-10" onClick={() => {setFriendSelected(null)}}>
                    <FontAwesomeIcon icon={faEllipsisVertical} style={iconStyle}/>
                </div>
            </header>
            {users && users.map((user) => (
                <FriendCard object={user} key={user.id}/>
            ))}
            { !(users) && <div className="no-selcted ">
                <Link to={'/main/search'}>Search friend</Link> to start a live chat if He is Online
            </div>}
        </div>
     );
}
 
export default HomeChart;