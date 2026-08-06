import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddressFormModal from "./AddressFormModal";
import { API_BASE_URL } from "../config";

const ManageAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = sessionStorage.getItem("userEmail") || "";

  // Derive first name from email
  const firstName = userEmail
    ? userEmail.split("@")[0].split(/[._\-]/)[0]
    : "User";

  // Mask email: show first 2 chars + stars + domain
  const maskEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    const visible = local.slice(0, 2);
    const stars = "*".repeat(Math.max(local.length - 2, 4));
    return `${visible}${stars}@${domain}`;
  };

  const [activeSection, setActiveSection] = useState(location.state?.section || "profile");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  // Orders state
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderTab, setOrderTab] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Cancel / Return state
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [returnModalOrderId, setReturnModalOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null); // { msg, type: 'success'|'error' }

  // Review state
  const [userReviews, setUserReviews] = useState([]);
  const [reviewedKeys, setReviewedKeys] = useState([]); // array of orderId_productId strings
  const [reviewModalItem, setReviewModalItem] = useState(null); // { orderId, productId, title, price, image }
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
  }, [location.state]);

  // Fetch saved addresses on load
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setSavedAddresses(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAddresses();
  }, []);

  // Fetch user orders on load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        setLoadingOrders(true);
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUserOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch user reviews on mount
  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const [resRev, resKeys] = await Promise.all([
          fetch(`${API_BASE_URL}/api/reviews/user`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/reviews/user/submitted`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        if (resRev.ok) {
          const dataRev = await resRev.json();
          setUserReviews(dataRev);
        }
        if (resKeys.ok) {
          const dataKeys = await resKeys.json();
          setReviewedKeys(dataKeys);
        }
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
      }
    };
    fetchUserReviews();
  }, []);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Cancel Order ─────────────────────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    if (!confirmed) return;
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUserOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "Cancelled", cancelledAt: new Date().toISOString() } : o));
        showToast("Order cancelled successfully. A confirmation email has been sent.");
      } else {
        showToast(data.message || "Failed to cancel order.", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setActionLoading(false);
      setCancellingOrderId(null);
    }
  };

  // ── Submit Return Request ─────────────────────────────────────────────────────
  const handleReturnRequest = async () => {
    if (!returnReason.trim()) { showToast("Please enter a reason for your return.", "error"); return; }
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${returnModalOrderId}/return`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: returnReason })
      });
      const data = await res.json();
      if (res.ok) {
        setUserOrders(prev => prev.map(o => o._id === returnModalOrderId ? { ...o, status: "Return Requested", returnReason, returnRequestedAt: new Date().toISOString() } : o));
        showToast("Return request submitted! Our team will contact you within 2–3 business days.");
        setReturnModalOrderId(null);
        setReturnReason("");
      } else {
        showToast(data.message || "Failed to submit return.", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Submit Review ────────────────────────────────────────────────────────────
  const handleReviewSubmit = async () => {
    if (!reviewModalItem) return;
    if (!reviewComment.trim()) {
      showToast("Please write a comment for your review.", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productId: String(reviewModalItem.id || reviewModalItem.productId || "1"),
          productTitle: reviewModalItem.title,
          productImage: reviewModalItem.image,
          orderId: reviewModalItem.orderId,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Review submitted successfully! Thank you for your feedback.");
        setUserReviews(prev => [data.review, ...prev]);
        setReviewedKeys(prev => [...prev, `${reviewModalItem.orderId}_${reviewModalItem.id || reviewModalItem.productId || "1"}`]);
        setReviewModalItem(null);
        setReviewComment("");
        setReviewRating(5);
      } else {
        showToast(data.message || "Failed to submit review.", "error");
      }
    } catch (err) {
      showToast("Network error. Failed to submit review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };


  // ── Sidebar items ──────────────────────────────────────────────────────────
  const sidebarSections = [
    {
      heading: "Manage My Account",
      items: [
        { key: "profile",  label: "My Profile" },
        { key: "address",  label: "Address Book" },
        { key: "payment",  label: "My Payment Options" },
        { key: "points",   label: "Points" },
      ],
    },
    {
      heading: "My Orders",
      items: [
        { key: "orders",        label: "My Orders" },
        { key: "returns",       label: "My Returns" },
        { key: "cancellations", label: "My Cancellations" },
      ],
    },
    { heading: "My Reviews",              items: [] },
    { heading: "My Wishlist & Followed Stores", items: [] },
  ];

  // ── Styles ─────────────────────────────────────────────────────────────────
  const page = {
    display: "flex",
    minHeight: "calc(100vh - 135px)",
    backgroundColor: "#27001a",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "30px 5%",
    gap: "30px",
    color: "white",
    flexWrap: "wrap",
    boxSizing: "border-box",
  };

  const sidebar = {
    width: "220px",
    flexShrink: 0,
    minWidth: "180px",
  };

  const greeting = {
    fontSize: "13px",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "6px",
  };

  const greetingName = {
    color: "#d4be82",
    fontWeight: "600",
  };

  const sectionHeading = {
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    marginTop: "20px",
    marginBottom: "6px",
    cursor: "pointer",
    letterSpacing: "0.3px",
  };

  const sidebarLink = (key) => ({
    display: "block",
    fontSize: "13px",
    padding: "5px 0 5px 12px",
    cursor: "pointer",
    color: activeSection === key ? "#d4be82" : "rgba(255,255,255,0.55)",
    fontWeight: activeSection === key ? "500" : "400",
    borderLeft: activeSection === key ? "2px solid #d4be82" : "2px solid transparent",
    transition: "all 0.15s",
  });

  const main = {
    flex: 1,
  };

  const mainTitle = {
    fontSize: "22px",
    fontWeight: "600",
    color: "white",
    marginBottom: "24px",
    letterSpacing: "0.3px",
  };

  const cardsRow = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  };

  const card = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(173,149,81,0.25)",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "140px",
  };

  const cardTitle = {
    fontSize: "15px",
    fontWeight: "600",
    color: "white",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const editBtn = {
    fontSize: "12px",
    color: "#d4be82",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    letterSpacing: "0.5px",
    padding: 0,
    fontFamily: "inherit",
  };

  const addBtn = {
    fontSize: "12px",
    color: "#d4be82",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    letterSpacing: "0.5px",
    padding: 0,
    fontFamily: "inherit",
  };

  const profileName = {
    fontSize: "14px",
    color: "white",
    marginBottom: "6px",
    fontWeight: "500",
  };

  const profileEmail = {
    fontSize: "13px",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "10px",
  };

  const checkboxRow = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.5)",
  };

  const emptyCard = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "rgba(255,255,255,0.3)",
    fontSize: "13px",
  };

  const pinIcon = {
    fontSize: "28px",
    opacity: 0.3,
  };

  const comingSoon = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(173,149,81,0.25)",
    borderRadius: "8px",
    padding: "40px",
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    marginTop: "20px",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={page} className="account-page-wrap">
      <style>{`
        @media (max-width: 650px) {
          .account-page-wrap {
            flex-direction: column !important;
            padding: 20px 4% !important;
          }
          .account-sidebar {
            width: 100% !important;
            min-width: unset !important;
          }
          .account-main {
            width: 100% !important;
          }
          .addr-table-header { display: none !important; }
          .addr-table-row { display: none !important; }
          .addr-mobile-card { display: block !important; }
        }
        @media (min-width: 651px) {
          .addr-mobile-card { display: none !important; }
          .addr-table-header { display: grid !important; }
          .addr-table-row { display: grid !important; }
        }
      `}</style>
      {/* ── Sidebar ── */}
      <aside style={sidebar} className="account-sidebar">
        <p style={greeting}>
          Hello, <span style={greetingName}>{firstName}</span>
        </p>

        {sidebarSections.map((section) => (
          <div key={section.heading}>
            <p
              style={sectionHeading}
              onClick={() => section.items.length === 0 && setActiveSection(section.heading)}
            >
              {section.heading}
            </p>
            {section.items.map((item) => (
              <span
                key={item.key}
                style={sidebarLink(item.key)}
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </span>
            ))}
          </div>
        ))}
      </aside>

      {/* ── Main content ── */}
      <main style={main} className="account-main">
        {/* Personal Profile section */}
        {activeSection === "profile" && (
          <>
            <h2 style={mainTitle}>Manage My Account</h2>
            <div style={cardsRow}>
              {/* Personal Profile card */}
              <div style={card}>
                <div style={cardTitle}>
                  Personal Profile
                  <button style={editBtn}>EDIT</button>
                </div>
                <p style={profileName}>{firstName}</p>
                <p style={profileEmail}>{maskEmail(userEmail)}</p>
                <label style={checkboxRow}>
                  <input type="checkbox" style={{ accentColor: "#d4be82" }} />
                  Receive marketing emails
                </label>
              </div>

              {/* Address Book card â€” Default Shipping */}
              <div style={card}>
                <div style={cardTitle}>
                  Address Book
                  <button style={editBtn} onClick={() => setActiveSection("address")}>EDIT</button>
                </div>
                {savedAddresses.length > 0 ? (() => {
                  const addr = savedAddresses[0];
                  return (
                    <>
                      <p style={{ fontSize: "10px", color: "#d4be82", fontWeight: "600", letterSpacing: "0.8px", marginBottom: "8px", textTransform: "uppercase" }}>
                        Default Shipping Address
                      </p>
                      <p style={{ ...profileName, marginBottom: "4px" }}>{addr.fullName}</p>
                      <p style={{ ...profileEmail, marginBottom: "2px" }}>{addr.addressLine}</p>
                      <p style={{ ...profileEmail, marginBottom: "2px" }}>
                        {[addr.province, addr.district, addr.city].filter(Boolean).join(" Â· ")}
                      </p>
                      <p style={profileEmail}>(+94) {addr.phone}</p>
                    </>
                  );
                })() : (
                  <div style={emptyCard}>
                    <span style={pinIcon}>📍</span>
                    Save your shipping address here.
                  </div>
                )}
              </div>

              {/* Billing card â€” Default Billing */}
              <div style={card}>
                <div style={cardTitle}>&nbsp;</div>
                {savedAddresses.length > 0 ? (() => {
                  const addr = savedAddresses[0];
                  return (
                    <>
                      <p style={{ fontSize: "10px", color: "#d4be82", fontWeight: "600", letterSpacing: "0.8px", marginBottom: "8px", textTransform: "uppercase" }}>
                        Default Billing Address
                      </p>
                      <p style={{ ...profileName, marginBottom: "4px" }}>{addr.fullName}</p>
                      <p style={{ ...profileEmail, marginBottom: "2px" }}>{addr.addressLine}</p>
                      <p style={{ ...profileEmail, marginBottom: "2px" }}>
                        {[addr.province, addr.district, addr.city].filter(Boolean).join(" Â· ")}
                      </p>
                      <p style={profileEmail}>(+94) {addr.phone}</p>
                    </>
                  );
                })() : (
                  <div style={emptyCard}>
                    Save your billing address here.
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Address Book section */}
        {activeSection === "address" && (
          <>
            {/* Title row */}
            <div style={{ flexWrap: "wrap", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", gap: "10px" }}>
              <h2 style={mainTitle}>Address Book</h2>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", color: "#00a99d", cursor: "pointer" }}>Make default shipping address</span>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
                <span style={{ fontSize: "13px", color: "#00a99d", cursor: "pointer" }}>Make default billing address</span>
              </div>
            </div>

            <div style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(173,149,81,0.25)",
              borderRadius: "8px",
              overflow: "hidden",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
            }}>

              {savedAddresses.length > 0 ? (
                <>
                  {/* Table header — hidden on mobile */}
                  <div className="addr-table-header" style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 2fr 1.5fr 1.2fr 1.5fr 80px",
                    padding: "14px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: "500",
                    letterSpacing: "0.3px",
                  }}>
                    <span>Full Name</span>
                    <span>Address</span>
                    <span>Province / District / City</span>
                    <span>Phone Number</span>
                    <span>Status</span>
                    <span></span>
                  </div>

                  {/* Address rows — desktop table / mobile cards */}
                  {savedAddresses.map((addr, idx) => (
                    <>
                      {/* Desktop row */}
                      <div className="addr-table-row" key={addr._id || idx} style={{
                        display: "grid",
                        gridTemplateColumns: "1.2fr 2fr 1.5fr 1.2fr 1.5fr 80px",
                        padding: "18px 24px",
                        borderBottom: idx < savedAddresses.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        alignItems: "center",
                        fontSize: "13px",
                        color: "white",
                      }}>
                        <span style={{ fontWeight: "500" }}>{addr.fullName}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {addr.label && (
                            <span style={{
                              backgroundColor: addr.label === "home" ? "#f97316" : "#3b82f6",
                              color: "white", fontSize: "10px", fontWeight: "700",
                              padding: "2px 8px", borderRadius: "3px",
                              textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0,
                            }}>{addr.label}</span>
                          )}
                          <span style={{ color: "rgba(255,255,255,0.7)" }}>{addr.addressLine}</span>
                        </div>
                        <span style={{ color: "rgba(255,255,255,0.6)" }}>{[addr.province, addr.district, addr.city].filter(Boolean).join(" - ")}</span>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{addr.phone}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Default Shipping Address</span>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Default Billing Address</span>
                        </div>
                        <button onClick={() => { setEditingAddress(addr); setShowAddressModal(true); }}
                          style={{ background: "none", border: "none", color: "#00a99d", fontSize: "13px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.5px", fontFamily: "inherit", padding: 0 }}>
                          EDIT
                        </button>
                      </div>

                      {/* Mobile card */}
                      <div className="addr-mobile-card" key={(addr._id || idx) + "-mobile"} style={{
                        padding: "16px",
                        borderBottom: idx < savedAddresses.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                        fontSize: "13px",
                        color: "white",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {addr.label && (
                              <span style={{
                                backgroundColor: addr.label === "home" ? "#f97316" : "#3b82f6",
                                color: "white", fontSize: "10px", fontWeight: "700",
                                padding: "2px 8px", borderRadius: "3px",
                                textTransform: "uppercase",
                              }}>{addr.label}</span>
                            )}
                            <span style={{ fontWeight: "600" }}>{addr.fullName}</span>
                          </div>
                          <button onClick={() => { setEditingAddress(addr); setShowAddressModal(true); }}
                            style={{ background: "none", border: "none", color: "#00a99d", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                            EDIT
                          </button>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.7)", margin: "4px 0" }}>{addr.addressLine}</p>
                        <p style={{ color: "rgba(255,255,255,0.6)", margin: "4px 0" }}>{[addr.province, addr.district, addr.city].filter(Boolean).join(" - ")}</p>
                        <p style={{ color: "rgba(255,255,255,0.7)", margin: "4px 0" }}>📞 {addr.phone}</p>
                      </div>
                    </>
                  ))}
                </>
              ) : (
                /* Empty state */
                <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "28px" }}>
                      Save your shipping and billing address here.
                    </p>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "22px", opacity: 0.35,
                    }}>📍</div>
                  </div>
                </div>
              )}

              {/* ADD NEW ADDRESS button â€” always visible */}
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 24px" }}>
                <button
                  style={{
                    backgroundColor: "#00a99d", color: "white", border: "none",
                    borderRadius: "4px", padding: "11px 22px", fontSize: "13px",
                    fontWeight: "600", letterSpacing: "0.5px", cursor: "pointer", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#008f85"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#00a99d"}
                  onClick={() => setShowAddressModal(true)}
                >
                  + ADD NEW ADDRESS
                </button>
              </div>
            </div>

            {/* Address Form Modal */}
            {showAddressModal && (
              <AddressFormModal
                initialData={editingAddress}
                onClose={() => { setShowAddressModal(false); setEditingAddress(null); }}
                onSaved={(savedAddr) => {
                  if (editingAddress) {
                    // update existing
                    setSavedAddresses(prev =>
                      prev.map(a => a._id === savedAddr._id ? savedAddr : a)
                    );
                  } else {
                    // add new
                    setSavedAddresses(prev => [...prev, savedAddr]);
                  }
                  setShowAddressModal(false);
                  setEditingAddress(null);
                }}
              />
            )}
          </>
        )}

        {/* My Orders section */}
        {activeSection === "orders" && (
          <>
            <h2 style={mainTitle}>My Orders</h2>
            {loadingOrders ? (
              <div style={{ color: "rgba(255,255,255,0.6)", padding: "20px" }}>Loading your orders...</div>
            ) : userOrders.length === 0 ? (
              <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(173,149,81,0.25)", borderRadius: "8px", padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "15px" }}>
                📦 You have no past orders yet.<br />
                <button onClick={() => navigate("/product")} style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#d4be82", color: "black", fontWeight: "600", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Explore Gemstone Collection
                </button>
              </div>
            ) : (() => {
              const TABS = [
                { id: "all",       label: "All",        filter: () => true },
                { id: "toPay",     label: "To Pay",     filter: s => s.includes("pending") || s.includes("cod") },
                { id: "toShip",    label: "To Ship",    filter: s => s === "paid" || s.includes("processing") },
                { id: "toReceive", label: "To Receive", filter: s => s.includes("dispatch") || s.includes("transit") || s.includes("ship") },
                { id: "delivered", label: "Delivered",  filter: s => s.includes("delivered") || s.includes("completed") },
                { id: "toReview",  label: "To Review",  filter: s => s.includes("delivered") || s.includes("completed") },
              ];

              const activeTab = TABS.find(t => t.id === orderTab) || TABS[0];
              const search = orderSearchQuery.trim().toLowerCase();

              const filteredOrders = userOrders.filter(ord => {
                const s = (ord.status || "").toLowerCase();
                if (!activeTab.filter(s)) return false;
                return !search || (ord._id && ord._id.toLowerCase().includes(search)) ||
                  (ord.items && ord.items.some(i => i.title && i.title.toLowerCase().includes(search)));
              });

              const getStatusBadge = (status) => {
                const s = (status || "").toLowerCase();
                if (s.includes("pending") || s.includes("cod"))
                  return { bg: "rgba(243,156,18,0.2)", color: "#f39c12", border: "#f39c12", icon: "⏳" };
                if (s.includes("cancelled"))
                  return { bg: "rgba(192,57,43,0.2)", color: "#e74c3c", border: "#c0392b", icon: "🚫" };
                if (s.includes("return"))
                  return { bg: "rgba(142,68,173,0.2)", color: "#9b59b6", border: "#8e44ad", icon: "↩️" };
                if (s.includes("delivered") || s.includes("completed"))
                  return { bg: "rgba(39,174,96,0.2)", color: "#2ecc71", border: "#27ae60", icon: "✅" };
                return { bg: "rgba(40,167,69,0.2)", color: "#4cd137", border: "#28a745", icon: "✓" };
              };

              return (
                <>
                  {/* Status Filter Tabs */}
                  <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.15)", marginBottom: "20px" }}>
                    {TABS.map(tab => {
                      const count = userOrders.filter(o => tab.filter((o.status || "").toLowerCase())).length;
                      return (
                        <button key={tab.id} onClick={() => setOrderTab(tab.id)} style={{
                          background: "none", border: "none", borderBottom: orderTab === tab.id ? "3px solid #ad9551" : "3px solid transparent",
                          color: orderTab === tab.id ? "#ad9551" : "#b9c7de", fontSize: "14px",
                          fontWeight: orderTab === tab.id ? "600" : "400", padding: "8px 16px 10px",
                          cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap"
                        }}>
                          {tab.label}{tab.id !== "all" && count > 0 ? ` (${count})` : ""}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div style={{ position: "relative", marginBottom: "20px" }}>
                    <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#ad9551" }}>🔍</span>
                    <input type="text" placeholder="Search by order ID or product name..." value={orderSearchQuery}
                      onChange={e => setOrderSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: "6px", border: "1px solid rgba(173,149,81,0.4)", backgroundColor: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                  </div>

                  {/* Orders List */}
                  {filteredOrders.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {filteredOrders.map((ord, idx) => {
                        const badge = getStatusBadge(ord.status);
                        const isCancellable = ord.status === "Pending (COD)";
                        const isDelivered = (ord.status || "").toLowerCase().includes("delivered") || (ord.status || "").toLowerCase().includes("completed");
                        return (
                          <div key={ord._id || idx} style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(173,149,81,0.3)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "14px", fontWeight: "600", color: "#d4be82" }}>🛍️ Bencham Collection</span>
                                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                                  • #{ord._id ? ord._id.slice(-8).toUpperCase() : `ORD-${idx+1}`} ({new Date(ord.createdAt || Date.now()).toLocaleDateString()})
                                </span>
                              </div>
                              <span style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontSize: "12px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px" }}>
                                {badge.icon} {ord.status || "Paid"}
                              </span>
                            </div>

                            {/* Items */}
                            {ord.items && ord.items.map((item, i) => {
                              const pId = String(item.id || item.productId || (item.title ? item.title.replace(/[^0-9]/g, "") : "") || (i + 1));
                              const reviewKey = `${ord._id}_${pId}`;
                              const isReviewed = reviewedKeys.includes(reviewKey);
                              const canReview = !isReviewed && isDelivered;

                              return (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                  {item.image && <img src={item.image} alt={item.title} style={{ width: "65px", height: "65px", borderRadius: "8px", objectFit: "cover" }} />}
                                  <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "white" }}>{item.title}</h4>
                                    <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Quantity: {item.quantity}</p>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#d4be82" }}>LKR {(item.price * item.quantity).toFixed(2)}</div>
                                    {isReviewed ? (
                                      <span style={{ fontSize: "11px", backgroundColor: "rgba(39,174,96,0.15)", color: "#2ecc71", border: "1px solid #27ae60", padding: "4px 8px", borderRadius: "12px", fontWeight: "600" }}>
                                        ✓ Reviewed
                                      </span>
                                    ) : canReview ? (
                                      <button
                                        onClick={() => {
                                          setReviewModalItem({
                                            orderId: ord._id,
                                            id: pId,
                                            productId: pId,
                                            title: item.title,
                                            price: item.price,
                                            image: item.image
                                          });
                                          setReviewRating(5);
                                          setReviewComment("");
                                        }}
                                        style={{
                                          padding: "5px 12px",
                                          backgroundColor: "#d4be82",
                                          color: "#1e0012",
                                          border: "none",
                                          borderRadius: "4px",
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          cursor: "pointer",
                                          fontFamily: "inherit",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "4px"
                                        }}
                                      >
                                        ⭐ Write Review
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Footer */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                                {ord.shippingAddress && <span>Shipping to: <strong>{ord.shippingAddress.fullName}</strong> ({ord.shippingAddress.city})</span>}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                {/* Cancel button — only for Pending (COD) */}
                                {isCancellable && (
                                  <button onClick={() => handleCancelOrder(ord._id)} disabled={actionLoading}
                                    style={{ padding: "7px 14px", backgroundColor: "transparent", color: "#e74c3c", border: "1px solid #e74c3c", borderRadius: "4px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                                    🚫 Cancel Order
                                  </button>
                                )}
                                {/* Return button — only for Delivered */}
                                {isDelivered && (
                                  <button onClick={() => { setReturnModalOrderId(ord._id); setReturnReason(""); }} disabled={actionLoading}
                                    style={{ padding: "7px 14px", backgroundColor: "transparent", color: "#9b59b6", border: "1px solid #8e44ad", borderRadius: "4px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                                    ↩️ Request Return
                                  </button>
                                )}
                                <div style={{ fontSize: "15px", fontWeight: "bold", color: "white" }}>
                                  Total: <span style={{ color: "#4cd137" }}>LKR {ord.totalAmount ? Number(ord.totalAmount).toFixed(2) : "0.00"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", padding: "40px 0" }}>No orders found in this section.</div>
                  )}
                </>
              );
            })()}
          </>
        )}

        {/* Payment Options section */}
        {activeSection === "payment" && (
          <>
            <h2 style={mainTitle}>My Payment Options</h2>
            <div style={comingSoon}>💳 No payment methods saved yet.</div>
          </>
        )}

        {/* Points section */}
        {activeSection === "points" && (
          <>
            <h2 style={mainTitle}>Points</h2>
            <div style={comingSoon}>⭐ You have 0 points.</div>
          </>
        )}

        {/* My Returns section */}
        {activeSection === "returns" && (() => {
          const returnOrders = userOrders.filter(o => (o.status || "").includes("Return"));
          return (
            <>
              <h2 style={mainTitle}>My Returns</h2>
              {returnOrders.length === 0 ? (
                <div style={{ ...comingSoon, fontSize: "15px" }}>↩️ You have no return requests.<br /><span style={{ fontSize: "13px", opacity: 0.6 }}>Returns can be requested from the Delivered tab in My Orders.</span></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {returnOrders.map((ord, idx) => (
                    <div key={ord._id || idx} style={{ backgroundColor: "rgba(142,68,173,0.08)", border: "1px solid rgba(142,68,173,0.4)", borderRadius: "8px", padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: "600", color: "#d4be82" }}>🛍️ Bencham Collection</span>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginLeft: "10px" }}>
                            #{ord._id ? ord._id.slice(-8).toUpperCase() : `ORD-${idx+1}`}
                          </span>
                        </div>
                        <span style={{ backgroundColor: "rgba(142,68,173,0.2)", color: "#9b59b6", border: "1px solid #8e44ad", fontSize: "12px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px" }}>
                          ↩️ Return Requested
                        </span>
                      </div>
                      {ord.returnReason && (
                        <div style={{ padding: "10px 14px", backgroundColor: "rgba(142,68,173,0.1)", borderLeft: "3px solid #8e44ad", borderRadius: "4px", fontSize: "13px", color: "#c39bd3", marginBottom: "12px" }}>
                          <strong>Reason:</strong> {ord.returnReason}
                        </div>
                      )}
                      {ord.returnRequestedAt && (
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>
                          Requested on: {new Date(ord.returnRequestedAt).toLocaleDateString()}
                        </p>
                      )}
                      {ord.items && ord.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          {item.image && <img src={item.image} alt={item.title} style={{ width: "55px", height: "55px", borderRadius: "6px", objectFit: "cover" }} />}
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "14px", color: "white", fontWeight: "500" }}>{item.title}</p>
                            <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Qty: {item.quantity} · LKR {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px", marginTop: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Total: <span style={{ color: "#9b59b6" }}>LKR {Number(ord.totalAmount).toFixed(2)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}

        {/* My Cancellations section */}
        {activeSection === "cancellations" && (() => {
          const cancelledOrders = userOrders.filter(o => (o.status || "").includes("Cancelled"));
          return (
            <>
              <h2 style={mainTitle}>My Cancellations</h2>
              {cancelledOrders.length === 0 ? (
                <div style={{ ...comingSoon, fontSize: "15px" }}>🚫 You have no cancelled orders.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {cancelledOrders.map((ord, idx) => (
                    <div key={ord._id || idx} style={{ backgroundColor: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.35)", borderRadius: "8px", padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div>
                          <span style={{ fontSize: "14px", fontWeight: "600", color: "#d4be82" }}>🛍️ Bencham Collection</span>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginLeft: "10px" }}>
                            #{ord._id ? ord._id.slice(-8).toUpperCase() : `ORD-${idx+1}`} · Ordered {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <span style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#e74c3c", border: "1px solid #c0392b", fontSize: "12px", fontWeight: "600", padding: "3px 10px", borderRadius: "12px" }}>
                          🚫 Cancelled
                        </span>
                      </div>
                      {ord.cancelledAt && (
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>
                          Cancelled on: {new Date(ord.cancelledAt).toLocaleDateString()}
                        </p>
                      )}
                      {ord.paymentMethod && !ord.paymentMethod.includes("COD") && !ord.paymentMethod.includes("Cash") && (
                        <div style={{ padding: "10px 14px", backgroundColor: "rgba(243,156,18,0.1)", borderLeft: "3px solid #f39c12", borderRadius: "4px", fontSize: "13px", color: "#f39c12", marginBottom: "12px" }}>
                          💳 Refund of <strong>LKR {Number(ord.totalAmount).toFixed(2)}</strong> will be processed within 5–10 business days.
                        </div>
                      )}
                      {ord.items && ord.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          {item.image && <img src={item.image} alt={item.title} style={{ width: "55px", height: "55px", borderRadius: "6px", objectFit: "cover", opacity: 0.7 }} />}
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "500", textDecoration: "line-through" }}>{item.title}</p>
                            <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Qty: {item.quantity} · LKR {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px", marginTop: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.5)" }}>Total: <span style={{ color: "#e74c3c", textDecoration: "line-through" }}>LKR {Number(ord.totalAmount).toFixed(2)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}

        {/* My Reviews section */}
        {(activeSection === "My Reviews" || activeSection === "reviews") && (
          <>
            <h2 style={mainTitle}>My Reviews</h2>
            {userReviews.length === 0 ? (
              <div style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(173,149,81,0.25)",
                borderRadius: "8px",
                padding: "40px",
                textAlign: "center",
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
                marginTop: "15px"
              }}>
                ⭐ You have not submitted any reviews yet.<br />
                <span style={{ fontSize: "13px", opacity: 0.6 }}>Reviews can be submitted for delivered items under My Orders.</span>
                <div style={{ marginTop: "18px" }}>
                  <button
                    onClick={() => {
                      setActiveSection("orders");
                      setOrderTab("delivered");
                    }}
                    style={{
                      padding: "10px 22px",
                      backgroundColor: "#d4be82",
                      color: "#1e0012",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontFamily: "inherit"
                    }}
                  >
                    View Delivered Orders to Review
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {userReviews.map((rev, idx) => (
                  <div key={rev._id || idx} style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,190,130,0.3)", borderRadius: "8px", padding: "18px", display: "flex", gap: "15px", alignItems: "flex-start" }}>
                    {rev.productImage && (
                      <img src={rev.productImage} alt={rev.productTitle} style={{ width: "65px", height: "65px", borderRadius: "8px", objectFit: "cover" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <h4 style={{ margin: 0, fontSize: "15px", color: "#d4be82", fontWeight: "600" }}>{rev.productTitle || "Gemstone Product"}</h4>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Rating Stars */}
                      <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} style={{ color: star <= rev.rating ? "#f1c40f" : "#4a4a4a", fontSize: "16px" }}>★</span>
                        ))}
                      </div>
                      <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: "1.4" }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Return Reason Modal ──────────────────────────────────────────────── */}
      {returnModalOrderId && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ backgroundColor: "#1e0012", border: "1px solid rgba(142,68,173,0.5)", borderRadius: "12px", padding: "30px", width: "420px", maxWidth: "90vw" }}>
            <h3 style={{ color: "#d4be82", margin: "0 0 8px", fontSize: "18px" }}>↩️ Request a Return</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: "0 0 20px" }}>Please tell us why you want to return this item. Our team will contact you within 2â€“3 business days.</p>
            <textarea
              value={returnReason}
              onChange={e => setReturnReason(e.target.value)}
              placeholder="e.g. Product damaged, Wrong item received, Changed my mind..."
              rows={4}
              style={{ width: "100%", padding: "12px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(142,68,173,0.4)", borderRadius: "6px", color: "white", fontSize: "14px", fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button onClick={() => { setReturnModalOrderId(null); setReturnReason(""); }}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={handleReturnRequest} disabled={actionLoading}
                style={{ padding: "10px 20px", backgroundColor: "#8e44ad", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit", opacity: actionLoading ? 0.6 : 1 }}>
                {actionLoading ? "Submitting..." : "Submit Return Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Write Review Modal ────────────────────────────────────────────────── */}
      {reviewModalItem && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
          <div style={{ backgroundColor: "#1e0012", border: "1px solid rgba(212,190,130,0.5)", borderRadius: "12px", padding: "30px", width: "450px", maxWidth: "90vw", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: "#d4be82", margin: "0 0 12px", fontSize: "20px" }}>⭐ Write a Review</h3>
            
            {/* Product summary card */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "20px" }}>
              {reviewModalItem.image && (
                <img src={reviewModalItem.image} alt={reviewModalItem.title} style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
              )}
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", color: "white" }}>{reviewModalItem.title}</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Order #{reviewModalItem.orderId ? reviewModalItem.orderId.slice(-8).toUpperCase() : ""}</p>
              </div>
            </div>

            {/* Interactive Star Rating */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>Select Rating:</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map(star => {
                  const isActive = star <= (reviewHoverRating || reviewRating);
                  return (
                    <span
                      key={star}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                      onClick={() => setReviewRating(star)}
                      style={{
                        fontSize: "30px",
                        color: isActive ? "#f1c40f" : "#4a4a4a",
                        cursor: "pointer",
                        transition: "color 0.15s ease"
                      }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>Your Review:</label>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share details of your experience with this jewelry item..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(212,190,130,0.4)",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setReviewModalItem(null)}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={submittingReview}
                style={{ padding: "10px 22px", backgroundColor: "#d4be82", color: "#1e0012", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit", opacity: submittingReview ? 0.6 : 1 }}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ───────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
          backgroundColor: toast.type === "error" ? "#c0392b" : "#27ae60",
          color: "white", padding: "14px 24px", borderRadius: "8px",
          fontSize: "14px", fontWeight: "500", zIndex: 99999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)", maxWidth: "500px", textAlign: "center",
          animation: "fadeIn 0.3s ease"
        }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ManageAccount;

