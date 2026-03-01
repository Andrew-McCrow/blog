import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

const EMPTY_FORM = { blogTitle: "", blogPost: "", isPublished: false };

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState(null);

  // Edit form
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const data = await api.get("/api/posts");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError(null);
    try {
      const newPost = await api.post("/api/posts", {
        ...createForm,
        idUser: user.idUser,
      });
      setPosts((prev) => [newPost, ...prev]);
      setCreateForm(EMPTY_FORM);
      setShowCreate(false);
    } catch (err) {
      setCreateError(err.message);
    }
  }

  function startEdit(post) {
    setEditId(post.idBlog);
    setEditForm({
      blogTitle: post.blogTitle,
      blogPost: post.blogPost,
      isPublished: post.isPublished,
    });
    setEditError(null);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setEditError(null);
    try {
      const updated = await api.put(`/api/posts/${editId}`, editForm);
      setPosts((prev) => prev.map((p) => (p.idBlog === editId ? updated : p)));
      setEditId(null);
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post and all its comments?")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.idBlog !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="state-msg">Loading…</p>;
  if (error) return <p className="state-msg error">{error}</p>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Posts</h2>
        <button onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {showCreate && (
        <form className="card-form" onSubmit={handleCreate}>
          <h3>Create Post</h3>
          {createError && <p className="error">{createError}</p>}
          <label>
            Title
            <input
              value={createForm.blogTitle}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, blogTitle: e.target.value }))
              }
              required
            />
          </label>
          <label>
            Content
            <textarea
              rows={6}
              value={createForm.blogPost}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, blogPost: e.target.value }))
              }
              required
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={createForm.isPublished}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, isPublished: e.target.checked }))
              }
            />
            Published
          </label>
          <button type="submit">Create</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Published</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <>
              <tr key={post.idBlog}>
                <td>{post.idBlog}</td>
                <td>{post.blogTitle}</td>
                <td>{post.isPublished ? "✅" : "❌"}</td>
                <td>{new Date(post.timeStamp).toLocaleDateString()}</td>
                <td className="actions">
                  <button onClick={() => startEdit(post)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(post.idBlog)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {editId === post.idBlog && (
                <tr key={`edit-${post.idBlog}`}>
                  <td colSpan={5}>
                    <form className="inline-form" onSubmit={handleUpdate}>
                      {editError && <p className="error">{editError}</p>}
                      <label>
                        Title
                        <input
                          value={editForm.blogTitle}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              blogTitle: e.target.value,
                            }))
                          }
                          required
                        />
                      </label>
                      <label>
                        Content
                        <textarea
                          rows={5}
                          value={editForm.blogPost}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              blogPost: e.target.value,
                            }))
                          }
                          required
                        />
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editForm.isPublished}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              isPublished: e.target.checked,
                            }))
                          }
                        />
                        Published
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

      {posts.length === 0 && <p className="state-msg">No posts yet.</p>}
    </div>
  );
}
