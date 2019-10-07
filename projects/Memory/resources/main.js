let minutes = document.getElementById("min");
let seconds = document.getElementById("sec");
let move = document.getElementById("numMoves");
let stars = document.getElementsByClassName("fa-star");
let cards = document.getElementsByClassName("card");
let reset = document.getElementById("reset");
let board = document.getElementById("innerBoard");
let matches = document.getElementsByClassName("matches");
let restart = document.getElementById("restart");
let finalScore = document.getElementById("finalScore");
let hideEnd = document.getElementById("hideContainer");
let finalStars = document.getElementById("stars");
let finalTime = document.getElementById("finalTime")

let min = 0;
let sec = 0;
let guessOne = [];
let guessTwo = [];
let moves = 0;
let correct = 0;
const star = "<i class='fas fa-star fa-3x'></i>"


function randomizePick(num){
  return Math.floor(Math.random()*num);
}

// throw out all cards and start new game
function resetIt(){
  clearInterval(secondsCounter);
  clearInterval(minutesCounter);
  correct = 0;
  for (i=0; i<16; i++){
    cards[0].remove();
  }
  createGame();
}

// create new card pairs and reset all values back to default
function createGame() {
  let tempPairs = [["fa-battery-quarter", "battery"], ["fa-brush", "brush"],
              ["fa-car-crash", "car"], ["fa-cube", "cube"],
              ["fa-drafting-compass", "compass"], ["fa-feather-alt", "feather"],
              ["fa-ankh", "ankh"], ["fa-graduation-cap", "grad"],
              ["fa-battery-quarter", "battery"], ["fa-brush", "brush"],
              ["fa-car-crash", "car"], ["fa-cube", "cube"],
              ["fa-drafting-compass", "compass"], ["fa-feather-alt", "feather"],
              ["fa-ankh", "ankh"], ["fa-graduation-cap", "grad"]]
  min = 0;
  sec = 0;
  moves = 0;

  let i = 0

  //reset icons on side browser
  for (match of matches) {
    match.classList.add("deadstar")
  }

//create new cards, randomize their symbol, and insert every 0.1 seconds
  let newCards = setInterval(function(){
    i++;
    let pick = randomizePick(tempPairs.length);
    let newDiv = document.createElement('DIV');

    newDiv.innerHTML = (`<i class="symbol fas ${tempPairs[pick][0]} fa-2x">`)
    newDiv.setAttribute("symbol", tempPairs[pick][1]);
    newDiv.classList.add('card');
    board.appendChild(newDiv);
    tempPairs.splice(pick,1);
    if (i==16){
      clearInterval(newCards)
    };
  }, 100)

//re-hide winner message
  hideEnd.classList.add("hide")

  move.innerHTML=moves;
  stars[2].classList.remove('deadstar');
  stars[1].classList.remove('deadstar');
  stars[0].classList.remove('deadstar');

  secondsCounter = window.setInterval(function(){
    seconds.innerHTML = setSeconds();
  },1000)

  minutesCounter = window.setInterval(function(){
    minutes.innerHTML = min;
  },1000)
}

createGame();

function setSeconds(){
  if (sec==59) {
    sec=0;
    min+=1;
    return "00"
  } else {
    sec+=1;
      return sec.toString().padStart(2, '0');
  }
}


//add in star functions
function addMove() {
  moves += 1;
  move.innerHTML=moves;
  if (moves>15) {
    stars[2].classList.add('deadstar');
  }
  if (moves>20) {
    stars[1].classList.add('deadstar');
  }
}


function checkGuess(x,y){
  if (x.getAttribute("symbol")==y.getAttribute("symbol")){
    for (match of matches) {
      if (match.id == x.getAttribute("symbol")) {
        match.classList.remove("deadstar");
      }
    }
    return true;
  }else{
    return false;
  }
}

let guessArr = [];

function guess(event) {
  function removeFlip(x,y){
    x.classList.remove("flipCard");
    y.classList.remove("flipCard");
  }

  function endGame(){
    clearInterval(secondsCounter);
    clearInterval(minutesCounter);
    finalScore.innerHTML=moves;
    hideEnd.classList.remove("hide");
    finalTime.innerHTML = min + ":" + sec;
    if (moves<16) {
      finalStars.innerHTML = star + star + star;
    } else if (moves<21) {
      finalStars.innerHTML = star + star;
    } else {
      finalStars.innerHTML = star
    }
  }

//toggle flipping of cards, and comparing both cards against each other
  if (event.target.classList.contains('card')) {
    guessArr.push(event.target);
    event.target.classList.toggle("flipCard")
    if (guessArr.length == 2) {
      if (checkGuess(guessArr[0], guessArr[1])){
        addMove();
        guessArr[0].classList.add("match");
        guessArr[1].classList.add("match");
        correct ++;
        if (correct == 8) {
          endGame();
        }
        guessArr = [];
      } else {
        addMove();
        let slowFlip = setTimeout(removeFlip, 1000, guessArr[0], guessArr[1]);
        // slowFlip;
        guessArr = [];
      }
    }
  }
}

//event listeners
restart.addEventListener("click", resetIt);
reset.addEventListener("click", resetIt);
board.addEventListener("click", guess);
