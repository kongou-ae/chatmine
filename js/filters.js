'use strict';

angular.module('hogemine')
    // 改行を反映させるためのフィルタ
    .filter('newline', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text != null ? text.replace(/\n/g, '<br />') : '');
        };
    })
    // 時刻表示を綺麗に出力するフィルタ
    .filter('timeChange', function($sce) {
        return function(text) {
            var m = moment(text)
            var formatDate = m.format('YYYY/MM/DD HH:mm');
            return formatDate
        };
    })
    // paginationのフィルタ
    .filter('startFrom', function() {
        return function(input, start) {
            if (!input || !input.length) { return; }
            start = +start; //parse to int
            return input.slice(start);
        };
    });
