import { createContext, useContext, useEffect, useState } from "react";
import useFetchData from "../hooks/fetchData";
import { authContext } from "./AuthContext";
export const dataRendingContext = createContext();

const DataRendingContextProvider = ({children}) => {
    const {currentUser} = useContext(authContext)
    const [alert,setAlertHere] = useState(null)
    const setAlert = (message) => {
        setAlertHere(message);
        setTimeout(() => {setAlertHere(null)}, 750);
    }
    const getDate = (data) => {
        const date = new Date(data);
        const now = new Date();

        const clearTime = (time,last) => {
            if (time < 0){
                time *= -1 ;
                return last - time ;
            }
            return time ;
        }
        const setDate = (date,name) => {
            if (date != 0){
                return `${date}${name}`
            }
            return '';
        }
    
        let years = (now.getFullYear()) -(date.getFullYear());
        let months = clearTime((now.getMonth()) -(date.getMonth()),12);
        let days = clearTime((now.getDay()) -(date.getDay()),31);
        let hours = clearTime((now.getHours()) -(date.getHours()),24);
        let minutes = clearTime((now.getMinutes()) -(date.getMinutes()),60);
        let seconds = clearTime((now.getSeconds()) -(date.getSeconds()),60);
        let TIME = (years > 0)? `${setDate(years,"Y")} ago` : (years == 0 && months > 0)? `${setDate(months,"M")} ago` : 
                    (years == 0 && months == 0 && days > 1)?  `${setDate(days,"days")} ago` :
                    (years == 0 && months == 0 && days == 1)? `yesterday` : 
                    `${setDate(hours,'h')} ${setDate(minutes,'m')} ${setDate(seconds,'s')} ago`
        // const TIME = `${setDate(years,"y")} ${setDate(months,'M')} ${setDate(days,'d')} ${setDate(hours,'h')} ${setDate(minutes,'m')} ${setDate(seconds,'s')} ago`
        return TIME;
    }
    
    const getTime = (date) => {
        const DATE = new Date(date)
        const amOrpm = (hours,minutes) => {
            if (hours > 12 ){
                return ` ${(hours -12)}:${minutes} pm`
            }else if (hours < 12 && hours > 0){
                return ` ${(hours)}:${minutes} am`
            }else if (hours == 0){
                return ` ${(12)}:${minutes} am`
            }else if (hours == 12){
                return ` ${(hours)}:${minutes} pm`
            }
        }
        const hours = DATE.getHours()
        const minutes = DATE.getMinutes()
        return amOrpm(hours,minutes)
    }
    const filetypeChecker = (file) => {
        if (file) {
        const imageReg = /\.(png|jpg|jpng)$/i;
        const vedioReg = /\.(mp4|webm)$/i;
        const audioReg = /\.(mp3|occ|rec|wav)$/i;
        const documentReg = /\.(pdf|doc|cv|xml)$/i;
    
        const imageCheck =  (entry) => entry.match(imageReg)? [`image`,entry.match(imageReg)[1]] : null;
        const vedioCheck =  (entry) => entry.match(vedioReg)? [`video`,entry.match(vedioReg)[1]] : null;
        const audioCheck =  (entry) => entry.match(audioReg)? [`audio`,entry.match(audioReg)[1]] : null;
        const documentCheck =  (entry) => entry.match(documentReg)? [`document`,entry.match(documentReg)[1]] : null;
        // return(imageCheck(file))
        
            return vedioCheck(file) ?vedioCheck(file) :audioCheck(file)?audioCheck(file) : imageCheck(file)? imageCheck(file) : documentCheck(file) ? documentCheck(file) : "invalid media type" 
        }
    }
    const fileDisplayer = (file) => {
        if (file) {
            let fileDetail = file.split(`/`);
            return fileDetail
    
        }
    }

    const [notifications,setNotifications] = useState([])
    const [unreadNotif,setUnreadNotif] = useState(0)
    const [refreshPosts,setRefreshPosts] = useState()
    const [isParent,setIsParent] = useState(false)
    const [amBlocked,setAmBlocked] = useState(null); // maily for dm

    useEffect(() => {
        if (notifications){
            const unread_messages = notifications.filter(({readers}) => !readers.includes(currentUser.id))
            setUnreadNotif(unread_messages.length)
        }
    },[notifications])
    
    const [userTotal,setUserTotal] = useState('');
    const [showCForm,setShowCForm] = useState(false);
    const [showUForm,setShowUForm] = useState(false);
    const [showUserForm,setShowUserForm] = useState(false);
    // const [showUForm,setShowUForm] = useState(true);
    const [commentFormType,setCommentFormType] = useState('')
    const [clickedObjectId,setClickedObjectId] = useState('');

    const {data:post,setData:setPost,fetchData:fetchPost} = useFetchData();
    const {data:posts,setData:setPosts,fetchData:fetchPosts} = useFetchData();
    const {data:comments,setData:setComments,fetchData:fetchComments} = useFetchData();
    const {data:comment,setData:setComment,fetchData:fetchComment} = useFetchData();
    const {data:replies,setData:setReplies, fetchData:fetchReplies} = useFetchData();

    const {data:likes,setData:setLikes, fetchData:fetchLikes} = useFetchData();

    return ( 
        <dataRendingContext.Provider value={{
            userTotal,setUserTotal,filetypeChecker,
            post,setPost,fetchPost,fileDisplayer,
            posts,setPosts,fetchPosts,
            comments,setComments,fetchComments,
            comment,setComment,fetchComment,
            replies,fetchReplies,setReplies,
            notifications,setNotifications,unreadNotif,setUnreadNotif,
            
            likes,fetchLikes,setLikes,alert,setAlert,
            getDate, getTime,// this handles the date of ag0
            //for comment form and update form
            showCForm,setShowCForm,clickedObjectId,
            showUForm,setShowUForm,isParent,setIsParent,
            showUserForm,setShowUserForm,refreshPosts,setRefreshPosts,
            setClickedObjectId,commentFormType,setCommentFormType,
            amBlocked,setAmBlocked,
        }} >
            {children}
        </dataRendingContext.Provider>
     );
}
 
export default DataRendingContextProvider;