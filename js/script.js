/* 
    File: /domenic_ruocco_hw8/js/script.js
    Assignment: HW8
    Domenic Ruocco, UML Comp Sci, druocco@cs.uml.edu
    Course: 91.61 GUI Programming I
    Copyright (c) 2020 by Domenic Ruocco. All rights reserved.
*/

//Row #3
var BOARD = [ "X", "X", "Double Word", "X", "X", "X", "Double Letter", "X", "Double Letter", "X", "X", "X", "Double Word", "X", "X" ];

var REMAINING = [...TILES];

var CURRENTSTRING = [ "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_" ];

var CURRENTWORD = "";

var CURRENTSCORE = 0;

var CURRENTHAND = 7;

var TOTALPOINTS = 0;

function getPoints(letter){
    return POINTS[TILES.indexOf(letter)];
}

function validate(word){
    return WORDS.includes(word);
}

function getScore(word, start, board){

    var score = 0;
    var mult = 1;

    for(var i=0;i<word.length;i++){

        if(i+start >= board.length){
            return -1;
        }

        if(board[start+i] == "Double Letter"){
            score += 2 * getPoints(word[i]);
        } else if(board[start+i] == "Triple Letter"){
            score += 3 * getPoints(word[i]);
        } else{
            score += 1 * getPoints(word[i]);
        }

        if(board[start+i] == "Double Word"){
            mult *= 2;
        } else if(board[start+i] == "Triple Word"){
            mult *= 3;
        } else{
            mult *= 1;
        }
    }
    return mult * score;
}

function getTile(){
    if(REMAINING.length == 0){
        return -1;
    }
    var i = Math.floor(Math.random() * REMAINING.length);
    var letter = REMAINING[i];
    REMAINING.splice(i,1);
    return letter;
}

function refillHand(hand){
    for(var i=hand.length;i<7;i++){
        var next = getTile();
        if(next == -1){
            return hand;
        }
        hand.push(next);
    }
    return hand;
}

function play(hand, word, board){

    var score = 0; //getScore

    var start = 0;
    var foundstart = false;
    for(var i=0;i<board.length;i++){
        if(word[i] != "X" && !foundstart){
            start = i;
            foundstart = true;
        }
    }

    word = word.replaceAll("X","");

    score += getScore(word, start, board); //postScore

    hand = refillHand(hand); //postHand

    console.log("Score: " + score);
    console.log("Hand: " + hand);
    console.log("Remaining: " + REMAINING);
    console.log("Word: " + word);
    console.log("Start: " + start);
    console.log("Board: " + board);

}

// console.log(WORDS);
// console.log(TILES);
// console.log(POINTS);

// play( ["e"], "XXXXXXplayerXXX", BOARD);
    //getHand   getPlay  (after validate)

// console.log( getScore( "players", 6, BOARD) );

for(var i=0;i<7;i++){
    var l = getTile();
    $("#hand").append('<div id="letter" class="' + l + '"></div>');
}


$("#hand").children().each(function(){
    this.style.backgroundImage = "url('./images/TILE"  + (this.className.charCodeAt(0) - 96) + ".jpg')";
});


$("#hand").children().draggable({
    cursor: "move",
    revert: "invalid",
    cursorAt: {
        top: 25,
        left: 25
    }
});

$("#board").children().droppable({
    hoverClass: "hover",
    drop: function(event,ui){

        ui.draggable[0].style.position = "absolute";
        ui.draggable[0].style.left = event.target.offsetLeft + "px";
        ui.draggable[0].style.top = event.target.offsetTop + "px";

        ui.draggable.draggable({disabled: true});
        $(this).droppable({disabled: true});

        CURRENTSTRING[$("#board").children().index( this )] = $(ui.draggable[0]).attr("class")[0];

        var StartWord = false;
        var Checked = true;
        var EndWord = false;
        CURRENTWORD = "";
        for(var i=0;i<CURRENTSTRING.length;i++){
            if(CURRENTSTRING[i] != "_" && !StartWord){
                StartWord = true;
            }

            if(StartWord && CURRENTSTRING[i] != "_"){
                CURRENTWORD += CURRENTSTRING[i];
            }

            if(StartWord && CURRENTSTRING[i] == "_" && Checked){
                EndWord = true;
            }

            if(EndWord && CURRENTSTRING[i] != "_"){
                Checked = false;
                break;
            }
        }


        if(StartWord && Checked){
            // console.log("VALID: " + CURRENTWORD);


            var hand  = [];
            
            $("#letter:not(.ui-draggable-disabled").each(function(){
                hand.push( this.className[0] );
            });


            var word = "";

            for(var i=0;i<CURRENTSTRING.length;i++){
                if( CURRENTSTRING[i] == "_"){
                    word += "X";
                } else {
                    word += CURRENTSTRING[i];
                }
            }
            
            var start = 0;
            var foundstart = false;
            for(var i=0;i<BOARD.length;i++){
                if(word[i] != "X" && !foundstart){
                    start = i;
                    foundstart = true;
                }
            }
            
            // console.log( getScore(CURRENTWORD, start, BOARD) );

            // console.log(CURRENTWORD);

            if(validate(CURRENTWORD) && CURRENTWORD.length >= 2){
                $("#validity").html("Validity: TRUE");
                CURRENTSCORE = getScore(CURRENTWORD, start, BOARD);
                $("#score").html("Current Score: " + CURRENTSCORE);
                $("#word").html("Current Word:  " + CURRENTWORD);
            } else {
                $("#validity").html("Validity: FALSE");
                CURRENTSCORE = 0;
                $("#score").html("Current Score: " + CURRENTSCORE);
                $("#word").html("Current Word:  " + CURRENTWORD);
            }

        } else {
            CURRENTWORD = CURRENTSTRING.join("")
            // console.log("NOT VALID: " + CURRENTWORD);
            $("#validity").html("Validity: FALSE");
            CURRENTSCORE = 0;
            $("#score").html("Current Score: " + CURRENTSCORE);
            $("#word").html("Current Word:  " + CURRENTWORD);
        }

        CURRENTHAND -= 1;

    }
});


$("#Reset").click(function(){
    location.reload();
});

$("#Play").click(function(){
    TOTALPOINTS += CURRENTSCORE;
    $("#total").html("Total Score:  " + TOTALPOINTS);

    $("#letter.ui-draggable-disabled").remove();

    $("#board").children().each(function(){
        $(this).droppable({disabled: false});
    })

    for(var i=0;i< 7 - CURRENTHAND;i++){
        var l = getTile();
        if(l != -1){
            $("#hand").append('<div id="letter" class="' + l + '"></div>');
        }
    }

    $("#hand").children().each(function(){
        this.style.backgroundImage = "url('./images/TILE"  + (this.className.charCodeAt(0) - 96) + ".jpg')";
    });
    
    
    $("#hand").children().draggable({
        cursor: "move",
        revert: "invalid",
        cursorAt: {
            top: 25,
            left: 25
        }
    });

    CURRENTSTRING = [ "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_" ];

    CURRENTWORD = "";
    
    CURRENTSCORE = 0;
    
    CURRENTHAND = 7;

    $("#validity").html("Validity: FALSE");
    CURRENTSCORE = 0;
    $("#score").html("Current Score: " + CURRENTSCORE);
    $("#word").html("Current Word:  " + CURRENTWORD);

});


$("#Clear").click(function(){
    
    l = [];
    $("#hand").children().each(function(){
        l.push( this.className[0] );
    });
    // console.log( l );

    $("#hand").children().remove();

    for(var i=0;i<7;i++){
        $("#hand").append('<div id="letter" class="' + l[i] + '"></div>');
    }
    
    $("#hand").children().each(function(){
        this.style.backgroundImage = "url('./images/TILE"  + (this.className.charCodeAt(0) - 96) + ".jpg')";
    });
    
    $("#hand").children().draggable({
        cursor: "move",
        revert: "invalid",
        cursorAt: {
            top: 25,
            left: 25
        }
    });

    $("#board").children().each(function(){
        $(this).droppable({disabled: false});
    })

    CURRENTSTRING = [ "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_" ];

    CURRENTWORD = "";
    
    CURRENTSCORE = 0;
    
    CURRENTHAND = 7;

    $("#validity").html("Validity: FALSE");
    CURRENTSCORE = 0;
    $("#score").html("Current Score: " + CURRENTSCORE);
    $("#word").html("Current Word:  " + CURRENTWORD);


});