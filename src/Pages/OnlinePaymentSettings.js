import React, {
  useEffect,
  useRef,
  useState,
} from "react";

const API_BASE_URL =
  "https://vanyabackenddatabase-vahr.onrender.com";

const OnlinePaymentSettings = () => {
  const fileInputRef = useRef(null);

  const [upiId, setUpiId] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  /*
  ================================================
  LOAD EXISTING QR
  ================================================
  */

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/scanqr/settings`
      );

      const data = await response.json();

      if (data.success && data.settings) {
        setQrImage(
          data.settings.qr_image_url
        );

        setUpiId(
          data.settings.upi_id || ""
        );
      }
    } catch (error) {
      console.error(
        "Load payment settings error:",
        error
      );

      alert(
        "Unable to load payment settings"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ================================================
  SELECT QR
  ================================================
  */

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "QR image must be less than 5 MB"
      );
      return;
    }

    setSelectedFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setQrImage(previewUrl);
  };

  /*
  ================================================
  SAVE QR
  ================================================
  */

  const handleSave = async () => {
    if (!selectedFile) {
      alert(
        "Please select a QR image"
      );

      return;
    }

    try {
      setSaving(true);

      const formData =
        new FormData();

      formData.append(
        "qrImage",
        selectedFile
      );

      formData.append(
        "upiId",
        upiId
      );

      const response =
        await fetch(
          `${API_BASE_URL}/scanqr/add`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save QR"
        );
      }

      setQrImage(
        data.qrImageUrl
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      alert(
        "Payment QR saved successfully"
      );
    } catch (error) {
      console.error(
        "Save QR error:",
        error
      );

      alert(
        error.message ||
          "Failed to save QR"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <h2>
        Online Payment Settings
      </h2>

      <p>
        Upload the UPI QR scanner that
        customers will use for online
        payments.
      </p>

      {/* UPI ID */}

      <div
        style={{
          marginTop: 20,
        }}
      >
        <label>
          UPI ID
        </label>

        <input
          type="text"
          value={upiId}
          onChange={(e) =>
            setUpiId(e.target.value)
          }
          placeholder="example@upi"
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            border:
              "1px solid #ccc",
            borderRadius: 6,
          }}
        />
      </div>

      {/* QR */}

      <div
        style={{
          marginTop: 25,
        }}
      >
        <label>
          Payment QR Scanner
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={
            handleFileChange
          }
          style={{
            display: "block",
            marginTop: 10,
          }}
        />
      </div>

      {/* Preview */}

      {loading ? (
        <p>
          Loading payment settings...
        </p>
      ) : qrImage ? (
        <div
          style={{
            marginTop: 25,
            padding: 20,
            border:
              "1px solid #ddd",
            borderRadius: 10,
            textAlign: "center",
          }}
        >
          <h4>
            QR Preview
          </h4>

          <img
            src={qrImage}
            alt="Payment QR"
            style={{
              width: 280,
              height: 280,
              objectFit: "contain",
              border:
                "1px solid #ddd",
            }}
          />

          {upiId && (
            <p>
              UPI ID:{" "}
              <strong>
                {upiId}
              </strong>
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            marginTop: 25,
            padding: 40,
            textAlign: "center",
            border:
              "1px dashed #aaa",
            borderRadius: 10,
          }}
        >
          No QR uploaded
        </div>
      )}

      {/* SAVE */}

      <button
        onClick={handleSave}
        disabled={
          saving || !selectedFile
        }
        style={{
          marginTop: 25,
          padding:
            "12px 25px",
          border: "none",
          borderRadius: 6,
          cursor:
            saving ||
            !selectedFile
              ? "not-allowed"
              : "pointer",
          opacity:
            saving ||
            !selectedFile
              ? 0.6
              : 1,
        }}
      >
        {saving
          ? "Saving..."
          : "Save Payment QR"}
      </button>
    </div>
  );
};

export default OnlinePaymentSettings;