(function () {
    'use strict';
    angular.module('psteam.common.directives.documents', ['ngMaterial'])
        .directive('pstDocuments', function (logger) {
            logger.trace("directive('pstDocuments')");
        return {
            restrict: 'E',
            templateUrl: 'common/directives/documents/documents.tpl.html',
            scope: {
                showToolbar: '=',
                showPager: '=',
                showSharesFilter: '=',
                showFolders: '=',
                showDocuments: '=',
                showShares: '=',
                folders: '=',
                sharedFolders: '=',
                documents: '=',
                sharedDocuments: '=',
                page: '=',
                pageSize: '=',
                linkUrlGenerator: '=',
                createNewFolderCallback: '=',
                linkDocumentCallback: '=',
                canShareFolder: '=',
                shareFolderCallback: '=',
                canPasteShared: '=',
                pasteSharedCallback: '='
            },
            controller: function($state, $scope, TopicsDataAccessService, $mdDialog) {
                    logger.trace("directive('pstDocuments:controller");
                    var that = this;
                    this.totalHits = 0;
                    this.getFolders = function () {
                        logger.trace('pstDocuments:controller.getFolders');
                        var folders = [];
                        if (!this.showToolbar) {
                            this.showFolders = true;
                        }
                        if (!this.showFolders) {
                            return folders;
                        }
                        folders = this.folders;
                        if (!this.showPager) {
                            return folders;
                        }
                        if (this.showSharesFilter && this.showShares && this.sharedFolders) {
                            folders = folders.concat(this.sharedFolders);
                        }
                        var total = folders.length;
                        if (!total) {
                            return folders;
                        }
                        var pageData = null;
                        if (that.pageData && that.pageData.page == that.page && that.pageData.pageSize ==
                            that.pageSize && that.pageData.showFolders == that.showFolders &&
                            that.pageData.showDocuments == that.showDocuments && that.pageData.showShares ==
                            that.showShares
                        ) {
                            pageData = that.pageData;
                            if (pageData.folders) {
                                return pageData.folders;
                            }
                        }

                        var start = (that.page - 1) * that.pageSize;
                        var end = start + that.pageSize;
                        if (end >= total) {
                            start = (that.page - 1) * that.pageSize;
                            end = total;
                        }
                        if (start < 0) {
                            start = 0;
                        }
                        if (pageData) {
                            pageData.folders = start >= count ? [] : folders.slice(start, end);
                        } else {
                            that.pageData = {
                                page: that.page,
                                pageSize: that.pageSize,
                                showFolders: that.showFolders,
                                showDocuments: that.showDocuments,
                                showShares: that.showShares,
                                folders: start >= total ? [] : folders.slice(start, end)
                            };
                        }


                        return that.pageData.folders;
                    };
                    this.lastPage = function () {
                        logger.trace('pstDocuments:controller.lastPage');
                        return Math.ceil(that.totalHits / that.pageSize);
                    };
                    this.getDocuments = function () {
                        logger.trace('pstDocuments:controller.getDocuments');
                        //logger.trace('DocumentsController.getDocuments');
                        var documents = [];
                        if (!this.showToolbar || !this.documents) {
                            this.showDocuments = false;
                        }
                        if (!that.showDocuments) {
                            return documents;
                        }
                        documents = this.documents;
                        if (this.showSharesFilter && this.showShares && this.sharedDocuments) {
                            documents = documents.concat(this.sharedDocuments);
                        }
                        var pageData = null;
                        if (that.pageData && that.pageData.page == that.page && that.pageData.pageSize ==
                            that.pageSize && that.pageData.showFolders == that.showFolders &&
                            that.pageData.showDocuments == that.showDocuments && that.pageData.showShares ==
                            that.showShares
                        ) {
                            pageData = that.pageData;
                            if (pageData.documents) {
                                return pageData.documents;
                            }
                        }
                        var start = (that.page - 1) * that.pageSize;
                        var folderCount = 0;
                        var foldersTotal = 0;
                        if (that.showFolders && that.folders) {
                            foldersTotal = that.folders.length;
                        }
                        if (that.showSharesFilter && that.showShares && that.sharedFolders) {
                            foldersTotal += that.sharedFolders.length;
                        }
                        if (start < foldersTotal) {
                            folderCount = foldersTotal - start;
                        }
                        if (folderCount >= that.pageSize) {
                            return [];
                        }
                        start = folderCount ? 0 : start - foldersTotal;
                        var end = folderCount ? start + that.pageSize - folderCount : start + that.pageSize;
                        var count = documents.length;
                        if (end >= count) {
                            start = (that.page - 1) * that.pageSize - foldersTotal;
                            end = count;
                        }
                        if (start < 0) {
                            start = 0;
                        }
                        if (pageData) {
                            pageData.documents = start >= count ? [] : documents.slice(start, end);
                        }
                        else {
                            that.pageData = {
                                page: that.page,
                                pageSize: that.pageSize,
                                showFolders: that.showFolders,
                                showDocuments: that.showDocuments,
                                showShares: that.showShares,
                                documents: start >= count ? [] : documents.slice(start, end)
                            };
                        }
                        return that.pageData.documents;

                    };


                    this.folderItems = this.getFolders();
                    this.documentItems = this.getDocuments();

                    this.getLinkUrl = function (item) {
                        logger.trace('pstDocuments:controller.getLinkUrl', item);
                        if (typeof (that.linkUrlGenerator) == 'function') {
                            return that.linkUrlGenerator(item);
                        }
                        return $state.href('documents-topic', {
                            topic: item.code,
                            page: 1,
                            pageSize: 20,
                            folders: 1,
                            docs: 1
                        });
                    };
                    this.update = function () {
                        logger.trace('pstDocuments:controller.uppdate');
                        var count = this.folderItems.length;
                        for (var i = 0; i < count; i++) {
                            var item = that.folderItems[i];
                            that.folderItems[i] = angular.copy(item);
                        }
                    };

                    var showAttachDocTaskDialog = function (event, linkDocumentCallback) {
                        logger.trace('pstDocuments:controller.showAttachDocTaskDialog');
                        $mdDialog.show({
                            controller: function docTaskDialogController($mdDialog, DocumentsRepositoryService) {
                                logger.trace('pstDocuments:controller.showAttachDocTaskDialog:$mdDialog.show:controller');
                                this.docsAutocomplete = DocumentsRepositoryService.autocompleteDocuments;
                                this.cancel = function () {
                                    logger.trace('pstDocuments:controller.showAttachDocTaskDialog:$mdDialog.show:controller:cancel');
                                    logger.trace("pstDocuments:controller.attachDocTask:$mdDialog.show:controller.cancel");
                                    $mdDialog.cancel();
                                };
                                this.attachDocument = function () {
                                    logger.trace('pstDocuments:controller.showAttachDocTaskDialog:$mdDialog.show:controller:attachDocument');
                                    $mdDialog.hide(this.document);

                                };
                            },
                            controllerAs: 'ctrl',
                            templateUrl: 'common/templates/attach-document-dialog.tpl.html',
                            targetEvent: event,
                            focusOnOpen: false
                        })
                            .then(function (document) {
                                logger.trace("pstDocuments:controller.showAttachDocTaskDialog:$mdDialog.show:controller:success", document);
                                if (linkDocumentCallback) {
                                    linkDocumentCallback(document);
                                }
                            }, function (cancellation) {
                                logger.trace("pstDocuments:controller.showAttachDocTaskDialog:$mdDialog.show:controller:error", cancellation);
                            });
                    };
                    var showCreateNewFolderDialog = function (event, linkDocumentCallback) {
                        logger.trace("pstDocuments:controller.showCreateNewFolderDialog");
                        $mdDialog.show({
                            controller: function newFolderDialogController($mdDialog, DocumentsRepositoryService) {
                                logger.trace("pstDocuments:controller.showCreateNewFolderDialog:$mdDialog.show:controller");
                                this.cancel = function () {
                                    logger.trace("pstDocuments:controller.showCreateNewFolderDialog:$mdDialog.show:controller:cancel");
                                    $mdDialog.cancel();
                                };
                                this.createFolder = function () {
                                    logger.trace("pstDocuments:controller.showCreateNewFolderDialog:$mdDialog.show:controller:createFolder");
                                    $mdDialog.hide(this.title);
                                };
                            },
                            controllerAs: 'ctrl',
                            templateUrl: 'app/folders/new-folder-dialog.tpl.html',
                            targetEvent: event,
                            focusOnOpen: false
                        })
                            .then(function (title) {
                                logger.trace("pstDocuments:controller.showCreateNewFolderDialog:$mdDialog.show:success(title = '%s')", title);
                                if (that.createNewFolderCallback) {
                                    that.createNewFolderCallback(title);
                                }
                            }, function (cancellation) {
                                logger.trace("pstDocuments:controller.showCreateNewFolderDialog:$mdDialog.show:error", cancellation);
                            });
                    };
                    this.linkDocument = function (event) {
                        logger.trace("pstDocuments:controller.linkDocument", event);
                        if (that.linkDocumentCallback) {
                            showAttachDocTaskDialog(event, that.linkDocumentCallback);

                        }
                    };
                    this.createNewFolder = function (event) {
                        logger.trace("pstDocuments:controller.createNewFolder", event);
                        if (that.createNewFolderCallback) {
                            showCreateNewFolderDialog(event, that.createNewFolderCallback);
                        }
                    };
                    this.shareFolder = function () {
                        logger.trace("pstDocuments:controller.shareFolder");
                        if (that.shareFolderCallback) {
                            that.shareFolderCallback();
                        }
                    };
                    this.pasteShared = function () {
                        logger.trace("pstDocuments:controller.pasteShared");
                        if (that.pasteSharedCallback) {
                            that.pasteSharedCallback();
                        }
                    };
                    this.pageFirstIndex = function () {
                        logger.trace("pstDocuments:controller.pageFirstIndex");
                        if (that.totalHits === 0) {
                            return 0;
                        }

                        return (that.page - 1) * that.pageSize + 1;
                    };
                    this.pageLastIndex = function () {
                        logger.trace("pstDocuments:controller.pageLastIndex");
                        var lastIndex = (that.page) * that.pageSize;
                        if (lastIndex > that.totalHits) {
                            lastIndex = that.totalHits;
                        }

                        return lastIndex;
                    };
                    $scope.$watch('ctrl.page', function (newValue, oldValue) {
                        logger.trace("pstDocuments:controller:$scope.$watch('ctrl.page'", newValue, oldValue);
                        that.folderItems = that.getFolders();
                        that.documentItems = that.getDocuments();

                    });
                    $scope.$watch('ctrl.pageSize', function (newValue, oldValue) {
                        logger.trace("pstDocuments:controller:$scope.$watch('ctrl.pageSize'", newValue, oldValue);
                        that.folderItems = that.getFolders();
                        that.documentItems = that.getDocuments();
                        that.update();

                    });
                    $scope.$watch('ctrl.showFolders', function (newValue, oldValue) {
                        logger.trace("pstDocuments:controller:$scope.$watch('ctrl.showFolders'", newValue, oldValue);
                        that.showFolders = typeof (newValue) == 'undefined' || newValue == 'true' || newValue == true;
                        that.folderItems = that.getFolders();
                        if (that.folders) {
                            if (newValue) {
                                that.totalHits += that.folders.length;
                            } else {
                                that.totalHits -= that.folders.length;
                            }
                        }
                        that.documentItems = that.getDocuments();
                        that.update();

                    });
                    $scope.$watch('ctrl.showDocuments', function (newValue, oldValue) {
                        logger.trace("pstDocuments:controller:$scope.$watch('ctrl.showDocuments'", newValue, oldValue);
                        that.showDocuments = typeof (newValue) == 'undefined' || newValue == 'true' || newValue == true;
                        if (that.documents) {
                            if (newValue) {
                                that.totalHits += that.documents.length;
                            } else {
                                that.totalHits -= that.documents.length;
                            }
                        }
                        that.documentItems = that.getDocuments();
                        that.update();

                    });
                    $scope.$watch('ctrl.showShares', function (newValue, oldValue) {
                        logger.trace("pstDocuments:controller:$scope.$watch('ctrl.showShares'", newValue, oldValue);
                        that.showShares = typeof (newValue) == 'undefined' || newValue == 'true' || newValue == true;
                        that.folderItems = that.getFolders();
                        if (that.sharedFolders) {
                            if (newValue) {
                                that.totalHits += that.sharedFolders.length;
                            } else {
                                that.totalHits -= that.sharedFolders.length;
                            }
                        }
                        if (that.sharedDocuments) {
                            if (newValue) {
                                that.totalHits += that.sharedDocuments.length;
                            } else {
                                that.totalHits -= that.sharedDocuments.length;
                            }
                        }
                        that.documentItems = that.getDocuments();
                        that.update();

                    });
                },
                controllerAs: 'ctrl',
                bindToController: true
            };
        });
})();
