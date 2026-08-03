import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"
  if (!header) return res.status(401).json({ message: 'Thiếu token' });

  try {
    const token = header.split(' ')[1];
    req.nhanVien = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
}