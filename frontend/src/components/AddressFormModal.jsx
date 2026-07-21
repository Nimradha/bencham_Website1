import React, { useState } from "react";

/**
 * AddressFormModal
 * Props:
 *   onClose()          — called when user closes/cancels
 *   onSaved(newAddr)   — called after a successful API save, with the saved address object
 */
const AddressFormModal = ({ onClose, onSaved }) => {
  const [fullName, setFullName]       = useState("");
  const [phone, setPhone]             = useState("");
  const [province, setProvince]       = useState("");
  const [district, setDistrict]       = useState("");
  const [city, setCity]               = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [selected, setSelected]       = useState("");

  const handleSaveAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login first"); return; }

    try {
      const res = await fetch("http://localhost:3000/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phone, province, district, city, addressLine, label: selected }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Address saved successfully!");
        onSaved(data);   // tell the parent about the new address
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h2>Add new shipping Address</h2>
          <span className="close-btn" onClick={onClose}>✕</span>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="Enter your First and Last name" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input placeholder="Please enter your Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)}>
              <option value="">Please choose your Province</option>
              <option value="Central">Central</option>
              <option value="Eastern">Eastern</option>
              <option value="Northern">Northern</option>
              <option value="North Western">North Western</option>
              <option value="North Central">North Central</option>
              <option value="Southern">Southern</option>
              <option value="Sabaragamuwa">Sabaragamuwa</option>
              <option value="Uva">Uva</option>
              <option value="Western">Western</option>
            </select>
          </div>

          <div className="form-group">
            <label>District</label>
            <select value={district} onChange={e => setDistrict(e.target.value)}>
              <option value="">Please choose your District</option>
              <option value="Ampara">Ampara</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Galle">Galle</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Matale">Matale</option>
              <option value="Mannar">Mannar</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Matara">Matara</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Trincomalee">Trincomalee</option>
              <option value="Vavuniya">Vavuniya</option>
            </select>
          </div>

          <div className="form-group">
            <label>City</label>
            <select value={city} onChange={e => setCity(e.target.value)}>
              <option value="">Please choose your City</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Trincomalee">Trincomalee</option>
              <option value="Matara">Matara</option>
              <option value="Matale">Matale</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Ampara">Ampara</option>
              <option value="Vavuniya">Vavuniya</option>
              <option value="Mannar">Mannar</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Horana">Horana</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Kilinochchi">Kilinochchi</option>
            </select>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input placeholder="eg. 142/4, Yalagala Road, Wewala, Horana" value={addressLine} onChange={e => setAddressLine(e.target.value)} />
          </div>
        </div>

        <div>
          <p style={{ textAlign: "left" }}>Select a label for effective delivery</p>
          <div className="buttons2">
            <button className={`btn2 ${selected === "office" ? "active" : ""}`} onClick={() => setSelected("office")}>
              <img src="/images/office-briefcase-svgrepo-com (1).svg" height="20px" alt="office" />
              <span>OFFICE</span>
            </button>
            <button className={`btn2 ${selected === "home" ? "active" : ""}`} onClick={() => setSelected("home")}>
              <img src="/images/home-svgrepo-com (1).svg" height="20px" alt="home" />
              <span>HOME</span>
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSaveAddress}>Save</button>
        </div>

      </div>
    </div>
  );
};

export default AddressFormModal;
