import { useContext, useEffect, useState } from "react";
import { authContext } from "./AuthContext";
// import { jwtDecode } from "jwt-decode";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const PreProtectedRoute = ({children}) => {
    const {isAuthenticated} = useContext(authContext);
    const [allow,setAllow] = useState(true);
    const disallow_access = () => {
        if (isAuthenticated){
            setAllow(false);
        }else{
            setAllow(true);
        }
    }
    useEffect(() => {
        disallow_access();
    },[isAuthenticated])
    return allow? children : <Redirect to='/main/home' />;
}
 
export default PreProtectedRoute;