import express from 'express';
import { 
  createReport, 
  getAllReports, 
  updateReportStatus, 
  getArchivedReports,
  analyzeReportWithAI
} from '../controllers/reportController.js';

import upload from '../middleware/multerConfig.js'; // multer (allows file uploads) configuration

const router = express.Router();

router.post('/', upload.array('files', 5), createReport);  // allows up to 5 files to be uploaded with the report     
router.get('/', getAllReports);            
router.get('/archived', getArchivedReports); 
router.patch('/:id', updateReportStatus);  
router.get('/:id/analyze', analyzeReportWithAI);

export default router;