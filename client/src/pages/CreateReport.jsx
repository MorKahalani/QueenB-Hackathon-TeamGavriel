import styles from '../styles/App.module.css';
import { useState } from 'react';
import { ShieldAlert, Users, Zap, MessageCircle, Lock, ImagePlay, Paperclip } from 'lucide-react';

function CreateReport() {
    const [selectedSubject, setSelectedSubject] = useState('');

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

            <form className={styles.reportForm}>
                <h2 className={styles.formSubtitle}>פרטי הדיווח</h2>

                <div className={styles.fieldGroup}>
                <label htmlFor="involvedPeople">מי המעורבים? </label>
                <input 
                    id="involvedPeople" 
                    type="text" 
                    placeholder="פרט מי הפוגע ומי הנפגע, ככל שאתה מרגיש בנוח..." 
                    className={styles.inputField}
                />
                </div>

                <div className={styles.fieldGroup}>
                <label htmlFor="eventDescription"> תיאור האירוע </label>
                <textarea 
                id="eventDescription" 
                placeholder="תאר בפירוט מה קרה, היכן ומתי. שים לב, מידע מפורט יסייע למורה לטפל בדיווח שלך..." 
                rows = "4"
                className={styles.textareaField}
                />
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
                            accept="image/*"
                        />
                        <label htmlFor="file-upload" className={styles.fileUploadButton}>
                            <Paperclip size={20} className={styles.clipIcon} />
                            <span>בחר קבצים להעלאה</span>
                        </label>
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn}>שלח דיווח אנונימי</button>
            </form>
        </div>
        

        

    );
};
export default CreateReport;