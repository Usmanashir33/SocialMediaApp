import { useContext, useEffect} from "react";
import { authContext } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import config from "../hooks/Config";

const useAuthHook = (setVerified,setError,setUpdated,setEmailSent) => {
    const {getToken,setLoading} = useContext(authContext);

    const authenticate = (url,method,Data,secure=true) => {
        const headers = secure? {
            "Authorization":`Bearer ${getToken()}`,
            "Content-Type":"application/json"
        } : {
            "Content-Type":"application/json"
        }
        const Aborter = new AbortController() ;
        setTimeout(() => {
        setLoading(true)
        fetch(`${config.BASE_URL}${url}`,{
            signal: Aborter.signal,
            method:method,
            headers: headers,
            body: JSON.stringify(Data),
        })
        .then((res) => {
            if (!res.ok) {
                throw Error('resp not ok!');
            }
            return res.json();
        })
        .then((data) => {
            if (!data.error){
                if(data.verified){
                    setError(false)
                    setVerified(true)
                }else if (data.updated){
                    setError(false)
                    setUpdated(true)
                }else if (data.email_sent){
                    setError(false)
                    setEmailSent(true);
                }
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
            setLoading(false)
        })
        },200)
        return (() => {Aborter.abort()})
    }

    return {authenticate};
}
 
export default useAuthHook;