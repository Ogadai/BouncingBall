(function () {
    'use strict';

    define([], function () {
        function SpriteBase() {
            this.position = { x: 0, y: 0 };
            this.lastPosition = { x: this.position.x, y: this.position.y };
            this.rotation = 0;
        }

        SpriteBase.prototype.drawSprite = function drawSprite(context, contextRect) {
            context.save();
            context.translate(this.position.x, this.position.y);
            context.rotate(this.rotation);

            if (this._draw) this._draw(context, contextRect);

            this.lastPosition = { x: this.position.x, y: this.position.y };

            // Restore context
            context.restore();
        };

        SpriteBase.prototype.animate = function animate() { };

        return SpriteBase;
    });
})();