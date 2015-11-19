/*eslint-disable*/
(function() {
    'use strict';

    var config = {
        baseUrl: '/js/modules/dist',
        paths: {
            // Core Libraries
            underscore: '/js/lib/underscore-1.8.3',
            jquery: '/js/jquery-1.11.1.min',
            backbone: '/js/lib/backbone-1.2.3',
            'backbone.marionette': '/js/lib/backbone.marionette-2.4.3'
        },
        shim: {
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            }
        },
        waitSeconds: 0
    };

    require.config(config);

    require(['ui/backboneViewInitializer'], function initialize() {
    });
})();
