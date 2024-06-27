import React ,{useState,useEffect}from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import UserHeader from "../component/UserHeader";
import useGetUserProfile from "../../Hooks/useGetUserProfile";
import Loader from "../component/Loader";
import useCustomToast from "../../Hooks/useCustomTost";
import Post from "../component/Post";
import axios from "axios";
import postsAtom from "../../atoms/postsAtom";

function UserPage() {
  console.log("UserPage component rendered");
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const { showErrorToast } = useCustomToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        console.log(1);
        const response = await axios.get(`/api/posts/user/${username}`);

        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          console.log(error.response.data.error);
          showErrorToast(error.response.data.error);
        } else {
          showErrorToast("Network Error");
          setPosts([]);
        }
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showErrorToast, setPosts, user]);

  if (!user && loading) {
    return <Loader />;
  }

  if (!user && !loading)
    return (
      <h1 className=" font-bold text-pretty text-4xl text-center mt-20">
        User not found
      </h1>
    );
  console.log("post" ,posts)
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
       <Loader/>
      )}

      {posts?.map((post) => (
        <Post key={post._id} post={post} postedBy = {post.postedBy} />
      ))}
    </>
  );
}

export default UserPage;
