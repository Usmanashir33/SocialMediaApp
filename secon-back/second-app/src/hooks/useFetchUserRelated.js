import { useContext, useEffect, useState } from "react"
import { authContext } from "../contexts/AuthContext"
import config from "./Config"

const useFetchUserRelatedData = (user_id,data_type) => {
    const {setLoading,getToken} = useContext(authContext)
    const [data,setData] = useState('');
    const [failed , setFailed] = useState('');

    useEffect(() => {
            const loopControler = new AbortController()
            setLoading(true);
            fetch(`${config.BASE_URL}/accounts/user/${user_id}/${data_type}/`,{
                signal:loopControler.signal,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${getToken()}`
                }
            }).then((resp) => {
                if (resp.ok){
                    return resp.json()
                }
            }).then((data) => {
                setData(data);
                // setLoading(false);
                setFailed(`faild to fech the ${data_type}`)

            }).catch((error) => {
                // console.log(error);
                // setLoading(false);
                setFailed(error.message)
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
            return (() => {loopControler.abort()})
    },[failed])
    return {data};
}
export default useFetchUserRelatedData;