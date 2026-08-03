export function errorHandler(err, req, res, next) {
  console.error(err.message);
  res.status(err.status || 400).json({ message: err.message || 'Lỗi server' });
}