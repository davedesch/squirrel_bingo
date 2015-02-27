


var answerString = []
var isBingo = false
bingocontents = []

function getContentData() {
  $.ajax({
    dataType: 'json',
    url: '/test',
    success: function (data) {
      bingocell = data;
      bingocell.forEach(function (element, index, array){
        bingocontents.push(element.bingocell)
      });
      shuffleBoard(bingocontents);
    }
  });
};

function refreshBoard() {
  $("#newcardbutton").on("click", function(){
    console.log("clicked!");
    $.ajax({
      dataType: 'json',
      url: '/test',
      success: function (data) {
        bingocontents = [];
        bingocell = data;
        bingocell.forEach(function (element, index, array){
          bingocontents.push(element.bingocell)
        });
        shuffleBoard(bingocontents);
        $('.cellheader').css({color: "rgb(0, 116, 217)"});


      }
    });

  });
};


function shuffleBoard(bingocontents) {
  for (var i = bingocontents.length -1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i +1));
    var temp = bingocontents[i];
    bingocontents[i] = bingocontents[j];
    bingocontents[j] = temp;
  }
  newCard(bingocontents);
}

function newCard(bingocontents) {
  for (var i=0; i<25; i++) {
    document.getElementById(i).innerHTML = bingocontents[i];
  }
  setFreeSpace();
}

function checkForHorizontalBingo() {
  var horizontalString = answerString.sort(compareNumbers).join("");
  if (horizontalString.indexOf('01234') != -1 || horizontalString.indexOf('56789') != -1 || horizontalString.indexOf('1011121314') != -1 || horizontalString.indexOf('1516171819') != -1 || horizontalString.indexOf('2021222324') != -1) {
    isBingo = true
  };
};

function markSquare() {
  $('td').on("click", function (){
    $(this).html('<img src=\ "css/squirrel2.svg" alt="test" id="squirrelmarker">');
    if (answerString.indexOf((this).id) === -1) {
      answerString.push((this).id)
    };
    checkForHorizontalBingo();
    checkForVerticalBingo();
    checkForDiagonalBingo();
    checkForDiagonalBingoLeft();
    bingoCelebration();
  })
}

function compareNumbers(a, b) {
  return a-b;
};

function setFreeSpace() {
  $('.freespace').html('FREE<br>PIZZA')
};


function checkForVerticalBingo() {
  var verticalStringModded = [];
  var verticalStringCheck =[];
  var verticalString = answerString.sort(compareNumbers);
  for (var i=0; i<verticalString.length; i++) {
    verticalStringModded.push(verticalString[i] % 5);
    verticalStringCheck = verticalStringModded.sort(compareNumbers).join("");
    if (verticalStringCheck.indexOf('00000') != -1 || verticalStringCheck.indexOf('11111') != -1 || verticalStringCheck.indexOf('22222') != -1 || verticalStringCheck.indexOf('33333') != -1 || verticalStringCheck.indexOf('44444') != -1){
      console.log("WORKING");
      isBingo = true;
    }
  }
};

function checkForDiagonalBingo () {
  var diagonalStringRightModded = [];
  var diagonalStringRight = answerString.sort(compareNumbers);
  for (var i=0; i<diagonalStringRight.length; i++) {
    diagonalStringRightModded.push(diagonalStringRight[i] % 6);
    var diagonalStringRightCheck = diagonalStringRightModded.sort(compareNumbers).join("");
    if (diagonalStringRightCheck.indexOf('00000') != -1) {
      isBingo = true
    };
  }
}

function checkForDiagonalBingoLeft() {
  diagonalStringLeftModded = [];
  diagonalStringLeft = answerString.sort(compareNumbers).concat();
  console.log(diagonalStringLeft);
  for (var i=0; i<diagonalStringLeft.length; i++) {
    if (diagonalStringLeft.indexOf('0') != -1) {
      diagonalStringLeft[diagonalStringLeft.indexOf('0')] = "35"
    };
    if (diagonalStringLeft.indexOf('24') != -1) {
      diagonalStringLeft[diagonalStringLeft.indexOf('24')] = "37"
    };
    console.log(diagonalStringLeft);
    diagonalStringLeftModded.push(diagonalStringLeft[i] % 4);
    var diagonalStringLeftCheck = diagonalStringLeftModded.sort(compareNumbers).join("");
    if (diagonalStringLeftCheck.indexOf('00000') != -1) {
      isBingo = true
    };
  };
}


function bingoCelebration() {
  if (isBingo === true) {
    alert("BINGO!")
    animateBingo();
    isBingo = false;
    answerString = [];
  };
};

function animateBingo() {
  var header = $(".cellheader");
  header.animate({fontSize: '60px', color: "red"}, "slow");
  header.animate({fontSize: '50px', color: "rgb(0, 116, 217)"}, "slow");
  header.css({color: "red"});
};

$(document).ready(function() {
  console.log("working!");
  getContentData();
  markSquare();
  refreshBoard();

});
