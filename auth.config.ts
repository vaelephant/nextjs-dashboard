// 导入 NextAuth 的类型定义，用于后面的配置验证
import type { NextAuthConfig } from 'next-auth';

// 配置对象，遵循 NextAuthConfig 类型，以确保配置项正确
export const authConfig: NextAuthConfig = {
  // 自定义页面路径配置
  pages: {
    signIn: '/login', // 指定登录页面的路径，当未授权用户尝试访问受保护的页面时，会重定向到此路径
  },

  // 回调函数配置
  callbacks: {
    // authorized 回调函数用于判断用户是否有权限访问某个页面
    authorized({ auth, request: { nextUrl } }) {
      // 检查用户是否登录，auth?.user 存在即认为已登录
      const isLoggedIn = !!auth?.user;
      // 检查请求的 URL 是否以 '/dashboard' 开始，用于识别是否访问受保护的仪表盘页面
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      // 如果用户尝试访问仪表盘页面
      if (isOnDashboard) {
        // 用户已登录，允许访问
        if (isLoggedIn) return true;
        // 未登录用户尝试访问，不允许访问
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // 用户已登录，但不是访问仪表盘，重定向到仪表盘页面
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      // 其他情况，默认允许访问
      return true;
    },
  },

  // 身份验证提供者配置
  providers: [], // 用于添加身份验证提供者，如 Google、Facebook 等，这里暂时为空数组

} satisfies NextAuthConfig; // TypeScript 类型断言，确保配置符合 NextAuthConfig 类型
