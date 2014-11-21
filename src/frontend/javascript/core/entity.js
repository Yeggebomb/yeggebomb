goog.provide('game.core.Entity');

goog.require('game.core.helper');
goog.require('game.core.math.Vector');
goog.require('game.mixins.Shape.Type');



/**
 * An entity. This can be a player, enemy, object or a thing. Entity will have
 * properties like position, size, scale, class & ID etc..
 *
 * @param {number=} opt_x X-coord of this entity.
 * @param {number=} opt_y Y-coord of this entity.
 * @param {?number=} opt_w The width of the box.
 * @param {?number=} opt_h The height of the box.
 *
 * @constructor
 */
game.core.Entity = function(opt_x, opt_y, opt_w, opt_h) {
  /** @type {boolean} Dirty bit to denote if this should be drawn. */
  this.isDirty = true;
  /** @private {string} */
  this.id_ = 'entity-' + game.core.Entity.ID_COUNT++;
  this.fillColor = 'black';
  /** @type {!Element} */
  this.el = document.createElement('span');
  this.el.id = this.id_;
  this.el.classList.add(game.core.Entity.CLASS_NAME);

  game.core.Entity.All.push(this);

  game.core.helper.mixin(this, 'shape');
  this.setPosition(opt_x, opt_y, opt_w, opt_h);

  /**
   * @private {boolean}
   */
  this.isActive_ = true;

  /**
   * In the dom.
   * @type {boolean}
   */
  this.isInDom = false;


  this.init();
};


/**
 * A list of all gaentities
 *
 * @type {Array.<!game.core.Entity>}
 */
game.core.Entity.All = [];


/**
 * Iterates through all the entities.
 * @param {function()} cb
 */
game.core.Entity.forEach = function(cb) {
  _.each(
      _.filter(game.core.Entity.All,
          function(entity) { return entity.isActive(); }),
      cb);
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
 * Whether the entity is active.
 *
 * @return {boolean}
 */
game.core.Entity.prototype.isActive = function() {
  return this.isActive_;
};


/**
 * Initializes the entity.
 */
game.core.Entity.prototype.init = function() {};


/**
 * Updates the entity information.
 */
game.core.Entity.prototype.update = function() {};


/**
 * Resolves any collisions if they exist.
 */
game.core.Entity.prototype.resolveCollisions = function() {};


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
    this.isInDom = true;
  } else {
    console.warn('Attempted to attach dom element multiple times:', this.el);
  }
  this.setupEventListeners();
};


/**
 * Detach element from dom.
 */
game.core.Entity.prototype.detach = function() {
  if (this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
    this.isInDom = false;
  } else {
    console.warn(
        'Attempted to remove dom element when it has no parent', this.el);
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
 * This is being called from game.mixins.Rectangle, if there is a rect to
 * update it will.
 */
game.core.Entity.prototype.draw = function() {
  if (!this.isDirty) return;

  this.isDirty = false;
  if (this.type == game.mixins.Shape.Type.RECTANGLE) return;

  var svgContainer = this.el.getElementsByClassName('svg-container');
  var svg;
  if (svgContainer.length == 1) {
    svgContainer = svgContainer[0];
    svg = svgContainer.children[0];
  } else {
    console.log('THE SADNESS');
    svgContainer = document.createElement('span');
    svgContainer.classList.add('svg-container');
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgContainer.appendChild(svg);
    this.el.appendChild(svgContainer);
  }

  if (this.type == game.mixins.Shape.Type.POLYGON) {
    var path = svg.getElementsByTagName('path');
    if (path.length == 1) {
      path = path[0];
    } else {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.appendChild(path);
    }
    path.setAttributeNS(null, 'd', game.core.helper.poly2path(this));
    path.setAttributeNS(null, 'fill', this.fillColor);
  }

  if (this.type == game.mixins.Shape.Type.CIRCLE) {
    var circle = svg.getElementsByTagName('circle');
    if (circle.length == 1) {
      circle = circle[0];
    } else {
      circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      svg.appendChild(circle);
    }
    circle.setAttributeNS(null, 'r', this.r);
    circle.setAttributeNS(null, 'cx', this.r);
    circle.setAttributeNS(null, 'cy', this.r);
    circle.setAttributeNS(null, 'fill', this.fillColor);
  }


  // game.core.helper.updateTranslate(svg, this.pos);
};
