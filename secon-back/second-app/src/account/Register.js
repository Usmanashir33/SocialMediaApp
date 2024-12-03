import {useState } from "react";
import "./register.css";
import useLogin from "../hooks/LoginHook";
import useRegister from "../hooks/RegisterHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye} from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
// import Icon1 from "../images/project_Icon1.svg"
import {ReactComponent as Icon3} from "../images/project_Icon3.svg"
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Register = () => {
    const history = useHistory()
    const resetForm = () => {
        setUsername('');setPassword1('');setPassword2('');setEmail('')
        }
    const [passwordmis,setPasswordMis]= useState(false);
    const [passwordVis,setPasswordVis] = useState(false)
    const [password2Vis,setPassword2Vis] = useState(false)
    const [haveaccount,setHaveAccount] = useState(false);
    const {logging,failed,login} = useLogin(resetForm);
    const {registered,failedR,register} = useRegister(setHaveAccount);
    const [username,setUsername]= useState('');
    const [email,setEmail]= useState('');
    const [password1,setPassword1]= useState('');
    const [password2,setPassword2]= useState('');
    
    const checkPassword = (e) => {
        if(password1 == e.target.value){
            setPasswordMis(false);
        }else{
            setPasswordMis(true);
        }
    }
    const handleForm = (e) => {
        e.preventDefault();
        if (haveaccount){ // login
            const user = {email,password:password1}
            login(user);
        }else{ // register
            const new_user = {email,username,password:password1,re_password:password2}
            register(new_user);
        }
    }
    // return !isAuthenticated? ( 
    return( 
        <div className="site-form-container custom-overflow">
            <div className="form-head ">
                <div className="left-group ">
                    <div className="gree app-name">
                        Chatting App
                    </div>
                </div>
                <div className="right-group flex ">
                    <Link to='/about'><div className="about gree">About</div></Link>
                    <Link to='/support'><div className="about">Support</div></Link>
                    
                    {!haveaccount && <div className="btn" onClick={(e) => {setHaveAccount(true)}}>Login</div>}
                    {haveaccount && <div className="btn" onClick={(e) => {setHaveAccount(false)}}>Sign-in</div>}
                </div>
            </div>
            <div className="flex r-main">
                <div className="r-form ">
                    { logging && <div className="loading-container">{logging}</div>}
                    {failed && <div className="failed-container">{failed}</div>}
                    
                    { registered && <div className="loading-container">{registered}</div>}
                    {failedR && <div className="failed-container">{failedR}</div>}
                    
                    <form onSubmit={(e) => {handleForm(e)}}>
                        {!haveaccount && <h1>Welcome to mini-x</h1>}
                        {haveaccount && <h1>Welcome back to mini-x</h1>}
                        {!haveaccount && <p className="welcoming">we are delighted to see you here,register with your details below</p>}
                        { haveaccount && <p className="welcoming">Sign up with your details below</p>}
                        { !haveaccount &&  <section>
                            <input type="text" name="username" id="username" 
                            required value={username} onChange={(e) => {setUsername(e.target.value)}}  placeholder=" username" />
                        </section>}
                        <section>
                            <input type="email" name="email" id="email" 
                            required value={email} onChange={(e) => {setEmail(e.target.value)}}  placeholder=" email (e.g parson@gmail.com)" />
                        </section>
                        <section>
                            <input type={passwordVis? 'text':'password'} name="password1" id="password1"
                            required value={password1} onChange={(e) => {setPassword1(e.target.value)}}   
                            placeholder=" password" />
                            <FontAwesomeIcon
                                icon={passwordVis? faEye : faEyeSlash} 
                                onClick={(e) => {setPasswordVis(!passwordVis)}}
                                className="password-eye"
                            />
                        </section>
                        { !haveaccount && <section className="password2">
                            <input type={password2Vis? 'text':'password'} name="password2" id="password2"
                            required value={password2} onChange={(e) => {
                                setPassword2(e.target.value);
                                checkPassword(e);
                                }}  
                            placeholder="confirm password" />
                            <FontAwesomeIcon
                                icon={password2Vis? faEye : faEyeSlash}
                                onClick={(e) => {setPassword2Vis(!password2Vis)}}
                                className="password-eye"
                            />
                        </section>}
                        {(!haveaccount && passwordmis ) && <p className="error-password">passwords mismatched</p>}
                        {!haveaccount && <p className="have-account">already have account? <span onClick={(e) => {setHaveAccount(true)}}>Login</span></p>}
                        {haveaccount && <div className="flex have-account-cont">
                            <p className="have-account">Don't have account? <span onClick={(e) => {setHaveAccount(false)}}>Register</span></p>
                            <p className="have-account">Forget Password? <span onClick={(e) => {history.push("/auth/forget-password")}}>Reset</span></p>
                        </div>}
                        {!haveaccount && <button type="submit">Register</button>}
                        {haveaccount && <button type="submit">Login</button>}
                    </form>
                </div>

                <div className="svg-space">
                    {/* <img src={Icon1} alt="" srcset="" /> */}
                    <Icon3/>
                </div>
            </div>
        </div>
    //  ) : <Redirect to='/'/>;
     );
}
 
export default Register;