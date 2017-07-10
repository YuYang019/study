/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 57);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(26)('wks')
  , uid        = __webpack_require__(17)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(9)
  , IE8_DOM_DEFINE = __webpack_require__(36)
  , toPrimitive    = __webpack_require__(20)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(11)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(3)
  , createDesc = __webpack_require__(15);
module.exports = __webpack_require__(4) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(14)
  , hide      = __webpack_require__(5)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(40)
  , defined = __webpack_require__(16);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(10);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(39)
  , enumBugKeys = __webpack_require__(27);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(62);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(9)
  , dPs         = __webpack_require__(74)
  , enumBugKeys = __webpack_require__(27)
  , IE_PROTO    = __webpack_require__(25)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(37)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(75).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(3).f
  , has = __webpack_require__(7)
  , TAG = __webpack_require__(1)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(10);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(16);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(24)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(26)('keys')
  , uid    = __webpack_require__(17);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(29)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(47)
  , hide           = __webpack_require__(5)
  , has            = __webpack_require__(7)
  , Iterators      = __webpack_require__(13)
  , $iterCreate    = __webpack_require__(80)
  , setToStringTag = __webpack_require__(19)
  , getPrototypeOf = __webpack_require__(81)
  , ITERATOR       = __webpack_require__(1)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(17)('meta')
  , isObject = __webpack_require__(10)
  , has      = __webpack_require__(7)
  , setDesc  = __webpack_require__(3).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(11)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(2)
  , core           = __webpack_require__(0)
  , LIBRARY        = __webpack_require__(29)
  , wksExt         = __webpack_require__(30)
  , defineProperty = __webpack_require__(3).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(14)
  , call        = __webpack_require__(98)
  , isArrayIter = __webpack_require__(99)
  , anObject    = __webpack_require__(9)
  , toLength    = __webpack_require__(23)
  , getIterFn   = __webpack_require__(100)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(4) && !__webpack_require__(11)(function(){
  return Object.defineProperty(__webpack_require__(37)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(10)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(63), __esModule: true };

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(7)
  , toIObject    = __webpack_require__(8)
  , arrayIndexOf = __webpack_require__(65)(false)
  , IE_PROTO     = __webpack_require__(25)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(22);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(6)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(11);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(8)
  , gOPN      = __webpack_require__(43).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(39)
  , hiddenKeys = __webpack_require__(27).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * 依赖容器Dep
 */

var uid = 0;

/**
 * 构造函数
 */
function Dep() {
	this.id = uid++;
	this.subs = [];
}

// 全局的watcher
Dep.target = null;

// sub 是一个 watcher
Dep.prototype.addSub = function (sub) {
	this.subs.push(sub);
};

Dep.prototype.depend = function () {
	// 注意Dep.target是一个watcher
	// 将watcher添加进dep
	Dep.target.addDep(this);
};

Dep.prototype.notify = function () {
	this.subs.forEach(function (sub) {
		sub.update();
	});
};

exports.default = Dep;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = __webpack_require__(76);

var _typeof3 = _interopRequireDefault(_typeof2);

exports.isObject = isObject;
exports.isArray = isArray;
exports.toArray = toArray;
exports.extend = extend;
exports.hasProto = hasProto;
exports.isElementNode = isElementNode;
exports.isTextNode = isTextNode;
exports.isDirective = isDirective;
exports.isEventDirective = isEventDirective;
exports.getDir = getDir;
exports.nodeToFragment = nodeToFragment;
exports.replace = replace;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isObject(obj) {
	return obj !== null && (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object';
}

function isArray(array) {
	return Object.prototype.toString.call(array) === '[object Array]';
}

function toArray(arrayLike) {
	var i = arrayLike.length;
	var arr = new Array(i);

	while (i--) {
		arr[i] = arrayLike[i];
	}

	return arr;
}

function extend(to, from) {
	for (var key in from) {
		to[key] = from[key];
	}
	return to;
}

function hasProto() {
	return '__proto__' in {};
}

function isElementNode(node) {
	return node.nodeType === 1;
}

function isTextNode(node) {
	return node.nodeType === 3;
}

function isDirective(attr) {
	return attr.indexOf('v-') === 0 || attr.indexOf('@') === 0;
}

// on:click/click
function isEventDirective(dir) {
	return dir.indexOf('on:') === 0 || dir === 'click';
}

// v-on:click , @click , v-model , 三种情况， 返回 v- 之后的或者 click
function getDir(attrName) {
	return attrName.indexOf('@') === 0 ? attrName.substring(1) : attrName.substring(2);
}

function nodeToFragment(el) {
	var fragment = document.createDocumentFragment();
	var child = el.firstChild;
	while (child) {
		fragment.appendChild(child); //注意append之后，el里的原节点会消失
		child = el.firstChild;
	}
	return fragment;
}

function replace(oldnode, newnode) {
	var parent = oldnode.parentNode;

	if (parent) {
		parent.replaceChild(newnode, oldnode);
	}
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(79)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(28)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(82);
var global        = __webpack_require__(2)
  , hide          = __webpack_require__(5)
  , Iterators     = __webpack_require__(13)
  , TO_STRING_TAG = __webpack_require__(1)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(22);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 52 */
/***/ (function(module, exports) {



/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(5);
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(22)
  , TAG = __webpack_require__(1)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.parseExp = parseExp;
exports.parseText = parseText;
exports.processToken = processToken;
/**
 * 解析表达式，返回res对象
 * @param  {String} exp 表达式
 * @return {Object} res 
 */
function parseExp(exp) {
	var res = { exp: exp };
	res.get = makeGetterFn('scope.' + exp);

	function makeGetterFn(body) {
		try {
			return new Function('scope', 'return ' + body + ';');
		} catch (e) {
			return function () {};
		}
	}

	return res;
}

/**
 * 解析文本，返回tokens
 * @param  {String} text 文本
 * @return {Array} tokens
 */
function parseText(text) {
	var reg = /\{\{((?:.)+?)\}\}/g;
	var tokens = [];
	var match = void 0,
	    index = void 0,
	    lastIndex = void 0,
	    value = void 0;
	var oneTime = true;

	while (match = reg.exec(text)) {
		index = match.index; // 第一次匹配到的index

		// 如果第一次，且index不为0则说明是类似 asdd{{user.name}} 这样的形式
		// 所以把开头的字符串加入tokens
		if (index !== 0 && oneTime) {
			tokens.push({
				value: text.slice(0, index)
			});
			oneTime = false;
		}

		// index是第一次匹配模板{{}}时的index
		// lastindex是下一次匹配到模板的index
		// 如果index > lastindex 说明两个模板之间有普通的文本，所以把该文本输出		
		if (index > lastIndex) {
			tokens.push({
				value: text.slice(lastIndex, index)
			});
		}

		value = match[1]; // user.a

		tokens.push({
			tag: true,
			value: value.trim()
		});
		//lastindex应该是index加上模板的长度
		lastIndex = index + match[0].length; // 0 + '{{user.a}}'.length
	}

	if (lastIndex < text.length) {
		tokens.push({
			value: text.slice(lastIndex)
		});
	}

	return tokens;
}

function processToken(token) {
	var el = void 0;

	el = document.createTextNode(' ');

	token.descriptor = {
		type: 'text',
		node: el,
		exp: token.value
	};

	return el;
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(58);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(59);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _index2.default({
	el: '#app',
	data: {
		count: 0,
		msg: '',
		user: {
			name: 'maoyuyang'
		},
		array: [1, 2, 3]
	},
	methods: {
		add: function add() {
			this.count++;
		}
	}
});

window.app = app;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty = __webpack_require__(35);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = __webpack_require__(38);

var _keys2 = _interopRequireDefault(_keys);

var _observer = __webpack_require__(67);

var _compile = __webpack_require__(92);

var _compile2 = _interopRequireDefault(_compile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 2017/7/2
 * 极简版Vue，主要学习双向数据绑定的实现
 */

function Vue(options) {
	this._init(options);
}

Vue.prototype._init = function (options) {
	this.$el = document.querySelector(options.el);
	this.$data = options.data;
	this.$methods = options.methods;

	this.proxy(); //把 this.$data.xx 代理到 this.xx 上

	(0, _observer.observe)(this.$data);
	new _compile2.default(this.$el, this);

	//所有事情处理好之后执行mounted函数
	if (options.mounted) options.mounted.call(this);
};

Vue.prototype.proxy = function () {
	var that = this;
	(0, _keys2.default)(this.$data).forEach(function (key) {
		that.proxyKeys(key);
	});
};

Vue.prototype.proxyKeys = function (key) {
	var that = this;
	(0, _defineProperty2.default)(this, key, {
		enumerable: true,
		configrable: true,
		get: function proxyGetter() {
			return that.$data[key];
		},
		set: function proxySetter(newVal) {
			that.$data[key] = newVal;
		}
	});
};

exports.default = Vue;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(61);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(6);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(4), 'Object', {defineProperty: __webpack_require__(3).f});

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(64);
module.exports = __webpack_require__(0).Object.keys;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(21)
  , $keys    = __webpack_require__(12);

__webpack_require__(41)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(8)
  , toLength  = __webpack_require__(23)
  , toIndex   = __webpack_require__(66);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(24)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = __webpack_require__(38);

var _keys2 = _interopRequireDefault(_keys);

var _getOwnPropertyNames = __webpack_require__(68);

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _create = __webpack_require__(71);

var _create2 = _interopRequireDefault(_create);

var _defineProperty = __webpack_require__(35);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.observe = observe;

var _dep = __webpack_require__(44);

var _dep2 = _interopRequireDefault(_dep);

var _util = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 观察对象
 */

function def(obj, key, val, enumerable) {
	(0, _defineProperty2.default)(obj, key, {
		value: val,
		enmerable: !!enumerable,
		writable: true,
		configurable: true
	});
}

function indexOf(arr, obj) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) return i;
	}
	return -1;
}

// 数组构造函数的原型，里面包含数组的原生方法，是一个对象
var arrayProto = Array.prototype;

// 创建一个拦截对象，这个对象的原型(__proto__)为arrayProto，用途是拦截数组的push等方法
// 数组调用push等方法改变的话，调用的就是我们定义的方法，而不是原生方法，这样就能实现监听数组的变化
var arrayMethods = (0, _create2.default)(arrayProto)

// 给拦截对象添加自定义的方法
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
	var original = arrayProto[method];
	// 给拦截对象添加我们自定义的push等自定义方法属性
	def(arrayMethods, method, function mutator() {
		var i = arguments.length;
		var args = new Array(i);
		while (i--) {
			args[i] = arguments[i];
		}
		var result = original.apply(this, args);
		var ob = this.__ob__;
		var inserted = void 0;
		switch (method) {
			case 'push':
				inserted = args;
				break;
			case 'unshift':
				inserted = args;
				break;
			case 'splice':
				inserted = args.splice(2);
				break;
		}
		if (inserted) ob.observeArray(inserted);

		console.log(ob);
		ob.dep.notify();
		return result;
	});
});

// def(
// 	arrayProto,
// 	'$set',
// 	function $set (index, val) {
// 		if (index >= this.length) {
// 			this.length = Number(index) + 1
// 		}
// 		return this.splice(index, 1, val)[0]
// 	}
// )

var arrayKeys = (0, _getOwnPropertyNames2.default)(arrayMethods); // 获取键值

/**
 * 观察对象构造函数
 * @param {Object} data 数据对象
 */
function Observer(data) {
	this.data = data;
	this.dep = new _dep2.default();
	def(data, '__ob__', this);
	if ((0, _util.isArray)(data)) {
		var augment = _util.hasProto ? protoAugment // 直接改变 value.__proto__ 
		: copyAugment; // 直接改变本身方法

		// 替换数组的__proto__，拦截原生push等方法，用我们定义的来代替从而能够监听数组变化

		// 当__proto__不可访问时，就循环把我们定义的push等方法一个个加进去
		// 可访问时，就直接把我们构造好的arrayMethods赋值给__proto__，这样数组调用相关方法时
		// 会首先顺着__proto__找到我们定义好的这些方法
		augment(data, arrayMethods, arrayKeys);

		// 遍历数组
		this.observeArray(data);
	} else {
		this.walk(data);
	}
}

Observer.prototype.walk = function (data) {
	(0, _keys2.default)(data).forEach(function (key) {
		defineReactive(data, key, data[key]);
	});
};

Observer.prototype.observeArray = function (items) {
	for (var i = 0, l = items.length; i < l; i++) {
		observe(items[i]);
	}
};

function observe(data, vm) {
	if (!(0, _util.isObject)(data)) return;

	var ob = new Observer(data);

	return ob;
}

function defineReactive(data, key, val) {
	var dep = new _dep2.default();
	var childObj = observe(val);
	(0, _defineProperty2.default)(data, key, {
		enumerable: true,
		configrable: true,
		get: function get() {
			if (_dep2.default.target) {
				// 不能直接这样写，因为我们还需要判断依赖是否重复添加
				// 所以要做进一步处理
				// dep.addSub(Dep.target)
				dep.depend();
				if (childObj) {
					childObj.dep.depend();
				}
				if ((0, _util.isArray)(val)) {
					// 如果是数组，
					for (var i = 0, l = val.length, e; i < l; i++) {
						e = val[i];
						e && e.__ob__ && e.__ob__.dep.depend();
					}
				}
			}
			return val;
		},
		set: function set(newVal) {
			if (val === newVal) return;
			val = newVal;
			childObj = observe(newVal);
			dep.notify();
		}
	});
}

function copyAugment(target, src, keys) {
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		def(target, key, src[key]);
	}
}

function protoAugment(target, src) {
	target.__proto__ = src;
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
var $Object = __webpack_require__(0).Object;
module.exports = function getOwnPropertyNames(it){
  return $Object.getOwnPropertyNames(it);
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(41)('getOwnPropertyNames', function(){
  return __webpack_require__(42).f;
});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(73);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(6)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(18)});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(3)
  , anObject = __webpack_require__(9)
  , getKeys  = __webpack_require__(12);

module.exports = __webpack_require__(4) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(77);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(84);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(78), __esModule: true };

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(46);
__webpack_require__(48);
module.exports = __webpack_require__(30).f('iterator');

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(24)
  , defined   = __webpack_require__(16);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(18)
  , descriptor     = __webpack_require__(15)
  , setToStringTag = __webpack_require__(19)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(5)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(7)
  , toObject    = __webpack_require__(21)
  , IE_PROTO    = __webpack_require__(25)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(83)
  , step             = __webpack_require__(49)
  , Iterators        = __webpack_require__(13)
  , toIObject        = __webpack_require__(8);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(28)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(86);
__webpack_require__(52);
__webpack_require__(90);
__webpack_require__(91);
module.exports = __webpack_require__(0).Symbol;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(2)
  , has            = __webpack_require__(7)
  , DESCRIPTORS    = __webpack_require__(4)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(47)
  , META           = __webpack_require__(31).KEY
  , $fails         = __webpack_require__(11)
  , shared         = __webpack_require__(26)
  , setToStringTag = __webpack_require__(19)
  , uid            = __webpack_require__(17)
  , wks            = __webpack_require__(1)
  , wksExt         = __webpack_require__(30)
  , wksDefine      = __webpack_require__(32)
  , keyOf          = __webpack_require__(87)
  , enumKeys       = __webpack_require__(88)
  , isArray        = __webpack_require__(51)
  , anObject       = __webpack_require__(9)
  , toIObject      = __webpack_require__(8)
  , toPrimitive    = __webpack_require__(20)
  , createDesc     = __webpack_require__(15)
  , _create        = __webpack_require__(18)
  , gOPNExt        = __webpack_require__(42)
  , $GOPD          = __webpack_require__(89)
  , $DP            = __webpack_require__(3)
  , $keys          = __webpack_require__(12)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(43).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(33).f  = $propertyIsEnumerable;
  __webpack_require__(50).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(29)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(5)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(12)
  , toIObject = __webpack_require__(8);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(12)
  , gOPS    = __webpack_require__(50)
  , pIE     = __webpack_require__(33);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(33)
  , createDesc     = __webpack_require__(15)
  , toIObject      = __webpack_require__(8)
  , toPrimitive    = __webpack_require__(20)
  , has            = __webpack_require__(7)
  , IE8_DOM_DEFINE = __webpack_require__(36)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(4) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(32)('asyncIterator');

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(32)('observable');

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _watcher = __webpack_require__(93);

var _watcher2 = _interopRequireDefault(_watcher);

var _util = __webpack_require__(45);

var _parse = __webpack_require__(56);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 构造函数
 * @param {DOM} el DOM节点
 * @param {Vue} vm vm实例
 */
function Compile(el, vm) {
	this.vm = vm;
	this.el = el;
	this.fragment = null;

	this._init();
} /**
   * 编译解析html
   */

Compile.prototype._init = function () {
	if (this.el) {
		this.fragment = (0, _util.nodeToFragment)(this.el);
		this.compile(this.fragment);
		this.el.appendChild(this.fragment);
	} else {
		console.error('DOM节点不存在');
	}
};

Compile.prototype.compile = function (el) {
	var child = el.childNodes;
	var that = this;
	//[].slice 建立副本
	[].slice.call(child).forEach(function (node) {
		var reg = /\{\{(.*)\}\}/;
		var text = node.textContent;

		if ((0, _util.isElementNode)(node)) {
			that.compileElement(node);
		} else if ((0, _util.isTextNode)(node) && reg.test(text)) {
			that.compileText(node, text);
		}

		// 递归遍历
		if (node.childNodes && node.childNodes.length) {
			that.compile(node);
		}
	});
};

Compile.prototype.compileElement = function (node) {
	var attrs = node.attributes;
	var that = this;
	Array.prototype.forEach.call(attrs, function (attr) {
		var attrName = attr.name;
		if ((0, _util.isDirective)(attrName)) {
			var exp = attr.value; //v-on:click = "abc",取得methods函数名abc
			var dir = (0, _util.getDir)(attrName);
			if ((0, _util.isEventDirective)(dir)) {
				that.compileEvent(node, that.vm, exp, dir);
			} else {
				// v-model
				that.compileModel(node, that.vm, exp, dir);
			}
			node.removeAttribute(attrName);
		}
	});
};

Compile.prototype.compileText = function (node, text) {
	var that = this;
	var frag = document.createDocumentFragment();
	var el = void 0,
	    token = void 0;

	var tokens = (0, _parse.parseText)(text); // 解析文本获得tokens

	if (!tokens) return null;

	for (var i = 0; i < tokens.length; i++) {
		token = tokens[i];
		el = token.tag ? (0, _parse.processToken)(token) : document.createTextNode(token.value);
		frag.appendChild(el);
	}

	return makeTextNodeLinkFn.call(this, tokens, frag, node, this.vm);
};

Compile.prototype.compileEvent = function (node, vm, exp, dir) {
	var eventType = dir.indexOf(':') === -1 ? dir : dir.split(':')[1]; // on:click,取得click，或者直接为click
	var cb = vm.$methods && vm.$methods[exp];

	if (eventType && cb) {
		node.addEventListener(eventType, cb.bind(vm), false);
	}
};

// v-model = "abc", 这个abc是在data里的
Compile.prototype.compileModel = function (node, vm, exp, dir) {
	var that = this;
	var val = this.vm[exp];

	this.modelUpdater(node, val);
	new _watcher2.default(this.vm, exp, function () {
		that.modelUpdater(node, this.value);
	});

	node.addEventListener('input', function (e) {
		var newVal = e.target.value;
		if (val === newVal) return;
		that.vm[exp] = newVal;
		val = newVal;
	});
};

Compile.prototype.updateText = function (node, val) {
	node.textContent = val ? val : '';
};

Compile.prototype.modelUpdater = function (node, val) {
	node.value = val ? val : '';
};

/**
 * 将建立的frag替换原text，并创建watcher
 * @param  {Array} tokens 解析出来的文本对象
 * @param  {Fragment} frag   建立的文档碎片
 * @param  {DOM} node   原text节点
 * @param  {Vue} vm     vm实例
 */
function makeTextNodeLinkFn(tokens, frag, node, vm) {
	var that = this; // that指向Compile
	// var fragClone = frag.cloneNode(true)
	var childNodes = (0, _util.toArray)(frag.childNodes);

	var _loop = function _loop(i, l) {
		var token = tokens[i];
		var exp = token.value;
		var des = token.descriptor; //记录着存模板的节点，更新时需要这个节点

		if (token.tag) {
			var watcher = new _watcher2.default(vm, exp, function () {
				that.updateText(des.node, this.value);
				console.log('更新DOM了' + exp + ' ' + this.value);
			});

			console.dir(des.node);

			that.updateText(des.node, watcher.value);
		}
	};

	for (var i = 0, l = tokens.length; i < l; i++) {
		_loop(i, l);
	}

	(0, _util.replace)(node, frag);
}

exports.default = Compile;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _set = __webpack_require__(94);

var _set2 = _interopRequireDefault(_set);

var _batcher = __webpack_require__(109);

var _batcher2 = _interopRequireDefault(_batcher);

var _dep = __webpack_require__(44);

var _dep2 = _interopRequireDefault(_dep);

var _parse = __webpack_require__(56);

var _util = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 观察者
 */

var $uid = 0;
var batcher = new _batcher2.default();

/**
 * 构造函数
 * @param {Vue}   vm  vue实例
 * @param {String}   exp 表达式
 * @param {Function} cb  更新函数
 */
function Watcher(vm, exp, cb) {
	this.id = ++$uid;
	this.cb = cb;
	this.vm = vm;
	this.exp = exp;
	this.deps = [];
	this.newDeps = [];
	this.depIds = new _set2.default();
	this.newDepIds = new _set2.default();

	// 把exp转换一下，比如user.a 变成一个匿名函数，return scope.user.a
	// 求值的时候，scope = vm, 就能获取 vm.user.a，这样不需要用原来的递归，
	// 而且还完美解决了隐式添加依赖的问题
	var res = (0, _parse.parseExp)(exp);
	this.getter = res.get;

	this.value = this.get(); //把自己添加进依赖中
}

Watcher.prototype.update = function () {
	this.run();
};

Watcher.prototype.getId = function () {
	return this.id;
};

Watcher.prototype.get = function () {
	this.beforeGet();

	var scope = this.vm;
	// 传入scope获取值
	var value = this.getter.call(scope, scope);

	this.afterGet();

	return value;
};

Watcher.prototype.run = function () {
	var value = this.get();
	var oldVal = this.value;

	//如果两者不等或者这个值是一个对象
	if (value !== oldVal || (0, _util.isObject)(value)) {
		this.value = value;
		// 批处理更新
		batcher.push(this);
	}
};

Watcher.prototype.beforeGet = function () {
	_dep2.default.target = this;
};

Watcher.prototype.afterGet = function () {
	_dep2.default.target = null;

	// 为了让dep.subs里的watcher不重复
	var tmp = this.depIds;
	this.depIds = this.newDepIds;
	this.newDepIds = tmp;
	this.newDepIds.clear();
};

// 传进来的是一个dep，它是当前数据的依赖容器，储存着一个个watcher
Watcher.prototype.addDep = function (dep) {
	var id = dep.id;

	// 源码写法，让watcher不重复的核心逻辑
	if (!this.newDepIds.has(id)) {
		this.newDepIds.add(id);
		this.newDeps.push(id);
		// 只有当depIds里没有这个watcher才添加
		if (!this.depIds.has(id)) {
			dep.addSub(this);
		}
	}
};

exports.default = Watcher;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(95), __esModule: true };

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(52);
__webpack_require__(46);
__webpack_require__(48);
__webpack_require__(96);
__webpack_require__(106);
module.exports = __webpack_require__(0).Set;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(97);

// 23.2 Set Objects
module.exports = __webpack_require__(102)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(3).f
  , create      = __webpack_require__(18)
  , redefineAll = __webpack_require__(53)
  , ctx         = __webpack_require__(14)
  , anInstance  = __webpack_require__(54)
  , defined     = __webpack_require__(16)
  , forOf       = __webpack_require__(34)
  , $iterDefine = __webpack_require__(28)
  , step        = __webpack_require__(49)
  , setSpecies  = __webpack_require__(101)
  , DESCRIPTORS = __webpack_require__(4)
  , fastKey     = __webpack_require__(31).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(9);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(13)
  , ITERATOR   = __webpack_require__(1)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(55)
  , ITERATOR  = __webpack_require__(1)('iterator')
  , Iterators = __webpack_require__(13);
module.exports = __webpack_require__(0).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(2)
  , core        = __webpack_require__(0)
  , dP          = __webpack_require__(3)
  , DESCRIPTORS = __webpack_require__(4)
  , SPECIES     = __webpack_require__(1)('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(2)
  , $export        = __webpack_require__(6)
  , meta           = __webpack_require__(31)
  , fails          = __webpack_require__(11)
  , hide           = __webpack_require__(5)
  , redefineAll    = __webpack_require__(53)
  , forOf          = __webpack_require__(34)
  , anInstance     = __webpack_require__(54)
  , isObject       = __webpack_require__(10)
  , setToStringTag = __webpack_require__(19)
  , dP             = __webpack_require__(3).f
  , each           = __webpack_require__(103)(0)
  , DESCRIPTORS    = __webpack_require__(4);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(14)
  , IObject  = __webpack_require__(40)
  , toObject = __webpack_require__(21)
  , toLength = __webpack_require__(23)
  , asc      = __webpack_require__(104);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(105);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(10)
  , isArray  = __webpack_require__(51)
  , SPECIES  = __webpack_require__(1)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(6);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(107)('Set')});

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(55)
  , from    = __webpack_require__(108);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(34);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * 批处理类构造函数
 */

function Batcher() {
	this.reset();
}

Batcher.prototype.reset = function () {
	this.has = {};
	this.queue = [];
	this.waiting = false;
};

/**
 * 推入队列
 * @param  {Watcher} job 
 */
Batcher.prototype.push = function (job) {
	var that = this;
	if (!this.has[job.id]) {
		this.queue.push(job);
		this.has[job.id] = job;
		if (!this.waiting) {
			this.waiting = true;
			// 等待主线程空了再执行
			setTimeout(function () {
				that.flush();
			}, 0);
		}
	}
};

/**
 * 冲洗函数，依次调用队列里watcher的更新函数
 */
Batcher.prototype.flush = function () {
	this.queue.forEach(function (job) {
		job.cb.call(job);
	});
	this.reset();
};

exports.default = Batcher;

/***/ })
/******/ ]);