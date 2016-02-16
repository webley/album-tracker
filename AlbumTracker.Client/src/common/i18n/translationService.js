/* global angular */
(function() {
    'use strict';
    angular.module('psteam.common.i18n.translations', [
        'gettext', 'tmh.dynamicLocale',
        'psteam.common.i18n.languageNames',
        'psteam.common.services.localStorage'
    ])
        .service('translationService', function($http,
            $localStorage,
            $log,
            $q,
            gettextCatalog,
            tmhDynamicLocale,
            languageNames) {
            var that = this;
            var loadedLanguages = {};
            loadedLanguages['en-GB'] = true;
            var availableLanguagesCache = null;

            // gettext standard defines code format as ll_cc
            // which is not the same as everything else which uses ll-cc
            function setGetTextLanguage(languageCode) {
                gettextCatalog.setCurrentLanguage(languageCode.replace(/-/g, '_'));
            }

            function getGetTextLanguage() {
                return gettextCatalog.currentLanguage.replace(/_/g, '-');
            }

            that.getAvailableLanguages = function() {
                var deferred = $q.defer();
                if (availableLanguagesCache) {
                    deferred.resolve(availableLanguagesCache);
                } else {
                    $http.get('translations/languages.json')
                        .success(function(data, status, headers, config) {
                            availableLanguagesCache = [];
                            for (var i = 0; i < data.length; i++) {
                                var langCode = data[i];
                                var langNativeName = languageNames[langCode] || 'MISSING NATIVE NAME';
                                availableLanguagesCache.push({ code: langCode, name: langNativeName });
                            }

                            deferred.resolve(availableLanguagesCache);
                        })
                        .error(function(data, status, headers, config) {
                            $log.debug('Error retrieving the languages ' + status);
                        });
                }

                return deferred.promise;
            };

            function isAvailableLanguage(availableLanguages, laguage) {
                for (var i = 0; i < availableLanguages.length; i++) {
                    if (availableLanguages[i].code === laguage) {
                        return true;
                    }
                }
                return false;
            }

            function ensureLanguageLoaded (languageCode) {
                var deferred = $q.defer();

                if (loadedLanguages[languageCode] === true) {
                    deferred.resolve();
                } else {
                    gettextCatalog.loadRemote('translations/' + encodeURIComponent(languageCode) + '.json').then(function() {
                        loadedLanguages[languageCode] = true;
                        deferred.resolve();
                    }, function (err) {
                        deferred.reject(err);
                    });

                }

                return deferred.promise;
            }

            that.detectLanguage = function() {
                return that.getAvailableLanguages().then(function(availableLanguages) {
                    var languageCode;

                    var localStorageLanguage = $localStorage.getItem('language');

                    if (isAvailableLanguage(availableLanguages, localStorageLanguage)) {
                        languageCode = localStorageLanguage;
                    } else if (navigator.languages) {
                        var requestedLanguages = navigator.languages;
                        for (var i = 0; i < requestedLanguages.length; i++) {
                            var requestedLanguage = requestedLanguages[i];
                            if (isAvailableLanguage(availableLanguages, requestedLanguage)) {
                                languageCode = requestedLanguage;
                                break;
                            }
                        }
                    } else if (navigator.language) {
                        var language = navigator.language;
                        if (isAvailableLanguage(availableLanguages, language)) {
                            languageCode = language;
                        }
                    } else if (navigator.userLanguage) {
                        var userLanguage = navigator.userLanguage;
                        if (isAvailableLanguage(availableLanguages, userLanguage)) {
                            languageCode = userLanguage;
                        }
                    } else {
                        languageCode = 'en';
                    }

                    that.setLanguage(languageCode);
                });
            };

            // Languages are resetting each time the user refreshes the page
            that.setLanguage = function (languageCode) {
                var deferred = $q.defer();
                that.getAvailableLanguages().then(function (availableLanguages) {
                    var currentLanguage = that.getCurrentLanguage();
                    if (currentLanguage !== languageCode &&
                        isAvailableLanguage(availableLanguages, languageCode)) {

                        ensureLanguageLoaded(languageCode).then(function () {
                            setGetTextLanguage(languageCode);
                            $localStorage.setItem('language', languageCode);
                            tmhDynamicLocale.set(languageCode).then(function () {
                                deferred.resolve();
                            }, function (err) {
                                deferred.reject(err);
                            });
                        }, function (err) {
                            deferred.reject(err);
                        });
                    } else {
                        if (currentLanguage !== languageCode) {
                            deferred.reject('Language ' + languageCode + ' is not supported.');
                        } else {
                            //otherwise we just do nothing if language was left intact
                            deferred.resolve();
                        }
                    }
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            };

            // Returns the names of the available languages
            that.getLanguageNames = function () {
                var names = [];
                for (var i = 0; i < availableLanguagesCache.length; i++) {
                    names.push(availableLanguagesCache[i].name);
                }
                return names;
            };

            // Returns the codes of the available languages
            that.getLanguageCodes = function() {
                var codes = [];
                for (var i = 0; i < availableLanguagesCache.length; i++) {
                    codes.push(availableLanguagesCache[i].code);
                }
                return codes;
            };

            // Have a look to make sure this actually works
            that.getCurrentLanguage = function() {
                return getGetTextLanguage();
            };

            // Returns the name of the language given a specific code.
            this.getNativeLanguageName = function(languageCode) {
                var nativeName = languageNames[languageCode];
                return nativeName || languageCode;
            };
        });
})();
