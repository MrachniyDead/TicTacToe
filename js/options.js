// Select Elements
const options = document.querySelector('.options');
const gameOverElement = document.querySelector('.gameover');
// Select Btns
const computerBtn = options.querySelector('.computer');
const friendBtn = options.querySelector('.friend');
const xBtn = options.querySelector('.x');
const oBtn = options.querySelector('.o');
const playBtn = options.querySelector('.play');
const cvs = document.getElementById('cvs');
if (document.documentElement.clientWidth < 450) {
    cvs.width = 360;
    cvs.height = 360;
    SPACE_SIZE = 120;
}

// users options
let OPPONENT;
const player = {};

// add events
computerBtn.addEventListener('click', function() {
    OPPONENT = 'computer';
    switchActive(friendBtn, computerBtn);
});
friendBtn.addEventListener('click', function() {
    OPPONENT = 'friend';
    switchActive(computerBtn, friendBtn);
});
xBtn.addEventListener('click', function() {
    player.man = 'X';
    player.computer = 'O';
    player.friend  = 'O';

    switchActive(oBtn, xBtn);
});
oBtn.addEventListener('click', function() {
    player.man = 'O';
    player.computer = 'X';
    player.friend  = 'X';

    switchActive(xBtn, oBtn);
});
playBtn.addEventListener('click', function() {
    // chech if user select opponent
    if(!OPPONENT) {
        computerBtn.style.backgroundColor = '#F00';
        friendBtn.style.backgroundColor = '#F00';
        return; 
    }

    if(!player.man) {
        xBtn.style.backgroundColor = '#F00';
        oBtn.style.backgroundColor = '#F00';
        return; 
    }

    init(player, OPPONENT);
    options.classList.add('hide');
});

function switchActive(off, on) {
    off.classList.remove('active');
    on.classList.add('active');
}