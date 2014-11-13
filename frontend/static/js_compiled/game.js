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
var game = {Point:function($opt_x$$, $opt_y$$) {
  this.x_ = $opt_x$$ || 0;
  this.y_ = $opt_y$$ || 0;
}};
game.Point.prototype.getX = function $game$Point$$getX$($opt_unit$$) {
  var $x$$ = this.x_;
  $opt_unit$$ && ($x$$ += $opt_unit$$);
  return $x$$;
};
game.Point.prototype.getY = function $game$Point$$getY$($opt_unit$$) {
  var $y$$ = this.y_;
  $opt_unit$$ && ($y$$ += $opt_unit$$);
  return $y$$;
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
game.Entity.prototype.attach = function $game$Entity$$attach$($parent$$) {
  document.getElementById(this.id_) ? console.warn("Attempted to attach dom element multiple times:", this.el_) : $parent$$.appendChild(this.el);
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
  this.position_ = helper.object.clone($position$$);
  this.updateTransform_();
};
game.Entity.prototype.setBackground = function $game$Entity$$setBackground$($background$$) {
  this.background_ = $background$$;
  this.el.style.background = $background$$;
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
  this.el.classList.add(game.Player.CLASS_NAME);
};
helper.extend(game.Player, game.Entity);
game.Player.CLASS_NAME = "player";
game.Main = function $game$Main$() {
  this.player = new game.Player;
  this.init();
  this.render();
  this.x = 0;
};
game.Main.prototype.init = function $game$Main$$init$() {
  this.player.setSize(new game.Size(100, 100));
  this.player.setPosition(new game.Point(100, 100));
  this.player.setBackground("white");
  this.player.attach(document.body);
};
game.Main.prototype.render = function $game$Main$$render$() {
  window.requestAnimationFrame(this.render.bind(this));
};
var main = new game.Main;

