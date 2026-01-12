import Report from '../models/Report.js';
import OpenAI from 'openai';

export const createReport = async (req, res) => {
  try {
    const { subject, involvedPeople, description, location, teacherId, schoolId } = req.body;
    let filePaths = [];
    if (req.files && req.files.length > 0) {
      filePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    const trackingCode = 'BS-' + Math.floor(1000 + Math.random() * 9000);

    let aiAnalysis = '';
    let autoStatus = 'חדש';

    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "אתה יועץ חינוכי מומחה. נתח דיווחים אנונימיים. " +
         "אם הדיווח הוא בדיחה או ספאם, התחל ב: 'סטטוס: ניסיון להטרלה'. " +
         "אחרת, התחל ב: 'סטטוס: קריטי' או 'סטטוס: רגיל'. " +
         
         "הנחיות לכתיבה: " +
         "1. כתוב ניתוח קצר של האירוע (עד 3 שורות). " +
         "2. רד שורה וכתוב בדיוק את המילים 'המלצות למורה:' (ללא המילה 'כותרת'). " +
         "3. תן 2 המלצות מערכתיות בלבד. " +
         "4. אם זיהית ניסיון להטרלה אל תתן המלצות למורה " +
         "דגש אנונימיות: אל תציע ליצור קשר עם המדווח או לזהות אותו!"
            },
            { role: "user", content: `נושא: ${subject}. מיקום: ${location || "לא צוין"}. תיאור: ${description}` }
          ],
          temperature: 0.7,
        });

        const fullContent = response.choices[0].message.content;
        if (fullContent.includes('סטטוס: קריטי')) {
          autoStatus = 'קריטי';
        }
        aiAnalysis = fullContent.replace(/^סטטוס:\s*(קריטי|רגיל)[.\s\n]*/, '').trim();
      } catch (aiError) {
        console.error("AI automated analysis failed:", aiError);
      }
    }

    const newReport = new Report({
      subject,
      involvedPeople,
      description,
      location,
      trackingCode,
      status: autoStatus,
      analysis: aiAnalysis,
      files: filePaths,
      teacherId,
      schoolId
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
    const reports = await Report.find({ 
        teacherId: req.user.id,
        schoolId: req.user.schoolId 
    });

    reports.sort((a, b) => {
      const aCriticalNew = (a.status === 'קריטי' && !a.isViewed);
      const bCriticalNew = (b.status === 'קריטי' && !b.isViewed);
      if (aCriticalNew && !bCriticalNew) return -1;
      if (!aCriticalNew && bCriticalNew) return 1;

      
      if (a.status === 'קריטי' && b.status !== 'קריטי') return -1;
      if (a.status !== 'קריטי' && b.status === 'קריטי') return 1;

      
      if (a.status === 'חדש' && b.status !== 'חדש') return -1;
      if (a.status !== 'חדש' && b.status === 'חדש') return 1;

    
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאה במשיכת הדיווחים' });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isViewed } = req.body;
    
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status, isViewed },
      { new: true }
    );
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'שגיאה בעדכון הדיווח' });
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