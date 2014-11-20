goog.provide('game.constants');
goog.provide('game.constants.Physics');


/**
 * @const {number}
 */
game.constants.PIXEL_TO_METER = 10;


/**
 * @const {number}
 */
game.constants.Physics = {
<<<<<<< HEAD
  GRAVITY: 9.8 * game.constants.PIXEL_TO_METER,
=======
  GRAVITY: 999,
>>>>>>> 0f447b2ce92fe653ab66d537540aedbfec85df3f
  EPSILON: 0.01
};


/**
 * 'Turn' length of time in ms.
 *
 * @const {number}
 */
game.constants.PLAY_TIME = 10000;


/**
 * Length of time to wait for info from the server in ms.
 *
 * @const {number}
 */
game.constants.WAIT_TIME = 2000;


/**
 * Firebase URL.
 *
 * @const {string}
 */
game.constants.FIREBASE_URL = 'https://yegge-bomb.firebaseio.com';
