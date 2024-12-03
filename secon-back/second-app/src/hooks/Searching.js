import { useContext, useEffect, useState } from "react"
import { authContext } from "../contexts/AuthContext"
import config from "./Config"

const useSearch = () => {
    const {setLoading,setError,getToken} = useContext(authContext)
    const [data,setData] = useState('');
    const [empty,setEmpty] = useState('')
    const search  = (content) => {
            const loopControler = new AbortController()
            setLoading(true);
            fetch(`${config.BASE_URL}/accounts/search/`,{
                signal:loopControler.signal,
                method : "POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${getToken()}`
                },
                body:JSON.stringify(content)
            }).then((resp) => {
                if (resp.ok){
                    return resp.json()
                }
            }).then((data) => {
                // console.log(data);
                if (!data.empty){
                    setData(data);
                    localStorage.setItem("searched",JSON.stringify(data))
                    setEmpty('')
                }else{
                    setData('')
                    setEmpty(data.empty)
                }
            }).catch((error) => {
                setError(error.message)
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                    setError(null)
                }, 500);
            })
            return (() => {loopControler.abort()})
    }
    return {empty,data,search};
}
export default useSearch;