import { useEffect, useState } from "react";
import { Comment, User } from "../types/types"
import moment from "moment";

interface CommentComponentProps {
  comment: Comment;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment }) => {
  const [user, setUser] = useState<Omit<User, "password">>();
  console.log(user);


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    }
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user?.profilePicture}
          alt={user?.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : 'Anonymous user'}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 mb-2">
          {comment.content}
        </p>
      </div>
    </div>
  )
}

export default CommentComponent
