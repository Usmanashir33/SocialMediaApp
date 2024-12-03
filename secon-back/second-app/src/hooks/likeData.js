import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";

const useLikeData = () => {
    const {setSuccess,getToken,setError} = useContext(authContext)
    
    const likeData = (url) => {
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
            if (data.like){
                setSuccess(data.like)
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

    return {likeData};
}
 
export default useLikeData;