import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { UserProfile } from '@auth0/nextjs-auth0/client';

// ログイン中かどうかとユーザー情報を返す
export function useLoginState(): [UserProfile | undefined, boolean] {
  const { user, error, isLoading } = useUser();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (error) {
      setIsLogin(false);
    } else if (isLoading) {
      setIsLogin(false);
    } else if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user, error, isLoading]);

  return [user, isLogin];
}
