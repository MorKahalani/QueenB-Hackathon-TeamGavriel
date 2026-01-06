import { FiLogOut } from "react-icons/fi"; 
import './LogoutButton.css'; 
//import { useNavigate } from 'react-router-dom'; // חסר לך!
import toast from 'react-hot-toast';

const LogoutButton = () => {
  const handleLogout = () => {
    // 
    localStorage.removeItem('token');
    toast.success("התנתקת בהצלחה. להתראות!", {
      duration: 3000, // משך הזמן שההודעה תישאר על המסך
      icon: '👋'
    });
    setTimeout(() => {
      window.location.href = '/'; 
      // או navigate('/') אם את מעדיפה, אבל window.location מבטיח ניקוי מלא
    }, 2000);
    
    console.log("הטוקן נמחק והמשתמש הועבר לדף הבית");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      <span className="btn-text">יציאה</span>
      <FiLogOut className="btn-icon" />
    </button>
  );
};

export default LogoutButton;