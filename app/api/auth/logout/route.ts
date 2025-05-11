import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // 创建响应对象
    const response = NextResponse.json({ success: true });
    
    // 通过设置过期的cookie来清除token
    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0), // 立即过期
      path: '/',
    });
    
    console.log('User logged out');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: '登出失败，请稍后重试' },
      { status: 500 }
    );
  }
} 