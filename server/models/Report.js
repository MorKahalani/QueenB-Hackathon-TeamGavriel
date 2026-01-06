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
    enum: ['חדש', 'בטיפול', 'קריטי','טופל', 'ארכיון']
  },
  
  location: { 
    type: String 
  }, 

  trackingCode: { 
    type: String, 
    unique: true 
  },

  analysis: {
    type: String,
    default: ''
  },

  isViewed: {
    type: Boolean,
    default: false
  },

  // array to store file paths of uploaded evidence files
  files: [{
    type: String 
  }],
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  teacherId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User', // יוצר קשר לאוסף המשתמשים
  required: true 
  },
  schoolId: { 
    type: String, 
    required: true 
  }
});

const Report = mongoose.model('Report', reportSchema);

export default Report;