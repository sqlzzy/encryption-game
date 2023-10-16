import { TEXT_HOST, CLASS_PLAYER_ELEMENT } from "./constants.js";

export default function showPlayerList(element, players) {
  element.innerHTML = "";

  players.forEach((player) => {
    const hostPlayer = player.host === 1 ? TEXT_HOST : "";

    const playerLi = document.createElement("li");
    playerLi.innerText = `${player.namePlayer} ${hostPlayer}`;
    playerLi.id = player.idPlayer;
    playerLi.classList.add(CLASS_PLAYER_ELEMENT);
    element.appendChild(playerLi);
  });
}
