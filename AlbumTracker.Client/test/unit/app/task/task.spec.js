/// <reference path="task.js"/>
'use strict';

describe('TaskController', function () {
    var scope, routeParams, location, mockTaskService, timeout, mockWindow, Hub;
    var controller;
    var windowToken = null;
    var hubDoneCallback = function () {
    };
    var hubFailCallback = function () {
    };

    var task = {
        topicCode: 'faketopic',
        id: 42,
        title: 'This task is a mockery',
        originator: 'dmw',
        created: '2014-08-01T00:00:00',
        updated: '2014-08-01T00:00:00',
        assignees: ['dmw', 'stm', 'mrd'],
        priority: 1,
        status: 1,

        complete: 50,
        workTime: 300,
        cost: 120.5,
        rollup: false,

        baseStart: '0001-01-01T00:00:00',
        baseDue: '0001-01-01T00:00:00',
        start: '0001-01-01T00:00:00',
        due: '0001-01-01T00:00:00'
    };

    var taskHistory = [
        {
            text: 'Reply 1',
            createdDate: '0001-01-01T00:00:00'
        },
        {
            text: 'Reply 2',
            createdDate: '0001-01-01T00:00:00'
        }
    ];

    var deferred = {};

    //beforeEach(function () { angular.module('psteam', []); });
    beforeEach(module('task'));

    beforeEach(inject(function ($controller, $rootScope, $q) {
        mockTaskService = {
            getTask: function (taskCode, withHistory) {
                deferred.getTask = $q.defer();
                return deferred.getTask.promise;
            },

            getTopicTasks: function (topicCode) {
                deferred.getTopicTasks = $q.defer();
                return deferred.getTopicTasks.promise;
            }
        };

        routeParams = {
            taskCode: 'faketopic#1'
        };

        location = {
            path: function (route) {
                // Normally this would redirect the browser.
            }
        };

        timeout = function (func) {
            func();
        };

        mockWindow = {
            localStorage: {
                token: 'mockToken'
            }
        };

        Hub = function (hub, options) {
            this.promise = {
                done: function (doneFunc) {
                    hubDoneCallback = doneFunc;
                },
                fail: function (failFunc) {
                    hubFailCallback = failFunc;
                }
            };
            this.authenticate = function (token) {
                windowToken = token;
            };
            this.connection = {
                id: 101,
                lastError: 'Last error'
            };
        };


        scope = $rootScope.$new();
        controller = $controller('TaskController', {
            $scope: scope,
            $routeParams: routeParams,
            $location: location,
            taskService: mockTaskService,
            $timeout: timeout,
            $window: mockWindow,
            Hub: Hub
        });

    }));

    it('returns correct task by task code', function () {
        scope.getTask('whatever#42');
        deferred.getTask.resolve([task, null]);
        scope.$root.$digest();
        expect(scope.task.topicCode).toBe('faketopic');
    });

    it('sets scope task when getTask is called', function () {
        scope.getTask('whatever#42');

        task.topicCode = 'bob';
        deferred.getTask.resolve([task, null]);
        scope.$root.$digest();
        expect(scope.task.topicCode).toBe('bob');

        task.topicCode = 'fred';
        deferred.getTask.resolve([task, null]);
        scope.$root.$digest();
        expect(scope.task.topicCode).toBe('fred');
    });

    it('sets history when returned', function () {
        scope.getTask('whatever#42');
        deferred.getTask.resolve([task, taskHistory]);
        scope.$root.$digest();
        expect(scope.task.history[0].text).toBe('Reply 1');
        expect(scope.task.history[1].text).toBe('Reply 2');
    });

    it('authenticates hub after connection established', function () {
        expect(windowToken).toBe(null);

        hubDoneCallback();
        scope.$root.$digest();
        expect(windowToken).toBe('mockToken');
    });
});