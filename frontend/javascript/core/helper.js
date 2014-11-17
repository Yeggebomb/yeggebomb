goog.provide('game.core.helper');
goog.provide('game.core.helper.object');


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
game.core.helper.global = this;


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the aliases
 * applied.  In uncompiled code the function is simply run since the aliases as
 * written are valid JavaScript.
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *     (e.g. "var Timer = goog.Timer").
 */
game.core.helper.scope = function(fn) {
  fn.call(game.core.helper.global);
};


/**
 * Does a flat clone of the object.
 *
 * @param {Object.<K,V>} obj Object to clone.
 * @return {!Object.<K,V>} Clone of the input object.
 * @template K,V
 */
game.core.helper.object.clone = function(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * game.core.helper.inherit(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
game.core.helper.inherit = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use goog.inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for goog.base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
};


/**
 * Global registry of mixins.
 *
 * @type {Object}
 */
game.core.helper.mixins = {};


/**
 * Mixes in functionality form one object another while handling collisions:
 * https://github.com/onsi/cocktail
 *
 * TODO(jstanton): Evaluate if the underscore dependency is warranted, and if
 * it is not, get rid of it.
 *
 * @param {Function} klass
 * @return {Function}
 */
game.core.helper.mixin = function(klass) {
  var mixins = _.chain(arguments).toArray().rest().flatten().value();
  // Allows mixing into the constructor's prototype or the dynamic instance
  var obj = klass.prototype || klass;

  var collisions = {};

  _(mixins).each(function(mixin) {
    if (_.isString(mixin)) {
      mixin = game.core.helper.mixins[mixin];
    }
    _(mixin).each(function(value, key) {
      if (_.isFunction(value)) {
        // If the mixer already has that exact function reference
        // Note: this would occur on an accidental mixin of the same base
        if (obj[key] === value) return;

        if (obj[key]) {
          // Avoid accessing built-in properties like constructor (#39)
          collisions[key] =
              collisions.hasOwnProperty(key) ? collisions[key] : [obj[key]];
          collisions[key].push(value);
        }
        obj[key] = value;
      } else if (_.isArray(value)) {
        obj[key] = _.union(value, obj[key] || []);
      } else if (_.isObject(value)) {
        obj[key] = _.extend({}, value, obj[key] || {});
      } else if (!(key in obj)) {
        obj[key] = value;
      }
    });
  });

  _(collisions).each(function(propertyValues, propertyName) {
    obj[propertyName] = function() {
      var that = this,
          args = arguments,
          returnValue;

      _(propertyValues).each(function(value) {
        var returnedValue =
            _.isFunction(value) ? value.apply(that, args) : value;
        returnValue = (typeof returnedValue === 'undefined' ?
            returnValue : returnedValue);
      });

      return returnValue;
    };
  });

  return klass;
};
