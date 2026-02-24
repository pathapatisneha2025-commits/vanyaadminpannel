import React, { useState, useEffect } from 'react';

// --- STYLES ---
const adminStyles = `
  :root {
    --primary-green: #1a3c34;
    --accent-gold: #c5a059;
    --light-bg: #fdfbf7;
    --text-dark: #333;
    --white: #ffffff;
    --danger: #ff5252;
    --border: #e5e5e5;
  }

  .admin-container { padding: 40px 5%; font-family: 'Segoe UI', sans-serif; }
  .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid var(--accent-gold); padding-bottom: 15px; }
  .btn-add { background: var(--primary-green); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; }

  .table-wrapper { background: white; border-radius: 8px; overflow-x: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  table { width: 100%; border-collapse: collapse; min-width: 1000px; }
  th, td { padding: 15px; border-bottom: 1px solid var(--border); vertical-align: middle; text-align: left; }
  th { background: #f8f9fa; border-bottom: 2px solid var(--border); font-size: 0.9rem; color: #666; }

  .prod-img-mini { width: 50px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 5px; }
  .thumbnail-container { display: flex; gap: 5px; flex-wrap: wrap; }
  .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; background: #e8f5e9; color: #2e7d32; }

  .action-btns { display: flex; gap: 10px; }
  .btn-edit { background: none; border: 1px solid var(--accent-gold); color: var(--accent-gold); padding: 5px 12px; border-radius: 4px; cursor: pointer; }
  .btn-delete { background: none; border: 1px solid var(--danger); color: var(--danger); padding: 5px 12px; border-radius: 4px; cursor: pointer; }

  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .modal-content { background: white; padding: 30px; border-radius: 8px; width: 500px; max-width: 95%; max-height: 90vh; overflow-y: auto; }
  .form-group { margin-bottom: 15px; }
  .form-group label { display: block; margin-bottom: 5px; font-size: 0.9rem; font-weight: 600; }
  .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px; outline: none; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  .thumbnail-preview { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 5px; }
`;

const API_URL = "https://vanyabackenddatabase.onrender.com/products";

export default function AdminProductManager() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    cat: 'SILK SAREES',
    type: 'New Arrival',   // <-- NEW
    price: '',
    oldPrice: '',
    discount: '',
    stock: '',
    img: '',
    thumbnails: [],
    imgFile: null,
    thumbnailFiles: []
  });

  const calculateDiscount = (price, oldPrice) => {
    if (!price || !oldPrice) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/all`);
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Error fetching products:", err); }
  };
const handleOpenModal = (product = null) => {
  if (product) {
    setCurrentProduct(product);
    setFormData({
      name: product.name || '',
      cat: product.category && product.category !== 'undefined' ? product.category : 'SILK SAREES', 
      type: product.type || 'New Arrival',
      price: Number(product.price) || '',
      oldPrice: Number(product.old_price) || '',
      discount: Number(product.discount) || 0,
      stock: product.stock || '',
      img: product.img_url || '',
      thumbnails: product.thumbnails || [],
      imgFile: null,
      thumbnailFiles: []
    });
  } else {
    setCurrentProduct(null);
    setFormData({
      name: '',
      cat: 'SILK SAREES',
      type: 'New Arrival',
      price: '',
      oldPrice: '',
      discount: '',
      stock: '',
      img: '',
      thumbnails: [],
      imgFile: null,
      thumbnailFiles: []
    });
  }
  setModalOpen(true);
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try { await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' }); fetchProducts(); }
    catch (err) { console.error("Error deleting product:", err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("cat", formData.cat);
      form.append("type", formData.type);  // <-- NEW
      form.append("price", formData.price);
      form.append("oldPrice", formData.oldPrice);
      form.append("discount", formData.discount);
      form.append("stock", formData.stock);

      if (formData.imgFile) form.append("img_url", formData.imgFile);
      else if (currentProduct) form.append("existingMainImage", currentProduct.img_url || "");

      if (formData.thumbnailFiles?.length)
        formData.thumbnailFiles.forEach(f => form.append("thumbnails", f));
      else if (currentProduct)
        form.append("existingThumbnails", JSON.stringify(currentProduct.thumbnails || []));

      const url = currentProduct ? `${API_URL}/update/${currentProduct.id}` : `${API_URL}/add`;
      const method = currentProduct ? "PUT" : "POST";
      const res = await fetch(url, { method, body: form });
      if (!res.ok) throw new Error("Failed to save product");

      fetchProducts();
      setModalOpen(false);
    } catch (err) { console.error("Error saving product:", err); }
  };

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    if (type === 'img') setFormData({ ...formData, img: urls[0] || '', imgFile: files[0] });
    else setFormData({ ...formData, thumbnails: urls, thumbnailFiles: files });
  };

  return (
    <div className="admin-container">
      <style>{adminStyles}</style>

      <div className="admin-header">
        <div>
          <h1 style={{color: 'var(--primary-green)'}}>Inventory Management</h1>
          <p style={{color: '#888'}}>Manage your saree collections and stock levels</p>
        </div>
        <button className="btn-add" onClick={() => handleOpenModal()}>+ Add New Product</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Main Image</th>
              <th>Thumbnails</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Type</th> {/* NEW COLUMN */}
              <th>Price (Current)</th>
              <th>Discount</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><img src={p.img_url || p.thumbnails?.[0] || ''} className="prod-img-mini" alt={p.name} /></td>
                <td>
                  <div className="thumbnail-container">
                    {(p.thumbnails || []).map((t,i) => <img key={i} src={t} className="prod-img-mini" alt={`thumb-${i}`} />)}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>ID: #{p.id}</div>
                </td>
                <td><span className="status-badge">{p.category}</span></td>
                <td><span className="status-badge">{p.type || 'Regular'}</span></td> {/* NEW */}
                <td>
                  <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>₹{Number(p.price).toLocaleString()}</div>
                  <div style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: '#ccc' }}>₹{Number(p.old_price).toLocaleString()}</div>
                </td>
                <td><span style={{background:'#ff5252',color:'white',padding:'4px 8px',borderRadius:'12px',fontSize:'0.75rem',fontWeight:'bold'}}>{p.discount || 0}% OFF</span></td>
                <td>{p.stock} pcs</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleOpenModal(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{marginBottom: '20px', color: 'var(--primary-green)'}}>
              {currentProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={formData.cat} onChange={e => setFormData({...formData,cat:e.target.value})}>
                  <option>SILK SAREES</option>
                  <option>DesignerSarees</option>
                  <option>Wedding Collections</option>
                  <option>COTTON Sarees</option>
                  <option>PartyWear</option>
                </select>
              </div>

              <div className="form-group">
                <label>Product Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData,type:e.target.value})}>
                  <option>New Arrival</option>
                  <option>Best Seller</option>
                  <option>Regular</option>
                </select>
              </div>

              {/* Current Price & MRP */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Current Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const price = Number(e.target.value);
                      const oldPrice = Number(formData.oldPrice);
                      const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
                      setFormData({ ...formData, price, discount });
                    }}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.oldPrice}
                    onChange={(e) => {
                      const oldPrice = Number(e.target.value);
                      const discount = Number(formData.discount);
                      const price = oldPrice - (oldPrice * discount) / 100;
                      setFormData({ ...formData, oldPrice, price });
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => {
                    const discount = Number(e.target.value);
                    const oldPrice = Number(formData.oldPrice);
                    const price = oldPrice - (oldPrice * discount) / 100;
                    setFormData({ ...formData, discount, price });
                  }}
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData,stock:e.target.value})} />
              </div>

              <div className="form-group">
                <label>Main Image</label>
                <input type="file" accept="image/*" onChange={e => handleImageChange(e,'img')} />
                {formData.img && <img src={formData.img} className="thumbnail-preview" style={{marginTop:'5px'}} />}
              </div>

              <div className="form-group">
                <label>Thumbnail Images (multiple)</label>
                <input type="file" multiple accept="image/*" onChange={e => handleImageChange(e,'thumbnails')} />
                <div className="thumbnail-container" style={{marginTop:'5px'}}>
                  {formData.thumbnails.map((t,i)=><img key={i} src={t} className="thumbnail-preview" alt={`thumb-${i}`} />)}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} style={{border:'none',background:'none',cursor:'pointer'}}>Cancel</button>
                <button type="submit" className="btn-add">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}