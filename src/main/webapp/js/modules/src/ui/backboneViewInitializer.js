/*global define, require*/
define([
    'jquery',
    'logger'
], ($, logger) => {
    const initialize = (node, parentView) => {
        logger.log('run bbViewInitialized');

        const $node = node || $('body');

        $node.find('[data-bb-view]').each(function iterate() {
            let domNode = $(this);
            const amdBbViewModuleName = domNode.data('bbView');
            const amdBbViewModuleData = domNode.data('bbViewData');

            if (domNode.data('attachedBackboneView')) {
                //skip reinitialization
                return;
            }

            require([amdBbViewModuleName], (View) => {
                const view = new View({
                    el: domNode,
                    data: amdBbViewModuleData || {},
                    parentView: parentView
                });

                domNode.data('attachedBackboneView', view);
            });
        });
    };

    initialize();

    return initialize;
});
