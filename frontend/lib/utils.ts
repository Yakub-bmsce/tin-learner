export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function getXPForNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  return currentLevel * 500;
}

export function getXPProgress(xp: number): number {
  const currentLevelXP = (calculateLevel(xp) - 1) * 500;
  const nextLevelXP = calculateLevel(xp) * 500;
  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}

export async function awardXP(userId: string, amount: number) {
  const response = await fetch('/api/user/award-xp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount }),
  });
  return response.json();
}

export async function checkAndAwardBadge(userId: string, badgeName: string) {
  const response = await fetch('/api/user/award-badge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, badgeName }),
  });
  return response.json();
}

export function triggerConfetti() {
  if (typeof window !== 'undefined' && (window as any).confetti) {
    (window as any).confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
