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
  GRAVITY: 9.8 * game.constants.PIXEL_TO_METER,
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
 * Delay on bullet creation (can only create bullet every x ticks).
 *
 * @const {number}
 */
game.constants.BULLET_DELAY = 60;


/**
 * Firebase URL.
 *
 * @const {string}
 */
game.constants.FIREBASE_URL = 'https://yegge-bomb.firebaseio.com';


/**
 * The number of allowed users it takes to start a game.
 *
 * @const {string}
 */
game.constants.NUM_USERS_ALLOWED_TO_START_A_GAME = 2;
