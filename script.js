// Stating variables for functions
var state = {
  currentQuestion: 0,
  remainingTime: questions.length * 15, 
  timer: 0,
  timeOut: 0,
  timePenalty: 15,
  highScores:[] 
 
}



// Initiating function
function init(){

  // Retrieve data from localStorage
  var fromLocal = localStorage.getItem('highScores');
      if(fromLocal){ state.highScores = JSON.parse(fromLocal); }

  // Initiate page
  document.querySelector('#intro').setAttribute('style','display:block;');
  document.querySelector('#scores').setAttribute('style','display:none;');

  // Initiating commands at start of quiz
  state.currentQuestion = 0;
  state.remainingTime = questions.length * 12;
  state.timer = 0;
  state.timeOut = 0;
  document.querySelector('#time__num').innerText = state.remainingTime;
}
// Render questions 
function quizRender(data){

  document.querySelector('#quiz').setAttribute('style','display:block;');

// Render heading
  var question = "<h2>" + data.title + "</h2>"
      document.querySelector('.quiz__title').innerHTML= question;

// Render buttons
  // Delete buttons after after progression to next question
  var choicesDOM = document.querySelector('.quiz__choices');
      deleteChild(choicesDOM); // Func deleting all children

  // Create buttons
  for(var i=0; i < data.choices.length; i++){

      var choice = document.createElement('button');
          choice.innerText = (i+1) + '. ' + data.choices[i];
          choice.classList.add("choiceBtn", "btn", "btn-success" ); // classes for style, bootstrap

      // Compare choices to correct answers
      var answer = ( data.answer === data.choices[i] ) ? "correct" : "wrong";
          choice.setAttribute('data-answer', answer);

      choicesDOM.appendChild(choice);
  }
}
// Timer/Timeout
function timerFunc(){
  
  // Clear timer and timeOut
  clearTime();

  var timeDOM = document.querySelector('#time__num');
      timeDOM.innerText = state.remainingTime; 
  
  state.timer = setInterval(function(){
                  state.remainingTime --;
                  timeDOM.innerText = state.remainingTime; // countdown
              },1000)

  state.timeOut = setTimeout(function(){
                      clearInterval(state.timer);
                      result(); // func rendering result page
                  }, state.remainingTime * 1000)
}
// Result page
function result(){
  
  document.querySelector('#quiz').setAttribute('style','display:none;');
  document.querySelector('#result').setAttribute('style','display:block;');
  document.querySelector('.result__score').innerText = state.remainingTime;

  clearInterval(state.timer);
}
// Render highscores page
function renderHighScores(){

  // 1. Place high scores in order
  state.highScores.sort( function(a,b){return b.score - a.score} );

  // 2. Delete previous high scores
  var scoresDOM = document.querySelector('#scores__ranking');
                  deleteChild(scoresDOM);
  
  // 3. Display high scores in order
  state.highScores.forEach( function(el,i){

      var rank = document.createElement('p')
          rank.innerText = (i+1) + ". " + el.initials + " - " + el.score;
          
          scoresDOM.appendChild(rank);

  });
}
// Render correct answer after retrieving data attribute
function verdict(word){

  document.querySelector('#verdict__word').innerText = word;
  document.querySelector('#verdict').setAttribute('style','opacity:1;');

  setTimeout(function(){
      document.querySelector('#verdict').setAttribute('style','opacity:0;');
  },1000);
}
// Delete children/remove element
function deleteChild(DOM){
  if(DOM.children){
          Array.from( DOM.children ).forEach( function(el){ el.remove(); } );
  }
}
// Clear timer and time run-out
function clearTime(){
  if(state.timer > 0) { clearInterval(state.timer); }
  if(state.timeOut > 0) { clearTimeout(state.timeOut); }
}


// Start quiz button
document.querySelector('#startBtn').addEventListener('click',function(e){
  // Hide intro
  document.querySelector('#intro').setAttribute('style', 'display: none;')
  // Quiz display
  quizRender(questions[state.currentQuestion]);
  // Start timer
  timerFunc();
});
// Question's each choice btn
document.querySelector('.quiz__choices').addEventListener('click',function(e){
  
  // Check if answer is wrong
  if( e.target.getAttribute('data-answer') !== "correct" ){

      state.remainingTime -= state.timePenalty;
      timerFunc();
      verdict("Wrong!");
      snd2.play();
  }
  else{
      verdict("Correct!");
  }

  // Progress through questions
  state.currentQuestion ++;

  // When there is remaining question
  if(state.currentQuestion < questions.length){
      quizRender(questions[state.currentQuestion]);
  }
  else{
      result();
      clearTimeout(state.timeOut);
      snd3.play();
      snd1.pause();
      

  }
  
})
// Submit 
document.querySelector('#submitBtn').addEventListener('click', function(){

  document.querySelector('#result').setAttribute('style','display:none;');
  document.querySelector('#scores').setAttribute('style','display:block;');

  // Store players initials and high score to local.storage
  var currentScore = {};
      currentScore.initials = document.querySelector('#initials').value;
      currentScore.score = state.remainingTime;
      
      state.highScores.push(currentScore);

      localStorage.setItem('highScores', JSON.stringify(state.highScores));

  // 2. Render highscores
  renderHighScores()
});
// Activating and render buttons for clear and go back
document.querySelector('.scores__btn').addEventListener('click',function(e){

  // Go back 
  if(e.target.matches('#gobackBtn')){
      init();
  }

  // Clear Highscores
  else if(e.target.matches('#clearBtn')){

      // Delete state data obj
      state.highScores = [];
      
      // Clear rendered score list
      var scoresDOM = document.querySelector('#scores__ranking');
                      deleteChild(scoresDOM);
      
      // Clear localStorage
      localStorage.removeItem('highScores');
  }
});
// View highscores button
document.querySelector('#viewScores').addEventListener('click', function(){

  document.querySelector('#result').setAttribute('style','display:none;');
  document.querySelector('#quiz').setAttribute('style','display:none;');
  document.querySelector('#intro').setAttribute('style','display:none;');
  document.querySelector('#scores').setAttribute('style','display:block;');
  
  // Clear time 
  clearTime();

  renderHighScores();
});

init();