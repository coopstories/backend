import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

const SALT_ROUNDS = 10

export const hashPassword = (plainTextPassword: string) => {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS)
}

export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(plainTextPassword, hashedPassword)
}

export const createMasterPassword = () => nanoid(21)

export const createNextPassword = () => nanoid(10)
