import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Submitting login:", formData);

    try {
      const res = await fetch("https://donatehere-mini-project.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (!res.ok) {
        setError(data.msg || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("name", data.user.name);
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={styles.linkText}>
          Don't have an account? <span style={styles.link} onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 40,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
  },
  title: { marginBottom: 20 },
  form: { display: "flex", flexDirection: "column" },
  input: {
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    padding: 12,
    background: "#4f46e5",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  error: { color: "red", marginBottom: 10 },
  linkText: { marginTop: 15 },
  link: { color: "#4f46e5", cursor: "pointer", textDecoration: "underline" },
};

export default LoginPage;
