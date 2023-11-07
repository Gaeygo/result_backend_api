import bcrypt from "bcrypt"

const SALT_ROUNDS = 10;


// Function to hash the user's password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Function to compare the user's entered password with the hashed password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}