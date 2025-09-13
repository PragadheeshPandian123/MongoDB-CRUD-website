import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", age: "", city: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    axios.get("http://127.0.0.1:5000/users")
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchUsers(), []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://127.0.0.1:5000/users/${editingId}`, form)
        .then(() => {
          fetchUsers();
          setForm({ name: "", age: "", city: "" });
          setEditingId(null);
        });
    } else {
      axios.post("http://127.0.0.1:5000/users", form)
        .then(() => {
          fetchUsers();
          setForm({ name: "", age: "", city: "" });
        });
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, age: user.age, city: user.city });
    setEditingId(user._id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://127.0.0.1:5000/users/${id}`).then(fetchUsers);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary fw-bold">MongoDB Users CRUD</h2>

      {/* Form Card */}
      <div className="card shadow-lg rounded-4 mb-4 border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3 align-items-end">
            <div className="col-md-3 form-floating">
              <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" id="name" placeholder="Name" required />
              <label htmlFor="name">Name</label>
            </div>
            <div className="col-md-2 form-floating">
              <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" id="age" placeholder="Age" required />
              <label htmlFor="age">Age</label>
            </div>
            <div className="col-md-3 form-floating">
              <input type="text" name="city" value={form.city} onChange={handleChange} className="form-control" id="city" placeholder="City" required />
              <label htmlFor="city">City</label>
            </div>
            <div className="col-md-2">
              <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'} w-100`}>
                {editingId ? "Update" : "Add"}
              </button>
            </div>
            {editingId && (
              <div className="col-md-2">
                <button type="button" onClick={() => { setForm({ name: "", age: "", city: "" }); setEditingId(null); }} className="btn btn-secondary w-100">
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center text-secondary fs-5">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-muted fs-6">No users found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle text-center mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>
                        <span className={`badge ${u.age < 18 ? 'bg-info' : 'bg-success'}`}>
                          {u.age}
                        </span>
                      </td>
                      <td>{u.city}</td>
                      <td>
                        <button onClick={() => handleEdit(u)} className="btn btn-sm btn-outline-warning me-2">Edit</button>
                        <button onClick={() => handleDelete(u._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
