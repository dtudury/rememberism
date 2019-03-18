// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/horsy/lib/mapElement.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapElementToTag = mapElementToTag;
exports.mapElementToName = mapElementToName;

/* global HTMLDivElement HTMLSpanElement */
const mapping = new Map([[HTMLDivElement, 'div'], [HTMLSpanElement, 'span']]);

function mapElementToTag(c) {
  if (c) {
    const name = mapping.get(c);

    if (name) {
      return name;
    }

    return mapElementToTag(Object.getPrototypeOf(c));
  }

  return null;
}

const nameMapping = new Map();
let nameMappingCount = 0;

function mapElementToName(c) {
  if (c.NAME) {
    return c.NAME;
  }

  let name = nameMapping.get(c);

  if (!name) {
    name = `el-${nameMappingCount++}`;
    nameMapping.set(c, name);
  }

  return name;
}
},{}],"../node_modules/horsy/lib/elementHelpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeElement = makeElement;
exports.setAttributes = setAttributes;
exports.setChildren = setChildren;

var _mapElement = require("./mapElement");

/* global Node customElements */
function makeElement(Element, namespaceURI) {
  const customized = (0, _mapElement.mapElementToTag)(Element);
  const name = (0, _mapElement.mapElementToName)(Element);

  if (!customElements.get(name)) {
    customElements.define(name, Element, {
      extends: customized
    });
  }

  if (customized) {
    return document.createElementNS(namespaceURI, customized, {
      is: name
    });
  } else {
    return document.createElementNS(namespaceURI, name);
  }
}

function setAttributes(element, attributes) {
  if (element.setAttributes) {
    element.setAttributes(attributes);
  } else {
    for (const attribute in attributes) {
      const value = attributes[attribute];

      if (typeof value === 'string') {
        element.setAttribute(attribute, value);
      } else {
        element[attribute] = value;
      }
    }
  }

  return element;
}

function setChildren(element, children) {
  function _unpackChildren(children) {
    let expanded = [];
    children.forEach(child => {
      if (child != null) {
        if (Array.isArray(child)) {
          expanded = expanded.concat(_unpackChildren(child));
        } else {
          expanded.push(child);
        }
      }
    });
    return expanded;
  }

  children = _unpackChildren(children);

  if (element.setChildren) {
    element.setChildren(children);
  } else {
    children.forEach((child, index) => {
      if (['string', 'boolean', 'number', 'undefined'].indexOf(typeof child) > -1) {
        child = document.createTextNode(child);
      } else if (!(child instanceof Node)) {
        throw new Error('unhandled child', child);
      }

      const referenceNode = element.childNodes[index];

      if (!referenceNode) {
        element.appendChild(child);
      } else if (child !== referenceNode) {
        element.insertBefore(child, referenceNode);
      }
    });

    while (element.childNodes.length > children.length) {
      element.removeChild(element.lastChild);
    }
  }

  return element;
}
},{"./mapElement":"../node_modules/horsy/lib/mapElement.js"}],"../node_modules/horsy/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = h;

var _elementHelpers = require("./lib/elementHelpers");

let defaultXlmns;

function h(tag, attributes = {}, ...children) {
  let element;

  if (typeof tag === 'function') {
    element = tag(attributes, children, defaultXlmns);
  } else if (typeof tag === 'string') {
    element = document.createElementNS(attributes && attributes.xmlns || defaultXlmns, tag);
    (0, _elementHelpers.setAttributes)(element, attributes);
    (0, _elementHelpers.setChildren)(element, children);
  } else if (tag === h.frag) {
    return children;
  } else {
    throw new Error('unhandled tag', tag);
  }

  return element;
}

h.frag = Symbol('h.frag');
h.makeElement = _elementHelpers.makeElement;
h.setAttributes = _elementHelpers.setAttributes;
h.setChildren = _elementHelpers.setChildren;

h.customElementToTag = function (Element, namespaceURI) {
  return function tag(attributes, children) {
    const element = h.makeElement(Element, namespaceURI || defaultXlmns);
    h.setAttributes(element, attributes);
    h.setChildren(element, children);
    return element;
  };
};

h.getDefaultXlmns = function () {
  return defaultXlmns;
};

h.setDefaultXlmns = function (newDefaultXmlns) {
  defaultXlmns = newDefaultXmlns;
};

h.resetDefaultXlmns = function (newDefaultXmlns) {
  defaultXlmns = 'http://www.w3.org/1999/xhtml';
};

h.resetDefaultXlmns();
},{"./lib/elementHelpers":"../node_modules/horsy/lib/elementHelpers.js"}],"words.json":[function(require,module,exports) {
module.exports = ["an", "in", "is", "see", "the", "here", "I", "a", "in", "at", "it", "he", "me", "we", "see", "and", "all", "the", "can", "too", "not", "she", "like", "look", "went", "have", "yellow", "red", "green", "in", "an", "do", "me", "you", "can", "she", "out", "what", "have", "went", "over", "said", "one", "two", "three", "four", "five", "no", "in", "came", "the", "said", "this", "it", "up", "down", "my", "you", "in", "here", "is", "an", "see"];
},{}],"elements/SightWords.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _horsy = _interopRequireDefault(require("horsy"));

var _words = _interopRequireDefault(require("../words.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CustomizedTest =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(CustomizedTest, _HTMLElement);

  function CustomizedTest() {
    var _this;

    _classCallCheck(this, CustomizedTest);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomizedTest).call(this));
    _this.shadow = _this.attachShadow({
      mode: 'open'
    });
    return _this;
  }

  _createClass(CustomizedTest, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      console.log(Object.keys(window));
      var children = [];
      setInterval(function () {
        _this2.style.cssText = "\n        height: 100px;\n        overflow: auto;\n        display: flex;\n        flex-direction: column-reverse;\n      ";

        var word = _words.default[Math.floor(Math.random() * _words.default.length)];

        var utterance = new SpeechSynthesisUtterance(word);
        window.speechSynthesis.speak(utterance);
        var div = (0, _horsy.default)("div", null, word);
        children.unshift(div);

        while (children.length > 10) {
          children.pop();
        }

        _horsy.default.setChildren(_this2.shadow, children);
      }, 1000);
    }
  }], [{
    key: "NAME",
    get: function get() {
      return 'sight-words-element';
    }
  }]);

  return CustomizedTest;
}(_wrapNativeSuper(HTMLElement));

exports.default = CustomizedTest;
},{"horsy":"../node_modules/horsy/index.js","../words.json":"words.json"}],"index.jsx":[function(require,module,exports) {
"use strict";

var _horsy = _interopRequireDefault(require("horsy"));

var _SightWords = _interopRequireDefault(require("./elements/SightWords"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
var SightWordsTag = _horsy.default.customElementToTag(_SightWords.default);

document.body.appendChild((0, _horsy.default)(SightWordsTag, null));
},{"horsy":"../node_modules/horsy/index.js","./elements/SightWords":"elements/SightWords.jsx"}]},{},["index.jsx"], null)
//# sourceMappingURL=/app.78399e21.js.map