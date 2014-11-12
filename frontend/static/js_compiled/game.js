var helper = {object:{}};
helper.object.clone = function $helper$object$clone$($obj$$) {
  var $res$$ = {}, $key$$;
  for ($key$$ in $obj$$) {
    $res$$[$key$$] = $obj$$[$key$$];
  }
  return $res$$;
};
var game = {Point:function() {
  this.y_ = this.x_ = 0;
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
game.Entity = function $game$Entity$() {
  this.position_ = new game.Point;
  this.size_ = {width:0, height:0};
  this.id_ = "entity-" + game.Entity.ID_COUNT++;
  this.el = document.createElement("span");
  this.el.id = this.id_;
};
game.Entity.ID_COUNT = 0;
game.Entity.prototype.attach = function $game$Entity$$attach$($parent$$) {
  document.getElementById(this.id_) || $parent$$.appendChild(this.el);
};
game.Entity.prototype.getSize = function $game$Entity$$getSize$($opt_unit$$) {
  var $size$$ = helper.object.clone(this.size_);
  null != $opt_unit$$ && ($size$$.width += $opt_unit$$, $size$$.height += $opt_unit$$);
  return $size$$;
};
game.Entity.prototype.getPosition = function $game$Entity$$getPosition$() {
  return this.position_;
};
game.Main = function $game$Main$() {
  this.player = new game.Entity;
  this.init();
  this.render();
};
game.Main.prototype.init = function $game$Main$$init$() {
  this.player.attach(document.body);
};
game.Main.prototype.render = function $game$Main$$render$() {
  window.requestAnimationFrame(this.render.bind(this));
};
var main = new game.Main;

