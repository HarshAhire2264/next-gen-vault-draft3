import jwt from 'jsonwebtoken';

export function generateToken(user) {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export default generateToken;
