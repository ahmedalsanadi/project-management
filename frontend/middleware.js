// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const token = request.cookies.get('token');
//   console.log('token is : ', token);
//   const publicPaths = ['/login', '/register'];
//   const path = request.nextUrl.pathname;

//   if (!token && !publicPaths.includes(path)) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (token && publicPaths.includes(path)) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };
