(function () {
    'use strict';

    define(["./sprite-base", "./vector-maths"], function (SpriteBase, vectorMaths) {
        Ball.prototype = new SpriteBase();
        Ball.prototype.constructor = Ball;
        function Ball() {
            this.position = { x: 400, y: 200 };

            this.velocity = { x: 0, y: 0 };
            this.radius = 25;
            this.sceneSpeed = { x: 0, y: 0 };
        }

        Ball.prototype._draw = function draw(context) {
            context.beginPath();
            context.arc(0, 0, 25, 0, 2 * Math.PI, false);
            context.closePath();

            // shadow            
            //context.shadowColor = '#BBB';
            //context.shadowBlur = 20;
            //context.shadowOffsetX = 15;
            //context.shadowOffsetY = 15;

            // fill
            // create radial gradient
            var grd = context.createRadialGradient(10, -10, 10, 10, -10, 30);
            // light
            grd.addColorStop(0, '#FFFFFF');
            // dark
            grd.addColorStop(1, '#A0A0A0');
            context.fillStyle = grd;
            context.fill();

            // line
            context.lineWidth = 2;
            context.strokeStyle = '#404040';
            context.stroke();
        };

        var gravity = 3000;
        var resistance = 100;
        Ball.prototype.animate = function (sElapsed) {
            // Affect of gravity
            this.velocity.y += sElapsed * gravity;

            // Affect of air resistance
            this.velocity.x -= this.velocity.x / resistance;
            this.velocity.y -= this.velocity.y / resistance;

            this.position.x += sElapsed * (this.velocity.x - this.sceneSpeed.x);
            this.position.y += sElapsed * (this.velocity.y - this.sceneSpeed.y);
        };

        Ball.prototype.struck = function (vector, overshot) {
            this.velocity.x += vector.x;
            this.velocity.y += vector.y;
            var vectorLen = vectorMaths.lineLength(vector);

            // Correct the overshoot
            this.position.x += overshot * vector.x / vectorLen;
            this.position.y += overshot * vector.y / vectorLen;

            // Vibrate and sound volume
            var volume = vectorLen / 3000;
            if (volume > 1) volume = 1;

            setTimeout(function () {
                vibrate(volume);
                playSound(volume);
            }, 1);
        };

        var vibrate = function vibrate() {
            if (navigator && navigator.vibrate) navigator.vibrate(10);
        };

        var ballSoundSrc = 'sound/pingpong_ball_once.mp3';
        var ballSoundLoaded = false;

        var ballBoundSound = window.Media
            ? new Media('/android_asset/www/' + ballSoundSrc, function () { ballSoundLoaded = true; }, function (err) {
                console.log("playAudio():Audio Error: " + err);
            }) : new Audio(ballSoundSrc);

        var playSound = function playSound(volume) {
            if (ballBoundSound.setVolume)
                ballBoundSound.setVolume(volume);
            else
                ballBoundSound.volume = volume;

            ballBoundSound.play();
        };

        return Ball;
    });
})();