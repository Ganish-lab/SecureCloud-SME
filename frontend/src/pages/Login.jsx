import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    try {
      const res = await axios.post("http://localhost:8000/login", {
        email: form.email,
        password: form.password,
      });
      // Save token to localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      // On success, redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setApiError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {apiError && (
          <div className="text-red-500 text-sm mb-2">{apiError}</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <Link to="/register" className="ml-2 text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}