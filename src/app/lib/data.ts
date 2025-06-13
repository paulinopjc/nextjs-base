import postgres from 'postgres';
import { User } from './definitions';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;
export async function fetchUsers(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const users = await sql<User[]>`
      SELECT
        users.id,
        users.name,
        users.email
      FROM users
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`}
      ORDER BY users.name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchUserPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM users
    WHERE
      users.name ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }
}

export async function fetchUserById(id: string) {
  try {
    const data = await sql<User[]>`
      SELECT
        users.id,
        users.name,
        users.email
      FROM users
      WHERE users.id = ${id};
    `;

    const user = data.map((user) => ({
      ...user,
    }));

    return user[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch User.');
  }
}