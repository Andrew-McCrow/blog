import { useState, useEffect } from "react";
import "./App.css";
import PostCard from "./components/PostCard";

const POSTS_URL = import.meta.env.VITE_POSTS_URL;
const COMMENTS_URL = import.meta.env.VITE_COMMENTS_URL;

function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(POSTS_URL).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
      fetch(COMMENTS_URL).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
    ])
      .then(([postsData, commentsData]) => {
        setPosts(postsData);
        setComments(commentsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleCommentAdded(newComment) {
    setComments((prev) => [...prev, newComment]);
  }

  const publishedPosts = posts.filter((p) => p.isPublished);

  return (
    <div className="page">
      <header className="site-header">
        <h1>Blog</h1>
        <p className="subtitle">
          {publishedPosts.length > 0
            ? `${publishedPosts.length} post${publishedPosts.length !== 1 ? "s" : ""}`
            : ""}
        </p>
      </header>

      <main className="posts-container">
        {loading && <p className="state-msg">Loading posts&hellip;</p>}
        {error && (
          <p className="state-msg error">Failed to load posts: {error}</p>
        )}
        {!loading && !error && publishedPosts.length === 0 && (
          <p className="state-msg">No posts found.</p>
        )}
        {publishedPosts.map((post) => (
          <PostCard
            key={post.idBlog}
            post={post}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
