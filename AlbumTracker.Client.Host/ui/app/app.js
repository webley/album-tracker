(function() {
    'use strict';
    angular.module('app', [
            'ui.router',
			'ngSanitize',
            'ngMessages',
            'ngMaterial',
			'app.version',
			'app.handSelector'
        ])
        .config(function($locationProvider,
            $stateProvider,
            $urlRouterProvider,
            $mdIconProvider,
            $mdThemingProvider,
            $urlMatcherFactoryProvider) {

            $locationProvider.html5Mode(true);

            $urlMatcherFactoryProvider.strictMode(false);
            $mdThemingProvider.theme('default')
                .primaryPalette('pink')
                .accentPalette('blue')
                .warnPalette('red');


            $stateProvider.state('app', {
                templateUrl: 'app/app.tpl.html',
                controller: function(){},
                controllerAs: 'ctrl'
            });

            $urlRouterProvider.rule(function($injector, $location) {
                var path = $location.url();

                // check to see if the path already has a slash where it should be
                if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
                    return;
                }

                if (path.indexOf('?') > -1) {
                    return path.replace('?', '/?');
                }

                return path + '/';
            });

            $urlRouterProvider.otherwise(function($injector) {
                // Automatically redirect to homepage if we get an unrecognised URL.  Could add a state for root /#/ and otherwise
                // redirect to '404' page.
                var $state = $injector.get('$state');
                $state.go('handSelector');
            });


            //$mdIconProvider.iconSet('navigation', 'assets/material-icons/navigation-icons.svg');
            //$mdIconProvider.iconSet('av', 'assets/material-icons/av-icons.svg');
            //$mdIconProvider.iconSet('content', 'assets/material-icons/content-icons.svg');
            //$mdIconProvider.iconSet('file', 'assets/material-icons/file-icons.svg');
            //$mdIconProvider.iconSet('action', 'assets/material-icons/action-icons.svg');
            //$mdIconProvider.iconSet('editor', 'assets/material-icons/editor-icons.svg');
            //$mdIconProvider.iconSet('image', 'assets/material-icons/image-icons.svg');
        })
        .run(function($state,
                $rootScope) {
                $rootScope.$state = $state;

                $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
                    console.error(event, unfoundState, fromState, fromParams);
                });

                $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                    console.error(event, toState, toParams, fromState, fromParams, error);
                });
            }
        );
})();
