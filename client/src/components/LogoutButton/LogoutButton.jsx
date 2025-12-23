import React from 'react';
import { FiLogOut } from "react-icons/fi"; 
import './LogoutButton.css'; 

const LogoutButton = () => {
  const handleLogout = () => {
    // 
    console.log("המשתמש התנתק");
    alert("מתנתק מהמערכת...");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      <span className="btn-text">יציאה</span>
      <FiLogOut className="btn-icon" />
    </button>
  );
};

export default LogoutButton;