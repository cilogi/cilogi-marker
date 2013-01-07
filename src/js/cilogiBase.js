
var cilogi = cilogi || {};

cilogi.L = cilogi.L || {};

cilogi.fn = cilogi.fn || {};

(function() {
    if (typeof cilogi.log == 'undefined') {
        cilogi.log = function() {
            if((typeof console !== 'undefined')) {
                console.log(Array.prototype.slice.call(arguments));
            }
        }
    }
})();