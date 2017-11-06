/* =====================================================
================== UI MODULE ===================
========================================================
*/

var Game = (function() {
    
  
    const board = {
        
        buttons: [
            
          'button-0',
          'button-1',
          'button-2',
          'button-3',
            
        ],
        
        sounds: [   
        
       new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
       new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
       new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
       new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
],
       

        
        controls: {
               powerButton: '.on-off-toggle',
               startButton: '.start-btn',
               strictButton: 'strict-button',
               strictLight: 'strict-light',
               roundCounter: 'counter'
            
        },
    };   
   
    
    const gameState = {
         
        power: false,
        counter: undefined,
        strict: false,
        sequence: [],
        player: [],
        gameOver: false,
        playing: false,
        reset: false,
         
     };
    
/* =====================================================
================== Game functions ======================
========================================================
*/
    

     var generateNumber = function() {
         let rand = Math.round(Math.random() * 3);
         gameState.sequence.push(rand);
         getId('counter').innerHTML = gameState.counter;
     };
    
    var playSequence = function() {
        
        
        let i = 0;
        
       function recurse(){    // rename this
           
          if(i < gameState.sequence.length && gameState.playing === true){
          setTimeout(() => {
          displaySequence(gameState.sequence[i]);    
          i++;
    
          recurse();
      }, 800);
    
    }else{
        
        getId('board').addEventListener('click', playerMove);
        
    }
   
  }
  recurse();
};
  
    function displaySequence(index){
      
      if(index === undefined || index === -1){
           return;
       }
          
         setTimeout(() => {
            getId('button-' + index).style.opacity = .3;
            getId('button-' + index).style.boxShadow = "4px 5px 5px #5d5d5d";
            board.sounds[index].play();
            
        }, 10);
        
        setTimeout(() => {
         getId('button-' + index).style.opacity = 1;
         getId('button-' + index).style.boxShadow = 'none';
    }, 200);
    
        
       
        
         
        
        
    };
    
    function playerMove(num) {
        
        let i = gameState.player.length;
        // retrieve index of event
        let index = board.buttons.indexOf(num.target.id);
        if(index === -1 || index === undefined){
            return;
        }
   
        if(index === gameState.sequence[i]){
            displaySequence(index);    
            gameState.player.push(index); 
            
            if(gameState.player.length === gameState.sequence.length){
                if(gameState.player.length === 20){
                    winner();
                    
                }else { 
                    
                        gameState.counter++;
                        disableButtons();
				                generateNumber();
                        gameState.player.length = 0;
                        playSequence();
                   
                }
            }
        }else if(index != gameState.sequence[i]){
            if(gameState.strict){
                loser();
            }else{
                tryAgain();
                gameState.player.length = 0;
                playSequence();
            }
        }                    
    };
    
        function winner() {
      
          // TODO: play a victorius sound
            
          // show icon 
           getId('counter').classList.add('ion-android-happy');
           getId('counter').innerHTML = '';
           setInterval(() => {
               getId('counter').classList.remove('ion-android-happy');
           }, 2000);  
           disableButtons();
          // press start to initialize the board again    
     
    };
    
        function loser() {
      
          // TODO: play a sad sound
            
          // show icon
           getId('counter').classList.add('ion-android-sad');
           getId('counter').innerHTML = '';
           setInterval(() => {
               getId('counter').classList.remove('ion-android-sad');
           }, 2000);        
           disableButtons();
          // press start to initialize the board again  
     
    };
    
        function tryAgain() {
          
           getId('counter').classList.add('ion-refresh');
           getId('counter').innerHTML = '';
           setInterval(() => {
               getId('counter').classList.remove('ion-refresh');
               getId('counter').innerHTML = gameState.counter; 
           }, 200);    
               
           disableButtons();
       };
        
          function getId(ID) {            
                return document.getElementById(ID);
       }; 
    
    
    var strictToggle = function() {
      
    if(gameState.strict){
            gameState.strict = false;
            getId('strict-light').style.backgroundColor = '3a3c3a';
            console.log('strict is off');
        }else{
            gameState.strict = true;
            getId('strict-light').style.backgroundColor = 'red';
            console.log('strict is on');
        }
    };
    
    var disableButtons = function() {
        document.getElementById('board').removeEventListener('click', playerMove);
  
    };
    
    var resetBoard = function() {
      
         // set counter to 0
        gameState.counter = 1;
        // set power to true
        gameState.power = true;
        // set strict to false
        gameState.strict = false;
        // sequence to []
        gameState.sequence = [];
        // player to empty
        gameState.player = [];
        // console.log(gameState);
        gameState.playing = true;
        // display counter
        getId('counter').innerHTML = '--';
        
    };
       
 /* ======================================================
================== Public functions ======================
==========================================================
*/
    
    
    return {
    
        getBoard: function() {
          return board;  
        },
        
        getGamestate: function() {
          return gameState;  
        },
        
        getRandom: function() {
          return generateNumber;  
        },
        
        playSeq: function() {
          return playSequence;  
        },
      
        playerMove: function() {
          return playerMove;  
        },
        
        getStrict: function() {
          return strictToggle;  
        },
        
        getDisableBtn: function() {
          return disableButtons;
        },
        
        getReset: function() {
          return resetBoard;  
        },
        
    };
      
    
})();

    
 /* ======================================================
================== controls module =======================
==========================================================
*/

var controller = (function(game) {
    
const board = game.getBoard();
const gameState = game.getGamestate();  
const getRandom = game.getRandom(); 
const getPlaySeq = game.playSeq();  
const strictMode = game.getStrict(); 
const removeBtn = game.getDisableBtn();   
const resetBoard = game.getReset();    
 
        
    var initializeBoard = function() {  

        
        if(!gameState.power) {
            
        gameState.power = true;
        // set strict to false
        gameState.strict = false;
        // not playing yet but define it
        gameState.playing = false;
        // display counter
        countDisplay.innerHTML = '--';
         
       
      }else{
        // set counter to 0
        gameState.counter = undefined;
        // set power to true
        gameState.power = false;
        // set strict to false
        gameState.strict = undefined;
        // sequence to []
        gameState.sequence = undefined;
        // player to empty
        gameState.player = undefined;
        // console.log(gameState);
        gameState.playing = false;
        // display counter
        countDisplay.innerHTML = '';
        // disbale clicks if game is turned off
        removeBtn(); 
        // turn of strict light
        strictDisplay.style.backgroundColor = '3a3c3a';
          
      }
       
    };
    
     var startGame = function() {
         
      if(gameState.power){
        // set counter to 0
        gameState.counter = 1;
        // sequence to []
        gameState.sequence = [];
        // player to empty
        gameState.player = []; 
        // set playing to true
        gameState.playing = true; 
        // push new number to sequence
        getRandom();
        // call the function that plays the sequence
        getPlaySeq();
    
        }
         
     };
        
    var strictToggle = function() {
        // if game is on
        if(gameState.power){
        // toggle between strict on and strict off
        strictMode();    
            
        }
   };  
        
    document.querySelector('.instructions').addEventListener('click', function(){ 
      let dir = document.querySelector('.directions');
      dir.style.visibility === 'hidden' ? dir.style.visibility = 'visible' : dir.style.visibility = 'hidden';
      dir.innerText = 'Hello and welcome! To turn on and play Simon, simply click on the on/ off toggle switch, hit start and turn your thinking cap on! If you feel daring, you can turn on strict mode, if you fail, you will lose the round, otherwise you will continuosly play until you are defeated, or of course you win! Good luck! Hit the instructions button to remove the directions.';
     })
    document.querySelector(board.controls.powerButton).addEventListener('click', initializeBoard);
    document.querySelector(board.controls.startButton).addEventListener('click', startGame);
    document.getElementById(board.controls.strictButton).addEventListener('click', strictToggle);
    const countDisplay = document.getElementById(board.controls.roundCounter);
    const strictDisplay = document.getElementById(board.controls.strictLight);
       
})(Game);


