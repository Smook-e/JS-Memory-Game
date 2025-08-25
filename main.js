let duration = 600;
let blocksContainer = document.querySelector(".game");
let level = parseInt(document.querySelector(".levelno").innerHTML);
let blocks = document.querySelectorAll(".game-block");
console.log(blocks.length);
let orderRange = Array.from(Array(10).keys());
let timerInterval;
let time = 0;


shuffle(orderRange);

blocksContainer.classList.add("grid4");
let box = document.querySelectorAll(".box");

//animation
box.forEach((box) => {
  box.classList.add("animate__animated", "animate__fadeInUp");
  box.addEventListener("animationend", () => {
        box.classList.remove("animate__animated", "animate__bounceIn");
    }, { once: true });
})

//block flip on click
blocks.forEach((block, index) => {
  if (index >= 8) {
    block.classList.add("hidden");
  } else {
    block.classList.add("playable");
  }
  block.style.order = orderRange[index];
  block.addEventListener("click", () => {
    flipBlock(block);
  });
});
//start button
document.getElementById("start").addEventListener("click", () => {
  let name = prompt("Enter your name");
  if(name === null || name === ""){
    document.getElementById("name").innerHTML = "Anonymous";
  }
  else{
    document.getElementById("name").innerHTML = name;
  }
  document.querySelector(".startgame").style.display = "none";
  showAllCardsAtStart();
})


function flipBlock(block) {
  let blocks = Array.from(blocksContainer.children);
  let flippedBlocks = blocks.filter((block) =>
    block.classList.contains("flipped")
  );
  //if 3rd block is clicked -> first two blocks are unflipped
  if (flippedBlocks.length === 2) {
    flippedBlocks[0].classList.remove("flipped");
    flippedBlocks[1].classList.remove("flipped");
  }

  block.classList.add("flipped");
  block.classList.add("noclicking");
  
  flippedBlocks.push(block);
  if (flippedBlocks.length === 2) {
    
    checkMatchedBlocks(flippedBlocks[0], flippedBlocks[1]);
  }
}
function checkMatchedBlocks(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".triesno");
  if (firstBlock.dataset.album === secondBlock.dataset.album) {
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");
    firstBlock.classList.add("matched");
    secondBlock.classList.add("matched");
    
    checkGameEnd();
    return true;
} else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
    updateStars(parseInt(triesElement.innerHTML));
    setTimeout(() => {
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");
    firstBlock.classList.remove("noclicking");
    secondBlock.classList.remove("noclicking");
    }, duration);
    if (parseInt(triesElement.innerHTML) === 3) {
      setTimeout(() => {
        lost();
      }, duration);
    }
    return false;
  }
}
function stopClicking() {
  blocksContainer.classList.add("noclicking");
  setTimeout(() => {
    blocksContainer.classList.remove("noclicking");
  }, duration);
}
function shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}
function lost(){
  document.querySelector("#gameover").style.display = "flex";
  stopTimer();
}
document.getElementById("restart").addEventListener("click", () => {
  document.querySelector("#gameover").style.display = "none";
  resetGame(true);
})
function resetGame(lost = false) {
  let blocks = document.querySelectorAll(".game-block");
  orderRange = Array.from(Array(blocks.length).keys());
  let blocksContainer = document.querySelector(".game");
  console.log(blocks.length);
  shuffle(orderRange);
  let level = document.querySelector(".levelno");
  if(!lost){
    level.innerHTML = parseInt(level.innerHTML) + 1;
  }
  
  let lvlno = parseInt(level.innerHTML);
  let blocksno = 8;
  //levels
  if (lvlno > 1 && lvlno < 3) {
    blocksno = 12;
  } else if (lvlno >= 3 && lvlno < 6) {
    blocksno = 16;
  } else if (lvlno >= 6 && lvlno < 8) {
    blocksno = 20;
    blocksContainer.classList.remove("grid4");
    blocksContainer.classList.add("grid5");
  } else if (lvlno >= 8 && lvlno < 11) {
    blocksno = 30;
    blocksContainer.classList.remove("grid5");
    blocksContainer.classList.add("grid6");
  }
  else if (lvlno >=11 ) {
    blocksno = 36;
  }
  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    block.classList.remove("flipped");
    block.classList.remove("hidden");
    block.classList.remove("playable");
    block.classList.remove("matched");
    block.classList.remove("noclicking");
    if (index >= blocksno) {
      block.classList.add("hidden");
    } else {
      block.classList.add("playable");
    }
  });
  document.querySelector(".triesno").innerHTML = 0;
  document.getElementById("stars").innerHTML = "★★★★★";

  showAllCardsAtStart();
  stopTimer();


}
function showAllCardsAtStart() {
    

    blocks.forEach(block => block.classList.add("flipped"));

    
    setTimeout(() => {
        blocks.forEach(block => {
            block.classList.remove("flipped");
            startTimer();
        });
    }, 2000); 
}
function checkGameEnd() {
  let blocks = document.querySelectorAll(".game-block.playable");
  let matchedBlocks = document.querySelectorAll(".matched");
  console.log(blocks.length, matchedBlocks.length);
  let stars = document.getElementById("stars").textContent;
  console.log(stars);
  let tries = parseInt(document.querySelector(".triesno").innerHTML);
  let level = parseInt(document.querySelector(".levelno").innerHTML);
  let time = document.getElementById("timer").textContent;
  let timeInSeconds = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
  if (blocks.length === matchedBlocks.length) {
    // All blocks are matched
    setTimeout(() => {
      
      shownextlevel(timeInSeconds,level,tries,stars);
    }, 300);
    return true;
  }
  return false;
}
//Timer
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function startTimer() {
    // Clear any old timers before starting a new one
    clearInterval(timerInterval);
    time = 300;
    let timer = document.getElementById("timer");
    timer.textContent = formatTime(time);

    // Start a new interval that updates every 1 second
    timerInterval = setInterval(() => {
        time--;
        timer.textContent = formatTime(time);
        if (time === 0) {
            lost();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    time = 300;
    document.getElementById("timer").textContent = time;
}

function updateStars(tries) {
    let stars = 5;

    if (tries > 3) stars = 4; 
    if (tries > 6) stars = 3;
    if (tries > 9) stars = 2;
    if (tries > 12) stars = 1; 

    let starStr = "★".repeat(stars) + "☆".repeat(5 - stars);
    document.getElementById("stars").textContent = starStr;
}
function shownextlevel(time,level,tries,stars){
  stopTimer();
  document.getElementById("levelno").innerHTML = `Level ${level} Completed !!`;
  document.getElementById("time").innerHTML = `Time : ${formatTime(300 - time)}`;
  document.getElementById("wrongTries").innerHTML = `WrongTries : ${tries}`;
  document.getElementById("starsstat").innerHTML = stars;
  document.getElementById("score").innerHTML = `Score : ${(15-tries)*15}`;
  document.getElementById("level").innerHTML = `Go to Level ${level + 1}`;

  document.querySelector(".nextlevel").style.display = "flex";
  document.documentElement.style.setProperty('--animate-duration', '1s');
  
}
document.getElementById("level").addEventListener("click", () => {
  document.querySelector(".nextlevel").style.display = "none";
  resetGame();
});
