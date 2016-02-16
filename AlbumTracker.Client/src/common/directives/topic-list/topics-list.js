(function () {
    'use strict';
    angular.module('psteam.task.directives.TopicsList', [
      'ui.router'
    ]).directive('pstTopicsList', function ($compile,
        $filter,
        $state,
        $sanitize,
        $showdown,
        plaintextToHtml,
        gettextCatalog,
        relationTypeService,
        logger) {
          return {
              restrict: 'E',
              terminal: true,
              compile: function compile(tElement, tAttrs, tTransclude) {
                  return function (scope, element, attrs) {
                      var template = "<div style='margin:8px' class='md-whiteframe-z2 pst-white-content'>"+
                      "<table style='width:100%'>"+
                          "<thead>"+
                          "<tr>"+
                              "<th></th>"+
                              "<th translate>Open</th>"+
                              "<th translate class='unimportantsm'>Unscheduled</th>"+
                              "<th translate class='unimportantxs'>Scheduled</th>"+
                              "<th translate class='unimportantxs'>Work in Progress</th>"+
                              "<th translate class='unimportantsm'>Review</th>"+
                              "<th translate class='unimportantxs'>Complete</th>"+
                          "</tr>"+
                          "</thead>"+
                          "<tbody>";
                      var getTaskUrl = function(code, state) {
                        var i = $state.href('topic', {
                          topicCode: code,
                          state: state
                        });
                        return i;
                      }
                      for(var key in scope.topicStatistics) {
                        var topic = scope.topicStatistics[key];
                        template += "<tr>" +
                        "<td>"+
                          "<a style='text-align:left;  white-space: pre-wrap; position:static !important' class='md-button' href="+getTaskUrl(topic.code)+">"+
                              "<b>"+topic.name+"</b>"+
                          "</a>"+
                        "</td>"+

                        "<td>"+
                            "<a class='md-primary md-button' style='display: block; margin:auto; position:static !important'"+
                                       " href="+getTaskUrl(topic.code, 'open')+">"+ topic.open +
                            "</a>"+
                        "</td>"+
                        "<td class='unimportantsm'>"+
                            "<a class='md-primary md-button' style='display: block; margin:auto; position:static !important'"+
                                       " href="+getTaskUrl(topic.code, 'unscheduled')+">"+ topic.unscheduled +
                            "</a>"+
                        "</td>"+
                        "<td class='unimportantxs'>"+
                            "<a class='md-primary md-button' style='display: block; margin:auto; position:static !important'"+
                                       "href="+getTaskUrl(topic.code, 'scheduled')+">"+ topic.scheduled +
                            "</a>"+
                        "</td>"+
                        "<td class='unimportantxs'>"+
                            "<a class='md-primary md-button' style='display: block; margin:auto; position:static !important'"+
                                       " href="+getTaskUrl(topic.code, 'wip')+">"+ topic.wip +
                            "</a>"+
                        "</td>"+
                        "<td class='unimportantsm'>"+
                            "<a class='md-primary md-button' style='display: block; margin:auto; position:static !important'"+
                                       " href="+getTaskUrl(topic.code, 'review')+">"+ topic.review +
                            "</a>"+
                        "</td>"+
                        "<td class='unimportantxs'>"+
                            "<a class='md-primary md-button' style='display: block; margin:auto; position:static !important'"+
                                       " href="+getTaskUrl(topic.code, 'complete')+">"+ topic.complete +
                            "</a>"+
                        "</td>"+
                        "</tr>";

                      }
                      template += "</tbody>" +
                                  "</table>" +
                                  "</div>";

                      element[0].innerHTML = template;
                    }
              },
              transclude: false,
              scope: {
                  topicStatistics: '='
              }
        };
    });
})();
