import { useContext,useEffect, useState } from "react";
import config from "./Config";
import { authContext } from "../contexts/AuthContext";
import { dataRendingContext } from "../contexts/DataRending";

const useUpdateUser = (setData) => {
    const {getToken,setLoading} = useContext(authContext)
    const {setShowUserForm} = useContext(dataRendingContext)
    const [error,setError] = useState(null);
    const [user,setUser] = useState(null);

    const updateUser = (data,userId) => {
        setLoading(true)
        const abortMult = new AbortController();
            fetch(`${config.BASE_URL}/accounts/user/${userId}/`,
            {
                signal : abortMult.signal,
                method:"PUT",
                headers:{
                        // "Content-Type":"application/json",
                        "Authorization" : `Bearer ${getToken()}`
                    },
                body : data
                // body : JSON.stringify(data)
            })
            .then((resp) => {
               if (resp.ok) {
                    return resp.json();
               }else{
               throw Error("Failed try again!")
               }
            })
            .then((data) => {// data Found
                if (!data.error){
                    setShowUserForm(false)
                    setData(data);
                }else{
                    setError(data.error);
                }
            })
            .catch((err) => { // error found
                if (!err.name === "AbortError") {
                    setError(err.message);
                }
            }).finally(() => {setTimeout(() => {
                setLoading(false);
                setError(false);
            }, 400);})
        return () => abortMult.abort();
    }
    
    return {error,user,updateUser};
}
 
export default useUpdateUser;