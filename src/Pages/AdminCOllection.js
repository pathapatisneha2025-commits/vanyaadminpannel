
import React, { useEffect, useState } from "react";

const COLLECTION_API =
  "https://vanyabackenddatabase-vahr.onrender.com/categories";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ============================================================
  // FETCH CATEGORIES
  // ============================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(COLLECTION_API);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH CATEGORY ERROR:", error);
      setMessage("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ============================================================
  // IMAGE SELECT
  // ============================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setMessage("");

    // Only for preview
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ============================================================
  // ADD / UPDATE CATEGORY
  // ============================================================

  const handleSave = async () => {
    // Validate category name
    if (!categoryName.trim()) {
      setMessage("Please enter category name.");
      return;
    }

    // Image is required only when ADDING
    if (editingId === null && !imageFile) {
      setMessage("Please upload an image.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const formData = new FormData();

      // Category name
      formData.append(
        "category",
        categoryName.trim()
      );

      // Image
      // For ADD: required
      // For UPDATE: optional
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let url;
      let method;

      // ========================================================
      // ADD
      // ========================================================

      if (editingId === null) {
        url = `${COLLECTION_API}/add`;
        method = "POST";
      }

      // ========================================================
      // UPDATE
      // ========================================================

      else {
        url = `${COLLECTION_API}/update/${editingId}`;
        method = "PUT";
      }

      console.log("CATEGORY REQUEST:", {
        method,
        url,
        editingId,
        category: categoryName.trim(),
        hasImage: !!imageFile,
      });

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingId !== null
              ? "Failed to update category."
              : "Failed to add category.")
        );
      }

      // ========================================================
      // SUCCESS MESSAGE
      // ========================================================

      if (editingId !== null) {
        setMessage(
          "Category updated successfully."
        );
      } else {
        setMessage(
          "Category added successfully."
        );
      }

      // ========================================================
      // CLEAR FORM
      // ========================================================

      setCategoryName("");
      setImageFile(null);
      setImagePreview("");
      setEditingId(null);

      const fileInput = document.getElementById(
        "category-image-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }

      // ========================================================
      // REFRESH CATEGORY LIST
      // ========================================================

      await fetchCategories();
    } catch (error) {
      console.error(
        editingId !== null
          ? "UPDATE CATEGORY ERROR:"
          : "ADD CATEGORY ERROR:",
        error
      );

      setMessage(
        error.message ||
          (editingId !== null
            ? "Failed to update category."
            : "Failed to add category.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // EDIT CATEGORY
  // ============================================================

  const handleEdit = (category) => {
    if (!category?.id) {
      setMessage("Category ID not found.");
      return;
    }

    // Store ID so Save knows this is UPDATE
    setEditingId(category.id);

    // Load category name
    setCategoryName(
      category.category || ""
    );

    // Show existing Cloudinary image
    setImagePreview(
      category.image_url || ""
    );

    // Important:
    // Do not set existing URL as imageFile.
    // User only needs to select a new file if
    // they want to replace the image.
    setImageFile(null);

    setMessage("");

    // Clear file input
    const fileInput = document.getElementById(
      "category-image-input"
    );

    if (fileInput) {
      fileInput.value = "";
    }

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // DELETE CATEGORY
  // ============================================================

  const handleDelete = async (category) => {
    if (!category?.id) {
      setMessage("Category ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${category.category}" category?`
    );

    if (!confirmed) return;

    try {
      setMessage("");

      const response = await fetch(
        `${COLLECTION_API}/${category.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete category"
        );
      }

      setMessage(
        "Category deleted successfully."
      );

      // If deleted category was being edited
      if (editingId === category.id) {
        handleClear();
      }

      await fetchCategories();
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Failed to delete category."
      );
    }
  };

  // ============================================================
  // CLEAR FORM
  // ============================================================

  const handleClear = () => {
    setCategoryName("");
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setMessage("");

    const fileInput = document.getElementById(
      "category-image-input"
    );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          Loading categories...
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div style={styles.header}>
          <p style={styles.smallTitle}>
            VANYA COLLECTIONS
          </p>

          <h1 style={styles.title}>
            Category Management
          </h1>

          <p style={styles.description}>
            Create and manage collection categories.
          </p>
        </div>

        {/* =====================================================
            ADD / EDIT CATEGORY FORM
        ====================================================== */}

        <div style={styles.formCard}>

          <h2 style={styles.sectionTitle}>
            {editingId !== null
              ? "Edit Category"
              : "Add Category"}
          </h2>

          {/* EDIT MODE INFO */}

          {editingId !== null && (
            <div style={styles.editModeBox}>
              <strong>
                Editing Category
              </strong>

              <span>
                ID: {editingId}
              </span>
            </div>
          )}

          {/* ===================================================
              CATEGORY NAME
          ==================================================== */}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category Name
            </label>

            <input
              type="text"
              value={categoryName}
              onChange={(e) =>
                setCategoryName(e.target.value)
              }
              placeholder="Enter category name"
              style={styles.input}
              disabled={saving}
            />
          </div>

          {/* ===================================================
              IMAGE
          ==================================================== */}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category Image
            </label>

            <label
              htmlFor="category-image-input"
              style={styles.uploadBox}
            >
              <div style={styles.uploadIcon}>
                +
              </div>

              <strong style={styles.uploadTitle}>
                {editingId !== null
                  ? "Choose New Image"
                  : "Upload Image"}
              </strong>

              <span style={styles.uploadText}>
                {editingId !== null
                  ? "Leave empty to keep the current image"
                  : "Click here to choose an image"}
              </span>
            </label>

            <input
              id="category-image-input"
              type="file"
              onChange={handleImageChange}
              style={{
                display: "none",
              }}
              disabled={saving}
            />
          </div>

          {/* ===================================================
              SELECTED FILE
          ==================================================== */}

          {imageFile && (
            <div style={styles.selectedFile}>
              <strong>
                Selected Image:
              </strong>{" "}
              {imageFile.name}
            </div>
          )}

          {/* ===================================================
              IMAGE PREVIEW
          ==================================================== */}

          {imagePreview && (
            <div style={styles.previewSection}>

              <label style={styles.label}>
                {editingId !== null &&
                !imageFile
                  ? "Current Image"
                  : "Preview"}
              </label>

              <div style={styles.previewWrapper}>
                <img
                  src={imagePreview}
                  alt="Category Preview"
                  style={styles.previewImage}
                />
              </div>

            </div>
          )}

          {/* ===================================================
              BUTTONS
          ==================================================== */}

          <div style={styles.buttonRow}>

            {/* CLEAR */}

            <button
              type="button"
              onClick={handleClear}
              disabled={saving}
              style={{
                ...styles.clearButton,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {editingId !== null
                ? "Cancel Edit"
                : "Clear"}
            </button>

            {/* ADD / UPDATE */}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                ...styles.saveButton,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving
                ? editingId !== null
                  ? "Updating..."
                  : "Adding..."
                : editingId !== null
                ? "Update Category"
                : "Add Category"}
            </button>

          </div>

          {/* ===================================================
              MESSAGE
          ==================================================== */}

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

        </div>

        {/* =====================================================
            CATEGORY LIST
        ====================================================== */}

        <div style={styles.listSection}>

          <div style={styles.listHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                Categories
              </h2>

              <p style={styles.listDescription}>
                Manage your existing collection
                categories.
              </p>
            </div>

            <div style={styles.countBadge}>
              {categories.length}
            </div>

          </div>

          {/* ===================================================
              EMPTY
          ==================================================== */}

          {categories.length === 0 ? (
            <div style={styles.empty}>
              No categories added yet.
            </div>
          ) : (

            <div style={styles.grid}>

              {categories.map((category) => (

                <div
                  key={category.id}
                  style={{
                    ...styles.categoryCard,

                    // Highlight category currently
                    // being edited
                    border:
                      editingId === category.id
                        ? "2px solid #e2bc53"
                        : "1px solid #eadcf0",
                  }}
                >

                  {/* =================================================
                      IMAGE
                  ================================================== */}

                  <div
                    style={
                      styles.cardImageWrapper
                    }
                  >

                    <img
                      src={category.image_url}
                      alt={category.category}
                      style={styles.cardImage}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                  {/* =================================================
                      DETAILS
                  ================================================== */}

                  <div style={styles.cardContent}>

                    <h3 style={styles.cardTitle}>
                      {category.category}
                    </h3>

                    <div
                      style={styles.cardActions}
                    >

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(category)
                        }
                        disabled={saving}
                        style={{
                          ...styles.editButton,
                          opacity: saving
                            ? 0.6
                            : 1,
                        }}
                      >
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(category)
                        }
                        disabled={saving}
                        style={{
                          ...styles.deleteButton,
                          opacity: saving
                            ? 0.6
                            : 1,
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #fdf9ff 0%, #f4eaf6 50%, #eadcf0 100%)",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily:
      "Montserrat, Arial, sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  loading: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#35133d",
    fontSize: "18px",
    fontWeight: "600",
  },

  header: {
    marginBottom: "30px",
  },

  smallTitle: {
    color: "#bfa136",
    fontSize: "12px",
    letterSpacing: "3px",
    fontWeight: "700",
    margin: "0 0 8px",
  },

  title: {
    color: "#35133d",
    fontFamily:
      "Playfair Display, Georgia, serif",
    fontSize: "38px",
    margin: "0 0 10px",
  },

  description: {
    color: "#6c5073",
    fontSize: "14px",
    margin: 0,
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    marginBottom: "35px",
    boxShadow:
      "0 10px 35px rgba(53, 19, 61, 0.12)",
    border: "1px solid #eadcf0",
  },

  sectionTitle: {
    color: "#35133d",
    fontFamily:
      "Playfair Display, Georgia, serif",
    fontSize: "24px",
    margin: "0 0 20px",
  },

  editModeBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "22px",
    padding: "12px 15px",
    background: "#fff8df",
    border: "1px solid #e2bc53",
    borderRadius: "9px",
    color: "#35133d",
    fontSize: "13px",
  },

  formGroup: {
    marginBottom: "22px",
  },

  label: {
    display: "block",
    color: "#35133d",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    border: "1px solid #d9c7df",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    color: "#35133d",
    background: "#fff",
    boxSizing: "border-box",
  },

  uploadBox: {
    minHeight: "140px",
    border:
      "2px dashed #d7b9df",
    borderRadius: "14px",
    background: "#faf7fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
  },

  uploadIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "#35133d",
    color: "#f5d470",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "10px",
  },

  uploadTitle: {
    color: "#35133d",
    fontSize: "14px",
  },

  uploadText: {
    color: "#8a758f",
    fontSize: "12px",
    marginTop: "5px",
  },

  selectedFile: {
    marginTop: "-8px",
    marginBottom: "20px",
    padding: "10px 12px",
    background: "#f5edf7",
    borderRadius: "8px",
    color: "#6c5073",
    fontSize: "12px",
  },

  previewSection: {
    marginBottom: "25px",
  },

  previewWrapper: {
    width: "220px",
    height: "220px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "4px solid #e2bc53",
    background: "#f7f1f9",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
  },

  clearButton: {
    border:
      "1px solid #d7b9df",
    borderRadius: "10px",
    padding: "14px 24px",
    background: "#ffffff",
    color: "#35133d",
    fontWeight: "700",
    cursor: "pointer",
  },

  saveButton: {
    border: "none",
    borderRadius: "10px",
    padding: "14px 28px",
    background: "#35133d",
    color: "#f5d470",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 6px 15px rgba(53, 19, 61, 0.2)",
  },

  message: {
    marginTop: "15px",
    padding: "12px 15px",
    background: "#f5edf7",
    borderRadius: "8px",
    color: "#35133d",
    fontSize: "13px",
    fontWeight: "600",
  },

  listSection: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 10px 35px rgba(53, 19, 61, 0.12)",
    border:
      "1px solid #eadcf0",
  },

  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "25px",
  },

  listDescription: {
    color: "#7d6882",
    fontSize: "13px",
    margin: "-10px 0 0",
  },

  countBadge: {
    background: "#35133d",
    color: "#f5d470",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  empty: {
    padding: "50px 20px",
    textAlign: "center",
    color: "#7d6882",
    background: "#faf7fb",
    borderRadius: "12px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "22px",
  },

  categoryCard: {
    background: "#ffffff",
    borderRadius: "15px",
    overflow: "hidden",
    border:
      "1px solid #eadcf0",
    boxShadow:
      "0 6px 20px rgba(53, 19, 61, 0.08)",
    transition:
      "0.2s ease",
  },

  cardImageWrapper: {
    width: "100%",
    height: "220px",
    overflow: "hidden",
    background: "#f6f0f8",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  cardContent: {
    padding: "18px",
  },

  cardTitle: {
    color: "#35133d",
    fontFamily:
      "Playfair Display, Georgia, serif",
    fontSize: "19px",
    margin: "0 0 15px",
  },

  cardActions: {
    display: "flex",
    gap: "10px",
  },

  editButton: {
    flex: 1,
    border:
      "1px solid #35133d",
    background: "#35133d",
    color: "#f5d470",
    borderRadius: "8px",
    padding: "9px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    flex: 1,
    border:
      "1px solid #d7b9df",
    background: "#ffffff",
    color: "#9a3450",
    borderRadius: "8px",
    padding: "9px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default CategoryManagement;
