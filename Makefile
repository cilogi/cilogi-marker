DIST = dist
JS_ROOT = src/js
CSS_ROOT = src/css

JS_FILES =  ${JS_ROOT}/cilogiBase.js  ${JS_ROOT}/cilogiAdjust.js ${JS_ROOT}/cilogiBubbleIcon.js ${JS_ROOT}/cilogiMarker.js

build: concat
	uglifyjs -nc ${DIST}/cilogi-marker.js > ${DIST}/cilogi-marker.min.js

concat:  FRC
	cat ${JS_FILES} > ${DIST}/cilogi-marker.js
	cat ${CSS_ROOT}/cilogi-marker.css > ${DIST}/cilogi-marker.css

FRC: