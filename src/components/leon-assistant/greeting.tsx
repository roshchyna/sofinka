import { useAuthContext } from '@components/contexts/AuthContext';
import { useMemo } from 'react';

function getGreeting(name: string): string {
  const hour = new Date().getHours();

  let period: string;
  if (hour >= 5 && hour < 12) {
    period = 'Morning';
  } else if (hour >= 12 && hour < 18) {
    period = 'Afternoon';
  } else if (hour >= 18 && hour < 21) {
    period = 'Evening';
  } else {
    period = 'Night';
  }

  return `${period}, ${name}`;
}

export const Greeting = () => {
  const auth = useAuthContext();

  const greeting = useMemo(() => {
    return getGreeting(auth.whoami.name_first ?? '');
  }, [auth.whoami.name_first]);

  return (
    <div className="flex flex-col items-center gap-2 p-2 text-mono-500 dark:text-shark-100 black:text-mono-300">
      <div className="flex items-center gap-2">
        <span className="text-4xl">{greeting} 👋</span>
      </div>
    </div>
  );
};
