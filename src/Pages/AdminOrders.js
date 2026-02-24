import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://vanyabackenddatabase.onrender.com/orders/all');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order
  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`https://vanyabackenddatabase.onrender.com/orders/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const data = await res.json();
      alert(data.message);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete order');
    }
  };

  // Helper to format items in table
  const formatItems = (items) => {
    if (!items || items.length === 0) return 'No items';
    return items.map((item) => `${item.name} (${item.quantity})`).join(', ');
  };

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#063b2a', marginBottom: 30 }}>
        Admin Orders Panel
      </h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead style={{ background: '#f0f0f0' }}>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>Order ID</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>User</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>Address</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>Items</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>Total</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: 10 }}>View</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ background: '#fff' }}>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{order.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>
                    {order.full_name} ({order.email})
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>
                    {order.address}, {order.city}, {order.state} - {order.pin_code}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>{formatItems(order.items)}</td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>
                    ₹{parseFloat(order.total_amount).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: 10 }}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: '6px 12px',
                        background: '#063b2a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              maxWidth: '90%',
              maxHeight: '90%',
              overflowY: 'auto',
              padding: 30,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: 15,
                right: 15,
                background: '#ff5252',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 30,
                height: 30,
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              X
            </button>

            <h2 style={{ marginBottom: 20 }}>Order Details (ID: {selectedOrder.id})</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ padding: 8, fontWeight: 'bold', width: '30%' }}>Full Name</td>
                  <td style={{ padding: 8 }}>{selectedOrder.full_name}</td>
                </tr>
                <tr>
                  <td style={{ padding: 8, fontWeight: 'bold' }}>Email</td>
                  <td style={{ padding: 8 }}>{selectedOrder.email}</td>
                </tr>
                <tr>
                  <td style={{ padding: 8, fontWeight: 'bold' }}>Phone</td>
                  <td style={{ padding: 8 }}>{selectedOrder.phone}</td>
                </tr>
                <tr>
                  <td style={{ padding: 8, fontWeight: 'bold' }}>Address</td>
                  <td style={{ padding: 8 }}>
                    {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pin_code}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: 8, fontWeight: 'bold' }}>Payment Method</td>
                  <td style={{ padding: 8 }}>{selectedOrder.payment_method}</td>
                </tr>
                <tr>
                  <td style={{ padding: 8, fontWeight: 'bold' }}>Total Amount</td>
                  <td style={{ padding: 8 }}>₹{parseFloat(selectedOrder.total_amount).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginBottom: 10 }}>Items</h3>
            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f0f0f0' }}>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: 8 }}>Image</th>
                    <th style={{ border: '1px solid #ddd', padding: 8 }}>Product</th>
                    <th style={{ border: '1px solid #ddd', padding: 8 }}>Quantity</th>
                    <th style={{ border: '1px solid #ddd', padding: 8 }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.product_id}>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>
                        <img
                          src={item.img_url}
                          alt={item.name}
                          style={{ width: 70, height: 90, objectFit: 'cover', borderRadius: 6 }}
                        />
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.name}</td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>{item.quantity}</td>
                      <td style={{ border: '1px solid #ddd', padding: 8 }}>₹{item.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items</p>
            )}

            <button
              onClick={() => deleteOrder(selectedOrder.id)}
              style={{
                marginTop: 20,
                padding: '12px 25px',
                background: '#ff5252',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Delete Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;