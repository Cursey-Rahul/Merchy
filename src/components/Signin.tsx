'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  return session ? (
    <div>
      Signed in as {session.user?.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  ) : (
    <>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <button onClick={() => signIn('facebook')}>Sign in with Facebook</button>
    </>
  );
}
