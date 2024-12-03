import { Route, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from "react";
import { liveChatContext } from "./LiveChatContext";
import HomeCommunity from "./HomeCommunity";
import RoomCommunity from "./RoomCommunity";
import CommunityMembers from "./CommunityMembers";

const Community = () => {
    const location = useLocation();
    const {friendSelected} = useContext(liveChatContext)
    return ( 
        <div className={`cols-container livechat ${friendSelected? "room":""}`}>
            <Route path ='/community'><HomeCommunity/></Route>
            <Route exact path='/community/room/:id'>
              <RoomCommunity />
            </Route>
            <Route exact path='/community/:id/members'>
              <CommunityMembers/>
            </Route>
            { (location.pathname === '/community') && <div className="no-selcted chat-room">
               Select the community to stat chat
            </div>}
        </div>
     );
}
 
export default Community;