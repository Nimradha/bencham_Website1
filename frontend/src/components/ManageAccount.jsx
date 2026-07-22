import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddressFormModal from "./AddressFormModal";

const ManageAccount = () => {
  const navigate = useNavigate();
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

  const [activeSection, setActiveSection] = useState("profile");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  // Fetch saved addresses on load
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:3000/api/address", {
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
    padding: "30px 60px",
    gap: "30px",
    color: "white",
  };

  const sidebar = {
    width: "220px",
    flexShrink: 0,
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
    gridTemplateColumns: "1fr 1fr 1fr",
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
    <div style={page}>
      {/* ── Sidebar ── */}
      <aside style={sidebar}>
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
      <main style={main}>
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

              {/* Address Book card — Default Shipping */}
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
                        {[addr.province, addr.district, addr.city].filter(Boolean).join(" · ")}
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

              {/* Billing card — Default Billing */}
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
                        {[addr.province, addr.district, addr.city].filter(Boolean).join(" · ")}
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={mainTitle}>Address Book</h2>
              <div style={{ display: "flex", gap: "20px" }}>
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
                  {/* Table header */}
                  <div style={{
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

                  {/* Address rows */}
                  {savedAddresses.map((addr, idx) => (
                    <div key={addr._id || idx} style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 2fr 1.5fr 1.2fr 1.5fr 80px",
                      padding: "18px 24px",
                      borderBottom: idx < savedAddresses.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      alignItems: "center",
                      fontSize: "13px",
                      color: "white",
                    }}>
                      {/* Full Name */}
                      <span style={{ fontWeight: "500" }}>{addr.fullName}</span>

                      {/* Address + label badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {addr.label && (
                          <span style={{
                            backgroundColor: addr.label === "home" ? "#f97316" : "#3b82f6",
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "700",
                            padding: "2px 8px",
                            borderRadius: "3px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            flexShrink: 0,
                          }}>
                            {addr.label}
                          </span>
                        )}
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{addr.addressLine}</span>
                      </div>

                      {/* Province - District - City */}
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>
                        {[addr.province, addr.district, addr.city].filter(Boolean).join(" - ")}
                      </span>

                      {/* Phone */}
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>{addr.phone}</span>

                      {/* Status */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Default Shipping Address</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Default Billing Address</span>
                      </div>

                      {/* EDIT */}
                      <button
                        onClick={() => { setEditingAddress(addr); setShowAddressModal(true); }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#00a99d",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          letterSpacing: "0.5px",
                          fontFamily: "inherit",
                          padding: 0,
                        }}
                      >
                        EDIT
                      </button>
                    </div>
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

              {/* ADD NEW ADDRESS button — always visible */}
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

        {/* Returns section */}
        {activeSection === "returns" && (
          <>
            <h2 style={mainTitle}>My Returns</h2>
            <div style={comingSoon}>↩️ No return requests found.</div>
          </>
        )}

        {/* Cancellations section */}
        {activeSection === "cancellations" && (
          <>
            <h2 style={mainTitle}>My Cancellations</h2>
            <div style={comingSoon}>❌ No cancellations found.</div>
          </>
        )}
      </main>
    </div>
  );
};

export default ManageAccount;
