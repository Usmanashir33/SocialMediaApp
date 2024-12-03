import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import PostForm from "./PostForm";
import { uiContext } from "../contexts/UiContext";
const Home = () => {
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
        border: `0px 0px 1px 3px ${theme.bgColor2}`
    }
    const textStyle = {
        color : theme.color,
    }
   
    useEffect(() => {
    })
    return ( 
    <div className="home-container "  style={cardStyle} >
        <div className="page-header "  style={cardStyle}>
            <div className="header-txt" style={textStyle}>Home</div>
            <nav className="header-links custom-overflow-x" >
                <NavLink exact to="/main/home" className='header-link for-you'  style={textStyle}>Foryou</NavLink>
                <NavLink exact to="/main/home/followingposts"className='header-link' style={textStyle}>following</NavLink>
                <NavLink to="/main/home/following-community"className='header-link' style={textStyle}>community</NavLink>
            </nav> 
        </div>
        <PostForm/>
    </div>
    );
}
 
export default Home;