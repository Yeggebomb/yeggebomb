goog.provide('game.Camera');

goog.require('game.Point');



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

  /**
   * The point the camera is tracking.
   * @private {!game.Point}
   */
  this.trackedPoint_ = new game.Point();
  /** @private {!Element} */
  this.viewPortEl_ = game.constants.Elements.VIEWPORT_EL;
  /** @private {!Element} */
  this.boardEl_ = game.constants.Elements.GAME_BOARD_EL;
  /** @private {!game.Point} */
  this.position_ = new game.Point();
  /** @private {!game.Point} */
  this.velocity_ = new game.Point();
  /** @private {!game.Point} */
  this.acceleration_ = new game.Point();
};


/**
 * Sets the reference to the point the camera is tracking.
 * @param {!game.Point} trackedPoint The reference to the point the camera is
 *     tracking.
 */
game.Camera.prototype.setTracking = function(trackedPoint) {
  this.trackedPoint_ = trackedPoint;
};


/**
 * Update the camera's position.
 */
game.Camera.prototype.update = function() {
  // Do the math to center the camera (smoothly) on the item we are tracking.
};
