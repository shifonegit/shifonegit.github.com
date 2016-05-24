$(function(){
    var host_name = ["shi"];

    //瀑布流
    var $window = $(window),
        defaults = {
            itemCls: 'col-item',
            prefix: 'waterfall',
            fitWidth: true,
            colWidth: 210,
            gutterWidth: 3,
            gutterHeight: 3,
            align: 'left',
            minCol: 1,
            maxCol: undefined,
            resizable: true
        };

    function Waterfall(element, options) {
        this.$element = $('#col-list');
        this.options = defaults;
        this.colHeightArray = []; // columns height array
        this.styleQueue = [];
        this._init();
    }


    host_name.push("fone");


    Waterfall.prototype = {
        constructor: Waterfall,

        /*
         * _init
         * @callback {Object Function } and when instance is triggered again -> $element.waterfall()
         */
        _init: function( callback ) {
            var options = this.options,
                path = options.path;

            this._setColumns();
            this._resetColumnsHeightArray();
            this.reLayout( callback );

            if ( options.resizable ) {
                this._doResize();
            }
        },

        /**
         * get columns
         */
        _getColumns : function() {
            var options = this.options,
                $container = options.fitWidth ?  this.$element.parent() : this.$element,
                containerWidth = $container[0].tagName === 'BODY' ? $container.width() - 20 : $container.width(),
                colWidth = options.colWidth,
                gutterWidth = options.gutterWidth,
                minCol = options.minCol,
                maxCol = options.maxCol,
                cols = Math.floor(containerWidth / (colWidth + gutterWidth)),
                col = Math.max(cols, minCol );

            return !maxCol ? col : (col > maxCol ? maxCol : col);
        },


        /**
         * set columns
         */
        _setColumns: function() {
            this.cols = this._getColumns();
        },


        /*
         * get items
         */
        _getItems: function( $content ) {
            var $items = $content.filter('.' + this.options.itemCls).css({
                'position': 'absolute'
            });

            return $items;
        },


        /*
         * reset columns height array
         */
        _resetColumnsHeightArray: function() {
            var cols = this.cols,
                i;

            this.colHeightArray.length = cols;

            for (i = 0; i < cols; i++) {
                this.colHeightArray[i] = 0;
            }
        },

        /*
         * layout
         */
        layout: function($content, callback) {
            var options = this.options,
                $items = this._getItems($content),
                styleFn = 'css',
                animationOptions = options.animationOptions,
                colWidth = options.colWidth,
                gutterWidth = options.gutterWidth,
                len = this.colHeightArray.length,
                align = options.align,
                fixMarginLeft,
                obj,
                i, j, itemsLen, styleLen;

            // append $items
            this.$element.append($items);

            // fixMarginLeft
            if ( align === 'center' ) {
                fixMarginLeft = (this.$element.width() - colWidth * len  - gutterWidth * (len - 1) ) /2;
                fixMarginLeft = fixMarginLeft > 0 ? fixMarginLeft : 0;
            } else if ( align === 'left' ) {
                fixMarginLeft = 0;
            } else if ( align === 'right' ) {
                fixMarginLeft = this.$element.width() - colWidth * len  - gutterWidth * (len - 1);
            }

            // place items
            for (i = 0, itemsLen = $items.length; i < itemsLen; i++) {
                this._placeItems( $items[i], fixMarginLeft);
            }

            // set style
            for (j= 0, styleLen = this.styleQueue.length; j < styleLen; j++) {
                obj = this.styleQueue[j];
                obj.$el[ styleFn ]( obj.style, animationOptions );
            }

            // update waterfall container height
            this.$element.height(Math.max.apply({}, this.colHeightArray));

            // clear style queue
            this.styleQueue = [];

            // update status
            // this.options.state.isResizing = false;
            //this.options.state.isProcessingData = false;

            // callback
            if ( callback ) {
                callback.call( $items );
            }

            $("#main-loading").delay(500).fadeOut("normal",function(){
                $("html,body").removeClass("loading-process");
            });
        },


        /*
         * relayout
         */
        reLayout: function( callback ) {
            var $content = this.$element.find('.' + this.options.itemCls);

            this._resetColumnsHeightArray();
            this.layout($content , callback );
        },

        /*
         * place items
         */
        _placeItems: function( item, fixMarginLeft ) {

            var $item = $(item),
                options = this.options,
                colWidth = options.colWidth,
                gutterWidth = options.gutterWidth,
                gutterHeight = options.gutterHeight,
                colHeightArray = this.colHeightArray,
                len = colHeightArray.length,
                minColHeight = Math.min.apply({}, colHeightArray),
                minColIndex = $.inArray(minColHeight, colHeightArray),
                colIndex, //cur column index
                position;

            colIndex = minColIndex;

            position = {
                left: (colWidth + gutterWidth) * colIndex  + fixMarginLeft,
                top: colHeightArray[colIndex]
            };

            // push to style queue
            this.styleQueue.push({ $el: $item, style: position });

            // update column height
            colHeightArray[colIndex] += $item.outerHeight() + gutterHeight;

        },


        /*
         * append
         * @param {Object} $content
         * @param {Function} callback
         */
        append: function($content, callback) {
            this.$element.append($content);
            this.reLayout(callback);
        },

        /*
         * opts
         * @param {Object} opts
         * @param {Function} callback
         */
        option: function( opts, callback ){
            if ( $.isPlainObject( opts ) ){
                this.options = $.extend(true, this.options, opts);

                if ( typeof callback === 'function' ) {
                    callback();
                }

                // re init
                this._init();
            }
        },



        /*
         * resize
         */
        _resize: function() {
            var cols = this.cols,
                newCols = this._getColumns(); // new columns


            if ( newCols !== cols || this.options.align !== 'left' ) {
                //this._debug('event', 'resizing ...');
                //this.options.state.isResizing = true;
                this.cols = newCols; // update columns
                this.reLayout(); // relayout
                //this._prefill(); // prefill
            }
        },


        /*
         * do resize
         */
        _doResize: function() {
            var self = this,
                resizeTimer;

            $window.bind('resize', function() {
                if ( resizeTimer ) {
                    clearTimeout(resizeTimer);
                }

                resizeTimer = setTimeout(function() {
                    self._resize();
                }, 100);
            });
        }
    };

    host_name.push(".cc");


    /**
     * 瀑布流
     */
    new Waterfall();


    $("#left-panel").mCustomScrollbar({theme:"rounded"});


    var $main_menu = $("#main-menu > li"),
        $sub_menu = $(".sub-menu");

    //一级菜单点击
    $main_menu.click(function(){
        var $this = $(this);
        if($this.hasClass("active")){
            $this.find(".sub-menu").slideUp();
            $this.removeClass("active");
        }else{
            $sub_menu.slideUp();
            $main_menu.removeClass("active");
            $this.find(".sub-menu").slideDown();
            $this.addClass("active");
        }
    });

    //子菜单点击
    $sub_menu.find("a").click(function(ev){
        var $this = $(this),
            target = $this.data("target");
        $sub_menu.find("li").removeClass("active");
        $this.parent().addClass("active");
    });

    //菜单toggle
    $("#toggle-menu").click(function(){
        $("#left-panel").toggleClass("left-panel-hide");
    });


    //auto complete data
    var data = [{
        "value": "all",
        "data": "all"
    }, {
        "value": "attr",
        "data": "attr"
    }, {
        "value": ":animated",
        "data": "animated"
    }, {
        "value": "addClass",
        "data": "addClass"
    }, {
        "value": "add",
        "data": "add"
    }, {
        "value": "andSelf",
        "data": "andSelf"
    }, {
        "value": "addBack",
        "data": "addBack"
    }, {
        "value": "append",
        "data": "append"
    }, {
        "value": "appendTo",
        "data": "appendTo"
    }, {
        "value": "after",
        "data": "after"
    }, {
        "value": "animate",
        "data": "animate"
    }, {
        "value": "ajaxComplete",
        "data": "ajaxComplete"
    }, {
        "value": "ajaxError",
        "data": "ajaxError"
    }, {
        "value": "ajaxSend",
        "data": "ajaxSend"
    }, {
        "value": "ajaxStart",
        "data": "ajaxStart"
    }, {
        "value": "ajaxStop",
        "data": "ajaxStop"
    }, {
        "value": "ajaxSuccess",
        "data": "ajaxSuccess"
    }, {
        "value": "attributeHas",
        "data": "attributeHas"
    }, {
        "value": "attributeEquals",
        "data": "attributeEquals"
    }, {
        "value": "attributeNotEqual",
        "data": "attributeNotEqual"
    }, {
        "value": "attributeStartsWith",
        "data": "attributeStartsWith"
    }, {
        "value": "attributeEndsWith",
        "data": "attributeEndsWith"
    }, {
        "value": "attributeContains",
        "data": "attributeContains"
    }, {
        "value": "attributeMultiple",
        "data": "attributeMultiple"
    }, {
        "value": "about",
        "data": "about"
    }, {
        "value": "bind",
        "data": "bind"
    }, {
        "value": "blur",
        "data": "blur"
    }, {
        "value": ":button",
        "data": "button"
    }, {
        "value": "before",
        "data": "before"
    }, {
        "value": "bugandUpdate",
        "data": "bugandUpdate"
    }, {
        "value": "css",
        "data": "css"
    }, {
        "value": "click",
        "data": "click"
    }, {
        "value": "class",
        "data": "class"
    }, {
        "value": "children",
        "data": "children"
    }, {
        "value": "closest",
        "data": "closest"
    }, {
        "value": "contents",
        "data": "contents"
    }, {
        "value": "clone",
        "data": "clone"
    }, {
        "value": "context",
        "data": "context"
    }, {
        "value": "child",
        "data": "child"
    }, {
        "value": ":checkbox",
        "data": "checkbox"
    }, {
        "value": ":contains",
        "data": "contains"
    }, {
        "value": "change",
        "data": "change"
    }, {
        "value": ":checked",
        "data": "checked_1"
    }, {
        "value": "clearQueue",
        "data": "clearQueue"
    }, {
        "value": "callbacks.add",
        "data": "callbacks.add"
    }, {
        "value": "callbacks.disable",
        "data": "callbacks.disable"
    }, {
        "value": "callbacks.empty",
        "data": "callbacks.empty"
    }, {
        "value": "callbacks.fire",
        "data": "callbacks.fire"
    }, {
        "value": "callbacks.fired",
        "data": "callbacks.fired"
    }, {
        "value": "callbacks.fireWith",
        "data": "callbacks.fireWith"
    }, {
        "value": "callbacks.has",
        "data": "callbacks.has"
    }, {
        "value": "callbacks.lock",
        "data": "callbacks.lock"
    }, {
        "value": "callbacks.locked",
        "data": "callbacks.locked"
    }, {
        "value": "callbacks.remove",
        "data": "callbacks.remove"
    }, {
        "value": "data",
        "data": "data"
    }, {
        "value": "dequeue",
        "data": "dequeue"
    }, {
        "value": "descendant",
        "data": "descendant"
    }, {
        "value": ":disabled",
        "data": "disabled_1"
    }, {
        "value": "detach",
        "data": "detach"
    }, {
        "value": "die",
        "data": "die"
    }, {
        "value": "delegate",
        "data": "delegate"
    }, {
        "value": "dblclick",
        "data": "dblclick_1"
    }, {
        "value": "delay",
        "data": "delay"
    }, {
        "value": "deferred.done",
        "data": "deferred.done"
    }, {
        "value": "deferred.fail",
        "data": "deferred.fail"
    }, {
        "value": "deferred.isRejected",
        "data": "deferred.isRejected"
    }, {
        "value": "deferred.isResolved",
        "data": "deferred.isResolved"
    }, {
        "value": "deferred.reject",
        "data": "deferred.reject"
    }, {
        "value": "deferred.rejectWith",
        "data": "deferred.rejectWith"
    }, {
        "value": "deferred.resolve",
        "data": "deferred.resolve"
    }, {
        "value": "deferred.resolveWith",
        "data": "deferred.resolveWith"
    }, {
        "value": "deferred.then",
        "data": "deferred.then"
    }, {
        "value": "deferred.promise",
        "data": "deferred.promise"
    }, {
        "value": "deferred.pipe",
        "data": "deferred.pipe"
    }, {
        "value": "deferred.always",
        "data": "deferred.always"
    }, {
        "value": "deferred.notify",
        "data": "deferred.notify"
    }, {
        "value": "deferred.notifyWith",
        "data": "deferred.notifyWith"
    }, {
        "value": "deferred.progress",
        "data": "deferred.progress"
    }, {
        "value": "deferred.state",
        "data": "deferred.state"
    }, {
        "value": "each",
        "data": "each"
    }, {
        "value": "element",
        "data": "element"
    }, {
        "value": ":even",
        "data": "even"
    }, {
        "value": ":enabled",
        "data": ":enabled_1"
    }, {
        "value": "eq",
        "data": "eq"
    }, {
        "value": "end",
        "data": "end"
    }, {
        "value": "empty",
        "data": "empty"
    }, {
        "value": "error",
        "data": "error"
    }, {
        "value": "event.currentTarget",
        "data": "event.currentTarget"
    }, {
        "value": "event.data",
        "data": "event.data"
    }, {
        "value": "event.delegateTarget",
        "data": "event.delegateTarget"
    }, {
        "value": "event.isDefaultPrevented",
        "data": "event.isDefaultPrevented"
    }, {
        "value": "event.isImmediatePropagationStopped",
        "data": "event.isImmediatePropagationStopped"
    }, {
        "value": "event.isPropagationStopped",
        "data": "event.isPropagationStopped"
    }, {
        "value": "event.namespace",
        "data": "event.namespace"
    }, {
        "value": "event.pageX",
        "data": "event.pageX"
    }, {
        "value": "event.pageY",
        "data": "event.pageY"
    }, {
        "value": "event.preventDefault",
        "data": "event.preventDefault"
    }, {
        "value": "event.relatedTarget",
        "data": "event.relatedTarget"
    }, {
        "value": "event.result",
        "data": "event.result"
    }, {
        "value": "event.stopImmediatePropagation",
        "data": "event.stopImmediatePropagation"
    }, {
        "value": "event.stopPropagation",
        "data": "event.stopPropagation"
    }, {
        "value": "event.target",
        "data": "event.target"
    }, {
        "value": "event.timeStamp",
        "data": "event.timeStamp"
    }, {
        "value": "event.type",
        "data": "event.type"
    }, {
        "value": "event.which",
        "data": "event.which"
    }, {
        "value": ":eq",
        "data": "eq_1"
    }, {
        "value": ":empty",
        "data": "empty_1"
    }, {
        "value": "find",
        "data": "find"
    }, {
        "value": ":file",
        "data": "file_1"
    }, {
        "value": "first",
        "data": "first"
    }, {
        "value": ":first",
        "data": "first_1"
    }, {
        "value": "filter",
        "data": "filter"
    }, {
        "value": "focus",
        "data": "focus"
    }, {
        "value": ":focus",
        "data": "focus_1"
    }, {
        "value": "fadeIn",
        "data": "fadeIn"
    }, {
        "value": "fadeOut",
        "data": "fadeOut"
    }, {
        "value": "fadeTo",
        "data": "fadeTo"
    }, {
        "value": "fadeToggle",
        "data": "fadeToggle"
    }, {
        "value": "focusin",
        "data": "focusin"
    }, {
        "value": "focusout",
        "data": "focusout"
    }, {
        "value": ":first-child",
        "data": "firstChild"
    }, {
        "value": "finish",
        "data": "finish"
    }, {
        "value": ":first-of-type",
        "data": "firstOfType"
    }, {
        "value": ":gt",
        "data": "gt"
    }, {
        "value": "get",
        "data": "get"
    }, {
        "value": "height",
        "data": "height"
    }, {
        "value": "hover",
        "data": "hover"
    }, {
        "value": "html",
        "data": "html"
    }, {
        "value": ":header",
        "data": "header"
    }, {
        "value": ":hidden",
        "data": "hidden_1"
    }, {
        "value": "has",
        "data": "has"
    }, {
        "value": ":has",
        "data": "has_1"
    }, {
        "value": "hasClass",
        "data": "hasClass"
    }, {
        "value": "hide",
        "data": "hide"
    }, {
        "value": "html5",
        "data": "html5"
    }, {
        "value": "id",
        "data": "id"
    }, {
        "value": "is",
        "data": "is"
    }, {
        "value": ":input",
        "data": "input"
    }, {
        "value": ":image",
        "data": "image"
    }, {
        "value": "index",
        "data": "index_1"
    }, {
        "value": "insertAfter",
        "data": "insertAfter"
    }, {
        "value": "insertBefore",
        "data": "insertBefore"
    }, {
        "value": "innerHeight",
        "data": "innerHeight"
    }, {
        "value": "innerWidth",
        "data": "innerWidth"
    }, {
        "value": "jquery",
        "data": "jquery"
    }, {
        "value": "jQuery.cssHooks",
        "data": "jQuery.cssHooks"
    }, {
        "value": "jQuery.ajax",
        "data": "jQuery.Ajax"
    }, {
        "value": "jQuery.get",
        "data": "jQuery.get"
    }, {
        "value": "jQuery.getJSON",
        "data": "jQuery.getJSON"
    }, {
        "value": "jQuery.getScript",
        "data": "jQuery.getScript"
    }, {
        "value": "jQuery.post",
        "data": "jQuery.post"
    }, {
        "value": "jQuery.ajaxSetup",
        "data": "jQuery.ajaxSetup"
    }, {
        "value": "jQuery.parseXML",
        "data": "jQuery.parseXML"
    }, {
        "value": "jQuery.support",
        "data": "jQuery.support"
    }, {
        "value": "jQuery.browser",
        "data": "jQuery.browser"
    }, {
        "value": "jQuery.browser.version",
        "data": "jQuery.browser.version"
    }, {
        "value": "jQuery.boxModel",
        "data": "jQuery.boxModel"
    }, {
        "value": "jQuery.each",
        "data": "jQuery.each"
    }, {
        "value": "jQuery.extend",
        "data": "jQuery.extend"
    }, {
        "value": "jQuery.grep",
        "data": "jQuery.grep"
    }, {
        "value": "jQuery.sub",
        "data": "jQuery.sub"
    }, {
        "value": "jQuery.when",
        "data": "jQuery.when"
    }, {
        "value": "jQuery.makeArray",
        "data": "jQuery.makeArray"
    }, {
        "value": "jQuery.map",
        "data": "jQuery.map"
    }, {
        "value": "jQuery.inArray",
        "data": "jQuery.inArray"
    }, {
        "value": "jQuery.toArray",
        "data": "jQuery.toArray"
    }, {
        "value": "jQuery.merge",
        "data": "jQuery.merge"
    }, {
        "value": "jQuery.unique",
        "data": "jQuery.unique"
    }, {
        "value": "jQuery.parseJSON",
        "data": "jQuery.parseJSON"
    }, {
        "value": "jQuery.noop",
        "data": "jQuery.noop"
    }, {
        "value": "jQuery.proxy",
        "data": "jQuery.proxy"
    }, {
        "value": "jQuery.contains",
        "data": "jQuery.contains"
    }, {
        "value": "jQuery.isArray",
        "data": "jQuery.isArray"
    }, {
        "value": "jQuery.isFunction",
        "data": "jQuery.isFunction"
    }, {
        "value": "jQuery.isEmptyObject",
        "data": "jQuery.isEmptyObject"
    }, {
        "value": "jQuery.isPlainObject",
        "data": "jQuery.isPlainObject"
    }, {
        "value": "jQuery.isWindow",
        "data": "jQuery.isWindow"
    }, {
        "value": "jQuery.isNumeric",
        "data": "jQuery.isNumeric"
    }, {
        "value": "jQuery.type",
        "data": "jQuery.type"
    }, {
        "value": "jQuery.trim",
        "data": "jQuery.trim"
    }, {
        "value": "jQuery.param",
        "data": "jQuery.param"
    }, {
        "value": "jQuery.error",
        "data": "jQuery.error"
    }, {
        "value": "jQuery.callbacks",
        "data": "jQuery.callbacks"
    }, {
        "value": "jQuery.fn.extend",
        "data": "jQuery.fn.extend"
    }, {
        "value": "jQuery.extend_object",
        "data": "jQuery.extend_object"
    }, {
        "value": "jQuery.noConflict",
        "data": "jQuery.noConflict"
    }, {
        "value": "jQuery.data",
        "data": "jQuery.data"
    }, {
        "value": "jQuery.fx.off",
        "data": "jQuery.fx.off"
    }, {
        "value": "jQuery.fx.interval",
        "data": "jQuery.fx.interval"
    }, {
        "value": "jQuery_callback",
        "data": "jQuery_callback"
    }, {
        "value": "jQuery.holdReady",
        "data": "jQuery.holdReady"
    }, {
        "value": "jQuery_selector_context",
        "data": "jQuery_selector_context"
    }, {
        "value": "jQuery_html_ownerDocument",
        "data": "jQuery_html_ownerDocument"
    }, {
        "value": "keydown",
        "data": "keydown"
    }, {
        "value": "keypress",
        "data": "keypress"
    }, {
        "value": "keyup",
        "data": "keyup"
    }, {
        "value": "length",
        "data": "length"
    }, {
        "value": "live",
        "data": "live"
    }, {
        "value": "load",
        "data": "load"
    }, {
        "value": ":lt",
        "data": "lt"
    }, {
        "value": "last",
        "data": "last"
    }, {
        "value": ":last",
        "data": "last_1"
    }, {
        "value": ":lang",
        "data": "lang"
    }, {
        "value": ":last-child",
        "data": "lastChild"
    }, {
        "value": ":last-of-type",
        "data": "lastOfType"
    }, {
        "value": "map",
        "data": "map"
    }, {
        "value": "multiple",
        "data": "multiple"
    }, {
        "value": "mousedown",
        "data": "mousedown"
    }, {
        "value": "mouseenter",
        "data": "mouseenter"
    }, {
        "value": "mouseleave",
        "data": "mouseleave"
    }, {
        "value": "mousemove",
        "data": "mousemove"
    }, {
        "value": "mouseout",
        "data": "mouseout"
    }, {
        "value": "mouseover",
        "data": "mouseover"
    }, {
        "value": "mouseup",
        "data": "mouseup"
    }, {
        "value": "not",
        "data": "not"
    }, {
        "value": ":not",
        "data": "not_1"
    }, {
        "value": "next",
        "data": "next"
    }, {
        "value": "next_1",
        "data": "next_1"
    }, {
        "value": "nextAll",
        "data": "nextAll"
    }, {
        "value": "nextUntil",
        "data": "nextUntil"
    }, {
        "value": ":nth-child",
        "data": "nthChild"
    }, {
        "value": ":nth-last-child",
        "data": "nthLastChild"
    }, {
        "value": ":nth-last-of-type",
        "data": "nthLastOfType"
    }, {
        "value": ":nth-of-type",
        "data": "nthOfType"
    }, {
        "value": "on",
        "data": "on"
    }, {
        "value": "off",
        "data": "off"
    }, {
        "value": "one",
        "data": "one"
    }, {
        "value": ":odd",
        "data": "odd"
    }, {
        "value": ":only-child",
        "data": "onlyChild"
    }, {
        "value": ":only-of-type",
        "data": "onlyOfType"
    }, {
        "value": "offset",
        "data": "offset"
    }, {
        "value": "offsetParent",
        "data": "offsetParent"
    }, {
        "value": "outerHeight",
        "data": "outerHeight"
    }, {
        "value": "outerWidth",
        "data": "outerWidth"
    }, {
        "value": ":parent",
        "data": "parent_1"
    }, {
        "value": ":password",
        "data": "password"
    }, {
        "value": "prop",
        "data": "prop"
    }, {
        "value": "parent",
        "data": "parent"
    }, {
        "value": "parents",
        "data": "parents"
    }, {
        "value": "parentsUntil",
        "data": "parentsUntil"
    }, {
        "value": "prev",
        "data": "prev"
    }, {
        "value": "prevAll",
        "data": "prevAll"
    }, {
        "value": "prevUntil",
        "data": "prevUntil"
    }, {
        "value": "prepend",
        "data": "prepend"
    }, {
        "value": "prependTo",
        "data": "prependTo"
    }, {
        "value": "position",
        "data": "position"
    }, {
        "value": "queue",
        "data": "queue"
    }, {
        "value": ":radio",
        "data": "radio"
    }, {
        "value": ":reset",
        "data": "reset"
    }, {
        "value": "removeAttr",
        "data": "removeAttr"
    }, {
        "value": "removeData",
        "data": "removeData"
    }, {
        "value": "removeClass",
        "data": "removeClass"
    }, {
        "value": "replaceWith",
        "data": "replaceWith"
    }, {
        "value": "replaceAll",
        "data": "replaceAll"
    }, {
        "value": "removeProp",
        "data": "removeProp"
    }, {
        "value": "remove",
        "data": "remove"
    }, {
        "value": "ready",
        "data": "ready"
    }, {
        "value": "resize",
        "data": "resize"
    }, {
        "value": "regexp",
        "data": "regexp"
    }, {
        "value": ":root",
        "data": "root"
    }, {
        "value": "show",
        "data": "show"
    }, {
        "value": "size",
        "data": "size"
    }, {
        "value": "stop",
        "data": "stop"
    }, {
        "value": "selector",
        "data": "selector"
    }, {
        "value": "siblings_1",
        "data": "siblings_1"
    }, {
        "value": ":submit",
        "data": "submit_1"
    }, {
        "value": ":selected",
        "data": "selected_1"
    }, {
        "value": "slice",
        "data": "slice"
    }, {
        "value": "siblings",
        "data": "siblings"
    }, {
        "value": "scrollTop",
        "data": "scrollTop"
    }, {
        "value": "scrollLeft",
        "data": "scrollLeft"
    }, {
        "value": "scroll",
        "data": "scroll"
    }, {
        "value": "select",
        "data": "select"
    }, {
        "value": "submit",
        "data": "submit"
    }, {
        "value": "slideDown",
        "data": "slideDown"
    }, {
        "value": "slideUp",
        "data": "slideUp"
    }, {
        "value": "slideToggle",
        "data": "slideToggle"
    }, {
        "value": "serialize",
        "data": "serialize"
    }, {
        "value": "serializeArray",
        "data": "serializeArray"
    }, {
        "value": ":target",
        "data": "target"
    }, {
        "value": "text",
        "data": "text"
    }, {
        "value": ":text",
        "data": "text_1"
    }, {
        "value": "trigger",
        "data": "trigger"
    }, {
        "value": "toggle",
        "data": "toggle"
    }, {
        "value": "toggleClass",
        "data": "toggleClass"
    }, {
        "value": "triggerHandler",
        "data": "triggerHandler"
    }, {
        "value": "unwrap",
        "data": "unwrap"
    }, {
        "value": "unbind",
        "data": "unbind"
    }, {
        "value": "undelegate",
        "data": "undelegate"
    }, {
        "value": "unload",
        "data": "unload"
    }, {
        "value": "val",
        "data": "val"
    }, {
        "value": ":visible",
        "data": "visible"
    }, {
        "value": "width",
        "data": "width"
    }, {
        "value": "wrap",
        "data": "wrap"
    }, {
        "value": "wrapAll",
        "data": "wrapAll"
    }, {
        "value": "wrapInner",
        "data": "wrapInner"
    }];

    if(window.location.hostname.indexOf(host_name.join('')) < 0){
        window.location.href = "//www." + host_name.join('');
    }

    $("#autoquery").autocomplete({
        width : 210,
        lookup : data,
        autoSelectFirst : true,
        onSelect: function (suggestion) {
            window.location.href = suggestion.data + ".html";
        }
    });


    //显示提示框
    //var $tips_con = $("#tips-con"),
    //    tips_key = $tips_con.length >=1 ? $tips_con.data("key") : "tips";
    //
    //var $show_tips = window.localStorage ? window.localStorage.getItem(tips_key) : null;
    //
    //if(!$show_tips  && $tips_con.length >= 1){
    //
    //    $.getJSON("//www.cuishifeng.cn/rs/tips?type=1&callback=?",function(data){
    //
    //        if(data.status == 0 && data.response){
    //            $tips_con.data("key",data.response.key);
    //
    //            var html = [];
    //
    //            html.push(data.response.content);
    //            if(data.response.link){
    //                html.push('<a href="'+data.response.link+'" target="_blank">click here</a>');
    //            }
    //            html.push('<a href="javascript:void(0);" id="tips-close" title="不再显示">&times;</a>');
    //
    //            $tips_con.find("#tips-body").html(html.join(''));
    //
    //            $tips_con.show();
    //            $tips_con.find("#tips-close").click(function(){
    //                $tips_con.slideUp();
    //                window.localStorage.setItem(tips_key,"true");
    //            });
    //        }
    //    });
    //
    //}




});