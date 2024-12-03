import { useContext, useRef} from "react";
import { authContext } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faHeadset, faInfoCircle, faLifeRing, faSignOutAlt, faSpinner, faUser, faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { uiContext } from "./UiContext";
import { dataRendingContext } from "./DataRending";
import CallingUIFloat from "../livechart/CallingUiFloat";
import { CallingContext } from "../livechart/CallingContext";
import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import config from "../hooks/Config";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Loading = () => {
    const history = useHistory();
    const accountRef = useRef(null);
    const settingsRef = useRef(null);
    const {loading,logOut
        ,currentUser,error,success} = useContext(authContext)
    const {showLogOut,setShowLogOut,chooseTheme} = useContext(uiContext);
    const {alert} = useContext(dataRendingContext);
    const {hideAllDD} = useContext(uiContext);
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
        height : `100%`
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
    const preventClick = (e) => {
        e.stopPropagation()
        
    }
    const toggleDisplay = (ref) => {
        if (ref.current){
            ref.current.classList.toggle("hidden")
        }
        // document.querySelector(`.${id}`).classList.toggle("hidden")
    }
    const {floating,inRespDm,callingMode} = useContext(CallingContext)
    return ( 
        <div className="loading-main border">
            {(callingMode && floating) && <CallingUIFloat/>}
            {loading && <FontAwesomeIcon 
                icon={faSpinner} spinPulse
                className="loading-spinner"
            />}
            {error && <div className="error-container">{error}</div>}
            {alert &&<div className="error-container alert-container">{alert}</div>}
            {success && <div className="success-container">{success}</div>}
            
            <div className={`tri-content dropdown custom-overflow ${showLogOut}`} style={cardStyle} onClick={(e) => {preventClick(e)}}>
            {/* <div className={`tri-content dropdow custom-overflow`} onClick={(e) => {preventClick(e)}}> */}
                <header  style={cardStyle2}>
                    <div className="flex ">
                        <img src={`${config.BASE_URL}${currentUser?.picture}`} className='profile-image'/>
                        <div className="name"  style={textStyle}>{currentUser && currentUser.username}</div>
                    </div>
                    <div className="inline" onClick={(e) => {setShowLogOut('hidden')}}>
                        <FontAwesomeIcon icon={faXmark} className="comment high-index tri-name"  style={textStyle}/>
                    </div>
                </header>
                <div className="flex colum">
                    <div onClick={() => {toggleDisplay(accountRef)}}>
                        <FontAwesomeIcon className="dd-icon pt-1 "  style={iconStyle} icon={faUser} />
                        <div className="" style={textStyle} >Account & Security</div>
                    </div>
                    <ul className="AS-list hidden manage-password" ref={accountRef}>
                        <li onClick={() => {history.push("/main/auth/")}} style={textStyle} >Manage Password</li>
                    </ul>

                </div>
                <div className="flex colum">
                    <div onClick={() => {toggleDisplay(settingsRef)}}>
                        <FontAwesomeIcon className="dd-icon" style={iconStyle} icon={faCog} />
                        <div className="" style={textStyle} > Settings </div>
                    </div>
                    <ul className="AS-list hidden settings" ref={settingsRef}>
                        <li onClick={() => {chooseTheme('dark')}}  style={textStyle}> dark   theme </li>
                        <li onClick={() => {chooseTheme('light')}} style={textStyle}> light  theme </li>
                        <li onClick={() => {chooseTheme('blank')}} style={textStyle}> rmve theme </li>
                    </ul>
                </div>
                <div className="flex"  onClick={(e) => {history.push("/about"); hideAllDD()}}>
                    <div>
                        <FontAwesomeIcon className="dd-icon" style={iconStyle} icon={faInfoCircle}/>
                        <div className="" style={textStyle} >About</div>
                    </div>
                </div>
                <div className="flex" onClick={(e) => {history.push("/support")}}>
                    <div>
                        <FontAwesomeIcon className="dd-icon" style={iconStyle} icon={faHeadset}/>
                        <div className="" style={textStyle} >Support</div>
                    </div>
                </div>
                <div className="flex">
                    <div>
                        <FontAwesomeIcon className="dd-icon" style={iconStyle} icon={faUserPlus}/>
                        <div className="" style={textStyle} >Add Another Account</div>
                    </div>
                </div>
                <div className="flex">
                    <div>
                        <FontAwesomeIcon className="dd-icon" style={iconStyle} icon={faSignOutAlt}/>
                        <div className="child-lin" style={textStyle}  onClick={(e) => {logOut();setShowLogOut('hidden')}}>
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Loading;