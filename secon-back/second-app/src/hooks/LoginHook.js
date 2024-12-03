import { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";

const useLogin = (resetForm) => {
    const [logging,setLogging] = useState('');
    const [failed,setFailed] = useState('');
    const {setLoading,setIsAuthenticated} = useContext(authContext);
    const login = (userData) => {
        setLoading(true);
        setTimeout(() => {
        fetch(`${config.BASE_URL}/api/token/`,{
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
            setFailed("server failed to authenticate");
        })
        .then((data) => {
            setLoading(false);
            localStorage.setItem('access',data.access);
            localStorage.setItem('refresh',data.refresh);
            setLogging("success");
            resetForm();
            setIsAuthenticated(true);
        }).catch((err) => {
            setLoading(false);
            setFailed(err.message);
        })
        .finally(() => {
            setTimeout(() => {
                setFailed('');
                setLogging('');
                setLoading(false)
            }, 1000);
        })
        }, 500);
    }
    return {logging,failed,login};
}
 
export default useLogin;