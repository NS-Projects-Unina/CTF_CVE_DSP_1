// import { NextRequest } from 'next/server';
// import { checkUser } from '../../lib/users';
// import { login } from '../../lib/auth';

// export async function POST(req: NextRequest) {
//   const { user, pass } = await req.json();
//   const u = checkUser(user, pass);

//   if (!u) {
//     return new Response(
//       JSON.stringify({ success: false, message: 'Credenziali non valide' }),
//       { status: 401, headers: { 'Content-Type': 'application/json' } }
//     );
//   }

//   return await login(u.username, u.isAdmin ?? false, req);
// }
