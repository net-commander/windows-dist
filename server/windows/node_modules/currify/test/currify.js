(function() {
    'use strict';
    
    let currify = require('../src/currify'),
        test    = require('tape');
    
    test('should call function', t => {
        let fn = () => 'done';
        let result = currify(fn);
        
        t.equal(result, 'done', 'shold return result');
        t.end();
    });
    
    test('call returned function', t => {
        let sum = (a, b, c) => a + b + c;
        
        let inc  = currify(sum, 1);
        let inc2 = inc(1);
        let inc3 = inc2(1);
        
        t.equal(typeof inc2, 'function', 'shold return function');
        t.equal(inc3, 3, 'shold return result');
        
        t.end();
    });
    
    test('no arguments', t => {
        t.throws(currify, /fn should be function!/, 'should throw when no fn');
        t.end();
    });
    
    test('arguments: wrong type', t => {
        let fn  = () => currify(1);
       
        t.throws(fn, /fn should be function/, 'shoud throw when wrong type');
        t.end();
    });
})();
