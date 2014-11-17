var game = {constants:{}};
game.constants.Gravity = 9.8;
game.constants.Epsilon = .01;
game.core = {};
game.core.helper = {};
game.core.helper.object = {};
game.core.helper.global = this;
game.core.helper.scope = function $game$core$helper$scope$($fn$$) {
  $fn$$.call(game.core.helper.global);
};
game.core.helper.poly2path = function $game$core$helper$poly2path$($points_polygon$$) {
  $points_polygon$$ = $points_polygon$$.calcPoints;
  var $result$$;
  $result$$ = "M0 0" + ("M" + $points_polygon$$[0].x + " " + $points_polygon$$[0].y);
  for (var $i$$ = 1;$i$$ < $points_polygon$$.length;$i$$++) {
    var $point$$ = $points_polygon$$[$i$$];
    $result$$ += "L" + $point$$.x + " " + $point$$.y;
  }
  return $result$$ + "Z";
};
game.core.helper.updateTranslate = function $game$core$helper$updateTranslate$($element$$, $position$$) {
  var $transform$$ = "translate(" + $position$$.x + "px, " + $position$$.y + "px)";
  $element$$.style.webkitTransform = $transform$$;
  $element$$.style.MozTransform = $transform$$;
  $element$$.style.msTransform = $transform$$;
  $element$$.style.OTransform = $transform$$;
  $element$$.style.transform = $transform$$;
};
game.core.helper.object.clone = function $game$core$helper$object$clone$($obj$$) {
  var $res$$ = {}, $key$$;
  for ($key$$ in $obj$$) {
    $res$$[$key$$] = $obj$$[$key$$];
  }
  return $res$$;
};
game.core.helper.inherit = function $game$core$helper$inherit$($childCtor$$, $parentCtor$$) {
  function $tempCtor$$() {
  }
  $tempCtor$$.prototype = $parentCtor$$.prototype;
  $childCtor$$.superClass_ = $parentCtor$$.prototype;
  $childCtor$$.prototype = new $tempCtor$$;
  $childCtor$$.prototype.constructor = $childCtor$$;
  $childCtor$$.base = function $$childCtor$$$base$($me$$, $methodName$$, $var_args$$) {
    var $args$$ = Array.prototype.slice.call(arguments, 2);
    return $parentCtor$$.prototype[$methodName$$].apply($me$$, $args$$);
  };
};
game.core.helper.mixins = {};
game.core.helper.mixin = function $game$core$helper$mixin$($klass$$) {
  var $mixins$$ = _.chain(arguments).toArray().rest().flatten().value(), $obj$$ = $klass$$.prototype || $klass$$, $collisions$$ = {};
  _($mixins$$).each(function($mixin$$) {
    _.isString($mixin$$) && ($mixin$$ = game.core.helper.mixins[$mixin$$]);
    _($mixin$$).each(function($value$$, $key$$) {
      _.isFunction($value$$) ? $obj$$[$key$$] !== $value$$ && ($obj$$[$key$$] && ($collisions$$[$key$$] = $collisions$$.hasOwnProperty($key$$) ? $collisions$$[$key$$] : [$obj$$[$key$$]], $collisions$$[$key$$].push($value$$)), $obj$$[$key$$] = $value$$) : _.isArray($value$$) ? $obj$$[$key$$] = _.union($value$$, $obj$$[$key$$] || []) : _.isObject($value$$) ? $obj$$[$key$$] = _.extend({}, $value$$, $obj$$[$key$$] || {}) : $key$$ in $obj$$ || ($obj$$[$key$$] = $value$$);
    });
  });
  _($collisions$$).each(function($propertyValues$$, $propertyName$$) {
    $obj$$[$propertyName$$] = function $$obj$$$$propertyName$$$() {
      var $that$$ = this, $args$$ = arguments, $returnValue$$;
      _($propertyValues$$).each(function($returnedValue_value$$) {
        $returnedValue_value$$ = _.isFunction($returnedValue_value$$) ? $returnedValue_value$$.apply($that$$, $args$$) : $returnedValue_value$$;
        $returnValue$$ = "undefined" === typeof $returnedValue_value$$ ? $returnValue$$ : $returnedValue_value$$;
      });
      return $returnValue$$;
    };
  });
  return $klass$$;
};
game.core.KeyHandler = function $game$core$KeyHandler$() {
  if (game.core.KeyHandler.prototype._singletonInstance) {
    return game.core.KeyHandler.prototype._singletonInstance;
  }
  game.core.KeyHandler.prototype._singletonInstance = this;
  this.pressed_ = {};
  window.addEventListener("keyup", this.onKeyup_.bind(this), !1);
  window.addEventListener("keydown", this.onKeydown_.bind(this), !1);
  document.addEventListener("visibilitychange", this.visibilityChanged_.bind(this));
  document.addEventListener("mousedown", this.mouseDown_.bind(this));
};
game.core.KeyHandler.prototype.visibilityChanged_ = function $game$core$KeyHandler$$visibilityChanged_$() {
  document.hidden && (this.pressed_ = []);
};
game.core.KeyHandler.prototype.mouseDown_ = function $game$core$KeyHandler$$mouseDown_$($evt$$) {
  1 != $evt$$.which && (this.pressed_ = []);
};
game.core.KeyHandler.prototype.isDown = function $game$core$KeyHandler$$isDown$($keyCode$$) {
  return this.pressed_[$keyCode$$];
};
game.core.KeyHandler.prototype.onKeydown_ = function $game$core$KeyHandler$$onKeydown_$($evt$$) {
  this.pressed_[$evt$$.keyCode] = !0;
};
game.core.KeyHandler.prototype.onKeyup_ = function $game$core$KeyHandler$$onKeyup_$($evt$$) {
  delete this.pressed_[$evt$$.keyCode];
};
game.core.KeyHandler.Keycodes = {BACKSPACE:8, TAB:9, ENTER:13, SHIFT:16, CTRL:17, ALT:18, ESC:27, SPACE:32, LEFT:37, UP:38, RIGHT:39, DOWN:40};
game.core.math = {};
game.core.math.Vector = function $game$core$math$Vector$($opt_x$$, $opt_y$$) {
  this.x = $opt_x$$ || 0;
  this.y = $opt_y$$ || 0;
};
game.core.math.Vector.prototype.copy = function $game$core$math$Vector$$copy$($other$$) {
  this.x = $other$$.x;
  this.y = $other$$.y;
  return this;
};
game.core.math.Vector.prototype.clone = function $game$core$math$Vector$$clone$() {
  return new game.core.math.Vector(this.x, this.y);
};
game.core.math.Vector.prototype.perp = function $game$core$math$Vector$$perp$() {
  var $x$$ = this.x;
  this.x = this.y;
  this.y = -$x$$;
  return this;
};
game.core.math.Vector.prototype.rotate = function $game$core$math$Vector$$rotate$($angle$$) {
  var $x$$ = this.x, $y$$ = this.y;
  this.x = $x$$ * Math.cos($angle$$) - $y$$ * Math.sin($angle$$);
  this.y = $x$$ * Math.sin($angle$$) + $y$$ * Math.cos($angle$$);
  return this;
};
game.core.math.Vector.prototype.reverse = function $game$core$math$Vector$$reverse$() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};
game.core.math.Vector.prototype.normalize = function $game$core$math$Vector$$normalize$() {
  var $d$$ = this.len();
  0 < $d$$ && (this.x /= $d$$, this.y /= $d$$);
  return this;
};
game.core.math.Vector.prototype.add = function $game$core$math$Vector$$add$($other$$) {
  this.x += $other$$.x;
  this.y += $other$$.y;
  return this;
};
game.core.math.Vector.prototype.sub = function $game$core$math$Vector$$sub$($other$$) {
  this.x -= $other$$.x;
  this.y -= $other$$.y;
  return this;
};
game.core.math.Vector.prototype.scale = function $game$core$math$Vector$$scale$($x$$, $opt_y$$) {
  this.x *= $x$$;
  this.y *= $opt_y$$ || $x$$;
  return this;
};
game.core.math.Vector.prototype.project = function $game$core$math$Vector$$project$($other$$) {
  var $amt$$ = this.dot($other$$) / $other$$.len2();
  this.x = $amt$$ * $other$$.x;
  this.y = $amt$$ * $other$$.y;
  return this;
};
game.core.math.Vector.prototype.projectN = function $game$core$math$Vector$$projectN$($other$$) {
  var $amt$$ = this.dot($other$$);
  this.x = $amt$$ * $other$$.x;
  this.y = $amt$$ * $other$$.y;
  return this;
};
game.core.math.Vector.prototype.reflect = function $game$core$math$Vector$$reflect$($axis$$) {
  var $x$$ = this.x, $y$$ = this.y;
  this.project($axis$$).scale(2);
  this.x -= $x$$;
  this.y -= $y$$;
  return this;
};
game.core.math.Vector.prototype.reflectN = function $game$core$math$Vector$$reflectN$($axis$$) {
  var $x$$ = this.x, $y$$ = this.y;
  this.projectN($axis$$).scale(2);
  this.x -= $x$$;
  this.y -= $y$$;
  return this;
};
game.core.math.Vector.prototype.dot = function $game$core$math$Vector$$dot$($other$$) {
  return this.x * $other$$.x + this.y * $other$$.y;
};
game.core.math.Vector.prototype.len2 = function $game$core$math$Vector$$len2$() {
  return this.dot(this);
};
game.core.math.Vector.prototype.len = function $game$core$math$Vector$$len$() {
  return Math.sqrt(this.len2());
};
game.core.math.Response = function $game$core$math$Response$() {
  this.b = this.a = null;
  this.overlapN = new game.core.math.Vector;
  this.overlapV = new game.core.math.Vector;
  this.clear();
};
game.core.math.Response.prototype.clear = function $game$core$math$Response$$clear$() {
  this.bInA = this.aInB = !0;
  this.overlap = Number.MAX_VALUE;
  return this;
};
game.mixins = {};
game.mixins.Fourway = function $game$mixins$Fourway$() {
};
game.core.helper.mixins.fourway = game.mixins.Fourway.prototype;
game.mixins.Fourway.KEY_HANDLER = new game.core.KeyHandler;
game.mixins.Fourway.prototype.moveLeft = function $game$mixins$Fourway$$moveLeft$() {
  this.getVelocity().x -= 2;
};
game.mixins.Fourway.prototype.moveRight = function $game$mixins$Fourway$$moveRight$() {
  this.getVelocity().x += 2;
};
game.mixins.Fourway.prototype.moveUp = function $game$mixins$Fourway$$moveUp$() {
  this.getVelocity().y -= 5;
};
game.mixins.Fourway.prototype.moveDown = function $game$mixins$Fourway$$moveDown$() {
  this.getVelocity().y += 5;
};
game.mixins.Fourway.prototype.update = function $game$mixins$Fourway$$update$() {
  var $KEY_HANDLER$$ = game.mixins.Fourway.KEY_HANDLER, $Keycodes$$ = game.core.KeyHandler.Keycodes;
  $KEY_HANDLER$$.isDown($Keycodes$$.RIGHT) && this.moveRight();
  $KEY_HANDLER$$.isDown($Keycodes$$.LEFT) && this.moveLeft();
  $KEY_HANDLER$$.isDown($Keycodes$$.UP) && this.moveUp();
  $KEY_HANDLER$$.isDown($Keycodes$$.DOWN) && this.moveDown();
};
game.mixins.entity = {};
game.mixins.entity.Gravity = function $game$mixins$entity$Gravity$() {
};
game.core.helper.mixins.gravity = game.mixins.entity.Gravity.prototype;
game.mixins.entity.Gravity.prototype.update = function $game$mixins$entity$Gravity$$update$($deltaTime_position$$) {
  this.addForce(game.constants.Gravity);
  var $velocity$$ = this.getVelocity();
  $velocity$$.y += game.constants.Gravity * $deltaTime_position$$;
  $deltaTime_position$$ = this.getPosition();
  this.setPosition($deltaTime_position$$.x + $velocity$$.x, $deltaTime_position$$.y + $velocity$$.y);
};
game.mixins.Listenable = function $game$mixins$Listenable$() {
};
game.core.helper.mixins.listenable = game.mixins.Listenable.prototype;
game.mixins.Listenable.listeners = {};
game.mixins.Listenable.prototype.registerListener = function $game$mixins$Listenable$$registerListener$($name$$, $callback$$, $opt_callImmediatly$$) {
  game.mixins.Listenable.listeners[$name$$] || (game.mixins.Listenable.listeners[$name$$] = []);
  game.mixins.Listenable.listeners[$name$$].push($callback$$);
  _.isBoolean($opt_callImmediatly$$) && $opt_callImmediatly$$ && $callback$$();
};
game.mixins.Listenable.prototype.callListeners = function $game$mixins$Listenable$$callListeners$($name$$) {
  _.each(game.mixins.Listenable.listeners[$name$$], function($callback$$) {
    $callback$$();
  });
};
game.mixins.entity.Reset = function $game$mixins$entity$Reset$() {
};
game.core.helper.mixins.reset = game.mixins.entity.Reset.prototype;
game.mixins.entity.Reset.prototype.update = function $game$mixins$entity$Reset$$update$($accel_deltaTime$$) {
  $accel_deltaTime$$ = this.getAcceleration();
  $accel_deltaTime$$.x = 0;
  $accel_deltaTime$$.y = 0;
  $accel_deltaTime$$ = this.getVelocity();
  1E3 < $accel_deltaTime$$.x && ($accel_deltaTime$$.x = 1E3);
  1E3 < $accel_deltaTime$$.y && ($accel_deltaTime$$.y = 1E3);
};
game.mixins.Shape = function $game$mixins$Shape$() {
};
game.core.helper.mixins.shape = game.mixins.Shape.prototype;
game.mixins.Shape.Type = {POLYGON:0, RECTANGLE:1, CIRCLE:2};
game.mixins.Shape.prototype.setPolygon = function $game$mixins$Shape$$setPolygon$($opt_pos$$, $opt_points$$) {
  this.type = game.mixins.Shape.Type.POLYGON;
  this.pos = $opt_pos$$ || new game.core.math.Vector;
  this.points = $opt_points$$ || [];
  this.angle = 0;
  this.offset = new game.core.math.Vector;
  this.recalc();
  return this;
};
game.mixins.Shape.prototype.setCircle = function $game$mixins$Shape$$setCircle$($opt_pos$$, $opt_r$$) {
  this.type = game.mixins.Shape.Type.CIRCLE;
  this.pos = $opt_pos$$ || new game.core.math.Vector;
  this.r = $opt_r$$ || 0;
  return this;
};
game.mixins.Shape.prototype.setRectangle = function $game$mixins$Shape$$setRectangle$($x$$, $y$$, $width$$, $height$$, $opt_relativeTo$$, $opt_maxWidth$$, $opt_maxHeight$$, $opt_minWidth$$, $opt_minHeight$$) {
  this.type = game.mixins.Shape.Type.RECTANGLE;
  this.angle = 0;
  this.offset = new game.core.math.Vector;
  this.setSize($width$$, $height$$, $opt_relativeTo$$, $opt_maxWidth$$, $opt_maxHeight$$, $opt_minWidth$$, $opt_minHeight$$);
  this.setPosition($x$$, $y$$, $opt_relativeTo$$);
  this.recalc();
  return this;
};
game.mixins.Shape.prototype.setPoints = function $game$mixins$Shape$$setPoints$($opt_points$$) {
  this.points = $opt_points$$;
  this.recalc();
  return this;
};
game.mixins.Shape.prototype.setAngle = function $game$mixins$Shape$$setAngle$($angle$$) {
  this.angle = $angle$$;
  this.recalc();
  return this;
};
game.mixins.Shape.prototype.setOffset = function $game$mixins$Shape$$setOffset$($offset$$) {
  this.offset = $offset$$;
  this.recalc();
  return this;
};
game.mixins.Shape.prototype.rotate = function $game$mixins$Shape$$rotate$($angle$$) {
  for (var $points$$ = this.points, $len$$ = $points$$.length, $i$$ = 0;$i$$ < $len$$;$i$$++) {
    $points$$[$i$$].rotate($angle$$);
  }
  this.recalc();
  return this;
};
game.mixins.Shape.prototype.translate = function $game$mixins$Shape$$translate$($x$$, $y$$) {
  for (var $points$$ = this.points, $len$$ = $points$$.length, $i$$ = 0;$i$$ < $len$$;$i$$++) {
    $points$$[$i$$].x += $x$$, $points$$[$i$$].y += $y$$;
  }
  this.recalc();
  return this;
};
game.mixins.Shape.prototype.getPosition = function $game$mixins$Shape$$getPosition$() {
  return this.pos;
};
game.mixins.Shape.prototype.setPosition = function $game$mixins$Shape$$setPosition$($transform$$1_x$$, $y$$, $opt_relativeTo$$) {
  _.isString($transform$$1_x$$) && $opt_relativeTo$$ && ($transform$$1_x$$ = $opt_relativeTo$$.getWidth() * parseInt($transform$$1_x$$, 10) / 100);
  _.isString($y$$) && $opt_relativeTo$$ && ($y$$ = $opt_relativeTo$$.getHeight() * parseInt($y$$, 10) / 100);
  this.pos ? (this.pos.x = $transform$$1_x$$, this.pos.y = $y$$) : this.pos = new game.core.math.Vector($transform$$1_x$$, $y$$);
  _.isNumber($transform$$1_x$$) && _.isNumber($y$$) && (this.right = $transform$$1_x$$ + this.getWidth(), this.bottom = $y$$ + this.getHeight());
  this.el && ($transform$$1_x$$ = "translate(" + $transform$$1_x$$ + "px, " + $y$$ + "px)", this.el.style.webkitTransform = $transform$$1_x$$, this.el.style.MozTransform = $transform$$1_x$$, this.el.style.msTransform = $transform$$1_x$$, this.el.style.OTransform = $transform$$1_x$$, this.el.style.transform = $transform$$1_x$$);
};
game.mixins.Shape.prototype.setSize = function $game$mixins$Shape$$setSize$($position$$2_width$$, $height$$, $opt_relativeTo$$, $opt_maxWidth$$, $opt_maxHeight$$, $opt_minWidth$$, $opt_minHeight$$) {
  _.isString($position$$2_width$$) && $opt_relativeTo$$ && ($position$$2_width$$ = $opt_relativeTo$$.getWidth() * parseInt($position$$2_width$$, 10) / 100, _.isNumber($opt_maxWidth$$) && ($position$$2_width$$ = Math.min($opt_maxWidth$$, $position$$2_width$$)), _.isNumber($opt_minWidth$$) && ($position$$2_width$$ = Math.max($opt_minWidth$$, $position$$2_width$$)));
  _.isString($height$$) && $opt_relativeTo$$ && ($height$$ = $opt_relativeTo$$.getHeight() * parseInt($height$$, 10) / 100, _.isNumber($opt_maxHeight$$) && ($height$$ = Math.min($opt_maxHeight$$, $height$$)), _.isNumber($opt_minHeight$$) && ($height$$ = Math.max($opt_minHeight$$, $height$$)));
  this.width = $position$$2_width$$;
  this.height = $height$$;
  $position$$2_width$$ = this.getPosition();
  $position$$2_width$$ || ($position$$2_width$$ = this.position = new game.core.math.Vector);
  this.right = $position$$2_width$$.x + this.width;
  this.bottom = $position$$2_width$$.y + this.height;
  this.points = [new game.core.math.Vector, new game.core.math.Vector(this.width, 0), new game.core.math.Vector(this.width, this.height), new game.core.math.Vector(0, this.height)];
  this.el && (this.el.style.width = this.width + "px", this.el.style.height = this.height + "px");
};
game.mixins.Shape.prototype.getWidth = function $game$mixins$Shape$$getWidth$() {
  return this.width;
};
game.mixins.Shape.prototype.getHeight = function $game$mixins$Shape$$getHeight$() {
  return this.height;
};
game.mixins.Shape.prototype.recalc = function $game$mixins$Shape$$recalc$() {
  var $i$$, $calcPoints$$ = this.calcPoints = [], $edges$$ = this.edges = [], $normals$$ = this.normals = [], $e$$4_p1_points$$ = this.points || [], $n$$4_offset$$ = this.offset || 0, $angle$$ = this.angle || 0, $len$$ = $e$$4_p1_points$$.length;
  for ($i$$ = 0;$i$$ < $len$$;$i$$++) {
    var $calcPoint$$ = $e$$4_p1_points$$[$i$$].clone();
    $calcPoints$$.push($calcPoint$$);
    $calcPoint$$.x += $n$$4_offset$$.x;
    $calcPoint$$.y += $n$$4_offset$$.y;
    0 !== $angle$$ && $calcPoint$$.rotate($angle$$);
  }
  for ($i$$ = 0;$i$$ < $len$$;$i$$++) {
    $e$$4_p1_points$$ = $calcPoints$$[$i$$], $n$$4_offset$$ = $i$$ < $len$$ - 1 ? $calcPoints$$[$i$$ + 1] : $calcPoints$$[0], $e$$4_p1_points$$ = (new game.core.math.Vector).copy($n$$4_offset$$).sub($e$$4_p1_points$$), $n$$4_offset$$ = (new game.core.math.Vector).copy($e$$4_p1_points$$).perp().normalize(), $edges$$.push($e$$4_p1_points$$), $normals$$.push($n$$4_offset$$);
  }
  this.isDirty = !0;
  return this;
};
game.core.Entity = function $game$core$Entity$($opt_x$$, $opt_y$$, $opt_w$$, $opt_h$$) {
  this.isDirty = !0;
  this.id_ = "entity-" + game.core.Entity.ID_COUNT++;
  this.el = document.createElement("span");
  this.el.id = this.id_;
  this.el.classList.add(game.core.Entity.CLASS_NAME);
  game.core.Entity.All.push(this);
  game.core.helper.mixin(this, "shape");
  this.setPosition($opt_x$$, $opt_y$$, $opt_w$$, $opt_h$$);
};
game.core.Entity.All = [];
game.core.Entity.CLASS_NAME = "entity";
game.core.Entity.ID_COUNT = 0;
game.core.Entity.prototype.update = function $game$core$Entity$$update$() {
};
game.core.Entity.prototype.resolveCollisions = function $game$core$Entity$$resolveCollisions$() {
};
game.core.Entity.prototype.attach = function $game$core$Entity$$attach$($parent$$) {
  $parent$$ instanceof game.core.Entity && ($parent$$ = $parent$$.el);
  document.getElementById(this.id_) ? console.warn("Attempted to attach dom element multiple times:", this.el_) : $parent$$.appendChild(this.el);
  this.setupEventListeners();
};
game.core.Entity.prototype.detach = function $game$core$Entity$$detach$() {
  this.el.parentNode ? this.el.parentNode.removeChild(this.el) : console.warn("Attempted to remove dom element when it has no parent", this.el_);
  this.destroyEventListeners();
};
game.core.Entity.prototype.setupEventListeners = function $game$core$Entity$$setupEventListeners$() {
};
game.core.Entity.prototype.destroyEventListeners = function $game$core$Entity$$destroyEventListeners$() {
};
game.core.Entity.prototype.draw = function $game$core$Entity$$draw$() {
  if (this.isDirty && (this.isDirty = !1, this.type != game.mixins.Shape.Type.RECTANGLE)) {
    var $svg$$ = this.el.getElementsByTagName("svg");
    1 == $svg$$.length ? $svg$$ = $svg$$[0] : ($svg$$ = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.el.appendChild($svg$$));
    if (this.type == game.mixins.Shape.Type.POLYGON) {
      var $circle_path$$ = $svg$$.getElementsByTagName("path");
      1 == $circle_path$$.length ? $circle_path$$ = $circle_path$$[0] : ($circle_path$$ = document.createElementNS("http://www.w3.org/2000/svg", "path"), $svg$$.appendChild($circle_path$$));
      $circle_path$$.setAttributeNS(null, "d", game.core.helper.poly2path(this));
    }
    this.type == game.mixins.Shape.Type.CIRCLE && ($circle_path$$ = $svg$$.getElementsByTagName("circle"), 1 == $circle_path$$.length ? $circle_path$$ = $circle_path$$[0] : ($circle_path$$ = document.createElementNS("http://www.w3.org/2000/svg", "circle"), $svg$$.appendChild($circle_path$$)), $circle_path$$.setAttributeNS(null, "r", this.r), $circle_path$$.setAttributeNS(null, "cx", this.r), $circle_path$$.setAttributeNS(null, "cy", this.r), $circle_path$$.setAttributeNS(null, "fill", "black"));
    game.core.helper.updateTranslate($svg$$, this.pos);
  }
};
game.Backdrop = function $game$Backdrop$() {
  if (game.Backdrop.prototype._singletonInstance) {
    return game.Backdrop.prototype._singletonInstance;
  }
  game.Backdrop.prototype._singletonInstance = this;
  game.Backdrop.base(this, "constructor");
  this.el.classList.add(game.Backdrop.CLASS_NAME);
  game.core.helper.mixin(this, "shape");
};
game.core.helper.inherit(game.Backdrop, game.core.Entity);
game.Backdrop.CLASS_NAME = "backdrop";
game.Board = function $game$Board$() {
  if (game.Board.prototype._singletonInstance) {
    return game.Board.prototype._singletonInstance;
  }
  game.Board.prototype._singletonInstance = this;
  game.Board.base(this, "constructor");
  this.el.classList.add(game.Board.CLASS_NAME);
  game.core.helper.mixin(this, "shape");
};
game.core.helper.inherit(game.Board, game.core.Entity);
game.Board.CLASS_NAME = "board";
game.Circle = function $game$Circle$() {
  game.Circle.base(this, "constructor");
  this.el.classList.add(game.Circle.CLASS_NAME);
  game.core.helper.mixin(this, "shape", "gravity", "physical");
};
game.core.helper.inherit(game.Circle, game.core.Entity);
game.Circle.CLASS_NAME = "platform";
game.Circle.prototype.collisionWithPlatform = function $game$Circle$$collisionWithPlatform$($other$$, $response$$) {
  var $position$$ = this.pos.sub($response$$.overlapV), $velocity$$ = this.getVelocity();
  $velocity$$.y *= -this.bouncyness;
  0 < $velocity$$.x ? ($velocity$$.x -= this.friction, 0 > $velocity$$.x && ($velocity$$.x = 0)) : ($velocity$$.x += this.friction, 0 < $velocity$$.x && ($velocity$$.x = 0));
  this.setPosition($position$$.x, $position$$.y);
};
game.core.math.collision = {};
game.core.math.collision.helper = {};
game.core.helper.scope(function() {
  for (var $helper$$ = game.core.math.collision.helper, $T_VECTORS$$ = [], $i$$0$$ = 0;10 > $i$$0$$;$i$$0$$++) {
    $T_VECTORS$$.push(new game.core.math.Vector);
  }
  for (var $T_ARRAYS$$ = [], $i$$0$$ = 0;5 > $i$$0$$;$i$$0$$++) {
    $T_ARRAYS$$.push([]);
  }
  var $T_RESPONSE$$ = new game.core.math.Response, $UNIT_SQUARE$$ = (new game.mixins.Shape).setRectangle(0, 0, 1, 1);
  $helper$$.flattenPointsOn = function $$helper$$$flattenPointsOn$($points$$, $normal$$, $result$$) {
    for (var $min$$ = Number.MAX_VALUE, $max$$ = -Number.MAX_VALUE, $len$$ = $points$$.length, $i$$ = 0;$i$$ < $len$$;$i$$++) {
      var $dot$$ = $points$$[$i$$].dot($normal$$);
      $dot$$ < $min$$ && ($min$$ = $dot$$);
      $dot$$ > $max$$ && ($max$$ = $dot$$);
    }
    $result$$[0] = $min$$;
    $result$$[1] = $max$$;
  };
  $helper$$.isSeparatingAxis = function $$helper$$$isSeparatingAxis$($aPos_offsetV$$, $bPos_projectedOffset$$, $aPoints_option1_overlap$$, $absOverlap_bPoints_option2$$, $axis$$, $opt_response$$) {
    var $rangeA$$ = $T_ARRAYS$$.pop(), $rangeB$$ = $T_ARRAYS$$.pop();
    $aPos_offsetV$$ = $T_VECTORS$$.pop().copy($bPos_projectedOffset$$).sub($aPos_offsetV$$);
    $bPos_projectedOffset$$ = $aPos_offsetV$$.dot($axis$$);
    $helper$$.flattenPointsOn($aPoints_option1_overlap$$, $axis$$, $rangeA$$);
    $helper$$.flattenPointsOn($absOverlap_bPoints_option2$$, $axis$$, $rangeB$$);
    $rangeB$$[0] += $bPos_projectedOffset$$;
    $rangeB$$[1] += $bPos_projectedOffset$$;
    if ($rangeA$$[0] > $rangeB$$[1] || $rangeB$$[0] > $rangeA$$[1]) {
      return $T_VECTORS$$.push($aPos_offsetV$$), $T_ARRAYS$$.push($rangeA$$), $T_ARRAYS$$.push($rangeB$$), !0;
    }
    $opt_response$$ && ($aPoints_option1_overlap$$ = 0, $rangeA$$[0] < $rangeB$$[0] ? ($opt_response$$.aInB = !1, $rangeA$$[1] < $rangeB$$[1] ? ($aPoints_option1_overlap$$ = $rangeA$$[1] - $rangeB$$[0], $opt_response$$.bInA = !1) : ($aPoints_option1_overlap$$ = $rangeA$$[1] - $rangeB$$[0], $absOverlap_bPoints_option2$$ = $rangeB$$[1] - $rangeA$$[0], $aPoints_option1_overlap$$ = $aPoints_option1_overlap$$ < $absOverlap_bPoints_option2$$ ? $aPoints_option1_overlap$$ : -$absOverlap_bPoints_option2$$)) : 
    ($opt_response$$.bInA = !1, $rangeA$$[1] > $rangeB$$[1] ? ($aPoints_option1_overlap$$ = $rangeA$$[0] - $rangeB$$[1], $opt_response$$.aInB = !1) : ($aPoints_option1_overlap$$ = $rangeA$$[1] - $rangeB$$[0], $absOverlap_bPoints_option2$$ = $rangeB$$[1] - $rangeA$$[0], $aPoints_option1_overlap$$ = $aPoints_option1_overlap$$ < $absOverlap_bPoints_option2$$ ? $aPoints_option1_overlap$$ : -$absOverlap_bPoints_option2$$)), $absOverlap_bPoints_option2$$ = Math.abs($aPoints_option1_overlap$$), $absOverlap_bPoints_option2$$ < 
    $opt_response$$.overlap && ($opt_response$$.overlap = $absOverlap_bPoints_option2$$, $opt_response$$.overlapN.copy($axis$$), 0 > $aPoints_option1_overlap$$ && $opt_response$$.overlapN.reverse()));
    $T_VECTORS$$.push($aPos_offsetV$$);
    $T_ARRAYS$$.push($rangeA$$);
    $T_ARRAYS$$.push($rangeB$$);
    return!1;
  };
  $helper$$.vornoiRegion = function $$helper$$$vornoiRegion$($line$$, $point$$) {
    var $len2$$ = $line$$.len2(), $dp$$ = $point$$.dot($line$$);
    return 0 > $dp$$ ? -1 : $dp$$ > $len2$$ ? 1 : 0;
  };
  game.core.math.collision.pointInCircle = function $game$core$math$collision$pointInCircle$($p$$, $c$$) {
    var $differenceV$$ = $T_VECTORS$$.pop().copy($p$$).sub($c$$.pos), $radiusSq$$ = $c$$.r * $c$$.r, $distanceSq$$ = $differenceV$$.len2();
    $T_VECTORS$$.push($differenceV$$);
    return $distanceSq$$ <= $radiusSq$$;
  };
  game.core.math.collision.pointInPolygon = function $game$core$math$collision$pointInPolygon$($p$$, $poly$$) {
    $UNIT_SQUARE$$.pos.copy($p$$);
    $T_RESPONSE$$.clear();
    var $result$$ = game.core.math.collision.testPolygonPolygon($UNIT_SQUARE$$, $poly$$, $T_RESPONSE$$);
    $result$$ && ($result$$ = $T_RESPONSE$$.aInB);
    return $result$$;
  };
  game.core.math.collision.testCircleCircle = function $game$core$math$collision$testCircleCircle$($a$$, $b$$, $opt_response$$) {
    var $differenceV$$ = $T_VECTORS$$.pop().copy($b$$.pos).sub($a$$.pos), $totalRadius$$ = $a$$.r + $b$$.r, $dist_totalRadiusSq$$ = $totalRadius$$ * $totalRadius$$, $distanceSq$$ = $differenceV$$.len2();
    if ($distanceSq$$ > $dist_totalRadiusSq$$) {
      return $T_VECTORS$$.push($differenceV$$), !1;
    }
    $opt_response$$ && ($dist_totalRadiusSq$$ = Math.sqrt($distanceSq$$), $opt_response$$.a = $a$$, $opt_response$$.b = $b$$, $opt_response$$.overlap = $totalRadius$$ - $dist_totalRadiusSq$$, $opt_response$$.overlapN.copy($differenceV$$.normalize()), $opt_response$$.overlapV.copy($differenceV$$).scale($opt_response$$.overlap), $opt_response$$.aInB = $a$$.r <= $b$$.r && $dist_totalRadiusSq$$ <= $b$$.r - $a$$.r, $opt_response$$.bInA = $b$$.r <= $a$$.r && $dist_totalRadiusSq$$ <= $a$$.r - $b$$.r);
    $T_VECTORS$$.push($differenceV$$);
    return!0;
  };
  game.core.math.collision.testPolygonCircle = function $game$core$math$collision$testPolygonCircle$($polygon$$, $circle$$, $opt_response$$) {
    for (var $circlePos$$ = $T_VECTORS$$.pop().copy($circle$$.pos).sub($polygon$$.pos), $radius$$ = $circle$$.r, $radius2$$ = $radius$$ * $radius$$, $points$$ = $polygon$$.calcPoints, $len$$ = $points$$.length, $edge$$ = $T_VECTORS$$.pop(), $point$$ = $T_VECTORS$$.pop(), $i$$ = 0;$i$$ < $len$$;$i$$++) {
      var $next_normal$$ = $i$$ === $len$$ - 1 ? 0 : $i$$ + 1, $distAbs_prev$$ = 0 === $i$$ ? $len$$ - 1 : $i$$ - 1, $overlap$$ = 0, $overlapN$$ = null;
      $edge$$.copy($polygon$$.edges[$i$$]);
      $point$$.copy($circlePos$$).sub($points$$[$i$$]);
      $opt_response$$ && $point$$.len2() > $radius2$$ && ($opt_response$$.aInB = !1);
      var $dist$$ = $helper$$.vornoiRegion($edge$$, $point$$);
      if (-1 === $dist$$) {
        $edge$$.copy($polygon$$.edges[$distAbs_prev$$]);
        $next_normal$$ = $T_VECTORS$$.pop().copy($circlePos$$).sub($points$$[$distAbs_prev$$]);
        $dist$$ = $helper$$.vornoiRegion($edge$$, $next_normal$$);
        if (1 === $dist$$) {
          $dist$$ = $point$$.len();
          if ($dist$$ > $radius$$) {
            return $T_VECTORS$$.push($circlePos$$), $T_VECTORS$$.push($edge$$), $T_VECTORS$$.push($point$$), $T_VECTORS$$.push($next_normal$$), !1;
          }
          $opt_response$$ && ($opt_response$$.bInA = !1, $overlapN$$ = $point$$.normalize(), $overlap$$ = $radius$$ - $dist$$);
        }
        $T_VECTORS$$.push($next_normal$$);
      } else {
        if (1 === $dist$$) {
          if ($edge$$.copy($polygon$$.edges[$next_normal$$]), $point$$.copy($circlePos$$).sub($points$$[$next_normal$$]), $dist$$ = $helper$$.vornoiRegion($edge$$, $point$$), -1 === $dist$$) {
            $dist$$ = $point$$.len();
            if ($dist$$ > $radius$$) {
              return $T_VECTORS$$.push($circlePos$$), $T_VECTORS$$.push($edge$$), $T_VECTORS$$.push($point$$), !1;
            }
            $opt_response$$ && ($opt_response$$.bInA = !1, $overlapN$$ = $point$$.normalize(), $overlap$$ = $radius$$ - $dist$$);
          }
        } else {
          $next_normal$$ = $edge$$.perp().normalize();
          $dist$$ = $point$$.dot($next_normal$$);
          $distAbs_prev$$ = Math.abs($dist$$);
          if (0 < $dist$$ && $distAbs_prev$$ > $radius$$) {
            return $T_VECTORS$$.push($circlePos$$), $T_VECTORS$$.push($next_normal$$), $T_VECTORS$$.push($point$$), !1;
          }
          $opt_response$$ && ($overlapN$$ = $next_normal$$, $overlap$$ = $radius$$ - $dist$$, 0 <= $dist$$ || $overlap$$ < 2 * $radius$$) && ($opt_response$$.bInA = !1);
        }
      }
      $overlapN$$ && $opt_response$$ && Math.abs($overlap$$) < Math.abs($opt_response$$.overlap) && ($opt_response$$.overlap = $overlap$$, $opt_response$$.overlapN.copy($overlapN$$));
    }
    $opt_response$$ && ($opt_response$$.a = $polygon$$, $opt_response$$.b = $circle$$, $opt_response$$.overlapV.copy($opt_response$$.overlapN).scale($opt_response$$.overlap));
    $T_VECTORS$$.push($circlePos$$);
    $T_VECTORS$$.push($edge$$);
    $T_VECTORS$$.push($point$$);
    return!0;
  };
  game.core.math.collision.testCirclePolygon = function $game$core$math$collision$testCirclePolygon$($circle$$2_result$$, $aInB_polygon$$, $a$$2_opt_response$$) {
    if (($circle$$2_result$$ = game.core.math.collision.testPolygonCircle($aInB_polygon$$, $circle$$2_result$$, $response$$)) && $a$$2_opt_response$$) {
      var $response$$ = $a$$2_opt_response$$;
      $a$$2_opt_response$$ = $response$$.a;
      $aInB_polygon$$ = $response$$.aInB;
      $response$$.overlapN.reverse();
      $response$$.overlapV.reverse();
      $response$$.a = $response$$.b;
      $response$$.b = $a$$2_opt_response$$;
      $response$$.aInB = $response$$.bInA;
      $response$$.bInA = $aInB_polygon$$;
    }
    return $circle$$2_result$$;
  };
  game.core.math.collision.testPolygonPolygon = function $game$core$math$collision$testPolygonPolygon$($a$$, $b$$, $opt_response$$) {
    for (var $aPoints$$ = $a$$.calcPoints, $aLen$$ = $aPoints$$.length, $bPoints$$ = $b$$.calcPoints, $bLen$$ = $bPoints$$.length, $i$$ = 0;$i$$ < $aLen$$;$i$$++) {
      if ($helper$$.isSeparatingAxis($a$$.pos, $b$$.pos, $aPoints$$, $bPoints$$, $a$$.normals[$i$$], $opt_response$$)) {
        return!1;
      }
    }
    for ($i$$ = 0;$i$$ < $bLen$$;$i$$++) {
      if ($helper$$.isSeparatingAxis($a$$.pos, $b$$.pos, $aPoints$$, $bPoints$$, $b$$.normals[$i$$], $opt_response$$)) {
        return!1;
      }
    }
    $opt_response$$ && ($opt_response$$.a = $a$$, $opt_response$$.b = $b$$, $opt_response$$.overlapV.copy($opt_response$$.overlapN).scale($opt_response$$.overlap));
    return!0;
  };
});
game.core.Root = function $game$core$Root$() {
  if (game.core.Root.prototype._singletonInstance) {
    return game.core.Root.prototype._singletonInstance;
  }
  game.core.Root.prototype._singletonInstance = this;
  game.core.Root.base(this, "constructor");
  this.el.classList.add(game.core.Root.CLASS_NAME);
  game.core.helper.mixin(this, "shape");
};
game.core.helper.inherit(game.core.Root, game.core.Entity);
game.core.Root.CLASS_NAME = "root";
game.core.Camera = function $game$core$Camera$() {
  if (game.core.Camera.prototype._singletonInstance) {
    return game.core.Camera.prototype._singletonInstance;
  }
  game.core.Camera.prototype._singletonInstance = this;
  this.board_ = new game.Board;
  this.viewport_ = new game.core.Root;
  this.axis_ = game.core.Camera.DEFAULT_AXIS_;
  this.lastY_ = this.lastX_ = 0;
  this.layers_ = [];
  this.addLayer(this.board_, 1);
};
game.core.Camera.Axis = {NONE:0, HORIZONTAL:1, VERTICAL:2, BOTH:3};
game.core.Camera.DEFAULT_AXIS_ = game.core.Camera.Axis.BOTH;
game.core.Camera.prototype.watch = function $game$core$Camera$$watch$($entity$$, $opt_axis$$) {
  this.watchedEntity_ = $entity$$;
  this.axis_ = $opt_axis$$ || game.core.Camera.DEFAULT_AXIS_;
};
game.core.Camera.prototype.addLayer = function $game$core$Camera$$addLayer$($layer$$, $distance$$) {
  this.layers_.push({layer:$layer$$, distance:$distance$$});
};
game.core.Camera.prototype.update = function $game$core$Camera$$update$($Axis_deltaTime$$) {
  $Axis_deltaTime$$ = game.core.Camera.Axis;
  var $axis$$ = this.axis_, $hView$$ = this.viewport_.getHeight(), $wView$$ = this.viewport_.getWidth(), $xView$$ = this.board_.getPosition().x, $yView$$ = this.board_.getPosition().y, $boardWidth$$ = this.board_.getWidth(), $boardHeight$$ = this.board_.getHeight(), $xDeadZone$$ = $wView$$ / 2, $yDeadZone$$ = $hView$$ / 2;
  $wView$$ > $boardWidth$$ && console.warn("width is too large");
  $hView$$ > $boardHeight$$ && console.warn("height is too large");
  if (null != this.watchedEntity_) {
    var $followedX$$ = this.watchedEntity_.getPosition().x, $followedY$$ = this.watchedEntity_.getPosition().y;
    if ($axis$$ == $Axis_deltaTime$$.HORIZONTAL || $axis$$ == $Axis_deltaTime$$.BOTH) {
      $followedX$$ > $wView$$ - $xDeadZone$$ ? $xView$$ = -1 * ($followedX$$ - ($wView$$ - $xDeadZone$$)) : $followedX$$ < $xView$$ + $xDeadZone$$ && ($xView$$ = -1 * ($followedX$$ - $xDeadZone$$)), $xView$$ = Math.min(Math.max($xView$$, $wView$$ - $boardWidth$$), 0);
    }
    if ($axis$$ == $Axis_deltaTime$$.VERTICAL || $axis$$ == $Axis_deltaTime$$.BOTH) {
      $followedY$$ > $hView$$ - $yDeadZone$$ ? $yView$$ = -1 * ($followedY$$ - ($hView$$ - $yDeadZone$$)) : $followedY$$ < $yView$$ + $yDeadZone$$ && ($yView$$ = -1 * ($followedY$$ - $yDeadZone$$)), $yView$$ = Math.min(Math.max($yView$$, $hView$$ - $boardHeight$$), 0);
    }
  }
  if (this.lastX_ != $xView$$ || $yView$$ != this.lastY_) {
    this.lastX_ = $xView$$, this.lastY_ = $yView$$, _.each(this.layers_, function($l$$) {
      $l$$.layer.setPosition($xView$$ * $l$$.distance, $yView$$ * $l$$.distance);
    });
  }
};
game.core.Window = function $game$core$Window$() {
  if (game.core.Window.prototype._singletonInstance) {
    return game.core.Window.prototype._singletonInstance;
  }
  game.core.Window.prototype._singletonInstance = this;
  game.core.helper.mixin(this, "shape", "listenable");
  this.resizeCallbacks_ = [];
  this.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME, this.resize_.bind(this));
  window.addEventListener("resize", this.callListeners.bind(this, game.core.Window.RESIZE_LISTENER_EVENT_NAME));
  this.resize_();
};
game.core.Window.RESIZE_LISTENER_EVENT_NAME = "resize";
game.core.Window.prototype.resize_ = function $game$core$Window$$resize_$() {
  this.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
};
game.mixins.Physical = function $game$mixins$Physical$() {
  this.colliders = {};
};
game.core.helper.mixins.physical = game.mixins.Physical.prototype;
game.mixins.Physical.Colliders = {};
game.mixins.Physical.prototype.getAcceleration = function $game$mixins$Physical$$getAcceleration$() {
  this.acceleration_ || (this.acceleration_ = new game.core.math.Vector(0, 0));
  return this.acceleration_;
};
game.mixins.Physical.prototype.getVelocity = function $game$mixins$Physical$$getVelocity$() {
  this.velocity_ || (this.velocity_ = new game.core.math.Vector(0, 0));
  return this.velocity_;
};
game.mixins.Physical.prototype.getMass = function $game$mixins$Physical$$getMass$() {
  this.mass_ || (this.mass_ = 0);
  return this.mass_;
};
game.mixins.Physical.prototype.isMovable = function $game$mixins$Physical$$isMovable$() {
  return this.getMass() > game.constants.Epsilon;
};
game.mixins.Physical.prototype.addGravity = function $game$mixins$Physical$$addGravity$() {
  this.isMovable() && (this.getAcceleration().y += game.constants.Gravity);
};
game.mixins.Physical.prototype.addForce = function $game$mixins$Physical$$addForce$($force$$) {
  this.isMovable() && (this.getAcceleration(), this.getMass());
};
game.mixins.Physical.prototype.addXForce = function $game$mixins$Physical$$addXForce$($force$$) {
  this.isMovable() && (this.getAcceleration().x += $force$$ / this.getMass());
};
game.mixins.Physical.prototype.addYForce = function $game$mixins$Physical$$addYForce$($force$$) {
  this.isMovable() && (this.getAcceleration().y += $force$$ / this.getMass());
};
game.mixins.Physical.prototype.updateVelocity = function $game$mixins$Physical$$updateVelocity$($delta$$) {
  var $accel$$ = this.getAcceleration(), $velocity$$ = this.getVelocity();
  $velocity$$.x += $accel$$.x * $delta$$;
  $velocity$$.y += $accel$$.y * $delta$$;
};
game.mixins.Physical.prototype.updatePosition = function $game$mixins$Physical$$updatePosition$($delta$$) {
  var $accel$$ = this.getAcceleration(), $velocity$$ = this.getVelocity(), $pos$$ = this.getPosition();
  $pos$$.x += $velocity$$.x * $delta$$ + .5 * $accel$$.x * $delta$$ * $delta$$;
  $pos$$.y += $velocity$$.y * $delta$$ + .5 * $accel$$.y * $delta$$ * $delta$$;
};
game.mixins.Physical.prototype.step = function $game$mixins$Physical$$step$($delta$$3_pos$$) {
  this.isMovable() && (this.addGravity(), this.updateVelocity($delta$$3_pos$$), this.updatePosition($delta$$3_pos$$));
  $delta$$3_pos$$ = this.getPosition();
  this.setPosition($delta$$3_pos$$.x, $delta$$3_pos$$.y);
};
game.mixins.Physical.prototype.update = function $game$mixins$Physical$$update$($delta$$) {
  this.step($delta$$);
  _.isObject(this.colliders) || (this.colliders = {});
  _.each(game.core.Entity.All, function($entity$$) {
    _.each(this.colliders, function($callback$$, $name$$) {
      if ($entity$$ instanceof game.mixins.Physical.Colliders[$name$$]) {
        var $response$$ = new game.core.math.Response, $collision$$ = game.core.math.collision, $ShapeType$$ = game.mixins.Shape.Type, $didCollide$$ = !1;
        if (this.type != $ShapeType$$.POLYGON && this.type != $ShapeType$$.RECTANGLE || $entity$$.type != $ShapeType$$.POLYGON && $entity$$.type != $ShapeType$$.RECTANGLE) {
          if (this.type != $ShapeType$$.CIRCLE || $entity$$.type != $ShapeType$$.POLYGON && $entity$$.type != $ShapeType$$.RECTANGLE) {
            this.type != $ShapeType$$.POLYGON && this.type != $ShapeType$$.RECTANGLE || $entity$$.type != $ShapeType$$.CIRCLE || ($didCollide$$ = $collision$$.testPolygonCircle(this, $entity$$, $response$$));
          } else {
            if ($didCollide$$ = $collision$$.testCirclePolygon(this, $entity$$, $response$$)) {
              debugger;
            }
          }
        } else {
          $didCollide$$ = $collision$$.testPolygonPolygon(this, $entity$$, $response$$);
        }
        $didCollide$$ && $callback$$($entity$$, $response$$, $delta$$);
      }
    }.bind(this));
  }.bind(this));
};
game.mixins.Physical.prototype.resolveCollisions = function $game$mixins$Physical$$resolveCollisions$($delta$$) {
};
game.mixins.Physical.prototype.setMass = function $game$mixins$Physical$$setMass$($mass$$) {
  this.mass_ = $mass$$;
};
game.mixins.Physical.prototype.registerCollider = function $game$mixins$Physical$$registerCollider$($name$$, $type$$) {
  game.mixins.Physical.Colliders[$name$$] = $type$$;
};
game.mixins.Physical.prototype.registerCollidesWith = function $game$mixins$Physical$$registerCollidesWith$($name$$, $callback$$) {
  _.isObject(this.colliders) || (this.colliders = {});
  _.isUndefined(game.mixins.Physical.Colliders[$name$$]) ? console.warn("Warning:", $name$$, "Is not registered as a colideer") : this.colliders[$name$$] = $callback$$;
};
game.Platform = function $game$Platform$() {
  game.Platform.base(this, "constructor");
  this.el.classList.add(game.Platform.CLASS_NAME);
  game.core.helper.mixin(this, "shape", "physical");
};
game.core.helper.inherit(game.Platform, game.core.Entity);
game.Platform.CLASS_NAME = "platform";
game.Player = function $game$Player$() {
  game.Player.base(this, "constructor");
  this.el.classList.add(game.Player.CLASS_NAME);
  game.core.helper.mixin(this, "shape", "reset", "fourway", "physical");
  this.friction = this.bouncyness = .5;
  this.epsilon = .01;
  this.setMass(3);
};
game.core.helper.inherit(game.Player, game.core.Entity);
game.Player.CLASS_NAME = "player";
game.Player.prototype.collisionWithPlatform = function $game$Player$$collisionWithPlatform$($other$$10_position$$, $response$$7_velocity$$, $delta$$) {
  $other$$10_position$$ = this.pos.sub($response$$7_velocity$$.overlapV);
  $response$$7_velocity$$ = this.getVelocity();
  $response$$7_velocity$$.y *= -this.bouncyness;
  $response$$7_velocity$$.x > this.epsilon ? ($response$$7_velocity$$.x -= 9.8 * this.friction * $delta$$, 0 > $response$$7_velocity$$.x && ($response$$7_velocity$$.x = 0)) : $response$$7_velocity$$.x < this.epsilon ? ($response$$7_velocity$$.x += 9.8 * this.friction * $delta$$, 0 < $response$$7_velocity$$.x && ($response$$7_velocity$$.x = 0)) : $response$$7_velocity$$.x = 0;
  this.setPosition($other$$10_position$$.x, $other$$10_position$$.y);
};
game.Main = function $game$Main$() {
  this.window_ = new game.core.Window;
  this.viewport_ = new game.core.Root;
  this.player_ = new game.Player;
  this.camera_ = new game.core.Camera;
  this.board_ = new game.Board;
  this.backDrop_ = new game.Backdrop;
  this.gameState_ = game.Main.State.RUNNING;
  this.platform_ = new game.Platform;
  this.rotatedPlatform_ = new game.Platform;
  this.sphereObject_ = new game.Circle;
  this.gameTime_ = +new Date;
  this.attach();
  this.init();
  this.update();
};
game.Main.State = {RUNNING:0, PAUSED:1};
game.Main.prototype.init = function $game$Main$$init$() {
  this.window_.registerListener(game.core.Window.RESIZE_LISTENER_EVENT_NAME, function() {
    this.viewport_.setRectangle("25%", "25%", "50%", "50%", this.window_, 800, 600, 400, 300);
  }.bind(this), !0);
  this.rotatedPlatform_.setPolygon(new game.core.math.Vector(160, 120), [new game.core.math.Vector(0, 0), new game.core.math.Vector(60, 0), new game.core.math.Vector(100, 40), new game.core.math.Vector(60, 80), new game.core.math.Vector(0, 80)]);
  this.sphereObject_.setCircle(new game.core.math.Vector(200, 0), 20);
  this.platform_.setRectangle(0, 600, 1E3, 100);
  this.platform_.el.classList.add("ground");
  this.board_.setRectangle(0, 0, 1E3, 700);
  this.backDrop_.setRectangle(0, 0, 1E3, 700);
  this.player_.getVelocity().x = 5;
  this.player_.setRectangle(0, 0, 40, 50);
  this.player_.setMass(5);
  this.camera_.watch(this.player_);
  this.camera_.addLayer(this.backDrop_, .3);
  this.platform_.registerCollider("platform", game.Platform);
  this.player_.registerCollidesWith("platform", this.player_.collisionWithPlatform.bind(this.player_));
  this.sphereObject_.registerCollidesWith("platform", this.sphereObject_.collisionWithPlatform.bind(this.sphereObject_));
};
game.Main.prototype.attach = function $game$Main$$attach$() {
  this.viewport_.attach(document.body);
  this.backDrop_.attach(this.viewport_);
  this.board_.attach(this.viewport_);
  this.player_.attach(this.board_);
  this.platform_.attach(this.board_);
  this.rotatedPlatform_.attach(this.board_);
  this.sphereObject_.attach(this.board_);
};
game.Main.prototype.update = function $game$Main$$update$() {
  if (this.gameState_ != game.Main.State.PAUSED) {
    window.requestAnimationFrame(this.update.bind(this));
    var $newTime$$ = +new Date, $deltaTime$$ = ($newTime$$ - this.gameTime_) / 100;
    this.gameTime_ = $newTime$$;
    this.camera_.update($deltaTime$$);
    _.each(game.core.Entity.All, function($entity$$) {
      $entity$$.update($deltaTime$$);
      $entity$$.resolveCollisions($deltaTime$$);
    });
    _.each(game.core.Entity.All, function($entity$$) {
      $entity$$.isDirty && $entity$$.draw();
    });
  }
};
var main = new game.Main;

