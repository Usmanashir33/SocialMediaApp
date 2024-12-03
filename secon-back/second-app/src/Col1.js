import { BrowserRouter as Router ,Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./components/Home";
import Posts from "./Posts";
import Profile from "./components/Profile";
import Search from "./components/Search";
import PostDetail from "./components/PostDetail";
import CommunityPages from "./CommunityPages";
import UserPosts from "./user_nav_pages/UserPosts";
import UserLikes from "./user_nav_pages/UserLikes";
import UserMedia from "./components/UserMedia";
import UserReplies from "./user_nav_pages/UserReplies";
import { useContext, useEffect } from "react";
import CommentDetail from "./components/CommentDetail";
// import Follow from "./components/Followers";
import Followers from "./components/Followers";
import Followings from "./components/Followings";
import FollowingPosts from "./components/FollowingPosts";
import Notifications from "./components/Notifcations";
import Auth from "./account/Auth";
import { uiContext } from "./contexts/UiContext";
const Col1 = () => {
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
    }
    useEffect(() => {

    })
    return ( 
        <div className="col1 custom-overflow " style={cardStyle}>
                <Switch>
                    <Route path='/main/home'>
                        <Home/>
                        <Route exact path='/main/home'> <Posts/> </Route>
                        <Route exact path='/main/home/followingposts'><FollowingPosts/> </Route>
                        <Route exact path='/main/home/following-community' > <CommunityPages/> </Route>
                    </Route>
                    <Route  path='/main/profile/:pk'>
                        <Profile/>
                        <Route exact path='/main/profile/:pk' ><UserPosts/></Route>
                        <Route exact path='/main/profile/:pk/replies' ><UserReplies/></Route>
                        <Route exact path='/main/profile/:pk/media' ><UserMedia/></Route>
                        <Route exact path='/main/profile/:pk/likes' ><UserLikes/></Route>
                    </Route>
                    <Route  path='/main/search'>
                        <Search/>
                    </Route>
                    <Route  path='/main/notifications'>
                        <Notifications/>
                    </Route>
                    <Route path='/main/post/:id' >
                        <PostDetail/>
                    </Route>
                    <Route exact path='/main/comment/:id' >
                        <CommentDetail/>
                    </Route>
                    <Route exact path='/main/followers/:id' >
                        <Followers/>
                    </Route>
                    <Route exact path='/main/followings/:id' >
                        <Followings/>
                    </Route>
                    <Route exact path='/main/auth' >
                        <Auth/>
                    </Route>
                </Switch>
        </div>
     );
}
 
export default Col1;