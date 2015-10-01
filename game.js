var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var ballRadius = 10;
var dx = 2;
var dy = -2;
var player1UpPressed = false;
var player1DownPressed = false;
var player2UpPressed = false;
var player2DownPressed = false;
var paddle1Height = 90;
var paddle1Width = 15;
var paddle2Height = 90;
var paddle2Width = 15;
var paddleX1 = 0;
var paddleY1 = (canvas.height - paddle1Height)/2;
var paddleX2 = canvas.width-paddle2Width;
var paddleY2 = (canvas.height - paddle2Height)/2;
var gameOverScore = 3;
var scoreUpdated = 0;
var paddleSound = document.getElementById('paddle');
var intervalId;
var player1Score = sessionStorage.getItem("player1Score");
var player2Score = sessionStorage.getItem("player2Score");

var paddleSnd = new Audio("sounds/smb_paddle.wav");
var gameOverSnd = new Audio("sounds/smb_gameover.wav");
var roundOverSnd = new Audio("sounds/smb_mariodie.wav");
var roundPowSnd = new Audio("sounds/smb_powerup.wav");


// Initialise scores for the players
//sessionStorage.setItem("player1Score", 0);
//sessionStorage.setItem("player2Score", 0);

/*
var xmlString = "<div id='sse2'> \
                    <div id='sses2'> \
                    <ul>\
                    <li><a href='?menu=2&skin=3&p=Javascript-Menus'>Pause</a></li> \
                    <li><a href='?menu=2&skin=3&p=Horizontal-Menus'>Play</a></li> \
                    <li><a href='?menu=2&skin=3&p=Web-Menus'>Stop</a></li> \
                    </ul> \
                    </div> \
                 </div>"
  , parser = new DOMParser()
  , doc = parser.parseFromString(xmlString, "text/xml");
doc.firstChild // => <div id="foo">...
doc.firstChild.firstChild // => <a href="#">...
*/

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false); 
    
function keyDownHandler(e) {
    if(e.keyCode == 65) {
        player1UpPressed = true;
    }
    else if(e.keyCode == 83) {
        player1DownPressed = true;
    } 
    else if(e.keyCode == 101) {
        player2UpPressed = true;
    } 
    else if(e.keyCode == 102) {
        player2DownPressed = true;
    }
}
    
function keyUpHandler(e) {
    if(e.keyCode == 65) {
        player1UpPressed = false;
    }
    else if(e.keyCode == 83) {
        player1DownPressed = false;
    }
    else if(e.keyCode == 101) {
        player2UpPressed = false;
    }
    else if(e.keyCode == 102) {
        player2DownPressed = false;
    }
}

//swal({   title: "Error!",   text: "Here's my error message!",   type: "error",   confirmButtonText: "Cool" });

function startGame(){
    
    //Initialise scores
    sessionStorage.setItem("player1Score", "0");
    sessionStorage.setItem("player2Score", "0");   
    
    swal({   
        title: "Welcome to internet Air hockey!",   
        text: "Click Start to start a game",   
        //type: "info",  
        confirmButtonColor: "#04B4AE",   
        confirmButtonText: "Start game",    
        closeOnConfirm: true,   
        closeOnCancel: false 
        }, 
        
    function(isConfirm){   
        if (isConfirm) {     
             intervalId = setInterval(draw, 1); 
        } else {     
             swal("Cancelled", "You have decided to cancel the game!", "info");   
        } 
    });  
}

function pauseGame(){
   window.clearInterval(intervalId);
}

function resumeGame(){
   window.setInterval(intervalId);
}

function reStartGame(){
    
    x = canvas.width/2;
    y = canvas.height-30;
    dx = -2;
    dy = 2;
      
    intervalId = setInterval(draw, 1);  
}

function quitGame(){
    
    pauseGame();
    swal({   
        title: "Do you want to quit the game?",   
        text: "Game scores would be lost!",  
        type: "error",  
        confirmButtonColor: "#04B4AE",   
        confirmButtonText: "Quit",    
        closeOnConfirm: true,   
        closeOnCancel: false 
        }, 
        
    function(isConfirm){   
        if (isConfirm) { 
            if(player1Score > player2Score)  {
                finishGame("Player 1");
            } else if (player1Score == player2Score) {
                finishGame("Nobody");
            } else {
                finishGame("Player 2");
            }         
        } else {     
          swal("Cancelled", "You have decided to cancel the game!", "info"); 
        } 
    }); 
    
}


function finishGame(playerId){
    
    gameOverSnd.play();
    pauseGame();    
    swal({   
        title: "GAME OVER!",   
        text: playerId+" wins! Press restart to start a new game",
        //type: "info",  
        confirmButtonColor: "#04B4AE",   
        confirmButtonText: "Re-start game",    
        closeOnConfirm: true,   
        closeOnCancel: false 
        }, 
        
    function(isConfirm){   
        if (isConfirm) {  
            resetScores();  
            location.reload();  
            startGame();
        } else {     
            swal("Cancelled", "You have decided to cancel the game!", "info");   
        } 
    });
}

function finishRound(playerId) {
    
    roundOverSnd.play();
    swal({   
        title: playerId+" wins!",   
        text: "Click the resume button to resume the game",   
        confirmButtonColor: "#04B4AE",   
        confirmButtonText: "Resume game",    
        closeOnConfirm: true,   
        closeOnCancel: false 
        }, 
        
    function(isConfirm){   
        if (isConfirm) {   
            reStartGame();
        } else {     
          swal("Cancelled", "You have decided to cancel the game!", "info"); 
        } 
    }); 
}

function enterName(playerId){
    swal({ 
        title: "Enter name!"+ playerId, 
        text: playerId, 
        type: "input", showCancelButton: true, 
        closeOnConfirm: false, 
        animation: "slide-from-top", 
        inputPlaceholder: "Write something" }, 
        
        function (inputValue) { 
            if (inputValue === false) 
            return false; 
            if (inputValue === "") { 
                swal.showInputError("You need to write something!"); 
                return false 
            }
    swal("Nice!", "You wrote: " + inputValue, "success"); 
    });
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#000099";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle1(xAxis1,yAxis1,p1Width, p1Height) {
    ctx.beginPath();
    ctx.rect(xAxis1, yAxis1, p1Width, p1Height);
    ctx.fillStyle = "#FF3300";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle1PowUp(xAxis1,yAxis1,p1Width, p1Height) {
    ctx.beginPath();
    ctx.rect(xAxis1, yAxis1, p1Width, p1Height);
    ctx.fillStyle = "#8A2300";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle2(xAxis2,yAxis2,p2Width, p2Height) {           
    ctx.beginPath();
    ctx.rect(xAxis2, yAxis2, p2Width, p2Height);
    ctx.fillStyle = "#006600";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle2PowUp(xAxis2,yAxis2,p2Width, p2Height) {           
    ctx.beginPath();
    ctx.rect(xAxis2, yAxis2, p2Width, p2Height);
    ctx.fillStyle = "#002000";
    ctx.fill();
    ctx.closePath();
}

function windowControl(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
}
   
function drawScore() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#151515";
    ctx.fillText("Player 1: "+sessionStorage.getItem("player1Score"), 30, 20);
    ctx.fillText("Player 2: "+sessionStorage.getItem("player2Score"), canvas.width-150, 20);
}

function eraseScore() {
    //ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#00BFFF";
    ctx.fillRect(30, 0, 150, 30);
    ctx.fillRect(canvas.width-150, 0, 150, 30);
    //ctx.fillText("Player 1: "+sessionStorage.getItem("player1Score"), 30, 20);
    //ctx.fillText("Player 2: "+sessionStorage.getItem("player2Score"), canvas.width-120, 20);
}

function resetScores() {
    sessionStorage.setItem("player1Score", "0");
    sessionStorage.setItem("player2Score", "0"); 
}

function incrementAndStoreScores(playerId) {
    
    player1Score = parseInt(sessionStorage.getItem("player1Score"));
    player2Score = parseInt(sessionStorage.getItem("player2Score"));
    console.log(player1Score);
    console.log(player2Score);
    
    if(typeof(Storage) !== "undefined") {
        // Code for sessionStorage /sessionStorage.
             
        if (playerId == 1){   
            player1Score++;    
            sessionStorage.setItem("player1Score",String(player1Score));
            console.log("****"+sessionStorage.getItem("player1Score")+"****");
            scoreUpdated = 1;
        } else if (playerId == 2){
            player2Score++;
            sessionStorage.setItem("player2Score",String(player2Score));
            console.log("****"+sessionStorage.getItem("player2Score")+"****");
            scoreUpdated = 1;
        }       
    } else {
        swal("Sorry the browser does not support local storage");
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
        break;
        }
    }
}

/*
function playSound(soundName){

    var soundId = document.getElementById(soundName);
    ctx.soundId.load();
    ctx.soundId.play();
}
*/

function draw() {
   
    windowControl();
    var paddleX2 = canvas.width-paddle2Width;
    drawBall();
    drawPaddle1(paddleX1,paddleY1+paddle1Height/5,paddle1Width,paddle1Height*4/5);
    drawPaddle2PowUp(paddleX1,paddleY1,paddle1Width,paddle1Height/5);
    drawPaddle2PowUp(paddleX1,paddleY1+paddle1Height*4/5,paddle1Width,paddle1Height/5);
    drawPaddle2(paddleX2,paddleY2+paddle1Height/5,paddle2Width,paddle2Height*4/5);
    drawPaddle2PowUp(paddleX2,paddleY2,paddle2Width,paddle2Height/5);
    drawPaddle2PowUp(paddleX2,paddleY2+paddle2Height*4/5,paddle2Width,paddle2Height/5);
    drawScore();
    
     if(x + dx > canvas.width-ballRadius-paddle2Width || x + dx < ballRadius+paddle1Width){
        if( (y > paddleY1 && y < paddleY1 + paddle1Height)||(y > paddleY2 && y < paddleY2 + paddle2Height)){   
            if ( (y < (paddleY1+(paddle1Height/5))) || (y > ((paddleY1+(4*paddle1Height)/5))) || (y < (paddleY2+(paddle2Height/5)))  || (y > ((paddleY1+(4*paddle2Height)/5)))) {
                roundPowSnd.play();
                dx = -2*dx; 
                console.log('first');   
            } else {
                paddleSnd.play();
                dx = -dx/2;
                console.log('second');   
            }  
        } else if ( x + dx > canvas.width-ballRadius && player1Score < gameOverScore ) {   
            //roundOverSnd.play();   
            incrementAndStoreScores(1);
            eraseScore(); 
            drawScore();
            pauseGame(); 
            if (player1Score == gameOverScore) {      
                finishGame("Player 1");
            } else {
                finishRound("Player 1");
            }
        } else if ( x + dx < ballRadius && player2Score < gameOverScore ) {  
            
            incrementAndStoreScores(2);
            eraseScore();  
            drawScore(); 
            pauseGame();
            if (player2Score == gameOverScore) {      
                finishGame("Player 2");
            } else {
                finishRound("Player 2");
            }
        }         
    }

    if(y + dy < ballRadius || y + dy > canvas.height-ballRadius){
        dy = -dy;
    }
    
    if(player1UpPressed && paddleY1 < canvas.height-paddle1Height) {
        paddleY1 += 5;
    }
    else if(player1DownPressed && paddleY1 > 0) {
        paddleY1 -= 5;
    }
    
    if(player2UpPressed && paddleY2 < canvas.height-paddle2Height) {
        paddleY2 += 5;
    }
    else if(player2DownPressed && paddleY2 > 0) {
        paddleY2 -= 5;
    }
    
    x += dx;
    y += dy;
}

if(document.readyState === "complete") {
  document.window.onload = startGame();
}
else {
  window.addEventListener("onload", startGame());
}