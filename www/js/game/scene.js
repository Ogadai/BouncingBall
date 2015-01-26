(function () {
    'use strict';

    define(["./sprite-base", "./vector-maths"], function (SpriteBase, vectorMaths) {
        Scene.prototype = new SpriteBase();
        Scene.prototype.constructor = Scene;
        function Scene() {
            this.position = { x: 800, y: 0 };
            this.lastPosition = { x: this.position.x, y: this.position.y };
            this.speed = { x: 0, y: 0 };

            this.walls = [
                { start: { x: -1000, y: -8000 }, end: { x: 2100, y: 50 }, thickness: 10 },    // Guard
                { start: { x: 0, y: 900 }, end: { x: 500, y: 950 }, thickness: 10 },
                { start: { x: 500, y: 950 }, end: { x: 800, y: 730 }, thickness: 10 },
                { start: { x: 800, y: 730 }, end: { x: 900, y: 450 }, thickness: 30 },
                { start: { x: 900, y: 100 }, end: { x: 600, y: 100 }, thickness: 20 },
                { start: { x: 1000, y: 950 }, end: { x: 1800, y: 950 }, thickness: 10 },
                { start: { x: 1600, y: 100 }, end: { x: 1100, y: 100 }, thickness: 10 },
                { start: { x: 1500, y: 800 }, end: { x: 1500, y: 300 }, thickness: 20 },
                { start: { x: 1400, y: 980 }, end: { x: 2000, y: 980 }, thickness: 10 },
                { start: { x: 2000, y: 980 }, end: { x: 2000, y: 550 }, thickness: 10 },
                { start: { x: 2000, y: 350 }, end: { x: 2000, y: 50 }, thickness: 10 },
                { start: { x: 2000, y: 50 }, end: { x: 1500, y: 50 }, thickness: 10 },
                { start: { x: 2000, y: 350 }, end: { x: 2300, y: 400 }, thickness: 10 }, // Hole Entry and narrows
                { start: { x: 2000, y: 550 }, end: { x: 2100, y: 500 }, thickness: 10 },
                { start: { x: 2100, y: 500 }, end: { x: 2200, y: 550 }, thickness: 10 }, // Widens
                { start: { x: 2300, y: 400 }, end: { x: 2400, y: 600 }, thickness: 10 },
                { start: { x: 2200, y: 550 }, end: { x: 2200, y: 700 }, thickness: 10 },
                { start: { x: 2200, y: 700 }, end: { x: 2300, y: 700 }, thickness: 10 }, // Exited pipe
                { start: { x: 2300, y: 700 }, end: { x: 2400, y: 900 }, thickness: 10 }, // Bowl
                { start: { x: 2300, y: 900 }, end: { x: 2800, y: 900 }, thickness: 10 },
                { start: { x: 2800, y: 900 }, end: { x: 3000, y: 600 }, thickness: 10 },
                { start: { x: 3000, y: 600 }, end: { x: 3000, y: 300 }, thickness: 10 }
            ];
        }

        Scene.prototype._draw = function _draw(context, contextRect) {
            drawWalls.call(this, context, contextRect);
        };

        var applyVector = function applyVector(point, vector, scale) {
            return { x: point.x + vector.x * scale, y: point.y + vector.y * scale };
        };

        var getWallLines = function getWallLines(wall) {
            var unitVector = vectorMaths.unitVectorFromPoints(wall.start, wall.end);
            var perp = { x: unitVector.y, y: -unitVector.x };

            return [
                { start: applyVector(wall.start, perp, wall.thickness), end: applyVector(wall.end, perp, wall.thickness) },
                { start: applyVector(wall.end, perp, wall.thickness), end: applyVector(wall.end, perp, -wall.thickness) },
                { start: applyVector(wall.end, perp, -wall.thickness), end: applyVector(wall.start, perp, -wall.thickness) },
                { start: applyVector(wall.start, perp, -wall.thickness), end: applyVector(wall.start, perp, wall.thickness) }
            ];
        };

        var drawWalls = function drawWalls(context, contextRect) {
            var sceneRect = { left: -this.position.x, top: -this.position.y, width: contextRect.width, height: contextRect.height };

            this.walls.forEach(function (wall) {
                if (vectorMaths.lineIntersectsRect(wall.start, wall.end, sceneRect)) {
                    var wallLines = getWallLines(wall);

                    context.beginPath();
                    context.moveTo(wallLines[0].start.x, wallLines[0].start.y);
                    wallLines.forEach(function (line) {
                        context.lineTo(line.end.x, line.end.y);
                    }, this);
                    context.closePath();

                    // fill
                    var unitVector = vectorMaths.unitVectorFromPoints(wall.start, wall.end);
                    var mid = { x: (wall.end.x + wall.start.x) / 2, y: (wall.end.y + wall.start.y) / 2 };
                    var perp = { x: unitVector.y, y: -unitVector.x };
                    var fillFrom = applyVector(mid, perp, wall.thickness);
                    var fillTo = applyVector(mid, perp, -wall.thickness);

                    // create radial gradient
                    var grd = context.createLinearGradient(fillFrom.x, fillFrom.y, fillTo.x, fillTo.y);
                    // light blue
                    grd.addColorStop(0, '#00B34C');
                    // dark blue
                    grd.addColorStop(1, '#8EFFD6');
                    context.fillStyle = grd;
                    context.fill();
                }
            });
        };

        Scene.prototype.animate = function animate(sElapsed) {
            this.position.x -= sElapsed * this.speed.x;
            this.position.y -= sElapsed * this.speed.y;
        };

        Scene.prototype.detectBall = function detectBall(ball, sElapsed) {
            var bestStrike = null;
            var lines = this.walls.reduce(function (array, wall) {
                var wallLines = getWallLines(wall);
                wallLines.forEach(function (l) { array.push(l); });
                return array;
            }, []);

            lines.forEach(function (line) {
                var curLine = {
                    start: { x: line.start.x + this.position.x, y: line.start.y + this.position.y },
                    end: { x: line.end.x + this.position.x, y: line.end.y + this.position.y }
                };
                var prevLine = {
                    start: { x: line.start.x + this.lastPosition.x, y: line.start.y + this.lastPosition.y },
                    end: { x: line.end.x + this.lastPosition.x, y: line.end.y + this.lastPosition.y }
                };

                var struck = vectorMaths.checkBallDeflection(prevLine, curLine, ball, sElapsed);
                if (struck) {
                    if (!bestStrike || struck.dist < bestStrike.dist) bestStrike = struck;
                }
            }, this);

            if (bestStrike) {
                ball.struck(bestStrike.vector, bestStrike.overshot);
            }
        };

        return Scene;
    });
})();