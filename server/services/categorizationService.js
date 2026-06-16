export const calculateCategory = (score) => {
  const numericScore = Number(score);
  if (!Number.isFinite(numericScore)) {
    throw new Error('Score must be a number.');
  }

  if (numericScore >= 0 && numericScore <= 40) {
    return 'Below Average';
  }

  if (numericScore >= 41 && numericScore <= 65) {
    return 'Average';
  }

  if (numericScore >= 66 && numericScore <= 85) {
    return 'Above Average';
  }

  if (numericScore >= 86 && numericScore <= 100) {
    return 'Excellent';
  }

  throw new Error('Score must be between 0 and 100.');
};
