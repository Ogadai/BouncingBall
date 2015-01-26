(function () {
    'use strict';

    define(["./paddle", "./ball", "./scene"], function (Paddle, Ball, Scene) {
        function Game() {
            var canvas, context;
            var paddle, ball, scene, score, requestedEnd;
            var lastTime, fps, lastFpsTime;

            var setupGame = function setupGame() {
                paddle = new Paddle();
                ball = new Ball();
                scene = new Scene();

                ball.position.x = canvas.width / 2;
                paddle.position.x = canvas.width / 2;

                score = 0;
                requestedEnd = false;

                lastTime = null;
                fps = 0;
                lastFpsTime = null;

                animationFrame();
            };

            var animate = function animate() {
                var sElapsed = 0;
                var currentTime = new Date();

                if (lastTime) sElapsed = (currentTime - lastTime) / 1000;
                if (sElapsed && (!lastFpsTime || currentTime - lastFpsTime > 1000)) {
                    fps = Math.round(1 / sElapsed);
                    lastFpsTime = currentTime;
                }

                checkSceneSpeed();

                ball.animate(sElapsed);
                paddle.animate(sElapsed);
                scene.animate(sElapsed);

                paddle.detectBall(ball, sElapsed);
                scene.detectBall(ball, sElapsed);

                if (ball.position.y < 1000) {
                    score = Math.max(score, Math.round(ball.position.x - scene.position.x));
                }
                lastTime = currentTime;
            };

            var adjustSpeed = function adjustSpeed(size, limit, position, speed) {
                var min = size * limit;
                var max = size - min;

                if (position > max) {
                    return 1000 * Math.pow((position - max) / (size - max), 2);
                } else if (position < min) {
                    return -1000 * Math.pow((position - min) / min, 2);
                }
                return 0;
            };

            var checkSceneSpeed = function checkSceneSpeed() {
                var limitX = canvas.width / 3;
                var limitY = canvas.height / 4;

                var newSpeed = {
                    x: adjustSpeed(canvas.width, 1 / 3, ball.position.x, scene.speed.x),
                    y: adjustSpeed(canvas.height, 1 / 4, ball.position.y, scene.speed.y)
                };

                ball.sceneSpeed = newSpeed;
                scene.speed = newSpeed;
            };

            var draw = function draw() {
                var canvasRect = { left: 0, top: 0, width: canvas.width, height: canvas.height };
                context.clearRect(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);

                ball.drawSprite(context, canvasRect);
                scene.drawSprite(context, canvasRect);
                paddle.drawSprite(context, canvasRect);

                // Reset transform
                context.setTransform(1, 0, 0, 1, 0, 0);

                drawScore();
                drawFPS();
            };

            var drawFPS = function drawFPS() {
                context.font = '10pt Calibri';
                context.fillStyle = "#808080";
                var fpsText = 'FPS: ' + fps + ', width: ' + canvas.style.width + ', height: ' + canvas.style.height;
                context.fillText(fpsText, 10, 40);
            };

            var drawScore = function drawScore() {
                context.font = '12pt Calibri';
                context.fillStyle = "#20A020";
                context.fillText('Score: ' + score, 10, 20);
            };

            var drawGameOver = function drawGameOver() {
                context.font = '24pt Calibri';
                context.fillStyle = "#A02020";

                var text = 'Game Over! Score: ' + score;
                var metrics = context.measureText(text);
                context.fillText(text, (canvas.width - metrics.width) / 2, (canvas.height - 24) / 2);
            };

            var checkGameOver = function checkGameOver() {
                return requestedEnd || ball.position.y > 2000;
            };

            var animationFrame = function animationFrame() {
                animate();
                draw();

                if (checkGameOver()) {
                    drawGameOver();
                    if (!requestedEnd) setTimeout(setupGame, 3000);
                } else {
                    requestAnimFrame(animationFrame);
                }
            };

            var touchMove = function touchMove(ev) {
                var scale = { x: canvas.width / window.innerWidth, y: canvas.height / window.innerHeight };
                var touches = [];
                for (var n = 0; n < ev.touches.length; n++) {
                    var touch = ev.touches[n];
                    touches.push({ x: touch.clientX * scale.x, y: touch.clientY * scale.y });
                }

                if (paddle.touchMove) paddle.touchMove(ev, touches);
            };

            // Polyfill for requestAnimFrame
            var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };

            // Resize the canvas to fill browser window dynamically
            var windowSize = null;
            var setCanvasSize = function setCanvasSize() {
                var parent = canvas.parentElement;
                parent.style.width = windowSize ? windowSize.width + 'px' : '';
                parent.style.height = windowSize ? windowSize.height + 'px' : '';

                canvas.style.width = parent.clientWidth + "px";
                canvas.style.height = parent.clientHeight + "px";

                canvas.width = 1000 * window.innerWidth / window.innerHeight;
            };

            this.setSize = function setSize(size) {
                windowSize = size;
            };

            this.initialise = function initialise(canvasElement) {
                canvas = canvasElement;
                context = canvas.getContext('2d');

                canvas.addEventListener('touchmove', touchMove);

                window.addEventListener('resize', setCanvasSize, false);
                setCanvasSize();

                setupGame();
            };

            this.restart = function restart() {
                setupGame();
            };

            this.endGame = function endGame() {
                requestedEnd = true;
            };
        }

        return new Game();
    });
})();