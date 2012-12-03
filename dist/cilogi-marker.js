
var cilogi = cilogi || {};

cilogi.L = cilogi.L || {};

cilogi.fn = cilogi.fn || {};

(function() {
    if (typeof cilogi.log == 'undefined') {
        cilogi.log = function() {
            if((typeof console !== 'undefined')) {
                console.log(Array.prototype.slice.call(arguments, 0));
            }
        }
    }
})();
//
// This table allows the vertical alignment of characters to be adjusted if required.
// The number associated with each glyph is the line-height of the containing element.
// Adjusting the line height alters the vertical orientation.
//
(function(cilogiBase) {
    cilogiBase.lineAdjust = {
        iconic: {
            '\ue025' : 1.67
        },
        awesome: {

        }
    }
})(cilogi.L);

(function(cilogiBase) {

    // Amount to darken the bubble background at the bottom, compared to top
    var DARKEN_FRACTION = 0.6;

    function shadeColor(color, percent) {
        function pc(val) {
            return parseInt(val * (100 + percent)/100);
        }
        function toHex(val) {
            var s = val.toString(16);
            return (s.length==1) ? "0"+ s : s;
        }
        function clip(val) {
            return (val < 255) ? val : 255;
        }
        var r = clip(pc(parseInt(color.substring(1,3),16))),
            g = clip(pc(parseInt(color.substring(3,5),16))),
            b = clip(pc(parseInt(color.substring(5,7),16)));
        return "#"+toHex(r)+toHex(g)+toHex(b);
    }


    // fix gradient for
    function gradient(element, color) {
        var darker = shadeColor(color, -40),
            css =  "background: " + color  + ";" +
            "background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from("+color+"), to("+darker+"));" +
            "background-image: -moz-linear-gradient(top, "+color+", "+darker+");" +
            "background-image: -o-linear-gradient("+color+", "+darker+");" +
            "background-image: -ms-linear-gradient("+color+", "+darker+");" +
            "background-image: linear-gradient(to bottom, "+color+", "+darker+");" +
            "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='"+color+"', endColorstr='"+darker+"');";
        element.style.cssText = css;
    }

    // The default icon is a map pin, which has a different index in different fonts.
    function defaultIcon(fontName) {
        switch (fontName) {
            case "iconic":
                return '\ue002'
            case "awesome":
                return '\uf041';
            default:
                return fontName + ' NOT FOUND';
        }
    }

    function adjustLineHeight(element, fontName, character) {
        var height = cilogi.L.lineAdjust[fontName][character];
        if (height) {
            element.style.lineHeight = height;
        }
    }

    function createCharIcon (anchor, fontIconSize, fontIconFont, fontIconName, fontIconColor) {
        var div = document.createElement('div');
        this._setIconStyles(div, 'icon');
        div.style.position = "absolute";

        var left = (-anchor.x) + 'em';
        var top =  (-anchor.y) + 'em';
        var factor = (fontIconName == defaultIcon(fontIconFont)) ? 3 : 1;
        //console.log("left " + left + " top " + top);
        div.style.left = left;
        div.style.top  = top;
        div.style.margin = "0";
        div.style.fontSize  = Math.round(fontIconSize * factor * 100) + "%";
        div.style.color = fontIconColor;
        div.className = fontIconFont;
        div.innerHTML = '<span>'+fontIconName+'</span>';
        this._div = div;
        return div;
    }

    cilogiBase.BubbleIcon = L.Icon.extend({ options: {
            fontIconFont : 'iconic',
            fontIconColor: 'blue',
            altThresh: 0.5,
            fontIconSize: 1.0,
            computeClass: function() {
                //return "bubble " + this.fontIconFont + " " + this.fontIconName + " white";
                return "bubble " + this.fontIconFont + " white";
            },
            anchor: new L.Point(1, 2.5)
        },
        initialize: function () {
            L.Icon.prototype.initialize.apply(this, arguments);
            this.options.fontIconName = this.options.fontIconName || defaultIcon(this.options.fontIconFont);
            this.options.altIconName = this.options.altIconName || defaultIcon(this.options.fontIconFont);
        },
        computeAnchor : function(size) {
            return this.isAlt(size) ? new L.Point(0.25, 1) : new L.Point(1, 2.5);
        },
        isAlt: function(size) {
            return (size <= this.options.altThresh)
                || (this.options.fontIconName == this.options.altIconName);
        },
        createIcon: function () {
            if (this.isAlt(this.options.fontIconSize)) {
                this._alt = true;
                var anchor = this.computeAnchor(this.options.fontIconSize);
                return createCharIcon.call(this, anchor,
                    this.options.fontIconSize, this.options.fontIconFont,
                    this.options.altIconName, this.options.fontIconColor);
            }  else {
                this._alt = false;
                return this.createBubbleIcon();
            }
        },
        createBubbleIcon: function() {
            var anchor = this.computeAnchor(this.options.size);
            var div = document.createElement('div');
            this._setIconStyles(div, 'icon');

            div.className="triangle-isosceles";// ti-" + this.options.fontIconColor;
            gradient(div, this.options.fontIconColor);

            var after = document.createElement('div');
            after.className = "triangle-isosceles-after";
            div.appendChild(after);
            after.style.borderTopColor = shadeColor(this.options.fontIconColor, -40);
            
            var subDiv = document.createElement('div');
            subDiv.className = this.options.computeClass();

            div.appendChild(subDiv);

            var span = document.createElement("span");
            span.className = "shine";
            span.innerHTML = this.options.fontIconName;
            subDiv.appendChild(span);
            adjustLineHeight(subDiv, this.options.fontIconFont, this.options.fontIconName);

			div.style.marginLeft = (-anchor.x) + 'em';
			div.style.marginTop  = (-anchor.y) + 'em';
			div.style.fontSize = Math.round(this.options.fontIconSize * 100) + "%";
            this._div = div;
            return div;

        },
        createShadow: function () {
            return null;
        },
        setFontSize: function(size) {
            this.options.fontIconSize = size;
            this.options.anchor = this.computeAnchor(size); // belt and braces
        }
    });

})(cilogi.L);

// Copyright (c) 2012 Tim Niblett All Rights Reserved.
//
// File:        cilogiMarker.java  (19-Nov-2012)
// Author:      tim
//
// Copyright in the whole and every part of this source file belongs to
// Tim Niblett (the Author) and may not be used, sold, licenced, transferred, 
// copied or reproduced in whole or in part in any manner or form or in 
// or on any media to any person other than in accordance with the terms of 
// The Author's agreement or otherwise without the prior written consent of
// The Author.
//

(function(cilogiBase, cilogiPopup, cilogiBubbleIcon, log) {
    var pointerDown = L.Browser.touch ? 'touchstart' : 'mousedown',
        pointerUp   = L.Browser.touch ? 'touchend'   : 'mouseup',
        pointerOut  = L.Browser.touch ? 'touchcancel' : 'mouseout';

        function tmpOpacity(elem, startOpacity, stopOpacity) {
            var ms = 2000,
                interval = 100,
                msLeft = ms,
                id = setInterval(frame, interval),
                currentOpacity = startOpacity;

            function frame() {
                L.DomUtil.setOpacity(elem, currentOpacity);
                msLeft -= interval;  // update parameters
                currentOpacity = 1 - (stopOpacity - startOpacity) * msLeft/ms;
                if (msLeft <= 0) { // check finish condition
                    clearInterval(id);
                    L.DomUtil.setOpacity(elem, stopOpacity);
                }
            }
        }

    function computeSizeFromZoom(map, table) {
        var max = map.getMaxZoom(),
            zoom = map.getZoom(),
            diff = max - zoom;
        return  (diff < table.length) ? table[diff] : table[table.length-1];
    }

    cilogiBase.Marker = L.Marker.extend({
        options: {
            fontIconSize: 1.5,
            id: -1,
            sizeTable: [2, 1, 0.5]
        },
        initialize: function (latlng, options) {
            L.Marker.prototype.initialize.call(this, latlng, options);
            var opt = L.Util.extend({}, {
                fontIconColor: 'blue',
                fontIconName : '\ue002',
                fontIconSize : 1.5
            }, options);
            
            this.options.icon =  new cilogiBubbleIcon(opt);
            this.on(pointerDown, function() { this._tmpOpacity(); }, this);
            this.isReadyPop = false;
        },
        
        _tmpOpacity : function() {
            tmpOpacity(this._icon, 0.3, 1.0);
        },
        setFeatureOptions : function(options) {
            var opt = L.Util.extend({}, this.options.icon.options, options);
            this.options.icon =  new cilogiBubbleIcon(options);
        },
        _initIcon : function() {
            L.Marker.prototype._initIcon.apply(this, arguments);
            L.DomUtil.addClass(this._icon, "cilogiMarker");

            // shouldn't need to do this, but leaflet doesn't seem to work with touch out of the
            // box.  This allows the fade on touch to work.
            if (L.Browser.touch) {
                var events = [pointerUp, pointerDown, pointerOut];
                for (var i = 0; i < events.length; i++) {
                    L.DomEvent.removeListener(this._icon, events[i], this._fireMouseEvent, this);
                    L.DomEvent.addListener(this._icon, events[i], this._fireMouseEvent, this);
                }
            }
        },
        selectIfId : function(id) {
            this.select(id === this.options.id);
        },
        select: function(bool) {
            this.setOpacity(bool ? 1 : 0.2);
            if (bool && this._map) {
                var zoom = this._map.getZoom();
                this._map.setView(this._latlng, zoom);
            }
        },
        setFontSize: function(val) {
            //log("set fontsize to " + val + " for " + this._leaflet_id);
            if (this._icon) {
                this._removeIcon();
            }
            this.options.icon.setFontSize(val);
            if (this._map && this._map._panes) {
                this._initIcon();
                this.update();
            }
            //this._reset();
            //console.log("done for " + this._leaflet_id);
        },

        _fireMouseEvent: function (e) {
            //log("fire: " + e.type);
            this.fire(e.type, {
                originalEvent: e
            });
            if (e.type !== 'mousedown' && e.type !== 'touchstart') {
                L.DomEvent.stopPropagation(e);
            }
         }
    });
})(cilogi.L, cilogi.L.Popup, cilogi.L.BubbleIcon, cilogi.log);