import { useContext, useEffect,useRef,useState } from "react";
import useFetchNotifications from "../hooks/fetchNotifications";
import { dataRendingContext } from "../contexts/DataRending";
import useAction from '../hooks/ActionsHooks';
import NoticationCard from "./NotificationCard";
import useDeleteData from "../hooks/DeleteData";
import UserCard from "./UserCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faDeleteLeft, faEllipsisVertical, faFlag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { uiContext } from "../contexts/UiContext";
import { height } from "@fortawesome/free-solid-svg-icons/faSignOut";

const Notifications = () => {
    const {notifications,setNotifications} = useContext(dataRendingContext);
    const {showCardDD} = useContext(uiContext);
    const {doDelete} = useDeleteData(notifications,setNotifications);
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
    const itemSel = useRef();
    const {sendAction} = useAction('','')

    const getDate = (date) => {
        const Dat = new Date(date)
        return `${Dat.getUTCDay()}/${Dat.getUTCMonth()}/${Dat.getUTCFullYear()}  ${Dat.getHours()}:${Dat.getUTCMinutes()}`
    }

    const handleDelete = (e,item) => {
        const cardId = item.id
        itemSel.current = cardId;
        if (itemSel.current){
            document.querySelector(".notif-delte-dialog").showModal();
            document.querySelector(`#${`F-card-${cardId}`}`).classList.add("N_card_selected");
        }
    }
    const handleDeleteAll = (e) => {
            document.querySelector(".notif-delte-all-dialog").showModal();
    }

    const hideDialog = (e) => {
        document.querySelector(".notif-delte-dialog").close();
        document.querySelector(`#${`F-card-${itemSel.current}`}`).classList.remove("N_card_selected");
    }
    const hideDialogAll = (e) => {
        document.querySelector(".notif-delte-all-dialog").close();
    }

    const confirmDelete = (e) => {
        document.querySelector(".notif-delte-dialog").close();
        doDelete(`/notifications/mine/delete/${itemSel.current}/following`,itemSel.current); 
        document.querySelector(`#${`F-card-${itemSel.current}`}`).classList.remove("N_card_selected");
    }
    const confirmDeleteAll = (e) => {
        document.querySelector(".notif-delte-all-dialog").close();
        doDelete(`/notifications/mine/delete/notification/all`,"All");
    }

    useEffect(() => {
        sendAction(`/notifications/viewed`)
    },[])

    return ( 
        <div className="notifications" style={cardStyle}>
            <header className="room-header" style={cardStyle2}>
                <div className="names">
                    <div className="names">
                        <span className="bold name ml-10" style={textStyle}>
                            Notification Center
                        </span>
                    </div>
                    <br />
                    <div className="header-title">
                       {/* chats && chats.profile.title  */}
                    </div>
                </div>
                <div className="post-dot ml-10" onClick={(e) => {showCardDD(e,`notif-dot`)}}>
                    <div className="post-dot-container dropdown hidden hight-index" id={`notif-dot`}>
                        {<div className="flex" >
                            <FontAwesomeIcon className="dd-icon" icon={faBan}/>
                            <span className="" onClick={(e) => {{handleDeleteAll()}}}>
                                Delete all 
                            </span>
                        </div>}
                    </div>
                    <FontAwesomeIcon icon={faEllipsisVertical} style={iconStyle}/>
                </div>
            </header>
            <div className="notification-body relative">
                <dialog className="notif-delte-all-dialog room-dialog ">
                    <form action="" className="flex-center-colum">
                        <div className="dialog-question  room-dialog-text">
                            Are you sure you want permanently<span className="delete"> close and delete</span>All this Notification?
                        </div>
                        <button type="button" className="cancel-dialog room-dialog-btn" onClick={hideDialogAll}>no cancel</button>
                        <button type="button" className="confirm-action room-dialog-btn dlt-txt" onClick={confirmDeleteAll}>yes delete!</button>
                    </form>
                </dialog>

                <dialog className="notif-delte-dialog room-dialog ">
                    <form action="" className="flex-center-colum">
                        <div className="dialog-question  room-dialog-text">
                            Are you sure you want permanently<span className="delete"> close and delete</span> this Notification?
                        </div>
                        <button type="button" className="cancel-dialog room-dialog-btn" onClick={hideDialog}>no cancel</button>
                        <button type="button" className="confirm-action room-dialog-btn dlt-txt" onClick={confirmDelete}>yes delete!</button>
                    </form>
                </dialog>
            </div>
           {notifications && notifications.
           map((item) =>{
               if (item.status === 'community_deletion'){
                   return(<div key={item.id}> 
                       <NoticationCard notification={item} />
                   </div>)
               }else if (item.status === 'following'){
                    const cardId = item.id ;
                    return( <div key={item.id} className="user-card-notif notification-card" style={cardStyle2} id={`F-card-${cardId}`}>
                       <UserCard object={item.follower}/>
                        <FontAwesomeIcon className="delete-notif-icon mr-25" icon={faTrash}
                            onClick={(e) => {handleDelete(e,item)}}
                        />
                       <div className="notification-footer" style={textStyle2}>
                            {getDate(item.date)}
                        </div>
                   </div>)
               }
           } 
           )
           }
            {!notifications.length && <div className="no-selcted ">
                No availble notification for you
            </div>}
        </div>
     ); 
}
 
export default Notifications;