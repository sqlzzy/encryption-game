import copyToClipboard from "/common/js/copyToClipboard.js";
import showPlayerList from "/common/js/showPlayerList.js";
import showElement from "/common/js/showElement.js";
import hideElement from "/common/js/hideElement.js";
import defineLevel from "/common/js/defineLevel.js";
import initTabs from "/common/js/initTabs.js";
import changeTextElement from "/common/js/changeTextElement.js";
import addQrCodeToElement from "/common/js/addQrCodeToElement.js";
import showErrorInput from "/common/js/showErrorInput.js";
import {
  MESSAGE_COPIED,
  MESSAGE_WAIT_HOST_TO_START_GAME,
  MESSAGE_WAIT_ROUND_TO_END,
  MESSAGE_WAIT_HOST_TO_SELECT_LEVEL,
  ERROR_INCORRECT_ANSWER,
} from "/common/js/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const gameAnswerContent = document.querySelector(".game__answer-content");
  const linkRoomInput = document.querySelector("#link-room-input");
  const copyLinkBtn = document.querySelector("#copy-link-btn");
  const startGameBtn = document.querySelector("#start-game-btn");
  const subtitlePage = document.querySelector("#subtitle-page");
  const currentLocation = location.origin;
  const urlParams = new URLSearchParams(window.location.search);
  const idRoom = urlParams.get("room");
  const idPlayer = urlParams.get("player");
  const currentUrl = document.location.href;
  const dataPlayer = { idRoom, idPlayer, currentUrl };
  const elRoomPlayersList = document.querySelector("#players-room");
  const elRoundPlayersList = document.querySelector("#players-round");
  const elRoundPlayersInfo = document.querySelector("#players-round-info");
  const gameLevels = document.querySelector("#game-levels");
  const levelBtns = document.querySelectorAll("#level-btn");
  const gameBoard = document.querySelector("#game-board");
  const sourceCode = gameBoard.querySelector("#source-code");
  const hintTaskElement = gameBoard.querySelector("#hint-task");
  const answerTaskInput = document.querySelector("#answer-task-input");
  const checkAnswerBtn = gameBoard.querySelector("#check-answer-btn");
  const playTime = gameBoard.querySelector("#playtime");
  const gameResult = document.querySelector("#game-result");
  const resultWinner = document.querySelector("#result-winner");
  const resultAnswer = document.querySelector("#result-answer");
  const resultPlaytime = document.querySelector("#result-playtime");
  const nextRoundBtn = gameResult.querySelector("#next-round-btn");
  const waitInfo = document.querySelector("#wait-info");
  const levelInfo = document.querySelector("#level-info");
  const qrCodeTabContent = document.querySelector("#qr-code-room");
  const elHost = document.querySelector(".host");
  const urlRoom = `${currentLocation}/lobby/?room=${idRoom}`;
  let textOfHintTask;
  let timerInterval = 0;
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let time;

  linkRoomInput.value = urlRoom;

  socket.emit("stayInRoom", dataPlayer);

  initTabs();

  socket.emit("createQrCode", urlRoom, idRoom);

  setTimeout(() => {
    addQrCodeToElement(qrCodeTabContent, idRoom);
  }, 1000);

  socket.on("getPlayerName", (namePlayer) => {
    document.title = `Игрок ${namePlayer}`;
    subtitlePage.textContent = `Игрок ${namePlayer}`;
  });

  function filterPlayersHostList(players) {
    return players.filter(
      (player) => player.host && socket.id === player.idPlayer
    );
  }

  function filterOtherPlayersList(players) {
    return players.filter(
      (player) => !player.host && socket.id === player.idPlayer
    );
  }

  socket.on("getRoomPlayersData", (data) => {
    const { roomPlayers, startGame, roundPlayers } = data;

    if ((roomPlayers && startGame) || roomPlayers) {
      showPlayerList(elRoomPlayersList, roomPlayers);

      const filteredPlayersHostList = filterPlayersHostList(roomPlayers);
      const filteredOtherPlayersList = filterOtherPlayersList(roomPlayers);
      const currentPlayerHost = filteredPlayersHostList[0];
      const currentOtherPlayer = filteredOtherPlayersList[0];

      if (roomPlayers.length >= 1 && currentPlayerHost && !startGame) {
        hideElement(waitInfo);
        showElement(startGameBtn);
        socket.emit("createRoundPlayers", { idRoom, roomPlayers, startGame });
      }

      if (roomPlayers.length >= 2 && currentOtherPlayer && !startGame) {
        waitInfo.textContent = MESSAGE_WAIT_HOST_TO_START_GAME;
        showElement(waitInfo);
      }
    }

    if (roundPlayers && startGame) {
      const existRoundPlayer = roundPlayers.some(
        (player) => socket.id === player.idPlayer
      );

      if (!existRoundPlayer) {
        waitInfo.textContent = MESSAGE_WAIT_ROUND_TO_END;
        showElement(waitInfo);
        showPlayerList(elRoundPlayersList, roundPlayers);
        showElement(elRoundPlayersInfo);
      }
    }
  });

  startGameBtn.addEventListener("click", () => {
    socket.emit("initStartGame", { idRoom });
  });

  socket.on("getRoundPlayersData", (data) => {
    const { roundPlayers } = data;

    if (roundPlayers) {
      showPlayerList(elRoundPlayersList, roundPlayers);
    }
  });

  socket.on("showGameLevels", (data) => {
    const { roomPlayers } = data;
    const filteredPlayersHostList = filterPlayersHostList(roomPlayers);
    const filteredOtherPlayersList = filterOtherPlayersList(roomPlayers);
    const currentPlayerHost = filteredPlayersHostList[0];
    const currentOtherPlayer = filteredOtherPlayersList[0];

    showElement(elRoundPlayersInfo);

    if (currentPlayerHost) {
      hideElement(startGameBtn);
      showElement(gameLevels);
    } else if (currentOtherPlayer) {
      waitInfo.textContent = MESSAGE_WAIT_HOST_TO_SELECT_LEVEL;
      showElement(waitInfo);
    }
  });

  levelBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const clickedBtn = event.target;

      const selectedLevel = clickedBtn.dataset.level;

      socket.emit("initTask", { selectedLevel, currentLocation, idRoom });
    });
  });

  socket.on("showTask", ({ sourceCodeTask, hintTask, selectedLevel }) => {
    hideElement(gameLevels);
    hideElement(waitInfo);
    textOfHintTask = hintTask;

    const nameLevel = defineLevel(selectedLevel);

    levelInfo.textContent = `Уровень сложности: ${nameLevel}`;
    sourceCode.textContent = `Исходный код: ${sourceCodeTask}`;
    hintTaskElement.textContent = `Подсказка: ${hintTask}`;
    playTime.textContent = `Время: 00:00:00`;
    showElement(gameBoard);
    startTimer();
  });

  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function updateTimer() {
    seconds++;

    if (seconds === 60) {
      seconds = 0;
      minutes++;

      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
    }

    time = formatTime(hours, minutes, seconds);
    playTime.textContent = `Время: ${time}`;
  }

  function formatTime(hours, minutes, seconds) {
    const formattedHours = padZero(hours);
    const formattedMinutes = padZero(minutes);
    const formattedSeconds = padZero(seconds);

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  function padZero(number) {
    return number.toString().padStart(2, "0");
  }

  checkAnswerBtn.addEventListener("click", () => {
    const answer = +answerTaskInput.value;

    socket.emit("checkAnswer", {
      textOfHintTask,
      answer,
      time,
      currentLocation,
      idRoom,
    });
  });

  socket.on("getResultAfterCheckAnswer", (data) => {
    const { result, answer, time } = data;
    if (result) {
      stopTimer();
      hideElement(gameBoard);
      socket.emit("initWinnerOfRound", { answer, time, dataPlayer });
    } else {
      showErrorInput(
        gameAnswerContent,
        answerTaskInput,
        ERROR_INCORRECT_ANSWER
      );
    }
  });

  socket.on("showResultOfRoundToAll", (data) => {
    const { answer, time, winnerPlayer } = data;
    resultWinner.textContent = `Победитель раунда: игрок ${winnerPlayer.namePlayer}`;
    resultAnswer.textContent = `Правильный ответ: ${answer}`;
    resultPlaytime.textContent = `Код расшифрован за ${time}`;
    stopTimer();
    hideElement(waitInfo);
    hideElement(gameBoard);
    showElement(gameResult);
    showElement(nextRoundBtn);
  });

  copyLinkBtn.addEventListener("click", () => {
    copyToClipboard(linkRoomInput.value);
    changeTextElement(copyLinkBtn, MESSAGE_COPIED);
  });

  nextRoundBtn.addEventListener("click", () => {
    socket.emit("endRound", idRoom);
  });

  function resetGame(roomPlayers, startGame) {
    answerTaskInput.value = "";
    playTime.textContent = "00:00:00";
    elHost.textContent = "";
    startGame = 0;
    timerInterval = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    hideElement(gameResult);
    hideElement(elRoundPlayersInfo);
    hideElement(gameLevels);
    hideElement(gameBoard);

    socket.emit("createRoundPlayers", { idRoom, roomPlayers, startGame });
  }

  socket.on("resetGame", (data) => {
    const { roomPlayers, startGame } = data;

    resetGame(roomPlayers, startGame);
  });

  socket.on("becomeHost", (roomPlayers) => {
    if (roomPlayers && roomPlayers.length >= 1) {
      showElement(startGameBtn);
    } else {
      resetGame(roomPlayers);
    }
  });

  socket.on("redirect", (url) => {
    document.location.href = url;
  });
});
