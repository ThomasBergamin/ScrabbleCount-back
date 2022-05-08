const determineWinner: (
  player1: { id: string; score: string },
  player2: { id: string; score: string }
) => { playerId: string; playerScore: string } | void = (player1, player2) => {
  if (player1.score > player2.score) {
    return { playerId: player1.id, playerScore: player1.score };
  }
  if (player1.score === player2.score) {
    return;
  } else {
    return { playerId: player2.id, playerScore: player2.score };
  }
};

export default determineWinner;
