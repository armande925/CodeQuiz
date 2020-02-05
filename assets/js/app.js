let timer = 60;
let score = 0;
let player = '';
let right = 0;
let wrong = 0;
// $timer = document.querySelector('.time');
let shuffledQuest, qIndex;
$('.start-button').click(function () {
  $('#header').toggle();
  $('#finish-game').hide();
  $('#game-view').show();
  $('#finish-game').hide();
  // shuffledQuest = questions.sort(() => Math.random( - .5));
  qIndex = 0;
  renderQuestions();
  console.log(renderQuestions);
  // setTime();
});
// populate();
//set timer
//set timer
// function setTime(){
//     let timeInterval = setInterval(function(){
//       timer--;
//       $timer.textContent = `Time: ${timer} seconds remaining`;

//       if(timer === 0) {
//         clearInterval(timeInterval);
//       }
//     }, 1000);}

function renderQuestions() {
  // showQuestion(shuffledQuest[qIndex])
  if (qIndex === questions.length) {
    displayResults()
  }
  else if (qIndex < questions.length) {


    console.log(qIndex);
    $('.questions').text(questions[qIndex].question)
    $('.choices').empty();
    for (let i = 0; i < 4; i++) {
      $('.choices').append(`<button class='options' data-val='${questions[qIndex].choices[i]}' 
    data-answer='${questions[qIndex].answer}'> ${questions[qIndex].choices[i]}</button>`)
    }

    if (qIndex <= questions.length - 1) {
      qIndex++
    }
    // else {
    //   displayResults()

    // }
  }
}

// function showQuestion(question) {

// }
// console.log(startGame);

function displayResults() {
  console.log('displayResults')

  $('#game-view').hide();
  $('#finish-game').show();
  $('.high-scores').html(`<h2>Correct Answers: ${right}</h2>
  <h2>Wrong Answers: ${wrong}</h2>`)
}
$('.choices').on('click', '.options', function (event) {
  event.preventDefault()
  var answer = $(this).attr('data-answer')
  var buttons = $(this).attr('data-val')
  if (answer === buttons) {
    right++
  }
  else {
    wrong++
  }
  renderQuestions()
})
