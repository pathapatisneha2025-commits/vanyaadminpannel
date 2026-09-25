
import React, { useEffect, useState } from "react";

const BANNER_API =
  "https://vanyabackenddatabase-vahr.onrender.com/banner";

const BannerManagement = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");

  const [bannerExists, setBannerExists] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // LOAD BANNER
  // GET /banner/all
  // =====================================================

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      setMessage("");

      const apiUrl =
        `${BANNER_API}/all`;

      console.log(
        "GET BANNER API:",
        apiUrl
      );

      const response =
        await fetch(apiUrl);

      // =================================================
      // NO BANNER
      // =================================================

      if (response.status === 404) {
        setBannerExists(false);
        setImagePreview("");
        setDescription("");
        setImageFile(null);

        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          "Failed to fetch banner"
        );
      }

      // =================================================
      // RESPONSE
      // =================================================

      const data =
        await response.json();

      console.log(
        "GET BANNER RESPONSE:",
        data
      );

      // =================================================
      // SUPPORT DIFFERENT RESPONSE FORMATS
      // =================================================

      let banner;

      if (Array.isArray(data)) {
        banner = data[0];
      } else {
        banner =
          data.banner || data;
      }

      // =================================================
      // BANNER FOUND
      // =================================================

      if (
        banner &&
        (
          banner.image_url ||
          banner.description
        )
      ) {
        setBannerExists(true);

        setImagePreview(
          banner.image_url || ""
        );

        setDescription(
          banner.description || ""
        );
      }

      // =================================================
      // NO BANNER
      // =================================================

      else {
        setBannerExists(false);

        setImagePreview("");
        setDescription("");
      }

      setImageFile(null);

    } catch (error) {
      console.error(
        "Fetch banner error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to load banner"
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SELECT IMAGE
  // NO TYPE LIMIT
  // NO SIZE LIMIT
  // =====================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    // =================================================
    // NO IMAGE TYPE VALIDATION
    // NO IMAGE SIZE VALIDATION
    // =================================================

    setImageFile(file);

    // =================================================
    // CREATE PREVIEW
    // =================================================

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setMessage("");
    setMessageType("");
  };

  // =====================================================
  // REMOVE SELECTED NEW IMAGE
  // =====================================================

  const handleRemoveImage = async () => {
    setImageFile(null);

    await fetchBanner();
  };

  // =====================================================
  // ADD BANNER
  // POST /banner/add
  // =====================================================

  const handleAddBanner = async () => {
    try {
      setSaving(true);
      setMessage("");
      setMessageType("");

      // =================================================
      // DESCRIPTION VALIDATION
      // =================================================

      if (!description.trim()) {
        setMessage(
          "Please enter a banner description."
        );

        setMessageType("error");
        setSaving(false);

        return;
      }

      // =================================================
      // IMAGE REQUIRED
      // =================================================

      if (!imageFile) {
        setMessage(
          "Please select a banner image."
        );

        setMessageType("error");
        setSaving(false);

        return;
      }

      // =================================================
      // FORM DATA
      // =================================================

      const formData =
        new FormData();

      formData.append(
        "image",
        imageFile
      );

      formData.append(
        "description",
        description.trim()
      );

      setMessage(
        "Uploading banner image and adding..."
      );

      setMessageType("info");

      // =================================================
      // ADD API
      // =================================================

      const addUrl =
        `${BANNER_API}/add`;

      console.log(
        "ADD BANNER API:",
        addUrl
      );

      const response =
        await fetch(
          addUrl,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "ADD BANNER RESPONSE:",
        data
      );

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add banner"
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Banner added successfully!"
      );

      setMessageType("success");

      setImageFile(null);

      setBannerExists(true);

      // Reload banner
      await fetchBanner();

    } catch (error) {
      console.error(
        "Add banner error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to add banner"
      );

      setMessageType("error");

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UPDATE BANNER
  // PUT /banner/update
  // =====================================================

  const handleUpdateBanner = async () => {
    try {
      setSaving(true);
      setMessage("");
      setMessageType("");

      // =================================================
      // DESCRIPTION VALIDATION
      // =================================================

      if (!description.trim()) {
        setMessage(
          "Please enter a banner description."
        );

        setMessageType("error");
        setSaving(false);

        return;
      }

      // =================================================
      // FORM DATA
      // =================================================

      const formData =
        new FormData();

      // Image optional during update
      if (imageFile) {
        formData.append(
          "image",
          imageFile
        );
      }

      formData.append(
        "description",
        description.trim()
      );

      // =================================================
      // MESSAGE
      // =================================================

      if (imageFile) {
        setMessage(
          "Uploading new banner image and updating..."
        );
      } else {
        setMessage(
          "Updating banner description..."
        );
      }

      setMessageType("info");

      // =================================================
      // UPDATE API
      // =================================================

      const updateUrl =
        `${BANNER_API}/update`;

      console.log(
        "UPDATE BANNER API:",
        updateUrl
      );

      const response =
        await fetch(
          updateUrl,
          {
            method: "PUT",
            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "UPDATE BANNER RESPONSE:",
        data
      );

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update banner"
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Banner updated successfully!"
      );

      setMessageType("success");

      setImageFile(null);

      setBannerExists(true);

      // Reload banner
      await fetchBanner();

    } catch (error) {
      console.error(
        "Update banner error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to update banner"
      );

      setMessageType("error");

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // ADD OR UPDATE
  // =====================================================

  const handleSaveBanner = () => {
    if (bannerExists) {
      handleUpdateBanner();
    } else {
      handleAddBanner();
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loader}></div>

        <p>
          Loading Banner...
        </p>
      </div>
    );
  }

  // =====================================================
  // BUTTON TEXT
  // =====================================================

  const buttonText = saving
    ? bannerExists
      ? "UPDATING..."
      : "ADDING..."
    : bannerExists
    ? "UPDATE BANNER"
    : "ADD BANNER";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Hero Banner
          </h1>

          <p style={styles.subtitle}>
            Manage your homepage hero banner
          </p>
        </div>

        {/* STATUS */}

        <div
          style={{
            ...styles.statusBadge,

            ...(bannerExists
              ? styles.activeBadge
              : styles.emptyBadge),
          }}
        >
          {bannerExists
            ? "● Banner Active"
            : "○ No Banner Added"}
        </div>

      </div>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div
          style={{
            ...styles.message,

            ...(messageType === "success"
              ? styles.successMessage
              : messageType === "error"
              ? styles.errorMessage
              : styles.infoMessage),
          }}
        >
          {message}
        </div>
      )}

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div style={styles.card}>

        {/* =================================================
            BANNER IMAGE
        ================================================= */}

        <div style={styles.section}>

          <label style={styles.label}>
            Banner Image
          </label>

          <p style={styles.helpText}>
            Select the image that will appear
            on your homepage hero section.
          </p>

          {/* =================================================
              UPLOAD BOX
          ================================================= */}

          <label
            style={{
              ...styles.uploadBox,

              ...(saving
                ? styles.uploadBoxDisabled
                : {}),
            }}
          >

            <input
              type="file"
              onChange={handleImageChange}
              style={styles.hiddenInput}
              disabled={saving}
            />

            <div style={styles.uploadIcon}>
              📷
            </div>

            <div style={styles.uploadTitle}>
              Click to select banner image
            </div>

            <div style={styles.uploadText}>
              Select any image
            </div>

          </label>

          {/* =================================================
              BANNER PREVIEW
          ================================================= */}

          {imagePreview && (
            <div style={styles.previewWrapper}>

              <div style={styles.previewHeader}>

                <span style={styles.previewTitle}>
                  Current Banner
                </span>

                {imageFile && (
                  <span
                    style={
                      styles.newImageBadge
                    }
                  >
                    New Image
                  </span>
                )}

              </div>

              <div
                style={
                  styles.previewContainer
                }
              >

                <img
                  src={imagePreview}
                  alt="Hero Banner"
                  style={styles.preview}
                />

              </div>

              {/* =================================================
                  REMOVE SELECTED IMAGE
              ================================================= */}

              {imageFile && (
                <button
                  type="button"
                  onClick={
                    handleRemoveImage
                  }
                  style={
                    styles.removeButton
                  }
                  disabled={saving}
                >
                  ✕ Remove Selected Image
                </button>
              )}

            </div>
          )}

        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div style={styles.section}>

          <label style={styles.label}>
            Hero Description
          </label>

          <p style={styles.helpText}>
            This text will appear below the
            main hero heading.
          </p>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Enter hero section description..."
            rows={6}
            style={styles.textarea}
            disabled={saving}
          />

          <div style={styles.counter}>
            {description.length} characters
          </div>

        </div>

        {/* =================================================
            ADD / UPDATE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={handleSaveBanner}
          disabled={saving}
          style={{
            ...styles.button,

            ...(saving
              ? styles.buttonDisabled
              : {}),
          }}
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  container: {
    padding: "30px",
    background: "#f8f5f0",
    minHeight: "100vh",
  },

  header: {
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    color: "#4B2954",
    fontSize: "30px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#777",
    marginTop: "8px",
    fontSize: "14px",
  },

  statusBadge: {
    padding: "8px 15px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },

  activeBadge: {
    background: "#e5f7eb",
    color: "#1e7e34",
    border: "1px solid #b8e5c3",
  },

  emptyBadge: {
    background: "#fff4cc",
    color: "#856404",
    border: "1px solid #f4d77d",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "1000px",
    boxShadow:
      "0 5px 25px rgba(0,0,0,0.08)",
  },

  section: {
    marginBottom: "35px",
  },

  label: {
    display: "block",
    fontWeight: "700",
    color: "#4B2954",
    marginBottom: "6px",
    fontSize: "17px",
  },

  helpText: {
    color: "#888",
    fontSize: "13px",
    marginTop: "0",
    marginBottom: "15px",
  },

  hiddenInput: {
    display: "none",
  },

  uploadBox: {
    border: "2px dashed #D4AF37",
    borderRadius: "12px",
    padding: "35px 20px",
    textAlign: "center",
    cursor: "pointer",
    display: "block",
    background: "#fffdf7",
    transition: "0.3s",
  },

  uploadBoxDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  uploadIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  uploadTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#4B2954",
  },

  uploadText: {
    fontSize: "12px",
    color: "#999",
    marginTop: "6px",
  },

  previewWrapper: {
    marginTop: "20px",
  },

  previewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  previewTitle: {
    fontWeight: "700",
    color: "#4B2954",
  },

  newImageBadge: {
    background: "#f4c430",
    color: "#2a1236",
    padding: "4px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  previewContainer: {
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #ddd",
    background: "#eee",
  },

  preview: {
    width: "100%",
    maxHeight: "450px",
    objectFit: "cover",
    display: "block",
  },

  removeButton: {
    marginTop: "10px",
    background: "#fff",
    color: "#c0392b",
    border: "1px solid #c0392b",
    padding: "8px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
  },

  textarea: {
    width: "100%",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    resize: "vertical",
    fontSize: "15px",
    lineHeight: "1.6",
    fontFamily: "Arial, sans-serif",
    outline: "none",
    color: "#333",
    boxSizing: "border-box",
  },

  counter: {
    textAlign: "right",
    marginTop: "5px",
    color: "#999",
    fontSize: "12px",
  },

  button: {
    background: "#4B2954",
    color: "#fff",
    border: "none",
    padding: "15px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    letterSpacing: "1px",
    fontSize: "14px",
    minWidth: "180px",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  message: {
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    maxWidth: "1000px",
    fontSize: "14px",
    fontWeight: "600",
  },

  successMessage: {
    background: "#dff5e5",
    color: "#1e7e34",
    border: "1px solid #b8e5c3",
  },

  errorMessage: {
    background: "#fde2e2",
    color: "#c0392b",
    border: "1px solid #f5b7b1",
  },

  infoMessage: {
    background: "#fff4cc",
    color: "#856404",
    border: "1px solid #f4d77d",
  },

  loading: {
    padding: "60px",
    textAlign: "center",
    color: "#4B2954",
  },

  loader: {
    width: "35px",
    height: "35px",
    border: "4px solid #eee",
    borderTop: "4px solid #4B2954",
    borderRadius: "50%",
    margin: "0 auto 15px",
    animation:
      "spin 1s linear infinite",
  },
};

export default BannerManagement;
