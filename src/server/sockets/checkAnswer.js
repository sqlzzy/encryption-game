export default async function checkAnswer(socket, rooms, data) {
  const { answer, time, textOfHintTask, currentLocation, idRoom } = data;
  const room = rooms.get(idRoom);

  if (room) {
    const response = await fetch(`${currentLocation}/common/json/tasks.json`);
    const levels = await response.json();
    const selectedLevel = room?.round?.level;
    const tasksOfSelectedLevel = levels[selectedLevel];
    const currentTask = tasksOfSelectedLevel.filter(
      (task) => task.hint === textOfHintTask
    );

    let result = currentTask[0].answer === answer ? true : false;

    socket.emit("getResultAfterCheckAnswer", { result, answer, time });
  }
}
