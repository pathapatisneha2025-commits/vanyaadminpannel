import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://medicurehospitaldatabase.onrender.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

     if (res.ok && data.admin) {
  localStorage.setItem('admin', JSON.stringify(data.admin));
  alert('Login successful!');
  navigate('/admin/products'); // Redirect now works
} else {
  alert(data.message || 'Invalid credentials');
}
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Server error. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={styles.input}
        />
        <button
          onClick={handleLogin}
          style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    minHeight:'100vh',
    backgroundColor:'#f4f4f4',
  },
  card: {
    background:'#fff',
    padding:40,
    borderRadius:20,
    boxShadow:'0 4px 20px rgba(0,0,0,0.1)',
    width: '350px',
    display:'flex',
    flexDirection:'column',
    gap:20
  },
  title: {
    textAlign:'center',
    fontSize:24,
    color:'#063b2a'
  },
  input: {
    padding:'12px 15px',
    borderRadius:10,
    border:'1.5px solid #ccc',
    outline:'none',
    fontSize:14
  },
  button: {
    padding:'12px 0',
    border:'none',
    borderRadius:15,
    backgroundColor:'#063b2a',
    color:'#d4af37',
    fontWeight:700,
    cursor:'pointer',
    fontSize:15
  }
};

export default AdminLoginPage;