(function() {
    var BoardPiece = function() {
        this.initialize();
    }
    
    BoardPiece.prototype = new createjs.Shape();
    
    BoardPiece.prototype.moveToSquare = function (xSquare, ySquare) {     
        this.x = (100*xSquare) - 50;
        this.y = (100*ySquare) - 50;
        }
    
    //----------------------------------------------------------
 	// Define a Square
    var Square = function(x, y, width, height, color) {
        x = typeof x !== 'undefined' ? x : 0;
        y = typeof y !== 'undefined' ? y : 0;
        width = typeof width !== 'undefined' ? width : 100;
        height = typeof height !== 'undefined' ? height : 100;
        color = typeof color !== 'undefined' ? color : "red";
        
        this.initialize();
        this.graphics.beginFill(color).drawRect(x, y, width, height, color);
    }

    Square.prototype = new BoardPiece();
    
    window.Square = Square;
    
    //----------------------------------------------------------
    // Define a Circle
    var Circle = function(x, y, radius , color) {
        x = typeof x !== 'undefined' ? x : 0;
        y = typeof y !== 'undefined' ? y : 0;
        radius = typeof radius !== 'undefined' ? radius : 50;
        color = typeof color !== 'undefined' ? color : "blue";
        
        this.initialize();
        this.graphics.beginFill(color).drawCircle(x, y, radius);
    }

   	Circle.prototype = new BoardPiece();
    
    window.Circle = Circle;
    
    //----------------------------------------------------------
    // Define a Robot
    var Robot = function(x, y, width, height, color) {
        width = typeof width !== 'undefined' ? width : 100;
        height = typeof height !== 'undefined' ? height : 100;
        color = typeof color !== 'undefined' ? color : "red";
        
        this.initialize();
        this.graphics.beginFill(color).drawRect(0, 0, width, height, color);
        
        this.x = this.regX = width/2;
        this.y = this.regY = height/2;
        this.alpha = 0.8;
    }
    
    Robot.prototype = new BoardPiece();
    
    Robot.prototype.doTween = function(moveToX, moveToY, animationTime, callback) {
        createjs.Tween.get(this).to({x: moveToX, y: moveToY}, animationTime).wait(500).call(handleComplete);
        
        function handleComplete(){
            if (typeof callback !== 'undefined') {
                callback();
            }

        }
    }

	Robot.prototype.move = function(numSteps, callback) {
        
        var xStep = 100;
        var yStep = 100;
        
        if (this.rotation == 0) {
             xStep = 0;
             yStep *= -1;
        }
        else if (this.rotation == 90) {
            yStep = 0;
        }
        else if (this.rotation == 180) {
            xStep = 0;
        }
        else if (this.rotation == 240) {
            xStep *= -1;
            yStep = 0;
        }
        
        
        var moveToX = this.x + (xStep * numSteps);
        var moveToY = this.y + (yStep * numSteps);
        var animationTime = 500 * (numSteps < 0 ? numSteps*-1 : numSteps);
        
        this.doTween(moveToX, moveToY, animationTime, callback)
    }
    
    Robot.prototype.forward = function(numSteps, callback) {
        this.move(numSteps, callback);
    }
    
    Robot.prototype.back = function(numSteps, callback) {
        this.move(numSteps*-1, callback);
    }
    
    Robot.prototype.turn = function(direction, callback) {
        this.rotation += (90 * direction);
        this.rotation = this.rotation < 0 ? 360 - this.rotation : this.rotation %= 360;
        
        if (typeof callback !== 'undefined') {
            callback();
        }
    }
    
    Robot.prototype.turnRight = function(callback) {
        this.turn(1, callback);
    }
    
    Robot.prototype.turnLeft = function(callback) {
        this.turn(-1, callback);
    }
    
    Robot.prototype.eat = function(item, callback) {
        if ((item.x == this.x) && (item.y == this.y)) {
            item.parent.removeChild(item);
        }
        else {
            this.alpha -= 0.1;
        }
    }
    
    window.Robot = Robot;
}());
