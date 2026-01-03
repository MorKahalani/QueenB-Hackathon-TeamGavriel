import styles from '../styles/App.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Zap, MessageCircle, Lock, ImagePlay, Paperclip } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

function CreateReport() {
    
    const navigate = useNavigate(); // navigate function to redirect after submission
    const queryClient = useQueryClient(); // for invalidating queries after mutation

    // data for creating a report
    const [errors, setErrors] = useState({});
    const [selectedSubject, setSelectedSubject] = useState('');
    const [involvedPeople, setInvolvedPeople] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [location, setLocation] = useState('');

    // Mutation for creating a report - sends form data to the server
    const mutation = useMutation({
        mutationFn: (formData) => api.post('/api/reports', formData,
            {
        headers: {
            // disables default JSON header for file uploads in order to use multipart/form-data
            'Content-Type': 'multipart/form-data',
        },
    }
        ),
        onSuccess: (response) => {
            queryClient.invalidateQueries(['reports']); // updates reports data after a new report is created
            const realCode = response.data.trackingCode;
            navigate('/confirmation', { state: { trackingCode: realCode } });
        },
        onError: () => {
           setErrors(prev => ({ ...prev, server: "שרת לא זמין. נסה שוב מאוחר יותר." }));
        }
    });

    // form submission handler
    const handleSubmit = async (e) => {
    e.preventDefault(); // prevents default form submission behavior
    setErrors({}); // resets previous errors
    let newErrors = {};

    // basic validation
    if (!selectedSubject) newErrors.subject = "חובה לבחור נושא";
    if (!description) newErrors.description = "חובה להוסיף תיאור";

    // if there are validation errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return; 
    }

    // creating form data to send, including files
    const formData = new FormData();
    formData.append('subject', selectedSubject);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('involvedPeople', involvedPeople || '');

    // appending selected files to form data
    if (selectedFiles && selectedFiles.length > 0) {
    // Array.from הופך את ה-FileList למערך רגיל שאפשר לעבור עליו
    Array.from(selectedFiles).forEach(file => {
        formData.append('files', file);
    });
}

    try {
        await mutation.mutateAsync(formData); // triggers the mutation to submit the form data
    } catch (err) {
        console.error("Submission error:", err);
    }
};


    // predefined subjects with icons and colors
    const subjects = [
        { id: 'self-harm', label: 'פגיעה עצמית', icon: <ShieldAlert size={24} />, colorClass: styles.redCard },
        { id: 'bullying', label: 'בריונות או חרם', icon: <Users size={24} />, colorClass: styles.yellowCard },
        { id: 'violence', label: 'אלימות או איומים', icon: <Zap size={24} />, colorClass: styles.orangeCard },
        { id: 'media', label: 'הפצת תמונות', icon: <ImagePlay size={24} />, colorClass: styles.purpleCard },
        { id: 'other', label: 'משהו אחר', icon: <MessageCircle size={24} />, colorClass: styles.grayCard },
    ];


    return (
        <div className={styles.container}>  
            <div className={styles.headerSection}> 
                <h1 className={styles.mainTitle}>דיווח בטוח וסודי</h1>
                {/* <p className={styles.infoText}>הדיווח נשאר אנונימי לחלוטין, פרטים מזהים לא ישמרו ולא יהיו חשופים למורה שיקבל את הדיווח</p> */}
                <p className={styles.infoText}>
                {/* האייקון נכנס לכאן */}
                <Lock size={15} className={styles.lockIconInline} />
                <span> הדיווח נשאר אנונימי לחלוטין, פרטים מזהים לא ישמרו ולא יהיו חשופים למורה שיקבל את הדיווח</span>
                </p>
            </div>
            <div className={styles.emergencyContainer}>
                <div className={styles.emergencyCard}>
                    <div className={styles.emergencyHeader}>
                        <span className={styles.emergencyIcon}>📢</span>
                        <span className={styles.emergencyTitle}>צריך עזרה עכשיו?</span>
                    </div>
                    
                    <a href="tel:105" className={styles.callButton}>
                        חייג 105
                    </a>
                    
                    <a 
                        href="https://www.gov.il/he/departments/units/105_call_center" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.infoLink}
                    >
                        מידע נוסף באתר מוקד 105
                    </a>
                </div>
                
            </div>

            {/* Subject Selection */}
            <div className={styles.subjectsGrid}>
                {subjects.map((subject) => (
                    <div 
                        key={subject.id}
                        // Combining the base card style, the specific color style, and the selected style
                        className={`${styles.subjectCard} ${subject.colorClass} ${selectedSubject === subject.id ? styles.selectedCard : ''}`}
                        onClick={() => setSelectedSubject(subject.id)}
                    >
                        <div className={styles.subjectIcon}>{subject.icon}</div>
                        <span className={styles.subjectLabel}>{subject.label}</span>
                    </div>
                    ))}
            </div>
            {errors.subject && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>{errors.subject}</p>}

            <form className={styles.reportForm} onSubmit={handleSubmit}>
                <h2 className={styles.formSubtitle}>פרטי הדיווח</h2>

                <div className={styles.fieldGroup}>
                <label htmlFor="involvedPeople">מי המעורבים? </label>
                <input 
                    value={involvedPeople}
                    onChange={(e) => setInvolvedPeople(e.target.value)}
                    id="involvedPeople" 
                    type="text" 
                    placeholder="פרט מי הפוגע ומי הנפגע, ככל שאתה מרגיש בנוח..." 
                    className={styles.inputField}
                />
                </div>
                <div className={styles.fieldGroup}>
                <label htmlFor="location">איפה זה קרה?</label>
                <input 
                    id="location"
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="למשל: חצר, כיתה,בדרך לביה''ס..." 
                    className={styles.inputField}
                />
                </div>
                <div className={styles.fieldGroup}>
                <label htmlFor="eventDescription"> תיאור האירוע </label>
                <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="eventDescription" 
                placeholder="תאר בפירוט מה קרה, היכן ומתי. שים לב, מידע מפורט יסייע למורה לטפל בדיווח שלך..." 
                rows = "4"
                className={styles.textareaField}
                />
                {errors.description && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.description}</p>}
                </div>
                {/* File Upload Section */}
                <div className={styles.fieldGroup}>
                    <label className={styles.fileLabel}>
                        הוספת הוכחות (צילומי מסך, תמונות)
                        <span className={styles.optionalText}> (אופציונלי)</span>
                    </label>
                    
                    <div className={styles.fileUploadContainer}>
                        <input 
                            type="file" 
                            id="file-upload" 
                            className={styles.hiddenFileInput} 
                            multiple 
                            onChange={(e) => setSelectedFiles(e.target.files)}
                            accept="image/*"
                        />
                        <label htmlFor="file-upload" className={styles.fileUploadButton}>
                            <Paperclip size={20} className={styles.clipIcon} />
                            <span>בחר קבצים להעלאה</span>
                        </label>
                        {selectedFiles.length > 0 && <p>{selectedFiles.length} קבצים נבחרו</p>}
                    </div>
                </div>
                {errors.server && <p style={{ color: 'red', fontWeight: 'bold' }}>{errors.server}</p>}
                <button
                disabled={mutation.isPending} 
                type="submit" 
                className={styles.submitBtn}
                >
                    {mutation.isPending ? "שולח דיווח..." : "שלח דיווח אנונימי"}
                </button>
            </form>
        </div>
    );
};
export default CreateReport;