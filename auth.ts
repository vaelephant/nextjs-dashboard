// 导入 NextAuth 库主函数
import NextAuth from 'next-auth';
// 导入预先配置好的 authConfig 配置对象
import { authConfig } from './auth.config';
// 导入用于身份验证的 Credentials 提供者
import Credentials from 'next-auth/providers/credentials';
// 导入 Zod 库，用于强类型验证
import { z } from 'zod';
// 导入与数据库交互的 SQL 函数
import { sql } from '@vercel/postgres';
// 导入用户类型定义
import type { User } from '@/app/lib/definitions';
// 导入 bcrypt 库，用于密码加密比较
import bcrypt from 'bcrypt';

// 定义异步函数 getUser，用于根据邮箱获取用户信息
async function getUser(email: string): Promise<User | undefined> {
    try {
        // 执行 SQL 查询，获取匹配邮箱的用户
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        // 返回查询结果中的第一个用户
        return user.rows[0];
    } catch (error) {
        // 打印错误日志并抛出异常
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

// 使用 NextAuth 创建 auth 对象，包含 signIn 和 signOut 方法，配置如下
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig, // 引入预定义的配置
    providers: [ // 配置身份验证提供者
        Credentials({ // 使用 Credentials 提供者进行自定义身份验证
            async authorize(credentials) { // 定义认证逻辑
                // 使用 Zod 对提交的凭据进行类型和有效性验证
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                // 验证成功时继续处理
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data; // 解构邮箱和密码
                    const user = await getUser(email); // 根据邮箱获取用户信息
                    if (!user) return null; // 用户不存在则认证失败

                    // 使用 bcrypt 比较提交的密码和数据库中的密码
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user; // 密码匹配则认证成功
                }
                console.log('Invalid credentials'); // 记录无效的凭据
                return null; // 认证失败返回 null
            },
        }),
    ],
});
