/// <reference path="taskService.js"/>
'use strict';

describe('taskService', function () {
    // load the controller's module
    beforeEach(module('taskApp'));
    it('returns correct task by task code', inject(function (taskService) { //parameter name = service name
        var task = taskService.GetTask('psteamrevamp#1');
        expect(task.Id).toEqual(1);
        expect(task.Title).toBe('First task!');
        expect(task.TaskCode).toBe('psteamrevamp#1');
    }));

    it('returns correct number of tasks from GetTasks', inject(function (taskService) {
        var tasks = taskService.GetTasks();
        expect(tasks.length).toEqual(7);
    }));

    it('correctly creates a new task', inject(function (taskService) {
        var taskCountBefore = taskService.GetTasks().length;
        taskService.CreateTask('My Title', 'My reply text is here');
        var taskCountAfter = taskService.GetTasks().length;
        expect(taskCountAfter - taskCountBefore).toEqual(1);
    }));
});