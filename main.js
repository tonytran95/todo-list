!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function o(t,e){this.name=t,this.date=e,this.lastChanged=e,this.tasks=[]}n.r(e),Storage.prototype.getLists=function(){return JSON.parse(localStorage.lists)},Storage.prototype.setLists=function(t){this.lists=JSON.stringify(t)},localStorage.clear();(()=>{const t=document.querySelector("#container"),e=localStorage.lists?localStorage.getLists():[];0===e.length&&e.push(new o("New List...",new Date)),e.forEach(e=>{const n=document.createElement("div");n.textContent=e.name,e.tasks.forEach(t=>{const e=document.createElement("div");e.textContent=t.description,n.appendChild(e)}),t.appendChild(n)});const n=document.createElement("button");n.textContent="New List",n.addEventListener("click",()=>{const n=new o("New List...",new Date);e.push(n);const r=document.createElement("div");r.textContent=n.name,t.appendChild(r),localStorage.setLists(e)}),t.appendChild(n)})()}]);