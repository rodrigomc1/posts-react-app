import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

const ProfilePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const request = Axios.CancelToken.source();

    (async function () {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: request.token,
        });
        setIsLoading(false);
        setPosts(response.data);
      } catch (error) {
        console.log("There was an error or the request was cancelled.");
      }
    })();

    return () => {
      request.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return <Post isOwner={true} post={post} key={post._id} />;
      })}
    </div>
  );
};

export default ProfilePosts;
