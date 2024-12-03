import { useContext, useEffect, useState } from "react";
import config from "../hooks/Config";
import { authContext } from "../contexts/AuthContext";
import { liveChatContext } from "../livechart/LiveChatContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { uiContext } from "../contexts/UiContext";
import { dataRendingContext } from "../contexts/DataRending";
import useFetchNotifications from "./fetchNotifications";

const useAction = (action,target) => {
    const history = useHistory();
    const {hideAllDD} = useContext(uiContext);
    const {setRefreshHome,refreshHome} = useContext(liveChatContext);
    const {unreadNotif,setUnreadNotif,refreshPosts,setRefreshPosts} = useContext(dataRendingContext);
    const {getToken,setLoading,setError,setSuccess} = useContext(authContext);
    const {fetchNotifications} = useFetchNotifications(); // realtime ones

    const makeAction = (success) => {
        if (action == 'EXIT'){
            hideAllDD();
            history.push(target);
            setRefreshHome(!refreshHome);
        } else if(action == 'ONLYADMIN'){
            hideAllDD();
            setRefreshHome(!refreshHome);
        }
        if (success == 'viewed'){
            // setUnreadNotif(0);
            fetchNotifications(`/notifications/mine/`);
        }
        if (success == 'interest'){
            setRefreshPosts(!refreshPosts);
        }
    }
    const sendAction = (url) => {
        setLoading(true)
        const abortMult = new AbortController();
            fetch(`${config.BASE_URL}${url}`,
            {
                signal : abortMult.signal,
                method:"GET",
                headers:{"Content-Type":"application/json",
                        "Authorization" : `Bearer ${getToken()}`}
            })
            .then((resp) => {
               if (resp.ok) {
                    return resp.json();
               }else{
               throw Error("Failed try again!")
               }
            })
            .then((data) => {// data Found
                if (data){
                    console.log('data: ', data);
                    setSuccess(data.success);
                    makeAction(data.success);
                }else if(data.error){
                    setError(data.error)
                }
                setLoading(false);
            })
            .catch((err) => { // error found
                if (!err.name === "AbortError") {
                    setLoading(false);
                    setError(err.message);
                }
            }).finally(() => {setTimeout(() => {
                setLoading(false);
                setError(null);
                setSuccess(null);
            }, 400);})
        return () => abortMult.abort();
    }
    
    return {sendAction};
}
 
export default useAction;