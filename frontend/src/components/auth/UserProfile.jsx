'use client';

import { useUser, useLogout } from '@/hooks/useAuth';

export default function UserProfile() {
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogout();

  if (isLoading) return <p>Loading user...</p>;

  return (
    <div>
      <h2>Welcome, {user?.name}!</h2>
      <button onClick={() => logoutMutation.mutate()}>Logout</button>
    </div>
  );
}
