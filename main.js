
var g_width = 320;
var g_height = 240;

function TitleMain(game) {
    this.initialize.apply(this, arguments);
}

TitleMain.prototype = new GameState;

TitleMain.prototype.timer = 0;
TitleMain.prototype.offset_x = 0;
TitleMain.prototype.offset_y = 0;

TitleMain.prototype.update = function () {
    this.timer ++;
    if(this.timer % 5 == 0){
        this.offset_x = (Math.random() * 3000 / 11) % 5 - 3;
        this.offset_y = (Math.random() * 3000 / 11) % 5 - 3;
    }

    if(this.game.key.isEnter() && this.timer > 5){
        this.setMsg(GAMESTATE.MSG_REQ_OPENING);

//        if(islunker){
//            g_playerdata.init(PlayerData.GAMEMODE_LUNKER);
//        }else{
//            g_playerdata.init(PlayerData.GAMEMODE_NORMAL);
//        }
    }
}

TitleMain.prototype.draw = function() {
//    if(islunker){
//        Hell_fillRect(0,0,g_width,g_height,0,0,0);
//    }else{
        this.game.fillRect(0,0,g_width,g_height,255,255,255);
//    }


    this.game.draw("msg", (g_width - 256) / 2 ,  32 + (g_height-240)/2 , 0 , 0 , 256 , 64);
    this.game.draw("msg", (g_width - 256) / 2 + this.offset_x  , 160 + this.offset_y + (g_height-240)/2 , 0 , 64 , 256 , 32);
}

function OpeningMain(game) {
    this.initialize.apply(this, arguments);
}

OpeningMain.prototype = new GameState;
OpeningMain.prototype.timer = 0;
OpeningMain.prototype.SCROLL_LEN = 416;
OpeningMain.prototype.SCROLL_SPEED = 3;

OpeningMain.prototype.update = function () {
    this.timer ++;

    if( this.game.key.isEnter() ) this.timer+=20;
    if( this.timer / this.SCROLL_SPEED > this.SCROLL_LEN + g_height){
        this.setMsg(GAMESTATE.MSG_REQ_GAME);
        //Hell_stopBgm(0);
    }
}

OpeningMain.prototype.draw = function () {
    this.game.fillRect(0,0,g_width,g_height,255,255,255);

    this.game.draw("msg" , (g_width - 256) / 2 , g_height - (this.timer / this.SCROLL_SPEED) ,0 , 160, 256 , this.SCROLL_LEN);
}

function GameMain(game) {
    this.initialize.apply(this, arguments);
}

GameMain.prototype = new GameState;

GameMain.prototype.update = function () {
}

GameMain.prototype.draw = function () {
}

function Game() {
    this.initialize.apply(this, arguments);
}

Game.prototype = {
    px: 0,
    gameState: null,
    selfa: null,
    initialize: function() {
        this.px = 100;
//        this.gameState = new TitleMain(this);
    },
    run: function() {
        this.update();
        if (this.key.isRight()) {
            this.px ++;
        }
        if (this.key.isLeft()) {
            this.px --;
        }
    },
    update: function() {
        this.context.drawImage(this.img, 0, 16 * 8, 16, 16, this.px, 0, 16, 16);
    },
    start: function() {
        var self = this;
//        this._intervalId = setInterval(self.run, 1000 / this.fps);
//        this._intervalId = setInterval(function() {self.run();}, 1000 / self.fps);
        selfa = self;
        this._intervalId = setInterval(function() {self.loop();}, 1000 / self.fps);
    },
    loop: function() {
        if (this.gameState == null) {
            this.gameState = new TitleMain(selfa);
        } else {
            switch (this.gameState.getMsg()) {
                case GAMESTATE.MSG_REQ_TITLE:
                    this.gameState = new TitleMain(this);
                    break;
                case GAMESTATE.MSG_REQ_OPENING:
                    this.gameState = new OpeningMain(this);
                    break;
                case GAMESTATE.MSG_REQ_GAME:
                    this.gameState = new GameMain(this);
                    break;
            }
        }
        this.gameState.draw();
        this.gameState.update();
    },
    fillRect: function(x, y, w, h, r, g, b) {
        this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        this.context.fillRect(x, y, w, h);
    },
    draw: function(key, px, py, sx, sy, sw, sh) {
        this.context.drawImage(this.img[key], sx, sy, sw, sh, px, py, sw, sh);
    }
}

function init() {
    var canvas = document.getElementById('canvas');
    if (!canvas || !canvas.getContext) {
        return false;
    }

    var game = new Game();
    game.fps = 30;
    game.context = canvas.getContext('2d');

    var key = new Key();
    game.key = key;

    game.img = {};
    var img = new Image();
    img.src = "resource/image/ino.png";
    img.onload = function() {
        game.img['ino'] = img;
        var ximg = new Image();
        ximg.src = "resource/image/msg.png";
        ximg.onload = function() {
            game.img['msg'] = ximg;
            game.start();
        }
    }

    /*
    var img = new Image();
    img.src = "resource/image/ino.png";
    img.onload = function () {
//                ctx.drawImage(img, 0, 0);
//                ctx.drawImage(img, 0, 16 * 8, 16, 16, 0, 0, 32, 16);
        game.img = img;
        game.start();
    }*/
}