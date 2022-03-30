//We are creating an object of canvas which was all the below mentioned properties.
var canvas = document.getElementById('gameCanvas'),
    canvasContext = canvas.getContext('2d'),
    ballPositionX = canvas.width/2,
    ballPositionY = canvas.height/2,
    ballSize = 20,
    ballVelocityX = 8,
    ballVelocityY = 0,
    fps = 60,
    paddleWidth = 10,
    paddleHeight = 100,
    paddleOneY = 250,
    paddleOneDirectionY = null,
    paddleOneVelocityY = 15,
    paddleTwoY = 250,
    paddleTwoDirectionY = null,
    paddleTwoVelocityY = 10,
    playerOneScore = 0,
    playerTwoScore = 0,
    userName = document.getElementById('userName'),
    startMenu = document.getElementById('startMenu'),
    pauseMenu = document.getElementById('pauseMenu'),
    gameOverMenu = document.getElementById('gameOverMenu'),
    gameplay = document.getElementById('gameplay'),
    startBtn = document.getElementById('startBtn'),
    continueBtn = document.getElementById('continueBtn'),
    quitBtn = document.getElementById('quitBtn'),
    restartBtn = document.getElementById('restartBtn'),
    againBtn = document.getElementById('againBtn'),
    gameMessage = document.getElementById('gameMessage'),
    levelUp = document.getElementById('levelUp'),
    scoreMessage = document.getElementById('scoreMessage'),
    gamePaused = false,
    gameInProgress = false,
    scoreToWin = 10,
    difficultyLevel = 1,
    gameInterval = window.setInterval(function() {});

canvas.width = window.innerWidth; //We are setting the width of the canvas as the width of the screen i.e it will be responsive
canvas.height = window.innerHeight; //We are setting the height of the canvas as the height of the screen i.e it will be responsive
ballPositionY = canvas.height/2 - ballSize/2 
paddleOneY = canvas.height/2 - paddleHeight/2;
paddleTwoY = canvas.height/2 - paddleHeight/2;
ballVelocityY = getRandomNumber(-5,5) * (.25 * difficultyLevel), //depending on the difficulty level the position of the ball is calculated

window.addEventListener('resize', windowResize); //When the window get resized we will get the width and height of canvas again
startBtn.addEventListener('click', startGame); //When the game is started startGame method is called
continueBtn.addEventListener('click', resumeGame); //When the game is started startGame method is called
restartBtn.addEventListener('click', resetGame); //When we reset the game resetGame method is called
quitBtn.addEventListener('click', quitGame);
againBtn.addEventListener('click', resetGame); //When we plag again the game resetGame method is called
document.addEventListener('keydown', keyDown); //This is used for up and down arrow of keys
document.addEventListener('keyup', keyUp);
levelUp.addEventListener('click', onLevelUp);

startMenu.className = 'active';
pauseMenu.className = '';
gameplay.className = '';
gameOverMenu.className = '';

//on blur pause the game
window.onblur = function() {
  if(gameInProgress) pauseGame();  
}

//On Start Button Click Start the Game
function startGame(isNewGame = false) {
  if(userName.value === ''){
    alert('Please Enter Player Name.');
    return;
  }
  if(isNewGame){
    difficultyLevel = parseInt(document.getElementById('level').value);
  }
  gameInProgress = true;
  gameplay.className = '';
  startMenu.className = '';
  gameOverMenu.className = '';
  pauseMenu.className = '';
  gamePaused = false;
  gameInterval = window.setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/fps);
}

function quitGame(){
  reset(1);
  difficultyLevel = 1;
  userName.value = '';
  startMenu.className = 'active';
  pauseMenu.className = '';
}

//This will reset the game back to initial state
function resetGame() {
  reset(1);
  startGame(true);
}

function onLevelUp(){
  difficultyLevel = difficultyLevel + 1;
  reset(difficultyLevel);
  startGame(false);
}

function reset(level){
  playerOneScore = 0;
  playerTwoScore = 0;
  difficultyLevel = parseInt(level);
  ballPositionX = canvas.width/2 - ballSize/2;
  ballPositionY = canvas.height/2 - ballSize/2;
  paddleOneY = canvas.height/2 - paddleHeight/2;
  paddleTwoY = canvas.height/2 - paddleHeight/2;
  ballVelocityY = getRandomNumber(-5,5) * (.25 * difficultyLevel);
}

function togglePause() {
  if(gamePaused) {
    resumeGame();
  } else {
    pauseGame();
  }
} 

//This will make the game pause
function pauseGame() {
  if(!gamePaused) {
    gamePaused = true;
    gameplay.className = '';
    pauseMenu.className = 'active';
    clearInterval(gameInterval);
  }
}

//This will again resume the game
function resumeGame() {
  if(gamePaused) {
    gamePaused = false;
    gameplay.className = '';
    pauseMenu.className = ''; 
    startGame(false);
  }
}

function windowResize() {
  resetBall();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawEverything();
}

function isTargetUserName(e){
  if(e.target.id === 'userName'){
    return true;
  }else{
    return false;
  }
}

//Used to handle arrow up/down and enter key
function keyDown(e) {
  if (isTargetUserName(e) === false){
    e.preventDefault();
    switch(e.keyCode) {
      case 13:       
        if(gameInProgress) togglePause();
        break;
      case 38:
        if(!gamePaused) paddleOneDirectionY = 'up';
        break;
      case 40:
        if(!gamePaused) paddleOneDirectionY = 'down';
        break;
    }
  }
}


function keyUp(e) {
  paddleOneDirectionY = null;
}

function resetBall() {
  ballVelocityX = -ballVelocityX;
  ballVelocityY = getRandomNumber(-5,5) * (.25 * difficultyLevel);
  ballPositionX = canvas.width/2;
  ballPositionY = canvas.height/2;
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function randomizeGame() {
  paddleTwoVelocityY = getRandomNumber(10,20) * (.25 * difficultyLevel);
}

//When the game is over
function gameOver(playerWon) {
  gameInProgress = false;
  clearInterval(gameInterval);
  gameMessage.textContent = '';
  scoreMessage.textContent = "Your Score: " + playerOneScore + " & opponent Score:" + playerTwoScore;
  againBtn.textContent = '';

  if(playerWon) {
    gameMessage.textContent = 'You won!';
    againBtn.textContent = 'Play again';
    levelUp.hidden = false;
    againBtn.hidden = true;
  } else {
    gameMessage.textContent = 'You lost!';
    againBtn.textContent = 'Try again';
    levelUp.hidden = true;
    againBtn.hidden = false;
  }
  gameplay.className = '';
  gameOverMenu.className = 'active'; 
}

function moveEverything() {
  ballPositionX = ballPositionX + ballVelocityX;
  if(ballPositionX > canvas.width - paddleWidth*2 - ballSize/2) {
    if(ballPositionY >= paddleTwoY && ballPositionY <= paddleTwoY + paddleHeight && ballPositionX < canvas.width - paddleWidth) {
      ballVelocityX = -ballVelocityX;
      if(ballPositionY >= paddleTwoY && 
         ballPositionY < paddleTwoY + paddleHeight*.2) {
        ballVelocityY = -15 * (.25 * difficultyLevel);
      } else if(ballPositionY >= paddleTwoY + paddleHeight*.2 && 
                ballPositionY < paddleTwoY + paddleHeight*.4) {
        ballVelocityY = -10 * (.25 * difficultyLevel);
      } else if(ballPositionY >= paddleTwoY + paddleHeight*.4 && 
                ballPositionY < paddleTwoY + paddleHeight*.6) {
        ballVelocityY = getRandomNumber(-5,5);;
      } else if(ballPositionY >= paddleTwoY  + paddleHeight*.6 && 
                ballPositionY < paddleTwoY + paddleHeight*.8) {
        ballVelocityY = 10 * (.25 * difficultyLevel);
      } else if(ballPositionY >= paddleTwoY + paddleHeight*.8 && 
                ballPositionY < paddleTwoY + paddleHeight) {
        ballVelocityY = 15 * (.25 * difficultyLevel);
      }
    } else if(ballPositionX > canvas.width) {
      resetBall();
      playerOneScore++;
      //difficultyLevel = playerOneScore*.5;
      if(playerOneScore === scoreToWin) gameOver(true);
    }
    randomizeGame();
  } else if(ballPositionX < paddleWidth*2 + ballSize/2) {
    if(ballPositionY >= paddleOneY && 
       ballPositionY <= paddleOneY + paddleHeight && 
       ballPositionX > paddleWidth + ballSize/2) {
      ballVelocityX = -ballVelocityX;
      if(ballPositionY >= paddleOneY && 
         ballPositionY < paddleOneY + paddleHeight*.2) {
        ballVelocityY = -20 * (.25 * difficultyLevel);
      } else if(ballPositionY >= paddleOneY + paddleHeight*.2 && 
                ballPositionY < paddleOneY + paddleHeight*.4) {
        ballVelocityY = -10 * (.25 * difficultyLevel);
      } else if(ballPositionY >= paddleOneY + paddleHeight*.4 && 
                ballPositionY < paddleOneY + paddleHeight*.6) {
        ballVelocityY = 0 * (.25 * difficultyLevel);
      } else if(ballPositionY >= paddleOneY  + paddleHeight*.6 && 
                ballPositionY < paddleOneY + paddleHeight*.8) {
        ballVelocityY = 10 * (.25 * difficultyLevel);
      } else if(ballPositionY >= paddleOneY + paddleHeight*.8 && 
                ballPositionY < paddleOneY + paddleHeight) {
        ballVelocityY = 20 * (.25 * difficultyLevel);
      }
    } else if(ballPositionX <= -ballSize) {
      resetBall();
      playerTwoScore++;
      if(playerTwoScore === scoreToWin) gameOver(false);
    }
    randomizeGame();
  }
  
  ballPositionY = ballPositionY + ballVelocityY; 
  if(ballPositionY > canvas.height - ballSize/2) {
    ballVelocityY = -ballVelocityY;
    ballPositionY = canvas.height - ballSize/2;
  } else if(ballPositionY < ballSize/2) {
    ballVelocityY = -ballVelocityY;
    ballPositionY = ballSize/2;
  }
  
  if(paddleOneDirectionY === 'up' && paddleOneY >= 0) {
    paddleOneY = paddleOneY - paddleOneVelocityY;
  } else if(paddleOneDirectionY === 'down' && 
            paddleOneY < (canvas.height - paddleHeight) ) {
    paddleOneY += paddleOneVelocityY; 
  }
  
  if(ballPositionY < paddleTwoY) {
    paddleTwoY -= paddleTwoVelocityY;
  } else if(ballPositionY > paddleTwoY + paddleHeight) {
    paddleTwoY += paddleTwoVelocityY;    
  }
  
}

function drawEverything() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'white';
  canvasContext.beginPath();
  canvasContext.arc(ballPositionX, ballPositionY, ballSize/2, 0, Math.PI*2, true);
  canvasContext.fill();
  
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(paddleWidth,paddleOneY,paddleWidth,paddleHeight); // x, y, w, h
  
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(canvas.width - paddleWidth - paddleWidth,paddleTwoY,paddleWidth,paddleHeight); // x, y, w, h
  
  canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
  canvasContext.font = "200px 'Roboto', Arial";
  canvasContext.textAlign = "center";
  canvasContext.fillText(playerOneScore,canvas.width*.25,canvas.height/2 + 75);
  
  canvasContext.fillStyle = 'rgba(255,255,255,0.2)';
  canvasContext.font = "200px 'Roboto', Arial";
  canvasContext.textAlign = "center";
  canvasContext.fillText(playerTwoScore,canvas.width*.75,canvas.height/2 + 75);
  
  canvasContext.strokeStyle = 'rgba(255,255,255,0.2)';
  canvasContext.beginPath();
  canvasContext.moveTo(canvas.width/2,0);
  canvasContext.lineTo(canvas.width/2,canvas.height);
  canvasContext.stroke();
}