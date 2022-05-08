const determineWinner: (
  player1: { id: string; score: string },
  player2: { id: string; score: string }
) => string | void = (player1, player2) => {
  if (player1.score > player2.score) {
    return player1.id;
  }
  if (player1.score === player2.score) {
    return;
  } else {
    return player2.id;
  }
};

export default determineWinner;
