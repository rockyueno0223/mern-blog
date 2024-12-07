import { useSelector } from "react-redux"
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";
import CommentComponent from "./CommentComponent";
import { Comment } from "../types/types";

interface CommentSectionProps {
  postId: string | undefined;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state: RootState) => state.user);

  const [comment, setComment] = useState<string>('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    }
    getComments();
  }, [postId])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment, postId, userId: currentUser?._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError((error as Error).message);
    }
  }

  const handleLike = async (commentId: string) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        setComments(comments.map((comment) =>
          comment._id === commentId
            ? data
            : comment
        ));
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt=""
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link to={'/dashboard?tab=profile'} className="text-sm text-cyan-600 hover:underline">
            @{currentUser.username}</Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
            You must be signed in to comment.
            <Link to={'/sign-in'} className="text-blue-500 hover:underline">
              Sign In
            </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color='failure' className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment: Comment) => (
            <CommentComponent
              key={comment._id}
              comment={comment}
              onLike={handleLike}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default CommentSection
