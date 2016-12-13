(function() {
    'use strict';
    
    let squad    = require('..'),
        test    = require('tape');
    
    let buzz    = str => str + '... zzz...';
    let scream  = str => str.toUpperCase();
    let join    = (str1, str2) => str1 + str2;
    
    test('compose functions f(g(x)', t => {
        let noise = squad(buzz, scream);
        
        t.equal(noise('hello'), 'HELLO... zzz...');
        t.end();
    });
    
    test('compose functions g(f(x)', t => {
        let noise = squad(scream, buzz);
        
        t.equal(noise('hello'), 'HELLO... ZZZ...');
        t.end();
    });
    
    test('compose functions f(g(a, b)', t => {
        let noise = squad(scream, buzz, join);
        
        t.equal(noise('hello', ' world'), 'HELLO WORLD... ZZZ...');
        t.end();
    });
    
    test('no arguments', t => {
        t.throws(squad, /fn should be function!/, 'should throw when no fn');
        t.end();
    });
    
    test('arguments: wrong type', t => {
        let fn  = () => squad(1);
       
        t.throws(fn, /fn should be function!/, 'should throw when not function');
        t.end();
    });
})();
