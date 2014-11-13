goog.provide('Cocktail');
goog.provide('Cocktail.mixins');


/**
 * [mixin description]
 * @param {Function} klass
 * @return {Function}
 */
Cocktail.mixin = function(klass) {
  var mixins = _.chain(arguments).toArray().rest().flatten().value();
  // Allows mixing into the constructor's prototype or the dynamic instance
  var obj = klass.prototype || klass;

  var collisions = {};

  _(mixins).each(function(mixin) {
    if (_.isString(mixin)) {
      mixin = Cocktail.mixins[mixin];
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
