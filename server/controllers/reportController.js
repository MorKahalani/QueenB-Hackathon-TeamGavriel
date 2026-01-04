import Report from '../models/Report.js';
import OpenAI from 'openai';

export const createReport = async (req, res) => {
  try {
    const { subject, involvedPeople, description, location } = req.body;

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
              content: "אתה יועץ חינוכי. נתח את הדיווח בקצרה (עד 4 שורות). " +
                       "חובה להתחיל את התשובה ב: 'סטטוס: קריטי' או 'סטטוס: רגיל'. " +
                       "קבע 'קריטי' אם יש חשש לאלימות, איומים או אירוע במקום מבודד. " +
                       "לאחר מכן תן 2 המלצות קצרות למורה."
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
      files: filePaths
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