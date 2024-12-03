import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useFetchUserRelatedData from "../hooks/useFetchUserRelated";
import { useContext, useEffect } from "react";
import { authContext } from "../contexts/AuthContext";
import PostCard from "../components/Card";
import { dataRendingContext } from "../contexts/DataRending";
import CommentForm from "../CommentForm";
import UpdateForm from "../components/UpdateForm";
import useDeleteData from "../hooks/DeleteData";


const UserReplies = () => {
    const {pk} = useParams();
    const {showCForm,showUForm,setReplies,replies:data,fetchReplies,setUserTotal } = useContext(dataRendingContext);
    const {doDelete} = useDeleteData(data,setReplies);

    useEffect(() => {
        fetchReplies(`/accounts/user/${pk}/replies/`);
     },[])
     
     // setUserTotal(data.length)
    setUserTotal(data? `${data.length} replies` : "0 replies")
    return (
        <div className="user-posts">
            {data &&
            data.map((reply) => 
                <PostCard object = {reply} doDelete={doDelete} cardType='comment' key={reply.id} />
            )}
           
            {showCForm &&
                <CommentForm />
            }
            {showUForm && <UpdateForm  data={data} setData={setReplies}/> }
            {!(data && data.length >= 1) && <div className="no-data"> No replies available for this user</div>}

            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}
 
export default UserReplies;