import { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";

const useFetchData= () => {
    const {setLoading,getToken,setError} = useContext(authContext)
    const [data ,setData] = useState(null);
    
    const fetchData = (url) => {
        const Aborter = new AbortController()
        setLoading(true)
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
                setData(data);
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
                // setError(null);
                setError('')
            }, 500);
        })
        },200)
        return (() => {Aborter.abort()})
    }

    return {data,setData,fetchData};
}
 
export default useFetchData;