import * as jwt from 'jsonwebtoken';

export function generateToken(payload: any) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '1h' }
  );
}
