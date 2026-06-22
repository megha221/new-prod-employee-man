import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    salary: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchEmployees = async () => {
    const res = await axios.get(API_URL);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API_URL, form);
    }

    setForm({
      name: "",
      email: "",
      role: "",
      salary: "",
    });

    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      salary: emp.salary,
    });
    setEditId(emp.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchEmployees();
  };

  return (
    <div className="container">
      <h1>Employee Management System New Info new</h1>
      <p>manage all</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Employee Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
