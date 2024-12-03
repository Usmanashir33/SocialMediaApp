import { Route, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from "react";
import { liveChatContext } from "./LiveChatContext";
import RoomChart from "./RoomChart";
import HomeChart from "./HomeChart";

const LiveChat = () => {
    const location = useLocation();
    const {friendSelected} = useContext(liveChatContext)
    return ( 
        <div className={`cols-container livecha ${friendSelected? "room":""}`}>
            <Route path ='/dm'><HomeChart/></Route>
            <Route exact path='/dm/room/:id'>
              <RoomChart />
            </Route>
            { (location.pathname === '/dm') && <div className="no-selcted chat-room">
                Select friend to start a live chat if He is Online
            </div>}
        </div>
     );
}
 
export default LiveChat;