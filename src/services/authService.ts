import { db } from "../database/db";

export const login = (username: string, password: string) => {
  const user = db.getFirstSync(`
    SELECT * FROM users
    WHERE username='${username}' AND password='${password}'
  `);

  if (!user) {
    return { success: false, message: "Username / password salah" };
  }

  return { success: true, user };
};
