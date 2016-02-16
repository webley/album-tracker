'use strict';

var cfg = module.exports;

cfg.release = {};
cfg.debug = {};

//region Release configs

/**
 * Root of release output
 * @type {string}
 */
cfg.release.releaseOutputRoot = '../Delcam.PSTeam.Host/ui/';

/**
 * Path to the release output folder for index.html
 * @type {string}
 */
cfg.release.outputIndexFolder = cfg.release.releaseOutputRoot;

/**
 * Path to the release site root folder
 * @type {string}
 */
cfg.release.outputFolder = cfg.release.releaseOutputRoot;

/**
 * Path to release output vendor folder
 * @type {string}
 */
cfg.release.outputVendorFolder = cfg.release.outputFolder + 'vendor/';

/**
 * Path to release output assets folder
 * @type {string}
 */
cfg.release.outputAssetsFolder = cfg.release.outputFolder + 'assets/';

/**
 * Path to release output translations folder
 * @type {string}
 */
cfg.release.outputTranslationsFolder = cfg.release.outputFolder + 'translations/';

/**
 * Path to release output folder for application configuration
 * @type {string}
 */
cfg.release.outputConfigFolder = cfg.release.outputFolder + 'configuration/';

// endregion


// region Debug configs


// endregion


/**
 * Images for `spritesmith` image concatenation to the one big image and css atlas
 * @type {string[]|string}
 */
cfg.spritesSrc = ['./src/temp/sprites/src/**/*.+(png|jpg|jpeg|bmp)'];

/**
 * Current build number
 * @type {string}
 */
cfg.buildNumber = process.env.BUILD_NUMBER || (Math.random() * 100000).toString();

/**
 * Build number suffix
 * @type {string}
 */
cfg.buildNumberSuffix = '?ver=' + cfg.buildNumber;
