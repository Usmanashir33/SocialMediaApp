import { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";

const useFollowUser = () => {
    const {setSuccess,getToken,setError} = useContext(authContext)
    const [following,setFollowing] = useState(false)
    
    const followUser = (url) => {
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
            setFollowing(true)
            if (data.follow){
                setSuccess(data.follow)
            }else{
                setSuccess(data.unfollow)
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

    return {followUser,following};
}
 
export default useFollowUser;