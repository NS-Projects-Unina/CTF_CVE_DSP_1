// // api/session/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   const token = req.cookies.get('authToken')?.value;
//   if (token) return NextResponse.json({ authenticated: true });
//   return NextResponse.json({ authenticated: false });
// }
