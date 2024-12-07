import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { Post } from "../types/types";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [recentPosts, setRecentPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    }
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    }
    fetchRecentPosts();
  }, [])


  return (
    loading ? (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size='xl' />
      </div>
    ) : (
      <main className="flex flex-col max-w-6xl mx-auto min-h-screen p-3">
          <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
            {post && post.title}
          </h1>
          <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
            <Button
              color="gray"
              pill
              size="xs"
            >
              {post && post.category}
            </Button>
          </Link>
          <img
            src={post?.image}
            alt={post?.title}
            className="mt-10 p-3 max-h-[600px] w-full object-cover"
          />
          <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs ">
            <span>
              {post && new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="italic">
              {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post?.content || "" }} className="p-3 max-w-2xl mx-auto w-full post-content"></div>
          <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
          </div>
          <CommentSection postId={post?._id} />

          <div className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-xl mt-5">Recent Articles</h1>
            <div className="flex flex-wrap gap-3 mt-5 justify-center">
              {recentPosts &&
                recentPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              }
            </div>
          </div>
      </main>
    )
  )
}

export default PostPage
