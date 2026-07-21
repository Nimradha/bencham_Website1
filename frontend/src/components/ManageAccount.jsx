import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressFormModal from "./AddressFormModal";

const ManageAccount = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";

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

              {/* Address Book card */}
              <div style={card}>
                <div style={cardTitle}>
                  Address Book
                  <button style={addBtn} onClick={() => setActiveSection("address")}>Add</button>
                </div>
                <div style={emptyCard}>
                  <span style={pinIcon}>📍</span>
                  Save your shipping address here.
                </div>
              </div>

              {/* Billing card */}
              <div style={card}>
                <div style={{ ...cardTitle }}>
                  &nbsp;
                </div>
                <div style={emptyCard}>
                  Save your billing address here.
                </div>
              </div>
            </div>
          </>
        )}

        {/* Address Book section */}
        {activeSection === "address" && (
          <>
            <h2 style={mainTitle}>Address Book</h2>

            {/* Empty state card */}
            <div style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(173,149,81,0.25)",
              borderRadius: "8px",
              padding: "50px 40px 30px",
              minHeight: "260px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>

              {/* Top: text + icon */}
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "28px" }}>
                  Save your shipping and billing address here.
                </p>
                {/* Pin icon */}
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  opacity: 0.35,
                  marginLeft: "4px",
                }}>
                  📍
                </div>
              </div>

              {/* Bottom-right: ADD NEW ADDRESS button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
                <button
                  style={{
                    backgroundColor: "#00a99d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "11px 22px",
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    fontFamily: "inherit",
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
                onClose={() => setShowAddressModal(false)}
                onSaved={(newAddr) => {
                  setSavedAddresses(prev => [...prev, newAddr]);
                  setShowAddressModal(false);
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
