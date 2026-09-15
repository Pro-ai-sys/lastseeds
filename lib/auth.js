import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getUserFromReq(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(req) {
  const user = getUserFromReq(req);
  if (!user || user.role !== "admin") return null;
  return user;
}
