import { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngry, faBell, faGears, faHome, faSearch, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { uiContext } from "../contexts/UiContext";
import config from "../hooks/Config";
import { dataRendingContext } from "../contexts/DataRending";
import useNotificationSocket from "../hooks/NotificationsSocket";
import useFetchNotifications from "../hooks/fetchNotifications";
import { liveChatContext } from "../livechart/LiveChatContext";
import {ReactComponent as Icon3} from "../images/project_Icon3.svg"
const Sidebar = () => {
    const {setShowLogOut,showLogOut,hideAllDD,theme} = useContext(uiContext)
    const {currentUser,logOut} = useContext(authContext);
    const {setFriendSelected} = useContext(liveChatContext);
    const {unreadNotif} = useContext(dataRendingContext)
    const notification_link = `${config.WS_URL}/notifications/mine/`
    const {fetchNotifications} = useFetchNotifications(); // realtime ones

    const {connectSecket} = useNotificationSocket(notification_link)
    useEffect(() => {
        connectSecket();
        fetchNotifications(`/notifications/mine/`)
    },[]);
    const pageStyle ={
        backgroundColor: theme.bgColor2,
        color : theme.iconColor
    }
    const IStyle ={
        color : theme.iconColor,
    }

    return ( 
        <div className="sidebar custom-overflow relative " style={pageStyle} >
                <div className="side-elemen" >
                    <div className="clean-link">
                        <Icon3 
                            className="side-svg"
                        />
                    </div>
                </div>
                <div className="side-element "  >
                    <NavLink exact to="/main/home" className="clean-link">
                        <FontAwesomeIcon 
                        icon={faHome}
                        className="side-icon"
                        style={IStyle}
                        />
                    </NavLink>
                </div>
                <div className="side-element" >
                    <NavLink exact to="/main/search" className="clean-link">
                        <FontAwesomeIcon 
                        icon={faSearch}
                        className="side-icon" style={IStyle}
                        />
                    </NavLink>
                </div>

                <div className="side-element" onClick={() => {setFriendSelected(false)}}>
                    <NavLink to="/dm" className="clean-link">
                        <FontAwesomeIcon 
                        icon={faEnvelope}
                        className="side-icon" style={IStyle}
                        />
                    </NavLink>
                </div>

                <div className="side-element" >
                    <NavLink exact to="/main/notifications" className="clean-link relative">
                        
                            { (unreadNotif == 0) &&  <FontAwesomeIcon icon={faBell}  className="side-icon"  style={IStyle}/>}
                            { (unreadNotif != 0) &&  <FontAwesomeIcon icon={faBell} shake className="side-icon"/>}
                            { (unreadNotif != 0) &&  <span className="notif-indicator">
                                {unreadNotif}
                            </span>}
                        
                    </NavLink>
                </div>
                
                <div className="side-element" >
                    <NavLink exact to={`/main/profile/${currentUser?currentUser.id:''}`} className="clean-link">
                        <FontAwesomeIcon 
                        icon={faUser}
                        className="side-icon"
                        style={IStyle}
                        />
                    </NavLink>
                </div>
                
                <div className="side-element" onClick={() => {setFriendSelected(false)}}>
                    <NavLink to="/community"className="clean-link">
                        <FontAwesomeIcon 
                        icon={faUserGroup}
                        className="side-icon"
                        style={IStyle}
                        />
                    </NavLink>
                </div>

                <div className="side-element relative"onClick={(e) => {
                    e.stopPropagation();
                    hideAllDD();
                    setShowLogOut("visible");
                    }}>
                {/* <div className="side-element"onClick={(e) => {logOut()}}> */}
                    <div className="clean-link">
                        <FontAwesomeIcon
                        icon={faGears}
                        className="side-icon"
                        style={IStyle}
                        />
                    </div>
                    
                </div>
        </div>
     );
}
 
export default Sidebar; 