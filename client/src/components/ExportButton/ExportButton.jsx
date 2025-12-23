import { FiDownload } from "react-icons/fi"; // ייבוא האייקון
import styles from './ExportButton.module.css';
import PropTypes from 'prop-types'; 

const ExportButton = ({ data }) => {
  const handleExport = () => {
    // 1. הגדרת כותרות העמודות והנתונים
    const headers = "קוד דיווח,סטטוס,נושא,מיקום,התקבל ב:";
    const rows = data.map(r => 
      `${r.id},${r.status},${r.subject},${r.location},${r.date}`
    ).join("\n");
    
    const csvContent = headers + "\n" + rows;

    // 2. הוספת BOM (Byte Order Mark) לתיקון העברית באקסל
    const universalBOM = "\uFEFF";
    
    // 3. יצירת אובייקט ה-Blob עם הקידוד הנכון
    const blob = new Blob([universalBOM + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // 4. יצירת אלמנט הורדה זמני והפעלתו
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "דיווחים_besafe.csv");
    document.body.appendChild(link);
    link.click();
    
    // 5. ניקוי
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button className={styles.exportBtn} onClick={handleExport}>
      <span>ייצוא לאקסל</span>
      <FiDownload />
    </button>
  );
};

ExportButton.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ExportButton;