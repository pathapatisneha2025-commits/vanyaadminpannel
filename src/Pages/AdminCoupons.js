import React, { useState, useEffect } from "react";

const AddCouponForm = () => {
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    apply_type: "cart",
    category_name: "",
    product_id: "",
    min_amount: "",
    expiry_date: "",
    is_active: true,
  });
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetchCoupons();
  }, []);

 const fetchCoupons = async () => {
  try {
    const res = await fetch("https://vanyabackenddatabase.onrender.com/cart/coupons/all");
    const data = await res.json();
    if (res.ok && data.success) setCoupons(data.coupons); // <- use data.coupons
  } catch (err) {
    console.error(err);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://vanyabackenddatabase.onrender.com/cart/coupons/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error adding coupon");

      alert(`Coupon "${data.coupon.code}" added successfully!`);
      setForm({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        apply_type: "cart",
        category_name: "",
        product_id: "",
        min_amount: "",
        expiry_date: "",
        is_active: true,
      });

      // Refresh table
      fetchCoupons();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Coupon</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input name="code" value={form.code} onChange={handleChange} placeholder="Coupon Code" required style={styles.input}/>
        <select name="discount_type" value={form.discount_type} onChange={handleChange} style={styles.select}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input name="discount_value" value={form.discount_value} onChange={handleChange} placeholder="Discount Value" type="number" required style={styles.input}/>
        <select name="apply_type" value={form.apply_type} onChange={handleChange} style={styles.select}>
          <option value="cart">Cart</option>
          <option value="category">Category</option>
          <option value="product">Product</option>
        </select>
        {form.apply_type === "category" && <input name="category_name" value={form.category_name} onChange={handleChange} placeholder="Category Name" style={styles.input} />}
        {form.apply_type === "product" && <input name="product_id" value={form.product_id} onChange={handleChange} placeholder="Product ID" type="number" style={styles.input} />}
        <input name="min_amount" value={form.min_amount} onChange={handleChange} placeholder="Minimum Amount" type="number" style={styles.input}/>
        <input name="expiry_date" value={form.expiry_date} onChange={handleChange} type="date" style={styles.input}/>
        <label style={styles.checkboxLabel}>
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} style={styles.checkbox}/>
          Active
        </label>
        <button type="submit" style={styles.button}>Add Coupon</button>
      </form>

      {/* Coupons Table */}
      <h3 style={{ marginTop: "40px", color: "#063b2a" }}>Existing Coupons</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Apply To</th>
            <th>Category</th>
            <th>Product ID</th>
            <th>Min Amount</th>
            <th>Expiry</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.code}</td>
              <td>{c.discount_type}</td>
              <td>{c.discount_value}</td>
              <td>{c.apply_type}</td>
              <td>{c.category_name || "-"}</td>
              <td>{c.product_id || "-"}</td>
              <td>{c.min_amount}</td>
              <td>{c.expiry_date || "-"}</td>
              <td>{c.is_active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "40px auto", padding: "30px", borderRadius: "12px", background: "#fdfdfd", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif" },
  heading: { textAlign: "center", marginBottom: "20px", color: "#063b2a" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px 16px", borderRadius: "8px", border: "1.5px solid #ccc", fontSize: "14px", outline: "none", transition: "all 0.2s" },
  select: { padding: "12px 16px", borderRadius: "8px", border: "1.5px solid #ccc", fontSize: "14px", outline: "none", transition: "all 0.2s", background: "#fff" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#063b2a" },
  checkbox: { width: "16px", height: "16px" },
  button: { padding: "12px", borderRadius: "8px", background: "#063b2a", color: "#d4af37", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  tableThTd: { border: "1px solid #ddd", padding: "8px", textAlign: "center" }
};

export default AddCouponForm;