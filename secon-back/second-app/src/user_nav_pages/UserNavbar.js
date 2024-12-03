import { BrowserRouter ,NavLink,Link,Route,Switch, useParams} from "react-router-dom/cjs/react-router-dom.min";
import UserPosts from "./UserPosts";
import UserLikes from "./UserLikes";
import UserMedia from "../UserMedia";
import UserReplies from "./UserReplies";
import { useState } from "react";

const UserNavbar = () => {
    const {pk} = useParams();
    const [section,setSection] = useState(UserPosts);
    const setFocus = () => {
        const headerLinks = document.querySelectorAll(".header-link");
        headerLinks.forEach((link) => {
            link.addEventListener("click",(e) => {
                console.log(e.target);
            })
        })
    }
    const changeSection = (e,section) => {
        // const dataValue = e.target.getAttribute("data-value")
        // console.log(dataValue);
        setSection(section);
    }

    return ( 
        <nav>
            
            <section className="user-profile-data">
            </section>
        </nav>
     );
}
 
export default UserNavbar;