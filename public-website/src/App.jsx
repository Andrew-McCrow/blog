import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const COMMENTS_URL = import.meta.env.VITE_COMMENTS_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PostCard({ post, comments, onCommentAdded }) {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const postComments = comments.filter((c) => c.idBlog === post.idBlog);

  function handleToggle(e) {
    // Prevent toggle when interacting with comment form
    if (e.target.closest(".comments-section")) return;
    setExpanded((prev) => !prev);
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(COMMENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(BEARER_TOKEN ? { Authorization: `Bearer ${BEARER_TOKEN}` } : {}),
        },
        body: JSON.stringify({ commentPost: commentText, idBlog: post.idBlog }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newComment = await res.json();
      onCommentAdded(newComment);
      setCommentText("");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article
      className={`post-card${expanded ? " post-card--expanded" : ""}`}
      onClick={handleToggle}
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

      {expanded && (
        <div className="comments-section" onClick={(e) => e.stopPropagation()}>
          <h3 className="comments-heading">
            {postComments.length === 0
              ? "No comments yet"
              : `${postComments.length} comment${postComments.length !== 1 ? "s" : ""}`}
          </h3>
          {postComments.length > 0 && (
            <ul className="comments-list">
              {postComments.map((c) => (
                <li key={c.idComment} className="comment">
                  <p className="comment-body">{c.commentPost}</p>
                  <time className="comment-time" dateTime={c.timeStamp}>
                    {formatDate(c.timeStamp)}
                  </time>
                </li>
              ))}
            </ul>
          )}
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-input"
              placeholder="Leave a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              disabled={submitting}
            />
            {submitError && (
              <p className="comment-error">Failed to post: {submitError}</p>
            )}
            <button
              className="comment-submit"
              type="submit"
              disabled={submitting || !commentText.trim()}
            >
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(API_URL).then((res) => {
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
