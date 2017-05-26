var tileGame = {
    tileImages: ['penguin', 'bomb', 'cow', 'ball', 'target', 'mushroom', 'fish', 'hippo'],
    elementA: null,
    elementB: null,
    attemptMatch: false,
    freezClicks: false,
    freezTime: 700,
    timer: 60,
    timerRef: null,
    gameLive: false
}

tileGame.init = function(){
    tileGame.bindEvents();
    tileGame.setupNewBoard();
}

tileGame.startTimer = function(){
    var time = tileGame.timer+1;
    tileGame.timerRef = setInterval(function(){
                    (time<10) ? $("#timerID").html("0"+--time) : $("#timerID").html(--time);
                    if(time<=0){
                        clearInterval(tileGame.timerRef);
                        tileGame.gameLose();
                    }
                }, 1000);

}

tileGame.bindEvents = function(){
    $(".tile-container .game-tile").off('click').on('click', function(e){
        if(tileGame.freezClicks || $(this).hasClass('opened') || $(this).hasClass('done') || !tileGame.gameLive){
            return;
         }   
        
        if(!tileGame.attemptMatch){
            tileGame.attemptMatch = true;
            tileGame.elementA = $(this).data('image');
            $(this).find('.image-tile').addClass(tileGame.elementA);
            $(this).addClass('opened');
        }else{
            tileGame.elementB = $(this).data('image');
            $(this).find('.image-tile').addClass(tileGame.elementB);
            if(tileGame.elementB !== tileGame.elementA){
                tileGame.freezClicks = true;
                setTimeout(function() {
                    tileGame.clearAll();
                    tileGame.freezClicks = false;
                }, tileGame.freezTime);
            }else{
                tileGame.freezClicks = true;
                var self = this;
                setTimeout(function() {
                    tileGame.freezClicks = false;
                    $(self).addClass('done');
                    $(".opened").addClass('done').removeClass('opened');
                    tileGame.clearAll();

                    if($(".done").length == $(".tile-container .game-tile").length)
                    {
                        tileGame.gameWon();
                    }

                }, tileGame.freezTime);
            }
        }
    });

    $(".game-btn").off('click').on('click', function(){
        $(this).html('Restart Game');
        clearInterval(tileGame.timerRef);
        tileGame.startTimer();
        tileGame.clearAll();
        $(".done").removeClass("done");
        tileGame.setupNewBoard();
        if(!$(".game-result").hasClass('hidden')){
            $(".game-result").addClass('hidden');
        }
        tileGame.gameLive = true;
    })
}

tileGame.setupNewBoard = function(){
    var tileArray = tileGame.shuffle(tileGame.tileImages);
    $.each($(".tile-container .game-tile"), function(i, dt){
        $(dt).data('image', tileArray[i]);
    })
}

tileGame.clearAll = function(){
    $(".image-tile").removeClass().addClass('image-tile');
    $(".opened").removeClass('opened');
    tileGame.attemptMatch = false;
}

tileGame.shuffle = function(array) {
    var tmparray = array.concat(array);
    array = tmparray;
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

tileGame.gameLose = function(){
    $(".game-result").html('Game Over').removeClass('hidden');
    tileGame.gameLive = false;
    clearInterval(tileGame.timerRef);
}

tileGame.gameWon = function(){
    $(".game-result").html('You Win !!!').removeClass('hidden');
    tileGame.gameLive = false;
    clearInterval(tileGame.timerRef);
}


$(document).ready(tileGame.init);