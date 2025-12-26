import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Redirect based on user role
      if (result.user?.role === 'lawyer') {
        navigate("/lawyer/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Login to Haki Yetu</h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input 
            type="email" 
            fullWidth
            required
            style={{ width: "100%", padding: "8px" }}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input 
            type="password" 
            required
            style={{ width: "100%", padding: "8px" }}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "10px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
