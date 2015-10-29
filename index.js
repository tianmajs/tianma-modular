'use strict';

var fs = require('fs');
var libm = require('libm');
var path = require('path');

/**
 * Filter factory.
 * @param config {string|Object}
 * @return {Function}
 */
module.exports = function (config) {
    config = config || {};

	if (typeof config === 'string') {
		config = {
			root: config
		};
	}

	config.root = path.resolve(config.root || './');

	var compile;

	return function *(next) {
		var req = this.request,
			res = this.response,
            type;

		compile = compile || libm({
			root: config.root,
			base: (req.base || '/').substring(1),
			scope: config.scope || '',
			moduledir: config.moduledir || 'node_modules'
		});

		yield next;

		if (type = res.is('js', 'css')) { // Assign.
            res.data(yield compile.bind(null,
                '.' + type, req.pathname.substring(1), String(res.data())));
        }
	};
};
