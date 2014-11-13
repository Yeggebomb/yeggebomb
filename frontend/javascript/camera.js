goog.provide('game.Camera');
goog.provide('game.Camera.Axis');

goog.require('game.Point');
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
  this.viewportEl = game.constants.Elements.VIEWPORT_EL;

  /** @private {!game.Board}*/
  this.board_ = new game.Board();
  // distance from followed object to border before camera starts move
  /** @private {number} */
  this.xDeadZone_ = this.viewportEl.offsetWidth / 2;
  /** @private {number} */
  this.yDeadZone_ = this.viewportEl.offsetHeight / 2;

  // viewport dimensions
  this.hView = this.viewportEl.offsetHeight;
  this.wView = this.viewportEl.offsetWidth;

  // allow camera to move in vertical and horizontal axis
  /** @private {game.Camera.Axis} */
  this.axis_ = game.Camera.Axis.BOTH;

  // object that should be followed
  /** @private {!game.Entity} */
  this.watchedEntity_;

  // // rectangle that represents the viewport
  // this.viewportRect =

  // // rectangle that represents the world's boundary (room's boundary)
  // this.worldRect =


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
  var xDeadZone = this.xDeadZone_;
  var yDeadZone = this.yDeadZone_;
  // var xDeadZone = 100;
  // var yDeadZone = 100;

  if (this.watchedEntity_ != null) {
    var followedX = this.watchedEntity_.getPosition().getX();
    var followedY = this.watchedEntity_.getPosition().getY();
    if (axis == Axis.HORIZONTAL || axis == Axis.BOTH) {
      if (followedX > wView - xDeadZone) {
        xView = Math.max(
            (followedX - (wView - xDeadZone)) * - 1, -1000 + wView);
      } else if (followedX < xView + xDeadZone) {
        xView = Math.min((followedX - xDeadZone) * -1, 0);
      }
    }
    if (axis == Axis.VERTICAL || axis == Axis.BOTH) {
      if (followedY > hView - yDeadZone) {
        yView = Math.max(
            (followedY - (hView - yDeadZone)) * - 1, -1000 + hView);
      } else if (followedY < yView + yDeadZone) {
        yView = Math.min((followedY - yDeadZone) * -1, 0);
      }
    }
  }


  if (this.lastX_ == xView && yView == this.lastY_) return;
  this.lastX_ = xView;
  this.lastY_ = yView;

  // update viewportRect
  // Yikes 'new' in a loop :( This just screams memory leak.
  // I can make this better.
  this.board_.setPosition(new game.Point(xView, yView));

  // // don't let camera leaves the world's boundary
  // if (!this.viewportRect.within(this.worldRect)) {
  //   if (this.viewportRect.left < this.worldRect.left)
  //     this.xView = this.worldRect.left;
  //   if (this.viewportRect.top < this.worldRect.top)
  //     yView = this.worldRect.top;
  //   if (this.viewportRect.right > this.worldRect.right)
  //     this.xView = this.worldRect.right - wView;
  //   if (this.viewportRect.bottom > this.worldRect.bottom)
  //     yView = this.worldRect.bottom - this.hView;
  // }
};
