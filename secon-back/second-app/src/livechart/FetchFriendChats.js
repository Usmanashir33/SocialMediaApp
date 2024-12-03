import { useContext, useEffect, useState } from "react";
import config from "../hooks/Config";
import { authContext } from "../contexts/AuthContext";

const useFetchChats = () => {
    const {getToken,setLoading,setError} = useContext(authContext)
    const [chats,setChats] = useState('');
    const [empty,setEmpty] = useState('');

    const fetchChats = (url) => {
        const abortMult = new AbortController();
            fetch(`${config.BASE_URL}/${url}`,
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
                // console.log(data);
                if (!data.empty){
                    setChats(data);
                }else{
                    setEmpty(data.empty)
                }
            })
            .catch((err) => { // error found
                if (!err.name === "AbortError") {
                    setError(err.message);
                }
            }).finally(() => {setTimeout(() => {
                // setLoading(false);
                setError(false);
            }, 400);})
        return () => abortMult.abort();
    }
    
    return {empty,chats,setChats,fetchChats};
}
 
export default useFetchChats;