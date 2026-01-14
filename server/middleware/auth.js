import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'אין טוקן, גישה נדחתה' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded.user;
  
    next();
  } catch (err) {
  console.error("JWT Error:", err.message);
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ msg: 'החיבור פג תוקף, אנא התחברי שנית' });
  }
  
  res.status(401).json({ msg: 'הטוקן אינו תקף' });
}
};
export default auth;