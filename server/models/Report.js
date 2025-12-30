import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    required: [true, 'חובה לבחור נושא לדיווח'] 
  },

  involvedPeople: { 
    type: String 
  },
  
  description: { 
    type: String, 
    required: [true, 'חובה להוסיף תיאור למקרה'] 
  },
  
  status: { 
    type: String, 
    default: 'חדש', 
    enum: ['חדש', 'בטיפול', 'קריטי', 'ארכיון']
  },
  
  trackingCode: { 
    type: String, 
    unique: true 
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Report = mongoose.model('Report', reportSchema);

export default Report;