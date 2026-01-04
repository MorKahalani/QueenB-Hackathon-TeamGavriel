import Report from '../models/Report.js';
import OpenAI from 'openai'; 

export const createReport = async (req, res) => {
  try {
    const { subject, involvedPeople, description,location} = req.body;

    // process uploaded files and get their paths
    let filePaths = [];
    if (req.files && req.files.length > 0) {
      filePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    const trackingCode = 'BS-' + Math.floor(1000 + Math.random() * 9000);

    const newReport = new Report({
      subject,
      involvedPeople,
      description,
      trackingCode,
      location,
      files: filePaths // store file paths in the report document
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'שגיאה ביצירת הדיווח', error: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאה במשיכת הדיווחים' });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 
    const updatedReport = await Report.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true } 
    );
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'שגיאה בעדכון הסטטוס' });
  }
};

export const getArchivedReports = async (req, res) => {
  try {
    const archived = await Report.find({ status: 'ארכיון' });
    res.status(200).json(archived);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאה במשיכת הארכיון' });
  }
};

export const analyzeReportWithAI = async (req, res) => {
  try {
    const { id } = req.params;

    if (!process.env.OPENAI_API_KEY) {
       console.error("Missing OpenAI API Key in .env file");
       return res.status(500).json({ message: 'מפתח AI חסר בשרת. ודאי שקובץ ה-.env מוגדר כראוי.' });
    }
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'דיווח לא נמצא' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
      {
      role: "system",
      content: "אתה יועץ חינוכי מומחה לטיפול בבריונות. נתח את הדיווח הבא וספק תשובה בעברית הכוללת: " +
                "1. סיכום קצר של האירוע. " +
                "2. קביעת רמת דחיפות (קריטי/רגיל) בצירוף הסבר מדוע בחרת ברמה זו. **שים לב במיוחד למיקום האירוע** - האם המיקום מעיד על חוסר פיקוח או מקום מבודד שמגביר את הסיכון? " +
                "3. קביעה האם מדובר בבריונות/חרם מתמשך או אירוע חד פעמי. " +
                "4. 3 המלצות מעשיות למורה, **כולל המלצה ספציפית שקשורה למיקום האירוע** (למשל: תגבור השגחה באזור זה, בדיקת מצלמות אם יש, או שינוי סידורי הושבה)." +
                "החזר את התשובה בפורמט ברור עם נקודות (Bullet points)."
      },
        {
          role: "user",
          content: `נושא: ${report.subject}. מיקום: ${report.location || "לא צוין"}. תיאור המקרה: ${report.description}`
        }
      ],
      temperature: 0.7, 
    });

    const aiAnalysis = response.choices[0].message.content;
    res.status(200).json({ analysis: aiAnalysis });
    
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: 'שגיאה בניתוח הדיווח על ידי ה-AI', error: error.message });
  }
};