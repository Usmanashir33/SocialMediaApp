import { faBasketShopping, faDeleteLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useRef, useState } from "react";
import { dataRendingContext } from "../contexts/DataRending";
import useDeleteData from "../hooks/DeleteData";

const NoticationCard = ({notification}) => {
    const {id,status,action,name,deleter,date} = notification;
    // const [itemSelected,setItemSelected] = useState(null);
    const itemSelected = useRef(null)
    const {notifications,setNotifications} = useContext(dataRendingContext);
    const {doDelete} = useDeleteData(notifications,setNotifications);

    const getDate = (date) => {
        const Dat = new Date(date)
        return `${Dat.getUTCDay()}/${Dat.getUTCMonth()}/${Dat.getUTCFullYear()}  ${Dat.getHours()}:${Dat.getUTCMinutes()}`
    }
    const handleDelete = (e,selected_id) => {
        itemSelected.current = selected_id;
        if (itemSelected.current && itemSelected.current == selected_id){
            document.querySelector(".comment-form-dialog").showModal();
            document.querySelector(`#${itemSelected.current}`).classList.add("N_card_selected");
        }
    }
    const hideDialog = (e) => {
        document.querySelector(".comment-form-dialog").close();
        document.querySelector(`#${itemSelected.current}`).classList.remove("N_card_selected");
    }
    const confirmDelete = (e) => {
        document.querySelector(".comment-form-dialog").close();
        doDelete(`/notifications/mine/delete/${id}/community`,id); 
        document.querySelector(`#${itemSelected.current}`).classList.remove("N_card_selected");
    }
    return ( 
        <div className="notification-card" id={`N-card-${id}`} >
            <div className="notification-body relative">
            <dialog className="comment-form-dialog room-dialog">
                <form action="" className="flex-center-colum">
                    <div className="dialog-question  room-dialog-text">
                        Are you sure you want permanently<span className="delete"> close and delete</span> this Notification?
                    </div>
                    <button type="button" className="cancel-dialog room-dialog-btn" onClick={hideDialog}>no cancel</button>
                    <button type="button" className="confirm-action room-dialog-btn dlt-txt" onClick={confirmDelete}>yes delete!</button>
                </form>
            </dialog>
                <FontAwesomeIcon icon={faTrash} className="delete-notif-icon mr-10" 
                onClick={(e) => {handleDelete(e,`N-card-${id}`)}}/>
                <div ><span className="status">{status}</span></div>
                <h3>{deleter} <span  className="action">{action}</span> <span className="target">{name}</span></h3>
            </div>
            <div className="notification-footer">
                {getDate(date)}
            </div>
        </div>
     );
}
 
export default NoticationCard;