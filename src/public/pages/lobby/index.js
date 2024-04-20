import copyToClipboard from "/common/js/copyToClipboard.js";
import showPlayerList from "/common/js/showPlayerList.js";
import showErrorAfterElement from "/common/js/showErrorAfterElement.js";
import removeElementAfterTimeout from "/common/js/removeElementAfterTimeout.js";
import testValidName from "/common/js/testValidName.js";
import initTabs from "/common/js/initTabs.js";
import changeTextElement from "/common/js/changeTextElement.js";
import addQrCodeToElement from "/common/js/addQrCodeToElement.js";
import {
  ERROR_NAME_NOT_ENTERED,
  MESSAGE_COPIED,
} from "/common/js/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const namePlayerInput = document.querySelector("#name-player-input");
  const linkRoomInput = document.querySelector("#link-room-input");
  const copyLinkBtn = document.querySelector("#copy-link-btn");
  const gotoRoomBtn = document.querySelector("#goto-room-btn");
  const currentLocation = location.origin;
  const urlParams = new URLSearchParams(window.location.search);
  const idRoom = urlParams.get("room");
  const playersRoomList = document.querySelector("#players-room");
  const qrCodeTabContent = document.querySelector("#qr-code-room");
  const urlRoom = `${currentLocation}/lobby/?room=${idRoom}`;

  linkRoomInput.value = urlRoom;

  initTabs();

  socket.emit("createQrCode", urlRoom, idRoom);

  setTimeout(() => {
    addQrCodeToElement(qrCodeTabContent, idRoom);
  }, 1000);

  setTimeout(function checkPlayersList() {
    socket.emit("checkPlayersList", idRoom);
    setTimeout(checkPlayersList, 2000);
  }, 1000);

  socket.on("getRoomPlayersData", (data) => {
    showPlayerList(playersRoomList, data.roomPlayers);
  });

  copyLinkBtn.addEventListener("click", () => {
    copyToClipboard(linkRoomInput.value);
    changeTextElement(copyLinkBtn, MESSAGE_COPIED);
  });

  gotoRoomBtn.addEventListener("click", () => {
    const namePlayer = namePlayerInput.value;
    const idPlayer = socket.id;
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
