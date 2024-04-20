import showErrorAfterElement from "/common/js/showErrorAfterElement.js";
import removeElementAfterTimeout from "/common/js/removeElementAfterTimeout.js";
import { ERROR_NAME_NOT_ENTERED } from "/common/js/constants.js";
import testValidName from "/common/js/testValidName.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const namePlayerInput = document.querySelector("#name-player-input");
  const gotoRoomBtn = document.querySelector("#goto-room-btn");
  const currentLocation = location.origin;

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
      namePlayerInput.value = "";
      showErrorAfterElement(ERROR_NAME_NOT_ENTERED, namePlayerInput);
    }

    removeElementAfterTimeout(document.querySelector("#error-message"), 2000);
  });
});
