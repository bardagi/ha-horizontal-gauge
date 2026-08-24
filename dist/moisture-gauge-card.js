const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:u,getPrototypeOf:d}=Object,p=globalThis,m=p.trustedTypes,g=m?m.emptyScript:"",f=p.reactiveElementPolyfillSupport,_=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...c(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[_("elementProperties")]=new Map,b[_("finalized")]=new Map,f?.({ReactiveElement:b}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,x=w.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+C,P=`<${T}>`,M=document,U=()=>M.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,N="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,z=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),F=new WeakMap,V=M.createTreeWalker(M,129);function G(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=O;for(let e=0;e<i;e++){const i=t[e];let a,h,l=-1,c=0;for(;c<i.length&&(o.lastIndex=c,h=o.exec(i),null!==h);)c=o.lastIndex,o===O?"!--"===h[1]?o=R:void 0!==h[1]?o=D:void 0!==h[2]?(I.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=z):void 0!==h[3]&&(o=z):o===z?">"===h[0]?(o=n??O,l=-1):void 0===h[1]?l=-2:(l=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?z:'"'===h[3]?j:L):o===j||o===L?o=z:o===R||o===D?o=O:(o=z,n=void 0);const u=o===z&&t[e+1].startsWith("/>")?" ":"";r+=o===O?i+P:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+C+u):i+C+(-2===l?e:u)}return[G(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,l]=K(t,e);if(this.el=J.createElement(h,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[r++],i=s.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Y}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),V.nextNode(),a.push({type:2,index:++n});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===W)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=k(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Z(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);V.currentNode=s;let n=V.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new st(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=V.nextNode(),r++)}return V.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),k(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new J(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=Z(this,t,e,0),r=!k(t)||t!==this._$AH&&t!==W,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Z(this,s[i+o],e,o),a===W&&(a=this._$AH[o]),r||=!k(a)||a!==this._$AH[o],a===q?t=q:t!==q&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends Y{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??q)===W)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(J,X),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class ot extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(U(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const at=rt.litElementPolyfillSupport;at?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");const ht=40,lt=70;function ct(t,e,i){const s=e??i;if("number"!=typeof s||!Number.isFinite(s))throw new Error(`${t} must be a finite number`);return s}function ut(t){if(!t||"object"!=typeof t)throw new Error("Card configuration is required");if("string"!=typeof t.entity||""===t.entity.trim())throw new Error("Specify a sensor entity");if(void 0!==t.name&&"string"!=typeof t.name)throw new Error("name must be a string");if(void 0!==t.unit&&"string"!=typeof t.unit)throw new Error("unit must be a string");if(void 0!==t.optimal&&(null===t.optimal||"object"!=typeof t.optimal))throw new Error("optimal must contain min and max values");const e=ct("min",t.min,0),i=ct("max",t.max,100),s=ct("optimal.min",t.optimal?.min,ht),n=ct("optimal.max",t.optimal?.max,lt),r=ct("buffer",t.buffer,5);if(e>=i)throw new Error("min must be less than max");if(s>n)throw new Error("optimal.min must be less than or equal to optimal.max");if(r<0)throw new Error("buffer must be greater than or equal to zero");return{...t,entity:t.entity.trim(),min:e,max:i,optimal:{min:s,max:n},buffer:r,tap_action:t.tap_action??{action:"more-info"},hold_action:t.hold_action??{action:"none"},double_tap_action:t.double_tap_action??{action:"none"}}}const dt=100;function pt(t,e,i){return Math.min(Math.max(t,e),i)}function mt(t){return 135+270*pt(t,0,1)}function gt(t,e=70){const i=mt(t)*Math.PI/180;return{x:dt+e*Math.cos(i),y:dt+e*Math.sin(i)}}function ft(t){return Number(t.toFixed(4)).toString()}const _t=gt(0),$t=gt(1),yt=`M ${ft(_t.x)} ${ft(_t.y)} A 70 70 0 1 1 ${ft($t.x)} ${ft($t.y)}`;function vt(t){if(!t||"string"!=typeof t.state)return null;const e=t.state.trim();if(""===e)return null;const i=Number(e);return Number.isFinite(i)?i:null}function bt(t,e){return new Intl.NumberFormat(t.language||void 0,{maximumFractionDigits:3}).format(e)}const wt="moisture-gauge-card",At=`custom:${wt}`,xt=[0,.25,.5,.75,1];function Et(t){return Boolean(t?.action&&"none"!==t.action)}class St extends ot{constructor(){super(...arguments),this._holdTriggered=!1}static{this.properties={hass:{attribute:!1},config:{state:!0}}}static getConfigForm(){const t=["more-info","navigate","url","perform-action","assist","none"];return{schema:[{name:"entity",required:!0,selector:{entity:{filter:[{domain:"sensor"}]}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"unit",selector:{text:{}}}]},{type:"grid",name:"",schema:[{name:"min",selector:{number:{mode:"box"}}},{name:"max",selector:{number:{mode:"box"}}},{name:"buffer",selector:{number:{mode:"box",min:0}}}]},{type:"expandable",name:"optimal",title:"Optimal range",schema:[{name:"min",selector:{number:{mode:"box"}}},{name:"max",selector:{number:{mode:"box"}}}]},{type:"expandable",name:"interactions",title:"Interactions",flatten:!0,schema:[{name:"tap_action",selector:{ui_action:{actions:t,default_action:"more-info"}},context:{entity:"entity"}},{name:"hold_action",selector:{ui_action:{actions:t,default_action:"none"}},context:{entity:"entity"}},{name:"double_tap_action",selector:{ui_action:{actions:t,default_action:"none"}},context:{entity:"entity"}}]}],computeLabel:t=>({entity:"Moisture sensor",name:"Name",unit:"Unit",min:"Minimum",max:"Maximum",buffer:"Warning buffer",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action"}[t.name]),computeHelper:t=>{if("buffer"===t.name)return"Warning-zone width in the sensor's unit"},assertConfig:t=>{ut(t)}}}static getStubConfig(t,e=[],i=[]){const s=[...new Set([...e,...i,...Object.keys(t.states)])].filter(t=>t.startsWith("sensor.")),n=s.find(e=>"moisture"===t.states[e]?.attributes.device_class),r=s.find(e=>null!==vt(t.states[e]));return{entity:n??r??s[0]??""}}setConfig(t){this.config=ut(t)}getCardSize(){return 3}getGridOptions(){return{rows:3,columns:6,min_rows:3,min_columns:3}}disconnectedCallback(){this._clearGestureTimers(),super.disconnectedCallback()}shouldUpdate(t){if(t.has("config"))return!0;if(!t.has("hass"))return!1;const e=t.get("hass");return!(e&&this.hass&&this.config)||(e.states[this.config.entity]!==this.hass.states[this.config.entity]||e.language!==this.hass.language||e.entities!==this.hass.entities)}render(){if(!this.hass||!this.config)return q;const t=this.hass.states[this.config.entity],e=vt(t),i=null===e?0:function(t,e,i){if(![t,e,i].every(Number.isFinite))throw new Error("Gauge values must be finite");if(e>=i)throw new Error("Gauge minimum must be less than maximum");return pt((t-e)/(i-e),0,1)}(e,this.config.min,this.config.max),s=function(t,e,i,s){const n="string"==typeof e?.attributes.unit_of_measurement?e.attributes.unit_of_measurement:void 0;if(null===i||!e)return{value:"—",unit:void 0!==s.unit?s.unit:n??"%"};const r=t.formatEntityStateToParts?.(e)??[],o=r.filter(t=>"unit"!==t.type).map(t=>t.value).join("").trim(),a=r.filter(t=>"unit"===t.type).map(t=>t.value).join("").trim();return{value:o||bt(t,i),unit:void 0!==s.unit?s.unit:a||n||"%"}}(this.hass,t,e,this.config),n=function(t,e,i){return void 0!==i.name?i.name:e?t.formatEntityName?.(e,void 0)??("string"==typeof e.attributes.friendly_name?e.attributes.friendly_name:i.entity):i.entity}(this.hass,t,this.config),r=function(t,e,i,s){if(!e)return t.localize?.("ui.panel.lovelace.warning.entity_not_found","entity",s)||`Entity not found: ${s}`;if(null!==i)return null;const n=t.formatEntityState?.(e)||e.state;return"unknown"===e.state||"unavailable"===e.state?n:`Invalid numeric state: ${n}`}(this.hass,t,e,this.config.entity),o=null===e?"unavailable":function(t,e,i){return t<e.min-i||t>e.max+i?"critical":t<e.min||t>e.max?"warning":"optimal"}(e,this.config.optimal,this.config.buffer),a=100*i,h=s.unit?`${s.value} ${s.unit}`:s.value;return B`
      <ha-card
        class="interactive"
        role="button"
        tabindex="0"
        aria-label=${r?`${n}: ${r}`:`${n}: ${h}`}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @keydown=${this._onKeyDown}
        @contextmenu=${this._onContextMenu}
      >
        <div class="card-content">
          <h2 class="card-title">${n}</h2>
          <div class="gauge-wrapper">
            <svg
              viewBox="0 0 200 160"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                class="gauge-arc"
                d=${yt}
                pathLength="100"
              ></path>
              <path
                class="gauge-progress ${o}"
                d=${yt}
                pathLength="100"
                style=${`stroke-dasharray: ${a} 100; opacity: ${null===e||0===a?0:1}`}
              ></path>
              ${xt.map(t=>{const e=gt(t,64),i=gt(t,74);return B`<line
                  class="gauge-tick"
                  x1=${e.x}
                  y1=${e.y}
                  x2=${i.x}
                  y2=${i.y}
                ></line>`})}
              <line
                class="gauge-needle ${null===e?"unavailable":""}"
                x1=${dt}
                y1=${dt}
                x2=${160}
                y2=${dt}
                style=${`transform: rotate(${mt(i)}deg)`}
              ></line>
              <circle
                class="gauge-center"
                cx=${dt}
                cy=${dt}
                r="4"
              ></circle>
              <text class="gauge-value" x="100" y="117">${s.value}</text>
              ${s.unit?B`<text class="gauge-unit" x="100" y="136">
                      ${s.unit}
                    </text>`:q}
            </svg>
          </div>
          ${r?B`<div class="state-problem" role="status">${r}</div>`:q}
        </div>
      </ha-card>
    `}_onPointerDown(t){0===t.button&&this.config&&(this._holdTriggered=!1,t.currentTarget instanceof HTMLElement&&t.currentTarget.setPointerCapture?.(t.pointerId),Et(this.config.hold_action)&&(this._holdTimer=window.setTimeout(()=>{this._holdTriggered=!0,this._runAction("hold")},500)))}_onPointerUp(t){if(0===t.button&&this.config&&(this._clearHoldTimer(),t.currentTarget instanceof HTMLElement&&t.currentTarget.releasePointerCapture?.(t.pointerId),!this._holdTriggered)){if(Et(this.config.double_tap_action))return void 0!==this._tapTimer?(window.clearTimeout(this._tapTimer),this._tapTimer=void 0,void this._runAction("double_tap")):void(this._tapTimer=window.setTimeout(()=>{this._tapTimer=void 0,this._runAction("tap")},250));this._runAction("tap")}}_onPointerCancel(){this._clearHoldTimer(),this._holdTriggered=!1}_onKeyDown(t){"Enter"!==t.key&&" "!==t.key||t.repeat||(t.preventDefault(),this._runAction("tap"))}_onContextMenu(t){this.config&&Et(this.config.hold_action)&&t.preventDefault()}_runAction(t){this.hass&&this.config&&this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:this.config,action:t}}))}_clearHoldTimer(){void 0!==this._holdTimer&&(window.clearTimeout(this._holdTimer),this._holdTimer=void 0)}_clearGestureTimers(){this._clearHoldTimer(),void 0!==this._tapTimer&&(window.clearTimeout(this._tapTimer),this._tapTimer=void 0)}static{this.styles=r`
    :host {
      display: block;
      --gauge-width: 200px;
      --gauge-height: auto;
    }

    ha-card {
      overflow: hidden;
    }

    ha-card.interactive {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    ha-card.interactive:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px;
    }

    .card-title {
      max-width: 100%;
      margin: 0;
      overflow: hidden;
      color: var(--primary-text-color, #212121);
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .gauge-wrapper {
      width: min(100%, var(--gauge-width));
      height: var(--gauge-height);
      aspect-ratio: 5 / 4;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .gauge-arc,
    .gauge-progress {
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
    }

    .gauge-arc {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.3));
    }

    .gauge-progress {
      transition:
        stroke-dasharray 300ms ease-out,
        stroke 200ms ease-out;
    }

    .gauge-progress.optimal {
      stroke: var(--success-color, #43a047);
    }

    .gauge-progress.warning {
      stroke: var(--warning-color, #ffa600);
    }

    .gauge-progress.critical {
      stroke: var(--error-color, #db4437);
    }

    .gauge-progress.unavailable {
      stroke: var(--disabled-text-color, #9e9e9e);
    }

    .gauge-tick {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.3));
      stroke-width: 1;
    }

    .gauge-needle {
      transform-box: view-box;
      transform-origin: 100px 100px;
      fill: none;
      stroke: var(--primary-text-color, #212121);
      stroke-width: 2;
      stroke-linecap: round;
      transition:
        transform 300ms ease-out,
        opacity 200ms ease-out;
    }

    .gauge-needle.unavailable {
      opacity: 0;
    }

    .gauge-center {
      fill: var(--primary-text-color, #212121);
    }

    .gauge-value,
    .gauge-unit {
      text-anchor: middle;
    }

    .gauge-value {
      fill: var(--primary-text-color, #212121);
      font-size: 30px;
      font-weight: 300;
    }

    .gauge-unit {
      fill: var(--secondary-text-color, #727272);
      font-size: 12px;
    }

    .state-problem {
      max-width: 100%;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      overflow-wrap: anywhere;
    }

    @media (prefers-reduced-motion: reduce) {
      .gauge-progress,
      .gauge-needle {
        transition: none;
      }
    }
  `}}customElements.get(wt)||customElements.define(wt,St),window.customCards=window.customCards??[],window.customCards.some(t=>t.type===wt)||window.customCards.push({type:wt,name:"Moisture Gauge Card",description:"A responsive 270° soil-moisture dial",preview:!0,documentationURL:"https://github.com/bardagi/ha-horizontal-gauge",getEntitySuggestion:(t,e)=>{const i=t.states[e];return e.startsWith("sensor.")&&"moisture"===i?.attributes.device_class?{config:{type:At,entity:e}}:null}});export{St as MoistureGaugeCard};
