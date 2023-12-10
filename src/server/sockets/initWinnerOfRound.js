export default function initWinnerOfRound(socket, rooms, io, data) {
  const { answer, time, dataPlayer } = data;
  const { idRoom } = dataPlayer;
  const room = rooms.get(idRoom);

  if (!!room) {
    const roomPlayers = room?.roomPlayers;

    const winnerPlayer = roomPlayers.find(
      (player) => player?.idPlayer === socket.id
    );

    io.to(idRoom).emit("showResultOfRoundToAll", {
      answer,
      time,
      winnerPlayer,
    });
  }
}
