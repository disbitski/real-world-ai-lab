export function shuffleDeck(cards, currentId, random = Math.random) {
  const shuffled = [...cards];

  for (let remaining = shuffled.length - 1; remaining > 0; remaining -= 1) {
    const swapIndex = Math.floor(random() * (remaining + 1));
    [shuffled[remaining], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[remaining]];
  }

  if (shuffled.length > 1 && shuffled[0]?.id === currentId) {
    const nextCardIndex = shuffled.findIndex((card) => card.id !== currentId);
    if (nextCardIndex > 0) {
      [shuffled[0], shuffled[nextCardIndex]] = [shuffled[nextCardIndex], shuffled[0]];
    }
  }

  return shuffled;
}
