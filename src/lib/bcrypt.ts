import bcrypt from 'bcryptjs';

const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export { hashPassword, comparePassword };
