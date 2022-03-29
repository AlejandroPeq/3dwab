/**
 * Copyright @ 2021 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["dojo/_base/lang","dojo/_base/array","dojo/_base/declare","esri/views/3d/webgl-engine/lib/Util","esri/core/libs/gl-matrix-2/vec3f64","esri/core/libs/gl-matrix-2/mat4f64","esri/core/libs/gl-matrix-2/vec3","esri/core/libs/gl-matrix-2/mat4","esri/geometry/projection","../../webgl-engine-extensions/VertexBufferLayout","../../webgl-engine-extensions/GLXBO","../../webgl-engine-extensions/GLVertexArrayObject","../../support/fx3dUtils","../../support/fx3dUnits","../Effect","./PointExtrudeMaterial","../../webgl-engine-extensions/constraints"],function(e,i,t,r,s,n,o,h,a,d,l,_,g,f,u,c,v){var b=s.vec3f64,o=o.vec3,m=n.mat4f64,h=h.mat4,x=v.VertexAttrConstants,y=r.setMatrixTranslation3,p={Down:0,Up:1},w=b.create(),I=(m.create(),m.create()),M=m.create(),C=m.create(),z=null,B=m.create(),O={Cuboid:"cuboid",Hexahedron:"hexahedron",Cylinder:"cylinder"},D={Cuboid:4,Hexahedron:6,Cylinder:32},L=t([u],{declaredClass:"esri.views.3d.effects.PointExtrude.PointExtrudeEffect",effectName:"PointExtrude",constructor:function(e){this.orderId=2,this._sizeInMeters=[],this.localOriginFactory=u.createLocalOriginFactory(),this._renderObjects={},this._needsAllLoaded=!0},_initRenderingInfo:function(){this.renderingInfo.radius=6e4,this.renderingInfo.height=8e5,this.renderingInfo.topColors=[g.rgbNames.cadetblue,g.rgbNames.yellowgreen,g.rgbNames.lightpink,g.rgbNames.orangered,g.rgbNames.green,g.rgbNames.indianred],this._colorBarDirty=!0,this.renderingInfo.bottomColor=[0,255,0],this.renderingInfo.shapeType=O.Cylinder,this._renderingInfoDirty=!0,this._segments=D.Cylinder,this._vacDirty=!0,this._shapeDirty=!0,this.inherited(arguments)},_doRenderingInfoChange:function(e){this.inherited(arguments);for(var i in e)e.hasOwnProperty(i)&&this.renderingInfo.hasOwnProperty(i)&&(g.endsWith(i.toLowerCase(),"info")?g.isInforAttrChanged(this.renderingInfo[i],e[i])&&(this._renderingInfoDirty=!0):g.endsWith(i.toLowerCase(),"color")?e[i]instanceof Array&&3==e[i].length&&(this.renderingInfo[i]=[e[i][0]/255,e[i][1]/255,e[i][2]/255]):g.endsWith(i.toLowerCase(),"colors")?e[i]instanceof Array&&(this.renderingInfo[i]=e[i],this._colorBarDirty=!0,this._renderingInfoDirty=!0):"shapetype"===i.toLowerCase()?this.renderingInfo[i]!=e[i].toLowerCase()&&(this._vacDirty=!0,this._shapeDirty=!0,this._isAddingGeometry=!1,this._renderingInfoDirty=!0,this.renderingInfo[i]=e[i].toLowerCase(),this.renderingInfo[i]===O.Cuboid?this._segments=D.Cuboid:this.renderingInfo[i]===O.Hexahedron?this._segments=D.Hexahedron:this.renderingInfo[i]===O.Cylinder&&(this._segments=D.Cylinder)):"radius"===i.toLowerCase()||"height"===i.toLowerCase()||"transparency"===i.toLowerCase()?(this._clampScope(e,i),"radius"==i&&this._radiusUnit?this.renderingInfo[i]=f.toMeters(this._radiusUnit,e[i],this._view.viewingMode):"height"==i&&this._heightUnit?(this.renderingInfo[i]=f.toMeters(this._heightUnit,e[i],this._view.viewingMode),this._updateDefaultLabelHeight()):this.renderingInfo[i]=e[i]):typeof e[i]==typeof this.renderingInfo[i]&&(this.renderingInfo[i]=e[i]))},_updateDefaultLabelHeight:function(){this._layer._labelDefaultHeight={flag:1,min:this._scopes.height[0],max:this.renderingInfo.height}},initEffect:function(t){this.inherited(arguments),this._effectConfig&&e.isArray(this._effectConfig.renderingInfo)&&(this._radiusUnit=null,this._heightUnit=null,i.forEach(this._effectConfig.renderingInfo,function(e){"radius"===e.name.toLowerCase()?(this._radiusUnit=e.unit,this.renderingInfo.radius=f.toMeters(this._radiusUnit,this.renderingInfo.radius,this._view.viewingMode)):"height"===e.name.toLowerCase()&&(this._heightUnit=e.unit,this.renderingInfo.height=f.toMeters(this._heightUnit,this.renderingInfo.height,this._view.viewingMode),this._updateDefaultLabelHeight())}.bind(this)))},destroy:function(){this._resetBuffers()},_resetBuffers:function(){for(var e in this._renderObjects)this._dispose(this._renderObjects[e].vbo),this._dispose(this._renderObjects[e].ibo),this._dispose(this._renderObjects[e].vao);this._renderObjects={}},_initVertexLayout:function(){var e=[x.POSITION,x.AUXPOS1,x.NORMAL,x.AUXPOS2];this._vertexBufferLayout=new d(e,[3,3,3,3],[5126,5126,5126,5126])},_initRenderContext:function(){if(this.inherited(arguments),this._vacDirty)if(this._initVertexLayout(),this._vacDirty=!1,this._isAddingGeometry)for(var e in this._renderObjects)this._unBindBuffer(this._renderObjects[e].vao,this._renderObjects[e].vbo,this._renderObjects[e].ibo),this._renderObjects[e].vao&&(this._renderObjects[e].vao._initialized=!1);else this._resetBuffers();return this._geometryVertexNum=2*this._segments,this._geometryIndexNum=3*(2*this._segments+(this._segments-2)),this._localBindsCallback||(this._localBindsCallback=this._localBinds.bind(this)),this._buildPolyHedronGeometries()},_buildPolyHedronGeometries:function(){var e=this._isAddingGeometry?this._addedGraphics:this._allGraphics(),i=this._isAddingGeometry?this._toAddGraphicsIndex:0;if(e.length>0){console.log("_buildPolyHedronGeometries ==> graphics.length ==> "+e.length);var t,r,s,n,d,f,u,c,v,b,x,z,B,O,D,L,F=(this._vertexBufferLayout.getStride(),2*Math.PI),P=1/this._segments;for(r=0;r<e.length;r++)if(t=e[r].geometry,null!=t){o.set(w,t.longitude,t.latitude,t.altitude||1);var A=m.create();a.computeTranslationToOriginAndRotation(this._wgs84SpatialReference,w,A,this._view.renderSpatialReference),"global"===this._view.viewingMode?g.wgs84ToSphericalEngineCoords(w,0,w,0):"local"===this._view.viewingMode&&g.wgs84ToWebMerc(w,0,w,0);var j=this.localOriginFactory.getOrigin(w);this._renderObjects[j.id]||(this._renderObjects[j.id]={vbo:new l(this._gl,(!0),this._vertexBufferLayout),ibo:new l(this._gl,(!1)),vao:this._vaoExt?new _(this._gl,this._vaoExt):null,offset:0,origin:j.vec3}),d=this._renderObjects[j.id],y(I,-d.origin[0],-d.origin[1],-d.origin[2]),h.multiply(M,I,A),h.invert(C,M),h.transpose(C,C),u=0,c=0,v=1,B=C[0]*u+C[4]*c+C[8]*v+C[12],O=C[1]*u+C[5]*c+C[9]*v+C[13],D=C[2]*u+C[6]*c+C[10]*v+C[14];var T=[],S=[];for(f=d.offset,s=0;s<this._segments;s++)L=F*s*P,u=Math.cos(L),c=Math.sin(L),v=0,b=M[0]*u+M[4]*c+M[8]*v,x=M[1]*u+M[5]*c+M[9]*v,z=M[2]*u+M[6]*c+M[10]*v,T.push(b,x,z,M[12],M[13],M[14],B,O,D,r+i,s,p.Down),T.push(b,x,z,M[12],M[13],M[14],B,O,D,r+i,s,p.Up),s!==this._segments-1?S.push(2*s+f,2*s+2+f,2*s+3+f,2*s+f,2*s+3+f,2*s+1+f):S.push(2*s+f,0+f,1+f,2*s+f,1+f,2*s+1+f);for(n=0;n<this._segments-2;n++)S.push(1+f,2*n+3+f,2*n+5+f);d.vbo.addData(!0,new Float32Array(T)),d.offset+=this._geometryVertexNum,d.ibo.addData(!0,new Uint32Array(S)),d.vao&&(d.vao._initialized=!1)}return this._resetAddGeometries(),!0}return!1},_loadShaders:function(){return this._material||(this._material=new c({pushState:this._pushState.bind(this),restoreState:this._restoreState.bind(this),gl:this._gl,viewingMode:this._view.viewingMode,shaderSnippets:this._shaderSnippets})),this._material.loadShaders()},_initColorBar:function(){if(!this._colorBarDirty)return!0;this._colorBarTexture||(this._colorBarTexture=this._gl.createTexture());var e=this._gl.getParameter(32873);this._gl.bindTexture(3553,this._colorBarTexture),this._gl.pixelStorei(37440,!0),this._gl.texParameteri(3553,10240,9728),this._gl.texParameteri(3553,10241,9728),this._gl.texParameteri(3553,10242,33071),this._gl.texParameteri(3553,10243,33071);var i=g.createColorBarTexture(32,1,this.renderingInfo.topColors);return this._gl.texImage2D(3553,0,6408,6408,5121,i),this._gl.generateMipmap(3553),this._gl.bindTexture(3553,e),0===this._gl.getError()},_localBinds:function(e,i){e.bind(this._material._program),this._vertexBufferLayout.enableVertexAttribArrays(this._gl,this._material._program),i.bind()},_bindBuffer:function(e,i,t){e?(e._initialized||e.initialize(this._localBindsCallback,[i,t]),e.bind()):this._localBinds(i,t)},_unBindBuffer:function(e,i,t){e?e.unbind():(i.unbind(),this._vertexBufferLayout.disableVertexAttribArrays(this._gl,this._material._program),t.unbind())},render:function(i,t){this.inherited(arguments),this._hasSentReady||(this._layer.emit("fx3d-ready"),this._hasSentReady=!0),this._sizeInMeters[0]=this.renderingInfo.radius,this._sizeInMeters[1]=this._scopes.height[0],this._sizeInMeters[2]=this.renderingInfo.height,this._material.bind(e.mixin({},{so:this._vizFieldVerTextures[this._vizFieldDefault],si:this._vizFieldVerTextures[this._vizFields[this._currentVizPage]],op:this._vizFieldVerTextureSize,mm:this.renderingInfo.animationInterval,eo:this._sizeInMeters,pm:this.renderingInfo.transparency,pp:this.renderingInfo.bottomColor,ol:this._vizFieldMinMaxs[this._vizFieldDefault].min>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min?this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min:this._vizFieldMinMaxs[this._vizFieldDefault].min,se:this._vizFieldMinMaxs[this._vizFieldDefault].max>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max?this._vizFieldMinMaxs[this._vizFieldDefault].max:this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max,ss:1/this._segments,ls:this._colorBarTexture},i),t);for(var r in this._renderObjects)z=this._renderObjects[r],h.translate(B,i.view,z.origin),this._material.bindMat4("viewMat",B),this._material.bindVec3fv("origin",z.origin),this._material.bindVec3f("camPos",i.viewInvTransp[3]-z.origin[0],i.viewInvTransp[7]-z.origin[1],i.viewInvTransp[11]-z.origin[2]),this._bindBuffer(z.vao,z.vbo,z.ibo),this._gl.drawElements(4,z.ibo.getNum(),5125,0);this._material.release(t),this._unBindBuffer(z.vao,z.vbo,z.ibo)}});return L});