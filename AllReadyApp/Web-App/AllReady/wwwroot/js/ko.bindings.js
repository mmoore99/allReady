// knockout binding for jquery.maskedinput plugin
ko.bindingHandlers.masked = {
    init: function (element, valueAccessor) {
        var value = valueAccessor(),
            mask = ko.utils.unwrapObservable(value);
        $(element).mask(mask, { autoclear: false });
    }
};

// knockout binding for bootstrap 'collapse'
ko.bindingHandlers.collapse = {
    init: function (element, valueAccessor, allBindings) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
        // specifies whether this collapse should operate as an accordion (maximum of one open panel)
        var accordion = ko.utils.unwrapObservable(options.accordion) || false,
            // elements with this class will cause the content to expand/collapse
            toggleClass = "[data-toggle-collapse]",
            // defines the container of the content that will expand/collapse (this must be "collapse" for bootstrap to work)
            contentClass = ".collapse",
            //specifies the 0 based index of an item to be opened initially
            openItem = ko.utils.unwrapObservable(options.openItem) || false,
            // this class defines the container of the entire panel (non-collapsible and collapsible)
            itemClass = "." + (ko.utils.unwrapObservable(options.itemClass) || "panel"),
            // class to be placed on icon to show when collapsed
            expandIconClass = "." + (ko.utils.unwrapObservable(options.expandIcon) || "expand-icon"),
            // class to be placed on icon to show when expanded
            collapseIconClass = "." + (ko.utils.unwrapObservable(options.collapseIcon) || "collapse-icon");

        var items = $(element).find(contentClass);

        initialize();

        // if the array is dynamic, the accordion should be re-initialized
        var list = (options.listSource) ? options.listSource : allBindings.get("foreach");
        if (ko.isObservable(list)) {
            list.subscribe(function () {
                initialize();
            });
        }

        // if this is not an accordion put 'expandAll' and 'collapseAll' functions on the source list
        if (!accordion && ((ko.isObservable(list) && 'push' in list) || list === typeof "array") && list.expandAll !== typeof "function") {
            list.expandAll = function () {
                $(element).find(contentClass).collapse("show");
            };
            list.collapseAll = function () {
                $(element).find(contentClass).collapse("hide");
            };
        }

        $(element).on("click", toggleClass, function (event) {
            //debugger;
            var $contentContainer;

            if (this.nodeName === "TR") {
                var $nextRow = $(this).next();
                $contentContainer = ($nextRow.hasClass("collapse"))
                    ? $nextRow
                    : $nextRow.find(contentClass);
            } else {
                $contentContainer = $(this).closest(itemClass).find(contentClass);
            }

            if (accordion) {
                $(element).find(contentClass).collapse("hide");
                $contentContainer.collapse("show");
                return;
            }
            $contentContainer.collapse("toggle");
        });

        $(element).on("show.bs.collapse", function (event) {
            var $currentPanel = $(event.target).closest(itemClass);
            var $currentExpandIcon = $currentPanel.find(expandIconClass);
            var $currentCollapseIcon = $currentPanel.find(collapseIconClass);
            $currentExpandIcon.hide();
            $currentCollapseIcon.show();
        });

        $(element).on("hide.bs.collapse", function (event) {
            var $currentPanel = $(event.target).closest(itemClass);
            var $currentExpandIcon = $currentPanel.find(expandIconClass);
            var $currentCollapseIcon = $currentPanel.find(collapseIconClass);
            $currentExpandIcon.show();
            $currentCollapseIcon.hide();
        });

        // if initial open item specified, expand it
        if (openItem) {
            items.eq(openItem).collapse("show");
        }

        function initialize() {
            // activate all items
            $(element).find(contentClass).collapse({ parent: element, toggle: false });

            // hide all of the 'collapse' icons, the 'expand' icons will be initially showing
            $(element).find(collapseIconClass).hide();

            // set the cursor for all 'toggle' elements
            $(element).find(toggleClass).css({ cursor: "pointer" });
        }
    }
};

