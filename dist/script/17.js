webpackJsonp([17],{425:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(206),a=n(498),i=r(a),l=n(130),d={fetchList:function(e,t,n,r){return(0,l.fetchList)(e,t,n,r)}},s=function(e){return{response:e.download.response}};t["default"]=(0,o.connect)(s,d)(i["default"])},444:function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(r[a]=!0)}for(o=0;o<t.length;o++){var i=t[o];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),e.push(i))}},e}},445:function(e,t){function n(e,t){for(var n=0;n<e.length;n++){var r=e[n],o=c[r.id];if(o){o.refs++;for(var a=0;a<o.parts.length;a++)o.parts[a](r.parts[a]);for(;a<r.parts.length;a++)o.parts.push(d(r.parts[a],t))}else{for(var i=[],a=0;a<r.parts.length;a++)i.push(d(r.parts[a],t));c[r.id]={id:r.id,refs:1,parts:i}}}}function r(e){for(var t=[],n={},r=0;r<e.length;r++){var o=e[r],a=o[0],i=o[1],l=o[2],d=o[3],s={css:i,media:l,sourceMap:d};n[a]?n[a].parts.push(s):t.push(n[a]={id:a,parts:[s]})}return t}function o(e,t){var n=h(),r=g[g.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),g.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function a(e){e.parentNode.removeChild(e);var t=g.indexOf(e);t>=0&&g.splice(t,1)}function i(e){var t=document.createElement("style");return t.type="text/css",o(e,t),t}function l(e){var t=document.createElement("link");return t.rel="stylesheet",o(e,t),t}function d(e,t){var n,r,o;if(t.singleton){var d=b++;n=v||(v=i(t)),r=s.bind(null,n,d,!1),o=s.bind(null,n,d,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=l(t),r=u.bind(null,n),o=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=i(t),r=f.bind(null,n),o=function(){a(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}function s(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=w(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function f(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function u(e,t){var n=t.css,r=t.sourceMap;r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var o=new Blob([n],{type:"text/css"}),a=e.href;e.href=URL.createObjectURL(o),a&&URL.revokeObjectURL(a)}var c={},p=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},m=p(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),h=p(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,b=0,g=[];e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");t=t||{},"undefined"==typeof t.singleton&&(t.singleton=m()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var o=r(e);return n(o,t),function(e){for(var a=[],i=0;i<o.length;i++){var l=o[i],d=c[l.id];d.refs--,a.push(d)}if(e){var s=r(e);n(s,t)}for(var i=0;i<a.length;i++){var d=a[i];if(0===d.refs){for(var f=0;f<d.parts.length;f++)d.parts[f]();delete c[d.id]}}}};var w=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},497:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(55),a=r(o),i=n(53),l=r(i),d=n(54),s=r(d),f=n(57),u=r(f),c=n(56),p=r(c),m=n(3),h=r(m);n(570);var v=function(e){function t(){return(0,l["default"])(this,t),(0,u["default"])(this,(0,a["default"])(t).apply(this,arguments))}return(0,p["default"])(t,e),(0,s["default"])(t,[{key:"render",value:function(){var e=this.props.icon||"http://cc-cdn.dianjoy.com/91atm/images/error.png";return h["default"].createElement("div",{className:"container"},h["default"].createElement("div",{className:"main download"},h["default"].createElement("div",{className:"download-wrap"},h["default"].createElement("div",{className:"download-icon"},h["default"].createElement("img",{src:e,alt:""}),h["default"].createElement("p",null,this.props.app_name)),h["default"].createElement("div",{className:"download-btn-wrap"},h["default"].createElement("a",{href:this.props.url,className:"btn download-url"},"立即下载"),h["default"].createElement("div",{className:"tran white-tran"}))),h["default"].createElement("div",{className:"download-content"},h["default"].createElement("p",null," ",h["default"].createElement("span",null),"下载完成后，请在",h["default"].createElement("b",null,"桌面"),"手动打开试玩守护，即可开始试玩。"),h["default"].createElement("p",null," ",h["default"].createElement("span",null),"对",h["default"].createElement("b",null,"iOS9"),"用户，需要重新在",h["default"].createElement("b",null,"“设置”"),"中进行证书的信任才可正常使用哟~"))))}}]),t}(h["default"].Component);v.propTypes={app_name:m.PropTypes.string,package_name:m.PropTypes.string,url:m.PropTypes.string,icon:m.PropTypes.string},t["default"]=v,t["default"]=v},498:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(55),a=r(o),i=n(53),l=r(i),d=n(54),s=r(d),f=n(57),u=r(f),c=n(56),p=r(c),m=n(3),h=r(m),v=n(497),b=r(v),g=function(e){function t(){return(0,l["default"])(this,t),(0,u["default"])(this,(0,a["default"])(t).apply(this,arguments))}return(0,p["default"])(t,e),(0,s["default"])(t,[{key:"componentDidMount",value:function(){this.props.fetchList("/firmware/client/refresh/",void 0,"response")}},{key:"render",value:function(){var e=this.props.response;return h["default"].createElement(b["default"],e)}}]),t}(h["default"].Component);g.propTypes={fetchList:m.PropTypes.func.isRequired,response:m.PropTypes.object.isRequired},t["default"]=g},553:function(e,t,n){t=e.exports=n(444)(),t.push([e.i,".download{font-size:1.166rem}.download .download-wrap{background:-webkit-gradient(linear,left top,right top,from(#03baff),to(#00daff));background:-webkit-linear-gradient(left,#03baff,#00daff);background:linear-gradient(90deg,#03baff,#00daff);padding-top:2rem}.download .download-wrap .download-icon{margin:0 auto 1.25rem;width:8.5rem;height:8.5rem;border-radius:1.5rem;border:1px solid #f4f5f6;box-shadow:0 0 .8px 0 rgba(51,51,51,.4)}.download .download-wrap .download-icon img{width:100%;height:100%;border-radius:1.5rem}.download .download-wrap .download-icon p{text-align:center;padding-top:1.25rem;font-size:1.333rem;color:#fff}.download .download-content{color:#999;background-color:#fff;padding:1.25rem;font-size:1.167rem;line-height:1.67rem;text-align:justify;-webkit-box-flex:1;-ms-flex:1;flex:1;-webkit-flex:1}.download .download-content p:first-child{padding-bottom:.83rem}.download .download-content p span{background-color:#999;width:.4rem;height:.4rem;border-radius:50%;display:inline-block;margin-right:.5rem;transform:translateY(-.3rem);-webkit-transform:translateY(-.3rem)}.download .download-content p b{color:#007cff}",""])},570:function(e,t,n){var r=n(553);"string"==typeof r&&(r=[[e.i,r,""]]);n(445)(r,{});r.locals&&(e.exports=r.locals)}});