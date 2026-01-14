import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, schoolId } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'המשתמש כבר קיים במערכת' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      schoolId
    });

    await user.save(); 
    res.status(201).json({ msg: 'המורה נרשמה בהצלחה!' });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת ביצירת משתמש');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'פרטי התחברות שגויים' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'פרטי התחברות שגויים' });
    }

    const payload = {
      user: {
        id: user.id,
        schoolId: user.schoolId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '365d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); 
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת בהתחברות');
  }
});

router.get('/teachers/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const teachers = await User.find({ schoolId, role: 'teacher' }).select('name _id');
    
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('שגיאת שרת בשליפת המורות');
  }
});
export default router;