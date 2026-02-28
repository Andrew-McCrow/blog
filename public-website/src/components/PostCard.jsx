import { useState } from "react";
import { formatDate } from "../utils/formatDate";

const COMMENTS_URL = import.meta.env.VITE_COMMENTS_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

export default function PostCard({ post, comments, onCommentAdded }) {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const postComments = comments.filter((c) => c.idBlog === post.idBlog);

  function handleToggle(e) {
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
