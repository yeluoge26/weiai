import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'welove-secret-key-2024'

export interface TokenPayload {
  id: number
  type: 'user' | 'admin'
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload
  } catch {
    return null
  }
}
