var Game = function $Game$() {
  this.init();
};
Game.prototype.init = function $Game$$init$() {
  alert(this.foo(1));
};
Game.prototype.foo = function $Game$$foo$($number$$) {
  return "a " + $number$$;
};
var game = new Game;

