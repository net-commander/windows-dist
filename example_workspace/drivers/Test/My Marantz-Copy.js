define([
    "dcl/dcl"
], function (dcl) {
    return dcl(null, {
        updatePower: function (value) {
            
            value = value || this.getVariable('value');
            var out = 0;
            if (value.indexOf('@PWR:') != -1) {
                var _pw = value.split(':')[1];
                if (!isNaN(_pw)) {
                    this.setVariable('PowerState', _pw == 2 ? 'on' : 'off');
                    out = _pw;
                }
            }
            return out;
        },
        updateSource: function (value) {
            value = value || this.getVariable('value');
            if (value.startsWith('SI') && value.indexOf("@") ==-1 && value.length>2) {
                var _source = value.substring(2, value.length);
                this.setVariable('Source', _source);
            }
        },
        updateVolume: function (value) {
            value = value || this.getVariable('value');
            var out = 0;
            if (value.indexOf('MV') != -1 && value.indexOf('MVMAX') == -1) {
                var _volume = value.substring(2, value.length);
                _volume = parseInt(_volume.substring(0, 2));
                if (!isNaN(_volume)) {
                    this.setVariable('Volume', _volume);
                    out = _volume;
                } else {
                    return null;
                }
            } else {
                return null;
            }
            return out;
        },
        testx: function (arg) {
            console.log('testx');
            return "mv?";
        },
        testCall: function (test) {
            var value = this.callCommand('PowerOn');
        },
        onMessage: function (data) {
            var message = data.message;
            this.updateVolume(message);
            this.updatePower(message);
            this.updateSource(message);
            
            if (data.message.indexOf('MVMAX') != -1) {
                return;
            }
            /*
             this.log('warn', 'Marantz', message + ' PowerState: ' + this.getVariable('PowerState'), {
             some: 'extra',
             message: data
             });
             */
        },
        onDriverVariableChanged:function(evt){
          
          //grab the variable
          var variable = evt.item;
          
          //grab the xblox scope
          var blockScope = variable.scope;
          
          //abort if is not ours, we also receive here variable changes from other devices
          // notice:  we use != instead of !== 
          //          this is because we compare 2 object pointers and not two primitive's values
          if(blockScope != this.blockScope){
            return;
          }
          
          //Example: make some special effort for variable "Volume"
          if(variable.name ==="Volume"){
            //console.info("Volume changed : " + variable.value);
          }
          
          
          //Example: abort if it is not a certain variable
          if(variable.name !=="value"){
            //console.warn("skip variable " + variable.name);
            return;
          }
          
          //Example: print something in console
          //console.log('onDriverVariableChanged '  + variable.name + ' new value:' + variable.value);
          
          
          //Example: do something with the variable
          var value = "" + variable.value; //important, build a new string
          value++;
          
          //Example: call a command 
          if(value ==='whatever'){
            this.callCommand("Command Name");
          }
          
          //Example: store it in another variable
          if(value ==='whatever'){
            this.setVariable("the other variable's name ",value);
          }
          

        },
        /**
         * This function is called as soon the device is connected
         */
        start:function(){
          
          //some debugging message
          //console.log('started Marantz',this);
          
          //Example:  we subscribe on variable changes, globally
          this.subscribe("onDriverVariableChanged");
          
          //Example, specify the event handler explizit
          //this.subscribe("onDriverVariableChanged",this.onDriverVariableChanged);
          
        }
    });
});