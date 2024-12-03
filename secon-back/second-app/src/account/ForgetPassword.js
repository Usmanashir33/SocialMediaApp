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
    const [emailSent,setEmailSent] = useState(false)

    const [error,setError] = useState('');
    const [updated,setUpdated]= useState(false); 
    const {authenticate} = useAuthHook(setVerified,setError,setUpdated,setEmailSent);

    const [otp,setOTP] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');

    const validateNewPasswords = () => {
        const password_not_same = password !== password2 ;
        password_not_same? setError("new Passwords are different !") : setError(null)
        return password_not_same? false : true;
    }

    const handleSendUpdate = (() => {
        if (validateNewPasswords() && verified ){
            const data = {
                'email':email ,
                "forget_password_otp": otp,
                'password' :password,
                'password2' :password2,
            }
            authenticate('/accounts/auth/set-new-password/',"POST",data,false)
        }
    })
    const handleVerification = (() => {
        if (emailSent ){
            const data = {
                "otp": otp,
                "email": email,
            }
            authenticate('/accounts/auth/verify-otp/',"POST",data,false)
        }
    })
    const handleRequestOTP = (() => {
        if (!verified ){
            const data = {
                "email": email,
            }
            authenticate('/accounts/auth/request-forget-password/',"POST",data,false)
        }
    })
    useEffect(() => {
        setShowLogOut("hidden")
    },[])
    return ( 
        <div className="about-pg auth-pg">
            <h1>Password Reset Page</h1>
            <div className="about-card pc-form">
                {updated && <div className="success-update">
                    <FontAwesomeIcon icon={faCheckCircle} size="10x"  className="password-usuccess-icon"/>
                    <div className="success-text">
                       Password  Successfully reset
                    </div>
                    <div className="success-text" onClick={() => {history.push('/register')}}>
                        <FontAwesomeIcon icon={faArrowCircleLeft} size="1x" className="p-done-icon"/>
                        <i className="p-done ml-10">
                            Back Login
                        </i>
                    </div>
                </div>}
                {!updated && <div>
                    {error && <div className="error">{error} </div>}
                {emailSent && !verified &&   <h2>A mail sent with OTP</h2>}
                {!emailSent &&  <h3>Changing Password... </h3>}

                    {verified &&  <div className="change-psw">
                            set minimum of eight password
                    </div>}
                    {emailSent  && !verified &&   <div className="change-psw">
                            to your email check upto spam folder
                    </div>}
                    <section className="">
                        {verified &&  <span>
                            <FontAwesomeIcon icon={faCheckCircle} size="1x" className="p-varified-icon"/>
                            <span className="p-varified">
                                Verified Account Owner 
                            </span>
                            </span>}
                        
                        {!emailSent &&  <span>Provide your "Email Address " to continue</span>}

                        {!emailSent &&   <input type="text" name="old-password" value={email}
                        onChange={(e) => {setEmail(e.target.value)}} placeholder="(i.e youremail@gmail.com)"/>}

                        {emailSent && !verified &&    <input type="text" maxlength="6" name="otp"  className=" otp-field" 
                                        onChange={(e) => {setOTP(e.target.value)}} value={otp} placeholder="OTP" autoFocus/>}
                    </section>
                    {verified &&   <section className="">
                        <span>New Password</span>
                        <input type="text" maxlength='10' name="password"  value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="password"/>
                    </section>}
                    {verified &&   <section className="">
                        <span>Repeat Password</span>
                        <input type="text" maxlength='10' name="password2" value={password2} onChange={(e) => {setPassword2(e.target.value)}} placeholder="repeat password"/>
                    </section>}
                    {!emailSent &&   <button type="button" onClick={() => {handleRequestOTP()} }>Request OTP</button>}
                    {emailSent && !verified &&    <button type="button" onClick={() => {handleVerification()} }>Verify</button>}
                    {verified &&  <button type="button" onClick={() => {handleSendUpdate()}}>Reset Password</button>}
                </div>}
            </div>
            
        </div>
     );
}
 
export default Auth;