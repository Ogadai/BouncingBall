(function () {
    'use strict';

    define([], function () {
        function VectorMaths() {
        }

        VectorMaths.prototype.lineFromPoints = function lineFromPoints(point1, point2) {
            return { x: point2.x - point1.x, y: point2.y - point1.y };
        };

        VectorMaths.prototype.lineLength = function lineLength(line) {
            return Math.sqrt(Math.pow(line.x, 2) + Math.pow(line.y, 2));
        };

        VectorMaths.prototype.pointsDistance = function pointsDistance(point1, point2) {
            return this.lineLength(this.lineFromPoints(point1, point2));
        };

        VectorMaths.prototype.unitVectorFromPoints = function unitVectorFromPoints(point1, point2) {
            var line = this.lineFromPoints(point1, point2);
            var length = this.lineLength(line);
            return { x: line.x / length, y: line.y / length };
        };

        var hitTest = function hitTest(p, v, b) {
            var dist = (b.x * v.y - b.y * v.x + p.y * v.x - p.x * v.y) / (Math.pow(v.x, 2) + Math.pow(v.y, 2));
            var at = v.x !== 0 ? (b.x - p.x - dist * v.y) / v.x : (b.y - p.y + dist * v.x) / v.y;

            return { dist: dist, at: at, vector: { x: v.y, y: -v.x } };
        };

        VectorMaths.prototype.hitTestBall = function hitTestBall(lineStart, lineEnd, ball) {
            // Get the unit vector along the line
            var vector = this.unitVectorFromPoints(lineStart, lineEnd);
            return hitTest(lineStart, vector, ball);
        };

        VectorMaths.prototype.checkBallDeflection = function checkBallDeflection(prevLine, nowLine, ball, sElapsed) {
            // Hit test at start of time segment
            var hitStart = this.hitTestBall(prevLine.start, prevLine.end, ball.lastPosition);

            // Hit test at end of time segment
            var hitEnd = this.hitTestBall(nowLine.start, nowLine.end, ball.position);

            var lineLen = this.pointsDistance(nowLine.start, nowLine.end);
            if (hitStart.dist >= ball.radius && hitEnd.dist <= ball.radius
                    && hitEnd.at < lineLen + ball.radius && hitEnd.at > -ball.radius) {

                var speed = 2 * (hitStart.dist - hitEnd.dist) / sElapsed;
                var struckVector = { x: hitEnd.vector.x * speed, y: hitEnd.vector.y * speed };
                var dist = 0;

                // Prevent the ball from falling through
                var struckForce = this.lineLength(struckVector);
                if (struckForce < 400) struckVector = { x: struckVector.x * 500 / struckForce, y: struckVector.y * 500 / struckForce };

                // May have clipped it
                var rotate = 0;
                if (hitEnd.at > lineLen) {
                    dist = (hitEnd.at - lineLen) / ball.radius;
                    rotate = Math.PI / 2 * dist;
                } else if (hitEnd.at < 0) {
                    dist = -hitEnd.at / ball.radius;
                    rotate = Math.PI / 2 * -dist;
                }

                if (rotate) {
                    struckVector = {
                        x: struckVector.x * Math.cos(rotate) - struckVector.y * Math.sin(rotate),
                        y: struckVector.x * Math.sin(rotate) + struckVector.y * Math.cos(rotate)
                    };
                }

                return {
                    dist: dist,
                    vector: struckVector,
                    overshot: hitEnd.dist
                };
            }
            return null;
        };

        VectorMaths.prototype.lineIntersectsRect = function lineIntersectsRect(start, end, rect) {
            return !((start.x < rect.left && end.x < rect.left)
                    || (start.x > rect.left + rect.width && end.x > rect.left + rect.width)
                    || (start.y < rect.top && end.y < rect.top)
                    || (start.y > rect.top + rect.height && end.y > rect.top + rect.height));
        };

        return new VectorMaths();
    });
})();