;
// VIEW
var BingoView = function () {

};
//changes the answer square to an awesome picture of a squirrel
BingoView.prototype.markSquare = function () {
  $('td').on("click", function (){
    $(this).html('<img src=\ "css/squirrel2.svg" alt="test" id="squirrelmarker">');
    if (bingoController.answerString.indexOf((this).id) === -1) {
      bingoController.answerString.push((this).id);
      bingoController.checkForBingo();
    };
  });
}

//freespace actually gets a different answer when first initialized. This replaces it with the "free space"
BingoView.prototype.setFreeSpace = function () {
  $('.freespace').html('FREE<BR>PIZZA');
};

// fun color changing and other animation when bingo is hit

BingoView.prototype.animateBingo = function () {
  if (bingoController.isBingo === true) {
  alert('BINGO!');
  var header = $(".cellheader");
  header.animate({fontSize: '60px', color: "red"}, "slow");
  header.animate({fontSize: '50px', color: "rgb(0, 116, 217)"}, "slow");
  header.css({color: "red"});
  };
};

//resets the answerstring and contents of bingoboard so there are no repeats. Also resets any css changes hit while on bingo
BingoView.prototype.refreshBoard = function () {
  $("#newcardbutton").on("click", function(){
      console.log("clicked!");
      $('.cellheader').css({color: "rgb(0, 116, 217)"});
      bingoController.answerString = [];
      bingoController.isBingo = false;
      bingoController.model.bingocontents = [];
      bingoController.startGame();
    });
};

//Populates all cells in the table. i corresponds to div id
BingoView.prototype.newCard = function () {
  for (var i=0; i<25; i++) {
    document.getElementById(i).innerHTML = bingoController.bingocontents[i];
  }
  this.setFreeSpace();
};


// // controller

var BingoController = function (view, model) {
  this.view = view;
  this.model = model;
  this.bingocontents = model.bingocontents;
  this.answerString = [];
  this.isBingo = false;
};

//apparently javascript can't sort integers well.
BingoController.prototype.compareNumbers = function (a, b) {
  return a-b;
};


//combines all bingo checks into one bingo check.
BingoController.prototype.checkForBingo = function () {
  this.checkForHorizontalBingo();
  this.checkForVerticalBingo();
  this.checkForDiagonalBingo();
  this.checkForDiagonalBingoLeft();
  this.view.animateBingo();
};

//switches up the array that populates all <td>'s so the board is different every time.
BingoController.prototype.shuffleBoard = function () {
  for (var i = this.bingocontents.length -1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i +1));
      var temp = this.bingocontents[i];
      this.bingocontents[i] = this.bingocontents[j];
      this.bingocontents[j] = temp;
  }
};

//Checks for a horizontal bingo by looking at the index of, the td id is saved to a string and sorted, if it appears in order bingo is set to true
BingoController.prototype.checkForHorizontalBingo = function () {
  var horizontalString = this.answerString.sort(this.compareNumbers).join("");
  console.log(this.isBingo)
  if (horizontalString.indexOf('01234') != -1 || horizontalString.indexOf('56789') != -1 || horizontalString.indexOf('1011121314') != -1 || horizontalString.indexOf('1516171819') != -1 || horizontalString.indexOf('2021222324') != -1) {
    this.isBingo = true;
  };
};

// does the same thing that horizontal does, except checks for vertical by using modulo 5 on each number in the string
BingoController.prototype.checkForVerticalBingo = function () {
  var verticalStringModded = [];
  var verticalStringCheck =[];
  var verticalString = this.answerString.sort(this.compareNumbers);
  for (var i=0; i<verticalString.length; i++) {
    verticalStringModded.push(verticalString[i] % 5);
    verticalStringCheck = verticalStringModded.sort(this.compareNumbers).join("");
    if (verticalStringCheck.indexOf('00000') != -1 || verticalStringCheck.indexOf('11111') != -1 || verticalStringCheck.indexOf('22222') != -1 || verticalStringCheck.indexOf('33333') != -1 || verticalStringCheck.indexOf('44444') != -1){
      this.isBingo = true;
    }
  }
};

//diagonal bingos for one direction all equal 0 when modulus 6
BingoController.prototype.checkForDiagonalBingo = function () {
  var diagonalStringRightModded = [];
  var diagonalStringRight = this.answerString.sort(this.compareNumbers);
  for (var i=0; i<diagonalStringRight.length; i++) {
    diagonalStringRightModded.push(diagonalStringRight[i] % 6);
    var diagonalStringRightCheck = diagonalStringRightModded.sort(this.compareNumbers).join("");
    if (diagonalStringRightCheck.indexOf('00000') != -1) {
      this.isBingo = true;
    };
  }
};

//the other direction bingo all equals 0 when using modulus 4, however, some equal 0 when you use both 0 && 6. Those numbers, 24 and 0 are checked immediately and are changed to numbers that won't trigger an unwanted bingo
BingoController.prototype.checkForDiagonalBingoLeft = function () {
  diagonalStringLeftModded = [];
  diagonalStringLeft = this.answerString.sort(this.compareNumbers).concat();
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
    var diagonalStringLeftCheck = diagonalStringLeftModded.sort(this.compareNumbers).join("");
    if (diagonalStringLeftCheck.indexOf('00000') != -1) {
      this.isBingo = true;
    };
  };
}

//starts the game, with a callback that won't screw up my AJAX call
BingoController.prototype.startGame = function() {

  function betterCallback() {
    this.shuffleBoard();
    this.view.newCard();
  }
    this.model.getDataContent(betterCallback.bind(this));
}


// // MODEL

var BingoModel = function () {
  this.bingocontents = [];
};

//ajax call that gets the data. Originally hardcoded all the answers, but decided to go with ajax to practice retrieving json data. Plus, the refreshing of the board looks a lot better.
BingoModel.prototype.getDataContent = function (callback) {
      var self = this;
      $.ajax({
        url: '/test',
        dataType: 'json',
      })
      .done(function(data) {
        console.log("success");
        bingocell = data;
        bingocell.forEach(function (element, index, array){
          self.bingocontents.push(element.bingocell);
        });

        //startGame!
        callback();
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
}


//Initialize MVC
  var bingoModel = new BingoModel
  var bingoView = new BingoView
  var bingoController = new BingoController(bingoView, bingoModel);


//Starts everything up on document ready
$(document).ready(function(){
  // console.log("working!");
  bingoController.startGame();
  bingoController.view.markSquare();
  bingoController.view.refreshBoard();

})


