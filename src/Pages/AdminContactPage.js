import React, { useEffect, useState } from 'react';

const AdminContactPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all contact messages
  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/contact'); // GET all messages
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Contact Messages</h1>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr key={msg.id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{msg.name}</td>
                  <td style={styles.td}>{msg.email}</td>
                  <td style={styles.td}>{msg.phone || '-'}</td>
                  <td style={styles.td}>{msg.subject || '-'}</td>
                  <td style={styles.td}>{msg.message}</td>
                  <td style={styles.td}>{new Date(msg.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '40px',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#fdfdfb',
    minHeight: '100vh',
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#063b2a',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
    backgroundColor: '#fff',
  },
  th: {
    padding: '12px 15px',
    backgroundColor: '#063b2a',
    color: '#d4af37',
    textAlign: 'left',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    color: '#333',
    verticalAlign: 'top',
  },
  evenRow: {
    backgroundColor: '#fafafa',
    transition: 'background 0.3s',
  },
  oddRow: {
    backgroundColor: '#fff',
    transition: 'background 0.3s',
  },
  trHover: {
    backgroundColor: '#f0f9f5',
  },
};

export default AdminContactPage;