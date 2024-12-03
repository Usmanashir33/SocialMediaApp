import { useContext, useEffect, useState } from "react";
import useFetchFriends from "./FetchChatFriends";
import { liveChatContext } from "./LiveChatContext";
import { Link, useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import CommunityCard from "./CommunityCard";
import {faEllipsisV,faMultiply} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uiContext } from "../contexts/UiContext";
import { authContext } from "../contexts/AuthContext";
import useAddData from "./PostingData";

const HomeCommunity = () => {
    const history = useHistory();
    const [showComForm,setShowComForm] = useState(false)
    const {refreshHome,friendSelected,setFriendSelected} = useContext(liveChatContext)
    const {showCardDD} = useContext(uiContext)
    const {currentUser} = useContext(authContext)
    const [communityField,setCommunityField] = useState("")
    const {users : communites,setUsers:setCommunities,fetchFriends:fetchCommunites} = useFetchFriends(`/livechat/communities/`);
    const {doAdd} = useAddData(`livechat/alter-community/`,communites,setCommunities,setShowComForm,"POST")

    
    const handleSubmit = (e) => {
        const newCommunity = {
            name:communityField,
        }
        if (communityField){ doAdd(newCommunity) }else {return}
        console.log('newCommunity: ', newCommunity);
    }
    useEffect(() => {setCommunityField('')},[communites])
    useEffect(() => {
       
    },[history.location.pathname])
    useEffect(() => {
        fetchCommunites();
         // retrive the page if back from detail in narrow screen
    },[refreshHome])
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
    const iconStyle = {
        color : theme.iconColor,
    }
    return ( 
        <div className="chat-home custom-overflow "  style={cardStyle}>
             <header className="room-header" style={cardStyle2}>
                <div className="names">
                    <div className="names">
                        <span className="bold name ml-10" style={textStyle}>
                            Communitie
                        </span>
                    </div>
                    <br />
                    <div className="header-title">
                       {/* chats && chats.profile.title  */}
                    </div>
                </div>
                <div className="post-dot" onClick={(e) => {showCardDD(e,`community-home-dot`)}}>
                <div className="post-dot-container dropdown hidden" id={`community-home-dot`}>
                        <div className="">
                            <span className="" onClick={(e) =>  {setShowComForm(true)}}>create new community </span>
                        </div>
                </div>
                    <FontAwesomeIcon icon={faEllipsisV} style={iconStyle}/>
                </div>
            </header>
            {showComForm && <div className="community-form" id={"new-community-form"}>
                <form >
                    <FontAwesomeIcon icon={faMultiply} shake className="canceler-icon" onClick={() => {setShowComForm(false)}}/>
                    <input type="text" name="community" className="community-field" maxLength={"20"} onClick={(e) => {e.stopPropagation()}}
                    autoFocus value={communityField} onChange={(e) => {setCommunityField(e.target.value)}} placeholder="choose community name " />
                    <div className="community-button" onClick={(e) => {e.stopPropagation()}}>
                        <span>you will be the first  member </span>
                        <button type="button" onClick={(e) => {handleSubmit(e)}}>create</button>
                    </div>
                </form>
            </div>}
            {communites && communites.map((community) => (
                <CommunityCard object={community} key={community.id}/>
            ))}
            { !(communites) && <div className="no-selcted ">
                <Link to={'/main/search'}>Search friend</Link> to start a live chat if He is Online
            </div>}
        </div>
     );
}
 
export default HomeCommunity;