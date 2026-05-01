import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, user: user.user },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};