import React, { useEffect, useState } from "react";
import Post from "../component/Post";
import Loader from "../component/Loader";
import SuggestedUsers from "../component/SuggestedUsers";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import axios from "axios";
import useCustomToast from "../../Hooks/useCustomTost";
import postsAtom from "../../atoms/postsAtom";

function HomePage() {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);

  const user = useRecoilValue(userAtom);
  const { showErrorToast } = useCustomToast();

  useEffect(() => {
    const getPost = async () => {
      try {
        console.log(1);
        const response = await axios.get("api/posts/feed");
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
          showErrorToast("network error");
        }
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [showErrorToast, setPosts]);
  return (
    <>
      <div>
        <div className="flex gap-10 items-start">
          <div className="flex-80">
            {!loading && posts?.length === 0 && (
              <h1>Follow some users to see the feed</h1>
            )}

            {loading && <Loader />}

            {posts?.map((post) => (
              <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
          </div>
          <div className="hidden md:block flex-20">
            <SuggestedUsers />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
