import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`post-card${expanded ? " post-card--expanded" : ""}`}
      onClick={() => setExpanded((prev) => !prev)}
      role="button"
      aria-expanded={expanded}
    >
      <div className="post-meta">
        <time dateTime={post.timeStamp}>{formatDate(post.timeStamp)}</time>
      </div>
      <h2 className="post-title">{post.blogTitle}</h2>
      <p className={`post-body${expanded ? "" : " post-body--clamped"}`}>
        {post.blogPost}
      </p>
      <footer className="post-footer">
        <span className="read-toggle">
          {expanded ? "Show less ▲" : "Read more ▼"}
        </span>
      </footer>
    </article>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <header className="site-header">
        <h1>Blog</h1>
        <p className="subtitle">
          {posts.filter((p) => p.isPublished).length > 0
            ? `${posts.filter((p) => p.isPublished).length} post${posts.filter((p) => p.isPublished).length !== 1 ? "s" : ""}`
            : ""}
        </p>
      </header>

      <main className="posts-container">
        {loading && <p className="state-msg">Loading posts&hellip;</p>}
        {error && (
          <p className="state-msg error">Failed to load posts: {error}</p>
        )}
        {!loading && !error && posts.filter((p) => p.isPublished).length === 0 && (
          <p className="state-msg">No posts found.</p>
        )}
        {posts
          .filter((post) => post.isPublished)
          .map((post) => (
            <PostCard key={post.idBlog} post={post} />
          ))}
      </main>
    </div>
  );
}

export default App;
