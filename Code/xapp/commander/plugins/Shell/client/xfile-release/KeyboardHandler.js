//>>built
define("Shell/KeyboardHandler",["dojo/_base/declare","dojo/keys","dojo/has"],function(c,b,e){return c("Shell.xfile.KeyboardDelegate",null,{ctlrKeyDown:!1,onKeyUp:function(a){switch(a.keyCode){case b.META:case b.SHIFT:case b.ALT:case b.CTRL:this.ctlrKeyDown=!1}},onKey:function(a){var c=this;if(a.type&&"keyup"==a.type)return this.onKeyUp(a);if(a.keyCode==b.ENTER)this.ctlrKeyDown?this.openItemAlternate&&(a.preventDefault(),this.openItemAlternate(null)):(this.onEnter(),a.preventDefault());else switch(a.keyCode){case b.UP_ARROW:this.onUp();
break;case b.DOWN_ARROW:this.onDown();break;case b.META:case b.ALT:case b.SHIFT:case b.CTRL:this.ctlrKeyDown=!0;setTimeout(function(){c.ctlrKeyDown=!1},2E3);break;case b.TAB:this.onTab&&(this.onTab(a),a.preventDefault());break;case b.BACKSPACE:var d=!0;e("chrome")&&0==this.ctlrKeyDown&&(d=!1);d&&this.onBack&&(a.preventDefault(),this.onBack());break;case 67:this.ctlrKeyDown&&this.onClipBoardCopy&&(a.preventDefault(),this.onClipBoardCopy());break;case 86:this.ctlrKeyDown&&this.onClipBoardPaste&&(a.preventDefault(),
this.onClipBoardPaste());break;case 88:this.ctlrKeyDown&&this.onClipBoardCut&&(a.preventDefault(),this.onClipBoardCut())}}})});
//# sourceMappingURL=KeyboardHandler.js.map