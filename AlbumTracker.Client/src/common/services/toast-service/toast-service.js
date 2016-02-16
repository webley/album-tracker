angular.module('psteam.common.services.toast', ['ngMaterial'])

    .controller('toastCtrl', function ($mdToast, logger) {
        logger.trace('toastCtrl');
        this.closeToast = function () {
            logger.trace('toastCtrl.closeToast');
            $mdToast.hide();
        };
    })

    .service('toastService', function ($mdToast, $document, logger) {
        logger.trace('toastService');
        var toastBuffer = [];
        var toastAlreadyDisplayed = false;
        var contentElement = $document.find('body');

        // The default $mdToast service immediately hides the current toast when a new one is shown, which can make it hard to read quickly
        // enough. I'm piggy-backing off the hide() or cancel() events that fire when the toast closes to display the next toast in the
        // buffer.
        function checkBuffer() {
            logger.trace('toastService:checkBuffer');
            if (toastBuffer.length === 0) {
                toastAlreadyDisplayed = false;
                return;
            }

            // Quite often, the DOM won't have existed by the time the service constructor runs, so cache the element now.
            if (contentElement.length === 0) {
                contentElement = $document.find('body');
            }

            toastAlreadyDisplayed = true;
            var message = toastBuffer.shift();
            $mdToast.show({
                controller: 'toastCtrl',
                bindToController: true,
                controllerAs: 'ctrl',
                templateUrl: 'common/services/toast-service/toast.tpl.html',
                hideDelay: 4000,
                position: 'bottom left',
                locals: {
                    message: message.message,
                    style: "toast-" + message.type
                },
                parent: contentElement
            }).then(checkBuffer, checkBuffer);
        }

        function bufferToast(type, message) {
            logger.trace('toastService:bufferToast(type = $s, message = $s)', type, message);
            toastBuffer.push({
                type: type,
                message: message
            });

            if (!toastAlreadyDisplayed) {
                checkBuffer();
            }
        }

        this.success = function (message) {
            logger.trace('toastService.success(message = $s)', message);
            bufferToast('success', message);
        };
        this.info = function (message) {
            logger.trace('toastService.info(message = $s)', message);
            bufferToast('info', message);
        };
        this.warning = function (message) {
            logger.trace('toastService.warning(message = $s)', message);
            bufferToast('warning', message);
        };
        this.error = function (message) {
            logger.trace('toastService.error(message = $s)', message);
            bufferToast('error', message);
        };
    });
