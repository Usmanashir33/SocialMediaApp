import { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";

const useBlocking = (setIsBlocked) => {
    const {setSuccess,getToken,setError} = useContext(authContext)
    // const [following,setFollowing] = useState(false)
    
    const toggleBlock= (url) => {
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
                throw Error('response failed');
            }
            return res.json();
        })
        .then((data) => {
            // setFollowing(true)
            if (data.blocked){
                setSuccess(data.blocked)
                setIsBlocked(true) // show us is successfully blocked
            }else{
                setSuccess(data.unblocked)
                setIsBlocked(false) // show us is successfuly unblocked
            }
        })
        .catch((err) => {
            if (err.name !== "AbortError"){
                setError(err.message);
            }
        })
        .finally(() => {
            setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 500);
        })
        },200)
        return (() => {Aborter.abort()})
    }

    return {toggleBlock};
}
 
export default useBlocking;