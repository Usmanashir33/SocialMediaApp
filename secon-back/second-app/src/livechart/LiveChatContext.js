import { createContext, useState } from "react";
import './livechart.css';
export const liveChatContext = createContext()

const LiveChatProvider = ({children}) => {
    const [refreshHome,setRefreshHome] = useState()
    const [messageCome,setMessageCome] = useState(false)
    const [friendSelected,setFriendSelected] = useState(null)
    const [messageDC,setMessageDC] = useState(null)
    return ( 
        <liveChatContext.Provider value={{
            refreshHome,setRefreshHome,
            messageCome,setMessageCome,
            friendSelected,setFriendSelected,messageDC,setMessageDC
        }}>
            {children}
        </liveChatContext.Provider>
     );
}
 
export default LiveChatProvider;