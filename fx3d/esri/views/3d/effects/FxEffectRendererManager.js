/**
 * Copyright @ 2021 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["dojo/_base/lang","dojo/_base/array","dojo/_base/declare","esri/core/scheduling","esri/core/watchUtils","../webgl-engine-extensions/ShaderSnippets","esri/core/libs/gl-matrix-2/vec3f64","esri/core/libs/gl-matrix-2/mat4f64","esri/core/libs/gl-matrix-2/vec3","esri/core/libs/gl-matrix-2/mat4","esri/views/3d/externalRenderers","esri/layers/GraphicsLayer","./Effect","../support/fx3dUtils","dojo/text!./CommonShaders.xml"],function(e,t,i,s,n,r,a,c,f,o,l,h,d,_,u){var x=c.mat4f64,o=o.mat4,m=a.vec3f64,f=f.vec3,b=i(null,{declaredClass:"esri.views.3d.effects.FxEffectRendererManager",constructor:function(){this._sceneView=null,this._ready=!1,this._effects=[],this._fx3dFrameTask=null,this._shaderSnippets=null,this._normalMatrix=x.create(),this._viewDirection=m.create(),this._shaderSnippets||(this._shaderSnippets=new r,this._shaderSnippets._parse(u))},_init:function(t){return e.isObject(t)?(this._sceneView=t,this._vaoExt=this._sceneView._stage.renderView._rctx._capabilities.vao,void(this._ready||n.whenTrue(this._sceneView,"ready",this._viewReadyHandler.bind(this)))):void console.error("FxEffectRendererManager: no sceneView")},_viewReadyHandler:function(){this._sceneView&&(this._labelsLayer=new h({id:"-labelinfo-layer",listMode:"hide"}),this._sceneView.map.add(this._labelsLayer))},setup:function(e){this.context={},this.context.gl=e.gl,this.context.rctx=e.rctx,this._gl=this.context.gl,this._gl.getExtension("OES_texture_float"),this._gl.getExtension("OES_texture_float_linear"),this._effects.forEach(function(e){e.effect.setupEffect({gl:this._gl,vaoExt:this._vaoExt,shaderSnippets:this._shaderSnippets})}.bind(this)),e.resetWebGLState()},_updateContext:function(e){var t={};t.direction=e.sunLight.direction,t.ambient=e.sunLight.ambient.color,t.diffuse=e.sunLight.diffuse.color,t.specular=[.2,.2,.2,.2],t.ambient[3]=e.sunLight.ambient.intensity,t.diffuse[3]=e.sunLight.diffuse.intensity,this.context.lightingData=t,o.copy(this._normalMatrix,e.camera.viewInverseTransposeMatrix),this._normalMatrix[3]=this._normalMatrix[7]=this._normalMatrix[11]=0},render:function(e){e.gl.enable(e.gl.DEPTH_TEST),e.gl.disable(e.gl.CULL_FACE),e.gl.disable(e.gl.BLEND),this._updateContext(e),_context=e,this._effects.forEach(function(e){e.effect.update();e.effect.render({zoom:this._sceneView.zoom,proj:_context.camera.projectionMatrix,view:_context.camera.viewMatrix,viewInvTransp:_context.camera.viewInverseTransposeMatrix,normalMat:this._normalMatrix,camPos:_context.camera.eye,lightingData:this.context.lightingData,viewport:_context.camera.viewport},_context.rctx)}.bind(this)),l.requestRender(this._sceneView),e.resetWebGLState()},dispose:function(){},addEffect:function(i,s){if(e.isObject(i)&&s instanceof d){var n=t.filter(this._effects,function(e){return e.id===i.id&&e.effect.effectName==s.effectName});if(n.length>0)return console.warn("Layer "+i.id+" in "+s.effectName+" effect has already existed."),!1;if(e.isObject(s))return i.emit("hide-feature-label"),this._labelsLayer.id=i.id+this._labelsLayer.id,i._labelsLayer=this._labelsLayer,this._labelsLayer.visible=i.visible,i.watch("visible",function(e,t,s){this._labelsLayer&&(i.emit("hide-feature-label"),this._labelsLayer.set("visible",!!e))}.bind(this)),this._effects.push({id:i.id,effect:s}),s.initEffect({}),!0}return!1},_remove:function(e,i){if(e&&i){var s=-1,n=t.filter(this._effects,function(t,n){return t.id===i&&e==t.effect.effectName&&(s=n,!0)});n.length>0&&s>-1&&(n[0].effect.destroy(),this._effects.splice(s,1)),0===this._effects.length&&(this._ready=!1,this._labelsLayer&&(this._labelsLayer.removeAll(),this._sceneView.map.remove(this._labelsLayer)))}}}),p=null;return b.init=function(e){p||(p=new b),p._init(e)},b.addEffect=function(e,t){if(p){var i=p._sceneView;return this._eventHandler=e.on("effect-ok-test",function(e){l.add(i,p)}.bind(this)),p.addEffect(e,t)}return!1},b.run=function(e,t){return!!p&&p._prepare(e,t)},b.destroy=function(e,t){if(p){var i=p._sceneView;p._remove(e,t),l.remove(i,p)}},b.pause=function(){p&&p._fx3dFrameTask&&p._fx3dFrameTask.pause()},b});