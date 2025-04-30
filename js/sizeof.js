/**
 *  sizeof.js
 *
 * Calculates the required disc space
 * for javascript objects of all kind,
 * if they would be saved as file.
 *
 * Usage:
 * const bytes = sizeof(obj);
 *
 */


(function(root) {

  'use strict';

  const map             = (e, f)  => a.map(e => f(e));
  const reduce          = (e, f)  => e.reduce((a, b) => f(a, b));
  const getObjectKeys   = e       => Object.keys(e);
  const objectKeys      = e       => Object.keys ? Object.keys(e) : getObjectKeys(e);
  const stylizeNoColor  = e       => e;
  const indexOf         = (e, f)  => e.indexOf(f);
  const isArray         = e       => Array.isArray(e);
  const isBoolean       = e       => typeof e === 'boolean';
  const isFunction      = e       => typeof e === 'function';
  const isString        = e       => typeof e === 'string';
  const isNumber        = e       => typeof e === 'number';
  const isObject        = e       => typeof e === 'object' && e !== null;
  const isNull          = e       => e === null;
  const isUndefined     = e       => e === void 0;
  const isRegExp        = e       => isObject(e) && objectToString(e) === '[object RegExp]';
  const isDate          = e       => isObject(e) && objectToString(e) === '[object Date]';
  const isError         = e       => isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
  const hasOwn          = (e, f)  => Object.prototype.hasOwnProperty.call(e, f);
  const objectToString  = e       => Object.prototype.toString.call(e);
  const formatError     = e       => '[' + Error.prototype.toString.call(e) + ']';
  const ECMA_SIZES      =         { STRING: 2, BOOLEAN: 4, BYTES: 4, NUMBER: 8 }
  const sizeof          = e       => e !== null && typeof e === 'object' ? objectSizeComplex(e) : objectSizeSimple(e);
  const each            = (e, f)  => e.constructor === Object ? Object.entries(e).forEach(([key, value], index) => f(key, value, index)) : [...e].forEach((key, index) => f(key, index));

  function inspect(obj, opts) {
    const ctx = { seen: [], stylize: stylizeNoColor };
    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];
    isBoolean(opts) ? ctx.showHidden = opts : opts && _extend(ctx, opts);
    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }

  inspect.colors = { 'bold': [1, 22], 'italic': [3, 23], 'underline': [4, 24], 'inverse': [7, 27], 'white': [37, 39], 'grey': [90, 39], 'black': [30, 39], 'blue': [34, 39], 'cyan': [36, 39], 'green': [32, 39], 'magenta': [35, 39], 'red': [31, 39], 'yellow': [33, 39] };
  inspect.styles = { 'special': 'cyan', 'number': 'yellow', 'boolean': 'yellow', 'undefined': 'grey', 'null': 'bold', 'string': 'green', 'date': 'magenta', 'regexp': 'red' };

  function stylizeWithColor(str, styleType) {
    const style = inspect.styles[styleType];
    return style ? `\u001b[${inspect.colors[style][0]}m${str}\u001b[${inspect.colors[style][1]}m` : str;
  }

  function arrayToHash(array) {
    var hash = {};
    return (each(array, val => hash[val] = true), hash);
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    for (var i = 0, l = value.length; i < l; ++i) output.push(hasOwn(value, String(i)) ? formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true) : "");
    each(keys, key => !key.match(/^\d+$/) && output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)));
    return output;
  }

  function formatValue(ctx, value, recurseTimes) {
    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect && !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);
      if (!isString(ret)) ret = formatValue(ctx, ret, recurseTimes);
      return ret;
    }
    var primitive = formatPrimitive(ctx, value);
    if (primitive) return primitive;
    var keys = objectKeys(value);
    var visibleKeys = arrayToHash(keys);
    try {
      if (ctx.showHidden && Object.getOwnPropertyNames) keys = Object.getOwnPropertyNames(value);
    } catch (e) {}
    if (isError(value) && (indexOf(keys, 'message') >= 0 || indexOf(keys, 'description') >= 0)) return formatError(value);
    if (keys.length === 0) {
      if (isFunction(value)) return ctx.stylize(`[Function${value.name ? ': ' + value.name : ''}]`, 'special');
      if (isRegExp(value)) return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      if (isDate(value)) return ctx.stylize(Date.prototype.toString.call(value), 'date');
      if (isError(value)) return formatError(value);
    }
    var base = '', array = false, braces = ['{', '}'];
    isArray(value) && (array = true, braces = ['[', ']']);
    if (isFunction(value)) base = ` [Function${value.name ? ': ' + value.name : ''}]`;
    if (isRegExp(value)) base = ' ' + RegExp.prototype.toString.call(value);
    if (isDate(value)) base = ' ' + Date.prototype.toUTCString.call(value);
    if (isError(value)) base = ' ' + formatError(value);
    if (keys.length === 0 && (!array || value.length == 0)) return braces[0] + base + braces[1];
    if (recurseTimes < 0) return isRegExp(value) ? ctx.stylize(RegExp.prototype.toString.call(value), 'regexp') : ctx.stylize('[Object]', 'special');
    ctx.seen.push(value);
    var output = array ? formatArray(ctx, value, recurseTimes, visibleKeys, keys) : map(keys, key => formatProperty(ctx, value, recurseTimes, visibleKeys, key, array));
    ctx.seen.pop();
    return reduceToSingleString(output, base, braces);
  }

  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = { value: void 0 };
    try {
      desc.value = value[key];
    } catch (e) {}
    try {
      if (Object.getOwnPropertyDescriptor) desc = Object.getOwnPropertyDescriptor(value, key) || desc;
    } catch (e) {}
    desc.get ? str = desc.set ? ctx.stylize('[Getter/Setter]', 'special') : ctx.stylize('[Getter]', 'special') : desc.set && (str = ctx.stylize('[Setter]', 'special'));
    !hasOwn(visibleKeys, key) && (name = '[' + key + ']');
    !str && (
      indexOf(ctx.seen, desc.value) < 0 ? (
        str = isNull(recurseTimes) ? formatValue(ctx, desc.value, null) : formatValue(ctx, desc.value, recurseTimes - 1),
        str.indexOf('\n') > -1 && (str = array ? map(str.split('\n'), line => '  ' + line).join('\n').substr(2) : str = '\n' + map(str.split('\n'), line => '   ' + line).join('\n'))
      ) : str = ctx.stylize('[Circular]', 'special')
    );
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) return str;
      name = JSON.stringify('' + key);
      name = name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? ctx.stylize(name.substr(1, name.length - 2), 'name') : ctx.stylize(name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), 'string');
    }
    return name + ': ' + str;
  }

  function formatPrimitive(ctx, value) {
    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
    if (isString(value)) return ctx.stylize('\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'', 'string');
    if (isNumber(value)) return ctx.stylize('' + value, 'number');
    if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
    if (isNull(value)) return ctx.stylize('null', 'null');
  }

  function reduceToSingleString(output, base, braces) {
    var numLinesEst = 0;
    var length = reduce(output, function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);
    if (length > 60) return `${braces[0]}${base === '' ? '' : base + '\n '} ${output.join(',\n  ')} ${braces[1]}`;
    return `${braces[0]}${base} ${output.join(', ')} ${braces[1]}`;
  }

  function _extend(origin, add) {
    if (!add || !isObject(add)) return origin;
    var keys = objectKeys(add);
    var i = keys.length;
    while (i--) origin[keys[i]] = add[keys[i]];
    return origin;
  }

  function objectSizeComplex (obj) {
    const enc = new TextEncoder();
    let total = 0;
    try {
      let item = obj instanceof Map ? Object.fromEntries(obj) : obj instanceof Set ? Array.from(obj) : obj;
      total = enc.encode(JSON.stringify(item)).length;
      if (item.constructor === Object) total += Object.keys(item).join("").length;
    } catch (ex) {return -1;}
    return total;
  }

  function objectSizeSimple (obj) {
    const objectList = [], stack = [obj];
    const enc = new TextEncoder();
    let bytes = 0;
    while (stack.length) {
      const value = stack.pop();
      bytes +=
        typeof value === 'boolean' ? ECMA_SIZES.BYTES :
        typeof value === 'string' ? value.length * ECMA_SIZES.STRING :
        typeof value === 'number' ? ECMA_SIZES.NUMBER :
        typeof value === 'symbol' ? Symbol.keyFor && Symbol.keyFor(obj) ? Symbol.keyFor(obj).length * ECMA_SIZES.STRING : (obj.toString().length - 8) * ECMA_SIZES.STRING :
        typeof value === 'bigint' ? enc.encode(value.toString()).length :
        typeof value === 'function' ? enc.encode(inspect(value), 'utf8').length : 0;
      typeof value === 'object' && objectList.indexOf(value) === -1 && (objectList.push(value), each(value, i => stack.push(value[i])));
    }
    return bytes;
  }

  root.sizeof = sizeof;

})(globalThis);
