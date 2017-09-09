define(function() {

    var BlockHelper = function() {};
    BlockHelper.prototype = {
        onAdded: function (target, src) {
            if(src.type==='xblox/RunScript'){
                return target;
            }else{
                return src;
            }
        }
    };
    return BlockHelper;
});