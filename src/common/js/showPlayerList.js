import {
  TEXT_HOST,
  CLASS_PLAYER_ELEMENT,
  CLASS_PLAYER_HOST,
} from "./constants.js";

export default function showPlayerList(element, players) {
  let nameHost;
  const elHost = document.querySelector(`.${CLASS_PLAYER_HOST}`);

  element.innerHTML = "";

  players.forEach((player) => {
    const hostPlayer = player.host === 1 ? "В" : "";

    if (player.host === 1) {
      nameHost = player.namePlayer;
    }

    const playerLi = document.createElement("li");
    playerLi.innerText = `${player.namePlayer} ${hostPlayer}`;
    playerLi.id = player.idPlayer;
    playerLi.classList.add(CLASS_PLAYER_ELEMENT);
    element.appendChild(playerLi);
  });

  if (players.length >= 2) {
    elHost.innerText = `${TEXT_HOST} ${nameHost}`;
  }
}
