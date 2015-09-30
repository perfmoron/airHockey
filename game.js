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
console.log(paddleSound);

var snd = new Audio("sounds/smb_paddle.wav"); // buffers automatically when created


// Initialise scores for the players
//sessionStorage.setItem("player1Score", 0);
//sessionStorage.setItem("player2Score", 0);

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
            setInterval(draw, 5); 
        } else {     
             swal("Cancelled", "You have decided to cancel the game!", "info");   
        } 
    });   
}

function finishGame(playerId){
    
    swal({   
        title: "GAME OVER!",   
        text: playerId+" wins! Press restart to start another game",
        //type: "info",  
        confirmButtonColor: "#04B4AE",   
        confirmButtonText: "Re-start game",    
        closeOnConfirm: true,   
        closeOnCancel: false 
        }, 
        
    function(isConfirm){   
        if (isConfirm) {  
            resetScores();    
            setInterval(draw, 5); 
        } else {     
            swal("Cancelled", "You have decided to cancel the game!", "info");   
        } 
    });
}

/**
function enterName(Player){
    swal({ 
        title: "Enter player name!", 
        text: Player, 
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
*/

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

function drawPaddle2(xAxis2,yAxis2,p2Width, p2Height) {           
    ctx.beginPath();
    ctx.rect(xAxis2, yAxis2, p2Width, p2Height);
    ctx.fillStyle = "#006600";
    ctx.fill();
    ctx.closePath();
}

function windowControl(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

function drawMessageOverlay(message)
{
    var overlayWidth = canvas.width*0.6;
    var overlayHeight = canvas.height*0.4;
    var overlayX = canvas.width/2-overlayWidth/2;
    var overlayY = canvas.height/2-overlayHeight/2; 
            
    ctx.beginPath();
    ctx.rect(overlayX,overlayY , overlayWidth, overlayHeight);
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fill();        
    ctx.closePath();
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    var textSize = ctx.measureText(message);
    ctx.fillText(message, canvas.width/2 - textSize.width/2 , overlayY + overlayHeight*0.5);   
    console.log('filled text ' + message);
}

function finishRound(playerId){ 
   
    swal({   
        title: playerId+" wins!",   
        text: "Click the start button to start the game",   
        confirmButtonColor: "#04B4AE",   
        confirmButtonText: "Start game",    
        closeOnConfirm: true,   
        closeOnCancel: false 
        }, 
        
    function(isConfirm){   
        if (isConfirm) {   
            startGame();
            setInterval(draw, 5); 
        } else {     
          swal("Cancelled", "You have decided to cancel the game!", "info"); 
        } 
    }); 
}
    
function drawScore() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#151515";
    ctx.fillText("Player 1: "+sessionStorage.getItem("player1Score"), 30, 20);
    ctx.fillText("Player 2: "+sessionStorage.getItem("player2Score"), canvas.width-120, 20);
}

function eraseScore() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Player 1:   ", 30, 20);
    ctx.fillText("Player 2:   ", canvas.width-120, 20);
}

function resetScores() {
    sessionStorage.setItem("player1Score", "0");
    sessionStorage.setItem("player2Score", "0"); 
}

function incrementAndStoreScores(playerId) {
    
    var player1Score = parseInt(sessionStorage.getItem("player1Score"));
    var player2Score = parseInt(sessionStorage.getItem("player2Score"));
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
        drawMessageOverlay("Sorry the browser does not support local storage");
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

    var player1Score = sessionStorage.getItem("player1Score");
    var player2Score = sessionStorage.getItem("player2Score");
    
    windowControl();
    var paddleX2 = canvas.width-paddle2Width;
    drawBall();
    drawPaddle1(paddleX1,paddleY1,paddle1Width,paddle1Height);
    drawPaddle2(paddleX2,paddleY2,paddle2Width,paddle2Height);
    drawScore();
    
    if(x + dx > canvas.width-ballRadius-paddle2Width || x + dx < ballRadius+paddle1Width){
        if( (y > paddleY1 && y < paddleY1 + paddle1Height)||(y > paddleY2 && y < paddleY2 + paddle2Height)){       
            snd.play();
            dx = -dx;
        } else if ( x + dx > canvas.width-ballRadius && player1Score < gameOverScore ) {
            //player1Score ++;            
            //alert("Player 1! Ready");
            incrementAndStoreScores(1);
            eraseScore(); 
            drawScore();
            //drawMessageOverlay("Player 1 wins the round!");   
            finishRound("Player 1");  
        } else if ( x + dx < ballRadius && player2Score < gameOverScore ) {
            //player2Score ++;
            //gameStatus = 1;
            incrementAndStoreScores(2);
            eraseScore();  
            drawScore(); 
            //drawMessageOverlay("Player 2 wins the round!");
            finishRound("Player 2"); 
        } else if (player1Score == gameOverScore) {      
            finishGame("Player 1")
        }   else if (player2Score == gameOverScore) {      
            finishGame("Player 2")
        }
    }

    if(y + dy < ballRadius || y + dy > canvas.height-ballRadius){
        dy = -dy;
    }
    
    if(player1UpPressed && paddleY1 < canvas.height-paddle1Height) {
        paddleY1 += 7;
    }
    else if(player1DownPressed && paddleY1 > 0) {
        paddleY1 -= 7;
    }
    
    if(player2UpPressed && paddleY2 < canvas.height-paddle2Height) {
        paddleY2 += 7;
    }
    else if(player2DownPressed && paddleY2 > 0) {
        paddleY2 -= 7;
    }
    
    x += dx;
    y += dy;
}

document.window.onload = startGame();