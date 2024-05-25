import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import Loading from "../Loading";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import InfiniteScroll from "react-infinite-scroll-component";
import LoaderIcon from "../LoaderIcon";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        setTotalPosts(response.data.totalPosts);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return <LoaderIcon />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6" color="error">
          {`Error: ${error}`}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        gap: 2,
        marginBottom: 10,
        width: { xs: "90%", sm: "75%", md: "60%", lg: "40%", xl: "25%" },
      }}
    >
      <CreatePost posts={posts} setPosts={setPosts} />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={posts.length < totalPosts}
        loader={<Loading />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {posts.map((post) => (
            <PostCard key={post.postid} post={post} setPosts={setPosts} />
          ))}
        </Box>
      </InfiniteScroll>
    </Box>
  );
};

export default AllPosts;
