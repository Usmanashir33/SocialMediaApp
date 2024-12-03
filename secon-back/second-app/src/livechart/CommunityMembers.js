import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useGetUser from "../hooks/useGetUser";
import UserCard from "../components/UserCard";

const CommunityMembers = () => {
    const {id} = useParams();
    const {user:users,fetchUser} = useGetUser()

    useEffect(() => {
        fetchUser(`/livechat/community/${id}/members/`)
    },[id])
    // console.log(users);
    return ( 
        <div className="chat-room">
            <div className="page relative custom-overflow">
            {users && users.map((user) => 
                <div>
                    <UserCard object={user}/>
                </div>
           )
           }
            </div>
        </div>
     );
}
 
export default CommunityMembers; 