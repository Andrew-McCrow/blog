import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit form
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/api/comments"), api.get("/api/posts")])
      .then(([commentsData, postsData]) => {
        setComments(commentsData);
        setPosts(postsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function getPostTitle(idBlog) {
    const post = posts.find((p) => p.idBlog === idBlog);
    return post ? post.blogTitle : `Post #${idBlog}`;
  }

  function startEdit(comment) {
    setEditId(comment.idComment);
    setEditText(comment.commentPost);
    setEditError(null);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setEditError(null);
    try {
      const updated = await api.put(`/api/comments/${editId}`, {
        commentPost: editText,
      });
      setComments((prev) =>
        prev.map((c) => (c.idComment === editId ? updated : c)),
      );
      setEditId(null);
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/api/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.idComment !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="state-msg">Loading…</p>;
  if (error) return <p className="state-msg error">{error}</p>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Comments</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Comment</th>
            <th>Post</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <>
              <tr key={comment.idComment}>
                <td>{comment.idComment}</td>
                <td>{comment.commentPost}</td>
                <td>{getPostTitle(comment.idBlog)}</td>
                <td>{new Date(comment.timeStamp).toLocaleDateString()}</td>
                <td className="actions">
                  <button onClick={() => startEdit(comment)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(comment.idComment)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {editId === comment.idComment && (
                <tr key={`edit-${comment.idComment}`}>
                  <td colSpan={5}>
                    <form className="inline-form" onSubmit={handleUpdate}>
                      {editError && <p className="error">{editError}</p>}
                      <label>
                        Comment
                        <textarea
                          rows={3}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          required
                        />
                      </label>
                      <div className="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditId(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {comments.length === 0 && <p className="state-msg">No comments yet.</p>}
    </div>
  );
}
