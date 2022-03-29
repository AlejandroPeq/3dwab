/**
 * Copyright @ 2021 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["require","exports"],function(t,e){var i=function(){function t(e,i){this._gl=e,this._vaoExt=i,this._initialized=!1,this._id=t._nextId++,this._glName=null,window.WebGL2RenderingContext&&this._gl instanceof window.WebGL2RenderingContext&&(this._vaoExt=e)}return Object.defineProperty(t.prototype,"id",{get:function(){return this._id},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"glName",{get:function(){return this._glName},enumerable:!0,configurable:!0}),t.prototype.dispose=function(){this._vaoExt.bindVertexArrayOES?this._vaoExt.bindVertexArrayOES(null):this._vaoExt.bindVertexArray(null),this._vaoExt&&this._glName&&(this._vaoExt.deleteVertexArrayOES?this._vaoExt.deleteVertexArrayOES(this._glName):this._vaoExt.deleteVertexArray(this._glName),this._glName=null)},t.prototype.initialize=function(t,e){if(!this._initialized){if(this._vaoExt){var i=this._vaoExt.createVertexArrayOES?this._vaoExt.createVertexArrayOES():this._vaoExt.createVertexArray();this._vaoExt.bindVertexArrayOES?this._vaoExt.bindVertexArrayOES(i):this._vaoExt.bindVertexArray(i),t.apply(null,e),this._vaoExt.bindVertexArrayOES?this._vaoExt.bindVertexArrayOES(null):this._vaoExt.bindVertexArray(null),this._glName=i}this._initialized=!0}},t.prototype.bind=function(){this._vaoExt.bindVertexArrayOES?this._vaoExt.bindVertexArrayOES(this._glName):this._vaoExt.bindVertexArray(this._glName)},t.prototype.unbind=function(){this._vaoExt.bindVertexArrayOES?this._vaoExt.bindVertexArrayOES(null):this._vaoExt.bindVertexArray(null)},t._nextId=0,t}();return i});