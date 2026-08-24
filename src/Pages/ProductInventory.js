import React, { useState, useEffect } from "react";

// ============================================================
// API
// ============================================================
const API_URL =
  "https://vanyabackenddatabase-vahr.onrender.com/products";

// ============================================================
// STYLES
// ============================================================
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
    --success: #2e7d32;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: var(--light-bg);
  }

  .admin-container {
    padding: 32px 4%;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: var(--text-dark);
    max-width: 1500px;
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

  .btn-add:active {
    transform: scale(0.98);
  }

  .btn-add:hover {
    background: var(--primary-green-hover);
  }

  .btn-small {
    border: none;
    border-radius: 7px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.82rem;
  }

  .btn-gold {
    background: var(--accent-gold);
    color: white;
  }

  .btn-green {
    background: var(--primary-green);
    color: white;
  }

  .btn-red {
    background: #fff0f0;
    color: var(--danger);
    border: 1px solid #ffcaca;
  }

  .btn-outline {
    background: white;
    color: var(--primary-green);
    border: 1px solid var(--primary-green);
  }

  .table-wrapper {
    background: var(--card-bg);
    border-radius: 12px;
    overflow-x: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid var(--border);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1300px;
  }

  th,
  td {
    padding: 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    text-align: left;
  }

  th {
    background: #fafafa;
    border-bottom: 2px solid var(--border);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
  }

  .prod-img-mini {
    width: 45px;
    height: 55px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .thumbnail-container {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .status-badge {
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    background: #e8f5e9;
    color: #2e7d32;
    display: inline-block;
  }

  .action-btns {
    display: flex;
    gap: 8px;
  }

  .btn-edit,
  .btn-delete {
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: background 0.2s;
  }

  .btn-edit {
    background: none;
    border: 1px solid var(--accent-gold);
    color: var(--accent-gold);
  }

  .btn-edit:hover {
    background: rgba(197, 160, 89, 0.08);
  }

  .btn-delete {
    background: none;
    border: 1px solid var(--danger);
    color: var(--danger);
  }

  .btn-delete:hover {
    background: rgba(255, 82, 82, 0.08);
  }

  /* ============================================================
     VARIANT DISPLAY
  ============================================================ */

  .variant-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 320px;
  }

  .variant-colour-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding-bottom: 6px;
    border-bottom: 1px dashed #eee;
  }

  .colour-chip {
    background: #f5f1e8;
    color: #765c27;
    padding: 5px 9px;
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .size-chip {
    background: #f2f4f7;
    color: #444;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.72rem;
  }

  .variant-price {
    font-weight: 700;
    color: var(--accent-gold);
  }

  .variant-stock {
    color: var(--success);
    font-size: 0.78rem;
    font-weight: 600;
  }

  .variant-image-mini {
    width: 40px;
    height: 48px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .variant-images-mini {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-top: 5px;
  }

  /* ============================================================
     MODAL
  ============================================================ */

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
    width: 950px;
    max-width: 100%;
    max-height: 94vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-dark);
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    font-size: 0.95rem;
    background: #fff;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus {
    border-color: var(--primary-green);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .thumbnail-preview {
    width: 55px;
    height: 55px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  /* ============================================================
     VARIANT BUILDER
  ============================================================ */

  .variant-builder {
    background: #faf8f2;
    border: 1px solid #eadfc9;
    border-radius: 12px;
    padding: 18px;
    margin-top: 18px;
  }

  .variant-builder-title {
    color: var(--primary-green);
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .variant-builder-description {
    color: var(--text-muted);
    font-size: 0.8rem;
    margin-bottom: 18px;
  }

  .colour-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .colour-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 14px;
    background: #f7f7f7;
    border-bottom: 1px solid var(--border);
  }

  .colour-card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .colour-name-input {
    max-width: 220px;
  }

  .colour-card-body {
    padding: 14px;
  }

  /* ============================================================
     COLOUR IMAGE SECTION
  ============================================================ */

  .colour-image-section {
    margin-bottom: 18px;
    padding: 14px;
    background: #fcfcfc;
    border: 1px solid #e9e9e9;
    border-radius: 10px;
  }

  .colour-image-title {
    font-weight: 700;
    color: var(--primary-green);
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  .image-upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .image-upload-box {
    border: 1px dashed #cfcfcf;
    border-radius: 9px;
    padding: 12px;
    background: white;
  }

  .image-upload-box label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: #555;
    margin-bottom: 7px;
  }

  .image-upload-box input {
    width: 100%;
    font-size: 0.8rem;
  }

  .image-preview-row {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .image-preview-wrapper {
    position: relative;
  }

  .image-preview {
    width: 65px;
    height: 78px;
    object-fit: cover;
    border-radius: 7px;
    border: 1px solid #ddd;
  }

  .remove-image-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: #ff5252;
    color: white;
    font-size: 12px;
    cursor: pointer;
    line-height: 20px;
    padding: 0;
  }

  .existing-image-label {
    font-size: 0.68rem;
    color: #888;
    margin-top: 3px;
  }

  .size-table-wrapper {
    overflow-x: auto;
  }

  .size-table {
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
  }

  .size-table th,
  .size-table td {
    padding: 8px;
    border: 1px solid var(--border);
    font-size: 0.78rem;
  }

  .size-table th {
    background: #fafafa;
    text-transform: none;
    letter-spacing: 0;
  }

  .size-table input {
    width: 100%;
    min-width: 90px;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
  }

  .size-name-box {
    width: 90px;
    font-weight: 700;
    background: #f7f7f7;
  }

  .add-size-row {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .saree-variant-row {
    display: grid;
    grid-template-columns: 1.1fr 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    align-items: end;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 9px;
    margin-bottom: 8px;
    background: #fff;
  }

  .variant-field label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .variant-field input {
    width: 100%;
    padding: 9px;
    border: 1px solid var(--border);
    border-radius: 7px;
  }

  .add-colour-button {
    width: 100%;
    margin-top: 4px;
    border: 2px dashed #cdbd9a;
    background: transparent;
    color: #765c27;
    padding: 12px;
    border-radius: 9px;
    cursor: pointer;
    font-weight: 700;
  }

  .add-colour-button:hover {
    background: #f8f3e8;
  }

  .empty-variants {
    padding: 18px;
    text-align: center;
    color: var(--text-muted);
    border: 1px dashed var(--border);
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .info-box {
    background: #eef7f4;
    border: 1px solid #cde3dc;
    color: #27594d;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    margin-bottom: 15px;
  }

  /* ============================================================
     MOBILE
  ============================================================ */

  .mobile-card-container {
    display: none;
  }

  @media (max-width: 768px) {
    .admin-container {
      padding: 16px 12px;
    }

    .admin-header {
      flex-direction: column;
      align-items: stretch;
      text-align: left;
      gap: 12px;
    }

    .admin-header h1 {
      font-size: 1.5rem;
    }

    .btn-add {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      text-align: center;
    }

    .table-wrapper {
      display: none;
    }

    .mobile-card-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .product-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
      border: 1px solid var(--border);
    }

    .card-top {
      display: flex;
      gap: 14px;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }

    .card-main-img {
      width: 75px;
      height: 95px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
      border: 1px solid var(--border);
    }

    .card-info {
      flex-grow: 1;
      min-width: 0;
    }

    .card-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 0.85rem;
    }

    .card-field label {
      display: block;
      color: var(--text-muted);
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .card-field span {
      font-weight: 600;
      color: var(--text-dark);
    }

    .card-thumbnails-row {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
      margin-bottom: 12px;
    }

    .card-actions {
      display: flex;
      gap: 10px;
      border-top: 1px solid var(--border);
      padding-top: 12px;
    }

    .card-actions button {
      flex: 1;
      padding: 10px;
      font-size: 0.9rem;
    }

    .modal-overlay {
      padding: 0;
      align-items: flex-end;
    }

    .modal-content {
      width: 100%;
      max-height: 94vh;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      padding: 24px 20px;
    }

    .saree-variant-row {
      grid-template-columns: 1fr 1fr;
    }

    .colour-name-input {
      max-width: none;
    }

    .image-upload-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// ============================================================
// SUB CATEGORIES
// ============================================================

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

// ============================================================
// DEFAULT SIZES
// ============================================================

const DEFAULT_DRESS_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL"
];

// ============================================================
// HELPERS
// ============================================================

const isDressCategory = (category = "") => {
  const value = category.toLowerCase();

  return (
    value.includes("dress") ||
    value.includes("frock") ||
    value.includes("kurta") ||
    value.includes("gown") ||
    value.includes("top") ||
    value.includes("shirt") ||
    value.includes("pant")
  );
};

const calculateDiscount = (price, oldPrice) => {
  const p = Number(price);
  const op = Number(oldPrice);

  if (!op || !p || op <= 0 || p >= op) {
    return 0;
  }

  return Math.round(((op - p) / op) * 100);
};

// ============================================================
// CREATE EMPTY COLOUR
// ============================================================

const createEmptyDressColour = () => ({
  colour: "",

  mainImage: "",
  mainImageFile: null,

  thumbnails: [],
  thumbnailFiles: [],

  sizes: DEFAULT_DRESS_SIZES.map((size) => ({
    size,
    price: "",
    oldPrice: "",
    discount: 0,
    stock: ""
  }))
});

const createEmptySareeColour = () => ({
  colour: "",

  price: "",
  oldPrice: "",
  discount: 0,
  stock: "",

  mainImage: "",
  mainImageFile: null,

  thumbnails: [],
  thumbnailFiles: []
});

// ============================================================
// NORMALIZE VARIANTS
// ============================================================

const normalizeVariants = (product) => {
  if (Array.isArray(product?.variants)) {
    return product.variants;
  }

  if (typeof product?.variants === "string") {
    try {
      const parsed = JSON.parse(product.variants);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn(
        "Unable to parse variants:",
        error
      );
    }
  }

  return [];
};

// ============================================================
// NORMALIZE VARIANT IMAGES
// ============================================================

const normalizeVariantForEdit = (
  variant,
  product,
  dress
) => {
  const existingMain =
    variant.mainImage ||
    variant.main_image ||
    variant.image ||
    "";

  const existingThumbs =
    Array.isArray(variant.thumbnails)
      ? variant.thumbnails
      : Array.isArray(variant.thumbnailImages)
      ? variant.thumbnailImages
      : [];

  if (dress) {
    return {
      ...variant,

      colour: variant.colour || "",

      mainImage: existingMain,

      mainImageFile: null,

      thumbnails: existingThumbs,

      thumbnailFiles: [],

      sizes: Array.isArray(variant.sizes)
        ? variant.sizes.map((size) => ({
            size: size.size || "",
            price: size.price ?? "",
            oldPrice:
              size.oldPrice ??
              size.old_price ??
              "",
            discount:
              size.discount ?? 0,
            stock: size.stock ?? ""
          }))
        : DEFAULT_DRESS_SIZES.map(
            (size) => ({
              size,
              price: "",
              oldPrice: "",
              discount: 0,
              stock: ""
            })
          )
    };
  }

  return {
    ...variant,

    colour: variant.colour || "",

    price: variant.price ?? "",

    oldPrice:
      variant.oldPrice ??
      variant.old_price ??
      "",

    discount: variant.discount ?? 0,

    stock: variant.stock ?? "",

    mainImage: existingMain,

    mainImageFile: null,

    thumbnails: existingThumbs,

    thumbnailFiles: []
  };
};

// ============================================================
// COMPONENT
// ============================================================

export default function AdminProductManager() {
  const [products, setProducts] = useState([]);

  const [isModalOpen, setModalOpen] =
    useState(false);

  const [currentProduct, setCurrentProduct] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [formData, setFormData] = useState({
    name: "",
    cat: "SILK SAREES",
    subCat: "",
    type: "New Arrival",

    price: "",
    oldPrice: "",
    discount: "",
    stock: "",

    img: "",
    thumbnails: [],

    imgFile: null,
    thumbnailFiles: [],

    variants: []
  });

  // ============================================================
  // FETCH
  // ============================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/all`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await res.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setErrorMessage(
        "Unable to load products."
      );
    }
  };

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = (
    category = "SILK SAREES"
  ) => {
    const dress =
      isDressCategory(category);

    setFormData({
      name: "",
      cat: category,
      subCat: "",
      type: "New Arrival",

      price: "",
      oldPrice: "",
      discount: "",
      stock: "",

      img: "",
      thumbnails: [],

      imgFile: null,
      thumbnailFiles: [],

      variants: [
        dress
          ? createEmptyDressColour()
          : createEmptySareeColour()
      ]
    });
  };

  // ============================================================
  // OPEN MODAL
  // ============================================================

  const handleOpenModal = (
    product = null
  ) => {
    setErrorMessage("");

    if (product) {
      setCurrentProduct(product);

      const rawVariants =
        normalizeVariants(product);

      const dress =
        isDressCategory(
          product.category
        );

      let variants =
        rawVariants.length
          ? rawVariants
          : [];

      if (!variants.length) {
        if (dress) {
          variants = [
            {
              colour: "",

              mainImage: "",

              thumbnails: [],

              sizes:
                DEFAULT_DRESS_SIZES.map(
                  (size) => ({
                    size,
                    price:
                      Number(
                        product.price
                      ) || "",
                    oldPrice:
                      Number(
                        product.old_price
                      ) || "",
                    discount:
                      Number(
                        product.discount
                      ) || 0,
                    stock: ""
                  })
                )
            }
          ];
        } else {
          variants = [
            {
              colour: "",

              price:
                Number(
                  product.price
                ) || "",

              oldPrice:
                Number(
                  product.old_price
                ) || "",

              discount:
                Number(
                  product.discount
                ) || 0,

              stock:
                product.stock || "",

              mainImage: "",

              thumbnails: []
            }
          ];
        }
      }

      const normalizedVariants =
        variants.map((variant) =>
          normalizeVariantForEdit(
            variant,
            product,
            dress
          )
        );

      setFormData({
        name: product.name || "",

        cat:
          product.category ||
          "SILK SAREES",

        subCat:
          product.subCategory ||
          product.sub_category ||
          "",

        type:
          product.type ||
          "New Arrival",

        price:
          Number(
            product.price
          ) || "",

        oldPrice:
          Number(
            product.old_price
          ) || "",

        discount:
          Number(
            product.discount
          ) || 0,

        stock:
          product.stock || "",

        img:
          product.img_url || "",

        thumbnails:
          Array.isArray(
            product.thumbnails
          )
            ? product.thumbnails
            : [],

        imgFile: null,

        thumbnailFiles: [],

        variants:
          normalizedVariants
      });
    } else {
      setCurrentProduct(null);

      resetForm(
        "SILK SAREES"
      );
    }

    setModalOpen(true);
  };

  // ============================================================
  // CATEGORY CHANGE
  // ============================================================

  const handleCategoryChange = (
    category
  ) => {
    const dress =
      isDressCategory(category);

    setFormData((prev) => ({
      ...prev,

      cat: category,

      subCat: "",

      variants: [
        dress
          ? createEmptyDressColour()
          : createEmptySareeColour()
      ]
    }));
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/delete/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!res.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      await fetchProducts();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to delete product."
      );
    }
  };

  // ============================================================
  // ADD COLOUR
  // ============================================================

  const addColour = () => {
    setFormData((prev) => {
      const dress =
        isDressCategory(prev.cat);

      return {
        ...prev,

        variants: [
          ...prev.variants,

          dress
            ? createEmptyDressColour()
            : createEmptySareeColour()
        ]
      };
    });
  };

  // ============================================================
  // REMOVE COLOUR
  // ============================================================

  const removeColour = (
    colourIndex
  ) => {
    setFormData((prev) => {
      if (prev.variants.length <= 1) {
        alert(
          "At least one colour is required."
        );

        return prev;
      }

      return {
        ...prev,

        variants:
          prev.variants.filter(
            (_, index) =>
              index !== colourIndex
          )
      };
    });
  };

  // ============================================================
  // UPDATE COLOUR
  // ============================================================

  const updateColourName = (
    index,
    value
  ) => {
    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      variants[index] = {
        ...variants[index],

        colour: value
      };

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // UPDATE SAREE
  // ============================================================

  const updateSareeVariant = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      const current = {
        ...variants[index]
      };

      if (field === "price") {
        current.price = value;

        current.discount =
          calculateDiscount(
            value,
            current.oldPrice
          );
      }

      if (field === "oldPrice") {
        current.oldPrice = value;

        current.discount =
          calculateDiscount(
            current.price,
            value
          );
      }

      if (field === "discount") {
        current.discount = value;

        if (
          Number(
            current.oldPrice
          ) > 0
        ) {
          current.price =
            Number(
              current.oldPrice
            ) -
            (Number(
              current.oldPrice
            ) *
              Number(value)) /
              100;
        }
      }

      if (field === "stock") {
        current.stock = value;
      }

      variants[index] =
        current;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // UPDATE DRESS SIZE
  // ============================================================

  const updateDressSize = (
    colourIndex,
    sizeIndex,
    field,
    value
  ) => {
    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      const colourVariant = {
        ...variants[colourIndex]
      };

      const sizes = [
        ...(colourVariant.sizes ||
          [])
      ];

      const currentSize = {
        ...sizes[sizeIndex]
      };

      if (field === "size") {
        currentSize.size =
          value.toUpperCase();
      }

      if (field === "price") {
        currentSize.price =
          value;

        currentSize.discount =
          calculateDiscount(
            value,
            currentSize.oldPrice
          );
      }

      if (field === "oldPrice") {
        currentSize.oldPrice =
          value;

        currentSize.discount =
          calculateDiscount(
            currentSize.price,
            value
          );
      }

      if (field === "discount") {
        currentSize.discount =
          value;

        if (
          Number(
            currentSize.oldPrice
          ) > 0
        ) {
          currentSize.price =
            Number(
              currentSize.oldPrice
            ) -
            (Number(
              currentSize.oldPrice
            ) *
              Number(value)) /
              100;
        }
      }

      if (field === "stock") {
        currentSize.stock =
          value;
      }

      sizes[sizeIndex] =
        currentSize;

      colourVariant.sizes =
        sizes;

      variants[colourIndex] =
        colourVariant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // ADD SIZE
  // ============================================================

  const addSize = (
    colourIndex
  ) => {
    const size =
      window.prompt(
        "Enter size name (example: XS, S, M, L, XL, XXL):"
      );

    if (
      !size ||
      !size.trim()
    ) {
      return;
    }

    const cleanSize =
      size
        .trim()
        .toUpperCase();

    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      const colourVariant = {
        ...variants[
          colourIndex
        ]
      };

      const sizes = [
        ...(colourVariant.sizes ||
          [])
      ];

      const exists =
        sizes.some(
          (item) =>
            String(
              item.size
            ).toLowerCase() ===
            cleanSize.toLowerCase()
        );

      if (exists) {
        alert(
          `${cleanSize} already exists.`
        );

        return prev;
      }

      sizes.push({
        size: cleanSize,
        price: "",
        oldPrice: "",
        discount: 0,
        stock: ""
      });

      colourVariant.sizes =
        sizes;

      variants[colourIndex] =
        colourVariant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // REMOVE SIZE
  // ============================================================

  const removeSize = (
    colourIndex,
    sizeIndex
  ) => {
    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      const colourVariant = {
        ...variants[
          colourIndex
        ]
      };

      const sizes = [
        ...(colourVariant.sizes ||
          [])
      ];

      if (sizes.length <= 1) {
        alert(
          "At least one size is required."
        );

        return prev;
      }

      sizes.splice(
        sizeIndex,
        1
      );

      colourVariant.sizes =
        sizes;

      variants[colourIndex] =
        colourVariant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // PRODUCT MAIN IMAGE
  // ============================================================

  const handleImageChange = (
    e,
    type
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) {
      return;
    }

    if (type === "img") {
      const url =
        URL.createObjectURL(
          files[0]
        );

      setFormData((prev) => ({
        ...prev,

        img: url,

        imgFile:
          files[0]
      }));
    }

    if (
      type ===
      "thumbnails"
    ) {
      const urls =
        files.map((file) =>
          URL.createObjectURL(
            file
          )
        );

      setFormData((prev) => ({
        ...prev,

        thumbnails:
          urls,

        thumbnailFiles:
          files
      }));
    }
  };

  // ============================================================
  // VARIANT MAIN IMAGE
  // ============================================================

  const handleVariantMainImage = (
    colourIndex,
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      variants[colourIndex] = {
        ...variants[
          colourIndex
        ],

        mainImage: url,

        mainImageFile:
          file
      };

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // VARIANT THUMBNAILS
  // ============================================================

  const handleVariantThumbnails = (
    colourIndex,
    e
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) {
      return;
    }

    const urls =
      files.map((file) =>
        URL.createObjectURL(
          file
        )
      );

    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      variants[colourIndex] = {
        ...variants[
          colourIndex
        ],

        thumbnails: [
          ...(variants[
            colourIndex
          ].thumbnails || []),
          ...urls
        ],

        thumbnailFiles: [
          ...(variants[
            colourIndex
          ].thumbnailFiles ||
            []),
          ...files
        ]
      };

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // REMOVE VARIANT MAIN IMAGE
  // ============================================================

  const removeVariantMainImage = (
    colourIndex
  ) => {
    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      variants[colourIndex] = {
        ...variants[
          colourIndex
        ],

        mainImage: "",

        mainImageFile: null
      };

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // REMOVE VARIANT THUMBNAIL
  // ============================================================

  const removeVariantThumbnail = (
    colourIndex,
    imageIndex
  ) => {
    setFormData((prev) => {
      const variants = [
        ...prev.variants
      ];

      const variant = {
        ...variants[
          colourIndex
        ]
      };

      const thumbnails = [
        ...(variant.thumbnails ||
          [])
      ];

      const thumbnailFiles = [
        ...(variant.thumbnailFiles ||
          [])
      ];

      thumbnails.splice(
        imageIndex,
        1
      );

      /*
       * Only remove the file when it
       * belongs to the newly selected
       * files.
       *
       * Existing URLs do not have
       * corresponding files.
       */
      if (
        imageIndex <
        thumbnailFiles.length
      ) {
        thumbnailFiles.splice(
          imageIndex,
          1
        );
      }

      variant.thumbnails =
        thumbnails;

      variant.thumbnailFiles =
        thumbnailFiles;

      variants[colourIndex] =
        variant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // VALIDATE
  // ============================================================

  const validateVariants =
    () => {
      if (
        !formData.variants.length
      ) {
        throw new Error(
          "Please add at least one colour."
        );
      }

      for (
        let i = 0;
        i <
        formData.variants.length;
        i++
      ) {
        const variant =
          formData.variants[i];

        if (
          !variant.colour?.trim()
        ) {
          throw new Error(
            `Please enter colour for Colour ${
              i + 1
            }.`
          );
        }

        /*
         * IMAGE VALIDATION
         *
         * Each colour should have
         * its own main image.
         */
        if (
          !variant.mainImage &&
          !variant.mainImageFile
        ) {
          throw new Error(
            `Please add a main image for ${variant.colour}.`
          );
        }

        if (
          isDressCategory(
            formData.cat
          )
        ) {
          if (
            !variant.sizes?.length
          ) {
            throw new Error(
              `Please add at least one size for ${variant.colour}.`
            );
          }

          for (
            let j = 0;
            j <
            variant.sizes.length;
            j++
          ) {
            const size =
              variant.sizes[j];

            if (
              size.price === "" ||
              size.price ===
                null ||
              size.price ===
                undefined
            ) {
              throw new Error(
                `Please enter price for ${variant.colour} - ${size.size}.`
              );
            }

            if (
              size.stock === "" ||
              size.stock ===
                null ||
              size.stock ===
                undefined
            ) {
              throw new Error(
                `Please enter stock for ${variant.colour} - ${size.size}.`
              );
            }
          }
        } else {
          if (
            variant.price === "" ||
            variant.price ===
              null ||
            variant.price ===
              undefined
          ) {
            throw new Error(
              `Please enter price for ${variant.colour}.`
            );
          }

          if (
            variant.stock === "" ||
            variant.stock ===
              null ||
            variant.stock ===
              undefined
          ) {
            throw new Error(
              `Please enter stock for ${variant.colour}.`
            );
          }
        }
      }
    };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async (
    e
  ) => {
    e.preventDefault();

    setSaving(true);

    setErrorMessage("");

    try {
      if (
        !formData.name.trim()
      ) {
        throw new Error(
          "Product name is required."
        );
      }

      validateVariants();

      const form =
        new FormData();

      // ========================================================
      // BASIC PRODUCT
      // ========================================================

      form.append(
        "name",
        formData.name
      );

      form.append(
        "cat",
        formData.cat
      );

      form.append(
        "subCategory",
        formData.subCat
      );

      form.append(
        "type",
        formData.type
      );

      // ========================================================
      // DEFAULT VALUES
      // ========================================================

      let defaultPrice = 0;

      let defaultOldPrice = 0;

      let defaultDiscount = 0;

      let defaultStock = 0;

      if (
        isDressCategory(
          formData.cat
        )
      ) {
        const firstColour =
          formData.variants[0];

        const firstSize =
          firstColour?.sizes?.[0];

        defaultPrice =
          Number(
            firstSize?.price || 0
          );

        defaultOldPrice =
          Number(
            firstSize?.oldPrice ||
              0
          );

        defaultDiscount =
          Number(
            firstSize?.discount ||
              0
          );

        defaultStock =
          formData.variants.reduce(
            (
              total,
              colour
            ) =>
              total +
              (
                colour.sizes ||
                []
              ).reduce(
                (
                  sizeTotal,
                  size
                ) =>
                  sizeTotal +
                  Number(
                    size.stock ||
                      0
                  ),
                0
              ),
            0
          );
      } else {
        const firstColour =
          formData.variants[0];

        defaultPrice =
          Number(
            firstColour?.price ||
              0
          );

        defaultOldPrice =
          Number(
            firstColour?.oldPrice ||
              0
          );

        defaultDiscount =
          Number(
            firstColour?.discount ||
              0
          );

        defaultStock =
          formData.variants.reduce(
            (
              total,
              variant
            ) =>
              total +
              Number(
                variant.stock ||
                  0
              ),
            0
          );
      }

      form.append(
        "price",
        String(defaultPrice)
      );

      form.append(
        "oldPrice",
        String(defaultOldPrice)
      );

      form.append(
        "discount",
        String(defaultDiscount)
      );

      form.append(
        "stock",
        String(defaultStock)
      );

      form.append(
        "hasSizes",
        String(
          isDressCategory(
            formData.cat
          )
        )
      );

      // ========================================================
      // MAIN PRODUCT IMAGE
      // ========================================================

      if (
        formData.imgFile
      ) {
        form.append(
          "img_url",
          formData.imgFile
        );
      } else if (
        currentProduct
      ) {
        form.append(
          "existingMainImage",
          currentProduct.img_url ||
            ""
        );
      }

      // ========================================================
      // MAIN PRODUCT THUMBNAILS
      // ========================================================

      if (
        formData.thumbnailFiles
          ?.length
      ) {
        formData.thumbnailFiles.forEach(
          (file) => {
            form.append(
              "thumbnails",
              file
            );
          }
        );
      } else if (
        currentProduct
      ) {
        form.append(
          "existingThumbnails",
          JSON.stringify(
            currentProduct.thumbnails ||
              []
          )
        );
      }

      // ========================================================
      // VARIANT METADATA
      // ========================================================
      /*
       * IMPORTANT:
       *
       * We DO NOT put File objects
       * into JSON.
       *
       * Files are sent below separately.
       */

      const variantsForJSON =
        formData.variants.map(
          (
            variant,
            colourIndex
          ) => {
            const cleanVariant = {
              colour:
                variant.colour
            };

            if (
              isDressCategory(
                formData.cat
              )
            ) {
              cleanVariant.sizes =
                (
                  variant.sizes ||
                  []
                ).map(
                  (size) => ({
                    size:
                      size.size,
                    price:
                      Number(
                        size.price ||
                          0
                      ),
                    oldPrice:
                      Number(
                        size.oldPrice ||
                          0
                      ),
                    discount:
                      Number(
                        size.discount ||
                          0
                      ),
                    stock:
                      Number(
                        size.stock ||
                          0
                      )
                  })
                );
            } else {
              cleanVariant.price =
                Number(
                  variant.price ||
                    0
                );

              cleanVariant.oldPrice =
                Number(
                  variant.oldPrice ||
                    0
                );

              cleanVariant.discount =
                Number(
                  variant.discount ||
                    0
                );

              cleanVariant.stock =
                Number(
                  variant.stock ||
                    0
                );
            }

            /*
             * Existing images are included
             * in metadata.
             *
             * New uploaded files are mapped
             * using their indexes below.
             */

            cleanVariant.existingMainImage =
              variant.mainImageFile
                ? ""
                : variant.mainImage ||
                  "";

            cleanVariant.existingThumbnails =
              (
                variant.thumbnails ||
                []
              ).filter(
                (url) =>
                  typeof url ===
                  "string"
              );

            cleanVariant.mainImageField =
              variant.mainImageFile
                ? `variant_${colourIndex}_main`
                : "";

            cleanVariant.thumbnailField =
              `variant_${colourIndex}_thumbnails`;

            return cleanVariant;
          }
        );

      form.append(
        "variants",
        JSON.stringify(
          variantsForJSON
        )
      );

      // ========================================================
      // VARIANT IMAGE FILES
      // ========================================================

      /*
       * Every colour gets its own field.
       *
       * Example:
       *
       * variant_0_main
       * variant_0_thumbnails
       *
       * variant_1_main
       * variant_1_thumbnails
       *
       * variant_2_main
       * variant_2_thumbnails
       */

      const variantImageMeta = [];

      formData.variants.forEach(
        (
          variant,
          colourIndex
        ) => {
          // ----------------------------------------------------
          // MAIN IMAGE
          // ----------------------------------------------------

          if (
            variant.mainImageFile
          ) {
            form.append(
              `variant_${colourIndex}_main`,
              variant.mainImageFile
            );
          }

          // ----------------------------------------------------
          // THUMBNAILS
          // ----------------------------------------------------

          if (
            variant.thumbnailFiles
              ?.length
          ) {
            variant.thumbnailFiles.forEach(
              (file) => {
                form.append(
                  `variant_${colourIndex}_thumbnails`,
                  file
                );
              }
            );
          }

          variantImageMeta.push({
            colourIndex,

            colour:
              variant.colour,

            mainImageField:
              variant.mainImageFile
                ? `variant_${colourIndex}_main`
                : null,

            thumbnailField:
              `variant_${colourIndex}_thumbnails`,

            existingMainImage:
              variant.mainImageFile
                ? null
                : variant.mainImage ||
                  null,

            existingThumbnails:
              (
                variant.thumbnails ||
                []
              ).filter(
                (url) =>
                  typeof url ===
                  "string"
              )
          });
        }
      );

      form.append(
        "variantImageMeta",
        JSON.stringify(
          variantImageMeta
        )
      );

      // ========================================================
      // DEBUG
      // ========================================================

      console.log(
        "Saving variants:",
        variantsForJSON
      );

      console.log(
        "Variant image metadata:",
        variantImageMeta
      );

      // ========================================================
      // API
      // ========================================================

      const url = currentProduct
        ? `${API_URL}/update/${currentProduct.id}`
        : `${API_URL}/add`;

      const method =
        currentProduct
          ? "PUT"
          : "POST";

      const res =
        await fetch(url, {
          method,
          body: form
        });

      const responseText =
        await res.text();

      if (!res.ok) {
        throw new Error(
          responseText ||
            "Failed to save product."
        );
      }

      console.log(
        "Product saved:",
        responseText
      );

      await fetchProducts();

      setModalOpen(false);

      setCurrentProduct(
        null
      );

      alert(
        currentProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
    } catch (err) {
      console.error(
        "Error saving product:",
        err
      );

      setErrorMessage(
        err.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // TOTAL STOCK
  // ============================================================

  const getTotalVariantStock =
    (product) => {
      const variants =
        normalizeVariants(
          product
        );

      if (!variants.length) {
        return Number(
          product.stock || 0
        );
      }

      if (
        isDressCategory(
          product.category
        )
      ) {
        return variants.reduce(
          (
            total,
            colour
          ) =>
            total +
            (
              colour.sizes ||
              []
            ).reduce(
              (
                sum,
                size
              ) =>
                sum +
                Number(
                  size.stock ||
                    0
                ),
              0
            ),
          0
        );
      }

      return variants.reduce(
        (
          total,
          variant
        ) =>
          total +
          Number(
            variant.stock ||
              0
          ),
        0
      );
    };

  // ============================================================
  // RENDER VARIANT SUMMARY
  // ============================================================

  const renderVariantSummary =
    (product) => {
      const variants =
        normalizeVariants(
          product
        );

      if (!variants.length) {
        return (
          <span
            style={{
              color: "#999"
            }}
          >
            No variants
          </span>
        );
      }

      const dress =
        isDressCategory(
          product.category
        );

      return (
        <div className="variant-summary">
          {variants.map(
            (
              variant,
              index
            ) => {
              const mainImage =
                variant.mainImage ||
                variant.main_image ||
                variant.image ||
                "";

              const thumbnails =
                Array.isArray(
                  variant.thumbnails
                )
                  ? variant.thumbnails
                  : [];

              return (
                <div
                  key={index}
                  className="variant-colour-row"
                >
                  <span className="colour-chip">
                    {variant.colour ||
                      `Colour ${
                        index + 1
                      }`}
                  </span>

                  {dress ? (
                    <>
                      {(
                        variant.sizes ||
                        []
                      ).map(
                        (
                          size,
                          sizeIndex
                        ) => (
                          <span
                            className="size-chip"
                            key={
                              sizeIndex
                            }
                          >
                            {size.size}: ₹
                            {Number(
                              size.price ||
                                0
                            ).toLocaleString()}
                            {" / "}
                            {Number(
                              size.stock ||
                                0
                            )}{" "}
                            pcs
                          </span>
                        )
                      )}
                    </>
                  ) : (
                    <span className="size-chip">
                      ₹
                      {Number(
                        variant.price ||
                          0
                      ).toLocaleString()}
                      {" / "}
                      {Number(
                        variant.stock ||
                          0
                      )}{" "}
                      pcs
                    </span>
                  )}

                  {/* Variant images */}
                  {(mainImage ||
                    thumbnails.length >
                      0) && (
                    <div className="variant-images-mini">
                      {mainImage && (
                        <img
                          src={
                            mainImage
                          }
                          className="variant-image-mini"
                          alt={`${variant.colour} main`}
                        />
                      )}

                      {thumbnails
                        .slice(
                          0,
                          4
                        )
                        .map(
                          (
                            image,
                            imageIndex
                          ) => (
                            <img
                              key={
                                imageIndex
                              }
                              src={
                                image
                              }
                              className="variant-image-mini"
                              alt={`${variant.colour} thumb`}
                            />
                          )
                        )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      );
    };

  // ============================================================
  // RENDER IMAGE UPLOADS
  // ============================================================

  const renderColourImages =
    (
      variant,
      colourIndex
    ) => {
      return (
        <div className="colour-image-section">
          <div className="colour-image-title">
            🖼️ {variant.colour ||
              `Colour ${
                colourIndex + 1
              }`} Images
          </div>

          <div className="image-upload-grid">
            {/* ==================================================
                MAIN IMAGE
            ================================================== */}

            <div className="image-upload-box">
              <label>
                Main Image for this Colour
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleVariantMainImage(
                    colourIndex,
                    e
                  )
                }
              />

              {variant.mainImage && (
                <div className="image-preview-row">
                  <div className="image-preview-wrapper">
                    <img
                      src={
                        variant.mainImage
                      }
                      className="image-preview"
                      alt={`${variant.colour} main`}
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() =>
                        removeVariantMainImage(
                          colourIndex
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {!variant.mainImageFile &&
                variant.mainImage && (
                  <div className="existing-image-label">
                    Existing image
                  </div>
                )}
            </div>

            {/* ==================================================
                THUMBNAILS
            ================================================== */}

            <div className="image-upload-box">
              <label>
                Thumbnail Images for this Colour
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  handleVariantThumbnails(
                    colourIndex,
                    e
                  )
                }
              />

              {variant.thumbnails?.length >
                0 && (
                <div className="image-preview-row">
                  {variant.thumbnails.map(
                    (
                      image,
                      imageIndex
                    ) => (
                      <div
                        className="image-preview-wrapper"
                        key={
                          imageIndex
                        }
                      >
                        <img
                          src={
                            image
                          }
                          className="image-preview"
                          alt={`${variant.colour} thumbnail`}
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() =>
                            removeVariantThumbnail(
                              colourIndex,
                              imageIndex
                            )
                          }
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

  // ============================================================
  // RENDER VARIANT BUILDER
  // ============================================================

  const renderVariantBuilder =
    () => {
      const dress =
        isDressCategory(
          formData.cat
        );

      return (
        <div className="variant-builder">
          <div className="variant-builder-title">
            {dress
              ? "Dress Colour, Images & Size Variants"
              : "Saree Colour, Images & Price Variants"}
          </div>

          <div className="variant-builder-description">
            {dress
              ? "Each colour can have different images, thumbnails, sizes, prices and stock."
              : "Each saree colour can have its own main image, thumbnails, price, MRP, discount and stock."}
          </div>

          <div className="info-box">
            <strong>
              Example:
            </strong>{" "}
            Red saree → Red main image +
            Red thumbnails + ₹2499.
            Blue saree → Blue main image +
            Blue thumbnails + ₹2799.
            Green saree → Green main image +
            Green thumbnails + ₹2699.
          </div>

          {formData.variants.length ===
            0 && (
            <div className="empty-variants">
              No colours added yet.
            </div>
          )}

          {formData.variants.map(
            (
              variant,
              colourIndex
            ) => (
              <div
                className="colour-card"
                key={colourIndex}
              >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="colour-card-header">
                  <div className="colour-card-header-left">
                    <strong>
                      Colour{" "}
                      {colourIndex +
                        1}
                    </strong>

                    <input
                      className="colour-name-input"
                      type="text"
                      placeholder="Enter colour e.g. Red"
                      value={
                        variant.colour ||
                        ""
                      }
                      onChange={(e) =>
                        updateColourName(
                          colourIndex,
                          e.target
                            .value
                        )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-small btn-red"
                    onClick={() =>
                      removeColour(
                        colourIndex
                      )
                    }
                  >
                    Remove
                  </button>
                </div>

                {/* ==================================================
                    BODY
                ================================================== */}

                <div className="colour-card-body">
                  {/* COLOUR IMAGES */}

                  {renderColourImages(
                    variant,
                    colourIndex
                  )}

                  {/* ==================================================
                      DRESS
                  ================================================== */}

                  {dress ? (
                    <>
                      <div className="size-table-wrapper">
                        <table className="size-table">
                          <thead>
                            <tr>
                              <th>
                                Size
                              </th>

                              <th>
                                Price ₹
                              </th>

                              <th>
                                MRP ₹
                              </th>

                              <th>
                                Discount %
                              </th>

                              <th>
                                Stock
                              </th>

                              <th>
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {(
                              variant.sizes ||
                              []
                            ).map(
                              (
                                size,
                                sizeIndex
                              ) => (
                                <tr
                                  key={
                                    sizeIndex
                                  }
                                >
                                  <td>
                                    <input
                                      className="size-name-box"
                                      type="text"
                                      value={
                                        size.size ||
                                        ""
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateDressSize(
                                          colourIndex,
                                          sizeIndex,
                                          "size",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="999"
                                      value={
                                        size.price ??
                                        ""
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateDressSize(
                                          colourIndex,
                                          sizeIndex,
                                          "price",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="1299"
                                      value={
                                        size.oldPrice ??
                                        ""
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateDressSize(
                                          colourIndex,
                                          sizeIndex,
                                          "oldPrice",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={
                                        size.discount ??
                                        0
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateDressSize(
                                          colourIndex,
                                          sizeIndex,
                                          "discount",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="10"
                                      value={
                                        size.stock ??
                                        ""
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateDressSize(
                                          colourIndex,
                                          sizeIndex,
                                          "stock",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                    />
                                  </td>

                                  <td>
                                    <button
                                      type="button"
                                      className="btn-small btn-red"
                                      onClick={() =>
                                        removeSize(
                                          colourIndex,
                                          sizeIndex
                                        )
                                      }
                                    >
                                      ×
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="add-size-row">
                        <button
                          type="button"
                          className="btn-small btn-outline"
                          onClick={() =>
                            addSize(
                              colourIndex
                            )
                          }
                        >
                          + Add Size
                        </button>
                      </div>
                    </>
                  ) : (
                    /* ==================================================
                       SAREE
                    ================================================== */

                    <div className="saree-variant-row">
                      <div className="variant-field">
                        <label>
                          Colour
                        </label>

                        <input
                          type="text"
                          placeholder="Red"
                          value={
                            variant.colour ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updateColourName(
                              colourIndex,
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>
                          Price ₹
                        </label>

                        <input
                          type="number"
                          min="0"
                          placeholder="2499"
                          value={
                            variant.price ??
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updateSareeVariant(
                              colourIndex,
                              "price",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>
                          MRP ₹
                        </label>

                        <input
                          type="number"
                          min="0"
                          placeholder="2999"
                          value={
                            variant.oldPrice ??
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updateSareeVariant(
                              colourIndex,
                              "oldPrice",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>
                          Discount %
                        </label>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            variant.discount ??
                            0
                          }
                          onChange={(
                            e
                          ) =>
                            updateSareeVariant(
                              colourIndex,
                              "discount",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>
                          Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          placeholder="5"
                          value={
                            variant.stock ??
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            updateSareeVariant(
                              colourIndex,
                              "stock",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          className="btn-small btn-red"
                          onClick={() =>
                            removeColour(
                              colourIndex
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          <button
            type="button"
            className="add-colour-button"
            onClick={addColour}
          >
            + Add Another Colour
          </button>
        </div>
      );
    };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="admin-container">
      <style>
        {adminStyles}
      </style>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="admin-header">
        <div>
          <h1>
            Inventory Management
          </h1>

          <p>
            Manage products, colours,
            colour-specific images,
            thumbnails, sizes, prices
            and stock.
          </p>
        </div>

        <button
          className="btn-add"
          onClick={() =>
            handleOpenModal()
          }
        >
          + Add New Product
        </button>
      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {errorMessage && (
        <div
          style={{
            background: "#fff0f0",
            border:
              "1px solid #ffcaca",
            color: "#b42318",
            padding: "12px 14px",
            borderRadius: "8px",
            marginBottom: "16px"
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* ========================================================
          DESKTOP
      ======================================================== */}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                Main Image
              </th>

              <th>
                Thumbnails
              </th>

              <th>
                Product
              </th>

              <th>
                Category
              </th>

              <th>
                Sub-Category
              </th>

              <th>
                Type
              </th>

              <th>
                Colour / Size /
                Price / Images
              </th>

              <th>
                Total Stock
              </th>

              <th>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length ===
            0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "40px",
                    color:
                      "#777"
                  }}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map(
                (p) => (
                  <tr
                    key={p.id}
                  >
                    {/* Main image */}

                    <td>
                      <img
                        src={
                          p.img_url ||
                          p.thumbnails?.[0] ||
                          ""
                        }
                        className="prod-img-mini"
                        alt={
                          p.name
                        }
                      />
                    </td>

                    {/* Main thumbnails */}

                    <td>
                      <div className="thumbnail-container">
                        {(
                          p.thumbnails ||
                          []
                        ).map(
                          (
                            t,
                            i
                          ) => (
                            <img
                              key={
                                i
                              }
                              src={
                                t
                              }
                              className="prod-img-mini"
                              alt={`thumb-${i}`}
                            />
                          )
                        )}
                      </div>
                    </td>

                    {/* Product */}

                    <td>
                      <div
                        style={{
                          fontWeight:
                            "600"
                        }}
                      >
                        {p.name}
                      </div>

                      <div
                        style={{
                          fontSize:
                            "0.75rem",
                          color:
                            "#999"
                        }}
                      >
                        ID: #
                        {
                          p.id
                        }
                      </div>
                    </td>

                    {/* Category */}

                    <td>
                      <span className="status-badge">
                        {
                          p.category
                        }
                      </span>
                    </td>

                    {/* Sub category */}

                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background:
                            "#f3e5f5",
                          color:
                            "#7b1fa2"
                        }}
                      >
                        {p.sub_category ||
                          p.subCategory ||
                          "-"}
                      </span>
                    </td>

                    {/* Type */}

                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background:
                            "#fff3e0",
                          color:
                            "#e65100"
                        }}
                      >
                        {p.type ||
                          "Regular"}
                      </span>
                    </td>

                    {/* Variants */}

                    <td>
                      {renderVariantSummary(
                        p
                      )}
                    </td>

                    {/* Stock */}

                    <td>
                      <strong>
                        {getTotalVariantStock(
                          p
                        )}
                      </strong>{" "}
                      pcs
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleOpenModal(
                              p
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(
                              p.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          MOBILE
      ======================================================== */}

      <div className="mobile-card-container">
        {products.map(
          (p) => (
            <div
              className="product-card"
              key={p.id}
            >
              <div className="card-top">
                <img
                  src={
                    p.img_url ||
                    p.thumbnails?.[0] ||
                    ""
                  }
                  className="card-main-img"
                  alt={p.name}
                />

                <div className="card-info">
                  <div
                    style={{
                      fontSize:
                        "0.7rem",
                      color:
                        "#999",
                      marginBottom:
                        "2px"
                    }}
                  >
                    ID: #
                    {
                      p.id
                    }
                  </div>

                  <div
                    style={{
                      fontWeight:
                        "700",
                      fontSize:
                        "0.95rem",
                      color:
                        "var(--text-dark)",
                      marginBottom:
                        "6px",
                      lineHeight:
                        "1.2"
                    }}
                  >
                    {p.name}
                  </div>

                  <div>
                    <span className="status-badge">
                      {
                        p.category
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-grid">
                <div className="card-field">
                  <label>
                    Sub-Category
                  </label>

                  <span>
                    {p.sub_category ||
                      p.subCategory ||
                      "-"}
                  </span>
                </div>

                <div className="card-field">
                  <label>
                    Type
                  </label>

                  <span>
                    {p.type ||
                      "Regular"}
                  </span>
                </div>

                <div className="card-field">
                  <label>
                    Colours
                  </label>

                  <span>
                    {
                      normalizeVariants(
                        p
                      ).length
                    }
                  </span>
                </div>

                <div className="card-field">
                  <label>
                    Total Stock
                  </label>

                  <span>
                    {getTotalVariantStock(
                      p
                    )}{" "}
                    pcs
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginBottom:
                    "12px"
                }}
              >
                {renderVariantSummary(
                  p
                )}
              </div>

              {p.thumbnails &&
                p.thumbnails
                  .length >
                  0 && (
                  <div className="card-thumbnails-row">
                    {p.thumbnails.map(
                      (
                        t,
                        i
                      ) => (
                        <img
                          key={
                            i
                          }
                          src={
                            t
                          }
                          className="prod-img-mini"
                          alt={`thumb-${i}`}
                        />
                      )
                    )}
                  </div>
                )}

              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() =>
                    handleOpenModal(
                      p
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() =>
                    handleDelete(
                      p.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* ========================================================
          MODAL
      ======================================================== */}

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() =>
            !saving &&
            setModalOpen(
              false
            )
          }
        >
          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2
              style={{
                marginBottom:
                  "20px",
                color:
                  "var(--primary-green)",
                marginTop: 0,
                fontSize:
                  "1.4rem"
              }}
            >
              {currentProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <form
              onSubmit={
                handleSave
              }
            >
              {/* ==================================================
                  NAME
              ================================================== */}

              <div className="form-group">
                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  required
                  value={
                    formData.name
                  }
                  onChange={(e) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        name: e
                          .target
                          .value
                      })
                    )
                  }
                  placeholder="Example: Designer Kanchipuram Silk Saree"
                />
              </div>

              {/* ==================================================
                  CATEGORY
              ================================================== */}

              <div className="form-group">
                <label>
                  Category
                </label>

                <select
                  value={
                    formData.cat
                  }
                  onChange={(e) =>
                    handleCategoryChange(
                      e.target
                        .value
                    )
                  }
                >
                  {Object.keys(
                    subCategoriesMap
                  ).map(
                    (cat) => (
                      <option
                        key={
                          cat
                        }
                        value={
                          cat
                        }
                      >
                        {cat}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ==================================================
                  SUB CATEGORY
              ================================================== */}

              <div className="form-group">
                <label>
                  Sub-Category
                </label>

                <select
                  value={
                    formData.subCat
                  }
                  onChange={(e) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        subCat:
                          e
                            .target
                            .value
                      })
                    )
                  }
                >
                  <option value="">
                    Select Sub-Category
                  </option>

                  {(
                    subCategoriesMap[
                      formData.cat
                    ] || []
                  ).map(
                    (sub) => (
                      <option
                        key={
                          sub
                        }
                        value={
                          sub
                        }
                      >
                        {sub}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ==================================================
                  TYPE
              ================================================== */}

              <div className="form-group">
                <label>
                  Product Type
                </label>

                <select
                  value={
                    formData.type
                  }
                  onChange={(e) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        type: e
                          .target
                          .value
                      })
                    )
                  }
                >
                  <option>
                    New Arrival
                  </option>

                  <option>
                    Best Seller
                  </option>

                  <option>
                    Regular
                  </option>
                </select>
              </div>

              {/* ==================================================
                  COLOUR VARIANTS
              ================================================== */}

              {renderVariantBuilder()}

              {/* ==================================================
                  OPTIONAL PRODUCT MAIN IMAGE
              ================================================== */}

              <div
                className="form-group"
                style={{
                  marginTop:
                    "20px"
                }}
              >
                <label>
                  Product Main Image
                  <span
                    style={{
                      fontWeight:
                        "400",
                      color:
                        "#888"
                    }}
                  >
                    {" "}
                    (optional when colour images are used)
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(
                      e,
                      "img"
                    )
                  }
                />

                {formData.img && (
                  <img
                    src={
                      formData.img
                    }
                    className="thumbnail-preview"
                    style={{
                      marginTop:
                        "8px"
                    }}
                    alt="Product Preview"
                  />
                )}
              </div>

              {/* ==================================================
                  OPTIONAL PRODUCT THUMBNAILS
              ================================================== */}

              <div className="form-group">
                <label>
                  Product Thumbnail Images
                  <span
                    style={{
                      fontWeight:
                        "400",
                      color:
                        "#888"
                    }}
                  >
                    {" "}
                    (optional)
                  </span>
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(
                      e,
                      "thumbnails"
                    )
                  }
                />

                <div
                  className="thumbnail-container"
                  style={{
                    marginTop:
                      "8px"
                  }}
                >
                  {formData.thumbnails.map(
                    (
                      t,
                      i
                    ) => (
                      <img
                        key={
                          i
                        }
                        src={
                          t
                        }
                        className="thumbnail-preview"
                        alt={`thumb-${i}`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* ==================================================
                  ACTIONS
              ================================================== */}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(
                      false
                    )
                  }
                  disabled={
                    saving
                  }
                  style={{
                    border:
                      "none",
                    background:
                      "none",
                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",
                    fontWeight:
                      "600",
                    color:
                      "var(--text-muted)"
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-add"
                  disabled={
                    saving
                  }
                  style={{
                    padding:
                      "10px 20px",
                    opacity:
                      saving
                        ? 0.6
                        : 1
                  }}
                >
                  {saving
                    ? "Saving..."
                    : currentProduct
                    ? "Update Product"
                    : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}