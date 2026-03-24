import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// 从环境变量获取数据库连接字符串
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL 环境变量未设置');
}

// 创建 postgres 客户端（用于查询）
const client = postgres(connectionString, { prepare: false });

// 创建 Drizzle 实例
export const db = drizzle(client);

// 数据库连接（用于迁移和直接操作）
export const connection = postgres(connectionString);

// 关闭连接的函数
export async function closeConnection() {
  await client.end();
}
