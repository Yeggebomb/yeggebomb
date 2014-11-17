goog.provide('game.core.Entity');

goog.require('game.core.helper');
goog.require('game.core.math.Vector');



/**
 * An entity. This can be a player, enemy, object or a thing. Entity will have
 * properties like position, size, scale, class & ID etc..
 *
 * @param {game.core.math.Vector=} opt_pos A vector representing the top-left of
 *     the box.
 * @param {?number=} opt_w The width of the box.
 * @param {?number=} opt_h The height of the box.
 *
 * @constructor
 */
game.core.Entity = function(opt_pos, opt_w, opt_h) {
  /** @type {boolean} Dirty bit to denote if this should be drawn. */
  this.isDirty = true;
  /** @type {string} */
  this.background = '';
  /** @private {string} */
  this.id_ = 'entity-' + game.core.Entity.ID_COUNT++;
  /** @type {!Element} */
  this.el = document.createElement('span');
  this.el.id = this.id_;
  this.el.classList.add(game.core.Entity.CLASS_NAME);

  /** @type {!game.core.math.Vector} */
  this.position = opt_pos || new game.core.math.Vector(0, 0);
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

  game.core.helper.mixin(this, 'rectangle');

  game.core.Entity.All.push(this);
};


/**
 * A list of all gaentities
 *
 * @type {Array.<!game.core.Entity>}
 */
game.core.Entity.All = [];


/**
 * Returns a reference to the position of the entity.
 *
 * @return {!game.core.math.Vector}
 */
game.core.Entity.prototype.getPosition = function() {
  return this.position;
};


/**
 * Sets the position and updates the style.
 *
 * @param {number|string} x X-coord or sometimes referred to as left.
 * @param {number|string} y Y-coord or sometimes referred to as top.
 * @param {Element=|game.core.Entity=} opt_relativeTo
 */
game.core.Entity.prototype.setPosition = function(x, y, opt_relativeTo) {
  if (_.isString(x) && opt_relativeTo) {
    x = opt_relativeTo.getWidth() * parseInt(x, 10) / 100;
  }

  if (_.isString(y) && opt_relativeTo) {
    y = opt_relativeTo.getHeight() * parseInt(y, 10) / 100;
  }

  if (_.isNumber(x) && _.isNumber(y)) {
    if (this.position) {
      this.position.x = x;
      this.position.y = y;
    } else {
      this.position = new game.core.math.Vector(x, y);
    }

    this.right = x + this.getWidth();
    this.bottom = y + this.getHeight();
  }

  this.isDirty = true;
};


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
game.core.Entity.prototype.draw = function() {
  if (!this.isDirty) return;
  this.isDirty = false;

  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';

  var position = this.getPosition();
  var transform = 'translate(' + position.x + 'px, ' + position.y + 'px)';
  this.el.style.webkitTransform = transform;
  this.el.style.MozTransform = transform;
  this.el.style.msTransform = transform;
  this.el.style.OTransform = transform;
  this.el.style.transform = transform;
};
