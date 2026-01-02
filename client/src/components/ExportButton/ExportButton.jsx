import { FiDownload } from "react-icons/fi";
import styles from './ExportButton.module.css';
import PropTypes from 'prop-types'; 
import * as XLSX from 'xlsx';

const ExportButton = ({ data }) => {
  const handleExport = () => {
    const formattedData = data.map(r => ({
      'קוד דיווח': r.trackingCode,
      'סטטוס': r.status,
      'נושא': r.subject,
      'מיקום': r.location,
      'תאריך דיווח': r.createdAt ? new Date(r.createdAt).toLocaleString('he-IL') : ""
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    ws['!dir'] = 'rtl';

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "דיווחים");
    XLSX.writeFile(wb, `דיווחים_BeSafe_${new Date().toLocaleDateString('he-IL')}.xlsx`);
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