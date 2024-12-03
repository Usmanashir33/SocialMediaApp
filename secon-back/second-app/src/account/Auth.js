import { faArrowCircleLeft, faBackward, faBackwardStep, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import useAuthHook from "./AuthHook";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { faStepBackward } from "@fortawesome/free-solid-svg-icons/faStepBackward";
import { uiContext } from "../contexts/UiContext";

const Auth = () => {
    const history = useHistory();
    const {hideAllDD} = useContext(uiContext);
    const {showLogOut,setShowLogOut} = useContext(uiContext);
    const [verified,setVerified]= useState(false);
    const [error,setError] = useState('');
    const [updated,setUpdated]= useState(false); 
    const {authenticate} = useAuthHook(setVerified,setError,setUpdated);

    const [oldPassword,setOldPassword] = useState('');
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');

    const validateNewPasswords = () => {
        const password_not_same = password !== password2 ;
        password_not_same? setError("new Passwords are different !") : setError(null)
        return password_not_same? false : true;
    }

    const handleSendOldPassword = (() => {
        if (oldPassword){
            const data = {
                "old_password": oldPassword
            }
            authenticate('/accounts/auth/check-old-password/',"POST",data)
        }
    })

    const handleSendUpdate = (() => {
        if (validateNewPasswords() && verified ){
            const data = {
                "old_password": oldPassword,
                'password' :password,
                'password2' :password2,
            }
            authenticate('/accounts/auth/change-old-password/',"POST",data)
        }
    })
    useEffect(() => {
        setShowLogOut("hidden")
    },[])
    return ( 
        <div className="about-pg auth-pg">
            <h1>Password Management</h1>
            <div className="about-card pc-form">
                {updated && <div className="success-update">
                    <FontAwesomeIcon icon={faCheckCircle} size="10x"  className="password-usuccess-icon"/>
                    <div className="success-text">
                       Password  Successfully Updated
                    </div>
                    <div className="success-text" onClick={() => {history.go(-1)}}>
                        <FontAwesomeIcon icon={faArrowCircleLeft} size="1x" className="p-done-icon"/>
                        <i className="p-done ml-10">
                            Back Home
                        </i>
                    </div>
                </div>}
                {!updated && <div>
                    {error && <div className="error">{error} </div>}
                { !verified && <h3>to change your password</h3>}
                { verified && <h3>Changing Password... </h3>}

                    {verified && <div className="change-psw">
                            set minimum of eight password
                    </div>}
                    <section className="">
                        {verified && <span>
                            <FontAwesomeIcon icon={faCheckCircle} size="1x" className="p-varified-icon"/>
                            <span className="p-varified">
                                Current Password Verified 
                            </span>
                            </span>}
                        
                        {!verified && <span>Provide your current password to continue</span>}

                        { !verified && <input type="text" maxlength="10" name="old-password" value={oldPassword}
                        onChange={(e) => {setOldPassword(e.target.value)}} placeholder="current password"/>}

                        { verified && <input type="text" maxlength="10" name="old-password" disabled id="p-varified" value={oldPassword}/>}
                    </section>
                    { verified && <section className="">
                        <span>New Password</span>
                        <input type="text" maxlength='10' name="password"  value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="password"/>
                    </section>}
                    { verified && <section className="">
                        <span>Repeat Password</span>
                        <input type="text" maxlength='10' name="password2" value={password2} onChange={(e) => {setPassword2(e.target.value)}} placeholder="repeat password"/>
                    </section>}
                    {!verified && <button type="button" onClick={() => {handleSendOldPassword()}}>Verify</button>}
                    {verified && <button type="button" onClick={() => {handleSendUpdate()}}>Update password</button>}
                </div>}
            </div>
            
        </div>
     );
}
 
export default Auth;