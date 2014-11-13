goog.provide('game.mixins.Twoway');



/**
 * An entity mixin that gives the an entity the ability to move left, right, up
 * or down.
 *
 * @constructor
 */
game.mixins.Twoway = function() {
  // Nothing can live here and be accessed by the class we are mixing these
  // functions into.
};


/** moveLeft */
game.mixins.Twoway.prototype.moveLeft = function() {
  var position = this.getPosition();
  position.setX(position.getX() - 5);
  this.setPosition(position);
};


/** moveRight */
game.mixins.Twoway.prototype.moveRight = function() {
  var position = this.getPosition();
  position.setX(position.getX() + 5);
  this.setPosition(position);
};
