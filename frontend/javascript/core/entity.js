goog.provide('game.core.Entity');

goog.require('game.core.helper');
goog.require('game.core.math.Point');
goog.require('game.mixins.Rectangle');



/**
 * An entity. This can be a player, enemy, object or a thing. Entity will have
 * properties like position, size, scale, class & ID etc..
 *
 * @constructor
 */
game.core.Entity = function() {
  /** @type {string} */
  this.background = '';
  /** @private {string} */
  this.id_ = 'entity-' + game.core.Entity.ID_COUNT++;
  /** @type {!Element} */
  this.el = document.createElement('span');
  this.el.id = this.id_;
  this.el.classList.add(game.core.Entity.CLASS_NAME);

  /** @private {number} */
  this.lastWidth_ = 0;
  /** @private {number} */
  this.lastHeight_ = 0;
  /** @private {number} */
  this.lastPositionX_ = 0;
  /** @private {number} */
  this.lastPositionY_ = 0;
  /** @private {number} */
  this.lastRotation_ = 0;
  /** @private {number} */
  this.lastScale_ = 1;

  game.core.helper.mixin(this, game.mixins.Rectangle.prototype);

  game.core.Entity.All.push(this);
};


/**
 * A list of all gaentities
 *
 * @type {Array.<!game.core.Entity>}
 */
game.core.Entity.All = [];


/**
 * Class name's for all entities.
 * @type {string}
 * @const
 */
game.core.Entity.CLASS_NAME = 'entity';


/**
 * Global id count.
 * @type {number}
 */
game.core.Entity.ID_COUNT = 0;


/**
 * Updates the entity information.
 */
game.core.Entity.prototype.update = function() {};


/**
 * Creates and attaches the dom of this entity to the parent provided.
 * @param {Element|HTMLBodyElement|game.core.Entity} parent The parent to attach
 *     this entity to.
 */
game.core.Entity.prototype.attach = function(parent) {
  if (parent instanceof game.core.Entity) {
    parent = parent.el;
  }

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
game.core.Entity.prototype.detach = function() {
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
game.core.Entity.prototype.setupEventListeners = function() {};


/**
 * Destroys event listeners.
 */
game.core.Entity.prototype.destroyEventListeners = function() {};


/**
 * The background of the entity.
 *
 * @return {string}
 */
game.core.Entity.prototype.getBackground = function() {
  return this.background_;
};


/**
 * The background style on the entity.
 *
 * @param {string} background
 */
game.core.Entity.prototype.setBackground = function(background) {
  this.background_ = background;
  this.el.style.background = background;
};


/**
 * This is being called from game.mixins.Rectangle, if there is a rect to
 * update it will.
 */
game.core.Entity.prototype.updateRect = function() {
  var position = this.getPosition() || game.mixins.Rectangle.POSITION_DEFAULT_;
  var rotation = this.getRotation() || game.mixins.Rectangle.ROTATION_DEFAULT_;
  var scale = this.getScale() || game.mixins.Rectangle.SCALE_DEFAULT_;

  if (this.lastWidth_ != this.width) {
    this.el.style.width = this.width + 'px';
    this.lastWidth_ = this.width;
  }

  if (this.lastHeight_ != this.height) {
    this.el.style.height = this.height + 'px';
    this.lastHeight_ = this.height;
  }

  if (this.lastPositionX_ != position.getX() ||
      this.lastPositionY_ != position.getY() ||
      this.lastRotation_ != rotation ||
      this.lastScale_ != scale) {
    var transform = 'rotate(' + rotation + 'deg) ' +
                    'scale(' + scale + ') ' +
                    'translate(' + position.getX('px') +
                    ', ' + position.getY('px') + ')';

    this.el.style.webkitTransform = transform;
    this.el.style.MozTransform = transform;
    this.el.style.msTransform = transform;
    this.el.style.OTransform = transform;
    this.el.style.transform = transform;

    // Reset for next time.
    this.lastPositionX_ = position.getX();
    this.lastPositionY_ = position.getY();
    this.lastRotation_ = rotation;
    this.lastScale_ = scale;
  }
};
