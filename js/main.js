// rating in the header
let headerRating=document.querySelectorAll('.game-info .fa-star');
// final rating
let finalRating=document.querySelectorAll('.rating .fa-star');
// tries number 
let movesNum=document.querySelector('.tries .num');
// game timer
let timer=document.querySelector('.timer');
// restart button
let restart=document.querySelector('.fa-redo-alt');
// cards container
let cardsContainer=document.querySelector('.game-container');
// cards
let cards=Array.from(cardsContainer.children);
// cards order
let orders= Array.from(Array(cards.length).keys());
// duration of setInterval and setTimeOut
let duration=1000;
// timer counter
let timerCalc=0;
// timer interval
let timerCounter;
// congratulations message
let congratSetion=document.querySelector('.congrats-message');
let congratContent=document.querySelector('.congrats-message .congrats-container');
let closeBtn=document.querySelector('.congrats-message .close');
let totalMoves=document.querySelector('.congrats-container .total-moves');
let totalTime=document.querySelector('.congrats-container .total-time');
let playAgainBtn=document.querySelector('.play-again');
// calling start game function
startGame();
// restart game button
restart.addEventListener('click',function(){
    // reset timer
    clearInterval(timerCounter);
    restartGame();
});
// close congratulations message button
closeBtn.addEventListener('click',function(){
    congratSetion.style.display='none';
    restartGame();
});
// playAgain button
playAgainBtn.addEventListener('click',function(){
    congratSetion.style.display='none';
    restartGame();
});
// start game function
function startGame(){
    // get random orders
    let randomOrders=shuffleOrders(orders);
    // set orders and click event
    cards.forEach((card, index)=>{
        card.style.order=randomOrders[index];
        card.addEventListener('click',function(){
            flippeCard(card);
        });
        card.classList.add('showCards');
    });
    stopClicking(2000);
    setTimeout(()=>{
        cards.forEach((card)=>{
            card.classList.remove('showCards');
        });
    }, 2000);
    // set timer
    setTimeout(()=> startTimer() , 2000);
}
// restartGame function
function restartGame(){
    // reset data
    movesNum.textContent=0;
    timerCalc=0;
    timer.innerHTML=`0 min(s) &ThinSpace; 0 sec(s) `;
    // set timer
    setTimeout(()=>{
        startTimer();
    },3500);
    // reset rating
    for(let i=0;i<3;i++){
        headerRating[i].style.visibility = "visible";
        finalRating[i].style.visibility = "visible";
    }
    cards.forEach((card)=>{
        card.classList.remove('flipped');
        card.classList.remove('has-flipped');
        card.lastElementChild.style.background='#02b3e4';
    });
    stopClicking(3500);
    // reset orders
    setTimeout(()=>{
        // get random orders
        let randomOrders=shuffleOrders(orders);
        // set orders and click event
        cards.forEach((card, index)=>{
            card.style.order=randomOrders[index];
            card.classList.add('showCards');
        });
    }, duration);
    setTimeout(()=>{
        cards.forEach((card)=>{
            card.classList.remove('showCards');
        });
    }, 3000);
}
// start timer function
function startTimer(){
    timerCalc=0;
    timerCounter=setInterval(()=>{
        let mins=Math.floor(timerCalc/60);
        let secs=timerCalc%60
        timer.innerHTML=`${mins} min(s) &ThinSpace; ${secs} sec(s) `;
        timerCalc++;
    },duration);
}
// shuffle function
function shuffleOrders(orders){
    let current = orders.length-1;
    while(current>=0){
        let random = Math.floor(Math.random()*orders.length);
        // swap current value with random value
        let temp = orders[current];
        orders[current] = orders[random];
        orders[random] = temp;
        current--;
    }
    return orders;
}    

// fllipeCard function
function flippeCard(card){
    card.classList.add('flipped');
    let flippedCards = cards.filter( card => card.classList.contains('flipped') );
    // check if there is two flipped cards
    if(flippedCards.length==2){
        // increase moves number
        movesNum.textContent++;
        // set rating depending on moves number
        if(movesNum.textContent>8&&movesNum.textContent<12){
            // rate to two stars
            headerRating[2].style.visibility = "collapse";
            finalRating[2].style.visibility = "collapse";
        }
        else if(movesNum.textContent>13){
            // rate to one star
            headerRating[1].style.visibility = "collapse";
            finalRating[1].style.visibility = "collapse";
        }
        // stop game clicking
        stopClicking(duration);
        // check matching of the two cards
        checkMatching(flippedCards[0],flippedCards[1]);
    }
}

// stopClicking function
function stopClicking(duration){
    // add stop-clicking class to unable clicking on the container
    cardsContainer.classList.add('stop-clicking');
    setTimeout(()=>{
        cardsContainer.classList.remove('stop-clicking');
    }, duration);
}

// checkMatching function
function checkMatching(card_1,card_2){
    // check if matched
    if(card_1.dataset.icon===card_2.dataset.icon){
        // remove flipped class and add has-flipped to successful cards
        card_1.classList.remove('flipped');
        card_2.classList.remove('flipped');
        card_1.classList.add('has-flipped');
        card_2.classList.add('has-flipped');
        // add successful background
        card_1.lastElementChild.style.background='#FFD700';
        card_2.lastElementChild.style.background='#FFD700';
        let successfulCards = cards.filter( card => card.classList.contains('has-flipped') );
        // check if flipped all cards
        if(successfulCards.length==cards.length){
            // end the game //
            // stop timer
            clearInterval(timerCounter);
            // display congratulations message
            congratSetion.style.display='block';
            setTimeout(()=>{
                congratContent.style.display='block';
            },50);
            setTimeout(()=>{
                congratContent.style.transform='translateY(0px)';
            },100);
            // set total moves
            totalMoves.textContent=`You made ${movesNum.textContent} moves`;
            // set total time
            let mins=Math.floor((timerCalc-1)/60);
            let secs=((timerCalc-1)%60);
            totalTime.textContent=`in ${mins} mins ${secs} secs`;
        }
        
    }
    // check if unmatched
    else{
        // add failed background
        card_1.lastElementChild.style.background='red';
        card_2.lastElementChild.style.background='red';
        setTimeout(()=>{
            card_1.classList.remove('flipped');
            card_2.classList.remove('flipped');
            // return to original background
            card_1.lastElementChild.style.background='#02b3e4';
            card_2.lastElementChild.style.background='#02b3e4';
        }, duration);
    }
}