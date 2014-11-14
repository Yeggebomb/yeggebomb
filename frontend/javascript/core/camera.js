goog.provide('game.core.Camera');
goog.provide('game.core.Camera.Axis');

goog.require('game.Backdrop');
goog.require('game.Board');
goog.require('game.core.Viewport');
goog.require('game.core.math.Point');



/**
 * Camera singleton class, the camera is responsible for updating the view port.
 *
 * @constructor
 */
game.core.Camera = function() {
  if (game.core.Camera.prototype._singletonInstance) {
    return game.core.Camera.prototype._singletonInstance;
  }
  game.core.Camera.prototype._singletonInstance = this;
  /** @private {!game.Board}*/
  this.board_ = new game.Board();
  /** @private {!game.core.Viewport}*/
  this.viewport_ = new game.core.Viewport();
  /** @private {!game.core.Camera.Axis} */
  this.axis_ = game.core.Camera.DEFAULT_AXIS_;

  /** @private {number} */
  this.lastX_ = 0;
  /** @private {number} */
  this.lastY_ = 0;

  /** @private {array.<!game.core.Entity>} */
  this.layers_ = [];

  // Add the board as the first layer.
  this.addLayer(this.board_, 1);
};


/**
 * Various axis this camera can have.
 *
 * @enum {number}
 */
game.core.Camera.Axis = {
  NONE: 0,
  HORIZONTAL: 1,
  VERTICAL: 2,
  BOTH: 3
};


/**
 * @private {!game.core.Camera.Axis}
 */
game.core.Camera.DEFAULT_AXIS_ = game.core.Camera.Axis.BOTH;


/**
 * Sets the reference to the point the camera is tracking.
 *
 * @param {!game.core.Entity} entity The reference to the point the camera is
 *     tracking. (Really anything that has {@code game.mixins.Rectangle}).
 * @param {?game.core.Camera.Axis=} opt_axis
 */
game.core.Camera.prototype.watch = function(entity, opt_axis) {
  this.watchedEntity_ = entity;
  this.axis_ = opt_axis || game.core.Camera.DEFAULT_AXIS_;
};


/**
 * Registers a layer to be displayed behind the board.
 *
 * @param {!game.core.Entity} layer
 * @param {number} distance A number from 0 - 1 determines how far away form the
 *     camera it appears to be.
 */
game.core.Camera.prototype.addLayer = function(layer, distance) {
  this.layers_.push({
    layer: layer,
    distance: distance
  });
};


/**
 * Update the camera's position.
 */
game.core.Camera.prototype.update = function() {
  var Axis = game.core.Camera.Axis;
  var axis = this.axis_;
  var hView = this.viewport_.getHeight();
  var wView = this.viewport_.getWidth();
  var xView = this.board_.getPosition().getX();
  var yView = this.board_.getPosition().getY();
  var boardWidth = this.board_.getWidth();
  var boardHeight = this.board_.getHeight();
  var xDeadZone = wView / 2;
  var yDeadZone = hView / 2;

  if (wView > boardWidth) {
    // I could scale here but it might look crappy. It would be cool though.
    console.warn('width is too large');
  }

  if (hView > boardHeight) {
    // I could scale here but it might look crappy. It would be cool though.
    console.warn('height is too large');
  }

  if (this.watchedEntity_ != null) {
    var followedX = this.watchedEntity_.getPosition().getX();
    var followedY = this.watchedEntity_.getPosition().getY();
    if (axis == Axis.HORIZONTAL || axis == Axis.BOTH) {
      if (followedX > wView - xDeadZone) {
        xView = Math.max(
            (followedX - (wView - xDeadZone)) * - 1, wView - boardWidth);
      } else if (followedX < xView + xDeadZone) {
        xView = Math.min((followedX - xDeadZone) * -1, 0);
      }
    }

    if (axis == Axis.VERTICAL || axis == Axis.BOTH) {
      if (followedY > hView - yDeadZone) {
        yView = Math.max(
            (followedY - (hView - yDeadZone)) * - 1, hView - boardHeight);
      } else if (followedY < yView + yDeadZone) {
        yView = Math.min((followedY - yDeadZone) * -1, 0);
      }
    }
  }

  // Don't update if we don't need to.
  if (this.lastX_ == xView && yView == this.lastY_) return;
  this.lastX_ = xView;
  this.lastY_ = yView;

  _.each(this.layers_, function(l) {
    l.layer.setPosition(xView * l.distance, yView * l.distance);
  });
};
