(function () {
    'use strict';

    define(["./sprite-base", "./vector-maths"], function (SpriteBase, vectorMaths) {
        Paddle.prototype = new SpriteBase();
        Paddle.prototype.constructor = Paddle;
        function Paddle() {
            this.position = { x: 400, y: 800 };
            this.lastRotation = this.rotation;
            this.size = 100;
        }

        Paddle.prototype._draw = function draw(context) {
            context.beginPath();
            context.moveTo(-100, 0);
            context.lineTo(100, 0);
            context.bezierCurveTo(100, 50, -100, 50, -100, 0);
            context.closePath();

            // shadow
            //context.shadowColor = '#BBB';
            //context.shadowBlur = 20;
            //context.shadowOffsetX = 15;
            //context.shadowOffsetY = 15;

            // fill
            // create radial gradient
            var grd = context.createRadialGradient(0, 0, 10, 0, 0, 300);
            // light blue
            grd.addColorStop(0, '#8ED6FF');
            // dark blue
            grd.addColorStop(1, '#004CB3');
            context.fillStyle = grd;
            context.fill();

            // line
            context.lineWidth = 3;
            context.strokeStyle = '#3030FF';
            context.stroke();

            this.lastRotation = this.rotation;
        };

        Paddle.prototype.touchMove = function touchMove(ev, touches) {
            if (touches) {
                if (touches.length >= 2) {
                    var vector = { x: touches[1].x - touches[0].x, y: touches[1].y - touches[0].y };
                    this.rotation = Math.atan(vector.y / vector.x);
                }

                var pos = {
                    x: touches.reduce(function (sum, t) { return sum + t.x; }, 0) / touches.length,
                    y: touches.reduce(function (sum, t) { return sum + t.y; }, 0) / touches.length - 50
                };
                var move = { x: pos.x - this.position.x, y: pos.y - this.position.y };

                var distance = Math.sqrt(Math.pow(move.x, 2) + Math.pow(move.y, 2));
                if (distance > 50) {
                    var speed = 10 / distance;
                    this.position.x += speed * move.x;
                    this.position.y += speed * move.y;
                } else {
                    this.position = pos;
                }
            }
        };

        var getLineEnds = function getLineEnds(position, rotation) {
            var vector = { x: Math.cos(rotation), y: Math.sin(rotation) };
            return {
                start: { x: position.x - vector.x * this.size, y: position.y - vector.y * this.size },
                end: { x: position.x + vector.x * this.size, y: position.y + vector.y * this.size }
            };
        };

        Paddle.prototype.detectBall = function detectBall(ball, sElapsed) {
            var prevLine = getLineEnds.call(this, this.lastPosition, this.lastRotation);
            var nowLine = getLineEnds.call(this, this.position, this.rotation);

            var struck = vectorMaths.checkBallDeflection(prevLine, nowLine, ball, sElapsed);
            if (struck) {
                ball.struck(struck.vector, struck.overshot);
            }
        };


        return Paddle;
    });
})();