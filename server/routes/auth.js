import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// נתיב להרשמת מורה חדשה: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, schoolId } = req.body;

    // 1. בדיקה אם המשתמש כבר קיים במערכת
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'המשתמש כבר קיים במערכת' });
    }

    // 2. הצפנת הסיסמה (Hashing) לפני השמירה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. יצירת המשתמש החדש עם הנתונים שקיבלנו
    user = new User({
      name,
      email,
      password: hashedPassword,
      schoolId
    });

    await user.save(); // שמירה בדאטה-בייס - כאן תיווצר הטבלה אוטומטית!
    res.status(201).json({ msg: 'המורה נרשמה בהצלחה!' });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת ביצירת משתמש');
  }
});

// נתיב התחברות: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. בדיקה אם המשתמש קיים
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'פרטי התחברות שגויים' });
    }

    // 2. השוואת הסיסמה שהוזנה לסיסמה המוצפנת ב-DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'פרטי התחברות שגויים' });
    }

    // 3. יצירת טוקן מאובטח (JWT) שמכיל את ה-ID וה-schoolId
    const payload = {
      user: {
        id: user.id,
        schoolId: user.schoolId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkey', // השתמשי במפתח סודי מה-env
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // החזרת המפתח למורה
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת בהתחברות');
  }
});

// נתיב לקבלת כל המורות של בית ספר ספציפי: GET /api/auth/teachers/:schoolId
router.get('/teachers/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    // חיפוש משתמשים שהם מורות בבית הספר הספציפי
    const teachers = await User.find({ schoolId, role: 'teacher' }).select('name _id');
    
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת בשליפת המורות');
  }
});
export default router;