// JSHint
/* jshint node:true */

var gulp = require('gulp');
var rename = require("gulp-rename");
var template = require('gulp-template');
var gettext = require('gulp-angular-gettext');
var tap = require('gulp-tap');
var path = require('path');
var fs = require('fs');

var supportedLanguageCodes;
var outputTranslationsFolder = './debug/translations/';
var olsonFiles = [
    'africa', 'antarctica', 'asia', 'australasia', 'backward',
    'etcetera', 'europe', 'factory', 'northamerica', 'pacificnew',
    'southamerica', 'systemv'
];

module.exports = {
    outputTranslationsFolder: outputTranslationsFolder
};

function generateTimezoneJson(baseDir, cities) {

    var timezoneJS =
        require('vendor/bower_components/timezone-js/src/date.js');

    var EXCLUDED = new RegExp('README|Makefile|factory|(\\.+)', 'i');

    var result = {};
    var _tz = timezoneJS.timezone;

    _tz.loadingScheme = _tz.loadingSchemes.MANUAL_LOAD;
    _tz.zoneFiles = olsonFiles;

    _tz.zoneFiles.forEach(function (zoneFile) {
        if (EXCLUDED.test(zoneFile)) {
            return;
        }

        var zoneData =
            fs.readFileSync(baseDir + '/' + zoneFile, 'utf8');

        console.log('parsing', zoneFile);
        _tz.parseZones(zoneData);
    });

    if (cities) {
        cities = cities.replace(/ /g, '').split(',');
        var rules = {};

        var zones = cities.reduce(function (zones, city) {
            zones[city] = _tz.zones[city];
            return zones;
        }, {});

        Object.keys(zones).forEach(function (city) {
            zones[city].reduce(function (rules, z) {
                var ruleKey = z[1];
                rules[ruleKey] = _tz.rules[ruleKey];
                return rules;
            }, rules);
        });

        result.zones = zones;
        result.rules = rules;
    } else {
        result.zones = _tz.zones;
        result.rules = _tz.rules;
    }

    var timezoneJson = JSON.stringify(result, function (key, value) {
        if (typeof(value) === "number") {
            return value.toString();
        }
        return value;
    });

    return timezoneJson;
}

gulp.task('exporttranslations', function () {
    return gulp.src([
        'src/app/**/*.tpl.html',
        'src/index.html',
        'src/app/**/*.js',
        'src/common/**/*.js',
        'src/common/**/*.tpl.html'
    ])
        .pipe(gettext.extract('template.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('./translations/'));
});

gulp.task('importtranslations', function () {
    supportedLanguageCodes = ['en-GB'];

    return gulp.src(['translations/*.po'])
        .pipe(tap(function (file, t) {
            var poFile = path.basename(file.path, '.po');
            if (supportedLanguageCodes.indexOf(poFile) === -1) {
                supportedLanguageCodes.push(poFile);
            }

        }))
        .pipe(gettext.compile({
            //module: 'gettext',
            format: 'json',
            defaultLanguage: 'en-GB'
        }))
        .pipe(gulp.dest(outputTranslationsFolder));
});

gulp.task('translations', ['importtranslations'], function (cb) {
    var languagesJson = JSON.stringify(supportedLanguageCodes);

    fs.writeFile(
        outputTranslationsFolder + 'languages.json',
        languagesJson,
        'utf8',
        cb);
});

gulp.task('copy-angular-locale', ['importtranslations'], function (cb) {
    var ngLocaleFiles = [];

    for (var i = 0; i < supportedLanguageCodes.length; i++) {
        var lang = supportedLanguageCodes[i];
        //ngLocaleFiles.push('./vendor/bower_components/angular-i18n/' + lang + '.js'); // What are these files?
        ngLocaleFiles.push('./vendor/bower_components/angular-i18n/angular-locale_' + lang + '.js');
    }

    return gulp.src(ngLocaleFiles)
        .pipe(gulp.dest(outputTranslationsFolder));
});

gulp.task('generate-timezone-json', function () {
    var timezoneJson = generateTimezoneJson('./translations/timezones',
        null);

    return gulp.src('./translations/loadTimezones.tpl.js')
        .pipe(template({
            timezoneJson: timezoneJson
        }))
        .pipe(rename('loadTimezones.js'))
        .pipe(gulp.dest('./src/common/'));

});

function generateTimezoneDictionary(countryCodeToTimezones, engbTerritories) {
    var countryNameToTimezones = {};

    for (var countryCode in countryCodeToTimezones) {
        var timezones = countryCodeToTimezones[countryCode];
        var englishCountryName = engbTerritories[countryCode];

        var timezoneArray = [];
        for (var timezoneIndex in timezones) {
            var timezone = timezones[timezoneIndex];
            var tzParts = timezone.split('/');
            var englishCityName = tzParts[tzParts.length - 1].replace(/_/g,
                ' ');
            timezoneArray.push({
                timezoneId: timezone,
                city: englishCityName
            });
        }

        countryNameToTimezones[englishCountryName] = timezoneArray;
    }

    return countryNameToTimezones;
}

gulp.task('timezones', ['importtranslations'], function (cb) {
    // This code is disgusting but it works!
    var countryCodeToTimezones = JSON.parse(fs.readFileSync(
        './translations/timezonesByCountry.json'));
    var engbTerritoriesJson = JSON.parse(fs.readFileSync(
        './translations/unicode/en-GB/territories.json'));
    var engbTerritories = engbTerritoriesJson.main['en-GB'].localeDisplayNames
        .territories;
    var countryNameToTimezones = generateTimezoneDictionary(
        countryCodeToTimezones, engbTerritories);

    for (var localeCodeIndex in supportedLanguageCodes) {
        var localeCode = supportedLanguageCodes[localeCodeIndex];
        if (localeCode === 'en-GB') {
            continue;
        }

        var territoriesFilePath = './translations/unicode/' +
            localeCode + '/territories.json';
        var citiesFilePath = './translations/unicode/' + localeCode +
            '/timeZoneNames.json';
        var foreignTerritoriesJson = JSON.parse(fs.readFileSync(
            territoriesFilePath));
        var foreignCitiesJson = JSON.parse(fs.readFileSync(
            citiesFilePath));

        var foreignTerritories = foreignTerritoriesJson.main[localeCode]
            .localeDisplayNames.territories;
        var foreignCities = foreignCitiesJson.main[localeCode].dates.timeZoneNames
            .zone;

        var gettextPath = outputTranslationsFolder + localeCode +
            '.json';
        var gettextObj = JSON.parse(fs.readFileSync(gettextPath));

        // Stupid gettext has to have an underscore as the locale separator, but I want a hyphen.
        if (localeCode.indexOf('-') > -1) {
            var stupidLocaleCode = localeCode.replace(/-/g, '_');
            gettextObj[localeCode] = gettextObj[stupidLocaleCode];
            delete gettextObj[stupidLocaleCode];
        }

        var gettext = gettextObj[localeCode];
        for (var countryCode in countryCodeToTimezones) {
            var timezones = countryCodeToTimezones[countryCode];
            var englishCountryName = engbTerritories[countryCode];
            var foreignCountryName = foreignTerritories[countryCode];

            gettext[englishCountryName] = foreignCountryName;
            for (var timezoneIndex in timezones) {
                var timezone = timezones[timezoneIndex];
                var tzParts = timezone.split('/');
                var foreignCity = foreignCities;
                var foreignCityName;
                for (var partIndex in tzParts) {
                    var part = tzParts[partIndex];
                    foreignCity = foreignCity[part];
                }

                var englishCityName = tzParts[tzParts.length - 1].replace(
                    /_/g, ' ');
                if (foreignCity !== undefined) {
                    foreignCityName = foreignCity.exemplarCity;
                } else {
                    console.log(localeCode, " ", englishCityName);
                    foreignCityName = englishCityName;
                }

                gettext[englishCityName] = foreignCityName;
            }
        }

        fs.writeFileSync(gettextPath, JSON.stringify(gettextObj),
            'utf8');
    }

    fs.writeFile(
        './translations/timezonesByCountryName.json',
        JSON.stringify(countryNameToTimezones),
        'utf8',
        cb);
});
