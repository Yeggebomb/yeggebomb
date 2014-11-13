goog.provide('game.Entity');

goog.require('game.Point');
goog.require('game.mixins.Rectangle');
goog.require('helper');



/**
 * An entity. This can be a player, enemy, object or a thing. Entity will have
 * properties like position, size, scale, class & ID etc..
 *
 * @constructor
 */
game.Entity = function() {
  /** @type {string} */
  this.background = '';
  /** @private {string} */
  this.id_ = 'entity-' + game.Entity.ID_COUNT++;
  /** @type {!Element} */
  this.el = document.createElement('span');
  this.el.id = this.id_;
  this.el.classList.add(game.Entity.CLASS_NAME);

  // Entities have rectangles.
  helper.mixin(this, game.mixins.Rectangle.prototype);
};


/**
 * Class name's for all entities.
 * @type {string}
 * @const
 */
game.Entity.CLASS_NAME = 'entity';


/**
 * Global id count.
 * @type {number}
 */
game.Entity.ID_COUNT = 0;


/**
 * Updates the entity information.
 */
game.Entity.prototype.update = function() {};


/**
 * Creates and attaches the dom of this entity to the parent provided.
 * @param {Element|HTMLBodyElement} parent The parent to attach this entity
 *     to.
 */
game.Entity.prototype.attach = function(parent) {
  if (!document.getElementById(this.id_)) {
    parent.appendChild(this.el);
  } else {
    console.warn('Attempted to attach dom element multiple times:', this.el_);
  }
  this.setupEventListeners();
};


/**
 * Detach element from dom.
 */
game.Entity.prototype.detach = function() {
  if (this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  } else {
    console.warn(
        'Attempted to remove dom element when it has no parent', this.el_);
  }
  this.destroyEventListeners();
};


/**
 * Sets up event listeners.
 */
game.Entity.prototype.setupEventListeners = function() {};


/**
 * Destroys event listeners.
 */
game.Entity.prototype.destroyEventListeners = function() {};


/**
 * The background of the entity.
 *
 * @return {string}
 */
game.Entity.prototype.getBackground = function() {
  return this.background_;
};


/**
 * The background style on the entity.
 *
 * @param {string} background
 */
game.Entity.prototype.setBackground = function(background) {
  this.background_ = background;
  this.el.style.background = background;
};
