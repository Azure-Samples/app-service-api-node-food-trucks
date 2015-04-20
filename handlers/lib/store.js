'use strict';

var rests = require('./restaurants.json');
var jp = require('jsonpath')

module.exports = {
    get: function (id) {
        return jp.query(rests, '$..[?(@.id=='+id+')]');
    },
    all: function () {
        return rests;
    }
};
