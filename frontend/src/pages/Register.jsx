import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!form.contactName.trim())
      newErrors.contactName = "Contact person is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const res = await axios.post("http://localhost:8000/register", {
        company_name: form.businessName,
        email: form.email,
        password: form.password,
      });
      // Registration successful, redirect to login
      navigate("/");
    } catch (err) {
      setApiError(
        err.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-4">Register SME</h2>

        {apiError && (
          <div className="text-red-500 text-sm mb-2">{apiError}</div>
        )}

        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={form.businessName}
          onChange={handleChange}
          className={`w-full p-2 mb-1 border rounded ${
            errors.businessName ? "border-red-500" : ""
          }`}
        />
        {errors.businessName && (
          <div className="text-red-500 text-sm mb-2">
            {errors.businessName}
          </div>
        )}

        <input
          type="text"
          name="contactName"
          placeholder="Contact Person"
          value={form.contactName}
          onChange={handleChange}
          className={`w-full p-2 mb-1 border rounded ${
            errors.contactName ? "border-red-500" : ""
          }`}
        />
        {errors.contactName && (
          <div className="text-red-500 text-sm mb-2">
            {errors.contactName}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={`w-full p-2 mb-1 border rounded ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <div className="text-red-500 text-sm mb-2">{errors.email}</div>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={`w-full p-2 mb-1 border rounded ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <div className="text-red-500 text-sm mb-2">{errors.password}</div>
        )}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={`w-full p-2 mb-1 border rounded ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
        />
        {errors.confirmPassword && (
          <div className="text-red-500 text-sm mb-2">
            {errors.confirmPassword}
          </div>
        )}

        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Link to="/" className="ml-2 text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}