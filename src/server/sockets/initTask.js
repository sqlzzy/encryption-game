export default async function initTask(rooms, io, data) {
  const { selectedLevel, currentLocation, idRoom } = data;
  const room = rooms.get(idRoom);

  if (room) {
    const response = await fetch(`${currentLocation}/common/json/tasks.json`);
    const levels = await response.json();
    room.round.level = selectedLevel;
    const roundPlayers = room?.round?.roundPlayers;

    const tasksOfSelectedLevel = levels[selectedLevel];

    const countTasks = tasksOfSelectedLevel.length;
    const randomNumber = Math.floor(Math.random() * countTasks);
    const selectedTask = tasksOfSelectedLevel[randomNumber];
    const sourceCodeTask = selectedTask.source_code;
    const hintTask = selectedTask.hint;

    for (let roundPlayer of roundPlayers) {
      io.sockets.sockets
        .get(roundPlayer.idPlayer)
        .emit("showTask", { sourceCodeTask, hintTask, selectedLevel });
    }
  }
}
