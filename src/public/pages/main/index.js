import testValidName from "/common/js/testValidName.js";
import addMetatags from "/common/js/addMetatags.js";
import showErrorInput from "/common/js/showErrorInput.js";
import { ERROR_NAME_NOT_ENTERED } from "/common/js/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const namePlayerWrapper = document.querySelector(".name-player");
  const namePlayerInput = document.querySelector("#name-player-input");
  const gotoRoomBtn = document.querySelector("#goto-room-btn");
  const currentLocation = location.origin;

  addMetatags({
    title: "Мультиплеерная игра | Главная",
    descr: "Мультиплеерная игра (Самый быстрый расшифровщик)",
    url: currentLocation,
  });

  socket.emit("createIdRoom");

  socket.on("getIdCreatedRoom", (idRoom) => {
    gotoRoomBtn.dataset.idRoom = idRoom;
  });

  gotoRoomBtn.addEventListener("click", () => {
    const namePlayer = namePlayerInput.value;
    const idPlayer = socket.id;
    const idRoom = gotoRoomBtn.dataset.idRoom;
    const validNamePlayer = testValidName(namePlayer);

    if (idRoom && validNamePlayer) {
      socket.emit("joinToRoom", { namePlayer, idPlayer, idRoom });

      document.location.href = `${currentLocation}/player/?room=${idRoom}&player=${idPlayer}`;
    } else if (!validNamePlayer) {
      showErrorInput(
        namePlayerWrapper,
        namePlayerInput,
        ERROR_NAME_NOT_ENTERED
      );
    }
  });
});
