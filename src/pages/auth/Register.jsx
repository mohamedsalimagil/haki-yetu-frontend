import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Create Account</h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="First Name" required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
        />
        <input 
          type="text" placeholder="Last Name" required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
        />
        <input 
          type="email" placeholder="Email" required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="tel" placeholder="Phone (Optional)"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required
          style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />

        <button type="submit" style={{ width: "100%", padding: "10px" }}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;