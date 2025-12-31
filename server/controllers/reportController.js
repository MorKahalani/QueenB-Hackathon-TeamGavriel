import Report from '../models/Report.js';

export const createReport = async (req, res) => {
  try {
    const { subject, involvedPeople, description,location} = req.body;
    const trackingCode = 'BS-' + Math.floor(1000 + Math.random() * 9000);

    const newReport = new Report({
      subject,
      involvedPeople,
      description,
      trackingCode,
      location,
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