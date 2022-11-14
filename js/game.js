function init(player, OPPONENT) {
    const gameOverElement = document.querySelector('.gameover');
    const cvs = document.getElementById('cvs');
    const ctx = cvs.getContext('2d');

    let board = [];
    const COLUMN = 3;
    const ROW = 3;
    let SPACE_SIZE = 150;
    if (document.documentElement.clientWidth < 450) {
        cvs.width = 360;
        cvs.height = 360;
        SPACE_SIZE = 120;
    }

    // store players move
    let gameData = new Array(9);

    // by default current player is man 
    let currentPlayer = player.man;

    // load O / X img
    const xImage = new Image();
    xImage.src = 'img/X.png';

    const oImage = new Image();
    oImage.src = 'img/O.png';

    // win combos
    const COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // game over vars
    let GAME_OVER = false;

    // Draw board
    function drawBoard() {
        // every spase have unique id
        let id = 0;

        for (let i = 0; i < ROW; i++) {
            board[i] = [];
            for (let j = 0; j < COLUMN; j++) {
                board[i][j] = id;
                id++;

                // draw the spases
                ctx.strokeStyle = "#000";
                ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
            }
        }
        console.log(board);
    }
    drawBoard();

    // ON CLICK
    cvs.addEventListener('click', (e) => {

        // check if game over
        if (GAME_OVER) {return;}

        let X = e.clientX - cvs.getBoundingClientRect().x;
        let Y = e.clientY - cvs.getBoundingClientRect().y;

        // calc j/i 
        let i = Math.floor(Y / SPACE_SIZE);
        let j = Math.floor(X / SPACE_SIZE);

        // give oid 
        let id = board[i][j];

        //prevent playing on the one space
        if(gameData[id]) {
            return;
        }

        // store player move's to game data
        gameData[id] = currentPlayer;

        // draw the move on board
        drawOnBoard(currentPlayer, i, j);

        // Chick if the palayer wins
        if(isWinner(gameData, currentPlayer)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return;
        }

        // check if its a tie game
        if(isTie(gameData)) {
            showGameOver('tie');
            GAME_OVER = true;
            return;
        }

        if(OPPONENT == 'computer') {
            // get id of the space using minimax algoritm
            let id = minimax(gameData, player.computer).id;

            // store player move's to game data
            gameData[id] = player.computer;

            // get i / j of space
            let space = getIJ(id);

            // draw the move on board
            drawOnBoard(player.computer, space.i, space.j);

            // Check if the computer wins
            if(isWinner(gameData, player.computer)){
                showGameOver(player.computer);
                GAME_OVER = true;
                return;
            }

            // check if its a tie game
            if(isTie(gameData)) {
                showGameOver('tie');
                GAME_OVER = true;
                return;
            }
        } else {
            // give turn to the other player
            currentPlayer = currentPlayer == player.man ? player.friend : player.man;
        }
    });

    // MINIMAX FUNCTION
    function minimax(gameData, PLAYER) {
        // BASE
        if( isWinner(gameData, player.computer) ) { return { evaluation : +10}; }
        if( isWinner(gameData, player.man     ) ) { return { evaluation : -10}; }
        if( isTie(gameData)                     ) { return { evaluation : 0}; }

        // LOOK FOE EMPTY SPASES
        let EMPTY_SPACES = getEmptySpaces(gameData);

        // SAVE ALL MOVES AND THEIR EVALUATIONS
        let moves = [];

        // LOOP OVER THE EMPTY SPACES TO EVALUATE THEM
        for( let i = 0; i < EMPTY_SPACES.length; i++) {
            // GET ID OF THE EMPTY SPACE
            let id = EMPTY_SPACES[i];

            // BACK UP EMPTY SPACE
            let backup = gameData[id];

            // MAKE THE MOVE FOR A PLAYER
            gameData[id] = PLAYER;

            // SAVE THE MOVE ID AND EVALUATION
            let move = {};
            move.id = id;

            // THE MOVE EVALUATION
            if( PLAYER == player.computer) {
                move.evaluation = minimax(gameData, player.man).evaluation;
            } else {
                move.evaluation = minimax(gameData, player.computer).evaluation;
            }

            // RESTORE SPACE
            gameData[id] = backup;

            // SAVE MOVE TO MOVES ARRAY
            moves.push(move);
        }

        // MINIMAX ALGORITHM
        let bestMove;

        if( PLAYER == player.computer) {
            // MAXIMAZER
            let bestEvaluation = -Infinity;
            for( let i = 0; i < moves.length; i++) {
                if( moves[i].evaluation > bestEvaluation) {
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                } 
            }
        } else {
            // MINIMAZER
            let bestEvaluation = +Infinity;
            for( let i = 0; i < moves.length; i++) {
                if( moves[i].evaluation < bestEvaluation) {
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                } 
            }
        }

        return bestMove;
    }

    // get empty spaces
    function getEmptySpaces(gameData) {
        let EMPTY = [];

        for(let id = 0; id < gameData.length; id++) {
            if(!gameData[id]) {
                EMPTY.push(id);
            }
        }
        return EMPTY;
    }

    // get i / j of space
    function getIJ(id) {
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if(id == board[i][j]) {
                    return {i : i, j: j};
                }
            }
        }
    }

    // draw on board
    function drawOnBoard(player, i, j) {
        let img = player == "X" ? xImage : oImage;

        // x, y it a j, i in a ckick event
        ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
    }


    // check for a winner
    function isWinner(gameData, player){
        for(let i = 0; i < COMBOS.length; i++){
            let won = true;

            for(let j = 0; j < COMBOS[i].length; j++){
                
                let id = COMBOS[i][j];
                won = gameData[id] == player && won;
            }

            if(won){
                return true;
            }
        }
        return false;
    }


    // check for a tie game
    function isTie(gameData) {
        let isBoardFill = true;

        for (let i = 0; i < gameData.length; i++) {
            isBoardFill = gameData[i] && isBoardFill;    
        }

        return isBoardFill;
    }
    

    // show game over
    function showGameOver(player) {
        let message = player == 'tie' ? 'Oops No Winner' : 'The Winner is';
        let imgSrc = `img/${player}.png`;

        gameOverElement.innerHTML = `
            <h1>${message}</h1>
            <img class="winner-img" src="${imgSrc}" alt="${player}">
            <div class="play" onclick="location.reload()">Play Again!</div>
        `;

        gameOverElement.classList.remove('hide');
    }

    
}