import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { signIn } from '@/auth';


export async function GET(req:NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
   
    console.log(token);
  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  try {
    // Check if the user already has a valid session
    const session = await auth();
    console.log('*****',session,'******')
    // if (session) {
    //   // If the session exists, redirect to the authenticated route
    //   return NextResponse.redirect(new URL(`${process.env.WEBAPP_URL}/user/home`, req.url));
    // }
  
    // Attempt to sign in using the token
    const signInResult = await signIn('token-auth', {
      token,
      redirect: false, // Prevent automatic redirect
    });

    if (!signInResult?.error) {
      // Successful authentication
      const redirectUrl = new URL(`${process.env.WEBAPP_URL}/user/home`);
      redirectUrl.searchParams.set('fromAuth', 'true'); // Flag for auth redirect
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}