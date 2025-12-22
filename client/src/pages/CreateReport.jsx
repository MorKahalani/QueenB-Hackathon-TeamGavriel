import styles from '../styles/App.module.css';


function CreateReport() {
    return (
        <div className={styles.container}>  
            <div className={styles.headerSection}> 
            <h1 className={styles.mainTitle}>דיווח בטוח וסודי</h1>
            <p className={styles.infoText}>הדיווח נשאר אנונימי לחלוטין, פרטים מזהים לא ישמרו ולא יהיו חשופים למורה שיקבל את הדיווח</p>
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
                
                <button type="submit" className={styles.submitBtn}>שלח דיווח אנונימי</button>
            </form>
        </div>
        

        

    );
};
export default CreateReport;