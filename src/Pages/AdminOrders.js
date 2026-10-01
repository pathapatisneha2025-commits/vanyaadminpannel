
import React, { useEffect, useState } from "react";

const API_BASE_URL =
  "https://vanyabackenddatabase-vahr.onrender.com";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);

  // ============================
  // FETCH ORDERS
  // ============================
  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/orders/all`);

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      // Supports both:
      // [ ...orders ]
      // { orders: [ ...orders ] }
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ============================
  // APPROVE PAYMENT
  // ============================
  const approvePayment = async (order) => {
    if (
      !window.confirm(
        `Approve payment of ₹${parseFloat(
          order.total_amount
        ).toLocaleString()} for Order #${order.id}?`
      )
    ) {
      return;
    }

    setProcessingPayment(order.id);

    try {
      const res = await fetch(
        `${API_BASE_URL}/orders/payment/approve/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_status: "verified",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to approve payment");
      }

      alert(data.message || "Payment approved successfully");

      await fetchOrders();

      if (selectedOrder?.id === order.id) {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to approve payment");
    } finally {
      setProcessingPayment(null);
    }
  };

  // ============================
  // REJECT PAYMENT
  // ============================
  const rejectPayment = async (order) => {
    const reason = window.prompt(
      "Enter reason for rejecting this payment:"
    );

    if (reason === null) {
      return;
    }

    if (!reason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    setProcessingPayment(order.id);

    try {
      const res = await fetch(
        `${API_BASE_URL}/orders/payment/reject/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_status: "rejected",
            payment_rejected_reason: reason.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reject payment");
      }

      alert(data.message || "Payment rejected successfully");

      await fetchOrders();

      if (selectedOrder?.id === order.id) {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to reject payment");
    } finally {
      setProcessingPayment(null);
    }
  };
const infoCardStyle = {
  background: "#fafafa",
  border: "1px solid #eee",
  borderRadius: 9,
  padding: "12px 14px",
  boxSizing: "border-box",
  minWidth: 0,
};

const infoLabelStyle = {
  fontSize: 11,
  color: "#777",
  fontWeight: 600,
  textTransform: "uppercase",
  marginBottom: 5,
};

const infoValueStyle = {
  fontSize: 14,
  color: "#222",
  fontWeight: 500,
};

const modalTableHeader = {
  padding: "11px 10px",
  textAlign: "left",
  fontSize: 12,
  whiteSpace: "nowrap",
};

const modalTableCell = {
  padding: "12px 10px",
  borderTop: "1px solid #eee",
  verticalAlign: "middle",
};
  // ============================
  // DELETE ORDER
  // ============================
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/orders/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      const data = await res.json();

      alert(data.message || "Order deleted");

      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  // ============================
  // FORMAT ITEMS
  // ============================
  const formatItems = (items) => {
    if (!items || items.length === 0) {
      return "No items";
    }

    return items
      .map((item) => `${item.name} (${item.quantity})`)
      .join(", ");
  };

  // ============================
  // PAYMENT STATUS
  // ============================
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "verified":
        return {
          background: "#d4edda",
          color: "#155724",
        };

      case "rejected":
        return {
          background: "#f8d7da",
          color: "#721c24",
        };

      default:
        return {
          background: "#fff3cd",
          color: "#856404",
        };
    }
  };

  // ============================
  // SCREENSHOT URL
  // ============================
  const getPaymentScreenshot = (order) => {
    return (
      order.payment_screenshot ||
      order.payment_screenshot_url ||
      null
    );
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Inter, sans-serif",
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontFamily: "Playfair Display, serif",
          color: "#063b2a",
          marginBottom: 30,
        }}
      >
        Admin Orders Panel
      </h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "auto",
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 1300,
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead
              style={{
                background: "#063b2a",
                color: "#fff",
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Items</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Payment Screenshot</th>
                <th style={thStyle}>Payment Status</th>
                <th style={thStyle}>Actions</th>
                <th style={thStyle}>View</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const screenshot = getPaymentScreenshot(order);

                const isPending =
                  order.payment_status === "pending" ||
                  order.order_status === "payment_pending";

                const isProcessing =
                  processingPayment === order.id;

                return (
                  <tr
                    key={order.id}
                    style={{
                      background: "#fff",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {/* ORDER ID */}
                    <td style={tdStyle}>
                      <strong>#{order.id}</strong>
                    </td>

                    {/* USER */}
                    <td style={tdStyle}>
                      <div>
                        <strong>{order.full_name}</strong>
                      </div>

                      <div
                        style={{
                          color: "#666",
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        {order.email}
                      </div>

                      <div
                        style={{
                          color: "#666",
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        {order.phone}
                      </div>
                    </td>

                    {/* ADDRESS */}
                    <td style={tdStyle}>
                      {order.address}, {order.city},{" "}
                      {order.state} - {order.pin_code}
                    </td>

                    {/* ITEMS */}
                    <td style={tdStyle}>
                      {formatItems(order.items)}
                    </td>

                    {/* TOTAL */}
                    <td style={tdStyle}>
                      <strong>
                        ₹
                        {parseFloat(
                          order.total_amount
                        ).toLocaleString()}
                      </strong>
                    </td>

                    {/* DATE */}
                    <td style={tdStyle}>
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString()
                        : "-"}
                    </td>

                    {/* PAYMENT SCREENSHOT */}
                    <td style={tdStyle}>
                      {screenshot ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <img
                            src={screenshot}
                            alt="Payment Screenshot"
                            onClick={() =>
                              setPreviewImage(screenshot)
                            }
                            style={{
                              width: 80,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 8,
                              border:
                                "2px solid #063b2a",
                              cursor: "pointer",
                            }}
                          />

                          <button
                            onClick={() =>
                              setPreviewImage(screenshot)
                            }
                            style={{
                              padding: "4px 8px",
                              border: "none",
                              borderRadius: 5,
                              background: "#063b2a",
                              color: "#fff",
                              cursor: "pointer",
                              fontSize: 11,
                            }}
                          >
                            View
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            color: "#999",
                            fontSize: 12,
                          }}
                        >
                          No Screenshot
                        </span>
                      )}
                    </td>

                    {/* PAYMENT STATUS */}
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 20,
                          fontWeight: "bold",
                          fontSize: 12,
                          textTransform: "capitalize",
                          ...getPaymentStatusStyle(
                            order.payment_status
                          ),
                        }}
                      >
                        {order.payment_status || "pending"}
                      </span>

                      {order.payment_rejected_reason && (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 11,
                            color: "#721c24",
                            maxWidth: 150,
                          }}
                        >
                          Reason:{" "}
                          {order.payment_rejected_reason}
                        </div>
                      )}
                    </td>

                    {/* APPROVE / REJECT */}
                    <td style={tdStyle}>
                      {isPending ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 7,
                          }}
                        >
                          <button
                            disabled={
                              isProcessing ||
                              !screenshot
                            }
                            onClick={() =>
                              approvePayment(order)
                            }
                            style={{
                              padding: "8px 14px",
                              background:
                                isProcessing ||
                                !screenshot
                                  ? "#aaa"
                                  : "#198754",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              cursor:
                                isProcessing ||
                                !screenshot
                                  ? "not-allowed"
                                  : "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            {isProcessing
                              ? "Processing..."
                              : "✓ Approve"}
                          </button>

                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              rejectPayment(order)
                            }
                            style={{
                              padding: "8px 14px",
                              background: isProcessing
                                ? "#aaa"
                                : "#dc3545",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              cursor: isProcessing
                                ? "not-allowed"
                                : "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            color: "#777",
                            fontSize: 12,
                          }}
                        >
                          Already processed
                        </span>
                      )}
                    </td>

                    {/* VIEW */}
                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        style={{
                          padding: "7px 14px",
                          background: "#063b2a",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================
          PAYMENT SCREENSHOT FULL PREVIEW
      ===================================== */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: 30,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: "absolute",
                right: -15,
                top: -15,
                width: 35,
                height: 35,
                borderRadius: "50%",
                border: "none",
                background: "#ff5252",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              X
            </button>

            <img
              src={previewImage}
              alt="Payment Screenshot Full"
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: 10,
                background: "#fff",
                padding: 5,
              }}
            />
          </div>
        </div>
      )}

      {/* =====================================
          ORDER DETAILS MODAL
      ===================================== */}
     {/* =====================================
    ORDER DETAILS MODAL
===================================== */}
{selectedOrder && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "15px",
      boxSizing: "border-box",
    }}
    onClick={() => setSelectedOrder(null)}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "900px",
        maxHeight: "92vh",
        overflowY: "auto",
        position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          padding: "18px 22px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#777",
              marginBottom: 4,
              letterSpacing: 0.5,
            }}
          >
            ORDER DETAILS
          </div>

          <h2
            style={{
              margin: 0,
              color: "#063b2a",
              fontSize: 22,
            }}
          >
            Order #{selectedOrder.id}
          </h2>
        </div>

        <button
          onClick={() => setSelectedOrder(null)}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#f1f1f1",
            color: "#333",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div
        style={{
          padding: "22px",
        }}
      >
        {/* ============================
            CUSTOMER INFORMATION
        ============================ */}

        <h3
          style={{
            color: "#063b2a",
            margin: "0 0 15px",
            fontSize: 17,
          }}
        >
          Customer Information
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginBottom: 25,
          }}
        >
          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Full Name</div>
            <div style={infoValueStyle}>
              {selectedOrder.full_name || "-"}
            </div>
          </div>

          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Email</div>
            <div
              style={{
                ...infoValueStyle,
                wordBreak: "break-word",
              }}
            >
              {selectedOrder.email || "-"}
            </div>
          </div>

          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>Phone</div>
            <div style={infoValueStyle}>
              {selectedOrder.phone || "-"}
            </div>
          </div>

          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>
              Payment Method
            </div>

            <div
              style={{
                ...infoValueStyle,
                textTransform: "capitalize",
              }}
            >
              {selectedOrder.payment_method || "-"}
            </div>
          </div>

          <div
            style={{
              ...infoCardStyle,
              gridColumn: "1 / -1",
            }}
          >
            <div style={infoLabelStyle}>
              Delivery Address
            </div>

            <div
              style={{
                ...infoValueStyle,
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {selectedOrder.address || "-"}

              {selectedOrder.city
                ? `, ${selectedOrder.city}`
                : ""}

              {selectedOrder.state
                ? `, ${selectedOrder.state}`
                : ""}

              {selectedOrder.pin_code
                ? ` - ${selectedOrder.pin_code}`
                : ""}
            </div>
          </div>
        </div>

        {/* ============================
            PAYMENT INFORMATION
        ============================ */}

        <h3
          style={{
            color: "#063b2a",
            margin: "0 0 15px",
            fontSize: 17,
          }}
        >
          Payment Information
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 25,
          }}
        >
          {/* TOTAL */}
          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>
              Total Amount
            </div>

            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#063b2a",
              }}
            >
              ₹
              {parseFloat(
                selectedOrder.total_amount || 0
              ).toLocaleString("en-IN")}
            </div>
          </div>

          {/* STATUS */}
          <div style={infoCardStyle}>
            <div style={infoLabelStyle}>
              Payment Status
            </div>

            <div style={{ marginTop: 5 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontWeight: "bold",
                  fontSize: 12,
                  textTransform: "capitalize",
                  ...getPaymentStatusStyle(
                    selectedOrder.payment_status
                  ),
                }}
              >
                {selectedOrder.payment_status ||
                  "pending"}
              </span>
            </div>
          </div>

          {/* SUBMITTED */}
          {selectedOrder.payment_submitted_at && (
            <div style={infoCardStyle}>
              <div style={infoLabelStyle}>
                Payment Submitted
              </div>

              <div style={infoValueStyle}>
                {new Date(
                  selectedOrder.payment_submitted_at
                ).toLocaleString()}
              </div>
            </div>
          )}

          {/* VERIFIED */}
          {selectedOrder.payment_verified_at && (
            <div style={infoCardStyle}>
              <div style={infoLabelStyle}>
                Payment Verified
              </div>

              <div style={infoValueStyle}>
                {new Date(
                  selectedOrder.payment_verified_at
                ).toLocaleString()}
              </div>
            </div>
          )}

          {/* REJECTED */}
          {selectedOrder.payment_rejected_reason && (
            <div
              style={{
                ...infoCardStyle,
                gridColumn: "1 / -1",
                background: "#fff5f5",
                border: "1px solid #f5c2c7",
              }}
            >
              <div
                style={{
                  ...infoLabelStyle,
                  color: "#dc3545",
                }}
              >
                Rejection Reason
              </div>

              <div
                style={{
                  ...infoValueStyle,
                  color: "#dc3545",
                }}
              >
                {selectedOrder.payment_rejected_reason}
              </div>
            </div>
          )}
        </div>

        {/* ============================
            PAYMENT SCREENSHOT
        ============================ */}

        <h3
          style={{
            color: "#063b2a",
            margin: "0 0 15px",
            fontSize: 17,
          }}
        >
          Payment Screenshot
        </h3>

        {getPaymentScreenshot(selectedOrder) ? (
          <div
            style={{
              background: "#f8f8f8",
              borderRadius: 12,
              padding: 18,
              marginBottom: 25,
              textAlign: "center",
              border: "1px solid #eee",
            }}
          >
            <img
              src={getPaymentScreenshot(selectedOrder)}
              alt="Payment Screenshot"
              onClick={() =>
                setPreviewImage(
                  getPaymentScreenshot(selectedOrder)
                )
              }
              style={{
                width: "100%",
                maxWidth: 320,
                height: 320,
                objectFit: "contain",
                borderRadius: 8,
                cursor: "pointer",
                background: "#fff",
                border: "1px solid #ddd",
              }}
            />

            <br />

            <button
              onClick={() =>
                setPreviewImage(
                  getPaymentScreenshot(selectedOrder)
                )
              }
              style={{
                marginTop: 12,
                padding: "9px 18px",
                background: "#063b2a",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              View Full Screenshot
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: 18,
              background: "#f8f8f8",
              borderRadius: 10,
              color: "#999",
              textAlign: "center",
              marginBottom: 25,
            }}
          >
            No payment screenshot uploaded.
          </div>
        )}

        {/* ============================
            PAYMENT ACTIONS
        ============================ */}

        {(selectedOrder.payment_status === "pending" ||
          selectedOrder.order_status ===
            "payment_pending") && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            <button
              disabled={
                processingPayment ===
                  selectedOrder.id ||
                !getPaymentScreenshot(selectedOrder)
              }
              onClick={() =>
                approvePayment(selectedOrder)
              }
              style={{
                flex: "1 1 200px",
                padding: "12px 18px",
                background:
                  processingPayment ===
                    selectedOrder.id ||
                  !getPaymentScreenshot(selectedOrder)
                    ? "#aaa"
                    : "#198754",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor:
                  processingPayment ===
                    selectedOrder.id ||
                  !getPaymentScreenshot(selectedOrder)
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "bold",
              }}
            >
              {processingPayment === selectedOrder.id
                ? "Processing..."
                : "✓ Approve Payment"}
            </button>

            <button
              disabled={
                processingPayment === selectedOrder.id
              }
              onClick={() =>
                rejectPayment(selectedOrder)
              }
              style={{
                flex: "1 1 200px",
                padding: "12px 18px",
                background:
                  processingPayment === selectedOrder.id
                    ? "#aaa"
                    : "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor:
                  processingPayment === selectedOrder.id
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "bold",
              }}
            >
              ✕ Reject Payment
            </button>
          </div>
        )}

        {/* ============================
            ORDER ITEMS
        ============================ */}

        <h3
          style={{
            color: "#063b2a",
            margin: "0 0 15px",
            fontSize: 17,
          }}
        >
          Order Items
        </h3>

        {selectedOrder.items &&
        selectedOrder.items.length > 0 ? (
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              overflowX: "auto",
              marginBottom: 25,
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 650,
                borderCollapse: "collapse",
              }}
            >
              <thead
                style={{
                  background: "#063b2a",
                  color: "#fff",
                }}
              >
                <tr>
                  <th style={modalTableHeader}>
                    Image
                  </th>

                  <th style={modalTableHeader}>
                    Product
                  </th>

                  <th style={modalTableHeader}>
                    Quantity
                  </th>

                  <th style={modalTableHeader}>
                    Price
                  </th>

                  <th style={modalTableHeader}>
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedOrder.items.map(
                  (item, index) => (
                    <tr key={item.product_id || index}>
                      {/* IMAGE */}
                      <td style={modalTableCell}>
                        <img
                          src={
                            item.img_url ||
                            item.image ||
                            item.mainImage
                          }
                          alt={item.name}
                          style={{
                            width: 60,
                            height: 75,
                            objectFit: "cover",
                            borderRadius: 7,
                            border: "1px solid #ddd",
                          }}
                        />
                      </td>

                      {/* PRODUCT */}
                      <td style={modalTableCell}>
                        <strong>
                          {item.name}
                        </strong>

                        {item.category && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#777",
                              marginTop: 4,
                            }}
                          >
                            {item.category}
                          </div>
                        )}

                        {item.sub_category && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#777",
                              marginTop: 2,
                            }}
                          >
                            {item.sub_category}
                          </div>
                        )}

                        {/* VARIANT */}
                        {item.variant &&
                          typeof item.variant ===
                            "object" &&
                          Object.keys(item.variant)
                            .length > 0 && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 11,
                                color: "#555",
                              }}
                            >
                              {item.variant.colour && (
                                <div>
                                  Colour:{" "}
                                  <strong>
                                    {
                                      item.variant
                                        .colour
                                    }
                                  </strong>
                                </div>
                              )}

                              {item.variant.size && (
                                <div>
                                  Size:{" "}
                                  <strong>
                                    {
                                      item.variant
                                        .size
                                    }
                                  </strong>
                                </div>
                              )}
                            </div>
                          )}
                      </td>

                      {/* QUANTITY */}
                      <td style={modalTableCell}>
                        {item.quantity}
                      </td>

                      {/* PRICE */}
                      <td style={modalTableCell}>
                        ₹
                        {parseFloat(
                          item.price || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* SUBTOTAL */}
                      <td
                        style={{
                          ...modalTableCell,
                          fontWeight: "bold",
                          color: "#063b2a",
                        }}
                      >
                        ₹
                        {parseFloat(
                          item.subtotal ||
                            Number(item.price || 0) *
                              Number(
                                item.quantity || 0
                              )
                        ).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              background: "#f8f8f8",
              borderRadius: 10,
              color: "#777",
              marginBottom: 25,
            }}
          >
            No items found.
          </div>
        )}

        {/* ============================
            DELETE
        ============================ */}

        <button
          onClick={() =>
            deleteOrder(selectedOrder.id)
          }
          style={{
            width: "100%",
            padding: "12px 20px",
            background: "#fff",
            color: "#dc3545",
            border: "1px solid #dc3545",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Delete Order
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// ============================
// STYLES
// ============================

const thStyle = {
  border: "1px solid #ddd",
  padding: 10,
  textAlign: "left",
  whiteSpace: "nowrap",
};

const thStyleDark = {
  border: "1px solid #ddd",
  padding: 8,
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: 10,
  verticalAlign: "middle",
};

const modalLabelStyle = {
  padding: 8,
  fontWeight: "bold",
  width: "30%",
  borderBottom: "1px solid #eee",
};

const modalValueStyle = {
  padding: 8,
  borderBottom: "1px solid #eee",
};

export default AdminOrders;
