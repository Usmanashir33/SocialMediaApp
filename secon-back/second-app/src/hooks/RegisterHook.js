import { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";

const useRegister = (setHaveAccount) => {
    const [registered,setRegistered] = useState('');
    const [failedR,setFailed] = useState('');
    const {setLoading,setIsAuthenticated} = useContext(authContext);
    const register = (userData) => {
        setLoading(true);
        setTimeout(() => {
        fetch(`${config.BASE_URL}/accounts/register/`,{
            method:"POST",
            headers : {
                "Content-Type":"application/json",
            },
            body:JSON.stringify(userData)
        }).then((resp) => {
            if (resp.ok){
                return resp.json();
            }
            setLoading(false);
        })
        .then((data) => {
            setLoading(false);
            if (data.success){
                setRegistered(data.success);
                setHaveAccount(true);
            }else{
                setFailed(data.error);
            }
        }).catch((err) => {
            setLoading(false);
            setFailed(err.message);
        })
        .finally(() => {
            setTimeout(() => {
                setFailed('');
                setRegistered('');
                setLoading(false)
            }, 1000);
        })
        }, 500);
    }
    return {registered,failedR,register};
}
 
export default useRegister;