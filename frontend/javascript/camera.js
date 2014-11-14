goog.provide('game.Camera');
goog.provide('game.Camera.Axis');

goog.require('game.Point');
goog.require('game.Viewport');
goog.require('game.constants.Elements');



/**
 * Camera singleton class, the camera is responsible for updating the view port.
 *
 * @constructor
 */
game.Camera = function() {
  if (game.Camera.prototype._singletonInstance) {
    return game.Camera.prototype._singletonInstance;
  }
  game.Camera.prototype._singletonInstance = this;
  /** @private {!game.Board}*/
  this.board_ = new game.Board();
  /** @private {!game.Viewport}*/
  this.viewport_ = new game.Viewport();

  /** @private {number} */
  this.lastX_ = 0;
  /** @private {number} */
  this.lastY_ = 0;
};


/**
 * Various axis this camera can have.
 *
 * @enum {number}
 */
game.Camera.Axis = {
  NONE: 0,
  HORIZONTAL: 1,
  VERTICAL: 2,
  BOTH: 3
};


/**
 * Sets the reference to the point the camera is tracking.
 *
 * @param {!game.Entity} entity The reference to the point the camera is
 *     tracking. (Really anything that has {@code game.mixins.Rectangle}).
 */
game.Camera.prototype.watch = function(entity) {
  this.watchedEntity_ = entity;

  // viewport dimensions
  this.hView = this.viewport_.getHeight();
  this.wView = this.viewport_.getWidth();

  /** @private {number} */
  this.xDeadZone_ = this.wView / 2;
  /** @private {number} */
  this.yDeadZone_ = this.hView / 2;

  /** @private {game.Camera.Axis} */
  this.axis_ = game.Camera.Axis.BOTH;

  // object that should be followed
  /** @private {!game.Entity} */
  this.watchedEntity_;
};


/**
 * Update the camera's position.
 */
game.Camera.prototype.update = function() {
  var Axis = game.Camera.Axis;
  var axis = this.axis_;
  var hView = this.hView;
  var wView = this.wView;
  var xView = this.board_.getPosition().getX();
  var yView = this.board_.getPosition().getY();
  var boardWidth = this.board_.getWidth();
  var boardHeight = this.board_.getHeight();
  var xDeadZone = this.xDeadZone_;
  var yDeadZone = this.yDeadZone_;

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

  // Yikes 'new' in a loop :( This just screams memory leak.
  this.board_.setPosition(new game.Point(xView, yView));
};
