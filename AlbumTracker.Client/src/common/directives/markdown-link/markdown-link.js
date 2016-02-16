angular.module('psteam.common.markdown-link.service', [])
    .service('markdownLinkService', function markdownLinkService (logger, $state, FilesRepositoryService) {
        logger.trace("markdownLinkService");
        var imgExt = 'jpggifpngbmpsvg';//list of img extensions
        /**
         * Generate and replace links of added files by already attached.
         * @param {object} reply
         * @param {array} fileAttachments
         */
        this.replace = function (reply, fileAttachments) {
            logger.trace("markdownLinkService.replace");
            var regexp = /\[([^\]]+?)\]\((api\/file\/temp\/.+?)\)/g;
            var match;

            while ((match = regexp.exec(reply.replyText)) != null) {
                var version = evaluateVersion(match[1], fileAttachments);
                var base64 = btoa(reply.topicCode + '#' + reply.id + ':' + match[1] + ':' + version);
                reply.replyText = reply.replyText.replace(match[2], 'api/file/download/' + base64);
            }
            /**
             * Search for existing files and return a version even if didn't find
             * @param fileName
             * @param fileAttachments
             * @returns {number}
             */
            function evaluateVersion (fileName, fileAttachments) {
                var file = _.find(fileAttachments, function (entry) {
                    return entry.fileName === fileName;
                });
                return file ? file.versions.length + 1 : 1;
            }
        };
        /**
         * Generate a link based on topic id, name and fileName
         * @param taskReply
         * @param documents
         */
        this.generate = function(taskReply, documents){
            var replyFiles;
            replyFiles = filterFiles(documents.uploads);
            doUploadingStatus(replyFiles, documents.uploads, documents.fileAttachments);

            /**
             * Get only files, that coming from the reply view
             * @param uploads
             * @returns {Array.<T>}
             */
            function filterFiles (uploads) {
                if (($state.is('task_update.reply') || $state.is('meeting_update.reply')) && uploads && uploads.length > 0) {
                    return uploads.map(function (value, index) {
                        if (value.preparing) {
                            return {
                                name: value.file.name,
                                promise: value.deferred.promise
                            }
                        }
                    }).filter(function (entry) {//removing empty entries after mapping
                        return !!entry;
                    });
                }
            }

            /**
             * Add a markdown template to textbox. Example: !(name)[uploading....]
             * @param replyFiles
             * @param uploads
             * @param attachments
             */
            function doUploadingStatus (replyFiles, uploads) {
                taskReply.replyText = taskReply.replyText || "";
                if(!replyFiles) return;
                replyFiles.forEach(function (entry) {
                    var ext = entry.name.split('.').pop();//find file extension
                    var exclam = imgExt.indexOf(ext.toLowerCase()) >= 0 ? '!' : ''; //is it image
                    //add new line if not empty
                    taskReply.replyText = taskReply.replyText ? taskReply.replyText + '\n' : taskReply.replyText;

                    taskReply.replyText = taskReply.replyText + exclam + '[' + entry.name + '](Uploading...)';

                    entry.promise.then(function (session) {
                        var uploaded = uploads.find(function (entry) {
                            return entry.sessionIdObject == session;
                        });
                        if (uploaded) {//replacing temlpate link by temp link
                            taskReply.replyText = taskReply.replyText.replace('Uploading...', FilesRepositoryService.getTempFileUrl(session));
                        }
                    })
                });
            }
        }
    });
