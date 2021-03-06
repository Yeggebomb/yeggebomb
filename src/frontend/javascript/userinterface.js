goog.provide('game.UserInterface');

goog.require('game.core.Entity');
goog.require('game.core.helper');



/**
 * User Interface singleton class.
 *
 * @constructor
 * @extends {game.core.Entity}
 */
game.UserInterface = function() {
  game.UserInterface.base(this, 'constructor');
  this.el.classList.add(game.UserInterface.CLASS_NAME);
  /**
   * Login callback.
   *
   * @type {function()}
   */
  this.loginCallback = null;

  this.timerDiv = document.createElement('div');
  this.timerDiv.classList.add('timer');
  this.el.appendChild(this.timerDiv);

  this.googleLoginButton = document.createElement('div');
  this.googleLoginButton.classList.add('button', 'blue', 'login-button');
  this.googleLoginButton.innerText = 'Login via Google';
  this.el.appendChild(this.googleLoginButton);


  /** @private {number} */
  this.updateTimerTimeout_ = null;

  this.googleLoginButton.addEventListener('click', this.login.bind(this));
};
game.core.helper.inherit(game.UserInterface, game.core.Entity);


/**
 * Time in ms to update the display of the counter.
 *
 * @type {number}
 */
game.UserInterface.COUNTDOWN_DELAY = 100;


/**
 * @type {String}
 */
game.UserInterface.CLASS_NAME = 'user-interface';


/**
 * Draw the timer.
 *
 * @param {string} label
 * @param {number} countDownTo The time we are counting down to.
 */
game.UserInterface.prototype.drawCountDown = function(label, countDownTo) {
  if (this.updateTimerTimeout_ != null) clearTimeout(this.updateTimerTimeout_);
  var remainder = countDownTo - +new Date();
  if (remainder <= 0) return;
  this.updateTimerText(label + ' ' + (remainder / 1000).toFixed(1));
  this.updateTimerTimeout_ = setTimeout(
      this.drawCountDown.bind(this, label, countDownTo),
      game.UserInterface.COUNTDOWN_DELAY);
};


/**
 * Updates the timer text.
 *
 * @param {string} label
 */
game.UserInterface.prototype.updateTimerText = function(label) {
  this.timerDiv.innerText = label;
};


/**
 * LoginButton click.
 */
game.UserInterface.prototype.login = function() {
  if (_.isFunction(this.loginCallback)) {
    this.loginCallback();
  }
};
