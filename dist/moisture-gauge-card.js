const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:d}=Object,p=globalThis,m=p.trustedTypes,g=m?m.emptyScript:"",f=p.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[_("elementProperties")]=new Map,y[_("finalized")]=new Map,f?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=t=>t,A=x.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+S,k=`<${T}>`,P=document,M=()=>P.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,N="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,R=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),G=B(1),V=B(2),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),F=new WeakMap,K=P.createTreeWalker(P,129);function Z(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=z;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===z?"!--"===l[1]?r=O:void 0!==l[1]?r=R:void 0!==l[2]?(I.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=o??z,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?j:D):r===j||r===D?r=L:r===O||r===R?r=z:(r=L,o=void 0);const u=r===L&&t[e+1].startsWith("/>")?" ":"";n+=r===z?i+k:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+S+u):i+S+(-2===c?e:u)}return[Z(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=Q.createElement(l,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[n++],i=s.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?st:"@"===r[1]?ot:et}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),K.nextNode(),a.push({type:2,index:++o});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:o}),t+=S.length-1}o++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===W)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=U(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=X(t,o._$AS(t,e.values),o,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);K.currentNode=s;let o=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new tt(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=K.nextNode(),n++)}return K.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),U(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Q(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new tt(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=X(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=X(this,s[i+r],e,r),a===W&&(a=this._$AH[r]),n||=!U(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class ot extends et{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??q)===W)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(Q,tt),(x.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new tt(e.insertBefore(M(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ht=40,ut=70,dt=new Set(["compact","simple","volvo"]);function pt(t,e,i){const s=e??i;if("number"!=typeof s||!Number.isFinite(s))throw new Error(`${t} must be a finite number`);return s}function mt(t){if(!t||"object"!=typeof t)throw new Error("Card configuration is required");if("string"!=typeof t.entity||""===t.entity.trim())throw new Error("Specify a sensor entity");if(void 0!==t.name&&"string"!=typeof t.name)throw new Error("name must be a string");if(void 0!==t.unit&&"string"!=typeof t.unit)throw new Error("unit must be a string");if(void 0!==t.layout&&!dt.has(t.layout))throw new Error("layout must be compact, simple, or volvo");if(void 0!==t.optimal&&(null===t.optimal||"object"!=typeof t.optimal))throw new Error("optimal must contain min and max values");const e=pt("min",t.min,0),i=pt("max",t.max,100),s=pt("optimal.min",t.optimal?.min,ht),o=pt("optimal.max",t.optimal?.max,ut),n=pt("buffer",t.buffer,5);if(e>=i)throw new Error("min must be less than max");if(s>o)throw new Error("optimal.min must be less than or equal to optimal.max");if(n<0)throw new Error("buffer must be greater than or equal to zero");return{...t,entity:t.entity.trim(),layout:t.layout??"simple",min:e,max:i,optimal:{min:s,max:o},buffer:n,tap_action:t.tap_action??{action:"more-info"},hold_action:t.hold_action??{action:"none"},double_tap_action:t.double_tap_action??{action:"none"}}}const gt="M 48 76 H 592";function ft(t,e,i){return Math.min(Math.max(t,e),i)}function _t(t,e=76){return{x:48+544*ft(t,0,1),y:e}}function vt(t){if(!t||"string"!=typeof t.state)return null;const e=t.state.trim();if(""===e)return null;const i=Number(e);return Number.isFinite(i)?i:null}function $t(t,e){return new Intl.NumberFormat(t.language||void 0,{maximumFractionDigits:3}).format(e)}const bt="moisture-gauge-card",yt="moisture-gauge-card-editor",xt=`custom:${bt}`,wt=[0,.125,.25,.375,.5,.625,.75,.875,1],At=new Set([0,.25,.5,.75,1]);function Et(t){return Boolean(t?.action&&"none"!==t.action)}function Ct(t){return"compact"===t?1:"volvo"===t?3:2}class St extends lt{constructor(){super(...arguments),this._holdTriggered=!1}static{this.properties={hass:{attribute:!1},config:{state:!0}}}static getConfigForm(){const t=["more-info","navigate","url","perform-action","assist","none"];return{schema:[{name:"entity",required:!0,selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"compact",label:"Compact"},{value:"simple",label:"Simple"},{value:"volvo",label:"Volvo"}]}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"unit",selector:{text:{}}}]},{type:"grid",name:"",schema:[{name:"min",selector:{number:{mode:"box"}}},{name:"max",selector:{number:{mode:"box"}}},{name:"buffer",selector:{number:{mode:"box",min:0}}}]},{type:"expandable",name:"optimal",title:"Optimal range",schema:[{name:"min",selector:{number:{mode:"box"}}},{name:"max",selector:{number:{mode:"box"}}}]},{type:"expandable",name:"interactions",title:"Interactions",flatten:!0,schema:[{name:"tap_action",selector:{ui_action:{actions:t,default_action:"more-info"}},context:{entity:"entity"}},{name:"hold_action",selector:{ui_action:{actions:t,default_action:"none"}},context:{entity:"entity"}},{name:"double_tap_action",selector:{ui_action:{actions:t,default_action:"none"}},context:{entity:"entity"}}]}],computeLabel:t=>({entity:"Moisture sensor",layout:"Layout",name:"Name",unit:"Unit",min:"Minimum",max:"Maximum",buffer:"Warning buffer",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action"}[t.name]),computeHelper:t=>{if("buffer"===t.name)return"Warning-zone width in the sensor's unit"},assertConfig:t=>{mt(t)}}}static getConfigElement(){return document.createElement(yt)}static getStubConfig(t,e=[],i=[]){const s=[...new Set([...e,...i,...Object.keys(t.states)])].filter(t=>t.startsWith("sensor.")),o=s.find(e=>"moisture"===t.states[e]?.attributes.device_class),n=s.find(e=>null!==vt(t.states[e]));return{entity:o??n??s[0]??""}}setConfig(t){this.config=mt(t)}getCardSize(){return Ct(this.config?.layout)}getGridOptions(){const t=Ct(this.config?.layout);return{rows:t,columns:6,min_rows:t,min_columns:3}}disconnectedCallback(){this._clearGestureTimers(),super.disconnectedCallback()}shouldUpdate(t){if(t.has("config"))return!0;if(!t.has("hass"))return!1;const e=t.get("hass");return!(e&&this.hass&&this.config)||(e.states[this.config.entity]!==this.hass.states[this.config.entity]||e.language!==this.hass.language||e.entities!==this.hass.entities)}render(){if(!this.hass||!this.config)return q;const t=this.hass.states[this.config.entity],e=vt(t),i=null===e?0:function(t,e,i){if(![t,e,i].every(Number.isFinite))throw new Error("Gauge values must be finite");if(e>=i)throw new Error("Gauge minimum must be less than maximum");return ft((t-e)/(i-e),0,1)}(e,this.config.min,this.config.max),s=function(t,e,i,s){const o="string"==typeof e?.attributes.unit_of_measurement?e.attributes.unit_of_measurement:void 0;if(null===i||!e)return{value:"—",unit:void 0!==s.unit?s.unit:o??"%"};const n=t.formatEntityStateToParts?.(e)??[],r=n.filter(t=>"unit"!==t.type).map(t=>t.value).join("").trim(),a=n.filter(t=>"unit"===t.type).map(t=>t.value).join("").trim();return{value:r||$t(t,i),unit:void 0!==s.unit?s.unit:a||o||"%"}}(this.hass,t,e,this.config),o=function(t,e,i){return void 0!==i.name?i.name:e?t.formatEntityName?.(e,void 0)??("string"==typeof e.attributes.friendly_name?e.attributes.friendly_name:i.entity):i.entity}(this.hass,t,this.config),n=function(t,e,i,s){if(!e)return t.localize?.("ui.panel.lovelace.warning.entity_not_found","entity",s)||`Entity not found: ${s}`;if(null!==i)return null;const o=t.formatEntityState?.(e)||e.state;return"unknown"===e.state||"unavailable"===e.state?o:`Invalid numeric state: ${o}`}(this.hass,t,e,this.config.entity),r=null===e?"unavailable":function(t,e,i){return t<e.min-i||t>e.max+i?"critical":t<e.min||t>e.max?"warning":"optimal"}(e,this.config.optimal,this.config.buffer),a=100*i,l=_t(i),c=function(t,e){return null===t?"Unavailable":t<e.min?"Below optimal":t>e.max?"Above optimal":"Optimal"}(e,this.config.optimal),h=s.unit?`${s.value} ${s.unit}`:s.value,u=n?`${o}: ${n}`:`${o}: ${h}, ${c}`,d=this.config.layout;return G`
      <ha-card
        class="interactive layout-${d}"
        role="button"
        tabindex="0"
        aria-label=${u}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @keydown=${this._onKeyDown}
        @contextmenu=${this._onContextMenu}
      >
        ${"compact"===d?this._renderCompactGauge(a,l.x,r,e):"simple"===d?this._renderSimpleGauge(a,l.x,r,e,o,s,c,n):this._renderVolvoGauge(a,l.x,r,e,o,s,n)}
      </ha-card>
    `}_renderCompactGauge(t,e,i,s){return G`<div class="card-content compact-content">
      ${this._renderMinimalGauge(t,e,i,s)}
    </div>`}_renderSimpleGauge(t,e,i,s,o,n,r,a){return G`<div class="card-content simple-content">
      <div class="simple-header">
        <h2 class="simple-title">${o}</h2>
        <div class="simple-readout">
          <span class="simple-value">${n.value}</span>
          ${n.unit&&null!==s?G`<span class="simple-unit">${n.unit}</span>`:q}
        </div>
        <div class="simple-status ${i}" role="status">${r}</div>
      </div>
      ${this._renderMinimalGauge(t,e,i,s)}
      ${a&&a!==r?G`<div class="state-problem simple-problem">${a}</div>`:q}
    </div>`}_renderMinimalGauge(t,e,i,s){return G`<svg
      class="minimal-gauge"
      viewBox="0 46 640 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      ${this._renderTrackAndPointer(t,e,i,s)}
    </svg>`}_renderVolvoGauge(t,e,i,s,o,n,r){return G`<div class="card-content volvo-content">
      <div class="instrument">
        <div class="scale-face">
          <svg
            class="volvo-gauge"
            viewBox="0 0 640 104"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            ${this._renderTrackAndPointer(t,e,i,s,!0)}
          </svg>
        </div>
        <div class="instrument-lower">
          <h2 class="card-title">${o}</h2>
          ${this._renderMoistureLamp(i)}
          <div class="readout">
            <span class="gauge-value">${n.value}</span>
            ${n.unit&&null!==s?G`<span class="gauge-unit">${n.unit}</span>`:q}
          </div>
          ${r?G`<div class="state-problem" role="status">${r}</div>`:q}
        </div>
      </div>
    </div>`}_renderTrackAndPointer(t,e,i,s,o=!1){return V`
      <path class="gauge-track" d=${gt} pathLength="100"></path>
      <path
        class="gauge-progress ${i}"
        d=${gt}
        pathLength="100"
        style=${`stroke-dasharray: ${t} 100; opacity: ${null===s||0===t?0:1}`}
      ></path>
      ${o?wt.map(t=>{const e=_t(t),i=At.has(t),s=this.config.min+(this.config.max-this.config.min)*t;return V`<line
                class="gauge-tick ${i?"major":"minor"}"
                x1=${e.x}
                y1=${i?66:70}
                x2=${e.x}
                y2="87"
              ></line>
              ${i?V`<text class="scale-number" x=${e.x} y="43">
                    ${function(t,e){return new Intl.NumberFormat(e,{maximumFractionDigits:2}).format(t)}(s,this.hass.language)}
                  </text>`:q}`}):q}
      <line
        class="gauge-indicator ${i} ${null===s?"unavailable":""}"
        x1=${e}
        y1="56"
        x2=${e}
        y2="91"
      ></line>
      <path
        class="gauge-pointer ${i} ${null===s?"unavailable":""}"
        d=${function(t){const{x:e}=_t(t);return`M ${e-8} 53 H ${e+8} L ${e} 67 Z`}(t/100)}
      ></path>
    `}_renderMoistureLamp(t){return G`<div class="moisture-lamp ${t}" aria-hidden="true">
      <svg class="moisture-lamp-icon" viewBox="0 0 24 24">
        <path
          d="M12 2.5C9.8 6 5.5 10.4 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10.4 14.2 6 12 2.5Z"
        ></path>
      </svg>
      <span>Moisture</span>
    </div>`}_onPointerDown(t){0===t.button&&this.config&&(this._holdTriggered=!1,t.currentTarget instanceof HTMLElement&&t.currentTarget.setPointerCapture?.(t.pointerId),Et(this.config.hold_action)&&(this._holdTimer=window.setTimeout(()=>{this._holdTriggered=!0,this._runAction("hold")},500)))}_onPointerUp(t){if(0===t.button&&this.config&&(this._clearHoldTimer(),t.currentTarget instanceof HTMLElement&&t.currentTarget.releasePointerCapture?.(t.pointerId),!this._holdTriggered)){if(Et(this.config.double_tap_action))return void 0!==this._tapTimer?(window.clearTimeout(this._tapTimer),this._tapTimer=void 0,void this._runAction("double_tap")):void(this._tapTimer=window.setTimeout(()=>{this._tapTimer=void 0,this._runAction("tap")},250));this._runAction("tap")}}_onPointerCancel(){this._clearHoldTimer(),this._holdTriggered=!1}_onKeyDown(t){"Enter"!==t.key&&" "!==t.key||t.repeat||(t.preventDefault(),this._runAction("tap"))}_onContextMenu(t){this.config&&Et(this.config.hold_action)&&t.preventDefault()}_runAction(t){this.hass&&this.config&&this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:this.config,action:t}}))}_clearHoldTimer(){void 0!==this._holdTimer&&(window.clearTimeout(this._holdTimer),this._holdTimer=void 0)}_clearGestureTimers(){this._clearHoldTimer(),void 0!==this._tapTimer&&(window.clearTimeout(this._tapTimer),this._tapTimer=void 0)}static{this.styles=n`
    :host {
      display: block;
      --gauge-width: 640px;
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
      padding: 10px;
    }

    .compact-content {
      padding: 8px 12px;
    }

    .simple-content {
      padding: 10px 12px;
    }

    .minimal-gauge,
    .simple-header {
      box-sizing: border-box;
      width: min(100%, var(--gauge-width));
      margin-inline: auto;
    }

    .minimal-gauge {
      display: block;
      aspect-ratio: 640 / 48;
    }

    .simple-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 8px;
      align-items: center;
      padding-inline: 7.5%;
    }

    .simple-title {
      min-width: 0;
      margin: 0;
      overflow: hidden;
      color: var(--primary-text-color, #212121);
      font-size: 15px;
      font-weight: 500;
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .simple-readout {
      display: flex;
      align-items: baseline;
      gap: 3px;
      color: var(--primary-text-color, #212121);
      font-variant-numeric: tabular-nums;
    }

    .simple-value {
      font-size: 18px;
      font-weight: 600;
    }

    .simple-unit {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      font-weight: 500;
    }

    .simple-status {
      padding: 2px 7px;
      border: 1px solid currentColor;
      border-radius: 999px;
      color: var(--gauge-zone-color);
      font-size: 11px;
      font-weight: 600;
      line-height: 18px;
      white-space: nowrap;
    }

    .simple-status.unavailable {
      color: var(--disabled-text-color, #9e9e9e);
    }

    .simple-problem {
      width: min(100%, var(--gauge-width));
      margin: 2px auto 0;
      padding-inline: 7.5%;
    }

    .instrument {
      box-sizing: border-box;
      width: min(100%, var(--gauge-width));
      height: var(--gauge-height);
      margin-inline: auto;
      overflow: hidden;
      border: 3px solid
        var(--moisture-gauge-bezel-color, rgba(160, 164, 166, 0.9));
      border-radius: 14px;
      background: var(
        --moisture-gauge-panel-color,
        var(--secondary-background-color, #d8d4c8)
      );
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.45),
        inset 0 -2px 5px rgba(0, 0, 0, 0.14);
    }

    .scale-face {
      margin: 7px 7px 0;
      overflow: hidden;
      background: var(--moisture-gauge-face-color, #17191b);
      clip-path: polygon(2.5% 0, 97.5% 0, 100% 100%, 0 100%);
    }

    .card-title {
      min-width: 0;
      margin: 0;
      overflow: hidden;
      color: var(--primary-text-color, #212121);
      font-family: "Roboto Condensed", "Arial Narrow", sans-serif;
      font-size: 13px;
      font-weight: 700;
      line-height: 20px;
      letter-spacing: 0.08em;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .instrument-lower {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 6px 12px;
      align-items: center;
      padding: 9px 13px 10px;
    }

    .volvo-gauge {
      display: block;
      width: 100%;
      aspect-ratio: 640 / 104;
    }

    .gauge-track,
    .gauge-progress {
      fill: none;
      stroke-width: 6;
      stroke-linecap: butt;
    }

    .gauge-track {
      stroke: var(--moisture-gauge-dial-color, #f2f0e8);
      opacity: 0.42;
    }

    .minimal-gauge .gauge-track {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.45));
      opacity: 1;
    }

    .gauge-progress {
      stroke: var(--gauge-zone-color);
      transition:
        stroke-dasharray 300ms ease-out,
        stroke 200ms ease-out;
    }

    .optimal {
      --gauge-zone-color: var(--success-color, #43a047);
    }

    .warning {
      --gauge-zone-color: var(--warning-color, #ffa600);
    }

    .critical {
      --gauge-zone-color: var(--error-color, #db4437);
    }

    .unavailable {
      --gauge-zone-color: var(--disabled-text-color, #9e9e9e);
    }

    .gauge-tick {
      stroke: var(--moisture-gauge-dial-color, #f2f0e8);
    }

    .gauge-tick.major {
      stroke-width: 2.5;
    }

    .gauge-tick.minor {
      stroke-width: 1.5;
      opacity: 0.78;
    }

    .scale-number {
      fill: var(--moisture-gauge-dial-color, #f2f0e8);
      font-family: "Roboto Condensed", "Arial Narrow", sans-serif;
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 1px;
      text-anchor: middle;
    }

    .gauge-indicator {
      fill: none;
      stroke: var(--gauge-zone-color);
      stroke-width: 2.5;
      transition:
        x1 300ms ease-out,
        x2 300ms ease-out,
        opacity 200ms ease-out;
    }

    .gauge-pointer {
      fill: var(--gauge-zone-color);
      stroke: none;
      transition:
        d 300ms ease-out,
        opacity 200ms ease-out;
    }

    .moisture-lamp {
      --moisture-lamp-color: var(--secondary-text-color, #727272);
      display: flex;
      min-height: 30px;
      box-sizing: border-box;
      align-items: center;
      gap: 4px;
      padding: 3px 7px;
      border: 1px solid var(--moisture-lamp-color);
      border-radius: 3px;
      background: var(--moisture-gauge-readout-color, #17191b);
      color: var(--moisture-lamp-color);
      font-family: "Roboto Condensed", "Arial Narrow", sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.06em;
      line-height: 12px;
      opacity: 0.3;
      text-transform: uppercase;
      transition:
        color 200ms ease-out,
        border-color 200ms ease-out,
        box-shadow 200ms ease-out,
        opacity 200ms ease-out;
    }

    .moisture-lamp.warning {
      --moisture-lamp-color: var(--warning-color, #ffa600);
      box-shadow:
        0 0 7px color-mix(in srgb, var(--moisture-lamp-color), transparent 35%),
        inset 0 0 5px
          color-mix(in srgb, var(--moisture-lamp-color), transparent 70%);
      opacity: 1;
    }

    .moisture-lamp.critical {
      --moisture-lamp-color: var(--error-color, #db4437);
      box-shadow:
        0 0 8px color-mix(in srgb, var(--moisture-lamp-color), transparent 25%),
        inset 0 0 5px
          color-mix(in srgb, var(--moisture-lamp-color), transparent 65%);
      opacity: 1;
    }

    .moisture-lamp-icon {
      display: block;
      width: 14px;
      height: 14px;
      flex: 0 0 auto;
      fill: currentColor;
    }

    .gauge-indicator.unavailable,
    .gauge-pointer.unavailable {
      opacity: 0;
    }

    .readout {
      display: flex;
      min-width: 92px;
      min-height: 32px;
      box-sizing: border-box;
      align-items: baseline;
      justify-content: center;
      gap: 4px;
      padding: 3px 9px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      background: var(--moisture-gauge-readout-color, #17191b);
      box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.75);
      color: var(--moisture-gauge-dial-color, #f2f0e8);
      font-variant-numeric: tabular-nums;
    }

    .gauge-value {
      font-family: "Roboto Mono", "Courier New", monospace;
      font-size: 22px;
      font-weight: 600;
      line-height: 24px;
    }

    .gauge-unit {
      font-size: 11px;
      font-weight: 700;
    }

    .state-problem {
      grid-column: 1 / -1;
      max-width: 100%;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 16px;
      overflow-wrap: anywhere;
    }

    @media (prefers-reduced-motion: reduce) {
      .gauge-progress,
      .gauge-indicator,
      .gauge-pointer,
      .moisture-lamp {
        transition: none;
      }
    }
  `}}class Tt extends lt{static{this.properties={hass:{attribute:!1},_config:{state:!0}}}connectedCallback(){if(super.connectedCallback(),!customElements.get("ha-form")){const t=customElements.get("hui-button-card");t?.getConfigElement?.()}}setConfig(t){this._clearConfigChangedTimer(),this._config=t}disconnectedCallback(){this._clearConfigChangedTimer(),super.disconnectedCallback()}render(){if(!this.hass||!this._config)return q;const{schema:t,computeLabel:e,computeHelper:i}=St.getConfigForm();return G`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${t}
        .computeLabel=${e}
        .computeHelper=${i}
        @value-changed=${this._onValueChanged}
      ></ha-form>
    `}_onValueChanged(t){this._config=t.detail.value,this._clearConfigChangedTimer(),this._configChangedTimer=window.setTimeout(()=>{this._configChangedTimer=void 0,this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:this._config}}))},300)}_clearConfigChangedTimer(){void 0!==this._configChangedTimer&&(window.clearTimeout(this._configChangedTimer),this._configChangedTimer=void 0)}}customElements.get(bt)||customElements.define(bt,St),customElements.get(yt)||customElements.define(yt,Tt),window.customCards=window.customCards??[],window.customCards.some(t=>t.type===bt)||window.customCards.push({type:bt,name:"Moisture Gauge Card",description:"A horizontal, vintage-inspired soil-moisture gauge",preview:!0,documentationURL:"https://github.com/bardagi/ha-horizontal-gauge",getEntitySuggestion:(t,e)=>{const i=t.states[e];return e.startsWith("sensor.")&&"moisture"===i?.attributes.device_class?{config:{type:xt,entity:e}}:null}});export{St as MoistureGaugeCard,Tt as MoistureGaugeCardEditor};
