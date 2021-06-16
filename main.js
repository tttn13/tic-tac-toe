const Coordinate = (x, y) => {
  const get_x = x;
  const get_y = y;
  return { get_x, get_y };
};

const gameBoard = (() => {
  let board = [...Array(3)].map((element) => Array(3).fill(""));
  let won_already = false;
  const board_size = board.length;

  const get_won_already = () => {
    return won_already;
  };

  const get_all_empty_spots = () => {
    let empty_spots_arr = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] == "") {
          empty_spots_arr.push(Coordinate(i, j));
        }
      }
    }
    return empty_spots_arr;
  };

  const get_marker = (x, y) => {
    return board[x][y];
  };

  const new_game = () => {
    board = [...Array(3)].map((element) => Array(3).fill(""));
    won_already = false;
  };

  const insert_marker = (marker, x, y) => {
    board[x][y] = marker;
  };

  const get_board = () => {
    return board;
  };

  const game_status = {
    WIN: 1,
    LOSE: 2,
    DRAW: 3,
    NORESULT: 4,
  };
  const display_winner = document.getElementById("display-winner");

  const check_for_winner = () => {
    let length = board.length;
    if (
      _ifVertical(length, gameController.player_marker) ||
      _ifHorizontal(length, gameController.player_marker) ||
      _ifDiagonal(length, gameController.player_marker)
    ) {
      console.log("Player won");
      display_winner.style.display = "block";
      display_winner.innerHTML = "CONGRATS! YOU WON!";
      won_already = true;
      return game_status.WIN;
    } else if (check_if_filled()) {
      console.log("draw");
      display_winner.style.display = "block";
      display_winner.innerHTML = "IT'S A TIE!";
      won_already = true;
      return game_status.DRAW;
    } else if (
      _ifVertical(length, gameController.computer_marker) ||
      _ifHorizontal(length, gameController.computer_marker) ||
      _ifDiagonal(length, gameController.computer_marker)
    ) {
      display_winner.style.display = "block";
      display_winner.innerHTML = "SORRY! YOU LOSE!";
      won_already = true;
      return game_status.LOSE;
    } else {
      console.log("no endgame yet");
      return game_status.NORESULT;
    }
  };

  const check_if_filled = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] == "") {
          return false;
        }
      }
    }
    return true;
  };

  const _ifVertical = (length, marker) => {
    let iswinning = true;
    for (y = 0; y < length; y++) {
      iswinning = true;
      for (x = 0; x < length; x++) {
        iswinning = iswinning && get_marker(x, y) === marker;
      }
      if (iswinning) {
        return iswinning;
      }
    }
    return false;
  };

  const _ifHorizontal = (length, marker) => {
    let iswinning = true;
    // let horizontal_cells = [];
    for (x = 0; x < length; x++) {
      // horizontal_cells.push([]);
      iswinning = true;
      for (y = 0; y < length; y++) {
        iswinning = iswinning && get_marker(x, y) === marker;
        // horizontal_cells[x].push(get_marker(x,y));
      }
      if (iswinning) {
        return iswinning;
      }
    }
    return false;
  };

  const _ifDiagonal = (length, marker) => {
    if (
      get_marker(0, 2) === marker &&
      get_marker(1, 1) === marker &&
      get_marker(2, 0) === marker
    ) {
      return true;
    } else {
      let iswinning = true;
      for (x = 0; x < length; x++) {
        iswinning = iswinning && get_marker(x, x) === marker;
      }
      if (iswinning) {
        return iswinning;
      } else {
        return false;
      }
    }
  };

  return {
    get_marker,
    insert_marker,
    get_board,
    check_for_winner,
    new_game,
    get_won_already,
    get_all_empty_spots,
    board_size,
    check_if_filled,
    game_status,
    display_winner,
  };
})();

const displayController = (() => {
  const draw_board = () => {
    gameBoard.display_winner.style.display = "none";
    const mytable = document.querySelector("table");
    mytable.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      var row = mytable.insertRow(i);
      for (let j = 0; j < 3; j++) {
        var cell = row.insertCell(j);
        cell.className = "cell";
        cell.id = `${i}${j}`;
        _create_cell(cell, i, j);
      }
    }
    document.getElementById("main").appendChild(mytable);
  };

  const start_new_game = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.innerHTML = "";
    });
    gameBoard.new_game();
  };

  const _create_cell = (cell, row, column) => {
    cell.innerHTML = gameBoard.get_board()[row][column];
    cell.addEventListener("click", () => {
      if (gameBoard.get_won_already()) {
        start_new_game();
      } else if (cell.innerHTML == "") {
        gameController.game_is_played(
          gameController.player_marker,
          row,
          column
        );
        if (
          !gameBoard.check_if_filled() &&
          gameBoard.get_won_already() == false
        ) {
          gameController.game_is_played(gameController.computer_marker);
        }
      }
    });
  };

  const draw_scores = (player_score, tie_score, computer_score) => {
    console.log(
      "drawing these scores",
      player_score,
      tie_score,
      computer_score
    );
    const player_score_p = document.getElementById("player-score");
    if (player_score == null) {
      player_score_p.innerHTML = "0";
    } else {
      player_score_p.innerHTML = `${player_score}`;
    }

    const computer_score_p = document.getElementById("computer-score");
    if (computer_score == null) {
      computer_score_p.innerHTML = "0";
    } else {
      computer_score_p.innerHTML = `${computer_score}`;
    }

    const tie_score_p = document.getElementById("tie-score");
    if (tie_score == null) {
      tie_score_p.innerHTML = "0";
    } else {
      tie_score_p.innerHTML = `${tie_score}`;
    }
  };

  return {
    draw_board,
    start_new_game,
    draw_scores,
  };
})();

const gameController = (() => {
  const player_marker = "x";
  const computer_marker = "o";

  const loadfromStorage = () => {
    playerScoreFromStorage = JSON.parse(localStorage.getItem("playerScore"));
    computerScoreFromStorage = JSON.parse(
      localStorage.getItem("computerScore")
    );
    tieScoreFromStorage = JSON.parse(localStorage.getItem("tieScore"));
    if (
      playerScoreFromStorage !== null ||
      computerScoreFromStorage != null ||
      tieScoreFromStorage != null
    ) {
      player_score = playerScoreFromStorage;
      computer_score = computerScoreFromStorage;
      tie_score = tieScoreFromStorage;
    } else if (
      playerScoreFromStorage == null &&
      computerScoreFromStorage == null &&
      tieScoreFromStorage == null
    ) {
      player_score = 0;
      computer_score = 0;
      tie_score = 0;
    }
    displayController.draw_scores(
      playerScoreFromStorage,
      tieScoreFromStorage,
      computerScoreFromStorage
    );
  };

  let player_score = 0;
  let computer_score = 0;
  let tie_score = 0;
  const game_is_played = (player, row, column) => {
    if (player == player_marker) {
      gameBoard.insert_marker(player, row, column);
    } else {
      computerController.insert_marker(gameController.computer_marker);
    }

    displayController.draw_board();

    let result = gameBoard.check_for_winner();
    if (result == gameBoard.game_status.WIN) {
      player_score += 1;
      localStorage.setItem("playerScore", JSON.stringify(player_score));
    } else if (result == gameBoard.game_status.DRAW) {
      tie_score += 1;
      localStorage.setItem("tieScore", JSON.stringify(tie_score));
    } else if (result == gameBoard.game_status.LOSE) {
      computer_score += 1;
      localStorage.setItem("computerScore", JSON.stringify(computer_score));
    }

    displayController.draw_scores(player_score, tie_score, computer_score);
  };
  return { player_marker, computer_marker, game_is_played, loadfromStorage };
})();

const computerController = (() => {
  const insert_marker = (marker) => {
    let random_arr = gameBoard.get_all_empty_spots();
    let random_selection =
      random_arr[_get_random_coordinates(random_arr.length)];
    let x = random_selection.get_x;
    let y = random_selection.get_y;
    gameBoard.get_board()[x][y] = marker;
  };
  const _get_random_coordinates = (number) => {
    return Math.floor(Math.random() * number);
  };

  return { insert_marker };
})();

displayController.draw_board();
gameController.loadfromStorage();
