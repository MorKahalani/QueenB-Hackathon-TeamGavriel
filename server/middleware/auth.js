import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // 1. חילוץ הטוקן מהכותרת (Header) של הבקשה
  const token = req.header('x-auth-token');

  // 2. בדיקה אם בכלל נשלח טוקן
  if (!token) {
    return res.status(401).json({ msg: 'אין טוקן, גישה נדחתה' });
  }

  try {
    // 3. אימות הטוקן בעזרת המפתח הסודי שלנו
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    
    // 4. הוספת פרטי המורה (ID ובית ספר) לאובייקט הבקשה כדי שה-Controller יוכל להשתמש בהם
    req.user = decoded.user;
    
    // 5. הכל תקין - ממשיכים לפונקציה הבאה (ה-Controller)
    next();
  } catch (err) {
  console.error("JWT Error:", err.message);
  
  // אם הטוקן פג תוקף, נחזיר 401 במקום לתת לשרת להשתגע
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ msg: 'החיבור פג תוקף, אנא התחברי שנית' });
  }
  
  res.status(401).json({ msg: 'הטוקן אינו תקף' });
}
};
export default auth;