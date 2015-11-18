/*global define, require*/
define([
    'jquery'
], function($) {
    'use strict';

    var initialize = function($node, parentView) {
        if (!$node) {
            $node = $('body');
        }

        $node.find('[data-bb-view]').each(function() {
            var domNode = $(this);
            var amdBbViewModuleName = domNode.data('bbView');
            var amdBbViewModuleData = domNode.data('bbViewData');

            if (domNode.data('attachedBackboneView')) {
                //skip reinitialization
                return;
            }

            require([amdBbViewModuleName], function(View) {
                var view = new View({
                    el: domNode,
                    data: amdBbViewModuleData || {},
                    parentView: parentView
                });

                domNode.data('attachedBackboneView', view);
            });
        });
    };

    initialize();
});
