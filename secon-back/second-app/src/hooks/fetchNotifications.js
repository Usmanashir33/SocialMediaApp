import { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";
import { dataRendingContext } from "../contexts/DataRending";

const useFetchNotifications= () => {
    const {setLoading,getToken,setError} = useContext(authContext)
    const {notifications ,setNotifications} = useContext(dataRendingContext)
    const settingdata = (newdata) => {
        const notifications = [...newdata.following,...newdata.com_deletion]
        notifications.sort((a,b) => new Date(b.date) - new Date(a.date))
        setNotifications(notifications)
    }
    const fetchNotifications = (url) => {
        setLoading(true)
        const Aborter = new AbortController()
        setTimeout(() => {
        fetch(`${config.BASE_URL}${url}`,{
            signal: Aborter.signal,
            method:"GET",
            headers:{
                "Authorization":`Bearer ${getToken()}`
            }
        })
        .then((res) => {
            // console.log(res);
            if (!res.ok) {
                throw Error('resp.ok is failed');
            }
            return res.json();
        })
        .then((data) => {
            // console.log(data);
            if (!data.error){
                settingdata(data);
            }else{
                setError(data.error)
            }
        })
        .catch((err) => {
            if (err.name !== "AbortError"){
                setError(err.message);
            }
        })
        .finally(() => {
            setTimeout(() => {
                setLoading(false);
                setError('')
            }, 500);
        })
        },200)
        return (() => {Aborter.abort()})
    }

    return {fetchNotifications} ;
}
 
export default useFetchNotifications;