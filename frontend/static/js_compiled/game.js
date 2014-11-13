var helper = {object:{}};
helper.object.clone = function $helper$object$clone$($obj$$) {
  var $res$$ = {}, $key$$;
  for ($key$$ in $obj$$) {
    $res$$[$key$$] = $obj$$[$key$$];
  }
  return $res$$;
};
helper.extend = function $helper$extend$($childCtor$$, $parentCtor$$) {
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
var game = {KeyHandler:function() {
  if (game.KeyHandler.prototype._singletonInstance) {
    return game.KeyHandler.prototype._singletonInstance;
  }
  game.KeyHandler.prototype._singletonInstance = this;
  this.pressed_ = {};
  window.addEventListener("keyup", this.onKeyup_.bind(this), !1);
  window.addEventListener("keydown", this.onKeydown_.bind(this), !1);
}};
game.KeyHandler.prototype.isDown = function $game$KeyHandler$$isDown$($keyCode$$) {
  return this.pressed_[$keyCode$$];
};
game.KeyHandler.prototype.onKeydown_ = function $game$KeyHandler$$onKeydown_$($evt$$) {
  this.pressed_[$evt$$.keyCode] = !0;
};
game.KeyHandler.prototype.onKeyup_ = function $game$KeyHandler$$onKeyup_$($evt$$) {
  delete this.pressed_[$evt$$.keyCode];
};
game.KeyHandler.Keycodes = {BACKSPACE:8, TAB:9, ENTER:13, SHIFT:16, CTRL:17, ALT:18, ESC:27, SPACE:32, LEFT:37, UP:38, RIGHT:39, DOWN:40};
game.Point = function $game$Point$($opt_x$$, $opt_y$$) {
  this.x_ = $opt_x$$ || 0;
  this.y_ = $opt_y$$ || 0;
};
game.Point.prototype.getX = function $game$Point$$getX$($opt_unit$$) {
  var $x$$ = this.x_;
  $opt_unit$$ && ($x$$ += $opt_unit$$);
  return $x$$;
};
game.Point.prototype.setX = function $game$Point$$setX$($x$$) {
  this.x_ = $x$$;
};
game.Point.prototype.getY = function $game$Point$$getY$($opt_unit$$) {
  var $y$$ = this.y_;
  $opt_unit$$ && ($y$$ += $opt_unit$$);
  return $y$$;
};
game.Point.prototype.setY = function $game$Point$$setY$($y$$) {
  this.y_ = $y$$;
};
game.Size = function $game$Size$($opt_width$$, $opt_height$$) {
  this.width_ = $opt_width$$ || 0;
  this.height_ = $opt_height$$ || 0;
};
game.Size.prototype.getWidth = function $game$Size$$getWidth$($opt_unit$$) {
  var $width$$ = this.width_;
  $opt_unit$$ && ($width$$ += $opt_unit$$);
  return $width$$;
};
game.Size.prototype.getHeight = function $game$Size$$getHeight$($opt_unit$$) {
  var $height$$ = this.height_;
  $opt_unit$$ && ($height$$ += $opt_unit$$);
  return $height$$;
};
game.Entity = function $game$Entity$() {
  this.position_ = new game.Point;
  this.background = "";
  this.scale_ = 1;
  this.rotation_ = 0;
  this.skew_ = new game.Point;
  this.size_ = new game.Size;
  this.id_ = "entity-" + game.Entity.ID_COUNT++;
  this.el = document.createElement("span");
  this.el.id = this.id_;
  this.el.classList.add(game.Entity.CLASS_NAME);
};
game.Entity.CLASS_NAME = "entity";
game.Entity.ID_COUNT = 0;
game.Entity.prototype.update = function $game$Entity$$update$() {
};
game.Entity.prototype.attach = function $game$Entity$$attach$($parent$$) {
  document.getElementById(this.id_) ? console.warn("Attempted to attach dom element multiple times:", this.el_) : $parent$$.appendChild(this.el);
  this.setupEventListeners();
};
game.Entity.prototype.detach = function $game$Entity$$detach$() {
  this.el.parentNode ? this.el.parentNode.removeChild(this.el) : console.warn("Attempted to remove dom element when it has no parent", this.el_);
  this.destroyEventListeners();
};
game.Entity.prototype.setupEventListeners = function $game$Entity$$setupEventListeners$() {
};
game.Entity.prototype.destroyEventListeners = function $game$Entity$$destroyEventListeners$() {
};
game.Entity.prototype.getSize = function $game$Entity$$getSize$($opt_unit$$) {
  var $size$$ = helper.object.clone(this.size_);
  null != $opt_unit$$ && ($size$$.width += $opt_unit$$, $size$$.height += $opt_unit$$);
  return $size$$;
};
game.Entity.prototype.setSize = function $game$Entity$$setSize$($size$$) {
  this.size_ = helper.object.clone($size$$);
  this.el.style.width = this.size_.getWidth("px");
  this.el.style.height = this.size_.getHeight("px");
};
game.Entity.prototype.getPosition = function $game$Entity$$getPosition$() {
  return this.position_;
};
game.Entity.prototype.setPosition = function $game$Entity$$setPosition$($position$$) {
  this.position_ = $position$$;
  this.updateTransform_();
};
game.Entity.prototype.getBackground = function $game$Entity$$getBackground$() {
  return this.background_;
};
game.Entity.prototype.setBackground = function $game$Entity$$setBackground$($background$$) {
  this.background_ = $background$$;
  this.el.style.background = $background$$;
};
game.Entity.prototype.getRotation = function $game$Entity$$getRotation$() {
  return this.rotation_;
};
game.Entity.prototype.setRotation = function $game$Entity$$setRotation$($rotation$$) {
  this.rotation_ = $rotation$$;
  this.updateTransform_();
};
game.Entity.prototype.getScale = function $game$Entity$$getScale$() {
  return this.scale_;
};
game.Entity.prototype.setScale = function $game$Entity$$setScale$($scale$$) {
  this.scale_ = $scale$$;
  this.updateTransform_();
};
game.Entity.prototype.getSkew = function $game$Entity$$getSkew$() {
  return this.skew_;
};
game.Entity.prototype.setSkew = function $game$Entity$$setSkew$($skew$$) {
  this.skew_ = $skew$$;
  this.updateTransform_();
};
game.Entity.prototype.updateTransform_ = function $game$Entity$$updateTransform_$() {
  var $transform$$ = "rotate(" + this.rotation_ + "deg) scale(" + this.scale_ + ") skewX(" + this.skew_.getX("deg") + ") skewY(" + this.skew_.getY("deg") + ") translate(" + this.position_.getX("px") + ", " + this.position_.getY("px") + ")";
  this.el.style.webkitTransform = $transform$$;
  this.el.style.MozTransform = $transform$$;
  this.el.style.msTransform = $transform$$;
  this.el.style.OTransform = $transform$$;
  this.el.style.transform = $transform$$;
};
game.Player = function $game$Player$() {
  game.Player.base(this, "constructor");
  this.keyHandler_ = new game.KeyHandler;
  this.el.classList.add(game.Player.CLASS_NAME);
};
helper.extend(game.Player, game.Entity);
game.Player.CLASS_NAME = "player";
game.Player.prototype.update = function $game$Player$$update$() {
  this.keyHandler_.isDown(game.KeyHandler.Keycodes.RIGHT) && this.moveRight();
  this.keyHandler_.isDown(game.KeyHandler.Keycodes.LEFT) && this.moveLeft();
};
game.Player.prototype.moveLeft = function $game$Player$$moveLeft$() {
  var $position$$ = this.getPosition();
  $position$$.setX($position$$.getX() - 1);
  this.setPosition($position$$);
};
game.Player.prototype.moveRight = function $game$Player$$moveRight$() {
  var $position$$ = this.getPosition();
  $position$$.setX($position$$.getX() + 1);
  this.setPosition($position$$);
};
game.Main = function $game$Main$() {
  this.player = new game.Player;
  this.gameBoard = document.getElementById("board");
  this.init();
  this.update();
};
game.Main.prototype.init = function $game$Main$$init$() {
  this.player.setSize(new game.Size(100, 100));
  this.player.setPosition(new game.Point(100, 100));
  this.player.setBackground("white");
  this.player.attach(this.gameBoard);
};
game.Main.prototype.update = function $game$Main$$update$() {
  window.requestAnimationFrame(this.update.bind(this));
  this.player.update();
};
var main = new game.Main;

