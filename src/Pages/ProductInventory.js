import React, { useState, useEffect } from 'react';

// --- STYLES ---
const adminStyles = `
  :root {
    --primary-green: #1a3c34;
    --primary-green-hover: #142e28;
    --accent-gold: #c5a059;
    --light-bg: #fdfbf7;
    --card-bg: #ffffff;
    --text-dark: #222222;
    --text-muted: #666666;
    --white: #ffffff;
    --danger: #ff5252;
    --border: #e5e5e5;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background-color: var(--light-bg);
  }

  .admin-container { 
    padding: 32px 4%; 
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
    color: var(--text-dark);
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100vh;
  }

  .admin-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 24px; 
    border-bottom: 2px solid var(--accent-gold); 
    padding-bottom: 16px; 
    gap: 16px;
  }

  .admin-header h1 {
    font-size: 1.8rem;
    color: var(--primary-green);
    margin: 0 0 4px 0;
  }

  .admin-header p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .btn-add { 
    background: var(--primary-green); 
    color: white; 
    border: none; 
    padding: 12px 20px; 
    border-radius: 8px; 
    cursor: pointer; 
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 4px 10px rgba(26, 60, 52, 0.2);
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }
  .btn-add:active { transform: scale(0.98); }
  .btn-add:hover { background: var(--primary-green-hover); }

  /* Desktop Table Structure */
  .table-wrapper { 
    background: var(--card-bg); 
    border-radius: 12px; 
    overflow-x: auto; 
    box-shadow: 0 4px 20px rgba(0,0,0,0.04); 
    border: 1px solid var(--border);
  }
  table { width: 100%; border-collapse: collapse; min-width: 1000px; }
  th, td { padding: 16px; border-bottom: 1px solid var(--border); vertical-align: middle; text-align: left; }
  th { background: #fafafa; border-bottom: 2px solid var(--border); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); }

  .prod-img-mini { width: 45px; height: 55px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border); }
  .thumbnail-container { display: flex; gap: 6px; flex-wrap: wrap; }
  
  .status-badge { 
    padding: 6px 10px; 
    border-radius: 20px; 
    font-size: 0.75rem; 
    font-weight: 600; 
    background: #e8f5e9; 
    color: #2e7d32; 
    display: inline-block; 
  }

  .action-btns { display: flex; gap: 8px; }
  .btn-edit, .btn-delete { 
    padding: 6px 14px; 
    border-radius: 6px; 
    cursor: pointer; 
    font-weight: 600;
    font-size: 0.85rem;
    transition: background 0.2s;
  }
  .btn-edit { background: none; border: 1px solid var(--accent-gold); color: var(--accent-gold); }
  .btn-edit:hover { background: rgba(197, 160, 89, 0.08); }
  
  .btn-delete { background: none; border: 1px solid var(--danger); color: var(--danger); }
  .btn-delete:hover { background: rgba(255, 82, 82, 0.08); }

  /* Modal Wrapper Styles */
  .modal-overlay { 
    position: fixed; 
    inset: 0; 
    background: rgba(0,0,0,0.6); 
    backdrop-filter: blur(3px);
    display: flex; 
    justify-content: center; 
    align-items: center; 
    z-index: 1000; 
    padding: 16px; 
  }
  .modal-content { 
    background: var(--card-bg); 
    padding: 28px; 
    border-radius: 16px; 
    width: 520px; 
    max-width: 100%; 
    max-height: 90vh; 
    overflow-y: auto; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; margin-bottom: 6px; font-size: 0.85rem; font-weight: 600; color: var(--text-dark); }
  .form-group input, .form-group select { 
    width: 100%; 
    padding: 11px 14px; 
    border: 1px solid var(--border); 
    border-radius: 8px; 
    outline: none; 
    font-size: 0.95rem;
    background: #fff;
    transition: border-color 0.2s;
  }
  .form-group input:focus, .form-group select:focus { border-color: var(--primary-green); }
  
  .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); }
  .thumbnail-preview { width: 55px; height: 55px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border); }

  /* Mobile App / Native Card View Layout */
  .mobile-card-container { display: none; }

  @media (max-width: 768px) {
    .admin-container { padding: 16px 12px; }
    .admin-header { flex-direction: column; align-items: stretch; text-align: left; gap: 12px; }
    .admin-header h1 { font-size: 1.5rem; }
    .btn-add { width: 100%; padding: 14px; font-size: 1rem; text-align: center; }
    
    .table-wrapper { display: none; }
    .mobile-card-container { display: flex; flex-direction: column; gap: 14px; }
    
    .product-card { 
      background: var(--card-bg); 
      border-radius: 12px; 
      padding: 16px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.03); 
      border: 1px solid var(--border); 
    }
    .card-top { display: flex; gap: 14px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
    .card-main-img { width: 75px; height: 95px; object-fit: cover; border-radius: 8px; flex-shrink: 0; border: 1px solid var(--border); }
    .card-info { flex-grow: 1; min-width: 0; }
    
    .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; font-size: 0.85rem; }
    .card-field label { display: block; color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase; margin-bottom: 2px; }
    .card-field span { font-weight: 600; color: var(--text-dark); }
    
    .card-thumbnails-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 12px; }
    
    .card-actions { display: flex; gap: 10px; border-top: 1px solid var(--border); padding-top: 12px; }
    .card-actions button { flex: 1; padding: 10px; font-size: 0.9rem; }

    /* Modal Mobile optimization */
    .modal-overlay { padding: 0; align-items: flex-end; }
    .modal-content { 
      width: 100%; 
      max-height: 92vh; 
      border-bottom-left-radius: 0; 
      border-bottom-right-radius: 0; 
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      padding: 24px 20px;
    }
  }
`;

const API_URL = "https://vanyabackenddatabase-vahr.onrender.com/products";

// --- Sub-categories mapping ---
// --- Categories & Sub-categories mapping ---
const subCategoriesMap = {
  "SILK SAREES": [
    "Chiffons",
    "Jeorget",
    "Marshmellow",
    "Kashmiri Silk"
  ],

  "COTTON Sarees": [
    "Malaii Cotton",
    "2 cut cotton sarees",
    "Kalankari",
    "Meena Cotton",
    "Kota Cotton",
    "Mangalagiri Cotton",
    "Vimal Cotton"
  ],

  "Wedding Collections": [
    "Russian Collection",
    "Benarus",
    "Raw Mango",
    "Pure Tussar",
    "Kantha Work",
    "Chinia Jeroget",
    "Mushroom Silk",
    "Spacework",
    "Mysore Crepe",
    "Khadi Jeorget",
    "HO Crepe",
    "Digital Prints",
    "Pattu",
    "Maheswari Silk"
  ],

  "DesignerSarees": [
    "Designer Silk",
    "Designer Organza",
    "Designer Georgette",
    "Designer Crepe",
    "Hand Painted Sarees",
    "Embroidered Sarees",
    "Mirror Work Sarees",
    "Sequence Work Sarees",
    "Premium Designer Sarees"
  ],

  "PartyWear": [
    "Party Wear Silk",
    "Party Wear Georgette",
    "Party Wear Net Sarees",
    "Sequence Sarees",
    "Embroidered Party Wear",
    "Fancy Sarees",
    "Bollywood Style Sarees",
    "Reception Sarees"
  ],

  // New Categories
  "Weaving Mistake Sarees": [],
  "Dress Materials": [],
  "Budget Friendly Sarees": [],
  "Work Sarees": [],
  "Damage Sarees": [],
  "Pattu Sarees": [],
  "Designer Sarees": [],
  "Readymade Blouses": [],
  "Handloom Sarees": [],
  "Exclusive Sarees": []
};

export default function AdminProductManager() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    cat: 'SILK SAREES',
    subCat: '',          
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
        cat: product.category || 'SILK SAREES',
        subCat: product.subCategory || '',
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
        subCat: '',
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
      form.append("subCategory", formData.subCat);  
      form.append("type", formData.type);
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
          <h1>Inventory Management</h1>
          <p>Manage your saree collections and stock levels seamlessly across devices</p>
        </div>
        <button className="btn-add" onClick={() => handleOpenModal()}>+ Add New Product</button>
      </div>

      {/* Web / Desktop Table View */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Main Image</th>
              <th>Thumbnails</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Type</th>
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
                <td><span className="status-badge" style={{background: '#f3e5f5', color: '#7b1fa2'}}>{p.sub_category || '-'}</span></td>
                <td><span className="status-badge" style={{background: '#fff3e0', color: '#e65100'}}>{p.type || 'Regular'}</span></td>
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

      {/* Mobile App Card UI View */}
      <div className="mobile-card-container">
        {products.map(p => (
          <div className="product-card" key={p.id}>
            <div className="card-top">
              <img src={p.img_url || p.thumbnails?.[0] || ''} className="card-main-img" alt={p.name} />
              <div className="card-info">
                <div style={{ fontSize: '0.7rem', color: '#999', marginBottom: '2px' }}>ID: #{p.id}</div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)', marginBottom: '6px', lineHeight: '1.2' }}>{p.name}</div>
                <div><span className="status-badge">{p.category}</span></div>
              </div>
            </div>

            <div className="card-grid">
              <div className="card-field">
                <label>Sub-Category</label>
                <span>{p.sub_category || '-'}</span>
              </div>
              <div className="card-field">
                <label>Type</label>
                <span>{p.type || 'Regular'}</span>
              </div>
              <div className="card-field">
                <label>Price</label>
                <div>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>₹{Number(p.price).toLocaleString()}</span>
                  <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#aaa' }}>₹{Number(p.old_price).toLocaleString()}</div>
                </div>
              </div>
              <div className="card-field">
                <label>Stock & Offer</label>
                <div>
                  <span style={{fontWeight: '600'}}>{p.stock} pcs</span>
                  <div style={{ color: '#ff5252', fontSize: '0.75rem', fontWeight: 'bold' }}>{p.discount || 0}% OFF</div>
                </div>
              </div>
            </div>

            {(p.thumbnails && p.thumbnails.length > 0) && (
              <div className="card-thumbnails-row">
                {p.thumbnails.map((t, i) => <img key={i} src={t} className="prod-img-mini" alt={`thumb-${i}`} />)}
              </div>
            )}

            <div className="card-actions">
              <button className="btn-edit" onClick={() => handleOpenModal(p)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{marginBottom: '20px', color: 'var(--primary-green)', marginTop: 0, fontSize: '1.4rem'}}>
              {currentProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={formData.cat} onChange={e => setFormData({...formData,cat:e.target.value, subCat: ''})}>
                  {Object.keys(subCategoriesMap).map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Sub-Category</label>
                <select value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})}>
                  <option value="">Select Sub-Category</option>
                  {(subCategoriesMap[formData.cat] || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
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

              <div style={{ display: 'flex', gap: '12px' }}>
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
                {formData.img && <img src={formData.img} className="thumbnail-preview" style={{marginTop:'8px'}} alt="Preview" />}
              </div>

              <div className="form-group">
                <label>Thumbnail Images (multiple)</label>
                <input type="file" multiple accept="image/*" onChange={e => handleImageChange(e,'thumbnails')} />
                <div className="thumbnail-container" style={{marginTop:'8px'}}>
                  {formData.thumbnails.map((t,i)=><img key={i} src={t} className="thumbnail-preview" alt={`thumb-${i}`} />)}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} style={{border:'none',background:'none',cursor:'pointer', fontWeight: '600', color: 'var(--text-muted)'}}>Cancel</button>
                <button type="submit" className="btn-add" style={{padding: '10px 20px'}}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}