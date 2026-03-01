import { useState, useEffect } from "react";
import { api } from "../utils/api";

const EMPTY_CREATE = { email: "", password: "", isAdmin: false };
const EMPTY_EDIT = { email: "", password: "", isAdmin: false };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [createError, setCreateError] = useState(null);

  // Edit form
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    api
      .get("/api/users")
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError(null);
    try {
      const newUser = await api.post("/api/users", createForm);
      setUsers((prev) => [...prev, newUser]);
      setCreateForm(EMPTY_CREATE);
      setShowCreate(false);
    } catch (err) {
      setCreateError(err.message);
    }
  }

  function startEdit(user) {
    setEditId(user.idUser);
    setEditForm({ email: user.email, password: "", isAdmin: user.isAdmin });
    setEditError(null);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setEditError(null);
    const body = { email: editForm.email, isAdmin: editForm.isAdmin };
    if (editForm.password) body.password = editForm.password;
    try {
      const updated = await api.put(`/api/users/${editId}`, body);
      setUsers((prev) => prev.map((u) => (u.idUser === editId ? updated : u)));
      setEditId(null);
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.idUser !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="state-msg">Loading…</p>;
  if (error) return <p className="state-msg error">{error}</p>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Users</h2>
        <button onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? "Cancel" : "+ New User"}
        </button>
      </div>

      {showCreate && (
        <form className="card-form" onSubmit={handleCreate}>
          <h3>Create User</h3>
          {createError && <p className="error">{createError}</p>}
          <label>
            Email
            <input
              type="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={createForm.isAdmin}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, isAdmin: e.target.checked }))
              }
            />
            Admin
          </label>
          <button type="submit">Create</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <>
              <tr key={user.idUser}>
                <td>{user.idUser}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "✅" : "❌"}</td>
                <td className="actions">
                  <button onClick={() => startEdit(user)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(user.idUser)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {editId === user.idUser && (
                <tr key={`edit-${user.idUser}`}>
                  <td colSpan={4}>
                    <form className="inline-form" onSubmit={handleUpdate}>
                      {editError && <p className="error">{editError}</p>}
                      <label>
                        Email
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </label>
                      <label>
                        New Password{" "}
                        <span className="hint">(leave blank to keep)</span>
                        <input
                          type="password"
                          value={editForm.password}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              password: e.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editForm.isAdmin}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              isAdmin: e.target.checked,
                            }))
                          }
                        />
                        Admin
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

      {users.length === 0 && <p className="state-msg">No users.</p>}
    </div>
  );
}
