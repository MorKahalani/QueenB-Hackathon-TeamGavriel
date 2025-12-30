import express from 'express';
import { 
  createReport, 
  getAllReports, 
  updateReportStatus, 
  getArchivedReports 
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', createReport);           
router.get('/', getAllReports);            
router.get('/archived', getArchivedReports); 
router.patch('/:id', updateReportStatus);  

export default router;