import { FiLogOut } from "react-icons/fi"; 
import './LogoutButton.css'; 
import { useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';


const LogoutButton = () => {
const queryClient = useQueryClient();
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('token');
    queryClient.clear();
    toast.success("התנתקת בהצלחה. להתראות!", {
        duration: 2000,
        icon: '👋',
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    });

    setTimeout(() => {
        navigate('/'); 
    }, 1500);

    console.log("Logout completed: Token removed, Cache cleared, Redirected to Home.");
};
  return (
    <button className="logout-btn" onClick={handleLogout}>
      <span className="btn-text">יציאה</span>
      <FiLogOut className="btn-icon" />
    </button>
  );
};

export default LogoutButton;