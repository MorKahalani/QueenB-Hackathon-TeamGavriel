import express from 'express';
import { 
  createReport, 
  getAllReports, 
  updateReportStatus, 
  getArchivedReports
 
} from '../controllers/reportController.js';

import upload from '../middleware/multerConfig.js'; 

const router = express.Router();
router.post('/', upload.array('files', 5), createReport);   
router.get('/', getAllReports);            
router.get('/archived', getArchivedReports); 
router.patch('/:id', updateReportStatus);  

export default router;