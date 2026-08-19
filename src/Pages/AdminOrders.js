
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
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: 20,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              width: "900px",
              maxWidth: "95%",
              maxHeight: "90%",
              overflowY: "auto",
              padding: 30,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                background: "#ff5252",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              X
            </button>

            <h2
              style={{
                marginBottom: 20,
                color: "#063b2a",
              }}
            >
              Order Details (ID: #{selectedOrder.id})
            </h2>

            {/* ORDER INFORMATION */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 25,
              }}
            >
              <tbody>
                <tr>
                  <td style={modalLabelStyle}>
                    Full Name
                  </td>
                  <td style={modalValueStyle}>
                    {selectedOrder.full_name}
                  </td>
                </tr>

                <tr>
                  <td style={modalLabelStyle}>Email</td>
                  <td style={modalValueStyle}>
                    {selectedOrder.email}
                  </td>
                </tr>

                <tr>
                  <td style={modalLabelStyle}>Phone</td>
                  <td style={modalValueStyle}>
                    {selectedOrder.phone}
                  </td>
                </tr>

                <tr>
                  <td style={modalLabelStyle}>
                    Address
                  </td>
                  <td style={modalValueStyle}>
                    {selectedOrder.address},{" "}
                    {selectedOrder.city},{" "}
                    {selectedOrder.state} -{" "}
                    {selectedOrder.pin_code}
                  </td>
                </tr>

                <tr>
                  <td style={modalLabelStyle}>
                    Payment Method
                  </td>
                  <td style={modalValueStyle}>
                    {selectedOrder.payment_method}
                  </td>
                </tr>

                <tr>
                  <td style={modalLabelStyle}>
                    Total Amount
                  </td>
                  <td style={modalValueStyle}>
                    <strong>
                      ₹
                      {parseFloat(
                        selectedOrder.total_amount
                      ).toLocaleString()}
                    </strong>
                  </td>
                </tr>

                <tr>
                  <td style={modalLabelStyle}>
                    Payment Status
                  </td>
                  <td style={modalValueStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        ...getPaymentStatusStyle(
                          selectedOrder.payment_status
                        ),
                      }}
                    >
                      {selectedOrder.payment_status ||
                        "pending"}
                    </span>
                  </td>
                </tr>

                {selectedOrder.payment_submitted_at && (
                  <tr>
                    <td style={modalLabelStyle}>
                      Payment Submitted
                    </td>
                    <td style={modalValueStyle}>
                      {new Date(
                        selectedOrder.payment_submitted_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                )}

                {selectedOrder.payment_verified_at && (
                  <tr>
                    <td style={modalLabelStyle}>
                      Payment Verified
                    </td>
                    <td style={modalValueStyle}>
                      {new Date(
                        selectedOrder.payment_verified_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                )}

                {selectedOrder.payment_rejected_reason && (
                  <tr>
                    <td
                      style={{
                        ...modalLabelStyle,
                        color: "#dc3545",
                      }}
                    >
                      Rejection Reason
                    </td>
                    <td
                      style={{
                        ...modalValueStyle,
                        color: "#dc3545",
                      }}
                    >
                      {
                        selectedOrder.payment_rejected_reason
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* =================================
                PAYMENT SCREENSHOT
            ================================= */}
            <h3
              style={{
                marginBottom: 12,
                color: "#063b2a",
              }}
            >
              Payment Screenshot
            </h3>

            {getPaymentScreenshot(selectedOrder) ? (
              <div
                style={{
                  marginBottom: 25,
                  textAlign: "center",
                  background: "#f8f8f8",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <img
                  src={getPaymentScreenshot(
                    selectedOrder
                  )}
                  alt="Payment Screenshot"
                  onClick={() =>
                    setPreviewImage(
                      getPaymentScreenshot(
                        selectedOrder
                      )
                    )
                  }
                  style={{
                    maxWidth: 350,
                    maxHeight: 450,
                    objectFit: "contain",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "1px solid #ddd",
                  }}
                />

                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() =>
                      setPreviewImage(
                        getPaymentScreenshot(
                          selectedOrder
                        )
                      )
                    }
                    style={{
                      padding: "8px 18px",
                      background: "#063b2a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    View Full Screenshot
                  </button>
                </div>
              </div>
            ) : (
              <p
                style={{
                  color: "#999",
                  marginBottom: 25,
                }}
              >
                No payment screenshot uploaded.
              </p>
            )}

            {/* =================================
                PAYMENT ACTIONS
            ================================= */}
            {(selectedOrder.payment_status ===
              "pending" ||
              selectedOrder.order_status ===
                "payment_pending") && (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 25,
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
                    padding: "12px 25px",
                    background:
                      processingPayment ===
                        selectedOrder.id ||
                      !getPaymentScreenshot(
                        selectedOrder
                      )
                        ? "#aaa"
                        : "#198754",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor:
                      processingPayment ===
                        selectedOrder.id ||
                      !getPaymentScreenshot(
                        selectedOrder
                      )
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✓ Approve Payment
                </button>

                <button
                  disabled={
                    processingPayment ===
                    selectedOrder.id
                  }
                  onClick={() =>
                    rejectPayment(selectedOrder)
                  }
                  style={{
                    padding: "12px 25px",
                    background:
                      processingPayment ===
                      selectedOrder.id
                        ? "#aaa"
                        : "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor:
                      processingPayment ===
                      selectedOrder.id
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✕ Reject Payment
                </button>
              </div>
            )}

            {/* =================================
                ITEMS
            ================================= */}
            <h3
              style={{
                marginBottom: 10,
                color: "#063b2a",
              }}
            >
              Items
            </h3>

            {selectedOrder.items &&
            selectedOrder.items.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead
                  style={{
                    background: "#f0f0f0",
                  }}
                >
                  <tr>
                    <th style={thStyleDark}>
                      Image
                    </th>
                    <th style={thStyleDark}>
                      Product
                    </th>
                    <th style={thStyleDark}>
                      Quantity
                    </th>
                    <th style={thStyleDark}>
                      Price
                    </th>
                    <th style={thStyleDark}>
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.items.map(
                    (item, index) => (
                      <tr
                        key={
                          item.product_id || index
                        }
                      >
                        <td style={tdStyle}>
                          <img
                            src={item.img_url}
                            alt={item.name}
                            style={{
                              width: 70,
                              height: 90,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            {item.name}
                          </strong>

                          <div
                            style={{
                              fontSize: 11,
                              color: "#777",
                              marginTop: 3,
                            }}
                          >
                            {item.category}
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: "#777",
                            }}
                          >
                            {item.sub_category}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          {item.quantity}
                        </td>

                        <td style={tdStyle}>
                          ₹
                          {parseFloat(
                            item.price
                          ).toLocaleString()}
                        </td>

                        <td style={tdStyle}>
                          ₹
                          {parseFloat(
                            item.subtotal ||
                              item.price *
                                item.quantity
                          ).toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No items</p>
            )}

            {/* DELETE */}
            <button
              onClick={() =>
                deleteOrder(selectedOrder.id)
              }
              style={{
                marginTop: 25,
                padding: "12px 25px",
                background: "#ff5252",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
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
