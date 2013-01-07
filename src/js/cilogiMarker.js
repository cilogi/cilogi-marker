/* Copyright (c) 2012 Tim Niblett All Rights Reserved.

 File:        cilogiMarker.java  (19-Nov-2012)
 Author:      tim

 Copyright in the whole and every part of this source file belongs to
 Tim Niblett (the Author) and may not be used, sold, licenced, transferred,
 copied or reproduced in whole or in part in any manner or form or in
 or on any media to any person other than in accordance with the terms of
 The Author's agreement or otherwise without the prior written consent of
 The Author.
*/

(function(cilogiBase, cilogiPopup, cilogiBubbleIcon, log) {
    var pointerDown = L.Browser.touch ? 'touchstart' : 'mousedown',
        pointerUp   = L.Browser.touch ? 'touchend'   : 'mouseup',
        pointerOut  = L.Browser.touch ? 'touchcancel' : 'mouseout';

        function tmpOpacity(ms, elem, startOpacity, stopOpacity) {
            var interval = 25,
                msDone = 0,
                id = setInterval(frame, interval),
                currentOpacity = startOpacity,
                spans = elem.getElementsByTagName('span'),
                init = true;;

            // hack, but android can't cope with the gradient and opacity
            function setSpans(val) {
                if (L.Browser.android23) {
                    for (var i = 0; i < spans.length; i++) {
                        spans[i].style.visibility = val;
                    }
                }
            }

            function frame() {
                L.DomUtil.setOpacity(elem, currentOpacity);
                if (init) {
                    setSpans("hidden");
                    init = false;
                }
                msDone += interval;  // update parameters
                currentOpacity = startOpacity + (stopOpacity - startOpacity) * msDone/ms;
                if (msDone >= ms) { // check finish condition
                    clearInterval(id);
                    L.DomUtil.setOpacity(elem, stopOpacity);
                    setSpans("visible");
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
            tmpOpacity(this.options.fadeTime || 1000, this._icon, 0.3, 1.0);
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