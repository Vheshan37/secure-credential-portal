import bcrypt from 'bcryptjs';

export async function GET(){
const password = "asd321";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password: " + hashedPassword);
}
