/*
 TweenJS
 Visit http://createjs.com/ for documentation, updates and examples.

 Copyright (c) 2010 gskinner.com, inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 Platform.js
 Copyright 2014-2020 Benjamin Tan
 Copyright 2011-2013 John-David Dalton
 Available under MIT license
*/
this.createjs = this.createjs || {};
createjs.extend = function (f, d) {
  function e () {
    this.constructor = f
  }
  e.prototype = d.prototype;
  return f.prototype = new e
}
  ;
this.createjs = this.createjs || {};
createjs.promote = function (f, d) {
  var e = f.prototype
    , m = Object.getPrototypeOf && Object.getPrototypeOf(e) || e.__proto__;
  if (m) {
    e[(d += "_") + "constructor"] = m.constructor;
    for (var a in m)
      e.hasOwnProperty(a) && "function" == typeof m[a] && (e[d + a] = m[a])
  }
  return f
}
  ;
this.createjs = this.createjs || {};
createjs.deprecate = function (f, d) {
  return function () {
    var e = "Deprecated property or method '" + d + "'. See docs for info.";
    console && (console.warn ? console.warn(e) : console.log(e));
    return f && f.apply(this, arguments)
  }
}
  ;
this.createjs = this.createjs || {};
(function () {
  function f (e, m, a) {
    this.type = e;
    this.currentTarget = this.target = null;
    this.eventPhase = 0;
    this.bubbles = !!m;
    this.cancelable = !!a;
    this.timeStamp = (new Date).getTime();
    this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1
  }
  var d = f.prototype;
  d.preventDefault = function () {
    this.defaultPrevented = this.cancelable && !0
  }
    ;
  d.stopPropagation = function () {
    this.propagationStopped = !0
  }
    ;
  d.stopImmediatePropagation = function () {
    this.immediatePropagationStopped = this.propagationStopped = !0
  }
    ;
  d.remove = function () {
    this.removed = !0
  }
    ;
  d.clone = function () {
    return new f(this.type, this.bubbles, this.cancelable)
  }
    ;
  d.set = function (e) {
    for (var m in e)
      this[m] = e[m];
    return this
  }
    ;
  d.toString = function () {
    return "[Event (type=" + this.type + ")]"
  }
    ;
  createjs.Event = f
}
)();
this.createjs = this.createjs || {};
(function () {
  function f () {
    this._captureListeners = this._listeners = null
  }
  var d = f.prototype;
  f.initialize = function (e) {
    e.addEventListener = d.addEventListener;
    e.on = d.on;
    e.removeEventListener = e.off = d.removeEventListener;
    e.removeAllEventListeners = d.removeAllEventListeners;
    e.hasEventListener = d.hasEventListener;
    e.dispatchEvent = d.dispatchEvent;
    e._dispatchEvent = d._dispatchEvent;
    e.willTrigger = d.willTrigger
  }
    ;
  d.addEventListener = function (e, m, a) {
    var c = a ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
    var b = c[e];
    b && this.removeEventListener(e, m, a);
    (b = c[e]) ? b.push(m) : c[e] = [m];
    return m
  }
    ;
  d.on = function (e, m, a, c, b, k) {
    m.handleEvent && (a = a || m,
      m = m.handleEvent);
    a = a || this;
    return this.addEventListener(e, function (g) {
      m.call(a, g, b);
      c && g.remove()
    }, k)
  }
    ;
  d.removeEventListener = function (e, m, a) {
    if (a = a ? this._captureListeners : this._listeners) {
      var c = a[e];
      if (c)
        for (var b = 0, k = c.length; b < k; b++)
          if (c[b] == m) {
            1 == k ? delete a[e] : c.splice(b, 1);
            break
          }
    }
  }
    ;
  d.off = d.removeEventListener;
  d.removeAllEventListeners = function (e) {
    e ? (this._listeners && delete this._listeners[e],
      this._captureListeners && delete this._captureListeners[e]) : this._listeners = this._captureListeners = null
  }
    ;
  d.dispatchEvent = function (e, m, a) {
    if ("string" == typeof e) {
      var c = this._listeners;
      if (!(m || c && c[e]))
        return !0;
      e = new createjs.Event(e, m, a)
    } else
      e.target && e.clone && (e = e.clone());
    try {
      e.target = this
    } catch (b) { }
    if (e.bubbles && this.parent) {
      a = this;
      for (m = [a]; a.parent;)
        m.push(a = a.parent);
      c = m.length;
      for (a = c - 1; 0 <= a && !e.propagationStopped; a--)
        m[a]._dispatchEvent(e, 1 + (0 == a));
      for (a = 1; a < c && !e.propagationStopped; a++)
        m[a]._dispatchEvent(e, 3)
    } else
      this._dispatchEvent(e, 2);
    return !e.defaultPrevented
  }
    ;
  d.hasEventListener = function (e) {
    var m = this._listeners
      , a = this._captureListeners;
    return !!(m && m[e] || a && a[e])
  }
    ;
  d.willTrigger = function (e) {
    for (var m = this; m;) {
      if (m.hasEventListener(e))
        return !0;
      m = m.parent
    }
    return !1
  }
    ;
  d.toString = function () {
    return "[EventDispatcher]"
  }
    ;
  d._dispatchEvent = function (e, m) {
    var a, c, b = 2 >= m ? this._captureListeners : this._listeners;
    if (e && b && (c = b[e.type]) && (a = c.length)) {
      try {
        e.currentTarget = this
      } catch (g) { }
      try {
        e.eventPhase = m | 0
      } catch (g) { }
      e.removed = !1;
      c = c.slice();
      for (b = 0; b < a && !e.immediatePropagationStopped; b++) {
        var k = c[b];
        k.handleEvent ? k.handleEvent(e) : k(e);
        e.removed && (this.off(e.type, k, 1 == m),
          e.removed = !1)
      }
    }
    2 === m && this._dispatchEvent(e, 2.1)
  }
    ;
  createjs.EventDispatcher = f
}
)();
this.createjs = this.createjs || {};
(function () {
  function f () {
    throw "Ticker cannot be instantiated.";
  }
  f.RAF_SYNCHED = "synched";
  f.RAF = "raf";
  f.TIMEOUT = "timeout";
  f.timingMode = null;
  f.maxDelta = 0;
  f.paused = !1;
  f.removeEventListener = null;
  f.removeAllEventListeners = null;
  f.dispatchEvent = null;
  f.hasEventListener = null;
  f._listeners = null;
  createjs.EventDispatcher.initialize(f);
  f._addEventListener = f.addEventListener;
  f.addEventListener = function () {
    !f._inited && f.init();
    return f._addEventListener.apply(f, arguments)
  }
    ;
  f._inited = !1;
  f._startTime = 0;
  f._pausedTime = 0;
  f._ticks = 0;
  f._pausedTicks = 0;
  f._interval = 50;
  f._lastTime = 0;
  f._times = null;
  f._tickTimes = null;
  f._timerId = null;
  f._raf = !0;
  f._setInterval = function (m) {
    f._interval = m;
    f._inited && f._setupTick()
  }
    ;
  f.setInterval = createjs.deprecate(f._setInterval, "Ticker.setInterval");
  f._getInterval = function () {
    return f._interval
  }
    ;
  f.getInterval = createjs.deprecate(f._getInterval, "Ticker.getInterval");
  f._setFPS = function (m) {
    f._setInterval(1E3 / m)
  }
    ;
  f.setFPS = createjs.deprecate(f._setFPS, "Ticker.setFPS");
  f._getFPS = function () {
    return 1E3 / f._interval
  }
    ;
  f.getFPS = createjs.deprecate(f._getFPS, "Ticker.getFPS");
  try {
    Object.defineProperties(f, {
      interval: {
        get: f._getInterval,
        set: f._setInterval
      },
      framerate: {
        get: f._getFPS,
        set: f._setFPS
      }
    })
  } catch (m) {
    console.log(m)
  }
  f.init = function () {
    f._inited || (f._inited = !0,
      f._times = [],
      f._tickTimes = [],
      f._startTime = f._getTime(),
      f._times.push(f._lastTime = 0),
      f.interval = f._interval)
  }
    ;
  f.reset = function () {
    if (f._raf) {
      var m = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
      m && m(f._timerId)
    } else
      clearTimeout(f._timerId);
    f.removeAllEventListeners("tick");
    f._timerId = f._times = f._tickTimes = null;
    f._startTime = f._lastTime = f._ticks = f._pausedTime = 0;
    f._inited = !1
  }
    ;
  f.getMeasuredTickTime = function (m) {
    var a = 0
      , c = f._tickTimes;
    if (!c || 1 > c.length)
      return -1;
    m = Math.min(c.length, m || f._getFPS() | 0);
    for (var b = 0; b < m; b++)
      a += c[b];
    return a / m
  }
    ;
  f.getMeasuredFPS = function (m) {
    var a = f._times;
    if (!a || 2 > a.length)
      return -1;
    m = Math.min(a.length - 1, m || f._getFPS() | 0);
    return 1E3 / ((a[0] - a[m]) / m)
  }
    ;
  f.getTime = function (m) {
    return f._startTime ? f._getTime() - (m ? f._pausedTime : 0) : -1
  }
    ;
  f.getEventTime = function (m) {
    return f._startTime ? (f._lastTime || f._startTime) - (m ? f._pausedTime : 0) : -1
  }
    ;
  f.getTicks = function (m) {
    return f._ticks - (m ? f._pausedTicks : 0)
  }
    ;
  f._handleSynch = function () {
    f._timerId = null;
    f._setupTick();
    f._getTime() - f._lastTime >= .97 * (f._interval - 1) && f._tick()
  }
    ;
  f._handleRAF = function () {
    f._timerId = null;
    f._setupTick();
    f._tick()
  }
    ;
  f._handleTimeout = function () {
    f._timerId = null;
    f._setupTick();
    f._tick()
  }
    ;
  f._setupTick = function () {
    if (null == f._timerId) {
      var m = f.timingMode;
      if (m == f.RAF_SYNCHED || m == f.RAF) {
        var a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
        if (a) {
          f._timerId = a(m == f.RAF ? f._handleRAF : f._handleSynch);
          f._raf = !0;
          return
        }
      }
      f._raf = !1;
      f._timerId = setTimeout(f._handleTimeout, f._interval)
    }
  }
    ;
  f._tick = function () {
    var m = f.paused
      , a = f._getTime()
      , c = a - f._lastTime;
    f._lastTime = a;
    f._ticks++;
    m && (f._pausedTicks++,
      f._pausedTime += c);
    if (f.hasEventListener("tick")) {
      var b = new createjs.Event("tick")
        , k = f.maxDelta;
      b.delta = k && c > k ? k : c;
      b.paused = m;
      b.time = a;
      b.runTime = a - f._pausedTime;
      f.dispatchEvent(b)
    }
    for (f._tickTimes.unshift(f._getTime() - a); 100 < f._tickTimes.length;)
      f._tickTimes.pop();
    for (f._times.unshift(a); 100 < f._times.length;)
      f._times.pop()
  }
    ;
  var d = window
    , e = d.performance.now || d.performance.mozNow || d.performance.msNow || d.performance.oNow || d.performance.webkitNow;
  f._getTime = function () {
    return (e && e.call(d.performance) || (new Date).getTime()) - f._startTime
  }
    ;
  createjs.Ticker = f
}
)();
this.createjs = this.createjs || {};
(function () {
  function f (e) {
    this.EventDispatcher_constructor();
    this.ignoreGlobalPause = !1;
    this.loop = 0;
    this.bounce = this.reversed = this.useTicks = !1;
    this.timeScale = 1;
    this.position = this.duration = 0;
    this.rawPosition = -1;
    this._paused = !0;
    this._labelList = this._labels = this._parent = this._prev = this._next = null;
    e && (this.useTicks = !!e.useTicks,
      this.ignoreGlobalPause = !!e.ignoreGlobalPause,
      this.loop = !0 === e.loop ? -1 : e.loop || 0,
      this.reversed = !!e.reversed,
      this.bounce = !!e.bounce,
      this.timeScale = e.timeScale || 1,
      e.onChange && this.addEventListener("change", e.onChange),
      e.onComplete && this.addEventListener("complete", e.onComplete))
  }
  var d = createjs.extend(f, createjs.EventDispatcher);
  d._setPaused = function (e) {
    createjs.Tween._register(this, e);
    return this
  }
    ;
  d.setPaused = createjs.deprecate(d._setPaused, "AbstractTween.setPaused");
  d._getPaused = function () {
    return this._paused
  }
    ;
  d.getPaused = createjs.deprecate(d._getPaused, "AbstactTween.getPaused");
  d._getCurrentLabel = function (e) {
    var m = this.getLabels();
    null == e && (e = this.position);
    for (var a = 0, c = m.length; a < c && !(e < m[a].position); a++)
      ;
    return 0 === a ? null : m[a - 1].label
  }
    ;
  d.getCurrentLabel = createjs.deprecate(d._getCurrentLabel, "AbstractTween.getCurrentLabel");
  try {
    Object.defineProperties(d, {
      paused: {
        set: d._setPaused,
        get: d._getPaused
      },
      currentLabel: {
        get: d._getCurrentLabel
      }
    })
  } catch (e) { }
  d.advance = function (e, m) {
    this.setPosition(this.rawPosition + e * this.timeScale, m)
  }
    ;
  d.setPosition = function (e, m, a, c) {
    var b = this.duration
      , k = this.loop
      , g = this.rawPosition
      , h = 0;
    0 > e && (e = 0);
    if (0 === b) {
      var l = !0;
      if (-1 !== g)
        return l
    } else {
      var n = e / b | 0;
      h = e - n * b;
      (l = -1 !== k && e >= k * b + b) && (e = (h = b) * (n = k) + b);
      if (e === g)
        return l;
      !this.reversed !== !(this.bounce && n % 2) && (h = b - h)
    }
    this.position = h;
    this.rawPosition = e;
    this._updatePosition(a, l);
    l && (this.paused = !0);
    c && c(this);
    m || this._runActions(g, e, a, !a && -1 === g);
    this.dispatchEvent("change");
    l && this.dispatchEvent("complete")
  }
    ;
  d.calculatePosition = function (e) {
    var m = this.duration
      , a = this.loop
      , c = 0;
    if (0 === m)
      return 0;
    -1 !== a && e >= a * m + m ? (e = m,
      c = a) : 0 > e ? e = 0 : (c = e / m | 0,
        e -= c * m);
    return !this.reversed !== !(this.bounce && c % 2) ? m - e : e
  }
    ;
  d.getLabels = function () {
    var e = this._labelList;
    if (!e) {
      e = this._labelList = [];
      var m = this._labels, a;
      for (a in m)
        e.push({
          label: a,
          position: m[a]
        });
      e.sort(function (c, b) {
        return c.position - b.position
      })
    }
    return e
  }
    ;
  d.setLabels = function (e) {
    this._labels = e;
    this._labelList = null
  }
    ;
  d.addLabel = function (e, m) {
    this._labels || (this._labels = {});
    this._labels[e] = m;
    var a = this._labelList;
    if (a) {
      for (var c = 0, b = a.length; c < b && !(m < a[c].position); c++)
        ;
      a.splice(c, 0, {
        label: e,
        position: m
      })
    }
  }
    ;
  d.gotoAndPlay = function (e) {
    this.paused = !1;
    this._goto(e)
  }
    ;
  d.gotoAndStop = function (e) {
    this.paused = !0;
    this._goto(e)
  }
    ;
  d.resolve = function (e) {
    var m = Number(e);
    isNaN(m) && (m = this._labels && this._labels[e]);
    return m
  }
    ;
  d.toString = function () {
    return "[AbstractTween]"
  }
    ;
  d.clone = function () {
    throw "AbstractTween can not be cloned.";
  }
    ;
  d._init = function (e) {
    e && e.paused || (this.paused = !1);
    e && null != e.position && this.setPosition(e.position)
  }
    ;
  d._updatePosition = function (e, m) { }
    ;
  d._goto = function (e) {
    e = this.resolve(e);
    null != e && this.setPosition(e, !1, !0)
  }
    ;
  d._runActions = function (e, m, a, c) {
    if (this._actionHead || this.tweens) {
      var b = this.duration, k = this.reversed, g = this.bounce, h = this.loop, l, n, p;
      if (0 === b) {
        var q = l = n = p = 0;
        k = g = !1
      } else
        q = e / b | 0,
          l = m / b | 0,
          n = e - q * b,
          p = m - l * b;
      -1 !== h && (l > h && (p = b,
        l = h),
        q > h && (n = b,
          q = h));
      if (a)
        return this._runActionsRange(p, p, a, c);
      if (q !== l || n !== p || a || c) {
        -1 === q && (q = n = 0);
        e = e <= m;
        m = q;
        do {
          h = m === q ? n : e ? 0 : b;
          var t = m === l ? p : e ? b : 0;
          !k !== !(g && m % 2) && (h = b - h,
            t = b - t);
          if ((!g || m === q || h !== t) && this._runActionsRange(h, t, a, c || m !== q && !g))
            return !0;
          c = !1
        } while (e && ++m <= l || !e && --m >= l)
      }
    }
  }
    ;
  d._runActionsRange = function (e, m, a, c) { }
    ;
  createjs.AbstractTween = createjs.promote(f, "EventDispatcher")
}
)();
this.createjs = this.createjs || {};
(function () {
  function f (a, c) {
    this.AbstractTween_constructor(c);
    this.pluginData = null;
    this.target = a;
    this.passive = !1;
    this._stepTail = this._stepHead = new d(null, 0, 0, {}, null, !0);
    this._stepPosition = 0;
    this._injected = this._pluginIds = this._plugins = this._actionTail = this._actionHead = null;
    c && (this.pluginData = c.pluginData,
      c.override && f.removeTweens(a));
    this.pluginData || (this.pluginData = {});
    this._init(c)
  }
  function d (a, c, b, k, g, h) {
    this.next = null;
    this.prev = a;
    this.t = c;
    this.d = b;
    this.props = k;
    this.ease = g;
    this.passive = h;
    this.index = a ? a.index + 1 : 0
  }
  function e (a, c, b, k, g) {
    this.next = null;
    this.prev = a;
    this.t = c;
    this.d = 0;
    this.scope = b;
    this.funct = k;
    this.params = g
  }
  var m = createjs.extend(f, createjs.AbstractTween);
  f.IGNORE = {};
  f._tweens = [];
  f._plugins = null;
  f._tweenHead = null;
  f._tweenTail = null;
  f.get = function (a, c) {
    return new f(a, c)
  }
    ;
  f.tick = function (a, c) {
    for (var b = f._tweenHead; b;) {
      var k = b._next;
      c && !b.ignoreGlobalPause || b._paused || b.advance(b.useTicks ? 1 : a);
      b = k
    }
  }
    ;
  f.handleEvent = function (a) {
    "tick" === a.type && this.tick(a.delta, a.paused)
  }
    ;
  f.removeTweens = function (a) {
    if (a.tweenjs_count) {
      for (var c = f._tweenHead; c;) {
        var b = c._next;
        c.target === a && f._register(c, !0);
        c = b
      }
      a.tweenjs_count = 0
    }
  }
    ;
  f.removeAllTweens = function () {
    for (var a = f._tweenHead; a;) {
      var c = a._next;
      a._paused = !0;
      a.target && (a.target.tweenjs_count = 0);
      a._next = a._prev = null;
      a = c
    }
    f._tweenHead = f._tweenTail = null
  }
    ;
  f.hasActiveTweens = function (a) {
    return a ? !!a.tweenjs_count : !!f._tweenHead
  }
    ;
  f._installPlugin = function (a) {
    for (var c = a.priority = a.priority || 0, b = f._plugins = f._plugins || [], k = 0, g = b.length; k < g && !(c < b[k].priority); k++)
      ;
    b.splice(k, 0, a)
  }
    ;
  f._register = function (a, c) {
    var b = a.target;
    if (!c && a._paused)
      b && (b.tweenjs_count = b.tweenjs_count ? b.tweenjs_count + 1 : 1),
        (b = f._tweenTail) ? (f._tweenTail = b._next = a,
          a._prev = b) : f._tweenHead = f._tweenTail = a,
        !f._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", f),
          f._inited = !0);
    else if (c && !a._paused) {
      b && b.tweenjs_count--;
      b = a._next;
      var k = a._prev;
      b ? b._prev = k : f._tweenTail = k;
      k ? k._next = b : f._tweenHead = b;
      a._next = a._prev = null
    }
    a._paused = c
  }
    ;
  m.wait = function (a, c) {
    0 < a && this._addStep(+a, this._stepTail.props, null, c);
    return this
  }
    ;
  m.to = function (a, c, b) {
    if (null == c || 0 > c)
      c = 0;
    c = this._addStep(+c, null, b);
    this._appendProps(a, c);
    return this
  }
    ;
  m.label = function (a) {
    this.addLabel(a, this.duration);
    return this
  }
    ;
  m.call = function (a, c, b) {
    return this._addAction(b || this.target, a, c || [this])
  }
    ;
  m.set = function (a, c) {
    return this._addAction(c || this.target, this._set, [a])
  }
    ;
  m.play = function (a) {
    return this._addAction(a || this, this._set, [{
      paused: !1
    }])
  }
    ;
  m.pause = function (a) {
    return this._addAction(a || this, this._set, [{
      paused: !0
    }])
  }
    ;
  m.w = m.wait;
  m.t = m.to;
  m.c = m.call;
  m.s = m.set;
  m.toString = function () {
    return "[Tween]"
  }
    ;
  m.clone = function () {
    throw "Tween can not be cloned.";
  }
    ;
  m._addPlugin = function (a) {
    var c = this._pluginIds || (this._pluginIds = {})
      , b = a.ID;
    if (b && !c[b]) {
      c[b] = !0;
      c = this._plugins || (this._plugins = []);
      b = a.priority || 0;
      for (var k = 0, g = c.length; k < g; k++)
        if (b < c[k].priority) {
          c.splice(k, 0, a);
          return
        }
      c.push(a)
    }
  }
    ;
  m._updatePosition = function (a, c) {
    var b = this._stepHead.next
      , k = this.position
      , g = this.duration;
    if (this.target && b) {
      for (var h = b.next; h && h.t <= k;)
        b = b.next,
          h = b.next;
      this._updateTargetProps(b, c ? 0 === g ? 1 : k / g : (k - b.t) / b.d, c)
    }
    this._stepPosition = b ? k - b.t : 0
  }
    ;
  m._updateTargetProps = function (a, c, b) {
    if (!(this.passive = !!a.passive)) {
      var k, g = a.prev.props, h = a.props;
      if (k = a.ease)
        c = k(c, 0, 1, 1);
      k = this._plugins;
      var l;
      a: for (l in g) {
        var n = g[l];
        var p = h[l];
        n = n !== p && "number" === typeof n ? n + (p - n) * c : 1 <= c ? p : n;
        if (k) {
          p = 0;
          for (var q = k.length; p < q; p++) {
            var t = k[p].change(this, a, l, n, c, b);
            if (t === f.IGNORE)
              continue a;
            void 0 !== t && (n = t)
          }
        }
        this.target[l] = n
      }
    }
  }
    ;
  m._runActionsRange = function (a, c, b, k) {
    var g = (b = a > c) ? this._actionTail : this._actionHead
      , h = c
      , l = a;
    b && (h = a,
      l = c);
    for (var n = this.position; g;) {
      var p = g.t;
      if (p === c || p > l && p < h || k && p === a)
        if (g.funct.apply(g.scope, g.params),
          n !== this.position)
          return !0;
      g = b ? g.prev : g.next
    }
  }
    ;
  m._appendProps = function (a, c, b) {
    var k = this._stepHead.props, g = this.target, h = f._plugins, l, n, p = c.prev, q = p.props, t = c.props || (c.props = this._cloneProps(q)), r = {};
    for (l in a)
      if (a.hasOwnProperty(l) && (r[l] = t[l] = a[l],
        void 0 === k[l])) {
        var v = void 0;
        if (h)
          for (n = h.length - 1; 0 <= n; n--) {
            var x = h[n].init(this, l, v);
            void 0 !== x && (v = x);
            if (v === f.IGNORE) {
              delete t[l];
              delete r[l];
              break
            }
          }
        v !== f.IGNORE && (void 0 === v && (v = g[l]),
          q[l] = void 0 === v ? null : v)
      }
    for (l in r) {
      var E;
      for (a = p; (E = a) && (a = E.prev);)
        if (a.props !== E.props) {
          if (void 0 !== a.props[l])
            break;
          a.props[l] = q[l]
        }
    }
    if (!1 !== b && (h = this._plugins))
      for (n = h.length - 1; 0 <= n; n--)
        h[n].step(this, c, r);
    if (b = this._injected)
      this._injected = null,
        this._appendProps(b, c, !1)
  }
    ;
  m._injectProp = function (a, c) {
    (this._injected || (this._injected = {}))[a] = c
  }
    ;
  m._addStep = function (a, c, b, k) {
    c = new d(this._stepTail, this.duration, a, c, b, k || !1);
    this.duration += a;
    return this._stepTail = this._stepTail.next = c
  }
    ;
  m._addAction = function (a, c, b) {
    a = new e(this._actionTail, this.duration, a, c, b);
    this._actionTail ? this._actionTail.next = a : this._actionHead = a;
    this._actionTail = a;
    return this
  }
    ;
  m._set = function (a) {
    for (var c in a)
      this[c] = a[c]
  }
    ;
  m._cloneProps = function (a) {
    var c = {}, b;
    for (b in a)
      c[b] = a[b];
    return c
  }
    ;
  createjs.Tween = createjs.promote(f, "AbstractTween")
}
)();
this.createjs = this.createjs || {};
(function () {
  function f (e) {
    if (e instanceof Array || null == e && 1 < arguments.length) {
      var m = e;
      var a = arguments[1];
      e = arguments[2]
    } else
      e && (m = e.tweens,
        a = e.labels);
    this.AbstractTween_constructor(e);
    this.tweens = [];
    m && this.addTween.apply(this, m);
    this.setLabels(a);
    this._init(e)
  }
  var d = createjs.extend(f, createjs.AbstractTween);
  d.addTween = function (e) {
    e._parent && e._parent.removeTween(e);
    var m = arguments.length;
    if (1 < m) {
      for (var a = 0; a < m; a++)
        this.addTween(arguments[a]);
      return arguments[m - 1]
    }
    if (0 === m)
      return null;
    this.tweens.push(e);
    e._parent = this;
    e.paused = !0;
    m = e.duration;
    0 < e.loop && (m *= e.loop + 1);
    m > this.duration && (this.duration = m);
    0 <= this.rawPosition && e.setPosition(this.rawPosition);
    return e
  }
    ;
  d.removeTween = function (e) {
    var m = arguments.length;
    if (1 < m) {
      for (var a = !0, c = 0; c < m; c++)
        a = a && this.removeTween(arguments[c]);
      return a
    }
    if (0 === m)
      return !0;
    m = this.tweens;
    for (c = m.length; c--;)
      if (m[c] === e)
        return m.splice(c, 1),
          e._parent = null,
          e.duration >= this.duration && this.updateDuration(),
          !0;
    return !1
  }
    ;
  d.updateDuration = function () {
    for (var e = this.duration = 0, m = this.tweens.length; e < m; e++) {
      var a = this.tweens[e]
        , c = a.duration;
      0 < a.loop && (c *= a.loop + 1);
      c > this.duration && (this.duration = c)
    }
  }
    ;
  d.toString = function () {
    return "[Timeline]"
  }
    ;
  d.clone = function () {
    throw "Timeline can not be cloned.";
  }
    ;
  d._updatePosition = function (e, m) {
    for (var a = this.position, c = 0, b = this.tweens.length; c < b; c++)
      this.tweens[c].setPosition(a, !0, e)
  }
    ;
  d._runActionsRange = function (e, m, a, c) {
    for (var b = this.position, k = 0, g = this.tweens.length; k < g; k++)
      if (this.tweens[k]._runActions(e, m, a, c),
        b !== this.position)
        return !0
  }
    ;
  createjs.Timeline = createjs.promote(f, "AbstractTween")
}
)();
this.createjs = this.createjs || {};
(function () {
  function f () {
    throw "Ease cannot be instantiated.";
  }
  f.linear = function (d) {
    return d
  }
    ;
  f.none = f.linear;
  f.get = function (d) {
    -1 > d ? d = -1 : 1 < d && (d = 1);
    return function (e) {
      return 0 == d ? e : 0 > d ? e * (e * -d + 1 + d) : e * ((2 - e) * d + (1 - d))
    }
  }
    ;
  f.getPowIn = function (d) {
    return function (e) {
      return Math.pow(e, d)
    }
  }
    ;
  f.getPowOut = function (d) {
    return function (e) {
      return 1 - Math.pow(1 - e, d)
    }
  }
    ;
  f.getPowInOut = function (d) {
    return function (e) {
      return 1 > (e *= 2) ? .5 * Math.pow(e, d) : 1 - .5 * Math.abs(Math.pow(2 - e, d))
    }
  }
    ;
  f.quadIn = f.getPowIn(2);
  f.quadOut = f.getPowOut(2);
  f.quadInOut = f.getPowInOut(2);
  f.cubicIn = f.getPowIn(3);
  f.cubicOut = f.getPowOut(3);
  f.cubicInOut = f.getPowInOut(3);
  f.quartIn = f.getPowIn(4);
  f.quartOut = f.getPowOut(4);
  f.quartInOut = f.getPowInOut(4);
  f.quintIn = f.getPowIn(5);
  f.quintOut = f.getPowOut(5);
  f.quintInOut = f.getPowInOut(5);
  f.sineIn = function (d) {
    return 1 - Math.cos(d * Math.PI / 2)
  }
    ;
  f.sineOut = function (d) {
    return Math.sin(d * Math.PI / 2)
  }
    ;
  f.sineInOut = function (d) {
    return -.5 * (Math.cos(Math.PI * d) - 1)
  }
    ;
  f.getBackIn = function (d) {
    return function (e) {
      return e * e * ((d + 1) * e - d)
    }
  }
    ;
  f.backIn = f.getBackIn(1.7);
  f.getBackOut = function (d) {
    return function (e) {
      return --e * e * ((d + 1) * e + d) + 1
    }
  }
    ;
  f.backOut = f.getBackOut(1.7);
  f.getBackInOut = function (d) {
    d *= 1.525;
    return function (e) {
      return 1 > (e *= 2) ? .5 * e * e * ((d + 1) * e - d) : .5 * ((e -= 2) * e * ((d + 1) * e + d) + 2)
    }
  }
    ;
  f.backInOut = f.getBackInOut(1.7);
  f.circIn = function (d) {
    return -(Math.sqrt(1 - d * d) - 1)
  }
    ;
  f.circOut = function (d) {
    return Math.sqrt(1 - --d * d)
  }
    ;
  f.circInOut = function (d) {
    return 1 > (d *= 2) ? -.5 * (Math.sqrt(1 - d * d) - 1) : .5 * (Math.sqrt(1 - (d -= 2) * d) + 1)
  }
    ;
  f.bounceIn = function (d) {
    return 1 - f.bounceOut(1 - d)
  }
    ;
  f.bounceOut = function (d) {
    return d < 1 / 2.75 ? 7.5625 * d * d : d < 2 / 2.75 ? 7.5625 * (d -= 1.5 / 2.75) * d + .75 : d < 2.5 / 2.75 ? 7.5625 * (d -= 2.25 / 2.75) * d + .9375 : 7.5625 * (d -= 2.625 / 2.75) * d + .984375
  }
    ;
  f.bounceInOut = function (d) {
    return .5 > d ? .5 * f.bounceIn(2 * d) : .5 * f.bounceOut(2 * d - 1) + .5
  }
    ;
  f.getElasticIn = function (d, e) {
    var m = 2 * Math.PI;
    return function (a) {
      if (0 == a || 1 == a)
        return a;
      var c = e / m * Math.asin(1 / d);
      return -(d * Math.pow(2, 10 * --a) * Math.sin((a - c) * m / e))
    }
  }
    ;
  f.elasticIn = f.getElasticIn(1, .3);
  f.getElasticOut = function (d, e) {
    var m = 2 * Math.PI;
    return function (a) {
      return 0 == a || 1 == a ? a : d * Math.pow(2, -10 * a) * Math.sin((a - e / m * Math.asin(1 / d)) * m / e) + 1
    }
  }
    ;
  f.elasticOut = f.getElasticOut(1, .3);
  f.getElasticInOut = function (d, e) {
    var m = 2 * Math.PI;
    return function (a) {
      var c = e / m * Math.asin(1 / d);
      return 1 > (a *= 2) ? -.5 * d * Math.pow(2, 10 * --a) * Math.sin((a - c) * m / e) : d * Math.pow(2, -10 * --a) * Math.sin((a - c) * m / e) * .5 + 1
    }
  }
    ;
  f.elasticInOut = f.getElasticInOut(1, .3 * 1.5);
  createjs.Ease = f
}
)();
this.createjs = this.createjs || {};
(function () {
  function f () {
    throw "MotionGuidePlugin cannot be instantiated.";
  }
  f.priority = 0;
  f.ID = "MotionGuide";
  f.install = function () {
    createjs.Tween._installPlugin(f);
    return createjs.Tween.IGNORE
  }
    ;
  f.init = function (d, e, m) {
    "guide" == e && d._addPlugin(f)
  }
    ;
  f.step = function (d, e, m) {
    for (var a in m)
      if ("guide" === a) {
        var c = e.props.guide
          , b = f._solveGuideData(m.guide, c);
        c.valid = !b;
        var k = c.endData;
        d._injectProp("x", k.x);
        d._injectProp("y", k.y);
        if (b || !c.orient)
          break;
        c.startOffsetRot = (void 0 === e.prev.props.rotation ? d.target.rotation || 0 : e.prev.props.rotation) - c.startData.rotation;
        if ("fixed" == c.orient)
          c.endAbsRot = k.rotation + c.startOffsetRot,
            c.deltaRotation = 0;
        else {
          b = void 0 === m.rotation ? d.target.rotation || 0 : m.rotation;
          k = b - c.endData.rotation - c.startOffsetRot;
          var g = k % 360;
          c.endAbsRot = b;
          switch (c.orient) {
            case "auto":
              c.deltaRotation = k;
              break;
            case "cw":
              c.deltaRotation = (g + 360) % 360 + 360 * Math.abs(k / 360 | 0);
              break;
            case "ccw":
              c.deltaRotation = (g - 360) % 360 + -360 * Math.abs(k / 360 | 0)
          }
        }
        d._injectProp("rotation", c.endAbsRot)
      }
  }
    ;
  f.change = function (d, e, m, a, c, b) {
    if ((a = e.props.guide) && e.props !== e.prev.props && a !== e.prev.props.guide) {
      if ("guide" === m && !a.valid || "x" == m || "y" == m || "rotation" === m && a.orient)
        return createjs.Tween.IGNORE;
      f._ratioToPositionData(c, a, d.target)
    }
  }
    ;
  f.debug = function (d, e, m) {
    d = d.guide || d;
    var a = f._findPathProblems(d);
    a && console.error("MotionGuidePlugin Error found: \n" + a);
    if (!e)
      return a;
    var c, b = d.path, k = b.length;
    e.save();
    e.lineCap = "round";
    e.lineJoin = "miter";
    e.beginPath();
    e.moveTo(b[0], b[1]);
    for (c = 2; c < k; c += 4)
      e.quadraticCurveTo(b[c], b[c + 1], b[c + 2], b[c + 3]);
    e.strokeStyle = "black";
    e.lineWidth = 4.5;
    e.stroke();
    e.strokeStyle = "white";
    e.lineWidth = 3;
    e.stroke();
    e.closePath();
    b = m.length;
    if (m && b) {
      k = {};
      var g = {};
      f._solveGuideData(d, k);
      for (c = 0; c < b; c++)
        k.orient = "fixed",
          f._ratioToPositionData(m[c], k, g),
          e.beginPath(),
          e.moveTo(g.x, g.y),
          e.lineTo(g.x + 9 * Math.cos(.0174533 * g.rotation), g.y + 9 * Math.sin(.0174533 * g.rotation)),
          e.strokeStyle = "black",
          e.lineWidth = 4.5,
          e.stroke(),
          e.strokeStyle = "red",
          e.lineWidth = 3,
          e.stroke(),
          e.closePath()
    }
    e.restore();
    return a
  }
    ;
  f._solveGuideData = function (d, e) {
    var m;
    if (m = f.debug(d))
      return m;
    var a = e.path = d.path;
    e.orient = d.orient;
    e.subLines = [];
    e.totalLength = 0;
    e.startOffsetRot = 0;
    e.deltaRotation = 0;
    e.startData = {
      ratio: 0
    };
    e.endData = {
      ratio: 1
    };
    e.animSpan = 1;
    var c = a.length, b, k = {};
    var g = a[0];
    var h = a[1];
    for (m = 2; m < c; m += 4) {
      var l = a[m];
      var n = a[m + 1];
      var p = a[m + 2];
      var q = a[m + 3];
      var t = {
        weightings: [],
        estLength: 0,
        portion: 0
      }
        , r = g;
      var v = h;
      for (b = 1; 10 >= b; b++)
        f._getParamsForCurve(g, h, l, n, p, q, b / 10, !1, k),
          r = k.x - r,
          v = k.y - v,
          v = Math.sqrt(r * r + v * v),
          t.weightings.push(v),
          t.estLength += v,
          r = k.x,
          v = k.y;
      e.totalLength += t.estLength;
      for (b = 0; 10 > b; b++)
        v = t.estLength,
          t.weightings[b] /= v;
      e.subLines.push(t);
      g = p;
      h = q
    }
    v = e.totalLength;
    a = e.subLines.length;
    for (m = 0; m < a; m++)
      e.subLines[m].portion = e.subLines[m].estLength / v;
    m = isNaN(d.start) ? 0 : d.start;
    a = isNaN(d.end) ? 1 : d.end;
    f._ratioToPositionData(m, e, e.startData);
    f._ratioToPositionData(a, e, e.endData);
    e.startData.ratio = m;
    e.endData.ratio = a;
    e.animSpan = e.endData.ratio - e.startData.ratio
  }
    ;
  f._ratioToPositionData = function (d, e, m) {
    var a = e.subLines, c, b = 0, k = d * e.animSpan + e.startData.ratio;
    var g = a.length;
    for (c = 0; c < g; c++) {
      var h = a[c].portion;
      if (b + h >= k) {
        var l = c;
        break
      }
      b += h
    }
    void 0 === l && (l = g - 1,
      b -= h);
    a = a[l].weightings;
    var n = h;
    g = a.length;
    for (c = 0; c < g; c++) {
      h = a[c] * n;
      if (b + h >= k)
        break;
      b += h
    }
    l = 4 * l + 2;
    g = e.path;
    f._getParamsForCurve(g[l - 2], g[l - 1], g[l], g[l + 1], g[l + 2], g[l + 3], c / 10 + (k - b) / h * .1, e.orient, m);
    e.orient && (m.rotation = .99999 <= d && 1.00001 >= d && void 0 !== e.endAbsRot ? e.endAbsRot : m.rotation + (e.startOffsetRot + d * e.deltaRotation));
    return m
  }
    ;
  f._getParamsForCurve = function (d, e, m, a, c, b, k, g, h) {
    var l = 1 - k;
    h.x = l * l * d + 2 * l * k * m + k * k * c;
    h.y = l * l * e + 2 * l * k * a + k * k * b;
    g && (h.rotation = 57.2957795 * Math.atan2((a - e) * l + (b - a) * k, (m - d) * l + (c - m) * k))
  }
    ;
  f._findPathProblems = function (d) {
    var e = d.path
      , m = e && e.length || 0;
    if (6 > m || (m - 2) % 4)
      return "\tCannot parse 'path' array due to invalid number of entries in path. There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\nOnly [ " + (m + " ] values found. Expected: " + Math.max(4 * Math.ceil((m - 2) / 4) + 2, 6));
    for (var a = 0; a < m; a++)
      if (isNaN(e[a]))
        return "All data in path array must be numeric";
    e = d.start;
    if (isNaN(e) && void 0 !== e)
      return "'start' out of bounds. Expected 0 to 1, got: " + e;
    e = d.end;
    if (isNaN(e) && void 0 !== e)
      return "'end' out of bounds. Expected 0 to 1, got: " + e;
    if ((d = d.orient) && "fixed" != d && "auto" != d && "cw" != d && "ccw" != d)
      return 'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' + d
  }
    ;
  createjs.MotionGuidePlugin = f
}
)();
this.createjs = this.createjs || {};
(function () {
  var f = createjs.TweenJS = createjs.TweenJS || {};
  f.version = "1.0.0";
  f.buildDate = "Thu, 14 Sep 2017 19:47:47 GMT"
}
)();
(function () {
  var f = "undefined" !== typeof window && "undefined" !== typeof window.document ? window.document : {}
    , d = "undefined" !== typeof module && module.exports
    , e = function () {
      for (var c, b = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "), "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "), "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "), "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")], k = 0, g = b.length, h = {}; k < g; k++)
        if ((c = b[k]) && c[1] in f) {
          for (k = 0; k < c.length; k++)
            h[b[0][k]] = c[k];
          return h
        }
      return !1
    }()
    , m = {
      change: e.fullscreenchange,
      error: e.fullscreenerror
    }
    , a = {
      request: function (c) {
        return new Promise(function (b, k) {
          var g = function () {
            this.off("change", g);
            b()
          }
            .bind(this);
          this.on("change", g);
          c = c || f.documentElement;
          Promise.resolve(c[e.requestFullscreen]())["catch"](k)
        }
          .bind(this))
      },
      exit: function () {
        return new Promise(function (c, b) {
          if (this.isFullscreen) {
            var k = function () {
              this.off("change", k);
              c()
            }
              .bind(this);
            this.on("change", k);
            Promise.resolve(f[e.exitFullscreen]())["catch"](b)
          } else
            c()
        }
          .bind(this))
      },
      toggle: function (c) {
        return this.isFullscreen ? this.exit() : this.request(c)
      },
      onchange: function (c) {
        this.on("change", c)
      },
      onerror: function (c) {
        this.on("error", c)
      },
      on: function (c, b) {
        var k = m[c];
        k && f.addEventListener(k, b, !1)
      },
      off: function (c, b) {
        var k = m[c];
        k && f.removeEventListener(k, b, !1)
      },
      raw: e
    };
  e ? (Object.defineProperties(a, {
    isFullscreen: {
      get: function () {
        return !!f[e.fullscreenElement]
      }
    },
    element: {
      enumerable: !0,
      get: function () {
        return f[e.fullscreenElement]
      }
    },
    isEnabled: {
      enumerable: !0,
      get: function () {
        return !!f[e.fullscreenEnabled]
      }
    }
  }),
    d ? module.exports = a : window.screenfull = a) : d ? module.exports = {
      isEnabled: !1
    } : window.screenfull = {
      isEnabled: !1
    }
}
)();
(function () {
  function f (z) {
    z = String(z);
    return z.charAt(0).toUpperCase() + z.slice(1)
  }
  function d (z, F) {
    var U = -1
      , Q = z ? z.length : 0;
    if ("number" == typeof Q && -1 < Q && Q <= t)
      for (; ++U < Q;)
        F(z[U], U, z);
    else
      m(z, F)
  }
  function e (z) {
    z = g(z);
    return /^(?:webOS|i(?:OS|P))/.test(z) ? z : f(z)
  }
  function m (z, F) {
    for (var U in z)
      v.call(z, U) && F(z[U], U, z)
  }
  function a (z) {
    return null == z ? f(z) : x.call(z).slice(8, -1)
  }
  function c (z, F) {
    var U = null != z ? typeof z[F] : "number";
    return !/^(?:boolean|number|string|undefined)$/.test(U) && ("object" == U ? !!z[F] : !0)
  }
  function b (z) {
    return String(z).replace(/([ -])(?!$)/g, "$1?")
  }
  function k (z, F) {
    var U = null;
    d(z, function (Q, K) {
      U = F(U, Q, K, z)
    });
    return U
  }
  function g (z) {
    return String(z).replace(/^ +| +$/g, "")
  }
  function h (z) {
    function F (la) {
      return k(la, function (fa, R) {
        var aa = R.pattern || b(R);
        !fa && (fa = RegExp("\\b" + aa + " *\\d+[.\\w_]*", "i").exec(z) || RegExp("\\b" + aa + " *\\w+-[\\w]*", "i").exec(z) || RegExp("\\b" + aa + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(z)) && ((fa = String(R.label && !RegExp(aa, "i").test(R.label) ? R.label : fa).split("/"))[1] && !/[\d.]+/.test(fa[0]) && (fa[0] += " " + fa[1]),
          R = R.label || R,
          fa = e(fa[0].replace(RegExp(aa, "i"), R).replace(RegExp("; *(?:" + R + "[_-])?", "i"), " ").replace(RegExp("(" + R + ")[-_.]?(\\w)", "i"), "$1 $2")));
        return fa
      })
    }
    function U (la) {
      return k(la, function (fa, R) {
        return fa || (RegExp(R + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(z) || 0)[1] || null
      })
    }
    var Q = n
      , K = z && "object" == typeof z && "String" != a(z);
    K && (Q = z,
      z = null);
    var Y = Q.navigator || {}
      , C = Y.userAgent || "";
    z || (z = C);
    var H = K ? !!Y.likeChrome : /\bChrome\b/.test(z) && !/internal|\n/i.test(x.toString())
      , T = K ? "Object" : "ScriptBridgingProxyObject"
      , M = K ? "Object" : "Environment"
      , ca = K && Q.java ? "JavaPackage" : a(Q.java)
      , P = K ? "Object" : "RuntimeObject";
    M = (ca = /\bJava/.test(ca) && Q.java) && a(Q.environment) == M;
    var X = ca ? "a" : "\u03b1", L = ca ? "b" : "\u03b2", A = Q.document || {}, B = Q.operamini || Q.opera, y = r.test(y = K && B ? B["[[Class]]"] : a(B)) ? y : B = null, u, w = z;
    K = [];
    var D = null
      , O = z == C;
    C = O && B && "function" == typeof B.version && B.version();
    var J = function (la) {
      return k(la, function (fa, R) {
        return fa || RegExp("\\b" + (R.pattern || b(R)) + "\\b", "i").exec(z) && (R.label || R)
      })
    }([{
      label: "EdgeHTML",
      pattern: "Edge"
    }, "Trident", {
      label: "WebKit",
      pattern: "AppleWebKit"
    }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"])
      , G = function (la) {
        return k(la, function (fa, R) {
          return fa || RegExp("\\b" + (R.pattern || b(R)) + "\\b", "i").exec(z) && (R.label || R)
        })
      }(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
        label: "Microsoft Edge",
        pattern: "(?:Edge|Edg|EdgA|EdgiOS)"
      }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", {
          label: "Samsung Internet",
          pattern: "SamsungBrowser"
        }, "SeaMonkey", {
          label: "Silk",
          pattern: "(?:Cloud9|Silk-Accelerated)"
        }, "Sleipnir", "SlimBrowser", {
          label: "SRWare Iron",
          pattern: "Iron"
        }, "Sunrise", "Swiftfox", "Vivaldi", "Waterfox", "WebPositive", {
          label: "Yandex Browser",
          pattern: "YaBrowser"
        }, {
          label: "UC Browser",
          pattern: "UCBrowser"
        }, "Opera Mini", {
          label: "Opera Mini",
          pattern: "OPiOS"
        }, "Opera", {
          label: "Opera",
          pattern: "OPR"
        }, "Chromium", "Chrome", {
          label: "Chrome",
          pattern: "(?:HeadlessChrome)"
        }, {
          label: "Chrome Mobile",
          pattern: "(?:CriOS|CrMo)"
        }, {
          label: "Firefox",
          pattern: "(?:Firefox|Minefield)"
        }, {
          label: "Firefox for iOS",
          pattern: "FxiOS"
        }, {
          label: "IE",
          pattern: "IEMobile"
        }, {
          label: "IE",
          pattern: "MSIE"
        }, "Safari"])
      , S = F([{
        label: "BlackBerry",
        pattern: "BB10"
      }, "BlackBerry", {
        label: "Galaxy S",
        pattern: "GT-I9000"
      }, {
        label: "Galaxy S2",
        pattern: "GT-I9100"
      }, {
        label: "Galaxy S3",
        pattern: "GT-I9300"
      }, {
        label: "Galaxy S4",
        pattern: "GT-I9500"
      }, {
        label: "Galaxy S5",
        pattern: "SM-G900"
      }, {
        label: "Galaxy S6",
        pattern: "SM-G920"
      }, {
        label: "Galaxy S6 Edge",
        pattern: "SM-G925"
      }, {
        label: "Galaxy S7",
        pattern: "SM-G930"
      }, {
        label: "Galaxy S7 Edge",
        pattern: "SM-G935"
      }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", {
        label: "Kindle Fire",
        pattern: "(?:Cloud9|Silk-Accelerated)"
      }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", {
        label: "Wii U",
        pattern: "WiiU"
      }, "Wii", "Xbox One", {
        label: "Xbox 360",
        pattern: "Xbox"
      }, "Xoom"])
      , ba = function (la) {
        return k(la, function (fa, R, aa) {
          return fa || (R[S] || R[/^[a-z]+(?: +[a-z]+\b)*/i.exec(S)] || RegExp("\\b" + b(aa) + "(?:\\b|\\w*\\d)", "i").exec(z)) && aa
        })
      }({
        Apple: {
          iPad: 1,
          iPhone: 1,
          iPod: 1
        },
        Alcatel: {},
        Archos: {},
        Amazon: {
          Kindle: 1,
          "Kindle Fire": 1
        },
        Asus: {
          Transformer: 1
        },
        "Barnes & Noble": {
          Nook: 1
        },
        BlackBerry: {
          PlayBook: 1
        },
        Google: {
          "Google TV": 1,
          Nexus: 1
        },
        HP: {
          TouchPad: 1
        },
        HTC: {},
        Huawei: {},
        Lenovo: {},
        LG: {},
        Microsoft: {
          Xbox: 1,
          "Xbox One": 1
        },
        Motorola: {
          Xoom: 1
        },
        Nintendo: {
          "Wii U": 1,
          Wii: 1
        },
        Nokia: {
          Lumia: 1
        },
        Oppo: {},
        Samsung: {
          "Galaxy S": 1,
          "Galaxy S2": 1,
          "Galaxy S3": 1,
          "Galaxy S4": 1
        },
        Sony: {
          PlayStation: 1,
          "PlayStation Vita": 1
        },
        Xiaomi: {
          Mi: 1,
          Redmi: 1
        }
      })
      , I = function (la) {
        return k(la, function (fa, R) {
          var aa = R.pattern || b(R);
          if (!fa && (fa = RegExp("\\b" + aa + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(z))) {
            var da = fa
              , na = R.label || R
              , ua = {
                "10.0": "10",
                "6.4": "10 Technical Preview",
                "6.3": "8.1",
                "6.2": "8",
                "6.1": "Server 2008 R2 / 7",
                "6.0": "Server 2008 / Vista",
                "5.2": "Server 2003 / XP 64-bit",
                "5.1": "XP",
                "5.01": "2000 SP1",
                "5.0": "2000",
                "4.0": "NT",
                "4.90": "ME"
              };
            aa && na && /^Win/i.test(da) && !/^Windows Phone /i.test(da) && (ua = ua[/[\d.]+$/.exec(da)]) && (da = "Windows " + ua);
            da = String(da);
            aa && na && (da = da.replace(RegExp(aa, "i"), na));
            fa = da = e(da.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0])
          }
          return fa
        })
      }(["Windows Phone", "KaiOS", "Android", "CentOS", {
        label: "Chrome OS",
        pattern: "CrOS"
      }, "Debian", {
          label: "DragonFly BSD",
          pattern: "DragonFly"
        }, "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "]);
    J && (J = [J]);
    /\bAndroid\b/.test(I) && !S && (u = /\bAndroid[^;]*;(.*?)(?:Build|\) AppleWebKit)\b/i.exec(z)) && (S = g(u[1]).replace(/^[a-z]{2}-[a-z]{2};\s*/i, "") || null);
    ba && !S ? S = F([ba]) : ba && S && (S = S.replace(RegExp("^(" + b(ba) + ")[-_.\\s]", "i"), ba + " ").replace(RegExp("^(" + b(ba) + ")[-_.]?(\\w)", "i"), ba + " $2"));
    if (u = /\bGoogle TV\b/.exec(S))
      S = u[0];
    /\bSimulator\b/i.test(z) && (S = (S ? S + " " : "") + "Simulator");
    "Opera Mini" == G && /\bOPiOS\b/.test(z) && K.push("running in Turbo/Uncompressed mode");
    "IE" == G && /\blike iPhone OS\b/.test(z) ? (u = h(z.replace(/like iPhone OS/, "")),
      ba = u.manufacturer,
      S = u.product) : /^iP/.test(S) ? (G || (G = "Safari"),
        I = "iOS" + ((u = / OS ([\d_]+)/i.exec(z)) ? " " + u[1].replace(/_/g, ".") : "")) : "Konqueror" == G && /^Linux\b/i.test(I) ? I = "Kubuntu" : ba && "Google" != ba && (/Chrome/.test(G) && !/\bMobile Safari\b/i.test(z) || /\bVita\b/.test(S)) || /\bAndroid\b/.test(I) && /^Chrome/.test(G) && /\bVersion\//i.test(z) ? (G = "Android Browser",
          I = /\bAndroid\b/.test(I) ? I : "Android") : "Silk" == G ? (/\bMobi/i.test(z) || (I = "Android",
            K.unshift("desktop mode")),
            /Accelerated *= *true/i.test(z) && K.unshift("accelerated")) : "UC Browser" == G && /\bUCWEB\b/.test(z) ? K.push("speed mode") : "PaleMoon" == G && (u = /\bFirefox\/([\d.]+)\b/.exec(z)) ? K.push("identifying as Firefox " + u[1]) : "Firefox" == G && (u = /\b(Mobile|Tablet|TV)\b/i.exec(z)) ? (I || (I = "Firefox OS"),
              S || (S = u[1])) : !G || (u = !/\bMinefield\b/i.test(z) && /\b(?:Firefox|Safari)\b/.exec(G)) ? (G && !S && /[\/,]|^[^(]+?\)/.test(z.slice(z.indexOf(u + "/") + 8)) && (G = null),
                (u = S || ba || I) && (S || ba || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(I)) && (G = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(I) ? I : u) + " Browser")) : "Electron" == G && (u = (/\bChrome\/([\d.]+)\b/.exec(z) || 0)[1]) && K.push("Chromium " + u);
    C || (C = U(["(?:Cloud9|CriOS|CrMo|Edge|Edg|EdgA|EdgiOS|FxiOS|HeadlessChrome|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$)|UCBrowser|YaBrowser)", "Version", b(G), "(?:Firefox|Minefield|NetFront)"]));
    if (u = "iCab" == J && 3 < parseFloat(C) && "WebKit" || /\bOpera\b/.test(G) && (/\bOPR\b/.test(z) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(z) && !/^(?:Trident|EdgeHTML)$/.test(J) && "WebKit" || !J && /\bMSIE\b/i.test(z) && ("Mac OS" == I ? "Tasman" : "Trident") || "WebKit" == J && /\bPlayStation\b(?! Vita\b)/i.test(G) && "NetFront")
      J = [u];
    "IE" == G && (u = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(z) || 0)[1]) ? (G += " Mobile",
      I = "Windows Phone " + (/\+$/.test(u) ? u : u + ".x"),
      K.unshift("desktop mode")) : /\bWPDesktop\b/i.test(z) ? (G = "IE Mobile",
        I = "Windows Phone 8.x",
        K.unshift("desktop mode"),
        C || (C = (/\brv:([\d.]+)/.exec(z) || 0)[1])) : "IE" != G && "Trident" == J && (u = /\brv:([\d.]+)/.exec(z)) && (G && K.push("identifying as " + G + (C ? " " + C : "")),
          G = "IE",
          C = u[1]);
    if (O) {
      if (c(Q, "global"))
        if (ca && (u = ca.lang.System,
          w = u.getProperty("os.arch"),
          I = I || u.getProperty("os.name") + " " + u.getProperty("os.version")),
          M) {
          try {
            C = Q.require("ringo/engine").version.join("."),
              G = "RingoJS"
          } catch (la) {
            (u = Q.system) && u.global.system == Q.system && (G = "Narwhal",
              I || (I = u[0].os || null))
          }
          G || (G = "Rhino")
        } else
          "object" == typeof Q.process && !Q.process.browser && (u = Q.process) && ("object" == typeof u.versions && ("string" == typeof u.versions.electron ? (K.push("Node " + u.versions.node),
            G = "Electron",
            C = u.versions.electron) : "string" == typeof u.versions.nw && (K.push("Chromium " + C, "Node " + u.versions.node),
              G = "NW.js",
              C = u.versions.nw)),
            G || (G = "Node.js",
              w = u.arch,
              I = u.platform,
              C = (C = /[\d.]+/.exec(u.version)) ? C[0] : null));
      else
        a(u = Q.runtime) == T ? (G = "Adobe AIR",
          I = u.flash.system.Capabilities.os) : a(u = Q.phantom) == P ? (G = "PhantomJS",
            C = (u = u.version || null) && u.major + "." + u.minor + "." + u.patch) : "number" == typeof A.documentMode && (u = /\bTrident\/(\d+)/i.exec(z)) ? (C = [C, A.documentMode],
              (u = +u[1] + 4) != C[1] && (K.push("IE " + C[1] + " mode"),
                J && (J[1] = ""),
                C[1] = u),
              C = "IE" == G ? String(C[1].toFixed(1)) : C[0]) : "number" == typeof A.documentMode && /^(?:Chrome|Firefox)\b/.test(G) && (K.push("masking as " + G + " " + C),
                G = "IE",
                C = "11.0",
                J = ["Trident"],
                I = "Windows");
      I = I && e(I)
    }
    C && (u = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(C) || /(?:alpha|beta)(?: ?\d)?/i.exec(z + ";" + (O && Y.appMinorVersion)) || /\bMinefield\b/i.test(z) && "a") && (D = /b/i.test(u) ? "beta" : "alpha",
      C = C.replace(RegExp(u + "\\+?$"), "") + ("beta" == D ? L : X) + (/\d+\+?/.exec(u) || ""));
    if ("Fennec" == G || "Firefox" == G && /\b(?:Android|Firefox OS|KaiOS)\b/.test(I))
      G = "Firefox Mobile";
    else if ("Maxthon" == G && C)
      C = C.replace(/\.[\d.]+/, ".x");
    else if (/\bXbox\b/i.test(S))
      "Xbox 360" == S && (I = null),
        "Xbox 360" == S && /\bIEMobile\b/.test(z) && K.unshift("mobile mode");
    else if (!/^(?:Chrome|IE|Opera)$/.test(G) && (!G || S || /Browser|Mobi/.test(G)) || "Windows CE" != I && !/Mobi/i.test(z))
      if ("IE" == G && O)
        try {
          null === Q.external && K.unshift("platform preview")
        } catch (la) {
          K.unshift("embedded")
        }
      else
        (/\bBlackBerry\b/.test(S) || /\bBB10\b/.test(z)) && (u = (RegExp(S.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(z) || 0)[1] || C) ? (u = [u, /BB10/.test(z)],
          I = (u[1] ? (S = null,
            ba = "BlackBerry") : "Device Software") + " " + u[0],
          C = null) : this != m && "Wii" != S && (O && B || /Opera/.test(G) && /\b(?:MSIE|Firefox)\b/i.test(z) || "Firefox" == G && /\bOS X (?:\d+\.){2,}/.test(I) || "IE" == G && (I && !/^Win/.test(I) && 5.5 < C || /\bWindows XP\b/.test(I) && 8 < C || 8 == C && !/\bTrident\b/.test(z))) && !r.test(u = h.call(m, z.replace(r, "") + ";")) && u.name && (u = "ing as " + u.name + ((u = u.version) ? " " + u : ""),
            r.test(G) ? (/\bIE\b/.test(u) && "Mac OS" == I && (I = null),
              u = "identify" + u) : (u = "mask" + u,
                G = y ? e(y.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera",
                /\bIE\b/.test(u) && (I = null),
                O || (C = null)),
            J = ["Presto"],
            K.push(u));
    else
      G += " Mobile";
    if (u = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(z) || 0)[1]) {
      u = [parseFloat(u.replace(/\.(\d)$/, ".0$1")), u];
      if ("Safari" == G && "+" == u[1].slice(-1))
        G = "WebKit Nightly",
          D = "alpha",
          C = u[1].slice(0, -1);
      else if (C == u[1] || C == (u[2] = (/\bSafari\/([\d.]+\+?)/i.exec(z) || 0)[1]))
        C = null;
      u[1] = (/\b(?:Headless)?Chrome\/([\d.]+)/i.exec(z) || 0)[1];
      537.36 == u[0] && 537.36 == u[2] && 28 <= parseFloat(u[1]) && "WebKit" == J && (J = ["Blink"]);
      O && (H || u[1]) ? (J && (J[1] = "like Chrome"),
        u = u[1] || (u = u[0],
          530 > u ? 1 : 532 > u ? 2 : 532.05 > u ? 3 : 533 > u ? 4 : 534.03 > u ? 5 : 534.07 > u ? 6 : 534.1 > u ? 7 : 534.13 > u ? 8 : 534.16 > u ? 9 : 534.24 > u ? 10 : 534.3 > u ? 11 : 535.01 > u ? 12 : 535.02 > u ? "13+" : 535.07 > u ? 15 : 535.11 > u ? 16 : 535.19 > u ? 17 : 536.05 > u ? 18 : 536.1 > u ? 19 : 537.01 > u ? 20 : 537.11 > u ? "21+" : 537.13 > u ? 23 : 537.18 > u ? 24 : 537.24 > u ? 25 : 537.36 > u ? 26 : "Blink" != J ? "27" : "28")) : (J && (J[1] = "like Safari"),
            u = (u = u[0],
              400 > u ? 1 : 500 > u ? 2 : 526 > u ? 3 : 533 > u ? 4 : 534 > u ? "4+" : 535 > u ? 5 : 537 > u ? 6 : 538 > u ? 7 : 601 > u ? 8 : 602 > u ? 9 : 604 > u ? 10 : 606 > u ? 11 : 608 > u ? 12 : "12"));
      J && (J[1] += " " + (u += "number" == typeof u ? ".x" : /[.+]/.test(u) ? "" : "+"));
      "Safari" == G && (!C || 45 < parseInt(C)) ? C = u : "Chrome" == G && /\bHeadlessChrome/i.test(z) && K.unshift("headless")
    }
    "Opera" == G && (u = /\bzbov|zvav$/.exec(I)) ? (G += " ",
      K.unshift("desktop mode"),
      "zvav" == u ? (G += "Mini",
        C = null) : G += "Mobile",
      I = I.replace(RegExp(" *" + u + "$"), "")) : "Safari" == G && /\bChrome\b/.exec(J && J[1]) ? (K.unshift("desktop mode"),
        G = "Chrome Mobile",
        C = null,
        /\bOS X\b/.test(I) ? (ba = "Apple",
          I = "iOS 4.3+") : I = null) : /\bSRWare Iron\b/.test(G) && !C && (C = U("Chrome"));
    C && 0 == C.indexOf(u = /[\d.]+$/.exec(I)) && -1 < z.indexOf("/" + u + "-") && (I = g(I.replace(u, "")));
    I && -1 != I.indexOf(G) && !RegExp(G + " OS").test(I) && (I = I.replace(RegExp(" *" + b(G) + " *"), ""));
    J && !/\b(?:Avant|Nook)\b/.test(G) && (/Browser|Lunascape|Maxthon/.test(G) || "Safari" != G && /^iOS/.test(I) && /\bSafari\b/.test(J[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|SRWare Iron|Vivaldi|Web)/.test(G) && J[1]) && (u = J[J.length - 1]) && K.push(u);
    K.length && (K = ["(" + K.join("; ") + ")"]);
    ba && S && 0 > S.indexOf(ba) && K.push("on " + ba);
    S && K.push((/^on /.test(K[K.length - 1]) ? "" : "on ") + S);
    if (I) {
      var qa = (u = / ([\d.+]+)$/.exec(I)) && "/" == I.charAt(I.length - u[0].length - 1);
      I = {
        architecture: 32,
        family: u && !qa ? I.replace(u[0], "") : I,
        version: u ? u[1] : null,
        toString: function () {
          var la = this.version;
          return this.family + (la && !qa ? " " + la : "") + (64 == this.architecture ? " 64-bit" : "")
        }
      }
    }
    (u = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(w)) && !/\bi686\b/i.test(w) ? (I && (I.architecture = 64,
      I.family = I.family.replace(RegExp(" *" + u), "")),
      G && (/\bWOW64\b/i.test(z) || O && /\w(?:86|32)$/.test(Y.cpuClass || Y.platform) && !/\bWin64; x64\b/i.test(z)) && K.unshift("32-bit")) : I && /^OS X/.test(I.family) && "Chrome" == G && 39 <= parseFloat(C) && (I.architecture = 64);
    z || (z = null);
    Q = {};
    Q.description = z;
    Q.layout = J && J[0];
    Q.manufacturer = ba;
    Q.name = G;
    Q.prerelease = D;
    Q.product = S;
    Q.ua = z;
    Q.version = G && C;
    Q.os = I || {
      architecture: null,
      family: null,
      version: null,
      toString: function () {
        return "null"
      }
    };
    Q.parse = h;
    Q.toString = function () {
      return this.description || ""
    }
      ;
    Q.version && K.unshift(C);
    Q.name && K.unshift(G);
    I && G && (I != String(I).split(" ")[0] || I != G.split(" ")[0] && !S) && K.push(S ? "(" + I + ")" : "on " + I);
    K.length && (Q.description = K.join(" "));
    return Q
  }
  var l = {
    "function": !0,
    object: !0
  }
    , n = l[typeof window] && window || this
    , p = l[typeof exports] && exports;
  l = l[typeof module] && module && !module.nodeType && module;
  var q = p && l && "object" == typeof global && global;
  !q || q.global !== q && q.window !== q && q.self !== q || (n = q);
  var t = Math.pow(2, 53) - 1
    , r = /\bOpera/;
  q = Object.prototype;
  var v = q.hasOwnProperty
    , x = q.toString
    , E = h();
  "function" == typeof define && "object" == typeof define.amd && define.amd ? (n.platform = E,
    define(function () {
      return E
    })) : p && l ? m(E, function (z, F) {
      p[F] = z
    }) : n.platform = E
}
).call(this);
function buildIOSMeta () {
  for (var f = [{
    name: "viewport",
    content: "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
  }, {
    name: "apple-mobile-web-app-capable",
    content: "yes"
  }, {
    name: "apple-mobile-web-app-status-bar-style",
    content: "black"
  }], d = 0; d < f.length; d++) {
    var e = document.createElement("meta");
    e.name = f[d].name;
    e.content = f[d].content;
    var m = window.document.head.querySelector('meta[name="' + e.name + '"]');
    m && m.parentNode.removeChild(m);
    window.document.head.appendChild(e)
  }
}
function hideIOSFullscreenPanel () {
  jQuery(".xxx-ios-fullscreen-message").css("display", "none");
  jQuery(".xxx-ios-fullscreen-scroll").css("display", "none");
  jQuery(".xxx-game-iframe-full").removeClass("xxx-game-iframe-iphone-se")
}
function buildIOSFullscreenPanel () {
  jQuery("body").append('<div class="xxx-ios-fullscreen-message"><div class="xxx-ios-fullscreen-swipe"></div></div><div class="xxx-ios-fullscreen-scroll"></div>')
}
function showIOSFullscreenPanel () {
  jQuery(".xxx-ios-fullscreen-message").css("display", "block");
  jQuery(".xxx-ios-fullscreen-scroll").css("display", "block")
}
function __iosResize () {
  window.scrollTo(0, 0);
  console.log(window.devicePixelRatio);
  console.log(window.innerWidth);
  console.log(window.innerHeight);
  if ("iPhone" === platform.product)
    switch (window.devicePixelRatio) {
      case 2:
        switch (window.innerWidth) {
          case 568:
            320 !== window.innerHeight && jQuery(".xxx-game-iframe-full").addClass("xxx-game-iframe-iphone-se");
            break;
          case 667:
            375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
            break;
          case 808:
            414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
            break;
          default:
            hideIOSFullscreenPanel()
        }
        break;
      case 3:
        switch (window.innerWidth) {
          case 736:
            414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
            break;
          case 724:
            375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
            break;
          case 808:
            414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
            break;
          default:
            hideIOSFullscreenPanel()
        }
        break;
      default:
        hideIOSFullscreenPanel()
    }
}
function iosResize () {
  __iosResize();
  setTimeout(function () {
    __iosResize()
  }, 500)
}
function iosInIframe () {
  try {
    return window.self !== window.top
  } catch (f) {
    return !0
  }
}
$(document).ready(function () {
  platform && "iPhone" === platform.product && "safari" !== platform.name.toLowerCase() && !iosInIframe() && (buildIOSFullscreenPanel(),
    buildIOSMeta())
});
jQuery(window).resize(function () {
  platform && "iPhone" === platform.product && "safari" !== platform.name.toLowerCase() && !iosInIframe() && iosResize()
});
var s_iOffsetX = 0, s_iOffsetY = 0, s_fInverseScaling = 0, s_bIsIphone, s_bFocus = !0;
(function (f) {
  (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(f) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(f.substr(0, 4))
}
)(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function () {
  sizeHandler()
});
function trace (f) {
  console.log(f)
}
function isIpad () {
  var f = -1 !== navigator.userAgent.toLowerCase().indexOf("ipad");
  return !f && navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && 2 < navigator.maxTouchPoints ? !0 : f
}
function isMobile () {
  return isIpad() ? !0 : jQuery.browser.mobile
}
function isIOS () {
  for (var f = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";"); f.length;)
    if (navigator.platform === f.pop())
      return s_bIsIphone = !0;
  return s_bIsIphone = !1
}
window.addEventListener("orientationchange", onOrientationChange);
function onOrientationChange () {
  window.matchMedia("(orientation: portrait)").matches && sizeHandler();
  window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}
function getSize (f) {
  var d = f.toLowerCase()
    , e = window.document
    , m = e.documentElement;
  if (void 0 === window["inner" + f])
    f = m["client" + f];
  else if (window["inner" + f] != m["client" + f]) {
    var a = e.createElement("body");
    a.id = "vpw-test-b";
    a.style.cssText = "overflow:scroll";
    var c = e.createElement("div");
    c.id = "vpw-test-d";
    c.style.cssText = "position:absolute;top:-1000px";
    c.innerHTML = "<style>@media(" + d + ":" + m["client" + f] + "px){body#vpw-test-b div#vpw-test-d{" + d + ":7px!important}}</style>";
    a.appendChild(c);
    m.insertBefore(a, e.head);
    f = 7 == c["offset" + f] ? m["client" + f] : window["inner" + f];
    m.removeChild(a)
  } else
    f = window["inner" + f];
  return f
}
function getIOSWindowHeight () {
  return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}
function getHeightOfIOSToolbars () {
  var f = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
  return 1 < f ? f : 0
}
function sizeHandler () {
  window.scrollTo(0, 1);
  if ($("#canvas")) {
    var f = null !== platform.name && "safari" === platform.name.toLowerCase() ? getIOSWindowHeight() : getSize("Height");
    var d = getSize("Width");
    s_bFocus && _checkOrientation(d, f);
    s_iScaleFactor = Math.min(f / CANVAS_HEIGHT, d / CANVAS_WIDTH);
    var e = Math.round(CANVAS_WIDTH * s_iScaleFactor)
      , m = Math.round(CANVAS_HEIGHT * s_iScaleFactor);
    if (m < f) {
      var a = f - m;
      m += a;
      e += CANVAS_WIDTH / CANVAS_HEIGHT * a
    } else
      e < d && (a = d - e,
        e += a,
        m += CANVAS_HEIGHT / CANVAS_WIDTH * a);
    a = f / 2 - m / 2;
    var c = d / 2 - e / 2
      , b = CANVAS_WIDTH / e;
    if (c * b < -EDGEBOARD_X || a * b < -EDGEBOARD_Y)
      s_iScaleFactor = Math.min(f / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y), d / (CANVAS_WIDTH - 2 * EDGEBOARD_X)),
        e = Math.round(CANVAS_WIDTH * s_iScaleFactor),
        m = Math.round(CANVAS_HEIGHT * s_iScaleFactor),
        a = (f - m) / 2,
        c = (d - e) / 2,
        b = CANVAS_WIDTH / e;
    s_fInverseScaling = b;
    s_iOffsetX = -1 * c * b;
    s_iOffsetY = -1 * a * b;
    0 <= a && (s_iOffsetY = 0);
    0 <= c && (s_iOffsetX = 0);
    null !== s_oInterface && s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    null !== s_oMenu && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    $("#canvas").css("width", e + "px");
    $("#canvas").css("height", m + "px");
    s_iCanvasOffsetHeight = a;
    0 > a || (a = (f - m) / 2);
    $("#canvas").css("top", a + "px");
    $("#canvas").css("left", c + "px");
    resizeCanvas3D();
    s_iCanvasResizeWidth = e;
    s_iCanvasResizeHeight = m;
    s_iCanvasOffsetWidth = c;
    fullscreenHandler()
  }
}
function _checkOrientation (f, d) {
  s_bMobile && ENABLE_CHECK_ORIENTATION && (f > d ? "landscape" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"),
    s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
      s_oMain.stopUpdate()) : "portrait" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"),
        s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
          s_oMain.stopUpdate()))
}
function createBitmap (f, d, e) {
  var m = new createjs.Bitmap(f)
    , a = new createjs.Shape;
  d && e ? a.graphics.beginFill("#fff").drawRect(-d / 2, -e / 2, d, e) : a.graphics.beginFill("#ff0").drawRect(0, 0, f.width, f.height);
  m.hitArea = a;
  return m
}
function createSprite (f, d, e, m, a, c) {
  f = null !== d ? new createjs.Sprite(f, d) : new createjs.Sprite(f);
  d = new createjs.Shape;
  d.graphics.beginFill("#000000").drawRect(-e, -m, a, c);
  f.hitArea = d;
  return f
}
function randomFloatBetween (f, d, e) {
  "undefined" === typeof e && (e = 2);
  return parseFloat(Math.min(f + Math.random() * (d - f), d).toFixed(e))
}
function shuffle (f) {
  for (var d = f.length, e, m; 0 !== d;)
    m = Math.floor(Math.random() * d),
      --d,
      e = f[d],
      f[d] = f[m],
      f[m] = e;
  return f
}
function formatTime (f) {
  f /= 1E3;
  var d = Math.floor(f / 60);
  f = parseFloat(f - 60 * d).toFixed(1);
  var e = "";
  e = 10 > d ? e + ("0" + d + ":") : e + (d + ":");
  return 10 > f ? e + ("0" + f) : e + f
}
function degreesToRadians (f) {
  return f * Math.PI / 180
}
function checkRectCollision (f, d) {
  var e = getBounds(f, .9);
  var m = getBounds(d, .98);
  return calculateIntersection(e, m)
}
function calculateIntersection (f, d) {
  var e, m, a, c;
  var b = f.x + (e = f.width / 2);
  var k = f.y + (m = f.height / 2);
  var g = d.x + (a = d.width / 2);
  var h = d.y + (c = d.height / 2);
  b = Math.abs(b - g) - (e + a);
  k = Math.abs(k - h) - (m + c);
  return 0 > b && 0 > k ? (b = Math.min(Math.min(f.width, d.width), -b),
    k = Math.min(Math.min(f.height, d.height), -k),
  {
    x: Math.max(f.x, d.x),
    y: Math.max(f.y, d.y),
    width: b,
    height: k,
    rect1: f,
    rect2: d
  }) : null
}
function getBounds (f, d) {
  var e = {
    x: Infinity,
    y: Infinity,
    width: 0,
    height: 0
  };
  if (f instanceof createjs.Container) {
    e.x2 = -Infinity;
    e.y2 = -Infinity;
    var m = f.children, a = m.length, c;
    for (c = 0; c < a; c++) {
      var b = getBounds(m[c], 1);
      b.x < e.x && (e.x = b.x);
      b.y < e.y && (e.y = b.y);
      b.x + b.width > e.x2 && (e.x2 = b.x + b.width);
      b.y + b.height > e.y2 && (e.y2 = b.y + b.height)
    }
    Infinity == e.x && (e.x = 0);
    Infinity == e.y && (e.y = 0);
    Infinity == e.x2 && (e.x2 = 0);
    Infinity == e.y2 && (e.y2 = 0);
    e.width = e.x2 - e.x;
    e.height = e.y2 - e.y;
    delete e.x2;
    delete e.y2
  } else {
    if (f instanceof createjs.Bitmap) {
      a = f.sourceRect || f.image;
      c = a.width * d;
      var k = a.height * d
    } else if (f instanceof createjs.Sprite)
      if (f.spriteSheet._frames && f.spriteSheet._frames[f.currentFrame] && f.spriteSheet._frames[f.currentFrame].image) {
        a = f.spriteSheet.getFrame(f.currentFrame);
        c = a.rect.width;
        k = a.rect.height;
        m = a.regX;
        var g = a.regY
      } else
        e.x = f.x || 0,
          e.y = f.y || 0;
    else
      e.x = f.x || 0,
        e.y = f.y || 0;
    m = m || 0;
    c = c || 0;
    g = g || 0;
    k = k || 0;
    e.regX = m;
    e.regY = g;
    a = f.localToGlobal(0 - m, 0 - g);
    b = f.localToGlobal(c - m, k - g);
    c = f.localToGlobal(c - m, 0 - g);
    m = f.localToGlobal(0 - m, k - g);
    e.x = Math.min(Math.min(Math.min(a.x, b.x), c.x), m.x);
    e.y = Math.min(Math.min(Math.min(a.y, b.y), c.y), m.y);
    e.width = Math.max(Math.max(Math.max(a.x, b.x), c.x), m.x) - e.x;
    e.height = Math.max(Math.max(Math.max(a.y, b.y), c.y), m.y) - e.y
  }
  return e
}
function NoClickDelay (f) {
  this.element = f;
  window.Touch && this.element.addEventListener("touchstart", this, !1)
}
NoClickDelay.prototype = {
  handleEvent: function (f) {
    switch (f.type) {
      case "touchstart":
        this.onTouchStart(f);
        break;
      case "touchmove":
        this.onTouchMove(f);
        break;
      case "touchend":
        this.onTouchEnd(f)
    }
  },
  onTouchStart: function (f) {
    f.preventDefault();
    this.moved = !1;
    this.element.addEventListener("touchmove", this, !1);
    this.element.addEventListener("touchend", this, !1)
  },
  onTouchMove: function (f) {
    this.moved = !0
  },
  onTouchEnd: function (f) {
    this.element.removeEventListener("touchmove", this, !1);
    this.element.removeEventListener("touchend", this, !1);
    if (!this.moved) {
      f = document.elementFromPoint(f.changedTouches[0].clientX, f.changedTouches[0].clientY);
      3 == f.nodeType && (f = f.parentNode);
      var d = document.createEvent("MouseEvents");
      d.initEvent("click", !0, !0);
      f.dispatchEvent(d)
    }
  }
};
(function () {
  function f (e) {
    var m = {
      focus: "visible",
      focusin: "visible",
      pageshow: "visible",
      blur: "hidden",
      focusout: "hidden",
      pagehide: "hidden"
    };
    e = e || window.event;
    e.type in m ? document.body.className = m[e.type] : (document.body.className = this[d] ? "hidden" : "visible",
      "hidden" === document.body.className ? (s_oMain.stopUpdate(),
        s_bFocus = !1) : (s_oMain.startUpdate(),
          s_bFocus = !0))
  }
  var d = "hidden";
  d in document ? document.addEventListener("visibilitychange", f) : (d = "mozHidden") in document ? document.addEventListener("mozvisibilitychange", f) : (d = "webkitHidden") in document ? document.addEventListener("webkitvisibilitychange", f) : (d = "msHidden") in document ? document.addEventListener("msvisibilitychange", f) : "onfocusin" in document ? document.onfocusin = document.onfocusout = f : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = f
}
)();
function playSound (f, d, e) {
  return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[f].play(),
    s_aSounds[f].volume(d),
    s_aSounds[f].loop(e),
    s_aSounds[f]) : null
}
function stopSound (f) {
  !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].stop()
}
function setVolume (f, d) {
  !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].volume(d)
}
function setMute (f, d) {
  !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].mute(d)
}
function ctlArcadeResume () {
  null !== s_oMain && s_oMain.startUpdate()
}
function ctlArcadePause () {
  null !== s_oMain && s_oMain.stopUpdate()
}
function getParamValue (f) {
  for (var d = window.location.search.substring(1).split("&"), e = 0; e < d.length; e++) {
    var m = d[e].split("=");
    if (m[0] == f)
      return m[1]
  }
}
function rotateVector2D (f, d) {
  return {
    x: d.x * Math.cos(f) + d.y * Math.sin(f),
    y: d.x * -Math.sin(f) + d.y * Math.cos(f)
  }
}
function normalize (f, d) {
  0 < d && (f.x /= d,
    f.y /= d);
  return f
}
function findNearestIntersectingObject (f, d, e, m) {
  var a = CANVAS_RESIZE_WIDTH + 2 * OFFSET_WIDTH
    , c = CANVAS_RESIZE_HEIGHT + 2 * OFFSET_HEIGHT
    , b = new THREE.Raycaster
    , k = new THREE.Vector3;
  k.x = f / a * 2 - 1;
  k.y = 2 * -(d / c) + 1;
  k.z = .5;
  b.setFromCamera(k, e);
  f = b.intersectObjects(m, !0);
  d = !1;
  0 < f.length && (d = f[0]);
  return d
}
function distance (f, d, e, m) {
  f -= e;
  d -= m;
  return Math.sqrt(f * f + d * d)
}
function distance2 (f, d, e, m) {
  f -= e;
  d -= m;
  return f * f + d * d
}
function resizeCanvas3D () {
  $("canvas").each(function () {
    "#canvas" != $(this).attr("id") && ($(this).css("width", $("#canvas").css("width")),
      $(this).css("height", $("#canvas").css("height")),
      $(this).css("position", $("#canvas").css("position")),
      $(this).css("left", $("#canvas").css("left")),
      $(this).css("top", $("#canvas").css("top")))
  })
}
function createOrthoGraphicCamera () {
  var f = new THREE.PerspectiveCamera(FOV, CANVAS_WIDTH / CANVAS_HEIGHT, NEAR, FAR);
  f.rotation.x = Math.PI / 180 * 88.6;
  f.rotation.y = Math.PI / 180 * .03;
  f.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
  f.updateProjectionMatrix();
  f.updateMatrixWorld();
  return f
}
function rotateVector2D (f, d) {
  return {
    x: d.x * Math.cos(f) + d.y * Math.sin(f),
    y: d.x * -Math.sin(f) + d.y * Math.cos(f),
    z: 0
  }
}
Math.radians = function (f) {
  return f * Math.PI / 180
}
  ;
Math.degrees = function (f) {
  return 180 * f / Math.PI
}
  ;
function distanceV3 (f, d, e, m, a, c) {
  f -= m;
  d -= a;
  e -= c;
  return Math.sqrt(f * f + d * d + e * e)
}
function distanceV2 (f, d) {
  var e = f.x - d.x
    , m = f.y - d.y;
  return Math.sqrt(e * e + m * m)
}
function saveItem (f, d) {
  s_bStorageAvailable && localStorage.setItem(f, d)
}
function getItem (f) {
  return s_bStorageAvailable ? localStorage.getItem(f) : 0
}
function clearAllItem () {
  s_bStorageAvailable && localStorage.clear()
}
function fullscreenHandler () {
  ENABLE_FULLSCREEN && !1 !== screenfull.isEnabled && (s_bFullscreen = screenfull.isFullscreen,
    null !== s_oInterface && s_oInterface.resetFullscreenBut(),
    null !== s_oMenu && s_oMenu.resetFullscreenBut())
}
if (screenfull.isEnabled)
  screenfull.on("change", function () {
    s_bFullscreen = screenfull.isFullscreen;
    null !== s_oInterface && s_oInterface.resetFullscreenBut();
    null !== s_oMenu && s_oMenu.resetFullscreenBut()
  });
function CSpriteLibrary () {
  var f, d, e, m, a, c;
  this.init = function (b, k, g) {
    e = d = 0;
    m = b;
    a = k;
    c = g;
    f = {}
  }
    ;
  this.addSprite = function (b, k) {
    f.hasOwnProperty(b) || (f[b] = {
      szPath: k,
      oSprite: new Image
    },
      d++)
  }
    ;
  this.getSprite = function (b) {
    return f.hasOwnProperty(b) ? f[b].oSprite : null
  }
    ;
  this._onSpritesLoaded = function () {
    a.call(c)
  }
    ;
  this._onSpriteLoaded = function () {
    m.call(c);
    ++e == d && this._onSpritesLoaded()
  }
    ;
  this.loadSprites = function () {
    for (var b in f)
      f[b].oSprite.oSpriteLibrary = this,
        f[b].oSprite.onload = function () {
          this.oSpriteLibrary._onSpriteLoaded()
        }
        ,
        f[b].oSprite.onerror = function (k) {
          var g = k.currentTarget;
          setTimeout(function () {
            f[g.szKey].oSprite.src = f[g.szKey].szPath
          }, 500)
        }
        ,
        f[b].oSprite.src = f[b].szPath
  }
    ;
  this.getNumSprites = function () {
    return d
  }
    ;
  this.loadSpriteGroup = function (b, k, g, h) {
    for (var l = 0; l < b.length; l++)
      f[b[l].key] = {
        szPath: b[l].path,
        oSprite: new Image
      },
        d++;
    this._loadInStreamingSprite(b, k, g, h)
  }
    ;
  this._loadInStreamingSprite = function (b, k, g, h) {
    var l = b.splice(0, 1)[0].key;
    f[l].oSprite.oSpriteLibrary = this;
    f[l].oSprite.onload = function () {
      this.oSpriteLibrary._onElementOfSpriteGroupLoaded(b, k, g, h)
    }
      ;
    f[l].oSprite.onerror = function (n) {
      setTimeout(function () {
        f[l].oSprite.src = f[l].szPath
      }, 500)
    }
      ;
    f[l].oSprite.src = f[l].szPath
  }
    ;
  this._onElementOfSpriteGroupLoaded = function (b, k, g, h) {
    0 === b.length ? g && g.call(k, h) : s_oSpriteLibrary._loadInStreamingSprite(b, k, g, h)
  }
}
var CANVAS_WIDTH = 1360, CANVAS_HEIGHT = 640, CANVAS_WIDTH_HALF = .5 * CANVAS_WIDTH, CANVAS_HEIGHT_HALF = .5 * CANVAS_HEIGHT, EDGEBOARD_X = 250, EDGEBOARD_Y = 20, DISABLE_SOUND_MOBILE = !1, FONT_GAME = "TradeGothic", FPS = 30, FPS_DESKTOP = 60, FPS_TIME = 1 / FPS, ROLL_BALL_RATE = 60 / FPS, STATE_LOADING = 0, STATE_MENU = 1, STATE_HELP = 1, STATE_GAME = 3, ON_MOUSE_DOWN = 0, ON_MOUSE_UP = 1, ON_MOUSE_OVER = 2, ON_MOUSE_OUT = 3, ON_DRAG_START = 4, ON_DRAG_END = 5, ON_TWEEN_ENDED = 6, ON_BUT_NO_DOWN = 7, ON_BUT_YES_DOWN = 8, STEP_RATE = 1.5, TEXT_SIZE = [80, 100, 130], LOCAL_BEST_SCORE = 0, START_HAND_SWIPE_POS = {
  x: CANVAS_WIDTH_HALF,
  y: CANVAS_HEIGHT_HALF + 200
}, END_HAND_SWIPE_POS = [{
  x: CANVAS_WIDTH_HALF - 250,
  y: CANVAS_HEIGHT_HALF - 200
}, {
  x: CANVAS_WIDTH_HALF,
  y: CANVAS_HEIGHT_HALF - 200
}, {
  x: CANVAS_WIDTH_HALF + 250,
  y: CANVAS_HEIGHT_HALF - 200
}], MS_TIME_SWIPE_END = 1E3, MS_TIME_SWIPE_START = 3E3, MS_TIME_FADE_HELP_TEXT = 500, LOCALSTORAGE_STRING = ["penalty_best_score"], TEXT_EXCELLENT_COLOR = ["#fff", "#5d96fe"], TEXT_COLOR = "#ffffff", TEXT_COLOR_1 = "#ff2222", TEXT_COLOR_STROKE = "#002a59", OUTLINE_WIDTH = 1.5, TIME_INTERVAL_STROBE = .2, PHYSICS_ACCURACY = 3, MOBILE_OFFSET_GLOVES_X = -100, BALL_VELOCITY_MULTIPLIER = 1, PHYSICS_STEP = 1 / (FPS * STEP_RATE), MS_WAIT_SHOW_GAME_OVER_PANEL = 250, STATE_INIT = 0, STATE_PLAY = 1, STATE_FINISH = 2, STATE_PAUSE = 3, IDLE = 0, RIGHT = 1, LEFT = 2, CENTER_DOWN = 3, CENTER_UP = 4, LEFT_DOWN = 5, RIGHT_DOWN = 6, ANIM_GOAL_KEEPER_FAIL = [LEFT, RIGHT, CENTER_DOWN, CENTER_UP, LEFT_DOWN, RIGHT_DOWN], ANIM_GOAL_KEEPER_FAIL_ALT = [LEFT, RIGHT, LEFT_DOWN, RIGHT_DOWN], NUM_SPRITE_PLAYER = 31, SPRITE_NAME_GOALKEEPER = "gk_idle_ gk_save_right_ gk_save_left_ gk_save_center_down_ gk_save_center_up_ gk_save_down_left_ gk_save_down_right".split(" "), NUM_SPRITE_GOALKEEPER = [24, 34, 34, 51, 25, 34, 34], OFFSET_CONTAINER_GOALKEEPER = [{
  x: 0,
  y: 0
}, {
  x: 15,
  y: -29
}, {
  x: -360,
  y: -29
}, {
  x: -15,
  y: -15
}, {
  x: -20,
  y: -85
}, {
  x: -355,
  y: 20
}, {
  x: 21,
  y: 20
}], BALL_MASS = .5, BALL_RADIUS = .64, BALL_LINEAR_DAMPING = .2, OBJECT, TIME_TRY_TO_SHOT_BALL_OPPONENT = .7, START_POS_FLAG = {
  x: 277,
  y: 268
}, FLAG_ADDED_POS = {
  x: 61,
  y: 69
}, FLAG_LIMIT_POS_X = 690, TOT_TEAM = 32, MIN_BALL_VEL_ROTATION = .1, TIME_RESET_AFTER_GOAL = 1E3, SHOOT_FRAME = 7, HAND_KEEPER_ANGLE_RATE = .15, TIME_POLE_COLLISION_RESET = 1E3, LIMIT_HAND_RANGE_POS = {
  x: 16.8,
  zMax: 3.1,
  zMin: -8.5
}, BACK_WALL_GOAL_SIZE = {
  width: 20.5,
  depth: 1,
  height: 7.5
}, LEFT_RIGHT_WALL_GOAL_SIZE = {
  width: .1,
  depth: 25,
  height: 7.5
}, UP_WALL_GOAL_SIZE = {
  width: 20.5,
  depth: 25,
  height: .1
}, BACK_WALL_GOAL_POSITION = {
  x: 0,
  y: 155,
  z: -2.7
}, GOAL_LINE_POS = {
  x: 0,
  y: BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth + 2,
  z: BACK_WALL_GOAL_POSITION.z
}, POSITION_BALL = {
  x: .05,
  y: 15.4,
  z: -9 + BALL_RADIUS
}, NUM_AREA_GOAL = {
  h: 3,
  w: 5
}, AREA_GOALS_ANIM = [LEFT, LEFT, CENTER_UP, RIGHT, RIGHT, LEFT, LEFT, CENTER_UP, RIGHT, RIGHT, LEFT_DOWN, LEFT_DOWN, CENTER_DOWN, RIGHT_DOWN, RIGHT_DOWN], GOAL_SPRITE_SWAP_Y = GOAL_LINE_POS.y, GOAL_SPRITE_SWAP_Z = BACK_WALL_GOAL_POSITION.z + LEFT_RIGHT_WALL_GOAL_SIZE.height, BALL_OUT_Y = BACK_WALL_GOAL_POSITION.y + 3, BUFFER_ANIM_PLAYER = FPS, MS_EFFECT_ADD = 1500, MS_ROLLING_SCORE = 500, MAX_PERCENT_PROBABILITY = 100, GOAL_KEEPER_TOLLERANCE_LEFT = -4, GOAL_KEEPER_TOLLERANCE_RIGHT = 4, TIME_RESET_AFTER_BALL_OUT = 250, TIME_RESET_AFTER_SAVE = 500, AREA_GOAL_PROPERTIES = {
  width: 4,
  depth: 1,
  height: 2.4
}, FIRST_AREA_GOAL_POS = {
  x: -14 - .5 * AREA_GOAL_PROPERTIES.width,
  y: BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth + 1.1,
  z: 3.1 - .5 * AREA_GOAL_PROPERTIES.height
}, GOAL_KEEPER_DEPTH_Y = BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth, POLE_UP_SIZE = {
  radius_top: .5,
  radius_bottom: .5,
  height: 40.5,
  segments: 10
}, POLE_RIGHT_LEFT_SIZE = {
  radius_top: .5,
  radius_bottom: .5,
  height: 15,
  segments: 10
}, COLOR_AREA_GOAL = [16711680, 65280, 255, 16776960, 16711935, 65535, 15790320, 986895, 16759705, 16777215, 5675280, 10083618, 1056896, 8392736, 9017449], OFFSET_FIELD_Y = 35, OFFSET_FIELD_X = 35, HIT_BALL_MAX_FORCE = 130, HIT_BALL_MIN_FORCE = 5, FORCE_RATE = .0014, SHOW_AREAS_GOAL = !1, FORCE_MULTIPLIER_AXIS = {
  x: .12,
  y: .4,
  z: .08
}, FORCE_MAX = .5, FIELD_POSITION, MAX_FORCE_Y = 66, MIN_FORCE_Y = 50, CALCULATE_PROBABILITY = [{
  xMax: -7,
  xMin: -11,
  zMax: 11,
  zMin: 8
}, {
  xMax: -3.6,
  xMin: -7,
  zMax: 11,
  zMin: 8
}, {
  xMax: 3.6,
  xMin: -3.6,
  zMax: 11,
  zMin: 8
}, {
  xMax: 7,
  xMin: 3.6,
  zMax: 11,
  zMin: 8
}, {
  xMax: 11,
  xMin: 7,
  zMax: 11,
  zMin: 8
}, {
  xMax: -7,
  xMin: -7,
  zMax: 8,
  zMin: 5
}, {
  xMax: -3.6,
  xMin: -7,
  zMax: 8,
  zMin: 5
}, {
  xMax: 3.6,
  xMin: -3.6,
  zMax: 8,
  zMin: 5
}, {
  xMax: 7,
  xMin: 3.6,
  zMax: 8,
  zMin: 5
}, {
  xMax: 11,
  xMin: 7,
  zMax: 8,
  zMin: 5
}, {
  xMax: -7,
  xMin: -11,
  zMax: 5,
  zMin: 0
}, {
  xMax: -3.6,
  xMin: -7,
  zMax: 5,
  zMin: 0
}, {
  xMax: 3.6,
  xMin: -3.6,
  zMax: 5,
  zMin: 0
}, {
  xMax: 7,
  xMin: 3.6,
  zMax: 5,
  zMin: 0
}, {
  xMax: 11,
  xMin: 7,
  zMax: 5,
  zMin: 0
}], SHOW_3D_RENDER = !1, CAMERA_TEST_TRACKBALL = !1, CAMERA_TEST_TRANSFORM = !1, CANVAS_3D_OPACITY = .5, MOUSE_SENSIBILTY = .03, CAMERA_TEST_LOOK_AT = {
  x: 0,
  y: -500,
  z: -100
}, BALL_SCALE_FACTOR = .07, SHADOWN_FACTOR = 1.1, INTENSITY_DISPLAY_SHOCK = [{
  x: 10,
  y: 7.5,
  time: 50
}, {
  x: 20,
  y: 9,
  time: 50
}, {
  x: 30,
  y: 12,
  time: 50
}, {
  x: 33,
  y: 15,
  time: 50
}], FORCE_BALL_DISPLAY_SHOCK = [{
  max: 55,
  min: MIN_FORCE_Y - 1
}, {
  max: 58,
  min: 55
}, {
  max: 62,
  min: 58
}, {
  max: MAX_FORCE_Y,
  min: 62
}], CAMERA_POSITION = {
  x: 0,
  y: 0,
  z: -7
}, FOV = 15, NEAR = 1, FAR = 2E3, ENABLE_FULLSCREEN, ENABLE_CHECK_ORIENTATION, TIME_SWIPE, SOUNDTRACK_VOLUME_IN_GAME = .2;
TEXT_GAMEOVER = "GAME OVER";
TEXT_OF = "/";
TEXT_SCORE = "SCORE";
TEXT_BEST_SCORE = "BEST SCORE";
TEXT_MULTIPLIER = "x";
TEXT_ARE_SURE = "ARE YOU SURE?";
TEXT_BALL_OUT = "OUT";
TEXT_PAUSE = "PAUSE";
TEXT_CONGRATULATION = ["GOOD!", "GREAT!", "EXCELLENT!!!"];
TEXT_SAVED = "SAVED";
TEXT_HELP = "SWIPE TO KICK THE BALL";
TEXT_DEVELOPED = "DEVELOPED BY";
var TEXT_PRELOADER_CONTINUE = "START";
TEXT_SHARE_IMAGE = "200x200.jpg";
TEXT_SHARE_TITLE = "Congratulations!";
TEXT_SHARE_MSG1 = "You collected <strong>";
TEXT_SHARE_MSG2 = " points</strong>!<br><br>Share your score with your friends!";
TEXT_SHARE_SHARE1 = "My score is ";
TEXT_SHARE_SHARE2 = " points! Can you do better?";
function CPreloader () {
  var f, d, e, m, a, c, b, k, g, h;
  this._init = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("progress_bar", "./../penalty/sprites/progress_bar.png");
    s_oSpriteLibrary.addSprite("200x200", "./../penalty/sprites/200x200.jpg");
    s_oSpriteLibrary.addSprite("but_start", "./../penalty/sprites/but_start.png");
    s_oSpriteLibrary.loadSprites();
    h = new createjs.Container;
    s_oStage.addChild(h)
  }
    ;
  this.unload = function () {
    h.removeAllChildren();
    g.unload()
  }
    ;
  this._onImagesLoaded = function () { }
    ;
  this._onAllImagesLoaded = function () {
    this.attachSprites();
    s_oMain.preloaderReady()
  }
    ;
  this.attachSprites = function () {
    var l = new createjs.Shape;
    l.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    h.addChild(l);
    l = s_oSpriteLibrary.getSprite("200x200");
    b = createBitmap(l);
    b.regX = .5 * l.width;
    b.regY = .5 * l.height;
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT / 2 - 180;
    h.addChild(b);
    k = new createjs.Shape;
    k.graphics.beginFill("rgba(0,0,0,0.01)").drawRoundRect(b.x - 100, b.y - 100, 200, 200, 10);
    h.addChild(k);
    b.mask = k;
    l = s_oSpriteLibrary.getSprite("progress_bar");
    m = createBitmap(l);
    m.x = CANVAS_WIDTH / 2 - l.width / 2;
    m.y = CANVAS_HEIGHT / 2 + 50;
    h.addChild(m);
    f = l.width;
    d = l.height;
    a = new createjs.Shape;
    a.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(m.x, m.y, 1, d);
    h.addChild(a);
    m.mask = a;
    e = new createjs.Text("", "40px " + FONT_GAME, "#fff");
    e.x = CANVAS_WIDTH / 2;
    e.y = CANVAS_HEIGHT / 2 + 110;
    e.textBaseline = "alphabetic";
    e.textAlign = "center";
    h.addChild(e);
    l = s_oSpriteLibrary.getSprite("but_start");
    g = new CTextButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, l, TEXT_PRELOADER_CONTINUE, "Arial", "#000", "bold 50", h);
    g.addEventListener(ON_MOUSE_UP, this._onButStartRelease, this);
    g.setVisible(!1);
    c = new createjs.Shape;
    c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    h.addChild(c);
    createjs.Tween.get(c).to({
      alpha: 0
    }, 500).call(function () {
      createjs.Tween.removeTweens(c);
      h.removeChild(c)
    })
  }
    ;
  this._onButStartRelease = function () {
    s_oMain._onRemovePreloader()
  }
    ;
  this.refreshLoader = function (l) {
    e.text = l + "%";
    100 === l && (s_oMain._onRemovePreloader(),
      e.visible = !1,
      m.visible = !1);
    a.graphics.clear();
    l = Math.floor(l * f / 100);
    a.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(m.x, m.y, l, d)
  }
    ;
  this._init()
}
function CMain (f) {
  var d, e = 0, m = 0, a = STATE_LOADING, c, b;
  this.initContainer = function () {
    var g = document.getElementById("canvas");
    s_oStage = new createjs.Stage(g);
    createjs.Touch.enable(s_oStage, !0);
    s_oStage.preventSelection = !1;
    s_bMobile = jQuery.browser.mobile;
    !1 === s_bMobile ? (s_oStage.enableMouseOver(20),
      $("body").on("contextmenu", "#canvas", function (h) {
        return !1
      }),
      FPS = FPS_DESKTOP,
      FPS_TIME = 1 / FPS,
      PHYSICS_STEP = 1 / (FPS * STEP_RATE),
      ROLL_BALL_RATE = 60 / FPS) : BALL_VELOCITY_MULTIPLIER = .8;
    s_iPrevTime = (new Date).getTime();
    createjs.Ticker.addEventListener("tick", this._update);
    createjs.Ticker.framerate = FPS;
    navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
    s_oSpriteLibrary = new CSpriteLibrary;
    c = new CPreloader;
    d = !0
  }
    ;
  this.soundLoaded = function () {
    e++;
    c.refreshLoader(Math.floor(e / m * 100))
  }
    ;
  this._initSounds = function () {
    Howler.mute(!s_bAudioActive);
    s_aSoundsInfo = [];
    s_aSoundsInfo.push({
      path: "./../penalty/sounds/",
      filename: "drop_bounce_grass",
      loop: !1,
      volume: 1,
      ingamename: "drop_bounce_grass"
    });
    s_aSoundsInfo.push({
      path: "./../penalty/sounds/",
      filename: "click",
      loop: !1,
      volume: 1,
      ingamename: "click"
    });
    s_aSoundsInfo.push({
      path: "./../penalty/sounds/",
      filename: "goal",
      loop: !1,
      volume: 1,
      ingamename: "goal"
    });
    s_aSoundsInfo.push({
      path: "./../penalty/sounds/",
      filename: "ball_saved",
      loop: !1,
      volume: 1,
      ingamename: "ball_saved"
    });
    s_aSoundsInfo.push({
      path: "./../penalty/sounds/",
      filename: "kick",
      loop: !1,
      volume: 1,
      ingamename: "kick"
    });
    s_aSoundsInfo.push({
      path: "./../penalty/sounds/",
      filename: "pole",
      loop: !1,
      volume: 1,
      ingamename: "pole"
    });
    s_aSoundsInfo.push({
      path: "./../penalty/sounds/",
      filename: "soundtrack",
      loop: !0,
      volume: 1,
      ingamename: "soundtrack"
    });
    m += s_aSoundsInfo.length;
    s_aSounds = [];
    for (var g = 0; g < s_aSoundsInfo.length; g++)
      this.tryToLoadSound(s_aSoundsInfo[g], !1)
  }
    ;
  this.tryToLoadSound = function (g, h) {
    setTimeout(function () {
      s_aSounds[g.ingamename] = new Howl({
        src: [g.path + g.filename + ".mp3"],
        autoplay: !1,
        preload: !0,
        loop: g.loop,
        volume: g.volume,
        onload: s_oMain.soundLoaded,
        onloaderror: function (l, n) {
          for (var p = 0; p < s_aSoundsInfo.length; p++)
            if (l === s_aSounds[s_aSoundsInfo[p].ingamename]._sounds[0]._id) {
              s_oMain.tryToLoadSound(s_aSoundsInfo[p], !0);
              break
            }
        },
        onplayerror: function (l) {
          for (var n = 0; n < s_aSoundsInfo.length; n++)
            if (l === s_aSounds[s_aSoundsInfo[n].ingamename]._sounds[0]._id) {
              s_aSounds[s_aSoundsInfo[n].ingamename].once("unlock", function () {
                s_aSounds[s_aSoundsInfo[n].ingamename].play();
                "soundtrack" === s_aSoundsInfo[n].ingamename && null !== s_oGame && setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME)
              });
              break
            }
        }
      })
    }, h ? 200 : 0)
  }
    ;
  this._loadImages = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("but_play", "./../penalty/sprites/but_play.png");
    s_oSpriteLibrary.addSprite("but_exit", "./../penalty/sprites/but_exit.png");
    s_oSpriteLibrary.addSprite("bg_menu", "./../penalty/sprites/bg_menu.jpg");
    s_oSpriteLibrary.addSprite("bg_game", "./../penalty/sprites/bg_game.jpg");
    s_oSpriteLibrary.addSprite("msg_box", "./../penalty/sprites/msg_box.png");
    s_oSpriteLibrary.addSprite("audio_icon", "./../penalty/sprites/audio_icon.png");
    s_oSpriteLibrary.addSprite("but_home", "./../penalty/sprites/but_home.png");
    s_oSpriteLibrary.addSprite("but_restart", "./../penalty/sprites/but_restart.png");
    s_oSpriteLibrary.addSprite("but_fullscreen", "./../penalty/sprites/but_fullscreen.png");
    s_oSpriteLibrary.addSprite("ball", "./../penalty/sprites/ball.png");
    s_oSpriteLibrary.addSprite("but_level", "./../penalty/sprites/but_level.png");
    s_oSpriteLibrary.addSprite("bg_game", "./../penalty/sprites/bg_game.jpg");
    s_oSpriteLibrary.addSprite("but_continue", "./../penalty/sprites/but_continue.png");
    s_oSpriteLibrary.addSprite("but_yes", "./../penalty/sprites/but_yes.png");
    s_oSpriteLibrary.addSprite("but_no", "./../penalty/sprites/but_no.png");
    s_oSpriteLibrary.addSprite("but_info", "./../penalty/sprites/but_info.png");
    s_oSpriteLibrary.addSprite("logo_ctl", "./../penalty/sprites/logo_ctl.png");
    s_oSpriteLibrary.addSprite("but_pause", "./../penalty/sprites/but_pause.png");
    s_oSpriteLibrary.addSprite("arrow_right", "./../penalty/sprites/arrow_right.png");
    s_oSpriteLibrary.addSprite("arrow_left", "./../penalty/sprites/arrow_left.png");
    s_oSpriteLibrary.addSprite("ball_shadow", "./../penalty/sprites/ball_shadow.png");
    s_oSpriteLibrary.addSprite("start_ball", "./../penalty/sprites/start_ball.png");
    s_oSpriteLibrary.addSprite("hand_touch", "./../penalty/sprites/hand_touch.png");
    s_oSpriteLibrary.addSprite("cursor", "./../penalty/sprites/cursor.png");
    s_oSpriteLibrary.addSprite("shot_left", "./../penalty/sprites/shot_left.png");
    s_oSpriteLibrary.addSprite("goal", "./../penalty/sprites/goal.png");
    for (var g = 0; g < NUM_SPRITE_PLAYER; g++)
      s_oSpriteLibrary.addSprite("player_" + g, "./../penalty/sprites/player/player_" + g + ".png");
    for (g = 0; g < NUM_SPRITE_GOALKEEPER[IDLE]; g++)
      s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[IDLE] + g, "./../penalty/sprites/goalkeeper_idle/gk_idle_" + g + ".png");
    for (g = 0; g < NUM_SPRITE_GOALKEEPER[RIGHT]; g++)
      s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[RIGHT] + g, "./../penalty/sprites/goalkeeper_save_right/gk_save_right_" + g + ".png");
    for (g = 0; g < NUM_SPRITE_GOALKEEPER[LEFT]; g++)
      s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[LEFT] + g, "./../penalty/sprites/goalkeeper_save_left/gk_save_left_" + g + ".png");
    for (g = 0; g < NUM_SPRITE_GOALKEEPER[CENTER_DOWN]; g++)
      s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[CENTER_DOWN] + g, "./../penalty/sprites/goalkeeper_save_center_down/gk_save_center_down_" + g + ".png");
    for (g = 0; g < NUM_SPRITE_GOALKEEPER[CENTER_UP]; g++)
      s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[CENTER_UP] + g, "./../penalty/sprites/goalkeeper_save_center_up/gk_save_center_up_" + g + ".png");
    for (g = 0; g < NUM_SPRITE_GOALKEEPER[LEFT_DOWN]; g++)
      s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[LEFT_DOWN] + g, "./../penalty/sprites/goalkeeper_save_down_left/gk_save_down_left_" + g + ".png");
    for (g = 0; g < NUM_SPRITE_GOALKEEPER[RIGHT_DOWN]; g++)
      s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[RIGHT_DOWN] + g, "./../penalty/sprites/goalkeeper_save_down_right/gk_save_down_right_" + g + ".png");
    m += s_oSpriteLibrary.getNumSprites();
    s_oSpriteLibrary.loadSprites()
  }
    ;
  this._onImagesLoaded = function () {
    e++;
    c.refreshLoader(Math.floor(e / m * 100))
  }
    ;
  this._onAllImagesLoaded = function () { }
    ;
  this.preloaderReady = function () {
    this._loadImages();
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
    d = !0
  }
    ;
  this._onRemovePreloader = function () {
    c.unload();
    try {
      saveItem("ls_available", "ok"),
        s_iLastLevel = this.getSavedLevel()
    } catch (g) {
      s_bStorageAvailable = !1
    }
    s_oSoundTrack = playSound("soundtrack", 1, !0);
    this.gotoMenu()
  }
    ;
  this.gotoMenu = function () {
    new CMenu;
    a = STATE_MENU
  }
    ;
  this.gotoGame = function () {
    b = new CGame(k);
    a = STATE_GAME
  }
    ;
  this.gotoHelp = function () {
    new CHelp;
    a = STATE_HELP
  }
    ;
  this.stopUpdate = function () {
    d = !1;
    createjs.Ticker.paused = !0;
    $("#block_game").css("display", "block");
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || Howler.mute(!0)
  }
    ;
  this.startUpdate = function () {
    s_iPrevTime = (new Date).getTime();
    d = !0;
    createjs.Ticker.paused = !1;
    $("#block_game").css("display", "none");
    (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) && s_bAudioActive && Howler.mute(!1)
  }
    ;
  this._update = function (g) {
    if (!1 !== d) {
      var h = (new Date).getTime();
      s_iTimeElaps = h - s_iPrevTime;
      s_iCntTime += s_iTimeElaps;
      s_iCntFps++;
      s_iPrevTime = h;
      1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps,
        s_iCntTime -= 1E3,
        s_iCntFps = 0);
      a === STATE_GAME && b.update();
      s_oStage.update(g)
    }
  }
    ;
  s_oMain = this;
  var k = f;
  ENABLE_CHECK_ORIENTATION = f.check_orientation;
  ENABLE_FULLSCREEN = f.fullscreen;
  s_bAudioActive = f.audio_enable_on_startup;
  this.initContainer()
}
var s_bMobile, s_bAudioActive = !1, s_bFullscreen = !1, s_iCntTime = 0, s_iTimeElaps = 0, s_iPrevTime = 0, s_iCntFps = 0, s_iCurFps = 0, s_oPhysicsController, s_iCanvasResizeHeight, s_iCanvasResizeWidth, s_iCanvasOffsetHeight, s_iCanvasOffsetWidth, s_iAdsLevel = 1, s_iBestScore = 0, s_oDrawLayer, s_oStage, s_oMain, s_oSpriteLibrary, s_oSoundTrack = null, s_bStorageAvailable = !0, s_aSounds;
function CTextButton (f, d, e, m, a, c, b, k) {
  var g, h, l, n, p, q, t, r, v, x, E, z;
  this._init = function (F, U, Q, K, Y, C, H, T) {
    g = !1;
    n = [];
    p = [];
    z = createBitmap(Q);
    h = Q.width;
    l = Q.height;
    var M = Math.ceil(H / 20);
    x = new createjs.Text(K, H + "px " + Y, "#000000");
    var ca = x.getBounds();
    x.textAlign = "center";
    x.lineWidth = .9 * h;
    x.textBaseline = "alphabetic";
    x.x = Q.width / 2 + M;
    x.y = Math.floor(Q.height / 2) + ca.height / 3 + M;
    E = new createjs.Text(K, H + "px " + Y, C);
    E.textAlign = "center";
    E.textBaseline = "alphabetic";
    E.lineWidth = .9 * h;
    E.x = Q.width / 2;
    E.y = Math.floor(Q.height / 2) + ca.height / 3;
    v = new createjs.Container;
    v.x = F;
    v.y = U;
    v.regX = Q.width / 2;
    v.regY = Q.height / 2;
    s_bMobile || (v.cursor = "pointer");
    v.addChild(z, x, E);
    !1 !== T && s_oStage.addChild(v);
    this._initListener()
  }
    ;
  this.unload = function () {
    v.off("mousedown", q);
    v.off("pressup", t);
    s_oStage.removeChild(v)
  }
    ;
  this.setVisible = function (F) {
    v.visible = F
  }
    ;
  this.setAlign = function (F) {
    E.textAlign = F;
    x.textAlign = F
  }
    ;
  this.enable = function () {
    g = !1;
    z.filters = [];
    z.cache(0, 0, h, l)
  }
    ;
  this.disable = function () {
    g = !0;
    var F = (new createjs.ColorMatrix).adjustSaturation(-100).adjustBrightness(40);
    z.filters = [new createjs.ColorMatrixFilter(F)];
    z.cache(0, 0, h, l)
  }
    ;
  this._initListener = function () {
    q = v.on("mousedown", this.buttonDown);
    t = v.on("pressup", this.buttonRelease)
  }
    ;
  this.addEventListener = function (F, U, Q) {
    n[F] = U;
    p[F] = Q
  }
    ;
  this.addEventListenerWithParams = function (F, U, Q, K) {
    n[F] = U;
    p[F] = Q;
    r = K
  }
    ;
  this.buttonRelease = function () {
    g || (playSound("click", 1, !1),
      v.scaleX = 1,
      v.scaleY = 1,
      n[ON_MOUSE_UP] && n[ON_MOUSE_UP].call(p[ON_MOUSE_UP], r))
  }
    ;
  this.buttonDown = function () {
    g || (v.scaleX = .9,
      v.scaleY = .9,
      n[ON_MOUSE_DOWN] && n[ON_MOUSE_DOWN].call(p[ON_MOUSE_DOWN]))
  }
    ;
  this.setPosition = function (F, U) {
    v.x = F;
    v.y = U
  }
    ;
  this.changeText = function (F) {
    E.text = F;
    x.text = F
  }
    ;
  this.setX = function (F) {
    v.x = F
  }
    ;
  this.setY = function (F) {
    v.y = F
  }
    ;
  this.getButtonImage = function () {
    return v
  }
    ;
  this.getX = function () {
    return v.x
  }
    ;
  this.getY = function () {
    return v.y
  }
    ;
  this.getSprite = function () {
    return v
  }
    ;
  this._init(f, d, e, m, a, c, b, k);
  return this
}
function CToggle (f, d, e, m, a) {
  var c, b, k, g, h, l, n;
  this._init = function (p, q, t, r, v) {
    n = void 0 !== v ? v : s_oStage;
    b = [];
    k = [];
    v = new createjs.SpriteSheet({
      images: [t],
      frames: {
        width: t.width / 2,
        height: t.height,
        regX: t.width / 2 / 2,
        regY: t.height / 2
      },
      animations: {
        state_true: [0],
        state_false: [1]
      }
    });
    c = r;
    l = createSprite(v, "state_" + c, t.width / 2 / 2, t.height / 2, t.width / 2, t.height);
    l.x = p;
    l.y = q;
    l.stop();
    s_bMobile || (l.cursor = "pointer");
    n.addChild(l);
    this._initListener()
  }
    ;
  this.unload = function () {
    l.off("mousedown", g);
    l.off("pressup", h);
    n.removeChild(l)
  }
    ;
  this._initListener = function () {
    g = l.on("mousedown", this.buttonDown);
    h = l.on("pressup", this.buttonRelease)
  }
    ;
  this.addEventListener = function (p, q, t) {
    b[p] = q;
    k[p] = t
  }
    ;
  this.setCursorType = function (p) {
    l.cursor = p
  }
    ;
  this.setActive = function (p) {
    c = p;
    l.gotoAndStop("state_" + c)
  }
    ;
  this.buttonRelease = function () {
    l.scaleX = 1;
    l.scaleY = 1;
    playSound("click", 1, !1);
    c = !c;
    l.gotoAndStop("state_" + c);
    b[ON_MOUSE_UP] && b[ON_MOUSE_UP].call(k[ON_MOUSE_UP], c)
  }
    ;
  this.buttonDown = function () {
    l.scaleX = .9;
    l.scaleY = .9;
    b[ON_MOUSE_DOWN] && b[ON_MOUSE_DOWN].call(k[ON_MOUSE_DOWN])
  }
    ;
  this.setPosition = function (p, q) {
    l.x = p;
    l.y = q
  }
    ;
  this._init(f, d, e, m, a)
}
function CGfxButton (f, d, e, m) {
  var a, c, b, k, g, h, l, n, p = !1;
  this._init = function (r, v, x) {
    a = [];
    c = [];
    k = [];
    b = createBitmap(x);
    b.x = r;
    b.y = v;
    h = g = 1;
    b.regX = x.width / 2;
    b.regY = x.height / 2;
    s_bMobile || (b.cursor = "pointer");
    q.addChild(b);
    this._initListener()
  }
    ;
  this.unload = function () {
    b.off("mousedown", l);
    b.off("pressup", n);
    q.removeChild(b)
  }
    ;
  this.setVisible = function (r) {
    b.visible = r
  }
    ;
  this.setCursorType = function (r) {
    b.cursor = r
  }
    ;
  this._initListener = function () {
    l = b.on("mousedown", this.buttonDown);
    n = b.on("pressup", this.buttonRelease)
  }
    ;
  this.addEventListener = function (r, v, x) {
    a[r] = v;
    c[r] = x
  }
    ;
  this.addEventListenerWithParams = function (r, v, x, E) {
    a[r] = v;
    c[r] = x;
    k[r] = E
  }
    ;
  this.buttonRelease = function () {
    p || (b.scaleX = 0 < g ? 1 : -1,
      b.scaleY = 1,
      playSound("click", 1, !1),
      a[ON_MOUSE_UP] && a[ON_MOUSE_UP].call(c[ON_MOUSE_UP], k[ON_MOUSE_UP]))
  }
    ;
  this.buttonDown = function () {
    p || (b.scaleX = 0 < g ? .9 : -.9,
      b.scaleY = .9,
      a[ON_MOUSE_DOWN] && a[ON_MOUSE_DOWN].call(c[ON_MOUSE_DOWN], k[ON_MOUSE_DOWN]))
  }
    ;
  this.rotation = function (r) {
    b.rotation = r
  }
    ;
  this.getButton = function () {
    return b
  }
    ;
  this.setPosition = function (r, v) {
    b.x = r;
    b.y = v
  }
    ;
  this.setX = function (r) {
    b.x = r
  }
    ;
  this.setY = function (r) {
    b.y = r
  }
    ;
  this.getButtonImage = function () {
    return b
  }
    ;
  this.block = function (r) {
    p = r;
    b.scaleX = g;
    b.scaleY = h
  }
    ;
  this.setScaleX = function (r) {
    g = b.scaleX = r
  }
    ;
  this.getX = function () {
    return b.x
  }
    ;
  this.getY = function () {
    return b.y
  }
    ;
  this.pulseAnimation = function () {
    createjs.Tween.get(b).to({
      scaleX: .9 * g,
      scaleY: .9 * h
    }, 850, createjs.Ease.quadOut).to({
      scaleX: g,
      scaleY: h
    }, 650, createjs.Ease.quadIn).call(function () {
      t.pulseAnimation()
    })
  }
    ;
  this.trebleAnimation = function () {
    createjs.Tween.get(b).to({
      rotation: 5
    }, 75, createjs.Ease.quadOut).to({
      rotation: -5
    }, 140, createjs.Ease.quadIn).to({
      rotation: 0
    }, 75, createjs.Ease.quadIn).wait(750).call(function () {
      t.trebleAnimation()
    })
  }
    ;
  this.removeAllTweens = function () {
    createjs.Tween.removeTweens(b)
  }
    ;
  var q = void 0 !== m ? m : s_oStage;
  this._init(f, d, e);
  var t = this;
  return this
}
function CMenu () {
  var f, d, e, m, a, c, b, k, g, h, l, n, p, q, t = null, r = null;
  this._init = function () {
    g = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    s_oStage.addChild(g);
    var v = s_oSpriteLibrary.getSprite("but_play");
    a = CANVAS_WIDTH / 2 + 110;
    c = CANVAS_HEIGHT - 130;
    h = new CGfxButton(a, c, v);
    h.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
    h.pulseAnimation();
    s_iBestScore = getItem(LOCALSTORAGE_STRING[LOCAL_BEST_SCORE]);
    null === s_iBestScore && (s_iBestScore = 0);
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      v = s_oSpriteLibrary.getSprite("audio_icon"),
        b = CANVAS_WIDTH - v.height / 2 - 10,
        k = v.height / 2 + 10,
        p = new CToggle(b, k, v, s_bAudioActive),
        p.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    v = window.document;
    var x = v.documentElement;
    t = x.requestFullscreen || x.mozRequestFullScreen || x.webkitRequestFullScreen || x.msRequestFullscreen;
    r = v.exitFullscreen || v.mozCancelFullScreen || v.webkitExitFullscreen || v.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (t = !1);
    v = s_oSpriteLibrary.getSprite("but_info");
    e = v.height / 2 + 10;
    m = v.height / 2 + 10;
    l = new CGfxButton(e, m, v, s_oStage);
    l.addEventListener(ON_MOUSE_UP, this._onButInfoRelease, this);
    t && screenfull.isEnabled && (v = s_oSpriteLibrary.getSprite("but_fullscreen"),
      f = e + v.width / 2 + 10,
      d = v.height / 2 + 10,
      q = new CToggle(f, d, v, s_bFullscreen, s_oStage),
      q.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
    n = new createjs.Shape;
    n.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    s_oStage.addChild(n);
    createjs.Tween.get(n).to({
      alpha: 0
    }, 1E3).call(function () {
      n.visible = !1
    });
    this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  }
    ;
  this.refreshButtonPos = function (v, x) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || p.setPosition(b - v, x + k);
    t && screenfull.isEnabled && q.setPosition(f + v, d + x);
    l.setPosition(e + v, m + x)
  }
    ;
  this.unload = function () {
    h.unload();
    h = null;
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      p.unload(),
        p = null;
    t && screenfull.isEnabled && q.unload();
    s_oStage.removeAllChildren();
    s_oMenu = null
  }
    ;
  this._onButPlayRelease = function () {
    this.unload();
    s_oMain.gotoGame()
  }
    ;
  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive
  }
    ;
  this._onButInfoRelease = function () {
    new CCreditsPanel
  }
    ;
  this.resetFullscreenBut = function () {
    t && screenfull.isEnabled && q.setActive(s_bFullscreen)
  }
    ;
  this._onFullscreenRelease = function () {
    s_bFullscreen ? r.call(window.document) : t.call(window.document.documentElement);
    sizeHandler()
  }
    ;
  s_oMenu = this;
  this._init()
}
var s_oMenu = null;
function CGame (f) {
  var d, e, m, a, c, b = null, k, g, h, l, n, p = null, q, t, r = !1, v = !1, x = !1, E = !1, z = !1, F = !1, U = !1, Q = !1, K = !1, Y, C, H = 0, T = 0, M = 0, ca, P, X, L, A, B, y = STATE_INIT, u = null;
  this._init = function () {
    $(s_oMain).trigger("start_session");
    this.pause(!0);
    $(s_oMain).trigger("start_level", 1);
    Y = 0;
    L = 1;
    A = [];
    k = new createjs.Container;
    s_oStage.addChild(k);
    e = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
    e.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    k.addChild(e);
    m = new CScenario(1);
    u = SHOW_3D_RENDER ? camera : createOrthoGraphicCamera();
    var w = s_oSpriteLibrary.getSprite("goal");
    t = new CGoal(291, 28, w, k);
    b = new CGoalKeeper(CANVAS_WIDTH_HALF - 100, CANVAS_HEIGHT_HALF - 225, k);
    A.push(b);
    w = s_oSpriteLibrary.getSprite("ball");
    a = new CBall(0, 0, w, m.ballBody(), k);
    A.push(a);
    this.ballPosition();
    a.setVisible(!1);
    X = MS_TIME_SWIPE_START;
    c = new CStartBall(CANVAS_WIDTH_HALF + 55, CANVAS_HEIGHT_HALF + 168, k);
    n = new CPlayer(CANVAS_WIDTH_HALF - 150, CANVAS_HEIGHT_HALF - 320, k);
    n.setVisible(!1);
    w = "cursor";
    s_bMobile ? (w = "hand_touch",
      TIME_SWIPE = 650) : TIME_SWIPE = 500;
    q = new CHandSwipeAnim(START_HAND_SWIPE_POS, END_HAND_SWIPE_POS, s_oSpriteLibrary.getSprite(w), s_oStage);
    q.animAllSwipe();
    resizeCanvas3D();
    setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
    d = new CInterface;
    d.refreshTextScoreBoard(0, 0, 0, !1);
    d.refreshLaunchBoard(H, NUM_OF_PENALTY);
    B = new CANNON.Vec3(0, 0, 0);
    this.onExitHelp()
  }
    ;
  this.createControl = function () {
    SHOW_3D_RENDER ? (window.addEventListener("mousedown", this.onMouseDown),
      window.addEventListener("mousemove", this.onPressMove),
      window.addEventListener("mouseup", this.onPressUp)) : (l = new createjs.Shape,
        l.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT),
        k.addChild(l),
        l.on("mousedown", this.onMouseDown),
        l.on("pressmove", this.onPressMove),
        l.on("pressup", this.onPressUp))
  }
    ;
  this.sortDepth = function (w, D) {
    w.getDepthPos() > D.getDepthPos() ? k.getChildIndex(w.getObject()) > k.getChildIndex(D.getObject()) && k.swapChildren(w.getObject(), D.getObject()) : w.getDepthPos() < D.getDepthPos() && k.getChildIndex(D.getObject()) > k.getChildIndex(w.getObject()) && k.swapChildren(D.getObject(), w.getObject())
  }
    ;
  this.onExitHelp = function () {
    this.createControl();
    this.pause(!1)
  }
    ;
  this.poleCollide = function () {
    P = TIME_POLE_COLLISION_RESET;
    K = !0;
    playSound("pole", .4, !1)
  }
    ;
  this.fieldCollision = function () {
    if (null === p && v && (p = playSound("drop_bounce_grass", .3, !1),
      null !== p))
      p.on("end", function () {
        p = null
      })
  }
    ;
  this.ballPosition = function () {
    var w = m.ballBody()
      , D = this.convert3dPosTo2dScreen(w.position, u)
      , O = D.z * (BALL_SCALE_FACTOR - a.getStartScale()) + a.getStartScale();
    a.setPosition(D.x, D.y);
    a.scale(O);
    this.refreshShadowCast(a, w, O)
  }
    ;
  this.onMouseDown = function (w) {
    w.nativeEvent.preventDefault();
    v || (X = MS_TIME_SWIPE_START,
      q.removeTweens(),
      q.setVisible(!1),
      g = {
        x: s_oStage.mouseX,
        y: s_oStage.mouseY
      },
      h = null)
  }
    ;
  this.onPressMove = function () {
    h = {
      x: s_oStage.mouseX,
      y: s_oStage.mouseY
    };
    M += s_iTimeElaps
  }
    ;
  this.onPressUp = function () {
    if (!(v || null === h || g.y < h.y || 0 === h.x && 0 === h.y)) {
      var w = Math.ceil(distanceV2(g, h)) * FORCE_RATE;
      w > FORCE_MAX && (w = FORCE_MAX);
      if (M > TIME_SWIPE)
        M = 0;
      else {
        var D = new CVector2(g.x - h.x, g.y - h.y);
        D.scalarProduct(w);
        w = D.length();
        w > HIT_BALL_MIN_FORCE && (w > HIT_BALL_MAX_FORCE && (D.normalize(),
          D.scalarProduct(HIT_BALL_MAX_FORCE)),
          z = !0,
          n.setVisible(!0),
          w = M / 10,
          w > MAX_FORCE_Y ? w = MAX_FORCE_Y : w < MIN_FORCE_Y && (w = MIN_FORCE_Y),
          B.set(-D.getX() * FORCE_MULTIPLIER_AXIS.x, w, D.getY() * FORCE_MULTIPLIER_AXIS.z),
          Q = s_oGame.goalProbability());
        h.x = 0;
        h.y = 0
      }
    }
  }
    ;
  this.refreshShadowCast = function (w, D, O) {
    var J = m.getFieldBody();
    if (D.position.z < J.position.z)
      w.scaleShadow(0);
    else {
      var G = this.convert3dPosTo2dScreen({
        x: D.position.x,
        y: D.position.y,
        z: J.position.z
      }, u);
      D = (D.position.z - BALL_RADIUS) * (J.position.z - SHADOWN_FACTOR - J.position.z) + J.position.z;
      O *= D;
      w.scaleShadow(O);
      0 > O || (w.setAlphaByHeight(D),
        w.setPositionShadow(G.x, G.y))
    }
  }
    ;
  this.addScore = function (w, D) {
    Y += w;
    d.refreshTextScoreBoard(Y, L.toFixed(1), D, !0)
  }
    ;
  this.getLevel = function () {
    return 1
  }
    ;
  this.unload = function () {
    s_oStage.removeAllChildren();
    d.unload();
    l.removeAllEventListeners();
    m.destroyWorld();
    m = null
  }
    ;
  this.resetValues = function () {
    Y = 0;
    d.refreshTextScoreBoard(0, 0, 0, !1);
    H = 0;
    L = 1;
    d.refreshLaunchBoard(H, NUM_OF_PENALTY)
  }
    ;
  this.wallSoundCollision = function () {
    playSound("ball_collision", 1, !1)
  }
    ;
  this.areaGoal = function () {
    r || U || (Q ? (r = !0,
      ca = TIME_RESET_AFTER_GOAL,
      this.textGoal(),
      this.calculateScore(),
      playSound("goal", 1, !1)) : this.goalKeeperSave())
  }
    ;
  this.goalKeeperSave = function () {
    U = !0;
    ca = TIME_RESET_AFTER_SAVE;
    d.createAnimText(TEXT_SAVED, 80, !1, TEXT_COLOR_1, TEXT_COLOR_STROKE);
    playSound("ball_saved", 1, !1);
    this.rejectBall();
    L = 1;
    T = 0
  }
    ;
  this.rejectBall = function () {
    a.getPhysics().velocity.negate(a.getPhysics().velocity);
    switch (C) {
      case 12:
        a.getPhysics().velocity = a.getPhysics().velocity.vadd(new CANNON.Vec3(.4 * a.getPhysics().velocity.x, .4 * a.getPhysics().velocity.y, .4 * a.getPhysics().velocity.z));
        break;
      default:
        a.getPhysics().velocity.vsub(new CANNON.Vec3(0, 50, 0))
    }
  }
    ;
  this.calculateScore = function () {
    var w = MAX_PERCENT_PROBABILITY - (MAX_PERCENT_PROBABILITY - AREAS_INFO[C].probability);
    this.addScore(w * L, w);
    L += MULTIPLIER_STEP
  }
    ;
  this.goalProbability = function () {
    C = -1;
    for (var w = 0; w < CALCULATE_PROBABILITY.length; w++)
      B.z < CALCULATE_PROBABILITY[w].zMax && B.z > CALCULATE_PROBABILITY[w].zMin && B.x < CALCULATE_PROBABILITY[w].xMax && B.x > CALCULATE_PROBABILITY[w].xMin && (C = w);
    if (-1 === C)
      return !1;
    var D = [];
    for (w = 0; w < MAX_PERCENT_PROBABILITY; w++)
      D.push(!1);
    for (w = 0; w < AREAS_INFO[C].probability; w++)
      D[w] = !0;
    return D[Math.floor(Math.random() * D.length)]
  }
    ;
  this.addImpulseToBall = function (w) {
    if (!v && y === STATE_PLAY) {
      var D = m.ballBody();
      m.addImpulse(D, w);
      m.setElementAngularVelocity(D, {
        x: 0,
        y: 0,
        z: 0
      });
      v = !0;
      a.setVisible(!0);
      c.setVisible(!1);
      this.chooseDirectionGoalKeeper(w);
      playSound("kick", 1, !1)
    }
  }
    ;
  this.chooseDirectionGoalKeeper = function (w) {
    if (Q)
      switch (w = b.getAnimType(),
      C) {
        case 2:
        case 7:
        case 12:
          this.chooseWrongDirGK(ANIM_GOAL_KEEPER_FAIL_ALT);
          break;
        default:
          this.chooseWrongDirGK(ANIM_GOAL_KEEPER_FAIL, w)
      }
    else
      switch (C) {
        case -1:
          w.x < GOAL_KEEPER_TOLLERANCE_LEFT ? b.runAnim(LEFT) : w.y > GOAL_KEEPER_TOLLERANCE_RIGHT && b.runAnim(RIGHT);
          break;
        default:
          b.runAnim(AREA_GOALS_ANIM[C])
      }
    F = !0
  }
    ;
  this.chooseWrongDirGK = function (w) {
    for (var D = Math.floor(Math.random() * w.length); D === AREA_GOALS_ANIM[C];)
      D = Math.floor(Math.random() * w.length);
    b.runAnim(w[D])
  }
    ;
  this.pause = function (w) {
    y = w ? STATE_PAUSE : STATE_PLAY;
    createjs.Ticker.paused = w
  }
    ;
  this.onExit = function () {
    this.unload();
    $(s_oMain).trigger("show_interlevel_ad");
    $(s_oMain).trigger("end_session");
    setVolume("soundtrack", 1);
    s_oMain.gotoMenu()
  }
    ;
  this.restartLevel = function () {
    this.resetValues();
    this.resetScene();
    y = STATE_PLAY;
    this.startOpponentShot();
    $(s_oMain).trigger("restart_level", 1)
  }
    ;
  this.resetBallPosition = function () {
    var w = m.ballBody();
    w.position.set(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);
    m.setElementVelocity(w, {
      x: 0,
      y: 0,
      z: 0
    });
    m.setElementAngularVelocity(w, {
      x: 0,
      y: 0,
      z: 0
    });
    a.fadeAnimation(1, 500, 0);
    a.setVisible(!1);
    c.setVisible(!0);
    c.setAlpha(0);
    c.fadeAnim(1, 500, 0)
  }
    ;
  this.ballFadeForReset = function () {
    U && r && x && !E && (a.fadeAnimation(0, 300, 10),
      E = !0)
  }
    ;
  this._updateInit = function () {
    m.update();
    this._updateBall2DPosition();
    y = STATE_PLAY
  }
    ;
  this.convert2dScreenPosTo3d = function (w) {
    w = new THREE.Vector3(w.x / s_iCanvasResizeWidth * 2 - 1, 2 * -(w.y / s_iCanvasResizeHeight) + 1, -1);
    w.unproject(u);
    w.sub(u.position);
    w.normalize();
    w.multiply(new THREE.Vector3(0, 1, 0));
    return w
  }
    ;
  this.convert3dPosTo2dScreen = function (w, D) {
    var O = (new THREE.Vector3(w.x, w.y, w.z)).project(D)
      , J = .5 * Math.floor(s_iCanvasResizeWidth)
      , G = .5 * Math.floor(s_iCanvasResizeHeight);
    O.x = (O.x * J + J) * s_fInverseScaling;
    O.y = (-(O.y * G) + G) * s_fInverseScaling;
    return O
  }
    ;
  this.timeReset = function () {
    0 < ca ? ca -= s_iTimeElaps : this.endTurn()
  }
    ;
  this.restartGame = function () {
    this.resetValues();
    this.resetScene();
    y = STATE_PLAY;
    v = !1
  }
    ;
  this.endTurn = function () {
    H++;
    d.refreshLaunchBoard(H, NUM_OF_PENALTY);
    H < NUM_OF_PENALTY ? (this.resetScene(),
      v = !1,
      X = MS_TIME_SWIPE_START) : (y = STATE_FINISH,
        Y > s_iBestScore && (s_iBestScore = Math.floor(Y),
          saveItem(LOCALSTORAGE_STRING[LOCAL_BEST_SCORE], Math.floor(Y))),
        d.createWinPanel(Math.floor(Y)),
        $(s_oMain).trigger("end_level", 1))
  }
    ;
  this.textGoal = function () {
    if (T < TEXT_CONGRATULATION.length) {
      var w = !1;
      T >= TEXT_CONGRATULATION.length - 1 && (w = !0);
      d.createAnimText(TEXT_CONGRATULATION[T], TEXT_SIZE[T], w, TEXT_COLOR, TEXT_COLOR_STROKE);
      T++
    } else {
      w = !1;
      var D = Math.floor(Math.random() * (TEXT_CONGRATULATION.length - 1)) + 1;
      D >= TEXT_CONGRATULATION.length - 1 && (w = !0);
      d.createAnimText(TEXT_CONGRATULATION[D], TEXT_SIZE[D], w, TEXT_COLOR, TEXT_COLOR_STROKE)
    }
  }
    ;
  this.goalAnimation = function (w) {
    w > FORCE_BALL_DISPLAY_SHOCK[0].min && w < FORCE_BALL_DISPLAY_SHOCK[0].max ? this.displayShock(INTENSITY_DISPLAY_SHOCK[0].time, INTENSITY_DISPLAY_SHOCK[0].x, INTENSITY_DISPLAY_SHOCK[0].y) : w > FORCE_BALL_DISPLAY_SHOCK[1].min && w < FORCE_BALL_DISPLAY_SHOCK[1].max ? this.displayShock(INTENSITY_DISPLAY_SHOCK[1].time, INTENSITY_DISPLAY_SHOCK[1].x, INTENSITY_DISPLAY_SHOCK[1].y) : w > FORCE_BALL_DISPLAY_SHOCK[2].min && w < FORCE_BALL_DISPLAY_SHOCK[2].max ? this.displayShock(INTENSITY_DISPLAY_SHOCK[2].time, INTENSITY_DISPLAY_SHOCK[2].x, INTENSITY_DISPLAY_SHOCK[2].y) : w > FORCE_BALL_DISPLAY_SHOCK[3].min && this.displayShock(INTENSITY_DISPLAY_SHOCK[3].time, INTENSITY_DISPLAY_SHOCK[3].x, INTENSITY_DISPLAY_SHOCK[3].y)
  }
    ;
  this.displayShock = function (w, D, O) {
    createjs.Tween.get(k).to({
      x: Math.round(Math.random() * D),
      y: Math.round(Math.random() * O)
    }, w).call(function () {
      createjs.Tween.get(k).to({
        x: Math.round(Math.random() * D * .8),
        y: -Math.round(Math.random() * O * .8)
      }, w).call(function () {
        createjs.Tween.get(k).to({
          x: Math.round(Math.random() * D * .6),
          y: Math.round(Math.random() * O * .6)
        }, w).call(function () {
          createjs.Tween.get(k).to({
            x: Math.round(Math.random() * D * .4),
            y: -Math.round(Math.random() * O * .4)
          }, w).call(function () {
            createjs.Tween.get(k).to({
              x: Math.round(Math.random() * D * .2),
              y: Math.round(Math.random() * O * .2)
            }, w).call(function () {
              createjs.Tween.get(k).to({
                y: 0,
                x: 0
              }, w).call(function () { })
            })
          })
        })
      })
    })
  }
    ;
  this.resetScene = function () {
    E = K = Q = U = x = r = !1;
    b.setAlpha(0);
    b.fadeAnimation(1);
    b.runAnim(IDLE);
    this.resetBallPosition();
    this.sortDepth(a, t)
  }
    ;
  this._onEnd = function () {
    this.onExit()
  }
    ;
  this.swapChildrenIndex = function () {
    for (var w = 0; w < A.length - 1; w++)
      for (var D = w + 1; D < A.length; D++)
        A[w].getObject().visible && A[D].getObject().visible && this.sortDepth(A[w], A[D])
  }
    ;
  this.ballOut = function () {
    if (!x && !r && !U) {
      var w = a.getPhysics().position;
      if (w.y > BALL_OUT_Y || w.x > BACK_WALL_GOAL_SIZE.width || w.x < -BACK_WALL_GOAL_SIZE.width)
        x = !0,
          ca = TIME_RESET_AFTER_BALL_OUT,
          d.createAnimText(TEXT_BALL_OUT, 90, !1, TEXT_COLOR_1, TEXT_COLOR_STROKE),
          playSound("ball_saved", 1, !1),
          L = 1,
          T = 0
    }
  }
    ;
  this.animPlayer = function () {
    z ? (z = n.animPlayer(),
      n.getFrame() === SHOOT_FRAME && (this.addImpulseToBall({
        x: B.x,
        y: B.y,
        z: B.z
      }),
        M = 0,
        this.goalAnimation(B.y),
        d.unloadHelpText())) : n.setVisible(!1)
  }
    ;
  this.animGoalKeeper = function () {
    v ? F && (F = b.update(),
      F || (b.viewFrame(b.getAnimArray(), b.getAnimArray().length - 1),
        b.hideFrame(b.getAnimArray(), 0),
        b.fadeAnimation(0))) : b.update()
  }
    ;
  this.resetPoleCollision = function () {
    0 < P ? P -= s_iTimeElaps : r && U || (d.createAnimText(TEXT_BALL_OUT, 80, !1, TEXT_COLOR_1, TEXT_COLOR_STROKE),
      L = 1,
      T = 0,
      playSound("ball_saved", 1, !1),
      this.endTurn(),
      P = TIME_POLE_COLLISION_RESET)
  }
    ;
  this.handSwipeAnim = function () {
    q.isAnimate() || v || (0 < X ? X -= s_iTimeElaps : (q.animAllSwipe(),
      q.setVisible(!0),
      X = MS_TIME_SWIPE_START))
  }
    ;
  this.swapGoal = function () {
    a.getPhysics().position.z > GOAL_SPRITE_SWAP_Z && this.sortDepth(a, t)
  }
    ;
  this._updatePlay = function () {
    for (var w = 0; w < PHYSICS_ACCURACY; w++)
      m.update();
    this.ballOut();
    r || x || U ? this.timeReset() : K && this.resetPoleCollision();
    this.animGoalKeeper();
    this.animPlayer();
    this._updateBall2DPosition();
    this.handSwipeAnim();
    this.swapChildrenIndex();
    this.swapGoal()
  }
    ;
  this.update = function () {
    switch (y) {
      case STATE_INIT:
        this._updateInit();
        break;
      case STATE_PLAY:
        this._updatePlay()
    }
  }
    ;
  this._updateBall2DPosition = function () {
    this.ballPosition();
    a.rolls();
    u.updateProjectionMatrix();
    u.updateMatrixWorld()
  }
    ;
  s_oGame = this;
  AREAS_INFO = f.area_goal;
  NUM_OF_PENALTY = f.num_of_penalty;
  MULTIPLIER_STEP = f.multiplier_step;
  NUM_LEVEL_FOR_ADS = f.num_levels_for_ads;
  this._init()
}
var s_oGame;
function CInterface () {
  var f, d, e, m, a, c, b, k, g, h, l, n, p = null, q, t, r, v, x, E = null, z = null;
  this._init = function () {
    var F = s_oSpriteLibrary.getSprite("but_exit");
    e = CANVAS_WIDTH - F.height / 2 - 10;
    m = F.height / 2 + 10;
    g = new CGfxButton(e, m, F);
    g.addEventListener(ON_MOUSE_UP, this._onExit, this);
    F = s_oSpriteLibrary.getSprite("but_pause");
    f = e - F.height - 10;
    d = m;
    h = new CGfxButton(f, d, F);
    h.addEventListener(ON_MOUSE_UP, this.onButPauseRelease, this);
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      F = s_oSpriteLibrary.getSprite("audio_icon"),
        b = f - F.height - 10,
        k = m,
        n = new CToggle(b, k, F, s_bAudioActive),
        n.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    F = window.document;
    var U = F.documentElement;
    E = U.requestFullscreen || U.mozRequestFullScreen || U.webkitRequestFullScreen || U.msRequestFullscreen;
    z = F.exitFullscreen || F.mozCancelFullScreen || F.webkitExitFullscreen || F.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (E = !1);
    E && screenfull.isEnabled && (F = s_oSpriteLibrary.getSprite("but_fullscreen"),
      a = F.width / 4 + 10,
      c = F.height / 2 + 10,
      l = new CToggle(a, c, F, s_bFullscreen, s_oStage),
      l.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
    t = new CScoreBoard(s_oStage);
    r = new CLaunchBoard(s_oStage);
    v = new CHelpText(s_oStage);
    v.fadeAnim(1, null);
    this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  }
    ;
  this.refreshButtonPos = function (F, U) {
    g.setPosition(e - F, U + m);
    h.setPosition(f - F, U + d);
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || n.setPosition(b - F, U + k);
    var Q = t.getStartPosScore();
    t.setPosScore(Q.x + F, Q.y - U);
    Q = r.getStartPos();
    r.setPos(Q.x - F, Q.y - U);
    E && screenfull.isEnabled && l.setPosition(a + F, c + U)
  }
    ;
  this.unloadHelpText = function () {
    null !== v && (v.fadeAnim(0, v.unload),
      v = null)
  }
    ;
  this.unload = function () {
    g.unload();
    g = null;
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      n.unload(),
        n = null;
    E && screenfull.isEnabled && (l.unload(),
      l = null);
    s_oInterface = null
  }
    ;
  this.createWinPanel = function (F) {
    p = new CWinPanel(s_oSpriteLibrary.getSprite("msg_box"));
    p.show(F)
  }
    ;
  this.refreshTextScoreBoard = function (F, U, Q, K) {
    t.refreshTextScore(F);
    K && t.effectAddScore(Q, U)
  }
    ;
  this.resetFullscreenBut = function () {
    E && screenfull.isEnabled && l.setActive(s_bFullscreen)
  }
    ;
  this._onFullscreen = function () {
    s_bFullscreen ? z.call(window.document) : E.call(window.document.documentElement);
    sizeHandler()
  }
    ;
  this.createAnimText = function (F, U, Q, K, Y) {
    var C = new createjs.Container
      , H = new createjs.Text(F, U + "px " + FONT_GAME, Y);
    H.x = 0;
    H.y = 0;
    H.textAlign = "center";
    H.outline = 4;
    C.addChild(H);
    var T = new createjs.Text(H.text, U + "px " + FONT_GAME, K);
    T.x = 0;
    T.y = 0;
    T.textAlign = "center";
    C.addChild(T);
    C.x = CANVAS_WIDTH_HALF;
    C.y = -H.getBounds().height;
    Q && s_oInterface.strobeText(T);
    s_oStage.addChild(C);
    createjs.Tween.get(C).to({
      y: CANVAS_HEIGHT_HALF
    }, 500, createjs.Ease.cubicOut).call(function () {
      createjs.Tween.get(C).wait(250).to({
        y: CANVAS_HEIGHT + H.getBounds().height
      }, 500, createjs.Ease.cubicIn).call(function () {
        Q && createjs.Tween.removeTweens(T);
        s_oStage.removeChild(C)
      })
    })
  }
    ;
  this.strobeText = function (F) {
    createjs.Tween.get(F).wait(30).call(function () {
      x < TEXT_EXCELLENT_COLOR.length - 1 ? x++ : x = 0;
      F.color = TEXT_EXCELLENT_COLOR[x];
      s_oInterface.strobeText(F)
    })
  }
    ;
  this.refreshLaunchBoard = function (F, U) {
    r.refreshTextLaunch(F, U)
  }
    ;
  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive
  }
    ;
  this._onExit = function () {
    (new CAreYouSurePanel(s_oStage)).show()
  }
    ;
  this.unloadPause = function () {
    q.unload();
    q = null
  }
    ;
  this.onButPauseRelease = function () {
    playSound("click", 1, !1);
    q = new CPause
  }
    ;
  s_oInterface = this;
  this._init();
  return this
}
var s_oInterface = null;
!function (f) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = f();
  else {
    var d;
    "undefined" != typeof window ? d = window : "undefined" != typeof global ? d = global : "undefined" != typeof self && (d = self);
    d.CANNON = f()
  }
}(function () {
  return function a (d, e, m) {
    function c (g, h) {
      if (!e[g]) {
        if (!d[g]) {
          var l = "function" == typeof require && require;
          if (!h && l)
            return l(g, !0);
          if (b)
            return b(g, !0);
          throw Error("Cannot find module '" + g + "'");
        }
        l = e[g] = {
          exports: {}
        };
        d[g][0].call(l.exports, function (n) {
          var p = d[g][1][n];
          return c(p ? p : n)
        }, l, l.exports, a, d, e, m)
      }
      return e[g].exports
    }
    for (var b = "function" == typeof require && require, k = 0; k < m.length; k++)
      c(m[k]);
    return c
  }({
    1: [function (d, e, m) {
      e.exports = {
        name: "cannon",
        version: "0.6.2",
        description: "A lightweight 3D physics engine written in JavaScript.",
        homepage: "https://github.com/schteppe/cannon.js",
        author: "Stefan Hedman <schteppe@gmail.com> (http://steffe.se)",
        keywords: ["cannon.js", "cannon", "physics", "engine", "3d"],
        main: "./build/cannon.js",
        engines: {
          node: "*"
        },
        repository: {
          type: "git",
          url: "https://github.com/schteppe/cannon.js.git"
        },
        bugs: {
          url: "https://github.com/schteppe/cannon.js/issues"
        },
        licenses: [{
          type: "MIT"
        }],
        devDependencies: {
          jshint: "latest",
          "uglify-js": "latest",
          nodeunit: "^0.9.0",
          grunt: "~0.4.0",
          "grunt-contrib-jshint": "~0.1.1",
          "grunt-contrib-nodeunit": "^0.4.1",
          "grunt-contrib-concat": "~0.1.3",
          "grunt-contrib-uglify": "^0.5.1",
          "grunt-browserify": "^2.1.4",
          "grunt-contrib-yuidoc": "^0.5.2",
          browserify: "*"
        },
        dependencies: {}
      }
    }
      , {}],
    2: [function (d, e, m) {
      e.exports = {
        version: d("../package.json").version,
        AABB: d("./collision/AABB"),
        ArrayCollisionMatrix: d("./collision/ArrayCollisionMatrix"),
        Body: d("./objects/Body"),
        Box: d("./shapes/Box"),
        Broadphase: d("./collision/Broadphase"),
        Constraint: d("./constraints/Constraint"),
        ContactEquation: d("./equations/ContactEquation"),
        Narrowphase: d("./world/Narrowphase"),
        ConeTwistConstraint: d("./constraints/ConeTwistConstraint"),
        ContactMaterial: d("./material/ContactMaterial"),
        ConvexPolyhedron: d("./shapes/ConvexPolyhedron"),
        Cylinder: d("./shapes/Cylinder"),
        DistanceConstraint: d("./constraints/DistanceConstraint"),
        Equation: d("./equations/Equation"),
        EventTarget: d("./utils/EventTarget"),
        FrictionEquation: d("./equations/FrictionEquation"),
        GSSolver: d("./solver/GSSolver"),
        GridBroadphase: d("./collision/GridBroadphase"),
        Heightfield: d("./shapes/Heightfield"),
        HingeConstraint: d("./constraints/HingeConstraint"),
        LockConstraint: d("./constraints/LockConstraint"),
        Mat3: d("./math/Mat3"),
        Material: d("./material/Material"),
        NaiveBroadphase: d("./collision/NaiveBroadphase"),
        ObjectCollisionMatrix: d("./collision/ObjectCollisionMatrix"),
        Pool: d("./utils/Pool"),
        Particle: d("./shapes/Particle"),
        Plane: d("./shapes/Plane"),
        PointToPointConstraint: d("./constraints/PointToPointConstraint"),
        Quaternion: d("./math/Quaternion"),
        Ray: d("./collision/Ray"),
        RaycastVehicle: d("./objects/RaycastVehicle"),
        RaycastResult: d("./collision/RaycastResult"),
        RigidVehicle: d("./objects/RigidVehicle"),
        RotationalEquation: d("./equations/RotationalEquation"),
        RotationalMotorEquation: d("./equations/RotationalMotorEquation"),
        SAPBroadphase: d("./collision/SAPBroadphase"),
        SPHSystem: d("./objects/SPHSystem"),
        Shape: d("./shapes/Shape"),
        Solver: d("./solver/Solver"),
        Sphere: d("./shapes/Sphere"),
        SplitSolver: d("./solver/SplitSolver"),
        Spring: d("./objects/Spring"),
        Trimesh: d("./shapes/Trimesh"),
        Vec3: d("./math/Vec3"),
        Vec3Pool: d("./utils/Vec3Pool"),
        World: d("./world/World")
      }
    }
      , {
      "../package.json": 1,
      "./collision/AABB": 3,
      "./collision/ArrayCollisionMatrix": 4,
      "./collision/Broadphase": 5,
      "./collision/GridBroadphase": 6,
      "./collision/NaiveBroadphase": 7,
      "./collision/ObjectCollisionMatrix": 8,
      "./collision/Ray": 9,
      "./collision/RaycastResult": 10,
      "./collision/SAPBroadphase": 11,
      "./constraints/ConeTwistConstraint": 12,
      "./constraints/Constraint": 13,
      "./constraints/DistanceConstraint": 14,
      "./constraints/HingeConstraint": 15,
      "./constraints/LockConstraint": 16,
      "./constraints/PointToPointConstraint": 17,
      "./equations/ContactEquation": 19,
      "./equations/Equation": 20,
      "./equations/FrictionEquation": 21,
      "./equations/RotationalEquation": 22,
      "./equations/RotationalMotorEquation": 23,
      "./material/ContactMaterial": 24,
      "./material/Material": 25,
      "./math/Mat3": 27,
      "./math/Quaternion": 28,
      "./math/Vec3": 30,
      "./objects/Body": 31,
      "./objects/RaycastVehicle": 32,
      "./objects/RigidVehicle": 33,
      "./objects/SPHSystem": 34,
      "./objects/Spring": 35,
      "./shapes/Box": 37,
      "./shapes/ConvexPolyhedron": 38,
      "./shapes/Cylinder": 39,
      "./shapes/Heightfield": 40,
      "./shapes/Particle": 41,
      "./shapes/Plane": 42,
      "./shapes/Shape": 43,
      "./shapes/Sphere": 44,
      "./shapes/Trimesh": 45,
      "./solver/GSSolver": 46,
      "./solver/Solver": 47,
      "./solver/SplitSolver": 48,
      "./utils/EventTarget": 49,
      "./utils/Pool": 51,
      "./utils/Vec3Pool": 54,
      "./world/Narrowphase": 55,
      "./world/World": 56
    }],
    3: [function (d, e, m) {
      function a (g) {
        g = g || {};
        this.lowerBound = new c;
        g.lowerBound && this.lowerBound.copy(g.lowerBound);
        this.upperBound = new c;
        g.upperBound && this.upperBound.copy(g.upperBound)
      }
      var c = d("../math/Vec3");
      d("../utils/Utils");
      e.exports = a;
      var b = new c;
      a.prototype.setFromPoints = function (g, h, l, n) {
        var p = this.lowerBound
          , q = this.upperBound;
        p.copy(g[0]);
        l && l.vmult(p, p);
        q.copy(p);
        for (var t = 1; t < g.length; t++) {
          var r = g[t];
          l && (l.vmult(r, b),
            r = b);
          r.x > q.x && (q.x = r.x);
          r.x < p.x && (p.x = r.x);
          r.y > q.y && (q.y = r.y);
          r.y < p.y && (p.y = r.y);
          r.z > q.z && (q.z = r.z);
          r.z < p.z && (p.z = r.z)
        }
        h && (h.vadd(p, p),
          h.vadd(q, q));
        n && (p.x -= n,
          p.y -= n,
          p.z -= n,
          q.x += n,
          q.y += n,
          q.z += n);
        return this
      }
        ;
      a.prototype.copy = function (g) {
        this.lowerBound.copy(g.lowerBound);
        this.upperBound.copy(g.upperBound);
        return this
      }
        ;
      a.prototype.clone = function () {
        return (new a).copy(this)
      }
        ;
      a.prototype.extend = function (g) {
        var h = g.lowerBound.x;
        this.lowerBound.x > h && (this.lowerBound.x = h);
        h = g.upperBound.x;
        this.upperBound.x < h && (this.upperBound.x = h);
        h = g.lowerBound.y;
        this.lowerBound.y > h && (this.lowerBound.y = h);
        h = g.upperBound.y;
        this.upperBound.y < h && (this.upperBound.y = h);
        h = g.lowerBound.z;
        this.lowerBound.z > h && (this.lowerBound.z = h);
        h = g.upperBound.z;
        this.upperBound.z < h && (this.upperBound.z = h)
      }
        ;
      a.prototype.overlaps = function (g) {
        var h = this.lowerBound
          , l = this.upperBound
          , n = g.lowerBound;
        g = g.upperBound;
        return (n.x <= l.x && l.x <= g.x || h.x <= g.x && g.x <= l.x) && (n.y <= l.y && l.y <= g.y || h.y <= g.y && g.y <= l.y) && (n.z <= l.z && l.z <= g.z || h.z <= g.z && g.z <= l.z)
      }
        ;
      a.prototype.contains = function (g) {
        var h = this.lowerBound
          , l = this.upperBound
          , n = g.lowerBound;
        g = g.upperBound;
        return h.x <= n.x && l.x >= g.x && h.y <= n.y && l.y >= g.y && h.z <= n.z && l.z >= g.z
      }
        ;
      a.prototype.getCorners = function (g, h, l, n, p, q, t, r) {
        var v = this.lowerBound
          , x = this.upperBound;
        g.copy(v);
        h.set(x.x, v.y, v.z);
        l.set(x.x, x.y, v.z);
        n.set(v.x, x.y, x.z);
        p.set(x.x, v.y, v.z);
        q.set(v.x, x.y, v.z);
        t.set(v.x, v.y, x.z);
        r.copy(x)
      }
        ;
      var k = [new c, new c, new c, new c, new c, new c, new c, new c];
      a.prototype.toLocalFrame = function (g, h) {
        this.getCorners(k[0], k[1], k[2], k[3], k[4], k[5], k[6], k[7]);
        for (var l = 0; 8 !== l; l++) {
          var n = k[l];
          g.pointToLocal(n, n)
        }
        return h.setFromPoints(k)
      }
        ;
      a.prototype.toWorldFrame = function (g, h) {
        this.getCorners(k[0], k[1], k[2], k[3], k[4], k[5], k[6], k[7]);
        for (var l = 0; 8 !== l; l++) {
          var n = k[l];
          g.pointToWorld(n, n)
        }
        return h.setFromPoints(k)
      }
    }
      , {
      "../math/Vec3": 30,
      "../utils/Utils": 53
    }],
    4: [function (d, e, m) {
      function a () {
        this.matrix = []
      }
      e.exports = a;
      a.prototype.get = function (c, b) {
        c = c.index;
        b = b.index;
        if (b > c) {
          var k = b;
          b = c;
          c = k
        }
        return this.matrix[(c * (c + 1) >> 1) + b - 1]
      }
        ;
      a.prototype.set = function (c, b, k) {
        c = c.index;
        b = b.index;
        if (b > c) {
          var g = b;
          b = c;
          c = g
        }
        this.matrix[(c * (c + 1) >> 1) + b - 1] = k ? 1 : 0
      }
        ;
      a.prototype.reset = function () {
        for (var c = 0, b = this.matrix.length; c !== b; c++)
          this.matrix[c] = 0
      }
        ;
      a.prototype.setNumObjects = function (c) {
        this.matrix.length = c * (c - 1) >> 1
      }
    }
      , {}],
    5: [function (d, e, m) {
      function a () {
        this.world = null;
        this.useBoundingBoxes = !1;
        this.dirty = !0
      }
      var c = d("../objects/Body");
      m = d("../math/Vec3");
      var b = d("../math/Quaternion");
      d("../shapes/Shape");
      d("../shapes/Plane");
      e.exports = a;
      a.prototype.collisionPairs = function (q, t, r) {
        throw Error("collisionPairs not implemented for this BroadPhase class!");
      }
        ;
      var k = c.STATIC | c.KINEMATIC;
      a.prototype.needBroadphaseCollision = function (q, t) {
        return 0 !== (q.collisionFilterGroup & t.collisionFilterMask) && 0 !== (t.collisionFilterGroup & q.collisionFilterMask) && (0 === (q.type & k) && q.sleepState !== c.SLEEPING || 0 === (t.type & k) && t.sleepState !== c.SLEEPING) ? !0 : !1
      }
        ;
      a.prototype.intersectionTest = function (q, t, r, v) {
        this.useBoundingBoxes ? this.doBoundingBoxBroadphase(q, t, r, v) : this.doBoundingSphereBroadphase(q, t, r, v)
      }
        ;
      var g = new m;
      new m;
      new b;
      new m;
      a.prototype.doBoundingSphereBroadphase = function (q, t, r, v) {
        t.position.vsub(q.position, g);
        var x = Math.pow(q.boundingRadius + t.boundingRadius, 2);
        g.norm2() < x && (r.push(q),
          v.push(t))
      }
        ;
      a.prototype.doBoundingBoxBroadphase = function (q, t, r, v) {
        q.aabbNeedsUpdate && q.computeAABB();
        t.aabbNeedsUpdate && t.computeAABB();
        q.aabb.overlaps(t.aabb) && (r.push(q),
          v.push(t))
      }
        ;
      var h = {
        keys: []
      }
        , l = []
        , n = [];
      a.prototype.makePairsUnique = function (q, t) {
        for (var r = q.length, v = 0; v !== r; v++)
          l[v] = q[v],
            n[v] = t[v];
        q.length = 0;
        for (v = t.length = 0; v !== r; v++) {
          var x = l[v].id
            , E = n[v].id;
          x = x < E ? x + "," + E : E + "," + x;
          h[x] = v;
          h.keys.push(x)
        }
        for (v = 0; v !== h.keys.length; v++)
          x = h.keys.pop(),
            r = h[x],
            q.push(l[r]),
            t.push(n[r]),
            delete h[x]
      }
        ;
      a.prototype.setWorld = function (q) { }
        ;
      var p = new m;
      a.boundingSphereCheck = function (q, t) {
        q.position.vsub(t.position, p);
        return Math.pow(q.shape.boundingSphereRadius + t.shape.boundingSphereRadius, 2) > p.norm2()
      }
        ;
      a.prototype.aabbQuery = function (q, t, r) {
        console.warn(".aabbQuery is not implemented in this Broadphase subclass.");
        return []
      }
    }
      , {
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "../objects/Body": 31,
      "../shapes/Plane": 42,
      "../shapes/Shape": 43
    }],
    6: [function (d, e, m) {
      function a (h, l, n, p, q) {
        c.apply(this);
        this.nx = n || 10;
        this.ny = p || 10;
        this.nz = q || 10;
        this.aabbMin = h || new b(100, 100, 100);
        this.aabbMax = l || new b(-100, -100, -100);
        h = this.nx * this.ny * this.nz;
        if (0 >= h)
          throw "GridBroadphase: Each dimension's n must be >0";
        this.bins = [];
        this.binLengths = [];
        this.bins.length = h;
        this.binLengths.length = h;
        for (l = 0; l < h; l++)
          this.bins[l] = [],
            this.binLengths[l] = 0
      }
      e.exports = a;
      var c = d("./Broadphase")
        , b = d("../math/Vec3")
        , k = d("../shapes/Shape");
      a.prototype = new c;
      a.prototype.constructor = a;
      var g = new b;
      new b;
      a.prototype.collisionPairs = function (h, l, n) {
        function p (R, aa, da, na, ua, ra, Da) {
          R = (R - Y) * T | 0;
          aa = (aa - C) * M | 0;
          da = (da - H) * ca | 0;
          na = u((na - Y) * T);
          ua = u((ua - C) * M);
          ra = u((ra - H) * ca);
          0 > R ? R = 0 : R >= v && (R = v - 1);
          0 > aa ? aa = 0 : aa >= x && (aa = x - 1);
          0 > da ? da = 0 : da >= E && (da = E - 1);
          0 > na ? na = 0 : na >= v && (na = v - 1);
          0 > ua ? ua = 0 : ua >= x && (ua = x - 1);
          0 > ra ? ra = 0 : ra >= E && (ra = E - 1);
          R *= z;
          aa *= F;
          da *= 1;
          na *= z;
          ua *= F;
          for (ra *= 1; R <= na; R += z)
            for (var Ra = aa; Ra <= ua; Ra += F)
              for (var Sa = da; Sa <= ra; Sa += 1) {
                var Ua = R + Ra + Sa;
                B[Ua][y[Ua]++] = Da
              }
        }
        var q = h.numObjects();
        h = h.bodies;
        var t = this.aabbMax
          , r = this.aabbMin
          , v = this.nx
          , x = this.ny
          , E = this.nz
          , z = x * E
          , F = E
          , U = t.x
          , Q = t.y
          , K = t.z
          , Y = r.x
          , C = r.y
          , H = r.z
          , T = v / (U - Y)
          , M = x / (Q - C)
          , ca = E / (K - H);
        U = (U - Y) / v;
        var P = (Q - C) / x;
        K = (K - H) / E;
        var X = .5 * Math.sqrt(U * U + P * P + K * K);
        Q = k.types;
        var L = Q.SPHERE
          , A = Q.PLANE
          , B = this.bins
          , y = this.binLengths;
        Q = this.bins.length;
        for (r = 0; r !== Q; r++)
          y[r] = 0;
        var u = Math.ceil;
        r = Math.min;
        t = Math.max;
        for (r = 0; r !== q; r++) {
          t = h[r];
          var w = t.shape;
          switch (w.type) {
            case L:
              var D = t.position.x
                , O = t.position.y
                , J = t.position.z;
              w = w.radius;
              p(D - w, O - w, J - w, D + w, O + w, J + w, t);
              break;
            case A:
              w.worldNormalNeedsUpdate && w.computeWorldNormal(t.quaternion);
              J = w.worldNormal;
              w = C + .5 * P - t.position.y;
              var G = H + .5 * K - t.position.z
                , S = g;
              S.set(Y + .5 * U - t.position.x, w, G);
              for (var ba = D = 0; D !== v; D++,
                ba += z,
                S.y = w,
                S.x += U)
                for (var I = O = 0; O !== x; O++,
                  I += F,
                  S.z = G,
                  S.y += P)
                  for (var qa = 0, la = 0; qa !== E; qa++,
                    la += 1,
                    S.z += K)
                    if (S.dot(J) < X) {
                      var fa = ba + I + la;
                      B[fa][y[fa]++] = t
                    }
              break;
            default:
              t.aabbNeedsUpdate && t.computeAABB(),
                p(t.aabb.lowerBound.x, t.aabb.lowerBound.y, t.aabb.lowerBound.z, t.aabb.upperBound.x, t.aabb.upperBound.y, t.aabb.upperBound.z, t)
          }
        }
        for (r = 0; r !== Q; r++)
          if (q = y[r],
            1 < q)
            for (h = B[r],
              D = 0; D !== q; D++)
              for (t = h[D],
                O = 0; O !== D; O++)
                U = h[O],
                  this.needBroadphaseCollision(t, U) && this.intersectionTest(t, U, l, n);
        this.makePairsUnique(l, n)
      }
    }
      , {
      "../math/Vec3": 30,
      "../shapes/Shape": 43,
      "./Broadphase": 5
    }],
    7: [function (d, e, m) {
      function a () {
        c.apply(this)
      }
      e.exports = a;
      var c = d("./Broadphase");
      d = d("./AABB");
      a.prototype = new c;
      a.prototype.constructor = a;
      a.prototype.collisionPairs = function (b, k, g) {
        b = b.bodies;
        var h = b.length, l, n;
        for (l = 0; l !== h; l++)
          for (n = 0; n !== l; n++) {
            var p = b[l];
            var q = b[n];
            this.needBroadphaseCollision(p, q) && this.intersectionTest(p, q, k, g)
          }
      }
        ;
      new d;
      a.prototype.aabbQuery = function (b, k, g) {
        g = g || [];
        for (var h = 0; h < b.bodies.length; h++) {
          var l = b.bodies[h];
          l.aabbNeedsUpdate && l.computeAABB();
          l.aabb.overlaps(k) && g.push(l)
        }
        return g
      }
    }
      , {
      "./AABB": 3,
      "./Broadphase": 5
    }],
    8: [function (d, e, m) {
      function a () {
        this.matrix = {}
      }
      e.exports = a;
      a.prototype.get = function (c, b) {
        c = c.id;
        b = b.id;
        if (b > c) {
          var k = b;
          b = c;
          c = k
        }
        return c + "-" + b in this.matrix
      }
        ;
      a.prototype.set = function (c, b, k) {
        c = c.id;
        b = b.id;
        if (b > c) {
          var g = b;
          b = c;
          c = g
        }
        k ? this.matrix[c + "-" + b] = !0 : delete this.matrix[c + "-" + b]
      }
        ;
      a.prototype.reset = function () {
        this.matrix = {}
      }
        ;
      a.prototype.setNumObjects = function (c) { }
    }
      , {}],
    9: [function (d, e, m) {
      function a (B, y) {
        this.from = B ? B.clone() : new b;
        this.to = y ? y.clone() : new b;
        this._direction = new b;
        this.precision = 1E-4;
        this.checkCollisionResponse = !0;
        this.skipBackfaces = !1;
        this.collisionFilterGroup = this.collisionFilterMask = -1;
        this.mode = a.ANY;
        this.result = new g;
        this.hasHit = !1;
        this.callback = function (u) { }
      }
      function c (B, y, u, w) {
        w.vsub(y, L);
        u.vsub(y, n);
        B.vsub(y, p);
        B = L.dot(L);
        y = L.dot(n);
        u = L.dot(p);
        w = n.dot(n);
        var D = n.dot(p), O, J;
        return 0 <= (O = w * u - y * D) && 0 <= (J = B * D - y * u) && O + J < B * w - y * y
      }
      e.exports = a;
      var b = d("../math/Vec3");
      e = d("../math/Quaternion");
      var k = d("../math/Transform");
      d("../shapes/ConvexPolyhedron");
      d("../shapes/Box");
      var g = d("../collision/RaycastResult");
      m = d("../shapes/Shape");
      d = d("../collision/AABB");
      a.prototype.constructor = a;
      a.CLOSEST = 1;
      a.ANY = 2;
      a.ALL = 4;
      var h = new d
        , l = [];
      a.prototype.intersectWorld = function (B, y) {
        this.mode = y.mode || a.ANY;
        this.result = y.result || new g;
        this.skipBackfaces = !!y.skipBackfaces;
        this.collisionFilterMask = "undefined" !== typeof y.collisionFilterMask ? y.collisionFilterMask : -1;
        this.collisionFilterGroup = "undefined" !== typeof y.collisionFilterGroup ? y.collisionFilterGroup : -1;
        y.from && this.from.copy(y.from);
        y.to && this.to.copy(y.to);
        this.callback = y.callback || function () { }
          ;
        this.hasHit = !1;
        this.result.reset();
        this._updateDirection();
        this.getAABB(h);
        l.length = 0;
        B.broadphase.aabbQuery(B, h, l);
        this.intersectBodies(l);
        return this.hasHit
      }
        ;
      var n = new b
        , p = new b;
      a.pointInTriangle = c;
      var q = new b
        , t = new e;
      a.prototype.intersectBody = function (B, y) {
        y && (this.result = y,
          this._updateDirection());
        var u = this.checkCollisionResponse;
        if ((!u || B.collisionResponse) && 0 !== (this.collisionFilterGroup & B.collisionFilterMask) && 0 !== (B.collisionFilterGroup & this.collisionFilterMask))
          for (var w = 0, D = B.shapes.length; w < D; w++) {
            var O = B.shapes[w];
            if (!u || O.collisionResponse)
              if (B.quaternion.mult(B.shapeOrientations[w], t),
                B.quaternion.vmult(B.shapeOffsets[w], q),
                q.vadd(B.position, q),
                this.intersectShape(O, t, q, B),
                this.result._shouldStop)
                break
          }
      }
        ;
      a.prototype.intersectBodies = function (B, y) {
        y && (this.result = y,
          this._updateDirection());
        for (var u = 0, w = B.length; !this.result._shouldStop && u < w; u++)
          this.intersectBody(B[u])
      }
        ;
      a.prototype._updateDirection = function () {
        this.to.vsub(this.from, this._direction);
        this._direction.normalize()
      }
        ;
      a.prototype.intersectShape = function (B, y, u, w) {
        var D = this.from
          , O = this._direction;
        u.vsub(D, L);
        var J = L.dot(O);
        O.mult(J, A);
        A.vadd(D, A);
        u.distanceTo(A) > B.boundingSphereRadius || (D = this[B.type]) && D.call(this, B, y, u, w)
      }
        ;
      new b;
      new b;
      var r = new b
        , v = new b
        , x = new b
        , E = new b;
      new b;
      new g;
      a.prototype.intersectBox = function (B, y, u, w) {
        return this.intersectConvex(B.convexPolyhedronRepresentation, y, u, w)
      }
        ;
      a.prototype[m.types.BOX] = a.prototype.intersectBox;
      a.prototype.intersectPlane = function (B, y, u, w) {
        var D = this.from
          , O = this.to
          , J = this._direction
          , G = new b(0, 0, 1);
        y.vmult(G, G);
        var S = new b;
        D.vsub(u, S);
        y = S.dot(G);
        O.vsub(u, S);
        S = S.dot(G);
        if (!(0 < y * S || D.distanceTo(O) < y || (S = G.dot(J),
          Math.abs(S) < this.precision))) {
          var ba = new b;
          O = new b;
          y = new b;
          D.vsub(u, ba);
          u = -G.dot(ba) / S;
          J.scale(u, O);
          D.vadd(O, y);
          this.reportIntersection(G, y, B, w, -1)
        }
      }
        ;
      a.prototype[m.types.PLANE] = a.prototype.intersectPlane;
      a.prototype.getAABB = function (B) {
        var y = this.to
          , u = this.from;
        B.lowerBound.x = Math.min(y.x, u.x);
        B.lowerBound.y = Math.min(y.y, u.y);
        B.lowerBound.z = Math.min(y.z, u.z);
        B.upperBound.x = Math.max(y.x, u.x);
        B.upperBound.y = Math.max(y.y, u.y);
        B.upperBound.z = Math.max(y.z, u.z)
      }
        ;
      var z = {
        faceList: [0]
      };
      a.prototype.intersectHeightfield = function (B, y, u, w) {
        var D = new b
          , O = new a(this.from, this.to);
        k.pointToLocalFrame(u, y, O.from, O.from);
        k.pointToLocalFrame(u, y, O.to, O.to);
        var J = []
          , G = null
          , S = null
          , ba = null
          , I = null
          , qa = B.getIndexOfPosition(O.from.x, O.from.y, J, !1);
        qa && (G = J[0],
          S = J[1],
          ba = J[0],
          I = J[1]);
        if (qa = B.getIndexOfPosition(O.to.x, O.to.y, J, !1)) {
          if (null === G || J[0] < G)
            G = J[0];
          if (null === ba || J[0] > ba)
            ba = J[0];
          if (null === S || J[1] < S)
            S = J[1];
          if (null === I || J[1] > I)
            I = J[1]
        }
        if (null !== G)
          for (B.getRectMinMax(G, S, ba, I, []),
            O = G; O <= ba; O++)
            for (J = S; J <= I; J++) {
              if (this.result._shouldStop)
                return;
              B.getConvexTrianglePillar(O, J, !1);
              k.pointToWorldFrame(u, y, B.pillarOffset, D);
              this.intersectConvex(B.pillarConvex, y, D, w, z);
              if (this.result._shouldStop)
                return;
              B.getConvexTrianglePillar(O, J, !0);
              k.pointToWorldFrame(u, y, B.pillarOffset, D);
              this.intersectConvex(B.pillarConvex, y, D, w, z)
            }
      }
        ;
      a.prototype[m.types.HEIGHTFIELD] = a.prototype.intersectHeightfield;
      var F = new b
        , U = new b;
      a.prototype.intersectSphere = function (B, y, u, w) {
        y = this.from;
        var D = this.to
          , O = Math.pow(D.x - y.x, 2) + Math.pow(D.y - y.y, 2) + Math.pow(D.z - y.z, 2)
          , J = 2 * ((D.x - y.x) * (y.x - u.x) + (D.y - y.y) * (y.y - u.y) + (D.z - y.z) * (y.z - u.z))
          , G = Math.pow(J, 2) - 4 * O * (Math.pow(y.x - u.x, 2) + Math.pow(y.y - u.y, 2) + Math.pow(y.z - u.z, 2) - Math.pow(B.radius, 2));
        if (!(0 > G))
          if (0 === G)
            y.lerp(D, G, F),
              F.vsub(u, U),
              U.normalize(),
              this.reportIntersection(U, F, B, w, -1);
          else {
            var S = (-J - Math.sqrt(G)) / (2 * O);
            O = (-J + Math.sqrt(G)) / (2 * O);
            0 <= S && 1 >= S && (y.lerp(D, S, F),
              F.vsub(u, U),
              U.normalize(),
              this.reportIntersection(U, F, B, w, -1));
            !this.result._shouldStop && 0 <= O && 1 >= O && (y.lerp(D, O, F),
              F.vsub(u, U),
              U.normalize(),
              this.reportIntersection(U, F, B, w, -1))
          }
      }
        ;
      a.prototype[m.types.SPHERE] = a.prototype.intersectSphere;
      var Q = new b;
      new b;
      new b;
      var K = new b;
      a.prototype.intersectConvex = function (B, y, u, w, D) {
        D = D && D.faceList || null;
        for (var O = B.faces, J = B.vertices, G = B.faceNormals, S = this._direction, ba = this.from, I = ba.distanceTo(this.to), qa = D ? D.length : O.length, la = this.result, fa = 0; !la._shouldStop && fa < qa; fa++) {
          var R = D ? D[fa] : fa
            , aa = O[R]
            , da = G[R]
            , na = y
            , ua = u;
          K.copy(J[aa[0]]);
          na.vmult(K, K);
          K.vadd(ua, K);
          K.vsub(ba, K);
          na.vmult(da, Q);
          da = S.dot(Q);
          if (!(Math.abs(da) < this.precision || (da = Q.dot(K) / da,
            0 > da)))
            for (S.mult(da, r),
              r.vadd(ba, r),
              v.copy(J[aa[0]]),
              na.vmult(v, v),
              ua.vadd(v, v),
              da = 1; !la._shouldStop && da < aa.length - 1; da++) {
              x.copy(J[aa[da]]);
              E.copy(J[aa[da + 1]]);
              na.vmult(x, x);
              na.vmult(E, E);
              ua.vadd(x, x);
              ua.vadd(E, E);
              var ra = r.distanceTo(ba);
              !c(r, v, x, E) && !c(r, x, v, E) || ra > I || this.reportIntersection(Q, r, B, w, R)
            }
        }
      }
        ;
      a.prototype[m.types.CONVEXPOLYHEDRON] = a.prototype.intersectConvex;
      var Y = new b
        , C = new b
        , H = new b
        , T = new b
        , M = new b
        , ca = new b;
      new d;
      var P = []
        , X = new k;
      a.prototype.intersectTrimesh = function (B, y, u, w, D) {
        D = B.indices;
        var O = this.from
          , J = this.to
          , G = this._direction;
        X.position.copy(u);
        X.quaternion.copy(y);
        k.vectorToLocalFrame(u, y, G, C);
        k.pointToLocalFrame(u, y, O, H);
        k.pointToLocalFrame(u, y, J, T);
        O = H.distanceSquared(T);
        B.tree.rayQuery(this, X, P);
        J = 0;
        for (G = P.length; !this.result._shouldStop && J !== G; J++) {
          var S = P[J];
          B.getNormal(S, Y);
          B.getVertex(D[3 * S], v);
          v.vsub(H, K);
          var ba = C.dot(Y);
          ba = Y.dot(K) / ba;
          0 > ba || (C.scale(ba, r),
            r.vadd(H, r),
            B.getVertex(D[3 * S + 1], x),
            B.getVertex(D[3 * S + 2], E),
            ba = r.distanceSquared(H),
            !c(r, x, v, E) && !c(r, v, x, E) || ba > O || (k.vectorToWorldFrame(y, Y, M),
              k.pointToWorldFrame(u, y, r, ca),
              this.reportIntersection(M, ca, B, w, S)))
        }
        P.length = 0
      }
        ;
      a.prototype[m.types.TRIMESH] = a.prototype.intersectTrimesh;
      a.prototype.reportIntersection = function (B, y, u, w, D) {
        var O = this.from
          , J = this.to
          , G = O.distanceTo(y)
          , S = this.result;
        if (!(this.skipBackfaces && 0 < B.dot(this._direction)))
          switch (S.hitFaceIndex = "undefined" !== typeof D ? D : -1,
          this.mode) {
            case a.ALL:
              this.hasHit = !0;
              S.set(O, J, B, y, u, w, G);
              S.hasHit = !0;
              this.callback(S);
              break;
            case a.CLOSEST:
              if (G < S.distance || !S.hasHit)
                this.hasHit = !0,
                  S.hasHit = !0,
                  S.set(O, J, B, y, u, w, G);
              break;
            case a.ANY:
              this.hasHit = !0,
                S.hasHit = !0,
                S.set(O, J, B, y, u, w, G),
                S._shouldStop = !0
          }
      }
        ;
      var L = new b
        , A = new b
    }
      , {
      "../collision/AABB": 3,
      "../collision/RaycastResult": 10,
      "../math/Quaternion": 28,
      "../math/Transform": 29,
      "../math/Vec3": 30,
      "../shapes/Box": 37,
      "../shapes/ConvexPolyhedron": 38,
      "../shapes/Shape": 43
    }],
    10: [function (d, e, m) {
      function a () {
        this.rayFromWorld = new c;
        this.rayToWorld = new c;
        this.hitNormalWorld = new c;
        this.hitPointWorld = new c;
        this.hasHit = !1;
        this.body = this.shape = null;
        this.distance = this.hitFaceIndex = -1;
        this._shouldStop = !1
      }
      var c = d("../math/Vec3");
      e.exports = a;
      a.prototype.reset = function () {
        this.rayFromWorld.setZero();
        this.rayToWorld.setZero();
        this.hitNormalWorld.setZero();
        this.hitPointWorld.setZero();
        this.hasHit = !1;
        this.body = this.shape = null;
        this.distance = this.hitFaceIndex = -1;
        this._shouldStop = !1
      }
        ;
      a.prototype.abort = function () {
        this._shouldStop = !0
      }
        ;
      a.prototype.set = function (b, k, g, h, l, n, p) {
        this.rayFromWorld.copy(b);
        this.rayToWorld.copy(k);
        this.hitNormalWorld.copy(g);
        this.hitPointWorld.copy(h);
        this.shape = l;
        this.body = n;
        this.distance = p
      }
    }
      , {
      "../math/Vec3": 30
    }],
    11: [function (d, e, m) {
      function a (b) {
        c.apply(this);
        this.axisList = [];
        this.world = null;
        this.axisIndex = 0;
        var k = this.axisList;
        this._addBodyHandler = function (g) {
          k.push(g.body)
        }
          ;
        this._removeBodyHandler = function (g) {
          g = k.indexOf(g.body);
          -1 !== g && k.splice(g, 1)
        }
          ;
        b && this.setWorld(b)
      }
      d("../shapes/Shape");
      var c = d("../collision/Broadphase");
      e.exports = a;
      a.prototype = new c;
      a.prototype.setWorld = function (b) {
        for (var k = this.axisList.length = 0; k < b.bodies.length; k++)
          this.axisList.push(b.bodies[k]);
        b.removeEventListener("addBody", this._addBodyHandler);
        b.removeEventListener("removeBody", this._removeBodyHandler);
        b.addEventListener("addBody", this._addBodyHandler);
        b.addEventListener("removeBody", this._removeBodyHandler);
        this.world = b;
        this.dirty = !0
      }
        ;
      a.insertionSortX = function (b) {
        for (var k = 1, g = b.length; k < g; k++) {
          for (var h = b[k], l = k - 1; 0 <= l && !(b[l].aabb.lowerBound.x <= h.aabb.lowerBound.x); l--)
            b[l + 1] = b[l];
          b[l + 1] = h
        }
        return b
      }
        ;
      a.insertionSortY = function (b) {
        for (var k = 1, g = b.length; k < g; k++) {
          for (var h = b[k], l = k - 1; 0 <= l && !(b[l].aabb.lowerBound.y <= h.aabb.lowerBound.y); l--)
            b[l + 1] = b[l];
          b[l + 1] = h
        }
        return b
      }
        ;
      a.insertionSortZ = function (b) {
        for (var k = 1, g = b.length; k < g; k++) {
          for (var h = b[k], l = k - 1; 0 <= l && !(b[l].aabb.lowerBound.z <= h.aabb.lowerBound.z); l--)
            b[l + 1] = b[l];
          b[l + 1] = h
        }
        return b
      }
        ;
      a.prototype.collisionPairs = function (b, k, g) {
        b = this.axisList;
        var h = b.length, l = this.axisIndex, n, p;
        this.dirty && (this.sortList(),
          this.dirty = !1);
        for (n = 0; n !== h; n++) {
          var q = b[n];
          for (p = n + 1; p < h; p++) {
            var t = b[p];
            if (this.needBroadphaseCollision(q, t)) {
              if (!a.checkBounds(q, t, l))
                break;
              this.intersectionTest(q, t, k, g)
            }
          }
        }
      }
        ;
      a.prototype.sortList = function () {
        for (var b = this.axisList, k = this.axisIndex, g = b.length, h = 0; h !== g; h++) {
          var l = b[h];
          l.aabbNeedsUpdate && l.computeAABB()
        }
        0 === k ? a.insertionSortX(b) : 1 === k ? a.insertionSortY(b) : 2 === k && a.insertionSortZ(b)
      }
        ;
      a.checkBounds = function (b, k, g) {
        if (0 === g) {
          var h = b.position.x;
          var l = k.position.x
        } else
          1 === g ? (h = b.position.y,
            l = k.position.y) : 2 === g && (h = b.position.z,
              l = k.position.z);
        return l - k.boundingRadius < h + b.boundingRadius
      }
        ;
      a.prototype.autoDetectAxis = function () {
        for (var b = 0, k = 0, g = 0, h = 0, l = 0, n = 0, p = this.axisList, q = p.length, t = 1 / q, r = 0; r !== q; r++) {
          var v = p[r]
            , x = v.position.x;
          b += x;
          k += x * x;
          x = v.position.y;
          g += x;
          h += x * x;
          v = v.position.z;
          l += v;
          n += v * v
        }
        b = k - b * b * t;
        g = h - g * g * t;
        l = n - l * l * t;
        this.axisIndex = b > g ? b > l ? 0 : 2 : g > l ? 1 : 2
      }
        ;
      a.prototype.aabbQuery = function (b, k, g) {
        g = g || [];
        this.dirty && (this.sortList(),
          this.dirty = !1);
        b = this.axisList;
        for (var h = 0; h < b.length; h++) {
          var l = b[h];
          l.aabbNeedsUpdate && l.computeAABB();
          l.aabb.overlaps(k) && g.push(l)
        }
        return g
      }
    }
      , {
      "../collision/Broadphase": 5,
      "../shapes/Shape": 43
    }],
    12: [function (d, e, m) {
      function a (h, l, n) {
        n = n || {};
        var p = "undefined" !== typeof n.maxForce ? n.maxForce : 1E6
          , q = n.pivotA ? n.pivotA.clone() : new g
          , t = n.pivotB ? n.pivotB.clone() : new g;
        this.axisA = n.axisA ? n.axisA.clone() : new g;
        this.axisB = n.axisB ? n.axisB.clone() : new g;
        c.call(this, h, q, l, t, p);
        this.collideConnected = !!n.collideConnected;
        this.angle = "undefined" !== typeof n.angle ? n.angle : 0;
        q = this.coneEquation = new b(h, l, n);
        h = this.twistEquation = new k(h, l, n);
        this.twistAngle = "undefined" !== typeof n.twistAngle ? n.twistAngle : 0;
        q.maxForce = 0;
        q.minForce = -p;
        h.maxForce = 0;
        h.minForce = -p;
        this.equations.push(q, h)
      }
      e.exports = a;
      d("./Constraint");
      var c = d("./PointToPointConstraint")
        , b = d("../equations/ConeEquation")
        , k = d("../equations/RotationalEquation");
      d("../equations/ContactEquation");
      var g = d("../math/Vec3");
      a.prototype = new c;
      a.constructor = a;
      new g;
      new g;
      a.prototype.update = function () {
        var h = this.bodyA
          , l = this.bodyB
          , n = this.coneEquation
          , p = this.twistEquation;
        c.prototype.update.call(this);
        h.vectorToWorldFrame(this.axisA, n.axisA);
        l.vectorToWorldFrame(this.axisB, n.axisB);
        this.axisA.tangents(p.axisA, p.axisA);
        h.vectorToWorldFrame(p.axisA, p.axisA);
        this.axisB.tangents(p.axisB, p.axisB);
        l.vectorToWorldFrame(p.axisB, p.axisB);
        n.angle = this.angle;
        p.maxAngle = this.twistAngle
      }
    }
      , {
      "../equations/ConeEquation": 18,
      "../equations/ContactEquation": 19,
      "../equations/RotationalEquation": 22,
      "../math/Vec3": 30,
      "./Constraint": 13,
      "./PointToPointConstraint": 17
    }],
    13: [function (d, e, m) {
      function a (b, k, g) {
        g = c.defaults(g, {
          collideConnected: !0,
          wakeUpBodies: !0
        });
        this.equations = [];
        this.bodyA = b;
        this.bodyB = k;
        this.id = a.idCounter++;
        this.collideConnected = g.collideConnected;
        g.wakeUpBodies && (b && b.wakeUp(),
          k && k.wakeUp())
      }
      e.exports = a;
      var c = d("../utils/Utils");
      a.prototype.update = function () {
        throw Error("method update() not implmemented in this Constraint subclass!");
      }
        ;
      a.prototype.enable = function () {
        for (var b = this.equations, k = 0; k < b.length; k++)
          b[k].enabled = !0
      }
        ;
      a.prototype.disable = function () {
        for (var b = this.equations, k = 0; k < b.length; k++)
          b[k].enabled = !1
      }
        ;
      a.idCounter = 0
    }
      , {
      "../utils/Utils": 53
    }],
    14: [function (d, e, m) {
      function a (k, g, h, l) {
        c.call(this, k, g);
        "undefined" === typeof h && (h = k.position.distanceTo(g.position));
        "undefined" === typeof l && (l = 1E6);
        this.distance = h;
        k = this.distanceEquation = new b(k, g);
        this.equations.push(k);
        k.minForce = -l;
        k.maxForce = l
      }
      e.exports = a;
      var c = d("./Constraint")
        , b = d("../equations/ContactEquation");
      a.prototype = new c;
      a.prototype.update = function () {
        var k = this.distanceEquation
          , g = .5 * this.distance
          , h = k.ni;
        this.bodyB.position.vsub(this.bodyA.position, h);
        h.normalize();
        h.mult(g, k.ri);
        h.mult(-g, k.rj)
      }
    }
      , {
      "../equations/ContactEquation": 19,
      "./Constraint": 13
    }],
    15: [function (d, e, m) {
      function a (n, p, q) {
        q = q || {};
        var t = "undefined" !== typeof q.maxForce ? q.maxForce : 1E6
          , r = q.pivotA ? q.pivotA.clone() : new g
          , v = q.pivotB ? q.pivotB.clone() : new g;
        c.call(this, n, r, p, v, t);
        (this.axisA = q.axisA ? q.axisA.clone() : new g(1, 0, 0)).normalize();
        (this.axisB = q.axisB ? q.axisB.clone() : new g(1, 0, 0)).normalize();
        r = this.rotationalEquation1 = new b(n, p, q);
        q = this.rotationalEquation2 = new b(n, p, q);
        n = this.motorEquation = new k(n, p, t);
        n.enabled = !1;
        this.equations.push(r, q, n)
      }
      e.exports = a;
      d("./Constraint");
      var c = d("./PointToPointConstraint")
        , b = d("../equations/RotationalEquation")
        , k = d("../equations/RotationalMotorEquation");
      d("../equations/ContactEquation");
      var g = d("../math/Vec3");
      a.prototype = new c;
      a.constructor = a;
      a.prototype.enableMotor = function () {
        this.motorEquation.enabled = !0
      }
        ;
      a.prototype.disableMotor = function () {
        this.motorEquation.enabled = !1
      }
        ;
      a.prototype.setMotorSpeed = function (n) {
        this.motorEquation.targetVelocity = n
      }
        ;
      a.prototype.setMotorMaxForce = function (n) {
        this.motorEquation.maxForce = n;
        this.motorEquation.minForce = -n
      }
        ;
      var h = new g
        , l = new g;
      a.prototype.update = function () {
        var n = this.bodyA
          , p = this.bodyB
          , q = this.motorEquation
          , t = this.rotationalEquation1
          , r = this.rotationalEquation2
          , v = this.axisA
          , x = this.axisB;
        c.prototype.update.call(this);
        n.quaternion.vmult(v, h);
        p.quaternion.vmult(x, l);
        h.tangents(t.axisA, r.axisA);
        t.axisB.copy(l);
        r.axisB.copy(l);
        this.motorEquation.enabled && (n.quaternion.vmult(this.axisA, q.axisA),
          p.quaternion.vmult(this.axisB, q.axisB))
      }
    }
      , {
      "../equations/ContactEquation": 19,
      "../equations/RotationalEquation": 22,
      "../equations/RotationalMotorEquation": 23,
      "../math/Vec3": 30,
      "./Constraint": 13,
      "./PointToPointConstraint": 17
    }],
    16: [function (d, e, m) {
      function a (g, h, l) {
        l = l || {};
        var n = "undefined" !== typeof l.maxForce ? l.maxForce : 1E6
          , p = new k
          , q = new k
          , t = new k;
        g.position.vadd(h.position, t);
        t.scale(.5, t);
        h.pointToLocalFrame(t, q);
        g.pointToLocalFrame(t, p);
        c.call(this, g, p, h, q, n);
        n = this.rotationalEquation1 = new b(g, h, l);
        p = this.rotationalEquation2 = new b(g, h, l);
        g = this.rotationalEquation3 = new b(g, h, l);
        this.equations.push(n, p, g)
      }
      e.exports = a;
      d("./Constraint");
      var c = d("./PointToPointConstraint")
        , b = d("../equations/RotationalEquation");
      d("../equations/RotationalMotorEquation");
      d("../equations/ContactEquation");
      var k = d("../math/Vec3");
      a.prototype = new c;
      a.constructor = a;
      new k;
      new k;
      a.prototype.update = function () {
        var g = this.bodyA
          , h = this.bodyB
          , l = this.rotationalEquation1
          , n = this.rotationalEquation2
          , p = this.rotationalEquation3;
        c.prototype.update.call(this);
        g.vectorToWorldFrame(k.UNIT_X, l.axisA);
        h.vectorToWorldFrame(k.UNIT_Y, l.axisB);
        g.vectorToWorldFrame(k.UNIT_Y, n.axisA);
        h.vectorToWorldFrame(k.UNIT_Z, n.axisB);
        g.vectorToWorldFrame(k.UNIT_Z, p.axisA);
        h.vectorToWorldFrame(k.UNIT_X, p.axisB)
      }
    }
      , {
      "../equations/ContactEquation": 19,
      "../equations/RotationalEquation": 22,
      "../equations/RotationalMotorEquation": 23,
      "../math/Vec3": 30,
      "./Constraint": 13,
      "./PointToPointConstraint": 17
    }],
    17: [function (d, e, m) {
      function a (g, h, l, n, p) {
        c.call(this, g, l);
        p = "undefined" !== typeof p ? p : 1E6;
        this.pivotA = h ? h.clone() : new k;
        this.pivotB = n ? n.clone() : new k;
        h = this.equationX = new b(g, l);
        n = this.equationY = new b(g, l);
        g = this.equationZ = new b(g, l);
        this.equations.push(h, n, g);
        h.minForce = n.minForce = g.minForce = -p;
        h.maxForce = n.maxForce = g.maxForce = p;
        h.ni.set(1, 0, 0);
        n.ni.set(0, 1, 0);
        g.ni.set(0, 0, 1)
      }
      e.exports = a;
      var c = d("./Constraint")
        , b = d("../equations/ContactEquation")
        , k = d("../math/Vec3");
      a.prototype = new c;
      a.prototype.update = function () {
        var g = this.bodyB
          , h = this.equationX
          , l = this.equationY
          , n = this.equationZ;
        this.bodyA.quaternion.vmult(this.pivotA, h.ri);
        g.quaternion.vmult(this.pivotB, h.rj);
        l.ri.copy(h.ri);
        l.rj.copy(h.rj);
        n.ri.copy(h.ri);
        n.rj.copy(h.rj)
      }
    }
      , {
      "../equations/ContactEquation": 19,
      "../math/Vec3": 30,
      "./Constraint": 13
    }],
    18: [function (d, e, m) {
      function a (h, l, n) {
        n = n || {};
        var p = "undefined" !== typeof n.maxForce ? n.maxForce : 1E6;
        b.call(this, h, l, -p, p);
        this.axisA = n.axisA ? n.axisA.clone() : new c(1, 0, 0);
        this.axisB = n.axisB ? n.axisB.clone() : new c(0, 1, 0);
        this.angle = "undefined" !== typeof n.angle ? n.angle : 0
      }
      e.exports = a;
      var c = d("../math/Vec3");
      d("../math/Mat3");
      var b = d("./Equation");
      a.prototype = new b;
      a.prototype.constructor = a;
      var k = new c
        , g = new c;
      a.prototype.computeB = function (h) {
        var l = this.a
          , n = this.b
          , p = this.axisA
          , q = this.axisB
          , t = this.jacobianElementA
          , r = this.jacobianElementB;
        p.cross(q, k);
        q.cross(p, g);
        t.rotational.copy(g);
        r.rotational.copy(k);
        p = Math.cos(this.angle) - p.dot(q);
        q = this.computeGW();
        t = this.computeGiMf();
        return -p * l - q * n - h * t
      }
    }
      , {
      "../math/Mat3": 27,
      "../math/Vec3": 30,
      "./Equation": 20
    }],
    19: [function (d, e, m) {
      function a (r, v, x) {
        c.call(this, r, v, 0, "undefined" !== typeof x ? x : 1E6);
        this.restitution = 0;
        this.ri = new b;
        this.rj = new b;
        this.ni = new b
      }
      e.exports = a;
      var c = d("./Equation")
        , b = d("../math/Vec3");
      d("../math/Mat3");
      a.prototype = new c;
      a.prototype.constructor = a;
      var k = new b
        , g = new b
        , h = new b;
      a.prototype.computeB = function (r) {
        var v = this.a
          , x = this.b
          , E = this.bi
          , z = this.bj
          , F = this.ri
          , U = this.rj
          , Q = E.velocity
          , K = E.angularVelocity
          , Y = z.velocity
          , C = z.angularVelocity
          , H = this.jacobianElementA
          , T = this.jacobianElementB
          , M = this.ni;
        F.cross(M, k);
        U.cross(M, g);
        M.negate(H.spatial);
        k.negate(H.rotational);
        T.spatial.copy(M);
        T.rotational.copy(g);
        h.copy(z.position);
        h.vadd(U, h);
        h.vsub(E.position, h);
        h.vsub(F, h);
        E = M.dot(h);
        z = this.restitution + 1;
        Q = z * Y.dot(M) - z * Q.dot(M) + C.dot(g) - K.dot(k);
        K = this.computeGiMf();
        return -E * v - Q * x - r * K
      }
        ;
      var l = new b
        , n = new b
        , p = new b
        , q = new b
        , t = new b;
      a.prototype.getImpactVelocityAlongNormal = function () {
        this.bi.position.vadd(this.ri, p);
        this.bj.position.vadd(this.rj, q);
        this.bi.getVelocityAtWorldPoint(p, l);
        this.bj.getVelocityAtWorldPoint(q, n);
        l.vsub(n, t);
        return this.ni.dot(t)
      }
    }
      , {
      "../math/Mat3": 27,
      "../math/Vec3": 30,
      "./Equation": 20
    }],
    20: [function (d, e, m) {
      function a (q, t, r, v) {
        this.id = a.id++;
        this.minForce = "undefined" === typeof r ? -1E6 : r;
        this.maxForce = "undefined" === typeof v ? 1E6 : v;
        this.bi = q;
        this.bj = t;
        this.eps = this.b = this.a = 0;
        this.jacobianElementA = new c;
        this.jacobianElementB = new c;
        this.enabled = !0;
        this.setSpookParams(1E7, 4, 1 / 60)
      }
      e.exports = a;
      var c = d("../math/JacobianElement");
      d = d("../math/Vec3");
      a.prototype.constructor = a;
      a.id = 0;
      a.prototype.setSpookParams = function (q, t, r) {
        this.a = 4 / (r * (1 + 4 * t));
        this.b = 4 * t / (1 + 4 * t);
        this.eps = 4 / (r * r * q * (1 + 4 * t))
      }
        ;
      a.prototype.computeB = function (q, t, r) {
        var v = this.computeGW()
          , x = this.computeGq()
          , E = this.computeGiMf();
        return -x * q - v * t - E * r
      }
        ;
      a.prototype.computeGq = function () {
        var q = this.jacobianElementB
          , t = this.bj.position;
        return this.jacobianElementA.spatial.dot(this.bi.position) + q.spatial.dot(t)
      }
        ;
      var b = new d;
      a.prototype.computeGW = function () {
        var q = this.jacobianElementB
          , t = this.bi
          , r = this.bj
          , v = r.velocity;
        r = r.angularVelocity || b;
        return this.jacobianElementA.multiplyVectors(t.velocity, t.angularVelocity || b) + q.multiplyVectors(v, r)
      }
        ;
      a.prototype.computeGWlambda = function () {
        var q = this.jacobianElementB
          , t = this.bi
          , r = this.bj
          , v = r.vlambda;
        r = r.wlambda || b;
        return this.jacobianElementA.multiplyVectors(t.vlambda, t.wlambda || b) + q.multiplyVectors(v, r)
      }
        ;
      var k = new d
        , g = new d
        , h = new d
        , l = new d;
      a.prototype.computeGiMf = function () {
        var q = this.jacobianElementA
          , t = this.jacobianElementB
          , r = this.bi
          , v = this.bj
          , x = r.force
          , E = r.torque
          , z = v.force
          , F = v.torque
          , U = r.invMassSolve
          , Q = v.invMassSolve;
        r.invInertiaWorldSolve ? r.invInertiaWorldSolve.vmult(E, h) : h.set(0, 0, 0);
        v.invInertiaWorldSolve ? v.invInertiaWorldSolve.vmult(F, l) : l.set(0, 0, 0);
        x.mult(U, k);
        z.mult(Q, g);
        return q.multiplyVectors(k, h) + t.multiplyVectors(g, l)
      }
        ;
      var n = new d;
      a.prototype.computeGiMGt = function () {
        var q = this.jacobianElementA
          , t = this.jacobianElementB
          , r = this.bi
          , v = this.bj
          , x = r.invInertiaWorldSolve
          , E = v.invInertiaWorldSolve;
        r = r.invMassSolve + v.invMassSolve;
        x && (x.vmult(q.rotational, n),
          r += n.dot(q.rotational));
        E && (E.vmult(t.rotational, n),
          r += n.dot(t.rotational));
        return r
      }
        ;
      var p = new d;
      new d;
      new d;
      new d;
      new d;
      new d;
      a.prototype.addToWlambda = function (q) {
        var t = this.jacobianElementA
          , r = this.jacobianElementB
          , v = this.bi
          , x = this.bj;
        t.spatial.mult(v.invMassSolve * q, p);
        v.vlambda.vadd(p, v.vlambda);
        r.spatial.mult(x.invMassSolve * q, p);
        x.vlambda.vadd(p, x.vlambda);
        v.invInertiaWorldSolve && (v.invInertiaWorldSolve.vmult(t.rotational, p),
          p.mult(q, p),
          v.wlambda.vadd(p, v.wlambda));
        x.invInertiaWorldSolve && (x.invInertiaWorldSolve.vmult(r.rotational, p),
          p.mult(q, p),
          x.wlambda.vadd(p, x.wlambda))
      }
        ;
      a.prototype.computeC = function () {
        return this.computeGiMGt() + this.eps
      }
    }
      , {
      "../math/JacobianElement": 26,
      "../math/Vec3": 30
    }],
    21: [function (d, e, m) {
      function a (h, l, n) {
        c.call(this, h, l, -n, n);
        this.ri = new b;
        this.rj = new b;
        this.t = new b
      }
      e.exports = a;
      var c = d("./Equation")
        , b = d("../math/Vec3");
      d("../math/Mat3");
      a.prototype = new c;
      a.prototype.constructor = a;
      var k = new b
        , g = new b;
      a.prototype.computeB = function (h) {
        var l = this.b
          , n = this.rj
          , p = this.t;
        this.ri.cross(p, k);
        n.cross(p, g);
        n = this.jacobianElementA;
        var q = this.jacobianElementB;
        p.negate(n.spatial);
        k.negate(n.rotational);
        q.spatial.copy(p);
        q.rotational.copy(g);
        p = this.computeGW();
        n = this.computeGiMf();
        return -p * l - h * n
      }
    }
      , {
      "../math/Mat3": 27,
      "../math/Vec3": 30,
      "./Equation": 20
    }],
    22: [function (d, e, m) {
      function a (h, l, n) {
        n = n || {};
        var p = "undefined" !== typeof n.maxForce ? n.maxForce : 1E6;
        b.call(this, h, l, -p, p);
        this.axisA = n.axisA ? n.axisA.clone() : new c(1, 0, 0);
        this.axisB = n.axisB ? n.axisB.clone() : new c(0, 1, 0);
        this.maxAngle = Math.PI / 2
      }
      e.exports = a;
      var c = d("../math/Vec3");
      d("../math/Mat3");
      var b = d("./Equation");
      a.prototype = new b;
      a.prototype.constructor = a;
      var k = new c
        , g = new c;
      a.prototype.computeB = function (h) {
        var l = this.a
          , n = this.b
          , p = this.axisA
          , q = this.axisB
          , t = this.jacobianElementA
          , r = this.jacobianElementB;
        p.cross(q, k);
        q.cross(p, g);
        t.rotational.copy(g);
        r.rotational.copy(k);
        p = Math.cos(this.maxAngle) - p.dot(q);
        q = this.computeGW();
        t = this.computeGiMf();
        return -p * l - q * n - h * t
      }
    }
      , {
      "../math/Mat3": 27,
      "../math/Vec3": 30,
      "./Equation": 20
    }],
    23: [function (d, e, m) {
      function a (k, g, h) {
        h = "undefined" !== typeof h ? h : 1E6;
        b.call(this, k, g, -h, h);
        this.axisA = new c;
        this.axisB = new c;
        this.targetVelocity = 0
      }
      e.exports = a;
      var c = d("../math/Vec3");
      d("../math/Mat3");
      var b = d("./Equation");
      a.prototype = new b;
      a.prototype.constructor = a;
      a.prototype.computeB = function (k) {
        var g = this.b
          , h = this.axisB
          , l = this.jacobianElementB;
        this.jacobianElementA.rotational.copy(this.axisA);
        h.negate(l.rotational);
        h = this.computeGW() - this.targetVelocity;
        l = this.computeGiMf();
        return -h * g - k * l
      }
    }
      , {
      "../math/Mat3": 27,
      "../math/Vec3": 30,
      "./Equation": 20
    }],
    24: [function (d, e, m) {
      function a (b, k, g) {
        g = c.defaults(g, {
          friction: .3,
          restitution: .3,
          contactEquationStiffness: 1E7,
          contactEquationRelaxation: 3,
          frictionEquationStiffness: 1E7,
          frictionEquationRelaxation: 3
        });
        this.id = a.idCounter++;
        this.materials = [b, k];
        this.friction = g.friction;
        this.restitution = g.restitution;
        this.contactEquationStiffness = g.contactEquationStiffness;
        this.contactEquationRelaxation = g.contactEquationRelaxation;
        this.frictionEquationStiffness = g.frictionEquationStiffness;
        this.frictionEquationRelaxation = g.frictionEquationRelaxation
      }
      var c = d("../utils/Utils");
      e.exports = a;
      a.idCounter = 0
    }
      , {
      "../utils/Utils": 53
    }],
    25: [function (d, e, m) {
      function a (c) {
        var b = "";
        c = c || {};
        "string" === typeof c ? (b = c,
          c = {}) : "object" === typeof c && (b = "");
        this.name = b;
        this.id = a.idCounter++;
        this.friction = "undefined" !== typeof c.friction ? c.friction : -1;
        this.restitution = "undefined" !== typeof c.restitution ? c.restitution : -1
      }
      e.exports = a;
      a.idCounter = 0
    }
      , {}],
    26: [function (d, e, m) {
      function a () {
        this.spatial = new c;
        this.rotational = new c
      }
      e.exports = a;
      var c = d("./Vec3");
      a.prototype.multiplyElement = function (b) {
        return b.spatial.dot(this.spatial) + b.rotational.dot(this.rotational)
      }
        ;
      a.prototype.multiplyVectors = function (b, k) {
        return b.dot(this.spatial) + k.dot(this.rotational)
      }
    }
      , {
      "./Vec3": 30
    }],
    27: [function (d, e, m) {
      function a (b) {
        this.elements = b ? b : [0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      e.exports = a;
      var c = d("./Vec3");
      a.prototype.identity = function () {
        var b = this.elements;
        b[0] = 1;
        b[1] = 0;
        b[2] = 0;
        b[3] = 0;
        b[4] = 1;
        b[5] = 0;
        b[6] = 0;
        b[7] = 0;
        b[8] = 1
      }
        ;
      a.prototype.setZero = function () {
        var b = this.elements;
        b[0] = 0;
        b[1] = 0;
        b[2] = 0;
        b[3] = 0;
        b[4] = 0;
        b[5] = 0;
        b[6] = 0;
        b[7] = 0;
        b[8] = 0
      }
        ;
      a.prototype.setTrace = function (b) {
        var k = this.elements;
        k[0] = b.x;
        k[4] = b.y;
        k[8] = b.z
      }
        ;
      a.prototype.getTrace = function (b) {
        b = b || new c;
        var k = this.elements;
        b.x = k[0];
        b.y = k[4];
        b.z = k[8]
      }
        ;
      a.prototype.vmult = function (b, k) {
        k = k || new c;
        var g = this.elements
          , h = b.x
          , l = b.y
          , n = b.z;
        k.x = g[0] * h + g[1] * l + g[2] * n;
        k.y = g[3] * h + g[4] * l + g[5] * n;
        k.z = g[6] * h + g[7] * l + g[8] * n;
        return k
      }
        ;
      a.prototype.smult = function (b) {
        for (var k = 0; k < this.elements.length; k++)
          this.elements[k] *= b
      }
        ;
      a.prototype.mmult = function (b, k) {
        for (var g = k || new a, h = 0; 3 > h; h++)
          for (var l = 0; 3 > l; l++) {
            for (var n = 0, p = 0; 3 > p; p++)
              n += b.elements[h + 3 * p] * this.elements[p + 3 * l];
            g.elements[h + 3 * l] = n
          }
        return g
      }
        ;
      a.prototype.scale = function (b, k) {
        k = k || new a;
        for (var g = this.elements, h = k.elements, l = 0; 3 !== l; l++)
          h[3 * l] = b.x * g[3 * l],
            h[3 * l + 1] = b.y * g[3 * l + 1],
            h[3 * l + 2] = b.z * g[3 * l + 2];
        return k
      }
        ;
      a.prototype.solve = function (b, k) {
        k = k || new c;
        for (var g = [], h = 0; 12 > h; h++)
          g.push(0);
        var l;
        for (h = 0; 3 > h; h++)
          for (l = 0; 3 > l; l++)
            g[h + 4 * l] = this.elements[h + 3 * l];
        g[3] = b.x;
        g[7] = b.y;
        g[11] = b.z;
        var n = 3
          , p = n;
        do {
          h = p - n;
          if (0 === g[h + 4 * h])
            for (l = h + 1; l < p; l++)
              if (0 !== g[h + 4 * l]) {
                var q = 4;
                do {
                  var t = 4 - q;
                  g[t + 4 * h] += g[t + 4 * l]
                } while (--q);
                break
              }
          if (0 !== g[h + 4 * h])
            for (l = h + 1; l < p; l++) {
              var r = g[h + 4 * l] / g[h + 4 * h];
              q = 4;
              do
                t = 4 - q,
                  g[t + 4 * l] = t <= h ? 0 : g[t + 4 * l] - g[t + 4 * h] * r;
              while (--q)
            }
        } while (--n);
        k.z = g[11] / g[10];
        k.y = (g[7] - g[6] * k.z) / g[5];
        k.x = (g[3] - g[2] * k.z - g[1] * k.y) / g[0];
        if (isNaN(k.x) || isNaN(k.y) || isNaN(k.z) || Infinity === k.x || Infinity === k.y || Infinity === k.z)
          throw "Could not solve equation! Got x=[" + k.toString() + "], b=[" + b.toString() + "], A=[" + this.toString() + "]";
        return k
      }
        ;
      a.prototype.e = function (b, k, g) {
        if (void 0 === g)
          return this.elements[k + 3 * b];
        this.elements[k + 3 * b] = g
      }
        ;
      a.prototype.copy = function (b) {
        for (var k = 0; k < b.elements.length; k++)
          this.elements[k] = b.elements[k];
        return this
      }
        ;
      a.prototype.toString = function () {
        for (var b = "", k = 0; 9 > k; k++)
          b += this.elements[k] + ",";
        return b
      }
        ;
      a.prototype.reverse = function (b) {
        b = b || new a;
        for (var k = [], g = 0; 18 > g; g++)
          k.push(0);
        var h;
        for (g = 0; 3 > g; g++)
          for (h = 0; 3 > h; h++)
            k[g + 6 * h] = this.elements[g + 3 * h];
        k[3] = 1;
        k[9] = 0;
        k[15] = 0;
        k[4] = 0;
        k[10] = 1;
        k[16] = 0;
        k[5] = 0;
        k[11] = 0;
        k[17] = 1;
        var l = 3
          , n = l;
        do {
          g = n - l;
          if (0 === k[g + 6 * g])
            for (h = g + 1; h < n; h++)
              if (0 !== k[g + 6 * h]) {
                var p = 6;
                do {
                  var q = 6 - p;
                  k[q + 6 * g] += k[q + 6 * h]
                } while (--p);
                break
              }
          if (0 !== k[g + 6 * g])
            for (h = g + 1; h < n; h++) {
              var t = k[g + 6 * h] / k[g + 6 * g];
              p = 6;
              do
                q = 6 - p,
                  k[q + 6 * h] = q <= g ? 0 : k[q + 6 * h] - k[q + 6 * g] * t;
              while (--p)
            }
        } while (--l);
        g = 2;
        do {
          h = g - 1;
          do {
            t = k[g + 6 * h] / k[g + 6 * g];
            p = 6;
            do
              q = 6 - p,
                k[q + 6 * h] -= k[q + 6 * g] * t;
            while (--p)
          } while (h--)
        } while (--g);
        g = 2;
        do {
          t = 1 / k[g + 6 * g];
          p = 6;
          do
            q = 6 - p,
              k[q + 6 * g] *= t;
          while (--p)
        } while (g--);
        g = 2;
        do {
          h = 2;
          do {
            q = k[3 + h + 6 * g];
            if (isNaN(q) || Infinity === q)
              throw "Could not reverse! A=[" + this.toString() + "]";
            b.e(g, h, q)
          } while (h--)
        } while (g--);
        return b
      }
        ;
      a.prototype.setRotationFromQuaternion = function (b) {
        var k = b.x
          , g = b.y
          , h = b.z
          , l = b.w
          , n = k + k
          , p = g + g
          , q = h + h;
        b = k * n;
        var t = k * p;
        k *= q;
        var r = g * p;
        g *= q;
        h *= q;
        n *= l;
        p *= l;
        l *= q;
        q = this.elements;
        q[0] = 1 - (r + h);
        q[1] = t - l;
        q[2] = k + p;
        q[3] = t + l;
        q[4] = 1 - (b + h);
        q[5] = g - n;
        q[6] = k - p;
        q[7] = g + n;
        q[8] = 1 - (b + r);
        return this
      }
        ;
      a.prototype.transpose = function (b) {
        b = b || new a;
        for (var k = b.elements, g = this.elements, h = 0; 3 !== h; h++)
          for (var l = 0; 3 !== l; l++)
            k[3 * h + l] = g[3 * l + h];
        return b
      }
    }
      , {
      "./Vec3": 30
    }],
    28: [function (d, e, m) {
      function a (n, p, q, t) {
        this.x = void 0 !== n ? n : 0;
        this.y = void 0 !== p ? p : 0;
        this.z = void 0 !== q ? q : 0;
        this.w = void 0 !== t ? t : 1
      }
      e.exports = a;
      var c = d("./Vec3");
      a.prototype.set = function (n, p, q, t) {
        this.x = n;
        this.y = p;
        this.z = q;
        this.w = t
      }
        ;
      a.prototype.toString = function () {
        return this.x + "," + this.y + "," + this.z + "," + this.w
      }
        ;
      a.prototype.toArray = function () {
        return [this.x, this.y, this.z, this.w]
      }
        ;
      a.prototype.setFromAxisAngle = function (n, p) {
        var q = Math.sin(.5 * p);
        this.x = n.x * q;
        this.y = n.y * q;
        this.z = n.z * q;
        this.w = Math.cos(.5 * p)
      }
        ;
      a.prototype.toAxisAngle = function (n) {
        n = n || new c;
        this.normalize();
        var p = 2 * Math.acos(this.w)
          , q = Math.sqrt(1 - this.w * this.w);
        .001 > q ? (n.x = this.x,
          n.y = this.y,
          n.z = this.z) : (n.x = this.x / q,
            n.y = this.y / q,
            n.z = this.z / q);
        return [n, p]
      }
        ;
      var b = new c
        , k = new c;
      a.prototype.setFromVectors = function (n, p) {
        if (n.isAntiparallelTo(p))
          n.tangents(b, k),
            this.setFromAxisAngle(b, Math.PI);
        else {
          var q = n.cross(p);
          this.x = q.x;
          this.y = q.y;
          this.z = q.z;
          this.w = Math.sqrt(Math.pow(n.norm(), 2) * Math.pow(p.norm(), 2)) + n.dot(p);
          this.normalize()
        }
      }
        ;
      var g = new c
        , h = new c
        , l = new c;
      a.prototype.mult = function (n, p) {
        p = p || new a;
        var q = this.w;
        g.set(this.x, this.y, this.z);
        h.set(n.x, n.y, n.z);
        p.w = q * n.w - g.dot(h);
        g.cross(h, l);
        p.x = q * h.x + n.w * g.x + l.x;
        p.y = q * h.y + n.w * g.y + l.y;
        p.z = q * h.z + n.w * g.z + l.z;
        return p
      }
        ;
      a.prototype.inverse = function (n) {
        var p = this.x
          , q = this.y
          , t = this.z
          , r = this.w;
        n = n || new a;
        this.conjugate(n);
        p = 1 / (p * p + q * q + t * t + r * r);
        n.x *= p;
        n.y *= p;
        n.z *= p;
        n.w *= p;
        return n
      }
        ;
      a.prototype.conjugate = function (n) {
        n = n || new a;
        n.x = -this.x;
        n.y = -this.y;
        n.z = -this.z;
        n.w = this.w;
        return n
      }
        ;
      a.prototype.normalize = function () {
        var n = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        0 === n ? this.w = this.z = this.y = this.x = 0 : (n = 1 / n,
          this.x *= n,
          this.y *= n,
          this.z *= n,
          this.w *= n)
      }
        ;
      a.prototype.normalizeFast = function () {
        var n = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
        0 === n ? this.w = this.z = this.y = this.x = 0 : (this.x *= n,
          this.y *= n,
          this.z *= n,
          this.w *= n)
      }
        ;
      a.prototype.vmult = function (n, p) {
        p = p || new c;
        var q = n.x
          , t = n.y
          , r = n.z
          , v = this.x
          , x = this.y
          , E = this.z
          , z = this.w
          , F = z * q + x * r - E * t
          , U = z * t + E * q - v * r
          , Q = z * r + v * t - x * q;
        q = -v * q - x * t - E * r;
        p.x = F * z + q * -v + U * -E - Q * -x;
        p.y = U * z + q * -x + Q * -v - F * -E;
        p.z = Q * z + q * -E + F * -x - U * -v;
        return p
      }
        ;
      a.prototype.copy = function (n) {
        this.x = n.x;
        this.y = n.y;
        this.z = n.z;
        this.w = n.w;
        return this
      }
        ;
      a.prototype.toEuler = function (n, p) {
        p = p || "YZX";
        var q = this.x
          , t = this.y
          , r = this.z
          , v = this.w;
        switch (p) {
          case "YZX":
            var x = q * t + r * v;
            if (.499 < x) {
              var E = 2 * Math.atan2(q, v);
              var z = Math.PI / 2;
              var F = 0
            }
            -.499 > x && (E = -2 * Math.atan2(q, v),
              z = -Math.PI / 2,
              F = 0);
            isNaN(E) && (F = r * r,
              E = Math.atan2(2 * t * v - 2 * q * r, 1 - 2 * t * t - 2 * F),
              z = Math.asin(2 * x),
              F = Math.atan2(2 * q * v - 2 * t * r, 1 - 2 * q * q - 2 * F));
            break;
          default:
            throw Error("Euler order " + p + " not supported yet.");
        }
        n.y = E;
        n.z = z;
        n.x = F
      }
        ;
      a.prototype.setFromEuler = function (n, p, q, t) {
        t = t || "XYZ";
        var r = Math.cos(n / 2)
          , v = Math.cos(p / 2)
          , x = Math.cos(q / 2);
        n = Math.sin(n / 2);
        p = Math.sin(p / 2);
        q = Math.sin(q / 2);
        "XYZ" === t ? (this.x = n * v * x + r * p * q,
          this.y = r * p * x - n * v * q,
          this.z = r * v * q + n * p * x,
          this.w = r * v * x - n * p * q) : "YXZ" === t ? (this.x = n * v * x + r * p * q,
            this.y = r * p * x - n * v * q,
            this.z = r * v * q - n * p * x,
            this.w = r * v * x + n * p * q) : "ZXY" === t ? (this.x = n * v * x - r * p * q,
              this.y = r * p * x + n * v * q,
              this.z = r * v * q + n * p * x,
              this.w = r * v * x - n * p * q) : "ZYX" === t ? (this.x = n * v * x - r * p * q,
                this.y = r * p * x + n * v * q,
                this.z = r * v * q - n * p * x,
                this.w = r * v * x + n * p * q) : "YZX" === t ? (this.x = n * v * x + r * p * q,
                  this.y = r * p * x + n * v * q,
                  this.z = r * v * q - n * p * x,
                  this.w = r * v * x - n * p * q) : "XZY" === t && (this.x = n * v * x - r * p * q,
                    this.y = r * p * x - n * v * q,
                    this.z = r * v * q + n * p * x,
                    this.w = r * v * x + n * p * q);
        return this
      }
        ;
      a.prototype.clone = function () {
        return new a(this.x, this.y, this.z, this.w)
      }
    }
      , {
      "./Vec3": 30
    }],
    29: [function (d, e, m) {
      function a (g) {
        g = g || {};
        this.position = new c;
        g.position && this.position.copy(g.position);
        this.quaternion = new b;
        g.quaternion && this.quaternion.copy(g.quaternion)
      }
      var c = d("./Vec3")
        , b = d("./Quaternion");
      e.exports = a;
      var k = new b;
      a.pointToLocalFrame = function (g, h, l, n) {
        n = n || new c;
        l.vsub(g, n);
        h.conjugate(k);
        k.vmult(n, n);
        return n
      }
        ;
      a.prototype.pointToLocal = function (g, h) {
        return a.pointToLocalFrame(this.position, this.quaternion, g, h)
      }
        ;
      a.pointToWorldFrame = function (g, h, l, n) {
        n = n || new c;
        h.vmult(l, n);
        n.vadd(g, n);
        return n
      }
        ;
      a.prototype.pointToWorld = function (g, h) {
        return a.pointToWorldFrame(this.position, this.quaternion, g, h)
      }
        ;
      a.prototype.vectorToWorldFrame = function (g, h) {
        h = h || new c;
        this.quaternion.vmult(g, h);
        return h
      }
        ;
      a.vectorToWorldFrame = function (g, h, l) {
        g.vmult(h, l);
        return l
      }
        ;
      a.vectorToLocalFrame = function (g, h, l, n) {
        n = n || new c;
        h.w *= -1;
        h.vmult(l, n);
        h.w *= -1;
        return n
      }
    }
      , {
      "./Quaternion": 28,
      "./Vec3": 30
    }],
    30: [function (d, e, m) {
      function a (h, l, n) {
        this.x = h || 0;
        this.y = l || 0;
        this.z = n || 0
      }
      e.exports = a;
      var c = d("./Mat3");
      a.ZERO = new a(0, 0, 0);
      a.UNIT_X = new a(1, 0, 0);
      a.UNIT_Y = new a(0, 1, 0);
      a.UNIT_Z = new a(0, 0, 1);
      a.prototype.cross = function (h, l) {
        var n = h.x
          , p = h.y
          , q = h.z
          , t = this.x
          , r = this.y
          , v = this.z;
        l = l || new a;
        l.x = r * q - v * p;
        l.y = v * n - t * q;
        l.z = t * p - r * n;
        return l
      }
        ;
      a.prototype.set = function (h, l, n) {
        this.x = h;
        this.y = l;
        this.z = n;
        return this
      }
        ;
      a.prototype.setZero = function () {
        this.x = this.y = this.z = 0
      }
        ;
      a.prototype.vadd = function (h, l) {
        if (l)
          l.x = h.x + this.x,
            l.y = h.y + this.y,
            l.z = h.z + this.z;
        else
          return new a(this.x + h.x, this.y + h.y, this.z + h.z)
      }
        ;
      a.prototype.vsub = function (h, l) {
        if (l)
          l.x = this.x - h.x,
            l.y = this.y - h.y,
            l.z = this.z - h.z;
        else
          return new a(this.x - h.x, this.y - h.y, this.z - h.z)
      }
        ;
      a.prototype.crossmat = function () {
        return new c([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0])
      }
        ;
      a.prototype.normalize = function () {
        var h = this.x
          , l = this.y
          , n = this.z;
        h = Math.sqrt(h * h + l * l + n * n);
        0 < h ? (l = 1 / h,
          this.x *= l,
          this.y *= l,
          this.z *= l) : this.z = this.y = this.x = 0;
        return h
      }
        ;
      a.prototype.unit = function (h) {
        h = h || new a;
        var l = this.x
          , n = this.y
          , p = this.z
          , q = Math.sqrt(l * l + n * n + p * p);
        0 < q ? (q = 1 / q,
          h.x = l * q,
          h.y = n * q,
          h.z = p * q) : (h.x = 1,
            h.y = 0,
            h.z = 0);
        return h
      }
        ;
      a.prototype.norm = function () {
        var h = this.x
          , l = this.y
          , n = this.z;
        return Math.sqrt(h * h + l * l + n * n)
      }
        ;
      a.prototype.length = a.prototype.norm;
      a.prototype.norm2 = function () {
        return this.dot(this)
      }
        ;
      a.prototype.lengthSquared = a.prototype.norm2;
      a.prototype.distanceTo = function (h) {
        var l = this.x
          , n = this.y
          , p = this.z
          , q = h.x
          , t = h.y;
        h = h.z;
        return Math.sqrt((q - l) * (q - l) + (t - n) * (t - n) + (h - p) * (h - p))
      }
        ;
      a.prototype.distanceSquared = function (h) {
        var l = this.x
          , n = this.y
          , p = this.z
          , q = h.x
          , t = h.y;
        h = h.z;
        return (q - l) * (q - l) + (t - n) * (t - n) + (h - p) * (h - p)
      }
        ;
      a.prototype.mult = function (h, l) {
        l = l || new a;
        var n = this.y
          , p = this.z;
        l.x = h * this.x;
        l.y = h * n;
        l.z = h * p;
        return l
      }
        ;
      a.prototype.scale = a.prototype.mult;
      a.prototype.dot = function (h) {
        return this.x * h.x + this.y * h.y + this.z * h.z
      }
        ;
      a.prototype.isZero = function () {
        return 0 === this.x && 0 === this.y && 0 === this.z
      }
        ;
      a.prototype.negate = function (h) {
        h = h || new a;
        h.x = -this.x;
        h.y = -this.y;
        h.z = -this.z;
        return h
      }
        ;
      var b = new a
        , k = new a;
      a.prototype.tangents = function (h, l) {
        var n = this.norm();
        0 < n ? (n = 1 / n,
          b.set(this.x * n, this.y * n, this.z * n),
          .9 > Math.abs(b.x) ? k.set(1, 0, 0) : k.set(0, 1, 0),
          b.cross(k, h),
          b.cross(h, l)) : (h.set(1, 0, 0),
            l.set(0, 1, 0))
      }
        ;
      a.prototype.toString = function () {
        return this.x + "," + this.y + "," + this.z
      }
        ;
      a.prototype.toArray = function () {
        return [this.x, this.y, this.z]
      }
        ;
      a.prototype.copy = function (h) {
        this.x = h.x;
        this.y = h.y;
        this.z = h.z;
        return this
      }
        ;
      a.prototype.lerp = function (h, l, n) {
        var p = this.x
          , q = this.y
          , t = this.z;
        n.x = p + (h.x - p) * l;
        n.y = q + (h.y - q) * l;
        n.z = t + (h.z - t) * l
      }
        ;
      a.prototype.almostEquals = function (h, l) {
        void 0 === l && (l = 1E-6);
        return Math.abs(this.x - h.x) > l || Math.abs(this.y - h.y) > l || Math.abs(this.z - h.z) > l ? !1 : !0
      }
        ;
      a.prototype.almostZero = function (h) {
        void 0 === h && (h = 1E-6);
        return Math.abs(this.x) > h || Math.abs(this.y) > h || Math.abs(this.z) > h ? !1 : !0
      }
        ;
      var g = new a;
      a.prototype.isAntiparallelTo = function (h, l) {
        this.negate(g);
        return g.almostEquals(h, l)
      }
        ;
      a.prototype.clone = function () {
        return new a(this.x, this.y, this.z)
      }
    }
      , {
      "./Mat3": 27
    }],
    31: [function (d, e, m) {
      function a (H) {
        H = H || {};
        c.apply(this);
        this.id = a.idCounter++;
        this.postStep = this.preStep = this.world = null;
        this.vlambda = new b;
        this.collisionFilterGroup = "number" === typeof H.collisionFilterGroup ? H.collisionFilterGroup : 1;
        this.collisionFilterMask = "number" === typeof H.collisionFilterMask ? H.collisionFilterMask : 1;
        this.collisionResponse = !0;
        this.position = new b;
        H.position && this.position.copy(H.position);
        this.previousPosition = new b;
        this.initPosition = new b;
        this.velocity = new b;
        H.velocity && this.velocity.copy(H.velocity);
        this.initVelocity = new b;
        this.force = new b;
        var T = "number" === typeof H.mass ? H.mass : 0;
        this.mass = T;
        this.invMass = 0 < T ? 1 / T : 0;
        this.material = H.material || null;
        this.linearDamping = "number" === typeof H.linearDamping ? H.linearDamping : .01;
        this.type = 0 >= T ? a.STATIC : a.DYNAMIC;
        typeof H.type === typeof a.STATIC && (this.type = H.type);
        this.allowSleep = "undefined" !== typeof H.allowSleep ? H.allowSleep : !0;
        this.sleepState = 0;
        this.sleepSpeedLimit = "undefined" !== typeof H.sleepSpeedLimit ? H.sleepSpeedLimit : .1;
        this.sleepTimeLimit = "undefined" !== typeof H.sleepTimeLimit ? H.sleepTimeLimit : 1;
        this.timeLastSleepy = 0;
        this._wakeUpAfterNarrowphase = !1;
        this.torque = new b;
        this.quaternion = new g;
        H.quaternion && this.quaternion.copy(H.quaternion);
        this.initQuaternion = new g;
        this.angularVelocity = new b;
        H.angularVelocity && this.angularVelocity.copy(H.angularVelocity);
        this.initAngularVelocity = new b;
        this.interpolatedPosition = new b;
        this.interpolatedQuaternion = new g;
        this.shapes = [];
        this.shapeOffsets = [];
        this.shapeOrientations = [];
        this.inertia = new b;
        this.invInertia = new b;
        this.invInertiaWorld = new k;
        this.invMassSolve = 0;
        this.invInertiaSolve = new b;
        this.invInertiaWorldSolve = new k;
        this.fixedRotation = "undefined" !== typeof H.fixedRotation ? H.fixedRotation : !1;
        this.angularDamping = "undefined" !== typeof H.angularDamping ? H.angularDamping : .01;
        this.userData = "undefined" !== typeof H.userData ? H.userData : null;
        this.aabb = new h;
        this.aabbNeedsUpdate = !0;
        this.wlambda = new b;
        H.shape && this.addShape(H.shape);
        this.updateMassProperties()
      }
      e.exports = a;
      var c = d("../utils/EventTarget");
      d("../shapes/Shape");
      var b = d("../math/Vec3")
        , k = d("../math/Mat3")
        , g = d("../math/Quaternion");
      d("../material/Material");
      var h = d("../collision/AABB")
        , l = d("../shapes/Box");
      a.prototype = new c;
      a.prototype.constructor = a;
      a.DYNAMIC = 1;
      a.STATIC = 2;
      a.KINEMATIC = 4;
      a.AWAKE = 0;
      a.SLEEPY = 1;
      a.SLEEPING = 2;
      a.idCounter = 0;
      a.prototype.wakeUp = function () {
        var H = this.sleepState;
        this.sleepState = 0;
        H === a.SLEEPING && this.dispatchEvent({
          type: "wakeup"
        })
      }
        ;
      a.prototype.sleep = function () {
        this.sleepState = a.SLEEPING;
        this.velocity.set(0, 0, 0);
        this.angularVelocity.set(0, 0, 0)
      }
        ;
      a.sleepyEvent = {
        type: "sleepy"
      };
      a.sleepEvent = {
        type: "sleep"
      };
      a.prototype.sleepTick = function (H) {
        if (this.allowSleep) {
          var T = this.sleepState
            , M = this.velocity.norm2() + this.angularVelocity.norm2()
            , ca = Math.pow(this.sleepSpeedLimit, 2);
          T === a.AWAKE && M < ca ? (this.sleepState = a.SLEEPY,
            this.timeLastSleepy = H,
            this.dispatchEvent(a.sleepyEvent)) : T === a.SLEEPY && M > ca ? this.wakeUp() : T === a.SLEEPY && H - this.timeLastSleepy > this.sleepTimeLimit && (this.sleep(),
              this.dispatchEvent(a.sleepEvent))
        }
      }
        ;
      a.prototype.updateSolveMassProperties = function () {
        this.sleepState === a.SLEEPING || this.type === a.KINEMATIC ? (this.invMassSolve = 0,
          this.invInertiaSolve.setZero(),
          this.invInertiaWorldSolve.setZero()) : (this.invMassSolve = this.invMass,
            this.invInertiaSolve.copy(this.invInertia),
            this.invInertiaWorldSolve.copy(this.invInertiaWorld))
      }
        ;
      a.prototype.pointToLocalFrame = function (H, T) {
        T = T || new b;
        H.vsub(this.position, T);
        this.quaternion.conjugate().vmult(T, T);
        return T
      }
        ;
      a.prototype.vectorToLocalFrame = function (H, T) {
        T = T || new b;
        this.quaternion.conjugate().vmult(H, T);
        return T
      }
        ;
      a.prototype.pointToWorldFrame = function (H, T) {
        T = T || new b;
        this.quaternion.vmult(H, T);
        T.vadd(this.position, T);
        return T
      }
        ;
      a.prototype.vectorToWorldFrame = function (H, T) {
        T = T || new b;
        this.quaternion.vmult(H, T);
        return T
      }
        ;
      var n = new b
        , p = new g;
      a.prototype.addShape = function (H, T, M) {
        var ca = new b
          , P = new g;
        T && ca.copy(T);
        M && P.copy(M);
        this.shapes.push(H);
        this.shapeOffsets.push(ca);
        this.shapeOrientations.push(P);
        this.updateMassProperties();
        this.updateBoundingRadius();
        this.aabbNeedsUpdate = !0;
        return this
      }
        ;
      a.prototype.updateBoundingRadius = function () {
        for (var H = this.shapes, T = this.shapeOffsets, M = H.length, ca = 0, P = 0; P !== M; P++) {
          var X = H[P];
          X.updateBoundingSphereRadius();
          var L = T[P].norm();
          X = X.boundingSphereRadius;
          L + X > ca && (ca = L + X)
        }
        this.boundingRadius = ca
      }
        ;
      var q = new h;
      a.prototype.computeAABB = function () {
        for (var H = this.shapes, T = this.shapeOffsets, M = this.shapeOrientations, ca = H.length, P = this.quaternion, X = this.aabb, L = 0; L !== ca; L++) {
          var A = H[L];
          M[L].mult(P, p);
          p.vmult(T[L], n);
          n.vadd(this.position, n);
          A.calculateWorldAABB(n, p, q.lowerBound, q.upperBound);
          0 === L ? X.copy(q) : X.extend(q)
        }
        this.aabbNeedsUpdate = !1
      }
        ;
      var t = new k
        , r = new k;
      new k;
      a.prototype.updateInertiaWorld = function (H) {
        var T = this.invInertia;
        if (T.x !== T.y || T.y !== T.z || H)
          t.setRotationFromQuaternion(this.quaternion),
            t.transpose(r),
            t.scale(T, t),
            t.mmult(r, this.invInertiaWorld)
      }
        ;
      var v = new b
        , x = new b;
      a.prototype.applyForce = function (H, T) {
        this.type === a.DYNAMIC && (T.vsub(this.position, v),
          v.cross(H, x),
          this.force.vadd(H, this.force),
          this.torque.vadd(x, this.torque))
      }
        ;
      var E = new b
        , z = new b;
      a.prototype.applyLocalForce = function (H, T) {
        this.type === a.DYNAMIC && (this.vectorToWorldFrame(H, E),
          this.pointToWorldFrame(T, z),
          this.applyForce(E, z))
      }
        ;
      var F = new b
        , U = new b
        , Q = new b;
      a.prototype.applyImpulse = function (H, T) {
        this.type === a.DYNAMIC && (T.vsub(this.position, F),
          U.copy(H),
          U.mult(this.invMass, U),
          this.velocity.vadd(U, this.velocity),
          F.cross(H, Q),
          this.invInertiaWorld.vmult(Q, Q),
          this.angularVelocity.vadd(Q, this.angularVelocity))
      }
        ;
      var K = new b
        , Y = new b;
      a.prototype.applyLocalImpulse = function (H, T) {
        this.type === a.DYNAMIC && (this.vectorToWorldFrame(H, K),
          this.pointToWorldFrame(T, Y),
          this.applyImpulse(K, Y))
      }
        ;
      var C = new b;
      a.prototype.updateMassProperties = function () {
        this.invMass = 0 < this.mass ? 1 / this.mass : 0;
        var H = this.inertia
          , T = this.fixedRotation;
        this.computeAABB();
        C.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2);
        l.calculateInertia(C, this.mass, H);
        this.invInertia.set(0 < H.x && !T ? 1 / H.x : 0, 0 < H.y && !T ? 1 / H.y : 0, 0 < H.z && !T ? 1 / H.z : 0);
        this.updateInertiaWorld(!0)
      }
        ;
      a.prototype.getVelocityAtWorldPoint = function (H, T) {
        var M = new b;
        H.vsub(this.position, M);
        this.angularVelocity.cross(M, T);
        this.velocity.vadd(T, T);
        return T
      }
    }
      , {
      "../collision/AABB": 3,
      "../material/Material": 25,
      "../math/Mat3": 27,
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "../shapes/Box": 37,
      "../shapes/Shape": 43,
      "../utils/EventTarget": 49
    }],
    32: [function (d, e, m) {
      function a (M) {
        this.chassisBody = M.chassisBody;
        this.wheelInfos = [];
        this.sliding = !1;
        this.world = null;
        this.indexRightAxis = "undefined" !== typeof M.indexRightAxis ? M.indexRightAxis : 1;
        this.indexForwardAxis = "undefined" !== typeof M.indexForwardAxis ? M.indexForwardAxis : 0;
        this.indexUpAxis = "undefined" !== typeof M.indexUpAxis ? M.indexUpAxis : 2
      }
      function c (M, ca, P) {
        var X = U
          , L = Q
          , A = K
          , B = Y;
        ca.vsub(M.position, X);
        X.cross(P, L);
        M.invInertiaWorld.vmult(L, B);
        B.cross(X, A);
        return M.invMass + P.dot(A)
      }
      d("./Body");
      var b = d("../math/Vec3")
        , k = d("../math/Quaternion");
      d("../collision/RaycastResult");
      m = d("../collision/Ray");
      var g = d("../objects/WheelInfo");
      e.exports = a;
      new b;
      new b;
      new b;
      var h = new b
        , l = new b
        , n = new b;
      new m;
      a.prototype.addWheel = function (M) {
        M = M || {};
        M = new g(M);
        var ca = this.wheelInfos.length;
        this.wheelInfos.push(M);
        return ca
      }
        ;
      a.prototype.setSteeringValue = function (M, ca) {
        this.wheelInfos[ca].steering = M
      }
        ;
      new b;
      a.prototype.applyEngineForce = function (M, ca) {
        this.wheelInfos[ca].engineForce = M
      }
        ;
      a.prototype.setBrake = function (M, ca) {
        this.wheelInfos[ca].brake = M
      }
        ;
      a.prototype.addToWorld = function (M) {
        M.add(this.chassisBody);
        var ca = this;
        this.preStepCallback = function () {
          ca.updateVehicle(M.dt)
        }
          ;
        M.addEventListener("preStep", this.preStepCallback);
        this.world = M
      }
        ;
      a.prototype.getVehicleAxisWorld = function (M, ca) {
        ca.set(0 === M ? 1 : 0, 1 === M ? 1 : 0, 2 === M ? 1 : 0);
        this.chassisBody.vectorToWorldFrame(ca, ca)
      }
        ;
      a.prototype.updateVehicle = function (M) {
        for (var ca = this.wheelInfos, P = ca.length, X = this.chassisBody, L = 0; L < P; L++)
          this.updateWheelTransform(L);
        this.currentVehicleSpeedKmHour = 3.6 * X.velocity.norm();
        L = new b;
        this.getVehicleAxisWorld(this.indexForwardAxis, L);
        0 > L.dot(X.velocity) && (this.currentVehicleSpeedKmHour *= -1);
        for (L = 0; L < P; L++)
          this.castRay(ca[L]);
        this.updateSuspension(M);
        var A = new b
          , B = new b;
        for (L = 0; L < P; L++) {
          var y = ca[L]
            , u = y.suspensionForce;
          u > y.maxSuspensionForce && (u = y.maxSuspensionForce);
          y.raycastResult.hitNormalWorld.scale(u * M, A);
          y.raycastResult.hitPointWorld.vsub(X.position, B);
          X.applyImpulse(A, y.raycastResult.hitPointWorld)
        }
        this.updateFriction(M);
        A = new b;
        B = new b;
        u = new b;
        for (L = 0; L < P; L++) {
          y = ca[L];
          X.getVelocityAtWorldPoint(y.chassisConnectionPointWorld, u);
          var w = 1;
          switch (this.indexUpAxis) {
            case 1:
              w = -1
          }
          if (y.isInContact) {
            this.getVehicleAxisWorld(this.indexForwardAxis, B);
            var D = B.dot(y.raycastResult.hitNormalWorld);
            y.raycastResult.hitNormalWorld.scale(D, A);
            B.vsub(A, B);
            D = B.dot(u);
            y.deltaRotation = w * D * M / y.radius
          }
          !y.sliding && y.isInContact || 0 === y.engineForce || !y.useCustomSlidingRotationalSpeed || (y.deltaRotation = (0 < y.engineForce ? 1 : -1) * y.customSlidingRotationalSpeed * M);
          Math.abs(y.brake) > Math.abs(y.engineForce) && (y.deltaRotation = 0);
          y.rotation += y.deltaRotation;
          y.deltaRotation *= .99
        }
      }
        ;
      a.prototype.updateSuspension = function (M) {
        M = this.chassisBody.mass;
        for (var ca = this.wheelInfos, P = ca.length, X = 0; X < P; X++) {
          var L = ca[X];
          if (L.isInContact) {
            var A = L.suspensionStiffness * (L.suspensionRestLength - L.suspensionLength) * L.clippedInvContactDotSuspension;
            var B = L.suspensionRelativeVelocity;
            A -= (0 > B ? L.dampingCompression : L.dampingRelaxation) * B;
            L.suspensionForce = A * M;
            0 > L.suspensionForce && (L.suspensionForce = 0)
          } else
            L.suspensionForce = 0
        }
      }
        ;
      a.prototype.removeFromWorld = function (M) {
        M.remove(this.chassisBody);
        M.removeEventListener("preStep", this.preStepCallback);
        this.world = null
      }
        ;
      var p = new b
        , q = new b;
      a.prototype.castRay = function (M) {
        this.updateWheelTransformWorld(M);
        var ca = this.chassisBody
          , P = -1;
        M.directionWorld.scale(M.suspensionRestLength + M.radius, p);
        var X = M.chassisConnectionPointWorld;
        X.vadd(p, q);
        var L = M.raycastResult;
        L.reset();
        var A = ca.collisionResponse;
        ca.collisionResponse = !1;
        this.world.rayTest(X, q, L);
        ca.collisionResponse = A;
        X = L.body;
        M.raycastResult.groundObject = 0;
        X ? (P = L.distance,
          M.raycastResult.hitNormalWorld = L.hitNormalWorld,
          M.isInContact = !0,
          M.suspensionLength = L.distance - M.radius,
          L = M.suspensionRestLength - M.maxSuspensionTravel,
          X = M.suspensionRestLength + M.maxSuspensionTravel,
          M.suspensionLength < L && (M.suspensionLength = L),
          M.suspensionLength > X && (M.suspensionLength = X,
            M.raycastResult.reset()),
          L = M.raycastResult.hitNormalWorld.dot(M.directionWorld),
          X = new b,
          ca.getVelocityAtWorldPoint(M.raycastResult.hitPointWorld, X),
          ca = M.raycastResult.hitNormalWorld.dot(X),
          -.1 <= L ? (M.suspensionRelativeVelocity = 0,
            M.clippedInvContactDotSuspension = 10) : (L = -1 / L,
              M.suspensionRelativeVelocity = ca * L,
              M.clippedInvContactDotSuspension = L)) : (M.suspensionLength = M.suspensionRestLength + 0 * M.maxSuspensionTravel,
                M.suspensionRelativeVelocity = 0,
                M.directionWorld.scale(-1, M.raycastResult.hitNormalWorld),
                M.clippedInvContactDotSuspension = 1);
        return P
      }
        ;
      a.prototype.updateWheelTransformWorld = function (M) {
        M.isInContact = !1;
        var ca = this.chassisBody;
        ca.pointToWorldFrame(M.chassisConnectionPointLocal, M.chassisConnectionPointWorld);
        ca.vectorToWorldFrame(M.directionLocal, M.directionWorld);
        ca.vectorToWorldFrame(M.axleLocal, M.axleWorld)
      }
        ;
      a.prototype.updateWheelTransform = function (M) {
        M = this.wheelInfos[M];
        this.updateWheelTransformWorld(M);
        M.directionLocal.scale(-1, h);
        l.copy(M.axleLocal);
        h.cross(l, n);
        n.normalize();
        l.normalize();
        var ca = M.steering
          , P = new k;
        P.setFromAxisAngle(h, ca);
        ca = new k;
        ca.setFromAxisAngle(l, M.rotation);
        var X = M.worldTransform.quaternion;
        this.chassisBody.quaternion.mult(P, X);
        X.mult(ca, X);
        X.normalize();
        P = M.worldTransform.position;
        P.copy(M.directionWorld);
        P.scale(M.suspensionLength, P);
        P.vadd(M.chassisConnectionPointWorld, P)
      }
        ;
      var t = [new b(1, 0, 0), new b(0, 1, 0), new b(0, 0, 1)];
      a.prototype.getWheelTransformWorld = function (M) {
        return this.wheelInfos[M].worldTransform
      }
        ;
      var r = new b
        , v = []
        , x = [];
      a.prototype.updateFriction = function (M) {
        for (var ca = this.wheelInfos, P = ca.length, X = this.chassisBody, L = 0, A = 0; A < P; A++) {
          var B = ca[A]
            , y = B.raycastResult.body;
          y && L++;
          B.sideImpulse = 0;
          B.forwardImpulse = 0;
          x[A] || (x[A] = new b);
          v[A] || (v[A] = new b)
        }
        for (A = 0; A < P; A++)
          if (B = ca[A],
            y = B.raycastResult.body) {
            var u = v[A];
            this.getWheelTransformWorld(A).vectorToWorldFrame(t[this.indexRightAxis], u);
            L = B.raycastResult.hitNormalWorld;
            var w = u.dot(L);
            L.scale(w, r);
            u.vsub(r, u);
            u.normalize();
            L.cross(u, x[A]);
            x[A].normalize();
            L = B;
            w = X;
            var D = B.raycastResult.hitPointWorld
              , O = B.raycastResult.hitPointWorld;
            if (1.1 < u.norm2())
              y = 0;
            else {
              var J = C
                , G = H
                , S = T;
              w.getVelocityAtWorldPoint(D, J);
              y.getVelocityAtWorldPoint(O, G);
              J.vsub(G, S);
              y = -.2 * u.dot(S) * (1 / (w.invMass + y.invMass))
            }
            L.sideImpulse = y;
            B.sideImpulse *= 1
          }
        this.sliding = !1;
        for (A = 0; A < P; A++) {
          B = ca[A];
          y = B.raycastResult.body;
          w = 0;
          B.slipInfo = 1;
          if (y) {
            L = B.brake ? B.brake : 0;
            J = X;
            D = y;
            O = B.raycastResult.hitPointWorld;
            u = x[A];
            w = L;
            G = O;
            S = E;
            var ba = z
              , I = F;
            J.getVelocityAtWorldPoint(G, S);
            D.getVelocityAtWorldPoint(G, ba);
            S.vsub(ba, I);
            G = u.dot(I);
            J = c(J, O, u);
            D = c(D, O, u);
            D = 1 / (J + D) * -G;
            w < D && (D = w);
            D < -w && (D = -w);
            w = D;
            w += B.engineForce * M;
            L /= w;
            B.slipInfo *= L
          }
          B.forwardImpulse = 0;
          B.skidInfo = 1;
          y && (B.skidInfo = 1,
            y = B.suspensionForce * M * B.frictionSlip,
            L = y * y,
            B.forwardImpulse = w,
            w = .5 * B.forwardImpulse,
            D = 1 * B.sideImpulse,
            w = w * w + D * D,
            B.sliding = !1,
            w > L && (this.sliding = !0,
              B.sliding = !0,
              L = y / Math.sqrt(w),
              B.skidInfo *= L))
        }
        if (this.sliding)
          for (A = 0; A < P; A++)
            B = ca[A],
              0 !== B.sideImpulse && 1 > B.skidInfo && (B.forwardImpulse *= B.skidInfo,
                B.sideImpulse *= B.skidInfo);
        for (A = 0; A < P; A++)
          B = ca[A],
            M = new b,
            M.copy(B.raycastResult.hitPointWorld),
            0 !== B.forwardImpulse && (y = new b,
              x[A].scale(B.forwardImpulse, y),
              X.applyImpulse(y, M)),
            0 !== B.sideImpulse && (y = B.raycastResult.body,
              L = new b,
              L.copy(B.raycastResult.hitPointWorld),
              w = new b,
              v[A].scale(B.sideImpulse, w),
              X.pointToLocalFrame(M, M),
              M["xyz"[this.indexUpAxis]] *= B.rollInfluence,
              X.pointToWorldFrame(M, M),
              X.applyImpulse(w, M),
              w.scale(-1, w),
              y.applyImpulse(w, L))
      }
        ;
      var E = new b
        , z = new b
        , F = new b
        , U = new b
        , Q = new b
        , K = new b
        , Y = new b
        , C = new b
        , H = new b
        , T = new b
    }
      , {
      "../collision/Ray": 9,
      "../collision/RaycastResult": 10,
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "../objects/WheelInfo": 36,
      "./Body": 31
    }],
    33: [function (d, e, m) {
      function a (p) {
        this.wheelBodies = [];
        this.coordinateSystem = "undefined" === typeof p.coordinateSystem ? new g(1, 2, 3) : p.coordinateSystem.clone();
        this.chassisBody = p.chassisBody;
        this.chassisBody || (p = new k(new g(5, 2, .5)),
          this.chassisBody = new c(1, p));
        this.constraints = [];
        this.wheelAxes = [];
        this.wheelForces = []
      }
      var c = d("./Body")
        , b = d("../shapes/Sphere")
        , k = d("../shapes/Box")
        , g = d("../math/Vec3")
        , h = d("../constraints/HingeConstraint");
      e.exports = a;
      a.prototype.addWheel = function (p) {
        p = p || {};
        var q = p.body;
        q || (q = new c(1, new b(1.2)));
        this.wheelBodies.push(q);
        this.wheelForces.push(0);
        new g;
        var t = "undefined" !== typeof p.position ? p.position.clone() : new g
          , r = new g;
        this.chassisBody.pointToWorldFrame(t, r);
        q.position.set(r.x, r.y, r.z);
        p = "undefined" !== typeof p.axis ? p.axis.clone() : new g(0, 1, 0);
        this.wheelAxes.push(p);
        q = new h(this.chassisBody, q, {
          pivotA: t,
          axisA: p,
          pivotB: g.ZERO,
          axisB: p,
          collideConnected: !1
        });
        this.constraints.push(q);
        return this.wheelBodies.length - 1
      }
        ;
      a.prototype.setSteeringValue = function (p, q) {
        var t = this.wheelAxes[q]
          , r = Math.cos(p)
          , v = Math.sin(p)
          , x = t.x;
        t = t.y;
        this.constraints[q].axisA.set(r * x - v * t, v * x + r * t, 0)
      }
        ;
      a.prototype.setMotorSpeed = function (p, q) {
        var t = this.constraints[q];
        t.enableMotor();
        t.motorTargetVelocity = p
      }
        ;
      a.prototype.disableMotor = function (p) {
        this.constraints[p].disableMotor()
      }
        ;
      var l = new g;
      a.prototype.setWheelForce = function (p, q) {
        this.wheelForces[q] = p
      }
        ;
      a.prototype.applyWheelForce = function (p, q) {
        var t = this.wheelBodies[q]
          , r = t.torque;
        this.wheelAxes[q].scale(p, l);
        t.vectorToWorldFrame(l, l);
        r.vadd(l, r)
      }
        ;
      a.prototype.addToWorld = function (p) {
        for (var q = this.constraints, t = this.wheelBodies.concat([this.chassisBody]), r = 0; r < t.length; r++)
          p.add(t[r]);
        for (r = 0; r < q.length; r++)
          p.addConstraint(q[r]);
        p.addEventListener("preStep", this._update.bind(this))
      }
        ;
      a.prototype._update = function () {
        for (var p = this.wheelForces, q = 0; q < p.length; q++)
          this.applyWheelForce(p[q], q)
      }
        ;
      a.prototype.removeFromWorld = function (p) {
        for (var q = this.constraints, t = this.wheelBodies.concat([this.chassisBody]), r = 0; r < t.length; r++)
          p.remove(t[r]);
        for (r = 0; r < q.length; r++)
          p.removeConstraint(q[r])
      }
        ;
      var n = new g;
      a.prototype.getWheelSpeed = function (p) {
        var q = this.wheelBodies[p].angularVelocity;
        this.chassisBody.vectorToWorldFrame(this.wheelAxes[p], n);
        return q.dot(n)
      }
    }
      , {
      "../constraints/HingeConstraint": 15,
      "../math/Vec3": 30,
      "../shapes/Box": 37,
      "../shapes/Sphere": 44,
      "./Body": 31
    }],
    34: [function (d, e, m) {
      function a () {
        this.particles = [];
        this.speedOfSound = this.smoothingRadius = this.density = 1;
        this.viscosity = .01;
        this.eps = 1E-6;
        this.pressures = [];
        this.densities = [];
        this.neighbors = []
      }
      e.exports = a;
      d("../shapes/Shape");
      e = d("../math/Vec3");
      d("../math/Quaternion");
      d("../shapes/Particle");
      d("../objects/Body");
      d("../material/Material");
      a.prototype.add = function (p) {
        this.particles.push(p);
        this.neighbors.length < this.particles.length && this.neighbors.push([])
      }
        ;
      a.prototype.remove = function (p) {
        p = this.particles.indexOf(p);
        -1 !== p && (this.particles.splice(p, 1),
          this.neighbors.length > this.particles.length && this.neighbors.pop())
      }
        ;
      var c = new e;
      a.prototype.getNeighbors = function (p, q) {
        for (var t = this.particles.length, r = p.id, v = this.smoothingRadius * this.smoothingRadius, x = 0; x !== t; x++) {
          var E = this.particles[x];
          E.position.vsub(p.position, c);
          r !== E.id && c.norm2() < v && q.push(E)
        }
      }
        ;
      var b = new e
        , k = new e
        , g = new e
        , h = new e
        , l = new e
        , n = new e;
      a.prototype.update = function () {
        for (var p = this.particles.length, q = this.speedOfSound, t = this.eps, r = 0; r !== p; r++) {
          var v = this.particles[r]
            , x = this.neighbors[r];
          x.length = 0;
          this.getNeighbors(v, x);
          x.push(this.particles[r]);
          for (var E = x.length, z = 0, F = 0; F !== E; F++) {
            v.position.vsub(x[F].position, b);
            var U = b.norm();
            U = this.w(U);
            z += x[F].mass * U
          }
          this.densities[r] = z;
          this.pressures[r] = q * q * (this.densities[r] - this.density)
        }
        for (r = 0; r !== p; r++) {
          q = this.particles[r];
          k.set(0, 0, 0);
          g.set(0, 0, 0);
          x = this.neighbors[r];
          E = x.length;
          for (F = 0; F !== E; F++)
            z = x[F],
              q.position.vsub(z.position, l),
              U = l.norm(),
              v = -z.mass * (this.pressures[r] / (this.densities[r] * this.densities[r] + t) + this.pressures[F] / (this.densities[F] * this.densities[F] + t)),
              this.gradw(l, h),
              h.mult(v, h),
              k.vadd(h, k),
              z.velocity.vsub(q.velocity, n),
              n.mult(1 / (1E-4 + this.densities[r] * this.densities[F]) * this.viscosity * z.mass, n),
              v = this.nablaw(U),
              n.mult(v, n),
              g.vadd(n, g);
          g.mult(q.mass, g);
          k.mult(q.mass, k);
          q.force.vadd(g, q.force);
          q.force.vadd(k, q.force)
        }
      }
        ;
      a.prototype.w = function (p) {
        var q = this.smoothingRadius;
        return 315 / (64 * Math.PI * Math.pow(q, 9)) * Math.pow(q * q - p * p, 3)
      }
        ;
      a.prototype.gradw = function (p, q) {
        var t = p.norm()
          , r = this.smoothingRadius;
        p.mult(945 / (32 * Math.PI * Math.pow(r, 9)) * Math.pow(r * r - t * t, 2), q)
      }
        ;
      a.prototype.nablaw = function (p) {
        var q = this.smoothingRadius;
        return 945 / (32 * Math.PI * Math.pow(q, 9)) * (q * q - p * p) * (7 * p * p - 3 * q * q)
      }
    }
      , {
      "../material/Material": 25,
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "../objects/Body": 31,
      "../shapes/Particle": 41,
      "../shapes/Shape": 43
    }],
    35: [function (d, e, m) {
      function a (x, E, z) {
        z = z || {};
        this.restLength = "number" === typeof z.restLength ? z.restLength : 1;
        this.stiffness = z.stiffness || 100;
        this.damping = z.damping || 1;
        this.bodyA = x;
        this.bodyB = E;
        this.localAnchorA = new c;
        this.localAnchorB = new c;
        z.localAnchorA && this.localAnchorA.copy(z.localAnchorA);
        z.localAnchorB && this.localAnchorB.copy(z.localAnchorB);
        z.worldAnchorA && this.setWorldAnchorA(z.worldAnchorA);
        z.worldAnchorB && this.setWorldAnchorB(z.worldAnchorB)
      }
      var c = d("../math/Vec3");
      e.exports = a;
      a.prototype.setWorldAnchorA = function (x) {
        this.bodyA.pointToLocalFrame(x, this.localAnchorA)
      }
        ;
      a.prototype.setWorldAnchorB = function (x) {
        this.bodyB.pointToLocalFrame(x, this.localAnchorB)
      }
        ;
      a.prototype.getWorldAnchorA = function (x) {
        this.bodyA.pointToWorldFrame(this.localAnchorA, x)
      }
        ;
      a.prototype.getWorldAnchorB = function (x) {
        this.bodyB.pointToWorldFrame(this.localAnchorB, x)
      }
        ;
      var b = new c
        , k = new c
        , g = new c
        , h = new c
        , l = new c
        , n = new c
        , p = new c
        , q = new c
        , t = new c
        , r = new c
        , v = new c;
      a.prototype.applyForce = function () {
        var x = this.stiffness
          , E = this.damping
          , z = this.restLength
          , F = this.bodyA
          , U = this.bodyB;
        this.getWorldAnchorA(l);
        this.getWorldAnchorB(n);
        l.vsub(F.position, p);
        n.vsub(U.position, q);
        n.vsub(l, b);
        var Q = b.norm();
        k.copy(b);
        k.normalize();
        U.velocity.vsub(F.velocity, g);
        U.angularVelocity.cross(q, v);
        g.vadd(v, g);
        F.angularVelocity.cross(p, v);
        g.vsub(v, g);
        k.mult(-x * (Q - z) - E * g.dot(k), h);
        F.force.vsub(h, F.force);
        U.force.vadd(h, U.force);
        p.cross(h, t);
        q.cross(h, r);
        F.torque.vsub(t, F.torque);
        U.torque.vadd(r, U.torque)
      }
    }
      , {
      "../math/Vec3": 30
    }],
    36: [function (d, e, m) {
      function a (n) {
        n = g.defaults(n, {
          chassisConnectionPointLocal: new c,
          chassisConnectionPointWorld: new c,
          directionLocal: new c,
          directionWorld: new c,
          axleLocal: new c,
          axleWorld: new c,
          suspensionRestLength: 1,
          suspensionMaxLength: 2,
          radius: 1,
          suspensionStiffness: 100,
          dampingCompression: 10,
          dampingRelaxation: 10,
          frictionSlip: 1E4,
          steering: 0,
          rotation: 0,
          deltaRotation: 0,
          rollInfluence: .01,
          maxSuspensionForce: Number.MAX_VALUE,
          isFrontWheel: !0,
          clippedInvContactDotSuspension: 1,
          suspensionRelativeVelocity: 0,
          suspensionForce: 0,
          skidInfo: 0,
          suspensionLength: 0,
          maxSuspensionTravel: 1,
          useCustomSlidingRotationalSpeed: !1,
          customSlidingRotationalSpeed: -.1
        });
        this.maxSuspensionTravel = n.maxSuspensionTravel;
        this.customSlidingRotationalSpeed = n.customSlidingRotationalSpeed;
        this.useCustomSlidingRotationalSpeed = n.useCustomSlidingRotationalSpeed;
        this.sliding = !1;
        this.chassisConnectionPointLocal = n.chassisConnectionPointLocal.clone();
        this.chassisConnectionPointWorld = n.chassisConnectionPointWorld.clone();
        this.directionLocal = n.directionLocal.clone();
        this.directionWorld = n.directionWorld.clone();
        this.axleLocal = n.axleLocal.clone();
        this.axleWorld = n.axleWorld.clone();
        this.suspensionRestLength = n.suspensionRestLength;
        this.suspensionMaxLength = n.suspensionMaxLength;
        this.radius = n.radius;
        this.suspensionStiffness = n.suspensionStiffness;
        this.dampingCompression = n.dampingCompression;
        this.dampingRelaxation = n.dampingRelaxation;
        this.frictionSlip = n.frictionSlip;
        this.deltaRotation = this.rotation = this.steering = 0;
        this.rollInfluence = n.rollInfluence;
        this.maxSuspensionForce = n.maxSuspensionForce;
        this.brake = this.engineForce = 0;
        this.isFrontWheel = n.isFrontWheel;
        this.clippedInvContactDotSuspension = 1;
        this.forwardImpulse = this.sideImpulse = this.suspensionLength = this.skidInfo = this.suspensionForce = this.suspensionRelativeVelocity = 0;
        this.raycastResult = new k;
        this.worldTransform = new b;
        this.isInContact = !1
      }
      var c = d("../math/Vec3")
        , b = d("../math/Transform")
        , k = d("../collision/RaycastResult")
        , g = d("../utils/Utils");
      e.exports = a;
      var h = new c
        , l = new c;
      h = new c;
      a.prototype.updateWheel = function (n) {
        var p = this.raycastResult;
        if (this.isInContact) {
          var q = p.hitNormalWorld.dot(p.directionWorld);
          p.hitPointWorld.vsub(n.position, l);
          n.getVelocityAtWorldPoint(l, h);
          n = p.hitNormalWorld.dot(h);
          -.1 <= q ? (this.suspensionRelativeVelocity = 0,
            this.clippedInvContactDotSuspension = 10) : (q = -1 / q,
              this.suspensionRelativeVelocity = n * q,
              this.clippedInvContactDotSuspension = q)
        } else
          p.suspensionLength = this.suspensionRestLength,
            this.suspensionRelativeVelocity = 0,
            p.directionWorld.scale(-1, p.hitNormalWorld),
            this.clippedInvContactDotSuspension = 1
      }
    }
      , {
      "../collision/RaycastResult": 10,
      "../math/Transform": 29,
      "../math/Vec3": 30,
      "../utils/Utils": 53
    }],
    37: [function (d, e, m) {
      function a (l) {
        c.call(this);
        this.type = c.types.BOX;
        this.halfExtents = l;
        this.convexPolyhedronRepresentation = null;
        this.updateConvexPolyhedronRepresentation();
        this.updateBoundingSphereRadius()
      }
      e.exports = a;
      var c = d("./Shape")
        , b = d("../math/Vec3")
        , k = d("./ConvexPolyhedron");
      a.prototype = new c;
      a.prototype.constructor = a;
      a.prototype.updateConvexPolyhedronRepresentation = function () {
        var l = this.halfExtents.x
          , n = this.halfExtents.y
          , p = this.halfExtents.z;
        l = [new b(-l, -n, -p), new b(l, -n, -p), new b(l, n, -p), new b(-l, n, -p), new b(-l, -n, p), new b(l, -n, p), new b(l, n, p), new b(-l, n, p)];
        new b(0, 0, 1);
        new b(0, 1, 0);
        new b(1, 0, 0);
        this.convexPolyhedronRepresentation = l = new k(l, [[3, 2, 1, 0], [4, 5, 6, 7], [5, 4, 0, 1], [2, 3, 7, 6], [0, 4, 7, 3], [1, 2, 6, 5]]);
        l.material = this.material
      }
        ;
      a.prototype.calculateLocalInertia = function (l, n) {
        n = n || new b;
        a.calculateInertia(this.halfExtents, l, n);
        return n
      }
        ;
      a.calculateInertia = function (l, n, p) {
        p.x = 1 / 12 * n * (4 * l.y * l.y + 4 * l.z * l.z);
        p.y = 1 / 12 * n * (4 * l.x * l.x + 4 * l.z * l.z);
        p.z = 1 / 12 * n * (4 * l.y * l.y + 4 * l.x * l.x)
      }
        ;
      a.prototype.getSideNormals = function (l, n) {
        var p = this.halfExtents;
        l[0].set(p.x, 0, 0);
        l[1].set(0, p.y, 0);
        l[2].set(0, 0, p.z);
        l[3].set(-p.x, 0, 0);
        l[4].set(0, -p.y, 0);
        l[5].set(0, 0, -p.z);
        if (void 0 !== n)
          for (p = 0; p !== l.length; p++)
            n.vmult(l[p], l[p]);
        return l
      }
        ;
      a.prototype.volume = function () {
        return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z
      }
        ;
      a.prototype.updateBoundingSphereRadius = function () {
        this.boundingSphereRadius = this.halfExtents.norm()
      }
        ;
      var g = new b;
      new b;
      a.prototype.forEachWorldCorner = function (l, n, p) {
        var q = this.halfExtents;
        q = [[q.x, q.y, q.z], [-q.x, q.y, q.z], [-q.x, -q.y, q.z], [-q.x, -q.y, -q.z], [q.x, -q.y, -q.z], [q.x, q.y, -q.z], [-q.x, q.y, -q.z], [q.x, -q.y, q.z]];
        for (var t = 0; t < q.length; t++)
          g.set(q[t][0], q[t][1], q[t][2]),
            n.vmult(g, g),
            l.vadd(g, g),
            p(g.x, g.y, g.z)
      }
        ;
      var h = [new b, new b, new b, new b, new b, new b, new b, new b];
      a.prototype.calculateWorldAABB = function (l, n, p, q) {
        var t = this.halfExtents;
        h[0].set(t.x, t.y, t.z);
        h[1].set(-t.x, t.y, t.z);
        h[2].set(-t.x, -t.y, t.z);
        h[3].set(-t.x, -t.y, -t.z);
        h[4].set(t.x, -t.y, -t.z);
        h[5].set(t.x, t.y, -t.z);
        h[6].set(-t.x, t.y, -t.z);
        h[7].set(t.x, -t.y, t.z);
        var r = h[0];
        n.vmult(r, r);
        l.vadd(r, r);
        q.copy(r);
        p.copy(r);
        for (t = 1; 8 > t; t++) {
          r = h[t];
          n.vmult(r, r);
          l.vadd(r, r);
          var v = r.x
            , x = r.y;
          r = r.z;
          v > q.x && (q.x = v);
          x > q.y && (q.y = x);
          r > q.z && (q.z = r);
          v < p.x && (p.x = v);
          x < p.y && (p.y = x);
          r < p.z && (p.z = r)
        }
      }
    }
      , {
      "../math/Vec3": 30,
      "./ConvexPolyhedron": 38,
      "./Shape": 43
    }],
    38: [function (d, e, m) {
      function a (u, w, D) {
        c.call(this);
        this.type = c.types.CONVEXPOLYHEDRON;
        this.vertices = u || [];
        this.worldVertices = [];
        this.worldVerticesNeedsUpdate = !0;
        this.faces = w || [];
        this.faceNormals = [];
        this.computeNormals();
        this.worldFaceNormalsNeedsUpdate = !0;
        this.worldFaceNormals = [];
        this.uniqueEdges = [];
        this.uniqueAxes = D ? D.slice() : null;
        this.computeEdges();
        this.updateBoundingSphereRadius()
      }
      e.exports = a;
      var c = d("./Shape")
        , b = d("../math/Vec3");
      d("../math/Quaternion");
      var k = d("../math/Transform");
      a.prototype = new c;
      a.prototype.constructor = a;
      var g = new b;
      a.prototype.computeEdges = function () {
        for (var u = this.faces, w = this.vertices, D = this.uniqueEdges, O = D.length = 0; O !== u.length; O++)
          for (var J = u[O], G = J.length, S = 0; S !== G; S++) {
            w[J[S]].vsub(w[J[(S + 1) % G]], g);
            g.normalize();
            for (var ba = !1, I = 0; I !== D.length; I++)
              if (D[I].almostEquals(g) || D[I].almostEquals(g)) {
                ba = !0;
                break
              }
            ba || D.push(g.clone())
          }
      }
        ;
      a.prototype.computeNormals = function () {
        this.faceNormals.length = this.faces.length;
        for (var u = 0; u < this.faces.length; u++) {
          for (var w = 0; w < this.faces[u].length; w++)
            if (!this.vertices[this.faces[u][w]])
              throw Error("Vertex " + this.faces[u][w] + " not found!");
          w = this.faceNormals[u] || new b;
          this.getFaceNormal(u, w);
          w.negate(w);
          this.faceNormals[u] = w;
          if (0 > w.dot(this.vertices[this.faces[u][0]]))
            for (console.error(".faceNormals[" + u + "] = Vec3(" + w.toString() + ") looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule."),
              w = 0; w < this.faces[u].length; w++)
              console.warn(".vertices[" + this.faces[u][w] + "] = Vec3(" + this.vertices[this.faces[u][w]].toString() + ")")
        }
      }
        ;
      var h = new b
        , l = new b;
      a.computeNormal = function (u, w, D, O) {
        w.vsub(u, l);
        D.vsub(w, h);
        h.cross(l, O);
        O.isZero() || O.normalize()
      }
        ;
      a.prototype.getFaceNormal = function (u, w) {
        var D = this.faces[u];
        return a.computeNormal(this.vertices[D[0]], this.vertices[D[1]], this.vertices[D[2]], w)
      }
        ;
      var n = new b;
      a.prototype.clipAgainstHull = function (u, w, D, O, J, G, S, ba, I) {
        for (var qa = -1, la = -Number.MAX_VALUE, fa = 0; fa < D.faces.length; fa++) {
          n.copy(D.faceNormals[fa]);
          J.vmult(n, n);
          var R = n.dot(G);
          R > la && (la = R,
            qa = fa)
        }
        la = [];
        fa = D.faces[qa];
        R = fa.length;
        for (var aa = 0; aa < R; aa++) {
          var da = D.vertices[fa[aa]]
            , na = new b;
          na.copy(da);
          J.vmult(na, na);
          O.vadd(na, na);
          la.push(na)
        }
        0 <= qa && this.clipFaceAgainstHull(G, u, w, la, S, ba, I)
      }
        ;
      var p = new b
        , q = new b
        , t = new b
        , r = new b
        , v = new b
        , x = new b;
      a.prototype.findSeparatingAxis = function (u, w, D, O, J, G, S, ba) {
        var I = Number.MAX_VALUE
          , qa = 0;
        if (this.uniqueAxes)
          for (fa = 0; fa !== this.uniqueAxes.length; fa++) {
            D.vmult(this.uniqueAxes[fa], p);
            R = this.testSepAxis(p, u, w, D, O, J);
            if (!1 === R)
              return !1;
            R < I && (I = R,
              G.copy(p))
          }
        else
          for (var la = S ? S.length : this.faces.length, fa = 0; fa < la; fa++) {
            R = S ? S[fa] : fa;
            p.copy(this.faceNormals[R]);
            D.vmult(p, p);
            var R = this.testSepAxis(p, u, w, D, O, J);
            if (!1 === R)
              return !1;
            R < I && (I = R,
              G.copy(p))
          }
        if (u.uniqueAxes)
          for (fa = 0; fa !== u.uniqueAxes.length; fa++) {
            J.vmult(u.uniqueAxes[fa], q);
            qa++;
            R = this.testSepAxis(q, u, w, D, O, J);
            if (!1 === R)
              return !1;
            R < I && (I = R,
              G.copy(q))
          }
        else
          for (S = ba ? ba.length : u.faces.length,
            fa = 0; fa < S; fa++) {
            R = ba ? ba[fa] : fa;
            q.copy(u.faceNormals[R]);
            J.vmult(q, q);
            qa++;
            R = this.testSepAxis(q, u, w, D, O, J);
            if (!1 === R)
              return !1;
            R < I && (I = R,
              G.copy(q))
          }
        for (ba = 0; ba !== this.uniqueEdges.length; ba++)
          for (D.vmult(this.uniqueEdges[ba], r),
            qa = 0; qa !== u.uniqueEdges.length; qa++)
            if (J.vmult(u.uniqueEdges[qa], v),
              r.cross(v, x),
              !x.almostZero()) {
              x.normalize();
              fa = this.testSepAxis(x, u, w, D, O, J);
              if (!1 === fa)
                return !1;
              fa < I && (I = fa,
                G.copy(x))
            }
        O.vsub(w, t);
        0 < t.dot(G) && G.negate(G);
        return !0
      }
        ;
      var E = []
        , z = [];
      a.prototype.testSepAxis = function (u, w, D, O, J, G) {
        a.project(this, u, D, O, E);
        a.project(w, u, J, G, z);
        D = E[0];
        u = E[1];
        w = z[0];
        O = z[1];
        if (D < O || w < u)
          return !1;
        D -= O;
        u = w - u;
        return D < u ? D : u
      }
        ;
      var F = new b
        , U = new b;
      a.prototype.calculateLocalInertia = function (u, w) {
        this.computeLocalAABB(F, U);
        var D = U.x - F.x
          , O = U.y - F.y
          , J = U.z - F.z;
        w.x = 1 / 12 * u * (4 * O * O + 4 * J * J);
        w.y = 1 / 12 * u * (4 * D * D + 4 * J * J);
        w.z = 1 / 12 * u * (4 * O * O + 4 * D * D)
      }
        ;
      a.prototype.getPlaneConstantOfFace = function (u) {
        return -this.faceNormals[u].dot(this.vertices[this.faces[u][0]])
      }
        ;
      var Q = new b
        , K = new b
        , Y = new b
        , C = new b
        , H = new b
        , T = new b
        , M = new b
        , ca = new b;
      a.prototype.clipFaceAgainstHull = function (u, w, D, O, J, G, S) {
        for (var ba = [], I = -1, qa = Number.MAX_VALUE, la = 0; la < this.faces.length; la++) {
          Q.copy(this.faceNormals[la]);
          D.vmult(Q, Q);
          var fa = Q.dot(u);
          fa < qa && (qa = fa,
            I = la)
        }
        if (!(0 > I)) {
          u = this.faces[I];
          u.connectedFaces = [];
          for (qa = 0; qa < this.faces.length; qa++)
            for (la = 0; la < this.faces[qa].length; la++)
              -1 !== u.indexOf(this.faces[qa][la]) && qa !== I && -1 === u.connectedFaces.indexOf(qa) && u.connectedFaces.push(qa);
          qa = u.length;
          for (la = 0; la < qa; la++) {
            fa = this.vertices[u[la]];
            fa.vsub(this.vertices[u[(la + 1) % qa]], K);
            Y.copy(K);
            D.vmult(Y, Y);
            w.vadd(Y, Y);
            C.copy(this.faceNormals[I]);
            D.vmult(C, C);
            w.vadd(C, C);
            Y.cross(C, H);
            H.negate(H);
            T.copy(fa);
            D.vmult(T, T);
            w.vadd(T, T);
            T.dot(H);
            fa = u.connectedFaces[la];
            M.copy(this.faceNormals[fa]);
            fa = this.getPlaneConstantOfFace(fa);
            ca.copy(M);
            D.vmult(ca, ca);
            fa -= ca.dot(w);
            for (this.clipFaceAgainstPlane(O, ba, ca, fa); O.length;)
              O.shift();
            for (; ba.length;)
              O.push(ba.shift())
          }
          M.copy(this.faceNormals[I]);
          fa = this.getPlaneConstantOfFace(I);
          ca.copy(M);
          D.vmult(ca, ca);
          fa -= ca.dot(w);
          for (qa = 0; qa < O.length; qa++)
            w = ca.dot(O[qa]) + fa,
              w <= J && (console.log("clamped: depth=" + w + " to minDist=" + (J + "")),
                w = J),
              w <= G && (D = O[qa],
                0 >= w && S.push({
                  point: D,
                  normal: ca,
                  depth: w
                }))
        }
      }
        ;
      a.prototype.clipFaceAgainstPlane = function (u, w, D, O) {
        var J = u.length;
        if (2 > J)
          return w;
        var G = u[u.length - 1];
        var S = D.dot(G) + O;
        for (var ba = 0; ba < J; ba++) {
          var I = u[ba];
          var qa = D.dot(I) + O;
          if (0 > S) {
            if (0 > qa) {
              var la = new b;
              la.copy(I)
            } else
              la = new b,
                G.lerp(I, S / (S - qa), la);
            w.push(la)
          } else
            0 > qa && (la = new b,
              G.lerp(I, S / (S - qa), la),
              w.push(la),
              w.push(I));
          G = I;
          S = qa
        }
        return w
      }
        ;
      a.prototype.computeWorldVertices = function (u, w) {
        for (var D = this.vertices.length; this.worldVertices.length < D;)
          this.worldVertices.push(new b);
        for (var O = this.vertices, J = this.worldVertices, G = 0; G !== D; G++)
          w.vmult(O[G], J[G]),
            u.vadd(J[G], J[G]);
        this.worldVerticesNeedsUpdate = !1
      }
        ;
      new b;
      a.prototype.computeLocalAABB = function (u, w) {
        var D = this.vertices.length
          , O = this.vertices;
        u.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        w.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (var J = 0; J < D; J++) {
          var G = O[J];
          G.x < u.x ? u.x = G.x : G.x > w.x && (w.x = G.x);
          G.y < u.y ? u.y = G.y : G.y > w.y && (w.y = G.y);
          G.z < u.z ? u.z = G.z : G.z > w.z && (w.z = G.z)
        }
      }
        ;
      a.prototype.computeWorldFaceNormals = function (u) {
        for (var w = this.faceNormals.length; this.worldFaceNormals.length < w;)
          this.worldFaceNormals.push(new b);
        for (var D = this.faceNormals, O = this.worldFaceNormals, J = 0; J !== w; J++)
          u.vmult(D[J], O[J]);
        this.worldFaceNormalsNeedsUpdate = !1
      }
        ;
      a.prototype.updateBoundingSphereRadius = function () {
        for (var u = 0, w = this.vertices, D = 0, O = w.length; D !== O; D++) {
          var J = w[D].norm2();
          J > u && (u = J)
        }
        this.boundingSphereRadius = Math.sqrt(u)
      }
        ;
      var P = new b;
      a.prototype.calculateWorldAABB = function (u, w, D, O) {
        for (var J = this.vertices.length, G = this.vertices, S, ba, I, qa, la, fa, R = 0; R < J; R++) {
          P.copy(G[R]);
          w.vmult(P, P);
          u.vadd(P, P);
          var aa = P;
          if (aa.x < S || void 0 === S)
            S = aa.x;
          else if (aa.x > qa || void 0 === qa)
            qa = aa.x;
          if (aa.y < ba || void 0 === ba)
            ba = aa.y;
          else if (aa.y > la || void 0 === la)
            la = aa.y;
          if (aa.z < I || void 0 === I)
            I = aa.z;
          else if (aa.z > fa || void 0 === fa)
            fa = aa.z
        }
        D.set(S, ba, I);
        O.set(qa, la, fa)
      }
        ;
      a.prototype.volume = function () {
        return 4 * Math.PI * this.boundingSphereRadius / 3
      }
        ;
      a.prototype.getAveragePointLocal = function (u) {
        u = u || new b;
        for (var w = this.vertices.length, D = this.vertices, O = 0; O < w; O++)
          u.vadd(D[O], u);
        u.mult(1 / w, u);
        return u
      }
        ;
      a.prototype.transformAllPoints = function (u, w) {
        var D = this.vertices.length
          , O = this.vertices;
        if (w) {
          for (var J = 0; J < D; J++) {
            var G = O[J];
            w.vmult(G, G)
          }
          for (J = 0; J < this.faceNormals.length; J++)
            G = this.faceNormals[J],
              w.vmult(G, G)
        }
        if (u)
          for (J = 0; J < D; J++)
            G = O[J],
              G.vadd(u, G)
      }
        ;
      var X = new b
        , L = new b
        , A = new b;
      a.prototype.pointIsInside = function (u) {
        var w = this.vertices
          , D = this.faces
          , O = this.faceNormals
          , J = this.faces.length;
        this.getAveragePointLocal(X);
        for (var G = 0; G < J; G++) {
          var S = O[G];
          var ba = w[D[G][0]]
            , I = L;
          u.vsub(ba, I);
          I = S.dot(I);
          var qa = A;
          X.vsub(ba, qa);
          S = S.dot(qa);
          if (0 > I && 0 < S || 0 < I && 0 > S)
            return !1
        }
        return -1
      }
        ;
      new b;
      var B = new b
        , y = new b;
      a.project = function (u, w, D, O, J) {
        var G = u.vertices.length;
        u = u.vertices;
        y.setZero();
        k.vectorToLocalFrame(D, O, w, B);
        k.pointToLocalFrame(D, O, y, y);
        O = y.dot(B);
        D = w = u[0].dot(B);
        for (var S = 1; S < G; S++) {
          var ba = u[S].dot(B);
          ba > w && (w = ba);
          ba < D && (D = ba)
        }
        D -= O;
        w -= O;
        D > w && (G = D,
          D = w,
          w = G);
        J[0] = w;
        J[1] = D
      }
    }
      , {
      "../math/Quaternion": 28,
      "../math/Transform": 29,
      "../math/Vec3": 30,
      "./Shape": 43
    }],
    39: [function (d, e, m) {
      function a (g, h, l, n) {
        var p = []
          , q = []
          , t = []
          , r = []
          , v = []
          , x = Math.cos
          , E = Math.sin;
        p.push(new b(h * x(0), h * E(0), .5 * -l));
        r.push(0);
        p.push(new b(g * x(0), g * E(0), .5 * l));
        v.push(1);
        for (var z = 0; z < n; z++) {
          var F = 2 * Math.PI / n * (z + 1)
            , U = 2 * Math.PI / n * (z + .5);
          z < n - 1 ? (p.push(new b(h * x(F), h * E(F), .5 * -l)),
            r.push(2 * z + 2),
            p.push(new b(g * x(F), g * E(F), .5 * l)),
            v.push(2 * z + 3),
            t.push([2 * z + 2, 2 * z + 3, 2 * z + 1, 2 * z])) : t.push([0, 1, 2 * z + 1, 2 * z]);
          (1 === n % 2 || z < n / 2) && q.push(new b(x(U), E(U), 0))
        }
        t.push(v);
        q.push(new b(0, 0, 1));
        g = [];
        for (z = 0; z < r.length; z++)
          g.push(r[r.length - z - 1]);
        t.push(g);
        this.type = c.types.CONVEXPOLYHEDRON;
        k.call(this, p, t, q)
      }
      e.exports = a;
      var c = d("./Shape")
        , b = d("../math/Vec3");
      d("../math/Quaternion");
      var k = d("./ConvexPolyhedron");
      a.prototype = new k
    }
      , {
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "./ConvexPolyhedron": 38,
      "./Shape": 43
    }],
    40: [function (d, e, m) {
      function a (h, l) {
        l = g.defaults(l, {
          maxValue: null,
          minValue: null,
          elementSize: 1
        });
        this.data = h;
        this.maxValue = l.maxValue;
        this.minValue = l.minValue;
        this.elementSize = l.elementSize;
        null === l.minValue && this.updateMinValue();
        null === l.maxValue && this.updateMaxValue();
        this.cacheEnabled = !0;
        c.call(this);
        this.pillarConvex = new b;
        this.pillarOffset = new k;
        this.type = c.types.HEIGHTFIELD;
        this.updateBoundingSphereRadius();
        this._cachedPillars = {}
      }
      var c = d("./Shape")
        , b = d("./ConvexPolyhedron")
        , k = d("../math/Vec3")
        , g = d("../utils/Utils");
      e.exports = a;
      a.prototype = new c;
      a.prototype.update = function () {
        this._cachedPillars = {}
      }
        ;
      a.prototype.updateMinValue = function () {
        for (var h = this.data, l = h[0][0], n = 0; n !== h.length; n++)
          for (var p = 0; p !== h[n].length; p++) {
            var q = h[n][p];
            q < l && (l = q)
          }
        this.minValue = l
      }
        ;
      a.prototype.updateMaxValue = function () {
        for (var h = this.data, l = h[0][0], n = 0; n !== h.length; n++)
          for (var p = 0; p !== h[n].length; p++) {
            var q = h[n][p];
            q > l && (l = q)
          }
        this.maxValue = l
      }
        ;
      a.prototype.setHeightValueAtIndex = function (h, l, n) {
        this.data[h][l] = n;
        this.clearCachedConvexTrianglePillar(h, l, !1);
        0 < h && (this.clearCachedConvexTrianglePillar(h - 1, l, !0),
          this.clearCachedConvexTrianglePillar(h - 1, l, !1));
        0 < l && (this.clearCachedConvexTrianglePillar(h, l - 1, !0),
          this.clearCachedConvexTrianglePillar(h, l - 1, !1));
        0 < l && 0 < h && this.clearCachedConvexTrianglePillar(h - 1, l - 1, !0)
      }
        ;
      a.prototype.getRectMinMax = function (h, l, n, p, q) {
        q = q || [];
        for (var t = this.data, r = this.minValue; h <= n; h++)
          for (var v = l; v <= p; v++) {
            var x = t[h][v];
            x > r && (r = x)
          }
        q[0] = this.minValue;
        q[1] = r
      }
        ;
      a.prototype.getIndexOfPosition = function (h, l, n, p) {
        var q = this.elementSize
          , t = this.data;
        h = Math.floor(h / q);
        l = Math.floor(l / q);
        n[0] = h;
        n[1] = l;
        p && (0 > h && (h = 0),
          0 > l && (l = 0),
          h >= t.length - 1 && (h = t.length - 1),
          l >= t[0].length - 1 && (l = t[0].length - 1));
        return 0 > h || 0 > l || h >= t.length - 1 || l >= t[0].length - 1 ? !1 : !0
      }
        ;
      a.prototype.getHeightAt = function (h, l, n) {
        var p = [];
        this.getIndexOfPosition(h, l, p, n);
        h = [];
        this.getRectMinMax(p[0], p[1] + 1, p[0], p[1] + 1, h);
        return (h[0] + h[1]) / 2
      }
        ;
      a.prototype.getCacheConvexTrianglePillarKey = function (h, l, n) {
        return h + "_" + l + "_" + (n ? 1 : 0)
      }
        ;
      a.prototype.getCachedConvexTrianglePillar = function (h, l, n) {
        return this._cachedPillars[this.getCacheConvexTrianglePillarKey(h, l, n)]
      }
        ;
      a.prototype.setCachedConvexTrianglePillar = function (h, l, n, p, q) {
        this._cachedPillars[this.getCacheConvexTrianglePillarKey(h, l, n)] = {
          convex: p,
          offset: q
        }
      }
        ;
      a.prototype.clearCachedConvexTrianglePillar = function (h, l, n) {
        delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(h, l, n)]
      }
        ;
      a.prototype.getConvexTrianglePillar = function (h, l, n) {
        var p = this.pillarConvex
          , q = this.pillarOffset;
        if (this.cacheEnabled) {
          var t = this.getCachedConvexTrianglePillar(h, l, n);
          if (t) {
            this.pillarConvex = t.convex;
            this.pillarOffset = t.offset;
            return
          }
          p = new b;
          q = new k;
          this.pillarConvex = p;
          this.pillarOffset = q
        }
        t = this.data;
        var r = this.elementSize
          , v = p.faces;
        p.vertices.length = 6;
        for (var x = 0; 6 > x; x++)
          p.vertices[x] || (p.vertices[x] = new k);
        v.length = 5;
        for (x = 0; 5 > x; x++)
          v[x] || (v[x] = []);
        x = p.vertices;
        var E = (Math.min(t[h][l], t[h + 1][l], t[h][l + 1], t[h + 1][l + 1]) - this.minValue) / 2 + this.minValue;
        n ? (q.set((h + .75) * r, (l + .75) * r, E),
          x[0].set(.25 * r, .25 * r, t[h + 1][l + 1] - E),
          x[1].set(-.75 * r, .25 * r, t[h][l + 1] - E),
          x[2].set(.25 * r, -.75 * r, t[h + 1][l] - E),
          x[3].set(.25 * r, .25 * r, -E - 1),
          x[4].set(-.75 * r, .25 * r, -E - 1),
          x[5].set(.25 * r, -.75 * r, -E - 1),
          v[0][0] = 0,
          v[0][1] = 1,
          v[0][2] = 2,
          v[1][0] = 5,
          v[1][1] = 4,
          v[1][2] = 3,
          v[2][0] = 2,
          v[2][1] = 5,
          v[2][2] = 3,
          v[2][3] = 0,
          v[3][0] = 3,
          v[3][1] = 4,
          v[3][2] = 1,
          v[3][3] = 0,
          v[4][0] = 1,
          v[4][1] = 4,
          v[4][2] = 5,
          v[4][3] = 2) : (q.set((h + .25) * r, (l + .25) * r, E),
            x[0].set(-.25 * r, -.25 * r, t[h][l] - E),
            x[1].set(.75 * r, -.25 * r, t[h + 1][l] - E),
            x[2].set(-.25 * r, .75 * r, t[h][l + 1] - E),
            x[3].set(-.25 * r, -.25 * r, -E - 1),
            x[4].set(.75 * r, -.25 * r, -E - 1),
            x[5].set(-.25 * r, .75 * r, -E - 1),
            v[0][0] = 0,
            v[0][1] = 1,
            v[0][2] = 2,
            v[1][0] = 5,
            v[1][1] = 4,
            v[1][2] = 3,
            v[2][0] = 0,
            v[2][1] = 2,
            v[2][2] = 5,
            v[2][3] = 3,
            v[3][0] = 1,
            v[3][1] = 0,
            v[3][2] = 3,
            v[3][3] = 4,
            v[4][0] = 4,
            v[4][1] = 5,
            v[4][2] = 2,
            v[4][3] = 1);
        p.computeNormals();
        p.computeEdges();
        p.updateBoundingSphereRadius();
        this.setCachedConvexTrianglePillar(h, l, n, p, q)
      }
        ;
      a.prototype.calculateLocalInertia = function (h, l) {
        l = l || new k;
        l.set(0, 0, 0);
        return l
      }
        ;
      a.prototype.volume = function () {
        return Number.MAX_VALUE
      }
        ;
      a.prototype.calculateWorldAABB = function (h, l, n, p) {
        n.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        p.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
      }
        ;
      a.prototype.updateBoundingSphereRadius = function () {
        var h = this.data
          , l = this.elementSize;
        this.boundingSphereRadius = (new k(h.length * l, h[0].length * l, Math.max(Math.abs(this.maxValue), Math.abs(this.minValue)))).norm()
      }
    }
      , {
      "../math/Vec3": 30,
      "../utils/Utils": 53,
      "./ConvexPolyhedron": 38,
      "./Shape": 43
    }],
    41: [function (d, e, m) {
      function a () {
        c.call(this);
        this.type = c.types.PARTICLE
      }
      e.exports = a;
      var c = d("./Shape")
        , b = d("../math/Vec3");
      a.prototype = new c;
      a.prototype.constructor = a;
      a.prototype.calculateLocalInertia = function (k, g) {
        g = g || new b;
        g.set(0, 0, 0);
        return g
      }
        ;
      a.prototype.volume = function () {
        return 0
      }
        ;
      a.prototype.updateBoundingSphereRadius = function () {
        this.boundingSphereRadius = 0
      }
        ;
      a.prototype.calculateWorldAABB = function (k, g, h, l) {
        h.copy(k);
        l.copy(k)
      }
    }
      , {
      "../math/Vec3": 30,
      "./Shape": 43
    }],
    42: [function (d, e, m) {
      function a () {
        c.call(this);
        this.type = c.types.PLANE;
        this.worldNormal = new b;
        this.worldNormalNeedsUpdate = !0;
        this.boundingSphereRadius = Number.MAX_VALUE
      }
      e.exports = a;
      var c = d("./Shape")
        , b = d("../math/Vec3");
      a.prototype = new c;
      a.prototype.constructor = a;
      a.prototype.computeWorldNormal = function (g) {
        var h = this.worldNormal;
        h.set(0, 0, 1);
        g.vmult(h, h);
        this.worldNormalNeedsUpdate = !1
      }
        ;
      a.prototype.calculateLocalInertia = function (g, h) {
        return h = h || new b
      }
        ;
      a.prototype.volume = function () {
        return Number.MAX_VALUE
      }
        ;
      var k = new b;
      a.prototype.calculateWorldAABB = function (g, h, l, n) {
        k.set(0, 0, 1);
        h.vmult(k, k);
        h = Number.MAX_VALUE;
        l.set(-h, -h, -h);
        n.set(h, h, h);
        1 === k.x && (n.x = g.x);
        1 === k.y && (n.y = g.y);
        1 === k.z && (n.z = g.z);
        -1 === k.x && (l.x = g.x);
        -1 === k.y && (l.y = g.y);
        -1 === k.z && (l.z = g.z)
      }
        ;
      a.prototype.updateBoundingSphereRadius = function () {
        this.boundingSphereRadius = Number.MAX_VALUE
      }
    }
      , {
      "../math/Vec3": 30,
      "./Shape": 43
    }],
    43: [function (d, e, m) {
      function a () {
        this.id = a.idCounter++;
        this.boundingSphereRadius = this.type = 0;
        this.collisionResponse = !0;
        this.material = null
      }
      e.exports = a;
      a = d("./Shape");
      d("../math/Vec3");
      d("../math/Quaternion");
      d("../material/Material");
      a.prototype.constructor = a;
      a.prototype.updateBoundingSphereRadius = function () {
        throw "computeBoundingSphereRadius() not implemented for shape type " + this.type;
      }
        ;
      a.prototype.volume = function () {
        throw "volume() not implemented for shape type " + this.type;
      }
        ;
      a.prototype.calculateLocalInertia = function (c, b) {
        throw "calculateLocalInertia() not implemented for shape type " + this.type;
      }
        ;
      a.idCounter = 0;
      a.types = {
        SPHERE: 1,
        PLANE: 2,
        BOX: 4,
        COMPOUND: 8,
        CONVEXPOLYHEDRON: 16,
        HEIGHTFIELD: 32,
        PARTICLE: 64,
        CYLINDER: 128,
        TRIMESH: 256
      }
    }
      , {
      "../material/Material": 25,
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "./Shape": 43
    }],
    44: [function (d, e, m) {
      function a (k) {
        c.call(this);
        this.radius = void 0 !== k ? Number(k) : 1;
        this.type = c.types.SPHERE;
        if (0 > this.radius)
          throw Error("The sphere radius cannot be negative.");
        this.updateBoundingSphereRadius()
      }
      e.exports = a;
      var c = d("./Shape")
        , b = d("../math/Vec3");
      a.prototype = new c;
      a.prototype.constructor = a;
      a.prototype.calculateLocalInertia = function (k, g) {
        g = g || new b;
        var h = 2 * k * this.radius * this.radius / 5;
        g.x = h;
        g.y = h;
        g.z = h;
        return g
      }
        ;
      a.prototype.volume = function () {
        return 4 * Math.PI * this.radius / 3
      }
        ;
      a.prototype.updateBoundingSphereRadius = function () {
        this.boundingSphereRadius = this.radius
      }
        ;
      a.prototype.calculateWorldAABB = function (k, g, h, l) {
        g = this.radius;
        for (var n = ["x", "y", "z"], p = 0; p < n.length; p++) {
          var q = n[p];
          h[q] = k[q] - g;
          l[q] = k[q] + g
        }
      }
    }
      , {
      "../math/Vec3": 30,
      "./Shape": 43
    }],
    45: [function (d, e, m) {
      function a (K, Y) {
        c.call(this);
        this.type = c.types.TRIMESH;
        this.vertices = new Float32Array(K);
        this.indices = new Int16Array(Y);
        this.normals = new Float32Array(Y.length);
        this.aabb = new g;
        this.edges = null;
        this.scale = new b(1, 1, 1);
        this.tree = new h;
        this.updateEdges();
        this.updateNormals();
        this.updateAABB();
        this.updateBoundingSphereRadius();
        this.updateTree()
      }
      e.exports = a;
      var c = d("./Shape")
        , b = d("../math/Vec3");
      d("../math/Quaternion");
      var k = d("../math/Transform")
        , g = d("../collision/AABB")
        , h = d("../utils/Octree");
      a.prototype = new c;
      a.prototype.constructor = a;
      var l = new b;
      a.prototype.updateTree = function () {
        var K = this.tree;
        K.reset();
        K.aabb.copy(this.aabb);
        var Y = this.scale;
        K.aabb.lowerBound.x *= 1 / Y.x;
        K.aabb.lowerBound.y *= 1 / Y.y;
        K.aabb.lowerBound.z *= 1 / Y.z;
        K.aabb.upperBound.x *= 1 / Y.x;
        K.aabb.upperBound.y *= 1 / Y.y;
        K.aabb.upperBound.z *= 1 / Y.z;
        Y = new g;
        for (var C = new b, H = new b, T = new b, M = [C, H, T], ca = 0; ca < this.indices.length / 3; ca++) {
          var P = 3 * ca;
          this._getUnscaledVertex(this.indices[P], C);
          this._getUnscaledVertex(this.indices[P + 1], H);
          this._getUnscaledVertex(this.indices[P + 2], T);
          Y.setFromPoints(M);
          K.insert(Y, ca)
        }
        K.removeEmptyNodes()
      }
        ;
      var n = new g;
      a.prototype.getTrianglesInAABB = function (K, Y) {
        n.copy(K);
        var C = this.scale
          , H = C.x
          , T = C.y;
        C = C.z;
        var M = n.lowerBound
          , ca = n.upperBound;
        M.x /= H;
        M.y /= T;
        M.z /= C;
        ca.x /= H;
        ca.y /= T;
        ca.z /= C;
        return this.tree.aabbQuery(n, Y)
      }
        ;
      a.prototype.setScale = function (K) {
        var Y = K.x === K.y === K.z;
        this.scale.x === this.scale.y === this.scale.z && Y || this.updateNormals();
        this.scale.copy(K);
        this.updateAABB();
        this.updateBoundingSphereRadius()
      }
        ;
      a.prototype.updateNormals = function () {
        for (var K = this.normals, Y = 0; Y < this.indices.length / 3; Y++) {
          var C = 3 * Y
            , H = this.indices[C + 1]
            , T = this.indices[C + 2];
          this.getVertex(this.indices[C], v);
          this.getVertex(H, x);
          this.getVertex(T, E);
          a.computeNormal(x, v, E, l);
          K[C] = l.x;
          K[C + 1] = l.y;
          K[C + 2] = l.z
        }
      }
        ;
      a.prototype.updateEdges = function () {
        for (var K = {}, Y = function (ca, P) {
          K[T < M ? T + "_" + M : M + "_" + T] = !0
        }, C = 0; C < this.indices.length / 3; C++) {
          var H = 3 * C
            , T = this.indices[H]
            , M = this.indices[H + 1];
          H = this.indices[H + 2];
          Y(T, M);
          Y(M, H);
          Y(H, T)
        }
        Y = Object.keys(K);
        this.edges = new Int16Array(2 * Y.length);
        for (C = 0; C < Y.length; C++)
          H = Y[C].split("_"),
            this.edges[2 * C] = parseInt(H[0], 10),
            this.edges[2 * C + 1] = parseInt(H[1], 10)
      }
        ;
      a.prototype.getEdgeVertex = function (K, Y, C) {
        this.getVertex(this.edges[2 * K + (Y ? 1 : 0)], C)
      }
        ;
      var p = new b
        , q = new b;
      a.prototype.getEdgeVector = function (K, Y) {
        this.getEdgeVertex(K, 0, p);
        this.getEdgeVertex(K, 1, q);
        q.vsub(p, Y)
      }
        ;
      var t = new b
        , r = new b;
      a.computeNormal = function (K, Y, C, H) {
        Y.vsub(K, r);
        C.vsub(Y, t);
        t.cross(r, H);
        H.isZero() || H.normalize()
      }
        ;
      var v = new b
        , x = new b
        , E = new b;
      a.prototype.getVertex = function (K, Y) {
        var C = this.scale;
        this._getUnscaledVertex(K, Y);
        Y.x *= C.x;
        Y.y *= C.y;
        Y.z *= C.z;
        return Y
      }
        ;
      a.prototype._getUnscaledVertex = function (K, Y) {
        var C = 3 * K
          , H = this.vertices;
        return Y.set(H[C], H[C + 1], H[C + 2])
      }
        ;
      a.prototype.getWorldVertex = function (K, Y, C, H) {
        this.getVertex(K, H);
        k.pointToWorldFrame(Y, C, H, H);
        return H
      }
        ;
      a.prototype.getTriangleVertices = function (K, Y, C, H) {
        K *= 3;
        this.getVertex(this.indices[K], Y);
        this.getVertex(this.indices[K + 1], C);
        this.getVertex(this.indices[K + 2], H)
      }
        ;
      a.prototype.getNormal = function (K, Y) {
        var C = 3 * K;
        return Y.set(this.normals[C], this.normals[C + 1], this.normals[C + 2])
      }
        ;
      var z = new g;
      a.prototype.calculateLocalInertia = function (K, Y) {
        this.computeLocalAABB(z);
        var C = z.upperBound.x - z.lowerBound.x
          , H = z.upperBound.y - z.lowerBound.y
          , T = z.upperBound.z - z.lowerBound.z;
        return Y.set(1 / 12 * K * (4 * H * H + 4 * T * T), 1 / 12 * K * (4 * C * C + 4 * T * T), 1 / 12 * K * (4 * H * H + 4 * C * C))
      }
        ;
      var F = new b;
      a.prototype.computeLocalAABB = function (K) {
        var Y = K.lowerBound;
        K = K.upperBound;
        var C = this.vertices.length;
        this.getVertex(0, F);
        Y.copy(F);
        K.copy(F);
        for (var H = 0; H !== C; H++)
          this.getVertex(H, F),
            F.x < Y.x ? Y.x = F.x : F.x > K.x && (K.x = F.x),
            F.y < Y.y ? Y.y = F.y : F.y > K.y && (K.y = F.y),
            F.z < Y.z ? Y.z = F.z : F.z > K.z && (K.z = F.z)
      }
        ;
      a.prototype.updateAABB = function () {
        this.computeLocalAABB(this.aabb)
      }
        ;
      a.prototype.updateBoundingSphereRadius = function () {
        var K = 0
          , Y = this.vertices
          , C = new b
          , H = 0;
        for (Y = Y.length / 3; H !== Y; H++) {
          this.getVertex(H, C);
          var T = C.norm2();
          T > K && (K = T)
        }
        this.boundingSphereRadius = Math.sqrt(K)
      }
        ;
      new b;
      var U = new k
        , Q = new g;
      a.prototype.calculateWorldAABB = function (K, Y, C, H) {
        U.position = K;
        U.quaternion = Y;
        this.aabb.toWorldFrame(U, Q);
        C.copy(Q.lowerBound);
        H.copy(Q.upperBound)
      }
        ;
      a.prototype.volume = function () {
        return 4 * Math.PI * this.boundingSphereRadius / 3
      }
        ;
      a.createTorus = function (K, Y, C, H, T) {
        K = K || 1;
        Y = Y || .5;
        C = C || 8;
        H = H || 6;
        T = T || 2 * Math.PI;
        for (var M = [], ca = [], P = 0; P <= C; P++)
          for (var X = 0; X <= H; X++) {
            var L = X / H * T
              , A = P / C * Math.PI * 2;
            M.push((K + Y * Math.cos(A)) * Math.cos(L), (K + Y * Math.cos(A)) * Math.sin(L), Y * Math.sin(A))
          }
        for (P = 1; P <= C; P++)
          for (X = 1; X <= H; X++)
            K = (H + 1) * (P - 1) + X - 1,
              Y = (H + 1) * (P - 1) + X,
              T = (H + 1) * P + X,
              ca.push((H + 1) * P + X - 1, K, T),
              ca.push(K, Y, T);
        return new a(M, ca)
      }
    }
      , {
      "../collision/AABB": 3,
      "../math/Quaternion": 28,
      "../math/Transform": 29,
      "../math/Vec3": 30,
      "../utils/Octree": 50,
      "./Shape": 43
    }],
    46: [function (d, e, m) {
      function a () {
        c.call(this);
        this.iterations = 10;
        this.tolerance = 1E-7
      }
      e.exports = a;
      d("../math/Vec3");
      d("../math/Quaternion");
      var c = d("./Solver");
      a.prototype = new c;
      var b = []
        , k = []
        , g = [];
      a.prototype.solve = function (h, l) {
        var n = 0, p = this.iterations, q = this.tolerance * this.tolerance, t = this.equations, r = t.length, v = l.bodies, x = v.length, E;
        if (0 !== r)
          for (E = 0; E !== x; E++)
            v[E].updateSolveMassProperties();
        k.length = r;
        g.length = r;
        b.length = r;
        for (E = 0; E !== r; E++) {
          var z = t[E];
          b[E] = 0;
          g[E] = z.computeB(h);
          k[E] = 1 / z.computeC()
        }
        if (0 !== r) {
          for (E = 0; E !== x; E++)
            z = v[E],
              n = z.wlambda,
              z.vlambda.set(0, 0, 0),
              n && n.set(0, 0, 0);
          for (n = 0; n !== p; n++) {
            for (var F = E = 0; F !== r; F++) {
              z = t[F];
              var U = g[F];
              var Q = k[F];
              var K = b[F];
              var Y = z.computeGWlambda();
              U = Q * (U - Y - z.eps * K);
              K + U < z.minForce ? U = z.minForce - K : K + U > z.maxForce && (U = z.maxForce - K);
              b[F] += U;
              E += 0 < U ? U : -U;
              z.addToWlambda(U)
            }
            if (E * E < q)
              break
          }
          for (E = 0; E !== x; E++)
            z = v[E],
              p = z.velocity,
              q = z.angularVelocity,
              p.vadd(z.vlambda, p),
              q && q.vadd(z.wlambda, q)
        }
        return n
      }
    }
      , {
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "./Solver": 47
    }],
    47: [function (d, e, m) {
      function a () {
        this.equations = []
      }
      e.exports = a;
      a.prototype.solve = function (c, b) {
        return 0
      }
        ;
      a.prototype.addEquation = function (c) {
        c.enabled && this.equations.push(c)
      }
        ;
      a.prototype.removeEquation = function (c) {
        var b = this.equations;
        c = b.indexOf(c);
        -1 !== c && b.splice(c, 1)
      }
        ;
      a.prototype.removeAllEquations = function () {
        this.equations.length = 0
      }
    }
      , {}],
    48: [function (d, e, m) {
      function a (t, r, v) {
        g.call(this);
        this.iterations = r;
        this.tolerance = v;
        this.subsolver = t;
        this.nodes = [];
        for (this.nodePool = []; 128 > this.nodePool.length;)
          this.nodePool.push(this.createNode())
      }
      function c (t) {
        for (var r = t.length, v = 0; v !== r; v++) {
          var x = t[v];
          if (!(x.visited || x.body.type & p))
            return x
        }
        return !1
      }
      function b (t, r, v) {
        r.push(t.body);
        r = t.eqs.length;
        for (var x = 0; x !== r; x++) {
          var E = t.eqs[x];
          -1 === v.indexOf(E) && v.push(E)
        }
      }
      function k (t, r) {
        return r.id - t.id
      }
      e.exports = a;
      d("../math/Vec3");
      d("../math/Quaternion");
      var g = d("./Solver");
      d = d("../objects/Body");
      a.prototype = new g;
      var h = []
        , l = []
        , n = {
          bodies: []
        }
        , p = d.STATIC
        , q = [];
      a.prototype.createNode = function () {
        return {
          body: null,
          children: [],
          eqs: [],
          visited: !1
        }
      }
        ;
      a.prototype.solve = function (t, r) {
        for (var v = this.nodePool, x = r.bodies, E = this.equations, z = E.length, F = x.length, U = this.subsolver; v.length < F;)
          v.push(this.createNode());
        h.length = F;
        for (var Q = 0; Q < F; Q++)
          h[Q] = v[Q];
        for (Q = 0; Q !== F; Q++)
          v = h[Q],
            v.body = x[Q],
            v.children.length = 0,
            v.eqs.length = 0,
            v.visited = !1;
        for (F = 0; F !== z; F++) {
          v = E[F];
          Q = x.indexOf(v.bi);
          var K = x.indexOf(v.bj);
          Q = h[Q];
          K = h[K];
          Q.children.push(K);
          Q.eqs.push(v);
          K.children.push(Q);
          K.eqs.push(v)
        }
        x = 0;
        E = l;
        U.tolerance = this.tolerance;
        for (U.iterations = this.iterations; Q = c(h);) {
          E.length = 0;
          n.bodies.length = 0;
          v = Q;
          Q = b;
          z = n.bodies;
          F = E;
          q.push(v);
          v.visited = !0;
          for (Q(v, z, F); q.length;)
            for (v = q.pop(); K = c(v.children);)
              K.visited = !0,
                Q(K, z, F),
                q.push(K);
          z = E.length;
          E = E.sort(k);
          for (Q = 0; Q !== z; Q++)
            U.addEquation(E[Q]);
          U.solve(t, n);
          U.removeAllEquations();
          x++
        }
        return x
      }
    }
      , {
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "../objects/Body": 31,
      "./Solver": 47
    }],
    49: [function (d, e, m) {
      d = function () { }
        ;
      e.exports = d;
      d.prototype = {
        constructor: d,
        addEventListener: function (a, c) {
          void 0 === this._listeners && (this._listeners = {});
          var b = this._listeners;
          void 0 === b[a] && (b[a] = []);
          -1 === b[a].indexOf(c) && b[a].push(c);
          return this
        },
        hasEventListener: function (a, c) {
          if (void 0 === this._listeners)
            return !1;
          var b = this._listeners;
          return void 0 !== b[a] && -1 !== b[a].indexOf(c) ? !0 : !1
        },
        removeEventListener: function (a, c) {
          if (void 0 === this._listeners)
            return this;
          var b = this._listeners;
          if (void 0 === b[a])
            return this;
          var k = b[a].indexOf(c);
          -1 !== k && b[a].splice(k, 1);
          return this
        },
        dispatchEvent: function (a) {
          if (void 0 === this._listeners)
            return this;
          var c = this._listeners[a.type];
          if (void 0 !== c) {
            a.target = this;
            for (var b = 0, k = c.length; b < k; b++)
              c[b].call(this, a)
          }
          return this
        }
      }
    }
      , {}],
    50: [function (d, e, m) {
      function a (l) {
        l = l || {};
        this.root = l.root || null;
        this.aabb = l.aabb ? l.aabb.clone() : new b;
        this.data = [];
        this.children = []
      }
      function c (l, n) {
        n = n || {};
        n.root = null;
        n.aabb = l;
        a.call(this, n);
        this.maxDepth = "undefined" !== typeof n.maxDepth ? n.maxDepth : 8
      }
      var b = d("../collision/AABB")
        , k = d("../math/Vec3");
      e.exports = c;
      c.prototype = new a;
      a.prototype.reset = function (l, n) {
        this.children.length = this.data.length = 0
      }
        ;
      a.prototype.insert = function (l, n, p) {
        var q = this.data;
        p = p || 0;
        if (!this.aabb.contains(l))
          return !1;
        var t = this.children;
        if (p < (this.maxDepth || this.root.maxDepth)) {
          var r = !1;
          t.length || (this.subdivide(),
            r = !0);
          for (var v = 0; 8 !== v; v++)
            if (t[v].insert(l, n, p + 1))
              return !0;
          r && (t.length = 0)
        }
        q.push(n);
        return !0
      }
        ;
      var g = new k;
      a.prototype.subdivide = function () {
        var l = this.aabb
          , n = l.lowerBound
          , p = l.upperBound;
        l = this.children;
        l.push(new a({
          aabb: new b({
            lowerBound: new k(0, 0, 0)
          })
        }), new a({
          aabb: new b({
            lowerBound: new k(1, 0, 0)
          })
        }), new a({
          aabb: new b({
            lowerBound: new k(1, 1, 0)
          })
        }), new a({
          aabb: new b({
            lowerBound: new k(1, 1, 1)
          })
        }), new a({
          aabb: new b({
            lowerBound: new k(0, 1, 1)
          })
        }), new a({
          aabb: new b({
            lowerBound: new k(0, 0, 1)
          })
        }), new a({
          aabb: new b({
            lowerBound: new k(1, 0, 1)
          })
        }), new a({
          aabb: new b({
            lowerBound: new k(0, 1, 0)
          })
        }));
        p.vsub(n, g);
        g.scale(.5, g);
        p = this.root || this;
        for (var q = 0; 8 !== q; q++) {
          var t = l[q];
          t.root = p;
          var r = t.aabb.lowerBound;
          r.x *= g.x;
          r.y *= g.y;
          r.z *= g.z;
          r.vadd(n, r);
          r.vadd(g, t.aabb.upperBound)
        }
      }
        ;
      a.prototype.aabbQuery = function (l, n) {
        for (var p = [this]; p.length;) {
          var q = p.pop();
          q.aabb.overlaps(l) && Array.prototype.push.apply(n, q.data);
          Array.prototype.push.apply(p, q.children)
        }
        return n
      }
        ;
      var h = new b;
      a.prototype.rayQuery = function (l, n, p) {
        l.getAABB(h);
        h.toLocalFrame(n, h);
        this.aabbQuery(h, p);
        return p
      }
        ;
      a.prototype.removeEmptyNodes = function () {
        for (var l = [this]; l.length;) {
          for (var n = l.pop(), p = n.children.length - 1; 0 <= p; p--)
            n.children[p].data.length || n.children.splice(p, 1);
          Array.prototype.push.apply(l, n.children)
        }
      }
    }
      , {
      "../collision/AABB": 3,
      "../math/Vec3": 30
    }],
    51: [function (d, e, m) {
      function a () {
        this.objects = [];
        this.type = Object
      }
      e.exports = a;
      a.prototype.release = function () {
        for (var c = arguments.length, b = 0; b !== c; b++)
          this.objects.push(arguments[b])
      }
        ;
      a.prototype.get = function () {
        return 0 === this.objects.length ? this.constructObject() : this.objects.pop()
      }
        ;
      a.prototype.constructObject = function () {
        throw Error("constructObject() not implemented in this Pool subclass yet!");
      }
    }
      , {}],
    52: [function (d, e, m) {
      function a () {
        this.data = {
          keys: []
        }
      }
      e.exports = a;
      a.prototype.get = function (c, b) {
        if (c > b) {
          var k = b;
          b = c;
          c = k
        }
        return this.data[c + "-" + b]
      }
        ;
      a.prototype.set = function (c, b, k) {
        if (c > b) {
          var g = b;
          b = c;
          c = g
        }
        g = c + "-" + b;
        this.get(c, b) || this.data.keys.push(g);
        this.data[g] = k
      }
        ;
      a.prototype.reset = function () {
        for (var c = this.data, b = c.keys; 0 < b.length;) {
          var k = b.pop();
          delete c[k]
        }
      }
    }
      , {}],
    53: [function (d, e, m) {
      function a () { }
      e.exports = a;
      a.defaults = function (c, b) {
        c = c || {};
        for (var k in b)
          k in c || (c[k] = b[k]);
        return c
      }
    }
      , {}],
    54: [function (d, e, m) {
      function a () {
        b.call(this);
        this.type = c
      }
      e.exports = a;
      var c = d("../math/Vec3")
        , b = d("./Pool");
      a.prototype = new b;
      a.prototype.constructObject = function () {
        return new c
      }
    }
      , {
      "../math/Vec3": 30,
      "./Pool": 51
    }],
    55: [function (d, e, m) {
      function a (N) {
        this.contactPointPool = [];
        this.frictionEquationPool = [];
        this.result = [];
        this.frictionResult = [];
        this.v3pool = new h;
        this.world = N;
        this.currentContactMaterial = null;
        this.enableFrictionReduction = !1
      }
      e.exports = a;
      e = d("../collision/AABB");
      m = d("../shapes/Shape");
      var c = d("../collision/Ray")
        , b = d("../math/Vec3")
        , k = d("../math/Transform");
      d("../shapes/ConvexPolyhedron");
      var g = d("../math/Quaternion");
      d("../solver/Solver");
      var h = d("../utils/Vec3Pool")
        , l = d("../equations/ContactEquation")
        , n = d("../equations/FrictionEquation");
      a.prototype.createContactEquation = function (N, V, ha, ja, Z, ea) {
        if (this.contactPointPool.length) {
          var ka = this.contactPointPool.pop();
          ka.bi = N;
          ka.bj = V
        } else
          ka = new l(N, V);
        ka.enabled = N.collisionResponse && V.collisionResponse && ha.collisionResponse && ja.collisionResponse;
        var pa = this.currentContactMaterial;
        ka.restitution = pa.restitution;
        ka.setSpookParams(pa.contactEquationStiffness, pa.contactEquationRelaxation, this.world.dt);
        N = ha.material || N.material;
        V = ja.material || V.material;
        N && V && 0 <= N.restitution && 0 <= V.restitution && (ka.restitution = N.restitution * V.restitution);
        ka.si = Z || ha;
        ka.sj = ea || ja;
        return ka
      }
        ;
      a.prototype.createFrictionEquationsFromContact = function (N, V) {
        var ha = N.bi
          , ja = N.bj
          , Z = this.world
          , ea = this.currentContactMaterial
          , ka = ea.friction
          , pa = N.si.material || ha.material
          , ma = N.sj.material || ja.material;
        pa && ma && 0 <= pa.friction && 0 <= ma.friction && (ka = pa.friction * ma.friction);
        if (0 < ka) {
          ka *= Z.gravity.length();
          pa = ha.invMass + ja.invMass;
          0 < pa && (pa = 1 / pa);
          var ia = this.frictionEquationPool;
          ma = ia.length ? ia.pop() : new n(ha, ja, ka * pa);
          ia = ia.length ? ia.pop() : new n(ha, ja, ka * pa);
          ma.bi = ia.bi = ha;
          ma.bj = ia.bj = ja;
          ma.minForce = ia.minForce = -ka * pa;
          ma.maxForce = ia.maxForce = ka * pa;
          ma.ri.copy(N.ri);
          ma.rj.copy(N.rj);
          ia.ri.copy(N.ri);
          ia.rj.copy(N.rj);
          N.ni.tangents(ma.t, ia.t);
          ma.setSpookParams(ea.frictionEquationStiffness, ea.frictionEquationRelaxation, Z.dt);
          ia.setSpookParams(ea.frictionEquationStiffness, ea.frictionEquationRelaxation, Z.dt);
          ma.enabled = ia.enabled = N.enabled;
          V.push(ma, ia);
          return !0
        }
        return !1
      }
        ;
      var p = new b
        , q = new b
        , t = new b;
      a.prototype.createFrictionFromAverage = function (N) {
        var V = this.result[this.result.length - 1];
        if (this.createFrictionEquationsFromContact(V, this.frictionResult) && 1 !== N) {
          var ha = this.frictionResult[this.frictionResult.length - 2]
            , ja = this.frictionResult[this.frictionResult.length - 1];
          p.setZero();
          q.setZero();
          t.setZero();
          for (var Z = V.bi, ea = 0; ea !== N; ea++)
            V = this.result[this.result.length - 1 - ea],
              V.bodyA !== Z ? (p.vadd(V.ni, p),
                q.vadd(V.ri, q),
                t.vadd(V.rj, t)) : (p.vsub(V.ni, p),
                  q.vadd(V.rj, q),
                  t.vadd(V.ri, t));
          N = 1 / N;
          q.scale(N, ha.ri);
          t.scale(N, ha.rj);
          ja.ri.copy(ha.ri);
          ja.rj.copy(ha.rj);
          p.normalize();
          p.tangents(ha.t, ja.t)
        }
      }
        ;
      var r = new b
        , v = new b
        , x = new g
        , E = new g;
      a.prototype.getContacts = function (N, V, ha, ja, Z, ea, ka) {
        this.contactPointPool = Z;
        this.frictionEquationPool = ka;
        this.result = ja;
        this.frictionResult = ea;
        ja = 0;
        for (Z = N.length; ja !== Z; ja++) {
          ea = N[ja];
          ka = V[ja];
          var pa = null;
          ea.material && ka.material && (pa = ha.getContactMaterial(ea.material, ka.material) || null);
          for (var ma = 0; ma < ea.shapes.length; ma++) {
            ea.quaternion.mult(ea.shapeOrientations[ma], x);
            ea.quaternion.vmult(ea.shapeOffsets[ma], r);
            r.vadd(ea.position, r);
            for (var ia = ea.shapes[ma], W = 0; W < ka.shapes.length; W++) {
              ka.quaternion.mult(ka.shapeOrientations[W], E);
              ka.quaternion.vmult(ka.shapeOffsets[W], v);
              v.vadd(ka.position, v);
              var sa = ka.shapes[W];
              if (!(r.distanceTo(v) > ia.boundingSphereRadius + sa.boundingSphereRadius)) {
                var oa = null;
                ia.material && sa.material && (oa = ha.getContactMaterial(ia.material, sa.material) || null);
                this.currentContactMaterial = oa || pa || ha.defaultContactMaterial;
                (oa = this[ia.type | sa.type]) && (ia.type < sa.type ? oa.call(this, ia, sa, r, v, x, E, ea, ka, ia, sa) : oa.call(this, sa, ia, v, r, E, x, ka, ea, ia, sa))
              }
            }
          }
        }
      }
        ;
      a.prototype[m.types.BOX | m.types.BOX] = a.prototype.boxBox = function (N, V, ha, ja, Z, ea, ka, pa) {
        N.convexPolyhedronRepresentation.material = N.material;
        V.convexPolyhedronRepresentation.material = V.material;
        N.convexPolyhedronRepresentation.collisionResponse = N.collisionResponse;
        V.convexPolyhedronRepresentation.collisionResponse = V.collisionResponse;
        this.convexConvex(N.convexPolyhedronRepresentation, V.convexPolyhedronRepresentation, ha, ja, Z, ea, ka, pa, N, V)
      }
        ;
      a.prototype[m.types.BOX | m.types.CONVEXPOLYHEDRON] = a.prototype.boxConvex = function (N, V, ha, ja, Z, ea, ka, pa) {
        N.convexPolyhedronRepresentation.material = N.material;
        N.convexPolyhedronRepresentation.collisionResponse = N.collisionResponse;
        this.convexConvex(N.convexPolyhedronRepresentation, V, ha, ja, Z, ea, ka, pa, N, V)
      }
        ;
      a.prototype[m.types.BOX | m.types.PARTICLE] = a.prototype.boxParticle = function (N, V, ha, ja, Z, ea, ka, pa) {
        N.convexPolyhedronRepresentation.material = N.material;
        N.convexPolyhedronRepresentation.collisionResponse = N.collisionResponse;
        this.convexParticle(N.convexPolyhedronRepresentation, V, ha, ja, Z, ea, ka, pa, N, V)
      }
        ;
      a.prototype[m.types.SPHERE] = a.prototype.sphereSphere = function (N, V, ha, ja, Z, ea, ka, pa) {
        Z = this.createContactEquation(ka, pa, N, V);
        ja.vsub(ha, Z.ni);
        Z.ni.normalize();
        Z.ri.copy(Z.ni);
        Z.rj.copy(Z.ni);
        Z.ri.mult(N.radius, Z.ri);
        Z.rj.mult(-V.radius, Z.rj);
        Z.ri.vadd(ha, Z.ri);
        Z.ri.vsub(ka.position, Z.ri);
        Z.rj.vadd(ja, Z.rj);
        Z.rj.vsub(pa.position, Z.rj);
        this.result.push(Z);
        this.createFrictionEquationsFromContact(Z, this.frictionResult)
      }
        ;
      var z = new b
        , F = new b
        , U = new b;
      a.prototype[m.types.PLANE | m.types.TRIMESH] = a.prototype.planeTrimesh = function (N, V, ha, ja, Z, ea, ka, pa) {
        var ma = new b;
        z.set(0, 0, 1);
        Z.vmult(z, z);
        for (Z = 0; Z < V.vertices.length / 3; Z++) {
          V.getVertex(Z, ma);
          var ia = new b;
          ia.copy(ma);
          k.pointToWorldFrame(ja, ea, ia, ma);
          ia = F;
          ma.vsub(ha, ia);
          if (0 >= z.dot(ia)) {
            var W = this.createContactEquation(ka, pa, N, V);
            W.ni.copy(z);
            var sa = U;
            z.scale(ia.dot(z), sa);
            ma.vsub(sa, sa);
            W.ri.copy(sa);
            W.ri.vsub(ka.position, W.ri);
            W.rj.copy(ma);
            W.rj.vsub(pa.position, W.rj);
            this.result.push(W);
            this.createFrictionEquationsFromContact(W, this.frictionResult)
          }
        }
      }
        ;
      var Q = new b
        , K = new b;
      new b;
      var Y = new b
        , C = new b
        , H = new b
        , T = new b
        , M = new b
        , ca = new b
        , P = new b
        , X = new b
        , L = new b
        , A = new b
        , B = new b
        , y = new e
        , u = [];
      a.prototype[m.types.SPHERE | m.types.TRIMESH] = a.prototype.sphereTrimesh = function (N, V, ha, ja, Z, ea, ka, pa) {
        k.pointToLocalFrame(ja, ea, ha, P);
        Z = N.radius;
        y.lowerBound.set(P.x - Z, P.y - Z, P.z - Z);
        y.upperBound.set(P.x + Z, P.y + Z, P.z + Z);
        V.getTrianglesInAABB(y, u);
        var ma = N.radius * N.radius;
        for (Z = 0; Z < u.length; Z++)
          for (var ia = 0; 3 > ia; ia++)
            if (V.getVertex(V.indices[3 * u[Z] + ia], Y),
              Y.vsub(P, K),
              K.norm2() <= ma) {
              C.copy(Y);
              k.pointToWorldFrame(ja, ea, C, Y);
              Y.vsub(ha, K);
              var W = this.createContactEquation(ka, pa, N, V);
              W.ni.copy(K);
              W.ni.normalize();
              W.ri.copy(W.ni);
              W.ri.scale(N.radius, W.ri);
              W.ri.vadd(ha, W.ri);
              W.ri.vsub(ka.position, W.ri);
              W.rj.copy(Y);
              W.rj.vsub(pa.position, W.rj);
              this.result.push(W);
              this.createFrictionEquationsFromContact(W, this.frictionResult)
            }
        for (Z = 0; Z < u.length; Z++)
          for (ia = 0; 3 > ia; ia++)
            V.getVertex(V.indices[3 * u[Z] + ia], H),
              V.getVertex(V.indices[3 * u[Z] + (ia + 1) % 3], T),
              T.vsub(H, M),
              P.vsub(T, X),
              ha = X.dot(M),
              P.vsub(H, X),
              W = X.dot(M),
              0 < W && 0 > ha && (P.vsub(H, X),
                ca.copy(M),
                ca.normalize(),
                W = X.dot(ca),
                ca.scale(W, X),
                X.vadd(H, X),
                ha = X.distanceTo(P),
                ha < N.radius && (W = this.createContactEquation(ka, pa, N, V),
                  X.vsub(P, W.ni),
                  W.ni.normalize(),
                  W.ni.scale(N.radius, W.ri),
                  k.pointToWorldFrame(ja, ea, X, X),
                  X.vsub(pa.position, W.rj),
                  k.vectorToWorldFrame(ea, W.ni, W.ni),
                  k.vectorToWorldFrame(ea, W.ri, W.ri),
                  this.result.push(W),
                  this.createFrictionEquationsFromContact(W, this.frictionResult)));
        Z = 0;
        for (ia = u.length; Z !== ia; Z++)
          V.getTriangleVertices(u[Z], L, A, B),
            V.getNormal(u[Z], Q),
            P.vsub(L, X),
            ha = X.dot(Q),
            Q.scale(ha, X),
            P.vsub(X, X),
            ha = X.distanceTo(P),
            c.pointInTriangle(X, L, A, B) && ha < N.radius && (W = this.createContactEquation(ka, pa, N, V),
              X.vsub(P, W.ni),
              W.ni.normalize(),
              W.ni.scale(N.radius, W.ri),
              k.pointToWorldFrame(ja, ea, X, X),
              X.vsub(pa.position, W.rj),
              k.vectorToWorldFrame(ea, W.ni, W.ni),
              k.vectorToWorldFrame(ea, W.ri, W.ri),
              this.result.push(W),
              this.createFrictionEquationsFromContact(W, this.frictionResult));
        u.length = 0
      }
        ;
      var w = new b
        , D = new b;
      a.prototype[m.types.SPHERE | m.types.PLANE] = a.prototype.spherePlane = function (N, V, ha, ja, Z, ea, ka, pa) {
        V = this.createContactEquation(ka, pa, N, V);
        V.ni.set(0, 0, 1);
        ea.vmult(V.ni, V.ni);
        V.ni.negate(V.ni);
        V.ni.normalize();
        V.ni.mult(N.radius, V.ri);
        ha.vsub(ja, w);
        V.ni.mult(V.ni.dot(w), D);
        w.vsub(D, V.rj);
        -w.dot(V.ni) <= N.radius && (N = V.ri,
          ea = V.rj,
          N.vadd(ha, N),
          N.vsub(ka.position, N),
          ea.vadd(ja, ea),
          ea.vsub(pa.position, ea),
          this.result.push(V),
          this.createFrictionEquationsFromContact(V, this.frictionResult))
      }
        ;
      var O = new b
        , J = new b
        , G = new b
        , S = new b
        , ba = new b
        , I = new b
        , qa = new b
        , la = [new b, new b, new b, new b, new b, new b]
        , fa = new b
        , R = new b
        , aa = new b
        , da = new b;
      a.prototype[m.types.SPHERE | m.types.BOX] = a.prototype.sphereBox = function (N, V, ha, ja, Z, ea, ka, pa) {
        Z = this.v3pool;
        ha.vsub(ja, S);
        V.getSideNormals(la, ea);
        ea = N.radius;
        for (var ma = !1, ia = null, W = 0, sa = 0, oa = 0, va = null, wa = 0, xa = la.length; wa !== xa && !1 === ma; wa++) {
          var ya = ba;
          ya.copy(la[wa]);
          var za = ya.norm();
          ya.normalize();
          var ta = S.dot(ya);
          if (ta < za + ea && 0 < ta) {
            var Aa = I
              , Ba = qa;
            Aa.copy(la[(wa + 1) % 3]);
            Ba.copy(la[(wa + 2) % 3]);
            var Ca = Aa.norm()
              , Ga = Ba.norm();
            Aa.normalize();
            Ba.normalize();
            var Ea = S.dot(Aa)
              , Fa = S.dot(Ba);
            Ea < Ca && Ea > -Ca && Fa < Ga && Fa > -Ga && (ta = Math.abs(ta - za - ea),
              null === va || ta < va) && (va = ta,
                sa = Ea,
                oa = Fa,
                ia = za,
                R.copy(ya),
                aa.copy(Aa),
                da.copy(Ba),
                W++)
          }
        }
        W && (ma = !0,
          W = this.createContactEquation(ka, pa, N, V),
          R.mult(-ea, W.ri),
          W.ni.copy(R),
          W.ni.negate(W.ni),
          R.mult(ia, R),
          aa.mult(sa, aa),
          R.vadd(aa, R),
          da.mult(oa, da),
          R.vadd(da, W.rj),
          W.ri.vadd(ha, W.ri),
          W.ri.vsub(ka.position, W.ri),
          W.rj.vadd(ja, W.rj),
          W.rj.vsub(pa.position, W.rj),
          this.result.push(W),
          this.createFrictionEquationsFromContact(W, this.frictionResult));
        ta = Z.get();
        for (ia = 0; 2 !== ia && !ma; ia++)
          for (sa = 0; 2 !== sa && !ma; sa++)
            for (oa = 0; 2 !== oa && !ma; oa++)
              ta.set(0, 0, 0),
                ia ? ta.vadd(la[0], ta) : ta.vsub(la[0], ta),
                sa ? ta.vadd(la[1], ta) : ta.vsub(la[1], ta),
                oa ? ta.vadd(la[2], ta) : ta.vsub(la[2], ta),
                ja.vadd(ta, fa),
                fa.vsub(ha, fa),
                fa.norm2() < ea * ea && (ma = !0,
                  W = this.createContactEquation(ka, pa, N, V),
                  W.ri.copy(fa),
                  W.ri.normalize(),
                  W.ni.copy(W.ri),
                  W.ri.mult(ea, W.ri),
                  W.rj.copy(ta),
                  W.ri.vadd(ha, W.ri),
                  W.ri.vsub(ka.position, W.ri),
                  W.rj.vadd(ja, W.rj),
                  W.rj.vsub(pa.position, W.rj),
                  this.result.push(W),
                  this.createFrictionEquationsFromContact(W, this.frictionResult));
        Z.release(ta);
        va = Z.get();
        wa = Z.get();
        W = Z.get();
        xa = Z.get();
        ta = Z.get();
        ya = la.length;
        for (ia = 0; ia !== ya && !ma; ia++)
          for (sa = 0; sa !== ya && !ma; sa++)
            if (ia % 3 !== sa % 3) {
              la[sa].cross(la[ia], va);
              va.normalize();
              la[ia].vadd(la[sa], wa);
              W.copy(ha);
              W.vsub(wa, W);
              W.vsub(ja, W);
              za = W.dot(va);
              va.mult(za, xa);
              for (oa = 0; oa === ia % 3 || oa === sa % 3;)
                oa++;
              ta.copy(ha);
              ta.vsub(xa, ta);
              ta.vsub(wa, ta);
              ta.vsub(ja, ta);
              za = Math.abs(za);
              Aa = ta.norm();
              za < la[oa].norm() && Aa < ea && (ma = !0,
                oa = this.createContactEquation(ka, pa, N, V),
                wa.vadd(xa, oa.rj),
                oa.rj.copy(oa.rj),
                ta.negate(oa.ni),
                oa.ni.normalize(),
                oa.ri.copy(oa.rj),
                oa.ri.vadd(ja, oa.ri),
                oa.ri.vsub(ha, oa.ri),
                oa.ri.normalize(),
                oa.ri.mult(ea, oa.ri),
                oa.ri.vadd(ha, oa.ri),
                oa.ri.vsub(ka.position, oa.ri),
                oa.rj.vadd(ja, oa.rj),
                oa.rj.vsub(pa.position, oa.rj),
                this.result.push(oa),
                this.createFrictionEquationsFromContact(oa, this.frictionResult))
            }
        Z.release(va, wa, W, xa, ta)
      }
        ;
      var na = new b
        , ua = new b
        , ra = new b
        , Da = new b
        , Ra = new b
        , Sa = new b
        , Ua = new b
        , eb = new b
        , fb = new b
        , gb = new b;
      a.prototype[m.types.SPHERE | m.types.CONVEXPOLYHEDRON] = a.prototype.sphereConvex = function (N, V, ha, ja, Z, ea, ka, pa) {
        Z = this.v3pool;
        ha.vsub(ja, na);
        for (var ma = V.faceNormals, ia = V.faces, W = V.vertices, sa = N.radius, oa = 0; oa !== W.length; oa++) {
          var va = Ra;
          ea.vmult(W[oa], va);
          ja.vadd(va, va);
          var wa = Da;
          va.vsub(ha, wa);
          if (wa.norm2() < sa * sa) {
            N = this.createContactEquation(ka, pa, N, V);
            N.ri.copy(wa);
            N.ri.normalize();
            N.ni.copy(N.ri);
            N.ri.mult(sa, N.ri);
            va.vsub(ja, N.rj);
            N.ri.vadd(ha, N.ri);
            N.ri.vsub(ka.position, N.ri);
            N.rj.vadd(ja, N.rj);
            N.rj.vsub(pa.position, N.rj);
            this.result.push(N);
            this.createFrictionEquationsFromContact(N, this.frictionResult);
            return
          }
        }
        oa = 0;
        for (va = ia.length; oa !== va; oa++) {
          wa = ia[oa];
          var xa = Sa;
          ea.vmult(ma[oa], xa);
          var ya = Ua;
          ea.vmult(W[wa[0]], ya);
          ya.vadd(ja, ya);
          var za = eb;
          xa.mult(-sa, za);
          ha.vadd(za, za);
          var ta = fb;
          za.vsub(ya, ta);
          za = ta.dot(xa);
          ta = gb;
          ha.vsub(ya, ta);
          if (0 > za && 0 < ta.dot(xa)) {
            ya = [];
            ta = 0;
            for (var Aa = wa.length; ta !== Aa; ta++) {
              var Ba = Z.get();
              ea.vmult(W[wa[ta]], Ba);
              ja.vadd(Ba, Ba);
              ya.push(Ba)
            }
            a: {
              ta = ya;
              Aa = xa;
              Ba = ha;
              for (var Ca = null, Ga = ta.length, Ea = 0; Ea !== Ga; Ea++) {
                var Fa = ta[Ea]
                  , Ta = O;
                ta[(Ea + 1) % Ga].vsub(Fa, Ta);
                var $a = J;
                Ta.cross(Aa, $a);
                Ta = G;
                Ba.vsub(Fa, Ta);
                Fa = $a.dot(Ta);
                if (null === Ca || 0 < Fa && !0 === Ca || 0 >= Fa && !1 === Ca)
                  null === Ca && (Ca = 0 < Fa);
                else {
                  ta = !1;
                  break a
                }
              }
              ta = !0
            }
            if (ta) {
              N = this.createContactEquation(ka, pa, N, V);
              xa.mult(-sa, N.ri);
              xa.negate(N.ni);
              V = Z.get();
              xa.mult(-za, V);
              ea = Z.get();
              xa.mult(-sa, ea);
              ha.vsub(ja, N.rj);
              N.rj.vadd(ea, N.rj);
              N.rj.vadd(V, N.rj);
              N.rj.vadd(ja, N.rj);
              N.rj.vsub(pa.position, N.rj);
              N.ri.vadd(ha, N.ri);
              N.ri.vsub(ka.position, N.ri);
              Z.release(V);
              Z.release(ea);
              this.result.push(N);
              this.createFrictionEquationsFromContact(N, this.frictionResult);
              ta = 0;
              for (wa = ya.length; ta !== wa; ta++)
                Z.release(ya[ta]);
              break
            } else
              for (ta = 0; ta !== wa.length; ta++) {
                xa = Z.get();
                za = Z.get();
                ea.vmult(W[wa[(ta + 1) % wa.length]], xa);
                ea.vmult(W[wa[(ta + 2) % wa.length]], za);
                ja.vadd(xa, xa);
                ja.vadd(za, za);
                Ga = ua;
                za.vsub(xa, Ga);
                Ca = ra;
                Ga.unit(Ca);
                Aa = Z.get();
                Ba = Z.get();
                ha.vsub(xa, Ba);
                Ea = Ba.dot(Ca);
                Ca.mult(Ea, Aa);
                Aa.vadd(xa, Aa);
                Ca = Z.get();
                Aa.vsub(ha, Ca);
                if (0 < Ea && Ea * Ea < Ga.norm2() && Ca.norm2() < sa * sa) {
                  N = this.createContactEquation(ka, pa, N, V);
                  Aa.vsub(ja, N.rj);
                  Aa.vsub(ha, N.ni);
                  N.ni.normalize();
                  N.ni.mult(sa, N.ri);
                  N.rj.vadd(ja, N.rj);
                  N.rj.vsub(pa.position, N.rj);
                  N.ri.vadd(ha, N.ri);
                  N.ri.vsub(ka.position, N.ri);
                  this.result.push(N);
                  this.createFrictionEquationsFromContact(N, this.frictionResult);
                  ta = 0;
                  for (wa = ya.length; ta !== wa; ta++)
                    Z.release(ya[ta]);
                  Z.release(xa);
                  Z.release(za);
                  Z.release(Aa);
                  Z.release(Ca);
                  Z.release(Ba);
                  return
                }
                Z.release(xa);
                Z.release(za);
                Z.release(Aa);
                Z.release(Ca);
                Z.release(Ba)
              }
            ta = 0;
            for (wa = ya.length; ta !== wa; ta++)
              Z.release(ya[ta])
          }
        }
      }
        ;
      new b;
      new b;
      a.prototype[m.types.PLANE | m.types.BOX] = a.prototype.planeBox = function (N, V, ha, ja, Z, ea, ka, pa) {
        V.convexPolyhedronRepresentation.material = V.material;
        V.convexPolyhedronRepresentation.collisionResponse = V.collisionResponse;
        this.planeConvex(N, V.convexPolyhedronRepresentation, ha, ja, Z, ea, ka, pa)
      }
        ;
      var Ha = new b
        , Ia = new b
        , Xa = new b
        , hb = new b;
      a.prototype[m.types.PLANE | m.types.CONVEXPOLYHEDRON] = a.prototype.planeConvex = function (N, V, ha, ja, Z, ea, ka, pa) {
        Ia.set(0, 0, 1);
        Z.vmult(Ia, Ia);
        for (var ma = Z = 0; ma !== V.vertices.length; ma++)
          if (Ha.copy(V.vertices[ma]),
            ea.vmult(Ha, Ha),
            ja.vadd(Ha, Ha),
            Ha.vsub(ha, Xa),
            0 >= Ia.dot(Xa)) {
            var ia = this.createContactEquation(ka, pa, N, V)
              , W = hb;
            Ia.mult(Ia.dot(Xa), W);
            Ha.vsub(W, W);
            W.vsub(ha, ia.ri);
            ia.ni.copy(Ia);
            Ha.vsub(ja, ia.rj);
            ia.ri.vadd(ha, ia.ri);
            ia.ri.vsub(ka.position, ia.ri);
            ia.rj.vadd(ja, ia.rj);
            ia.rj.vsub(pa.position, ia.rj);
            this.result.push(ia);
            Z++;
            this.enableFrictionReduction || this.createFrictionEquationsFromContact(ia, this.frictionResult)
          }
        this.enableFrictionReduction && Z && this.createFrictionFromAverage(Z)
      }
        ;
      var Ya = new b
        , Va = new b;
      a.prototype[m.types.CONVEXPOLYHEDRON] = a.prototype.convexConvex = function (N, V, ha, ja, Z, ea, ka, pa, ma, ia, W, sa) {
        if (!(ha.distanceTo(ja) > N.boundingSphereRadius + V.boundingSphereRadius) && N.findSeparatingAxis(V, ha, Z, ja, ea, Ya, W, sa)) {
          W = [];
          N.clipAgainstHull(ha, Z, V, ja, ea, Ya, -100, 100, W);
          for (ea = Z = 0; ea !== W.length; ea++) {
            sa = this.createContactEquation(ka, pa, N, V, ma, ia);
            var oa = sa.ri
              , va = sa.rj;
            Ya.negate(sa.ni);
            W[ea].normal.negate(Va);
            Va.mult(W[ea].depth, Va);
            W[ea].point.vadd(Va, oa);
            va.copy(W[ea].point);
            oa.vsub(ha, oa);
            va.vsub(ja, va);
            oa.vadd(ha, oa);
            oa.vsub(ka.position, oa);
            va.vadd(ja, va);
            va.vsub(pa.position, va);
            this.result.push(sa);
            Z++;
            this.enableFrictionReduction || this.createFrictionEquationsFromContact(sa, this.frictionResult)
          }
          this.enableFrictionReduction && Z && this.createFrictionFromAverage(Z)
        }
      }
        ;
      var Ja = new b
        , ab = new b
        , Wa = new b;
      a.prototype[m.types.PLANE | m.types.PARTICLE] = a.prototype.planeParticle = function (N, V, ha, ja, Z, ea, ka, pa) {
        Ja.set(0, 0, 1);
        ka.quaternion.vmult(Ja, Ja);
        ja.vsub(ka.position, ab);
        0 >= Ja.dot(ab) && (N = this.createContactEquation(pa, ka, V, N),
          N.ni.copy(Ja),
          N.ni.negate(N.ni),
          N.ri.set(0, 0, 0),
          Ja.mult(Ja.dot(ja), Wa),
          ja.vsub(Wa, Wa),
          N.rj.copy(Wa),
          this.result.push(N),
          this.createFrictionEquationsFromContact(N, this.frictionResult))
      }
        ;
      var Ma = new b;
      a.prototype[m.types.PARTICLE | m.types.SPHERE] = a.prototype.sphereParticle = function (N, V, ha, ja, Z, ea, ka, pa) {
        Ma.set(0, 0, 1);
        ja.vsub(ha, Ma);
        Ma.norm2() <= N.radius * N.radius && (V = this.createContactEquation(pa, ka, V, N),
          Ma.normalize(),
          V.rj.copy(Ma),
          V.rj.mult(N.radius, V.rj),
          V.ni.copy(Ma),
          V.ni.negate(V.ni),
          V.ri.set(0, 0, 0),
          this.result.push(V),
          this.createFrictionEquationsFromContact(V, this.frictionResult))
      }
        ;
      var bb = new g
        , Na = new b;
      new b;
      var Za = new b
        , cb = new b
        , Oa = new b;
      a.prototype[m.types.PARTICLE | m.types.CONVEXPOLYHEDRON] = a.prototype.convexParticle = function (N, V, ha, ja, Z, ea, ka, pa) {
        var ma = -1;
        ea = null;
        var ia = 0;
        Na.copy(ja);
        Na.vsub(ha, Na);
        Z.conjugate(bb);
        bb.vmult(Na, Na);
        if (N.pointIsInside(Na)) {
          N.worldVerticesNeedsUpdate && N.computeWorldVertices(ha, Z);
          N.worldFaceNormalsNeedsUpdate && N.computeWorldFaceNormals(Z);
          Z = 0;
          for (var W = N.faces.length; Z !== W; Z++) {
            var sa = N.worldFaceNormals[Z];
            ja.vsub(N.worldVertices[N.faces[Z][0]], cb);
            var oa = -sa.dot(cb);
            if (null === ea || Math.abs(oa) < Math.abs(ea))
              ea = oa,
                ma = Z,
                Za.copy(sa),
                ia++
          }
          -1 !== ma ? (N = this.createContactEquation(pa, ka, V, N),
            Za.mult(ea, Oa),
            Oa.vadd(ja, Oa),
            Oa.vsub(ha, Oa),
            N.rj.copy(Oa),
            Za.negate(N.ni),
            N.ri.set(0, 0, 0),
            V = N.ri,
            ea = N.rj,
            V.vadd(ja, V),
            V.vsub(pa.position, V),
            ea.vadd(ha, ea),
            ea.vsub(ka.position, ea),
            this.result.push(N),
            this.createFrictionEquationsFromContact(N, this.frictionResult)) : console.warn("Point found inside convex, but did not find penetrating face!")
        }
      }
        ;
      a.prototype[m.types.BOX | m.types.HEIGHTFIELD] = a.prototype.boxHeightfield = function (N, V, ha, ja, Z, ea, ka, pa) {
        N.convexPolyhedronRepresentation.material = N.material;
        N.convexPolyhedronRepresentation.collisionResponse = N.collisionResponse;
        this.convexHeightfield(N.convexPolyhedronRepresentation, V, ha, ja, Z, ea, ka, pa)
      }
        ;
      var Ka = new b
        , Pa = new b
        , db = [0];
      a.prototype[m.types.CONVEXPOLYHEDRON | m.types.HEIGHTFIELD] = a.prototype.convexHeightfield = function (N, V, ha, ja, Z, ea, ka, pa) {
        var ma = V.data
          , ia = V.elementSize
          , W = N.boundingSphereRadius;
        k.pointToLocalFrame(ja, ea, ha, Ka);
        var sa = Math.floor((Ka.x - W) / ia) - 1
          , oa = Math.ceil((Ka.x + W) / ia) + 1
          , va = Math.floor((Ka.y - W) / ia) - 1;
        ia = Math.ceil((Ka.y + W) / ia) + 1;
        if (!(0 > oa || 0 > ia || sa > ma.length || va > ma[0].length)) {
          0 > sa && (sa = 0);
          0 > oa && (oa = 0);
          0 > va && (va = 0);
          0 > ia && (ia = 0);
          sa >= ma.length && (sa = ma.length - 1);
          oa >= ma.length && (oa = ma.length - 1);
          ia >= ma[0].length && (ia = ma[0].length - 1);
          va >= ma[0].length && (va = ma[0].length - 1);
          ma = [];
          V.getRectMinMax(sa, va, oa, ia, ma);
          var wa = ma[0];
          if (!(Ka.z - W > ma[1] || Ka.z + W < wa))
            for (W = sa; W < oa; W++)
              for (sa = va; sa < ia; sa++)
                V.getConvexTrianglePillar(W, sa, !1),
                  k.pointToWorldFrame(ja, ea, V.pillarOffset, Pa),
                  ha.distanceTo(Pa) < V.pillarConvex.boundingSphereRadius + N.boundingSphereRadius && this.convexConvex(N, V.pillarConvex, ha, Pa, Z, ea, ka, pa, null, null, db, null),
                  V.getConvexTrianglePillar(W, sa, !0),
                  k.pointToWorldFrame(ja, ea, V.pillarOffset, Pa),
                  ha.distanceTo(Pa) < V.pillarConvex.boundingSphereRadius + N.boundingSphereRadius && this.convexConvex(N, V.pillarConvex, ha, Pa, Z, ea, ka, pa, null, null, db, null)
        }
      }
        ;
      var La = new b
        , Qa = new b;
      a.prototype[m.types.SPHERE | m.types.HEIGHTFIELD] = a.prototype.sphereHeightfield = function (N, V, ha, ja, Z, ea, ka, pa) {
        var ma = V.data
          , ia = N.radius
          , W = V.elementSize;
        k.pointToLocalFrame(ja, ea, ha, La);
        var sa = Math.floor((La.x - ia) / W) - 1
          , oa = Math.ceil((La.x + ia) / W) + 1
          , va = Math.floor((La.y - ia) / W) - 1;
        W = Math.ceil((La.y + ia) / W) + 1;
        if (!(0 > oa || 0 > W || sa > ma.length || W > ma[0].length)) {
          0 > sa && (sa = 0);
          0 > oa && (oa = 0);
          0 > va && (va = 0);
          0 > W && (W = 0);
          sa >= ma.length && (sa = ma.length - 1);
          oa >= ma.length && (oa = ma.length - 1);
          W >= ma[0].length && (W = ma[0].length - 1);
          va >= ma[0].length && (va = ma[0].length - 1);
          ma = [];
          V.getRectMinMax(sa, va, oa, W, ma);
          var wa = ma[0];
          if (!(La.z - ia > ma[1] || La.z + ia < wa))
            for (ia = this.result; sa < oa; sa++)
              for (ma = va; ma < W; ma++)
                if (wa = ia.length,
                  V.getConvexTrianglePillar(sa, ma, !1),
                  k.pointToWorldFrame(ja, ea, V.pillarOffset, Qa),
                  ha.distanceTo(Qa) < V.pillarConvex.boundingSphereRadius + N.boundingSphereRadius && this.sphereConvex(N, V.pillarConvex, ha, Qa, Z, ea, ka, pa),
                  V.getConvexTrianglePillar(sa, ma, !0),
                  k.pointToWorldFrame(ja, ea, V.pillarOffset, Qa),
                  ha.distanceTo(Qa) < V.pillarConvex.boundingSphereRadius + N.boundingSphereRadius && this.sphereConvex(N, V.pillarConvex, ha, Qa, Z, ea, ka, pa),
                  2 < ia.length - wa)
                  return
        }
      }
    }
      , {
      "../collision/AABB": 3,
      "../collision/Ray": 9,
      "../equations/ContactEquation": 19,
      "../equations/FrictionEquation": 21,
      "../math/Quaternion": 28,
      "../math/Transform": 29,
      "../math/Vec3": 30,
      "../shapes/ConvexPolyhedron": 38,
      "../shapes/Shape": 43,
      "../solver/Solver": 47,
      "../utils/Vec3Pool": 54
    }],
    56: [function (d, e, m) {
      function a () {
        g.apply(this);
        this.dt = -1;
        this.allowSleep = !1;
        this.contacts = [];
        this.frictionEquations = [];
        this.quatNormalizeSkip = 0;
        this.quatNormalizeFast = !1;
        this.stepnumber = this.time = 0;
        this.default_dt = 1 / 60;
        this.nextId = 0;
        this.gravity = new c;
        this.broadphase = new v;
        this.bodies = [];
        this.solver = new b;
        this.constraints = [];
        this.narrowphase = new k(this);
        this.collisionMatrix = new h;
        this.collisionMatrixPrevious = new h;
        this.materials = [];
        this.contactmaterials = [];
        this.contactMaterialTable = new q;
        this.defaultMaterial = new l("default");
        this.defaultContactMaterial = new n(this.defaultMaterial, this.defaultMaterial, {
          friction: .3,
          restitution: 0
        });
        this.doProfiling = !1;
        this.profile = {
          solve: 0,
          makeContactConstraints: 0,
          broadphase: 0,
          integrate: 0,
          narrowphase: 0
        };
        this.subsystems = [];
        this.addBodyEvent = {
          type: "addBody",
          body: null
        };
        this.removeBodyEvent = {
          type: "removeBody",
          body: null
        }
      }
      e.exports = a;
      d("../shapes/Shape");
      var c = d("../math/Vec3");
      e = d("../math/Quaternion");
      var b = d("../solver/GSSolver");
      d("../utils/Vec3Pool");
      d("../equations/ContactEquation");
      d("../equations/FrictionEquation");
      var k = d("./Narrowphase")
        , g = d("../utils/EventTarget")
        , h = d("../collision/ArrayCollisionMatrix")
        , l = d("../material/Material")
        , n = d("../material/ContactMaterial")
        , p = d("../objects/Body")
        , q = d("../utils/TupleDictionary")
        , t = d("../collision/RaycastResult");
      m = d("../collision/AABB");
      var r = d("../collision/Ray")
        , v = d("../collision/NaiveBroadphase");
      a.prototype = new g;
      new m;
      var x = new r;
      a.prototype.getContactMaterial = function (P, X) {
        return this.contactMaterialTable.get(P.id, X.id)
      }
        ;
      a.prototype.numObjects = function () {
        return this.bodies.length
      }
        ;
      a.prototype.collisionMatrixTick = function () {
        var P = this.collisionMatrixPrevious;
        this.collisionMatrixPrevious = this.collisionMatrix;
        this.collisionMatrix = P;
        this.collisionMatrix.reset()
      }
        ;
      a.prototype.add = a.prototype.addBody = function (P) {
        -1 === this.bodies.indexOf(P) && (P.index = this.bodies.length,
          this.bodies.push(P),
          P.world = this,
          P.initPosition.copy(P.position),
          P.initVelocity.copy(P.velocity),
          P.timeLastSleepy = this.time,
          P instanceof p && (P.initAngularVelocity.copy(P.angularVelocity),
            P.initQuaternion.copy(P.quaternion)),
          this.collisionMatrix.setNumObjects(this.bodies.length),
          this.addBodyEvent.body = P,
          this.dispatchEvent(this.addBodyEvent))
      }
        ;
      a.prototype.addConstraint = function (P) {
        this.constraints.push(P)
      }
        ;
      a.prototype.removeConstraint = function (P) {
        P = this.constraints.indexOf(P);
        -1 !== P && this.constraints.splice(P, 1)
      }
        ;
      a.prototype.rayTest = function (P, X, L) {
        L instanceof t ? this.raycastClosest(P, X, {
          skipBackfaces: !0
        }, L) : this.raycastAll(P, X, {
          skipBackfaces: !0
        }, L)
      }
        ;
      a.prototype.raycastAll = function (P, X, L, A) {
        L.mode = r.ALL;
        L.from = P;
        L.to = X;
        L.callback = A;
        return x.intersectWorld(this, L)
      }
        ;
      a.prototype.raycastAny = function (P, X, L, A) {
        L.mode = r.ANY;
        L.from = P;
        L.to = X;
        L.result = A;
        return x.intersectWorld(this, L)
      }
        ;
      a.prototype.raycastClosest = function (P, X, L, A) {
        L.mode = r.CLOSEST;
        L.from = P;
        L.to = X;
        L.result = A;
        return x.intersectWorld(this, L)
      }
        ;
      a.prototype.remove = function (P) {
        P.world = null;
        var X = this.bodies.length - 1
          , L = this.bodies
          , A = L.indexOf(P);
        if (-1 !== A) {
          L.splice(A, 1);
          for (A = 0; A !== L.length; A++)
            L[A].index = A;
          this.collisionMatrix.setNumObjects(X);
          this.removeBodyEvent.body = P;
          this.dispatchEvent(this.removeBodyEvent)
        }
      }
        ;
      a.prototype.removeBody = a.prototype.remove;
      a.prototype.addMaterial = function (P) {
        this.materials.push(P)
      }
        ;
      a.prototype.addContactMaterial = function (P) {
        this.contactmaterials.push(P);
        this.contactMaterialTable.set(P.materials[0].id, P.materials[1].id, P)
      }
        ;
      "undefined" === typeof performance && (performance = {});
      if (!performance.now) {
        var E = Date.now();
        performance.timing && performance.timing.navigationStart && (E = performance.timing.navigationStart);
        performance.now = function () {
          return Date.now() - E
        }
      }
      var z = new c;
      a.prototype.step = function (P, X, L) {
        L = L || 10;
        X = X || 0;
        if (0 === X)
          this.internalStep(P),
            this.time += P;
        else {
          var A = Math.floor((this.time + X) / P) - Math.floor(this.time / P);
          A = Math.min(A, L);
          L = performance.now();
          for (var B = 0; B !== A && !(this.internalStep(P),
            performance.now() - L > 1E3 * P); B++)
            ;
          this.time += X;
          P = this.time % P / P;
          X = this.bodies;
          for (A = 0; A !== X.length; A++)
            L = X[A],
              L.type !== p.STATIC && L.sleepState !== p.SLEEPING ? (L.position.vsub(L.previousPosition, z),
                z.scale(P, z),
                L.position.vadd(z, L.interpolatedPosition)) : (L.interpolatedPosition.copy(L.position),
                  L.interpolatedQuaternion.copy(L.quaternion))
        }
      }
        ;
      var F = {
        type: "postStep"
      }
        , U = {
          type: "preStep"
        }
        , Q = {
          type: "collide",
          body: null,
          contact: null
        }
        , K = []
        , Y = []
        , C = []
        , H = [];
      new c;
      new c;
      new c;
      new c;
      new c;
      new c;
      new c;
      new c;
      new c;
      new e;
      var T = new e
        , M = new e
        , ca = new c;
      a.prototype.internalStep = function (P) {
        this.dt = P;
        var X = this.contacts, L = this.numObjects(), A = this.bodies, B = this.solver, y = this.gravity, u = this.doProfiling, w = this.profile, D = p.DYNAMIC, O, J = this.constraints;
        y.norm();
        var G = y.x
          , S = y.y
          , ba = y.z;
        u && (O = performance.now());
        for (y = 0; y !== L; y++) {
          var I = A[y];
          if (I.type & D) {
            var qa = I.force;
            I = I.mass;
            qa.x += I * G;
            qa.y += I * S;
            qa.z += I * ba
          }
        }
        y = 0;
        for (I = this.subsystems.length; y !== I; y++)
          this.subsystems[y].update();
        u && (O = performance.now());
        C.length = 0;
        H.length = 0;
        this.broadphase.collisionPairs(this, C, H);
        u && (w.broadphase = performance.now() - O);
        I = J.length;
        for (y = 0; y !== I; y++)
          if (G = J[y],
            !G.collideConnected)
            for (S = C.length - 1; 0 <= S; --S)
              if (G.bodyA === C[S] && G.bodyB === H[S] || G.bodyB === C[S] && G.bodyA === H[S])
                C.splice(S, 1),
                  H.splice(S, 1);
        this.collisionMatrixTick();
        u && (O = performance.now());
        I = X.length;
        for (y = 0; y !== I; y++)
          K.push(X[y]);
        X.length = 0;
        I = this.frictionEquations.length;
        for (y = 0; y !== I; y++)
          Y.push(this.frictionEquations[y]);
        this.frictionEquations.length = 0;
        this.narrowphase.getContacts(C, H, this, X, K, this.frictionEquations, Y);
        u && (w.narrowphase = performance.now() - O);
        u && (O = performance.now());
        for (y = 0; y < this.frictionEquations.length; y++)
          B.addEquation(this.frictionEquations[y]);
        y = X.length;
        for (S = 0; S !== y; S++)
          G = X[S],
            I = G.bi,
            ba = G.bj,
            I.material && ba.material && this.getContactMaterial(I.material, ba.material),
            I.material && ba.material && 0 <= I.material.restitution && 0 <= ba.material.restitution && (G.restitution = I.material.restitution * ba.material.restitution),
            B.addEquation(G),
            I.allowSleep && I.type === p.DYNAMIC && I.sleepState === p.SLEEPING && ba.sleepState === p.AWAKE && ba.type !== p.STATIC && ba.velocity.norm2() + ba.angularVelocity.norm2() >= 2 * Math.pow(ba.sleepSpeedLimit, 2) && (I._wakeUpAfterNarrowphase = !0),
            ba.allowSleep && ba.type === p.DYNAMIC && ba.sleepState === p.SLEEPING && I.sleepState === p.AWAKE && I.type !== p.STATIC && I.velocity.norm2() + I.angularVelocity.norm2() >= 2 * Math.pow(I.sleepSpeedLimit, 2) && (ba._wakeUpAfterNarrowphase = !0),
            this.collisionMatrix.set(I, ba, !0),
            this.collisionMatrixPrevious.get(I, ba) || (Q.body = ba,
              Q.contact = G,
              I.dispatchEvent(Q),
              Q.body = I,
              ba.dispatchEvent(Q));
        u && (w.makeContactConstraints = performance.now() - O,
          O = performance.now());
        for (y = 0; y !== L; y++)
          I = A[y],
            I._wakeUpAfterNarrowphase && (I.wakeUp(),
              I._wakeUpAfterNarrowphase = !1);
        I = J.length;
        for (y = 0; y !== I; y++)
          for (G = J[y],
            G.update(),
            S = 0,
            X = G.equations.length; S !== X; S++)
            B.addEquation(G.equations[S]);
        B.solve(P, this);
        u && (w.solve = performance.now() - O);
        B.removeAllEquations();
        B = Math.pow;
        for (y = 0; y !== L; y++)
          if (I = A[y],
            I.type & D && (J = B(1 - I.linearDamping, P),
              X = I.velocity,
              X.mult(J, X),
              J = I.angularVelocity))
            X = B(1 - I.angularDamping, P),
              J.mult(X, J);
        this.dispatchEvent(U);
        for (y = 0; y !== L; y++)
          I = A[y],
            I.preStep && I.preStep.call(I);
        u && (O = performance.now());
        D = p.DYNAMIC | p.KINEMATIC;
        B = 0 === this.stepnumber % (this.quatNormalizeSkip + 1);
        J = this.quatNormalizeFast;
        X = .5 * P;
        for (y = 0; y !== L; y++)
          if (I = A[y],
            G = I.force,
            S = I.torque,
            I.type & D && I.sleepState !== p.SLEEPING) {
            ba = I.velocity;
            qa = I.angularVelocity;
            var la = I.position
              , fa = I.quaternion
              , R = I.invMass
              , aa = I.invInertiaWorld;
            ba.x += G.x * R * P;
            ba.y += G.y * R * P;
            ba.z += G.z * R * P;
            I.angularVelocity && (aa.vmult(S, ca),
              ca.mult(P, ca),
              ca.vadd(qa, qa));
            la.x += ba.x * P;
            la.y += ba.y * P;
            la.z += ba.z * P;
            I.angularVelocity && (T.set(qa.x, qa.y, qa.z, 0),
              T.mult(fa, M),
              fa.x += X * M.x,
              fa.y += X * M.y,
              fa.z += X * M.z,
              fa.w += X * M.w,
              B && (J ? fa.normalizeFast() : fa.normalize()));
            I.aabb && (I.aabbNeedsUpdate = !0);
            I.updateInertiaWorld && I.updateInertiaWorld()
          }
        this.clearForces();
        this.broadphase.dirty = !0;
        u && (w.integrate = performance.now() - O);
        this.time += P;
        this.stepnumber += 1;
        this.dispatchEvent(F);
        for (y = 0; y !== L; y++)
          I = A[y],
            (P = I.postStep) && P.call(I);
        if (this.allowSleep)
          for (y = 0; y !== L; y++)
            A[y].sleepTick(this.time)
      }
        ;
      a.prototype.clearForces = function () {
        for (var P = this.bodies, X = P.length, L = 0; L !== X; L++) {
          var A = P[L];
          A.force.set(0, 0, 0);
          A.torque.set(0, 0, 0)
        }
      }
    }
      , {
      "../collision/AABB": 3,
      "../collision/ArrayCollisionMatrix": 4,
      "../collision/NaiveBroadphase": 7,
      "../collision/Ray": 9,
      "../collision/RaycastResult": 10,
      "../equations/ContactEquation": 19,
      "../equations/FrictionEquation": 21,
      "../material/ContactMaterial": 24,
      "../material/Material": 25,
      "../math/Quaternion": 28,
      "../math/Vec3": 30,
      "../objects/Body": 31,
      "../shapes/Shape": 43,
      "../solver/GSSolver": 46,
      "../utils/EventTarget": 49,
      "../utils/TupleDictionary": 52,
      "../utils/Vec3Pool": 54,
      "./Narrowphase": 55
    }]
  }, {}, [2])(2)
});
CANNON = CANNON || {};
var camera, scene, renderer, controls = null, s_oRender;
CANNON.Demo = function (f) {
  function d () {
    if (F) {
      for (var R in F.__controllers)
        F.__controllers[R].updateDisplay();
      for (var aa in F.__folders)
        for (R in F.__folders[aa].__controllers)
          F.__folders[aa].__controllers[R].updateDisplay()
    }
  }
  function e (R) {
    function aa (na, ua) {
      na.material && (na.material = ua);
      for (var ra = 0; ra < na.children.length; ra++)
        aa(na.children[ra], ua)
    }
    if (-1 === D.indexOf(R))
      throw Error("Render mode " + R + " not found!");
    switch (R) {
      case "solid":
        q.currentMaterial = C;
        O.intensity = 1;
        J.color.setHex(2236962);
        break;
      case "wireframe":
        q.currentMaterial = H,
          O.intensity = 0,
          J.color.setHex(16777215)
    }
    for (var da = 0; da < E.length; da++)
      aa(E[da], q.currentMaterial);
    r.rendermode = R
  }
  function m () {
    for (var R = x.length, aa = 0; aa < R; aa++) {
      var da = x[aa];
      da.position.copy(da.initPosition);
      da.velocity.copy(da.initVelocity);
      da.initAngularVelocity && (da.angularVelocity.copy(da.initAngularVelocity),
        da.quaternion.copy(da.initQuaternion))
    }
  }
  function a (R) {
    0 === R.x && (R.x = 1E-6);
    0 === R.y && (R.y = 1E-6);
    0 === R.z && (R.z = 1E-6)
  }
  function c () {
    for (var R = x.length, aa = 0; aa < R; aa++) {
      var da = x[aa]
        , na = E[aa];
      na.position.copy(da.position);
      da.quaternion && na.quaternion.copy(da.quaternion)
    }
    M.restart();
    if (r.contacts)
      for (aa = 0; aa < w.contacts.length; aa++)
        for (R = 0; 2 > R; R++) {
          na = M.request();
          var ua = w.contacts[aa];
          da = 0 === R ? ua.bi : ua.bj;
          var ra = 0 === R ? ua.ri : ua.rj;
          na.position.set(da.position.x + ra.x, da.position.y + ra.y, da.position.z + ra.z)
        }
    M.hideCached();
    ca.restart();
    if (r.cm2contact)
      for (aa = 0; aa < w.contacts.length; aa++)
        for (R = 0; 2 > R; R++)
          na = ca.request(),
            ua = w.contacts[aa],
            da = 0 === R ? ua.bi : ua.bj,
            ra = 0 === R ? ua.ri : ua.rj,
            na.scale.set(ra.x, ra.y, ra.z),
            a(na.scale),
            na.position.copy(da.position);
    ca.hideCached();
    A.restart();
    B.restart();
    if (r.constraints) {
      for (aa = 0; aa < w.constraints.length; aa++)
        ua = w.constraints[aa],
          ua instanceof CANNON.DistanceConstraint && (da = ua.equations.normal,
            R = da.bi,
            da = da.bj,
            na = A.request(),
            da = da.position ? da.position : da,
            na.scale.set(da.x - R.position.x, da.y - R.position.y, da.z - R.position.z),
            a(na.scale),
            na.position.copy(R.position));
      for (aa = 0; aa < w.constraints.length; aa++)
        if (ua = w.constraints[aa],
          ua instanceof CANNON.PointToPointConstraint) {
          ra = ua.equations.normal;
          R = ra.bi;
          da = ra.bj;
          na = B.request();
          ua = B.request();
          var Da = B.request();
          na.scale.set(ra.ri.x, ra.ri.y, ra.ri.z);
          ua.scale.set(ra.rj.x, ra.rj.y, ra.rj.z);
          Da.scale.set(-ra.penetrationVec.x, -ra.penetrationVec.y, -ra.penetrationVec.z);
          a(na.scale);
          a(ua.scale);
          a(Da.scale);
          na.position.copy(R.position);
          ua.position.copy(da.position);
          ra.bj.position.vadd(ra.rj, Da.position)
        }
    }
    B.hideCached();
    A.hideCached();
    y.restart();
    if (r.normals)
      for (aa = 0; aa < w.contacts.length; aa++)
        ua = w.contacts[aa],
          R = ua.bi,
          na = y.request(),
          ra = ua.ni,
          da = R,
          na.scale.set(ra.x, ra.y, ra.z),
          a(na.scale),
          na.position.copy(da.position),
          ua.ri.vadd(na.position, na.position);
    y.hideCached();
    u.restart();
    if (r.axes)
      for (R = 0; R < x.length; R++)
        da = x[R],
          na = u.request(),
          na.position.copy(da.position),
          da.quaternion && na.quaternion.copy(da.quaternion);
    u.hideCached();
    L.restart();
    if (r.aabbs)
      for (aa = 0; aa < x.length; aa++)
        da = x[aa],
          da.computeAABB && (da.aabbNeedsUpdate && da.computeAABB(),
            isFinite(da.aabb.lowerBound.x) && isFinite(da.aabb.lowerBound.y) && isFinite(da.aabb.lowerBound.z) && isFinite(da.aabb.upperBound.x) && isFinite(da.aabb.upperBound.y) && isFinite(da.aabb.upperBound.z) && 0 != da.aabb.lowerBound.x - da.aabb.upperBound.x && 0 != da.aabb.lowerBound.y - da.aabb.upperBound.y && 0 != da.aabb.lowerBound.z - da.aabb.upperBound.z && (na = L.request(),
              na.scale.set(da.aabb.lowerBound.x - da.aabb.upperBound.x, da.aabb.lowerBound.y - da.aabb.upperBound.y, da.aabb.lowerBound.z - da.aabb.upperBound.z),
              na.position.set(.5 * (da.aabb.lowerBound.x + da.aabb.upperBound.x), .5 * (da.aabb.lowerBound.y + da.aabb.upperBound.y), .5 * (da.aabb.lowerBound.z + da.aabb.upperBound.z))));
    L.hideCached()
  }
  function b () {
    requestAnimationFrame(b);
    r.paused || c();
    h();
    G.update()
  }
  function k (R) {
    mouseX = R.clientX - la;
    mouseY = R.clientY - fa
  }
  function g (R) {
    ba = s_iCanvasResizeWidth + 2 * s_iCanvasOffsetWidth;
    I = s_iCanvasResizeHeight + 2 * s_iCanvasOffsetHeight;
    CAMERA_TEST_TRACKBALL && (controls.screen.width = ba,
      controls.screen.height = I)
  }
  function h () {
    (CAMERA_TEST_TRACKBALL || CAMERA_TEST_TRANSFORM && null !== controls) && controls.update();
    renderer.clear();
    renderer.render(q.scene, camera)
  }
  function l (R) {
    q.dispatchEvent({
      type: "destroy"
    });
    r.paused = !1;
    d();
    n(R)
  }
  function n (R) {
    for (var aa = E.length, da = 0; da < aa; da++) {
      w.remove(x.pop());
      var na = E.pop();
      q.scene.remove(na)
    }
    for (; w.constraints.length;)
      w.removeConstraint(w.constraints[0]);
    z[R]();
    r.iterations = w.solver.iterations;
    r.gx = w.gravity.x + 0;
    r.gy = w.gravity.y + 0;
    r.gz = w.gravity.z + 0;
    r.quatNormalizeSkip = w.quatNormalizeSkip;
    r.quatNormalizeFast = w.quatNormalizeFast;
    d();
    M.restart();
    M.hideCached();
    ca.restart();
    ca.hideCached();
    A.restart();
    A.hideCached();
    y.restart();
    y.hideCached()
  }
  function p (R) {
    var aa = []
      , da = [];
    this.request = function () {
      geo = aa.length ? aa.pop() : R();
      scene.add(geo);
      da.push(geo);
      return geo
    }
      ;
    this.restart = function () {
      for (; da.length;)
        aa.push(da.pop())
    }
      ;
    this.hideCached = function () {
      for (var na = 0; na < aa.length; na++)
        scene.remove(aa[na])
    }
  }
  var q = this;
  this.addScene = function (R, aa) {
    if ("string" !== typeof R)
      throw Error("1st argument of Demo.addScene(title,initfunc) must be a string!");
    if ("function" !== typeof aa)
      throw Error("2nd argument of Demo.addScene(title,initfunc) must be a function!");
    z.push(aa);
    var da = z.length - 1;
    K[R] = function () {
      l(da)
    }
      ;
    t.add(K, R)
  }
    ;
  this.restartCurrentScene = m;
  this.changeScene = l;
  this.start = function () {
    n(0)
  }
    ;
  var t, r = this.settings = {
    stepFrequency: 60,
    quatNormalizeSkip: 2,
    quatNormalizeFast: !0,
    gx: 0,
    gy: 0,
    gz: 0,
    iterations: 3,
    tolerance: 1E-4,
    k: 1E6,
    d: 3,
    scene: 0,
    paused: !1,
    rendermode: "solid",
    constraints: !1,
    contacts: !1,
    cm2contact: !1,
    normals: !1,
    axes: !1,
    particleSize: .1,
    shadows: !1,
    aabbs: !1,
    profiling: !1,
    maxSubSteps: 3
  };
  f = f || {};
  for (var v in f)
    v in r && (r[v] = f[v]);
  if (0 !== r.stepFrequency % 60)
    throw Error("stepFrequency must be a multiple of 60.");
  var x = this.bodies = []
    , E = this.visuals = []
    , z = []
    , F = null
    , U = null
    , Q = null
    , K = {}
    , Y = new THREE.SphereGeometry(.1, 6, 6);
  this.particleGeo = new THREE.SphereGeometry(1, 16, 8);
  var C = new THREE.MeshPhongMaterial({
    color: 11184810,
    specular: 1118481,
    shininess: 50
  })
    , H = new THREE.MeshLambertMaterial({
      color: 16777215,
      wireframe: !0
    });
  this.currentMaterial = C;
  var T = new THREE.MeshPhongMaterial({
    color: 16711680
  });
  this.particleMaterial = new THREE.MeshLambertMaterial({
    color: 16711680
  });
  var M = new p(function () {
    return new THREE.Mesh(Y, T)
  }
  )
    , ca = new p(function () {
      var R = new THREE.Geometry;
      R.vertices.push(new THREE.Vector3(0, 0, 0));
      R.vertices.push(new THREE.Vector3(1, 1, 1));
      return new THREE.Line(R, new THREE.LineBasicMaterial({
        color: 16711680
      }))
    }
    )
    , P = new THREE.BoxGeometry(1, 1, 1)
    , X = new THREE.MeshBasicMaterial({
      color: 11184810,
      wireframe: !0
    })
    , L = new p(function () {
      return new THREE.Mesh(P, X)
    }
    )
    , A = new p(function () {
      var R = new THREE.Geometry;
      R.vertices.push(new THREE.Vector3(0, 0, 0));
      R.vertices.push(new THREE.Vector3(1, 1, 1));
      return new THREE.Line(R, new THREE.LineBasicMaterial({
        color: 16711680
      }))
    }
    )
    , B = new p(function () {
      var R = new THREE.Geometry;
      R.vertices.push(new THREE.Vector3(0, 0, 0));
      R.vertices.push(new THREE.Vector3(1, 1, 1));
      return new THREE.Line(R, new THREE.LineBasicMaterial({
        color: 16711680
      }))
    }
    )
    , y = new p(function () {
      var R = new THREE.Geometry;
      R.vertices.push(new THREE.Vector3(0, 0, 0));
      R.vertices.push(new THREE.Vector3(1, 1, 1));
      return new THREE.Line(R, new THREE.LineBasicMaterial({
        color: 65280
      }))
    }
    )
    , u = new p(function () {
      var R = new THREE.Object3D
        , aa = new THREE.Vector3(0, 0, 0)
        , da = new THREE.Geometry
        , na = new THREE.Geometry
        , ua = new THREE.Geometry;
      da.vertices.push(aa);
      na.vertices.push(aa);
      ua.vertices.push(aa);
      da.vertices.push(new THREE.Vector3(1, 0, 0));
      na.vertices.push(new THREE.Vector3(0, 1, 0));
      ua.vertices.push(new THREE.Vector3(0, 0, 1));
      aa = new THREE.Line(da, new THREE.LineBasicMaterial({
        color: 16711680
      }));
      na = new THREE.Line(na, new THREE.LineBasicMaterial({
        color: 65280
      }));
      ua = new THREE.Line(ua, new THREE.LineBasicMaterial({
        color: 255
      }));
      R.add(aa);
      R.add(na);
      R.add(ua);
      return R
    }
    )
    , w = this.world = new CANNON.World;
  w.broadphase = new CANNON.NaiveBroadphase;
  var D = ["solid", "wireframe"], O, J, G, S;
  Detector.webgl || Detector.addGetWebGLMessage();
  var ba = s_iCanvasResizeWidth + s_iCanvasOffsetWidth, I = s_iCanvasResizeHeight + s_iCanvasOffsetHeight, qa, la = ba / 2, fa = I / 2;
  (function () {
    qa = document.createElement("div");
    document.body.appendChild(qa);
    CAMERA_TEST_TRACKBALL ? (NEAR = 1,
      camera = new THREE.PerspectiveCamera(45, ba / I, NEAR, FAR),
      camera.lookAt(new THREE.Vector3(CAMERA_TEST_LOOK_AT.x, CAMERA_TEST_LOOK_AT.y, CAMERA_TEST_LOOK_AT.z)),
      camera.position.set(0, 500, 500),
      camera.up.set(0, 0, 1)) : camera = createOrthoGraphicCamera();
    scene = q.scene = new THREE.Scene;
    scene.fog = new THREE.Fog(8306926, .5 * FAR, FAR);
    J = new THREE.AmbientLight(4473924);
    scene.add(J);
    O = new THREE.DirectionalLight(16777181, 1);
    O.position.set(180, 0, 180);
    O.target.position.set(0, 0, 0);
    O.castShadow = !0;
    O.shadow.camera.near = 10;
    O.shadow.camera.far = 100;
    O.shadow.camera.fov = FOV;
    O.shadowMapBias = .0139;
    O.shadowMapDarkness = .1;
    O.shadow.mapSize.width = 1024;
    O.shadow.mapSize.height = 1024;
    new THREE.CameraHelper(O.shadow.camera);
    scene.add(O);
    scene.add(camera);
    renderer = SHOW_3D_RENDER ? new THREE.WebGLRenderer({
      clearColor: 0,
      clearAlpha: .5,
      antialias: !0,
      alpha: !0
    }) : new THREE.CanvasRenderer({
      clearColor: 0,
      clearAlpha: .5,
      antialias: !1,
      alpha: !0
    });
    renderer.setSize(ba, I);
    renderer.domElement.style.position = "relative";
    renderer.domElement.style.top = "0px";
    renderer.domElement.style.opacity = CANVAS_3D_OPACITY;
    qa.appendChild(renderer.domElement);
    S = document.createElement("div");
    S.style.position = "absolute";
    S.style.top = "10px";
    S.style.width = "100%";
    S.style.textAlign = "center";
    S.innerHTML = '<a href="http://github.com/schteppe/cannon.js">cannon.js</a> - javascript 3d physics';
    qa.appendChild(S);
    document.addEventListener("mousemove", k);
    window.addEventListener("resize", g);
    renderer.setClearColor(scene.fog.color, 1);
    renderer.autoClear = !1;
    Q = document.createElement("canvas");
    Q.width = ba;
    Q.height = I;
    Q.style.opacity = .5;
    Q.style.position = "absolute";
    Q.style.top = "0px";
    Q.style.zIndex = 90;
    qa.appendChild(Q);
    U = new SmoothieChart({
      labelOffsetY: 50,
      maxDataSetLength: 100,
      millisPerPixel: 2,
      grid: {
        strokeStyle: "none",
        fillStyle: "none",
        lineWidth: 1,
        millisPerLine: 250,
        verticalSections: 6
      },
      labels: {
        fillStyle: "rgb(180, 180, 180)"
      }
    });
    U.streamTo(Q);
    var R = {}, aa = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255]], da = 0, na;
    for (na in w.profile) {
      var ua = aa[da % aa.length];
      R[na] = new TimeSeries({
        label: na,
        fillStyle: "rgb(" + ua[0] + "," + ua[1] + "," + ua[2] + ")",
        maxDataLength: 500
      });
      da++
    }
    w.addEventListener("postStep", function (ra) {
      for (var Da in w.profile)
        R[Da].append(1E3 * w.time, w.profile[Da])
    });
    da = 0;
    for (na in w.profile)
      ua = aa[da % aa.length],
        U.addTimeSeries(R[na], {
          strokeStyle: "rgb(" + ua[0] + "," + ua[1] + "," + ua[2] + ")",
          lineWidth: 2
        }),
        da++;
    w.doProfiling = !1;
    U.stop();
    Q.style.display = "none";
    G = new Stats;
    G.domElement.style.position = "absolute";
    G.domElement.style.top = "0px";
    G.domElement.style.zIndex = 100;
    qa.appendChild(G.domElement);
    void 0 != window.dat && (F = new dat.GUI,
      F.domElement.parentNode.style.zIndex = 120,
      aa = F.addFolder("Rendering"),
      aa.add(r, "rendermode", {
        Solid: "solid",
        Wireframe: "wireframe"
      }).onChange(function (ra) {
        e(ra)
      }),
      aa.add(r, "contacts"),
      aa.add(r, "cm2contact"),
      aa.add(r, "normals"),
      aa.add(r, "constraints"),
      aa.add(r, "axes"),
      aa.add(r, "particleSize").min(0).max(1).onChange(function (ra) {
        for (var Da = 0; Da < E.length; Da++)
          x[Da] instanceof CANNON.Particle && E[Da].scale.set(ra, ra, ra)
      }),
      aa.add(r, "shadows").onChange(function (ra) {
        ra ? renderer.shadowMapAutoUpdate = !0 : (renderer.shadowMapAutoUpdate = !1,
          renderer.clearTarget(O.shadowMap))
      }),
      aa.add(r, "aabbs"),
      aa.add(r, "profiling").onChange(function (ra) {
        ra ? (w.doProfiling = !0,
          U.start(),
          Q.style.display = "block") : (w.doProfiling = !1,
            U.stop(),
            Q.style.display = "none")
      }),
      aa = F.addFolder("World"),
      aa.add(r, "paused").onChange(function (ra) { }),
      aa.add(r, "stepFrequency", 60, 600).step(60),
      aa.add(r, "gx", -100, 100).onChange(function (ra) {
        isNaN(ra) || w.gravity.set(ra, r.gy, r.gz)
      }),
      aa.add(r, "gy", -100, 100).onChange(function (ra) {
        isNaN(ra) || w.gravity.set(r.gx, ra, r.gz)
      }),
      aa.add(r, "gz", -100, 100).onChange(function (ra) {
        isNaN(ra) || w.gravity.set(r.gx, r.gy, ra)
      }),
      aa.add(r, "quatNormalizeSkip", 0, 50).step(1).onChange(function (ra) {
        isNaN(ra) || (w.quatNormalizeSkip = ra)
      }),
      aa.add(r, "quatNormalizeFast").onChange(function (ra) {
        w.quatNormalizeFast = !!ra
      }),
      aa = F.addFolder("Solver"),
      aa.add(r, "iterations", 1, 50).step(1).onChange(function (ra) {
        w.solver.iterations = ra
      }),
      aa.add(r, "k", 10, 1E7).onChange(function (ra) {
        q.setGlobalSpookParams(r.k, r.d, 1 / r.stepFrequency)
      }),
      aa.add(r, "d", 0, 20).step(.1).onChange(function (ra) {
        q.setGlobalSpookParams(r.k, r.d, 1 / r.stepFrequency)
      }),
      aa.add(r, "tolerance", 0, 10).step(.01).onChange(function (ra) {
        w.solver.tolerance = ra
      }),
      t = F.addFolder("Scenes"),
      t.open());
    CAMERA_TEST_TRACKBALL && (controls = new THREE.TrackballControls(camera, renderer.domElement),
      controls.rotateSpeed = 1,
      controls.zoomSpeed = 1.2,
      controls.panSpeed = .2,
      controls.noZoom = !1,
      controls.noPan = !1,
      controls.staticMoving = !1,
      controls.dynamicDampingFactor = .3,
      controls.minDistance = 0,
      controls.maxDistance = 1E5,
      controls.keys = [65, 83, 68],
      controls.screen.width = ba,
      controls.screen.height = I)
  }
  )();
  b();
  s_oRender = h;
  document.addEventListener("keypress", function (R) {
    if (R.keyCode)
      switch (R.keyCode) {
        case 32:
          m();
          break;
        case 104:
          "none" == G.domElement.style.display ? (G.domElement.style.display = "block",
            S.style.display = "block") : (G.domElement.style.display = "none",
              S.style.display = "none");
          break;
        case 97:
          r.aabbs = !r.aabbs;
          d();
          break;
        case 99:
          r.constraints = !r.constraints;
          d();
          break;
        case 112:
          r.paused = !r.paused;
          d();
          break;
        case 115:
          w.step(1 / r.stepFrequency);
          c();
          break;
        case 109:
          R = D.indexOf(r.rendermode);
          R++;
          R %= D.length;
          e(D[R]);
          d();
          break;
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          z.length > R.keyCode - 49 && !document.activeElement.localName.match(/input/) && l(R.keyCode - 49)
      }
  })
}
  ;
CANNON.Demo.prototype = new CANNON.EventTarget;
CANNON.Demo.constructor = CANNON.Demo;
CANNON.Demo.prototype.setGlobalSpookParams = function (f, d, e) {
  for (var m = this.world, a = 0; a < m.constraints.length; a++)
    for (var c = m.constraints[a], b = 0; b < c.equations.length; b++)
      c.equations[b].setSpookParams(f, d, e);
  for (a = 0; a < m.contactmaterials.length; a++)
    e = m.contactmaterials[a],
      e.contactEquationStiffness = f,
      e.frictionEquationStiffness = f,
      e.contactEquationRelaxation = d,
      e.frictionEquationRelaxation = d;
  m.defaultContactMaterial.contactEquationStiffness = f;
  m.defaultContactMaterial.frictionEquationStiffness = f;
  m.defaultContactMaterial.contactEquationRelaxation = d;
  m.defaultContactMaterial.frictionEquationRelaxation = d
}
  ;
CANNON.Demo.prototype.createTransformControl = function (f, d) {
  controls = new THREE.TransformControls(camera, renderer.domElement);
  scene.add(f);
  controls.attach(f, d);
  scene.add(controls);
  console.log("CREATE");
  window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 81:
        controls.setSpace("local" === controls.space ? "world" : "local");
        break;
      case 17:
        controls.setTranslationSnap(100);
        controls.setRotationSnap(THREE.Math.degToRad(15));
        break;
      case 87:
        controls.setMode("translate");
        break;
      case 69:
        controls.setMode("rotate");
        break;
      case 82:
        controls.setMode("scale");
        break;
      case 187:
      case 107:
        controls.setSize(controls.size + .1);
        break;
      case 189:
      case 109:
        controls.setSize(Math.max(controls.size - .1, .1))
    }
  });
  window.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
      case 17:
        controls.setTranslationSnap(null),
          controls.setRotationSnap(null)
    }
  })
}
  ;
CANNON.Demo.prototype.getWorld = function () {
  return this.world
}
  ;
CANNON.Demo.prototype.addVisual = function (f, d) {
  var e;
  f instanceof CANNON.Body && (e = this.shape2mesh(f, d));
  e && (this.bodies.push(f),
    this.visuals.push(e),
    f.visualref = e,
    f.visualref.visualId = this.bodies.length - 1,
    this.scene.add(e));
  return e
}
  ;
CANNON.Demo.prototype.addVisuals = function (f) {
  for (var d = 0; d < f.length; d++)
    this.addVisual(f[d])
}
  ;
CANNON.Demo.prototype.removeVisual = function (f) {
  if (f.visualref) {
    for (var d = this.bodies, e = this.visuals, m = [], a = [], c = d.length, b = 0; b < c; b++)
      m.unshift(d.pop()),
        a.unshift(e.pop());
    c = f.visualref.visualId;
    for (var k = 0; k < m.length; k++)
      k !== c && (b = k > c ? k - 1 : k,
        d[b] = m[k],
        e[b] = a[k],
        d[b].visualref = m[k].visualref,
        d[b].visualref.visualId = b);
    f.visualref.visualId = null;
    this.scene.remove(f.visualref);
    f.visualref = null
  }
}
  ;
CANNON.Demo.prototype.removeAllVisuals = function () {
  for (; this.bodies.length;)
    this.removeVisual(this.bodies[0])
}
  ;
CANNON.Demo.prototype.shape2mesh = function (f, d) {
  for (var e = new THREE.Object3D, m = 0; m < f.shapes.length; m++) {
    var a = f.shapes[m];
    switch (a.type) {
      case CANNON.Shape.types.SPHERE:
        var c = new THREE.SphereGeometry(a.radius, 8, 8);
        a = void 0 === d ? new THREE.Mesh(c, this.currentMaterial) : new THREE.Mesh(c, d);
        a.castShadow = !0;
        break;
      case CANNON.Shape.types.PARTICLE:
        a = new THREE.Mesh(this.particleGeo, this.particleMaterial);
        c = this.settings;
        a.scale.set(c.particleSize, c.particleSize, c.particleSize);
        break;
      case CANNON.Shape.types.PLANE:
        var b = new THREE.PlaneGeometry(10, 10, 4, 4);
        a = new THREE.Object3D;
        c = new THREE.Object3D;
        b = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) : new THREE.Mesh(b, d);
        b.scale.set(100, 100, 100);
        c.add(b);
        b.castShadow = !1;
        b.receiveShadow = !0;
        a.add(c);
        break;
      case CANNON.Shape.types.BOX:
        c = new THREE.BoxGeometry(2 * a.halfExtents.x, 2 * a.halfExtents.y, 2 * a.halfExtents.z);
        a = void 0 === d ? new THREE.Mesh(c, this.currentMaterial) : new THREE.Mesh(c, d);
        break;
      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        b = new THREE.Geometry;
        for (c = 0; c < a.vertices.length; c++) {
          var k = a.vertices[c];
          b.vertices.push(new THREE.Vector3(k.x, k.y, k.z))
        }
        for (c = 0; c < a.faces.length; c++) {
          var g = a.faces[c]
            , h = g[0];
          for (k = 1; k < g.length - 1; k++)
            b.faces.push(new THREE.Face3(h, g[k], g[k + 1]))
        }
        b.computeBoundingSphere();
        b.computeFaceNormals();
        a = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) : new THREE.Mesh(b, d);
        break;
      case CANNON.Shape.types.HEIGHTFIELD:
        b = new THREE.Geometry;
        g = new CANNON.Vec3;
        h = new CANNON.Vec3;
        var l = new CANNON.Vec3;
        for (k = 0; k < a.data.length - 1; k++)
          for (var n = 0; n < a.data[k].length - 1; n++)
            for (var p = 0; 2 > p; p++)
              a.getConvexTrianglePillar(k, n, 0 === p),
                g.copy(a.pillarConvex.vertices[0]),
                h.copy(a.pillarConvex.vertices[1]),
                l.copy(a.pillarConvex.vertices[2]),
                g.vadd(a.pillarOffset, g),
                h.vadd(a.pillarOffset, h),
                l.vadd(a.pillarOffset, l),
                b.vertices.push(new THREE.Vector3(g.x, g.y, g.z), new THREE.Vector3(h.x, h.y, h.z), new THREE.Vector3(l.x, l.y, l.z)),
                c = b.vertices.length - 3,
                b.faces.push(new THREE.Face3(c, c + 1, c + 2));
        b.computeBoundingSphere();
        b.computeFaceNormals();
        a = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) : new THREE.Mesh(b, d);
        break;
      case CANNON.Shape.types.TRIMESH:
        b = new THREE.Geometry;
        g = new CANNON.Vec3;
        h = new CANNON.Vec3;
        l = new CANNON.Vec3;
        for (c = 0; c < a.indices.length / 3; c++)
          a.getTriangleVertices(c, g, h, l),
            b.vertices.push(new THREE.Vector3(g.x, g.y, g.z), new THREE.Vector3(h.x, h.y, h.z), new THREE.Vector3(l.x, l.y, l.z)),
            k = b.vertices.length - 3,
            b.faces.push(new THREE.Face3(k, k + 1, k + 2));
        b.computeBoundingSphere();
        b.computeFaceNormals();
        a = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) : new THREE.Mesh(b, d);
        break;
      default:
        throw "Visual type not recognized: " + a.type;
    }
    a.receiveShadow = !0;
    a.castShadow = !0;
    if (a.children)
      for (c = 0; c < a.children.length; c++)
        if (a.children[c].castShadow = !0,
          a.children[c].receiveShadow = !0,
          a.children[c])
          for (k = 0; k < a.children[c].length; k++)
            a.children[c].children[k].castShadow = !0,
              a.children[c].children[k].receiveShadow = !0;
    c = f.shapeOffsets[m];
    b = f.shapeOrientations[m];
    a.position.set(c.x, c.y, c.z);
    a.quaternion.set(b.x, b.y, b.z, b.w);
    e.add(a)
  }
  this.camera = function () {
    return camera
  }
    ;
  this.getScene = function () {
    return scene
  }
    ;
  return e
}
  ;
function CBall (f, d, e, m, a) {
  var c, b, k, g = null, h = FOV * BALL_RADIUS, l = 0, n = 0;
  this._init = function (t, r, v) {
    k = new createjs.Container;
    q.addChild(k);
    var x = new createjs.SpriteSheet({
      images: [v],
      frames: {
        width: v.width / 7,
        height: v.height,
        regX: v.width / 2 / 7,
        regY: v.height / 2
      }
    });
    c = createSprite(x, 0, v.width / 2 / 7, v.height / 2, v.width / 7, v.height / 2);
    c.stop();
    this.scale(h);
    v = s_oSpriteLibrary.getSprite("ball_shadow");
    b = createBitmap(v);
    b.x = t;
    b.y = r;
    b.regX = .5 * v.width;
    b.regY = .5 * v.height;
    this.scaleShadow(h);
    k.addChild(b, c)
  }
    ;
  this.rolls = function () {
    c.rotation = 180 / Math.PI * Math.sin(-(.15 * p.velocity.x));
    var t = Math.abs(p.angularVelocity.x)
      , r = this._goToPrevFrame;
    0 > p.angularVelocity.x && (r = this._goToNextFrame);
    7 < t ? r() : 3 < t ? (l++,
      l > 2 / ROLL_BALL_RATE && (r(),
        l = 0)) : 1 < t ? (l++,
          l > 3 / ROLL_BALL_RATE && (r(),
            l = 0)) : t > MIN_BALL_VEL_ROTATION && (l++,
              l > 4 / ROLL_BALL_RATE && (r(),
                l = 0))
  }
    ;
  this._goToPrevFrame = function () {
    0 === n ? n = 6 : n--;
    c.gotoAndStop(n)
  }
    ;
  this._goToNextFrame = function () {
    7 === n ? n = 1 : n++;
    c.gotoAndStop(n)
  }
    ;
  this.unload = function () {
    c.removeAllEventListeners();
    q.removeChild(c)
  }
    ;
  this.setVisible = function (t) {
    k.visible = t
  }
    ;
  this.getStartScale = function () {
    return h
  }
    ;
  this.startPosShadowY = function (t) {
    g = t
  }
    ;
  this.getStartShadowYPos = function () {
    return g
  }
    ;
  this.fadeAnimation = function (t, r, v) {
    this.tweenFade(t, r, v)
  }
    ;
  this.tweenFade = function (t, r, v) {
    createjs.Tween.get(k, {
      override: !0
    }).wait(v).to({
      alpha: t
    }, r).call(function () { })
  }
    ;
  this.setPositionShadow = function (t, r) {
    b.x = t;
    b.y = r
  }
    ;
  this.setPosition = function (t, r) {
    c.x = t;
    c.y = r
  }
    ;
  this.getPhysics = function () {
    return p
  }
    ;
  this.setAngle = function (t) {
    c.rotation = t
  }
    ;
  this.getX = function () {
    return c.x
  }
    ;
  this.getY = function () {
    return c.y
  }
    ;
  this.getStartScale = function () {
    return h
  }
    ;
  this.scale = function (t) {
    c.scaleX = t;
    c.scaleY = t
  }
    ;
  this.scaleShadow = function (t) {
    .08 < t ? (b.scaleX = t,
      b.scaleY = t) : (b.scaleX = .08,
        b.scaleY = .08)
  }
    ;
  this.setAlphaByHeight = function (t) {
    b.alpha = t
  }
    ;
  this.getScale = function () {
    return c.scaleX
  }
    ;
  this.getObject = function () {
    return k
  }
    ;
  this.getDepthPos = function () {
    return p.position.y
  }
    ;
  var p = m;
  var q = a;
  this._init(f, d, e);
  return this
}
function CScenario () {
  var f, d, e, m, a, c, b, k, g, h, l, n, p, q, t, r;
  if (SHOW_3D_RENDER)
    var v = new CANNON.Demo;
  this.getDemo = function () {
    return v
  }
    ;
  this._init = function () {
    f = SHOW_3D_RENDER ? v.getWorld() : new CANNON.World;
    f.gravity.set(0, 0, -9.81);
    f.broadphase = new CANNON.NaiveBroadphase;
    f.solver.iterations = 50;
    f.solver.tolerance = 1E-5;
    d = new CANNON.Material;
    e = new CANNON.Material;
    m = new CANNON.Material;
    var x = new CANNON.ContactMaterial(e, m, {
      friction: .1,
      restitution: .01
    })
      , E = new CANNON.ContactMaterial(e, d, {
        friction: .2,
        restitution: .3
      });
    f.addContactMaterial(x);
    f.addContactMaterial(E);
    s_oScenario._createBallBody();
    s_oScenario._createFieldBody();
    s_oScenario._createGoal();
    s_oScenario.createBackGoalWall();
    SHOW_AREAS_GOAL ? s_oScenario.createAreasGoal() : s_oScenario.createAreaGoal(GOAL_LINE_POS, BACK_WALL_GOAL_SIZE, COLOR_AREA_GOAL[0], null)
  }
    ;
  this.createAreasGoal = function () {
    for (var x = 0, E = FIRST_AREA_GOAL_POS.x, z = FIRST_AREA_GOAL_POS.z, F = 0; F < NUM_AREA_GOAL.h; F++) {
      for (var U = 0; U < NUM_AREA_GOAL.w; U++)
        s_oScenario.createAreaGoal({
          x: E,
          y: FIRST_AREA_GOAL_POS.y,
          z: z
        }, AREA_GOAL_PROPERTIES, COLOR_AREA_GOAL[x], AREAS_INFO[x]),
          E += 2 * AREA_GOAL_PROPERTIES.width,
          x++;
      E = FIRST_AREA_GOAL_POS.x;
      z -= 2 * AREA_GOAL_PROPERTIES.height
    }
  }
    ;
  this._createFieldBody = function () {
    k = new CANNON.Plane;
    g = new CANNON.Body({
      mass: 0,
      material: d
    });
    g.addShape(k);
    g.position.z = -9;
    g.addEventListener("collide", function (E) {
      s_oScenario.fieldCollision()
    });
    f.addBody(g);
    if (SHOW_3D_RENDER) {
      var x = new THREE.MeshPhongMaterial({
        color: 5803568,
        specular: 1118481,
        shininess: 10
      });
      v.addVisual(g, x)
    }
  }
    ;
  this._createGoal = function () {
    h = new CANNON.Cylinder(POLE_RIGHT_LEFT_SIZE.radius_top, POLE_RIGHT_LEFT_SIZE.radius_bottom, POLE_RIGHT_LEFT_SIZE.height, POLE_RIGHT_LEFT_SIZE.segments);
    n = new CANNON.Body({
      mass: 0
    });
    l = new CANNON.Cylinder(POLE_UP_SIZE.radius_top, POLE_UP_SIZE.radius_bottom, POLE_UP_SIZE.height, POLE_UP_SIZE.segments);
    var x = new CANNON.Quaternion;
    x.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    l.transformAllPoints(new CANNON.Vec3, x);
    n.addShape(h, new CANNON.Vec3(.5 * POLE_UP_SIZE.height, 0, 0));
    n.addShape(h, new CANNON.Vec3(.5 * -POLE_UP_SIZE.height, 0, 0));
    n.addShape(l, new CANNON.Vec3(0, 0, .5 * POLE_RIGHT_LEFT_SIZE.height));
    n.position.set(BACK_WALL_GOAL_POSITION.x, BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth, BACK_WALL_GOAL_POSITION.z);
    n.addEventListener("collide", function (E) {
      s_oScenario.poleCollision()
    });
    f.addBody(n);
    SHOW_3D_RENDER && (x = new THREE.MeshPhongMaterial({
      color: 16777215,
      specular: 1118481,
      shininess: 50
    }),
      v.addVisual(n, x))
  }
    ;
  this.createBackGoalWall = function () {
    p = new CANNON.Box(new CANNON.Vec3(BACK_WALL_GOAL_SIZE.width, BACK_WALL_GOAL_SIZE.depth, BACK_WALL_GOAL_SIZE.height));
    q = new CANNON.Box(new CANNON.Vec3(LEFT_RIGHT_WALL_GOAL_SIZE.width, LEFT_RIGHT_WALL_GOAL_SIZE.depth, LEFT_RIGHT_WALL_GOAL_SIZE.height));
    t = new CANNON.Box(new CANNON.Vec3(UP_WALL_GOAL_SIZE.width, UP_WALL_GOAL_SIZE.depth, UP_WALL_GOAL_SIZE.height));
    r = new CANNON.Body({
      mass: 0,
      material: m
    });
    r.addShape(p);
    r.addShape(q, new CANNON.Vec3(BACK_WALL_GOAL_SIZE.width, 0, 0));
    r.addShape(q, new CANNON.Vec3(-BACK_WALL_GOAL_SIZE.width, 0, 0));
    r.addShape(t, new CANNON.Vec3(0, 0, BACK_WALL_GOAL_SIZE.height));
    r.position.set(BACK_WALL_GOAL_POSITION.x, BACK_WALL_GOAL_POSITION.y, BACK_WALL_GOAL_POSITION.z);
    f.addBody(r);
    SHOW_3D_RENDER && v.addVisual(r)
  }
    ;
  this.createAreaGoal = function (x, E, z, F) {
    E = new CANNON.Box(new CANNON.Vec3(E.width, E.depth, E.height));
    F = new CANNON.Body({
      mass: 0,
      userData: F
    });
    F.addShape(E);
    F.position.set(x.x, x.y, x.z);
    F.collisionResponse = 0;
    F.addEventListener("collide", function (U) {
      s_oScenario.lineGoalCollision(U)
    });
    f.addBody(F);
    SHOW_3D_RENDER && (x = new THREE.MeshPhongMaterial({
      color: z,
      specular: 1118481,
      shininess: 70
    }),
      v.addVisual(F, x));
    return F
  }
    ;
  this._createBallBody = function () {
    a = new CANNON.Sphere(BALL_RADIUS);
    c = new CANNON.Body({
      mass: BALL_MASS,
      material: e,
      linearDamping: BALL_LINEAR_DAMPING,
      angularDamping: 2 * BALL_LINEAR_DAMPING
    });
    var x = new CANNON.Vec3(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);
    c.position.copy(x);
    c.addShape(a);
    f.add(c);
    SHOW_3D_RENDER && (x = new THREE.MeshPhongMaterial({
      color: 16777215,
      specular: 1118481,
      shininess: 70
    }),
      b = v.addVisual(c, x))
  }
    ;
  this.addImpulse = function (x, E) {
    var z = new CANNON.Vec3(0, 0, BALL_RADIUS)
      , F = new CANNON.Vec3(E.x, E.y, E.z);
    x.applyImpulse(F, z)
  }
    ;
  this.addForce = function (x, E) {
    var z = new CANNON.Vec3(0, 0, 0)
      , F = new CANNON.Vec3(E.x, E.y, E.z);
    x.applyForce(F, z)
  }
    ;
  this.getBodyVelocity = function (x) {
    return x.velocity
  }
    ;
  this.ballBody = function () {
    return c
  }
    ;
  this.ballMesh = function () {
    return b
  }
    ;
  this.getCamera = function () {
    return v.camera()
  }
    ;
  this.fieldCollision = function () {
    s_oGame.fieldCollision();
    s_oGame.ballFadeForReset()
  }
    ;
  this.setElementAngularVelocity = function (x, E) {
    x.angularVelocity.set(E.x, E.y, E.z)
  }
    ;
  this.setElementVelocity = function (x, E) {
    var z = new CANNON.Vec3(E.x, E.y, E.z);
    x.velocity = z
  }
    ;
  this.setElementLinearDamping = function (x, E) {
    x.linearDamping = E
  }
    ;
  this.getFieldBody = function () {
    return g
  }
    ;
  this.lineGoalCollision = function (x) {
    s_oGame.areaGoal(x.contact.bj.userData)
  }
    ;
  this.update = function () {
    f.step(PHYSICS_STEP)
  }
    ;
  this.getGoalBody = function () {
    return n
  }
    ;
  this.poleCollision = function () {
    s_oGame.poleCollide()
  }
    ;
  this.destroyWorld = function () {
    for (var x = f.bodies, E = 0; E < x.length; E++)
      f.remove(x[E]);
    f = null
  }
    ;
  s_oScenario = this;
  SHOW_3D_RENDER ? (v.addScene("Test", this._init),
    v.start()) : this._init()
}
var s_oScenario;
Detector = {
  canvas: !!window.CanvasRenderingContext2D,
  webgl: function () {
    try {
      return !!window.WebGLRenderingContext && !!document.createElement("canvas").getContext("experimental-webgl")
    } catch (f) {
      return !1
    }
  }(),
  workers: !!window.Worker,
  fileapi: window.File && window.FileReader && window.FileList && window.Blob,
  getWebGLErrorMessage: function () {
    var f = document.createElement("div");
    f.id = "webgl-error-message";
    f.style.fontFamily = "monospace";
    f.style.fontSize = "13px";
    f.style.fontWeight = "normal";
    f.style.textAlign = "center";
    f.style.background = "#fff";
    f.style.color = "#000";
    f.style.padding = "1.5em";
    f.style.width = "400px";
    f.style.margin = "5em auto 0";
    this.webgl || (f.innerHTML = window.WebGLRenderingContext ? 'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />\nFind out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.' : 'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>\nFind out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.');
    return f
  },
  addGetWebGLMessage: function (f) {
    f = f || {};
    var d = void 0 !== f.parent ? f.parent : document.body;
    f = void 0 !== f.id ? f.id : "oldie";
    var e = Detector.getWebGLErrorMessage();
    e.id = f;
    d.appendChild(e)
  }
};
function TimeSeries (f) {
  f = f || {};
  f.resetBoundsInterval = f.resetBoundsInterval || 3E3;
  f.resetBounds = void 0 === f.resetBounds ? !0 : f.resetBounds;
  this.options = f;
  this.data = [];
  this.label = f.label || "";
  this.maxDataLength = f.maxDataLength || 1E3;
  this.dataPool = [];
  this.minValue = this.maxValue = Number.NaN;
  f.resetBounds && (this.boundsTimer = setInterval(function (d) {
    return function () {
      d.resetBounds()
    }
  }(this), f.resetBoundsInterval))
}
TimeSeries.prototype.resetBounds = function () {
  this.minValue = this.maxValue = Number.NaN;
  for (var f = 0; f < this.data.length; f++)
    this.maxValue = isNaN(this.maxValue) ? this.data[f][1] : Math.max(this.maxValue, this.data[f][1]),
      this.minValue = isNaN(this.minValue) ? this.data[f][1] : Math.min(this.minValue, this.data[f][1])
}
  ;
TimeSeries.prototype.append = function (f, d) {
  this.lastTimeStamp = f;
  var e = this.dataPool.length ? this.dataPool.pop() : [f, d];
  e[0] = f;
  e[1] = d;
  this.data.push(e);
  this.maxValue = isNaN(this.maxValue) ? d : Math.max(this.maxValue, d);
  for (this.minValue = isNaN(this.minValue) ? d : Math.min(this.minValue, d); this.data.length > this.maxDataLength;)
    this.dataPool.push(this.data.shift())
}
  ;
function SmoothieChart (f) {
  f = f || {};
  f.grid = f.grid || {
    fillStyle: "#000000",
    strokeStyle: "#777777",
    lineWidth: 1,
    millisPerLine: 1E3,
    verticalSections: 2
  };
  f.millisPerPixel = f.millisPerPixel || 20;
  f.fps = f.fps || 50;
  f.maxValueScale = f.maxValueScale || 1;
  f.minValue = f.minValue;
  f.maxValue = f.maxValue;
  f.labels = f.labels || {
    fillStyle: "#ffffff"
  };
  f.interpolation = f.interpolation || "bezier";
  f.scaleSmoothing = f.scaleSmoothing || .125;
  f.maxDataSetLength = f.maxDataSetLength || 2;
  f.timestampFormatter = f.timestampFormatter || null;
  this.options = f;
  this.seriesSet = [];
  this.currentValueRange = 1;
  this.currentVisMinValue = 0
}
SmoothieChart.prototype.addTimeSeries = function (f, d) {
  this.seriesSet.push({
    timeSeries: f,
    options: d || {}
  })
}
  ;
SmoothieChart.prototype.removeTimeSeries = function (f) {
  this.seriesSet.splice(this.seriesSet.indexOf(f), 1)
}
  ;
SmoothieChart.prototype.streamTo = function (f, d) {
  var e = this;
  this.render_on_tick = function () {
    e.render(f, e.seriesSet[0].timeSeries.lastTimeStamp)
  }
    ;
  this.start()
}
  ;
SmoothieChart.prototype.start = function () {
  this.timer || (this.timer = setInterval(this.render_on_tick, 1E3 / this.options.fps))
}
  ;
SmoothieChart.prototype.stop = function () {
  this.timer && (clearInterval(this.timer),
    this.timer = void 0)
}
  ;
SmoothieChart.timeFormatter = function (f) {
  function d (e) {
    return (10 > e ? "0" : "") + e
  }
  return d(f.getHours()) + ":" + d(f.getMinutes()) + ":" + d(f.getSeconds())
}
  ;
SmoothieChart.prototype.render = function (f, d) {
  var e = f.getContext("2d")
    , m = this.options
    , a = f.clientWidth
    , c = f.clientHeight;
  e.save();
  d -= d % m.millisPerPixel;
  e.translate(0, 0);
  e.beginPath();
  e.rect(0, 0, a, c);
  e.clip();
  e.save();
  e.fillStyle = m.grid.fillStyle;
  e.clearRect(0, 0, a, c);
  e.fillRect(0, 0, a, c);
  e.restore();
  e.save();
  e.lineWidth = m.grid.lineWidth || 1;
  e.strokeStyle = m.grid.strokeStyle || "#ffffff";
  if (0 < m.grid.millisPerLine)
    for (var b = d - d % m.grid.millisPerLine; b >= d - a * m.millisPerPixel; b -= m.grid.millisPerLine) {
      e.beginPath();
      var k = Math.round(a - (d - b) / m.millisPerPixel);
      e.moveTo(k, 0);
      e.lineTo(k, c);
      e.stroke();
      if (m.timestampFormatter) {
        var g = m.timestampFormatter(new Date(b))
          , h = e.measureText(g).width / 2 + e.measureText(E).width + 4;
        k < a - h && (e.fillStyle = m.labels.fillStyle,
          e.fillText(g, k - e.measureText(g).width / 2, c - 2))
      }
      e.closePath()
    }
  for (E = 1; E < m.grid.verticalSections; E++)
    b = Math.round(E * c / m.grid.verticalSections),
      e.beginPath(),
      e.moveTo(0, b),
      e.lineTo(a, b),
      e.stroke(),
      e.closePath();
  e.beginPath();
  e.strokeRect(0, 0, a, c);
  e.closePath();
  e.restore();
  E = k = Number.NaN;
  for (g = 0; g < this.seriesSet.length; g++) {
    var l = this.seriesSet[g].timeSeries;
    isNaN(l.maxValue) || (k = isNaN(k) ? l.maxValue : Math.max(k, l.maxValue));
    isNaN(l.minValue) || (E = isNaN(E) ? l.minValue : Math.min(E, l.minValue))
  }
  if (!isNaN(k) || !isNaN(E)) {
    k = null != m.maxValue ? m.maxValue : k * m.maxValueScale;
    null != m.minValue && (E = m.minValue);
    this.currentValueRange += m.scaleSmoothing * (k - E - this.currentValueRange);
    this.currentVisMinValue += m.scaleSmoothing * (E - this.currentVisMinValue);
    h = this.currentValueRange;
    var n = this.currentVisMinValue;
    for (g = 0; g < this.seriesSet.length; g++) {
      e.save();
      l = this.seriesSet[g].timeSeries;
      l = l.data;
      for (var p = this.seriesSet[g].options; l.length >= m.maxDataSetLength && l[1][0] < d - a * m.millisPerPixel;)
        l.splice(0, 1);
      e.lineWidth = p.lineWidth || 1;
      e.fillStyle = p.fillStyle;
      e.strokeStyle = p.strokeStyle || "#ffffff";
      e.beginPath();
      var q = 0
        , t = 0
        , r = 0;
      for (b = 0; b < l.length; b++) {
        var v = Math.round(a - (d - l[b][0]) / m.millisPerPixel)
          , x = l[b][1] - n;
        x = Math.max(Math.min(c - (h ? Math.round(x / h * c) : 0), c - 1), 1);
        if (0 == b)
          q = v,
            e.moveTo(v, x);
        else
          switch (m.interpolation) {
            case "line":
              e.lineTo(v, x);
              break;
            default:
              e.bezierCurveTo(Math.round((t + v) / 2), r, Math.round(t + v) / 2, x, v, x)
          }
        t = v;
        r = x
      }
      0 < l.length && p.fillStyle && (e.lineTo(a + p.lineWidth + 1, r),
        e.lineTo(a + p.lineWidth + 1, c + p.lineWidth + 1),
        e.lineTo(q, c + p.lineWidth),
        e.fill());
      e.stroke();
      e.closePath();
      e.restore()
    }
    if (!m.labels.disabled) {
      m.labelOffsetY || (m.labelOffsetY = 0);
      e.fillStyle = m.labels.fillStyle;
      b = parseFloat(k).toFixed(2);
      var E = parseFloat(E).toFixed(2);
      e.fillText(b, a - e.measureText(b).width - 2, 10);
      e.fillText(E, a - e.measureText(E).width - 2, c - 2);
      for (b = 0; b < this.seriesSet.length; b++)
        l = this.seriesSet[b].timeSeries,
          a = l.label,
          e.fillStyle = l.options.fillStyle || "rgb(255,255,255)",
          a && e.fillText(a, 2, 10 * (b + 1) + m.labelOffsetY)
    }
  }
  e.restore()
}
  ;
var Stats = function () {
  var f = 0
    , d = 0
    , e = Date.now()
    , m = e
    , a = e
    , c = 0
    , b = 1E3
    , k = 0
    , g = [[16, 16, 48], [0, 255, 255]]
    , h = 0
    , l = 1E3
    , n = 0
    , p = [[16, 48, 16], [0, 255, 0]];
  var q = document.createElement("div");
  q.style.cursor = "pointer";
  q.style.width = "80px";
  q.style.opacity = "0.9";
  q.style.zIndex = "10001";
  q.addEventListener("mousedown", function (U) {
    U.preventDefault();
    f = (f + 1) % 2;
    0 == f ? (t.style.display = "block",
      E.style.display = "none") : (t.style.display = "none",
        E.style.display = "block")
  }, !1);
  var t = document.createElement("div");
  t.style.textAlign = "left";
  t.style.lineHeight = "1.2em";
  t.style.backgroundColor = "rgb(" + Math.floor(g[0][0] / 2) + "," + Math.floor(g[0][1] / 2) + "," + Math.floor(g[0][2] / 2) + ")";
  t.style.padding = "0 0 3px 3px";
  q.appendChild(t);
  var r = document.createElement("div");
  r.style.fontFamily = "Helvetica, Arial, sans-serif";
  r.style.fontSize = "9px";
  r.style.color = "rgb(" + g[1][0] + "," + g[1][1] + "," + g[1][2] + ")";
  r.style.fontWeight = "bold";
  r.innerHTML = "FPS";
  t.appendChild(r);
  var v = document.createElement("div");
  v.style.position = "relative";
  v.style.width = "74px";
  v.style.height = "30px";
  v.style.backgroundColor = "rgb(" + g[1][0] + "," + g[1][1] + "," + g[1][2] + ")";
  for (t.appendChild(v); 74 > v.children.length;) {
    var x = document.createElement("span");
    x.style.width = "1px";
    x.style.height = "30px";
    x.style.cssFloat = "left";
    x.style.backgroundColor = "rgb(" + g[0][0] + "," + g[0][1] + "," + g[0][2] + ")";
    v.appendChild(x)
  }
  var E = document.createElement("div");
  E.style.textAlign = "left";
  E.style.lineHeight = "1.2em";
  E.style.backgroundColor = "rgb(" + Math.floor(p[0][0] / 2) + "," + Math.floor(p[0][1] / 2) + "," + Math.floor(p[0][2] / 2) + ")";
  E.style.padding = "0 0 3px 3px";
  E.style.display = "none";
  q.appendChild(E);
  var z = document.createElement("div");
  z.style.fontFamily = "Helvetica, Arial, sans-serif";
  z.style.fontSize = "9px";
  z.style.color = "rgb(" + p[1][0] + "," + p[1][1] + "," + p[1][2] + ")";
  z.style.fontWeight = "bold";
  z.innerHTML = "MS";
  E.appendChild(z);
  var F = document.createElement("div");
  F.style.position = "relative";
  F.style.width = "74px";
  F.style.height = "30px";
  F.style.backgroundColor = "rgb(" + p[1][0] + "," + p[1][1] + "," + p[1][2] + ")";
  for (E.appendChild(F); 74 > F.children.length;)
    x = document.createElement("span"),
      x.style.width = "1px",
      x.style.height = 30 * Math.random() + "px",
      x.style.cssFloat = "left",
      x.style.backgroundColor = "rgb(" + p[0][0] + "," + p[0][1] + "," + p[0][2] + ")",
      F.appendChild(x);
  return {
    domElement: q,
    update: function () {
      e = Date.now();
      h = e - m;
      l = Math.min(l, h);
      n = Math.max(n, h);
      z.textContent = h + " MS (" + l + "-" + n + ")";
      var U = Math.min(30, 30 - h / 200 * 30);
      F.appendChild(F.firstChild).style.height = U + "px";
      m = e;
      d++;
      e > a + 1E3 && (c = Math.round(1E3 * d / (e - a)),
        b = Math.min(b, c),
        k = Math.max(k, c),
        r.textContent = c + " FPS (" + b + "-" + k + ")",
        U = Math.min(30, 30 - c / 100 * 30),
        v.appendChild(v.firstChild).style.height = U + "px",
        a = e,
        d = 0)
    }
  }
};
THREE.TrackballControls = function (f, d) {
  function e (C) {
    !1 !== b.enabled && (window.removeEventListener("keydown", e),
      l = h,
      h === k.NONE) && (C.keyCode !== b.keys[k.ROTATE] || b.noRotate ? C.keyCode !== b.keys[k.ZOOM] || b.noZoom ? C.keyCode !== b.keys[k.PAN] || b.noPan || (h = k.PAN) : h = k.ZOOM : h = k.ROTATE)
  }
  function m (C) {
    !1 !== b.enabled && (C.preventDefault(),
      C.stopPropagation(),
      h !== k.ROTATE || b.noRotate ? h !== k.ZOOM || b.noZoom ? h !== k.PAN || b.noPan || z.copy(K(C.pageX, C.pageY)) : r.copy(K(C.pageX, C.pageY)) : q.copy(Y(C.pageX, C.pageY)))
  }
  function a (C) {
    !1 !== b.enabled && (C.preventDefault(),
      C.stopPropagation(),
      h = k.NONE,
      document.removeEventListener("mousemove", m),
      document.removeEventListener("mouseup", a),
      b.dispatchEvent(Q))
  }
  function c (C) {
    if (!1 !== b.enabled) {
      C.preventDefault();
      C.stopPropagation();
      var H = 0;
      C.wheelDelta ? H = C.wheelDelta / 40 : C.detail && (H = -C.detail / 3);
      t.y += .01 * H;
      b.dispatchEvent(U);
      b.dispatchEvent(Q)
    }
  }
  var b = this
    , k = {
      NONE: -1,
      ROTATE: 0,
      ZOOM: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_ZOOM_PAN: 4
    };
  this.object = f;
  this.domElement = void 0 !== d ? d : document;
  this.enabled = !0;
  this.screen = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };
  this.rotateSpeed = 1;
  this.zoomSpeed = 1.2;
  this.panSpeed = .3;
  this.staticMoving = this.noRoll = this.noPan = this.noZoom = this.noRotate = !1;
  this.dynamicDampingFactor = .2;
  this.minDistance = 0;
  this.maxDistance = Infinity;
  this.keys = [65, 83, 68];
  this.target = new THREE.Vector3;
  var g = new THREE.Vector3
    , h = k.NONE
    , l = k.NONE
    , n = new THREE.Vector3
    , p = new THREE.Vector3
    , q = new THREE.Vector3
    , t = new THREE.Vector2
    , r = new THREE.Vector2
    , v = 0
    , x = 0
    , E = new THREE.Vector2
    , z = new THREE.Vector2;
  this.target0 = this.target.clone();
  this.position0 = this.object.position.clone();
  this.up0 = this.object.up.clone();
  var F = {
    type: "change"
  }
    , U = {
      type: "start"
    }
    , Q = {
      type: "end"
    };
  this.handleResize = function () {
    if (this.domElement === document)
      this.screen.left = 0,
        this.screen.top = 0,
        this.screen.width = window.innerWidth,
        this.screen.height = window.innerHeight;
    else {
      var C = this.domElement.getBoundingClientRect()
        , H = this.domElement.ownerDocument.documentElement;
      this.screen.left = C.left + window.pageXOffset - H.clientLeft;
      this.screen.top = C.top + window.pageYOffset - H.clientTop;
      this.screen.width = C.width;
      this.screen.height = C.height
    }
  }
    ;
  this.handleEvent = function (C) {
    if ("function" == typeof this[C.type])
      this[C.type](C)
  }
    ;
  var K = function () {
    var C = new THREE.Vector2;
    return function (H, T) {
      C.set((H - b.screen.left) / b.screen.width, (T - b.screen.top) / b.screen.height);
      return C
    }
  }()
    , Y = function () {
      var C = new THREE.Vector3
        , H = new THREE.Vector3
        , T = new THREE.Vector3;
      return function (M, ca) {
        T.set((M - .5 * b.screen.width - b.screen.left) / (.5 * b.screen.width), (.5 * b.screen.height + b.screen.top - ca) / (.5 * b.screen.height), 0);
        var P = T.length();
        b.noRoll ? T.z = P < Math.SQRT1_2 ? Math.sqrt(1 - P * P) : .5 / P : 1 < P ? T.normalize() : T.z = Math.sqrt(1 - P * P);
        n.copy(b.object.position).sub(b.target);
        C.copy(b.object.up).setLength(T.y);
        C.add(H.copy(b.object.up).cross(n).setLength(T.x));
        C.add(n.setLength(T.z));
        return C
      }
    }();
  this.rotateCamera = function () {
    var C = new THREE.Vector3
      , H = new THREE.Quaternion;
    return function () {
      var T = Math.acos(p.dot(q) / p.length() / q.length());
      T && (C.crossVectors(p, q).normalize(),
        T *= b.rotateSpeed,
        H.setFromAxisAngle(C, -T),
        n.applyQuaternion(H),
        b.object.up.applyQuaternion(H),
        q.applyQuaternion(H),
        b.staticMoving ? p.copy(q) : (H.setFromAxisAngle(C, T * (b.dynamicDampingFactor - 1)),
          p.applyQuaternion(H)))
    }
  }();
  this.zoomCamera = function () {
    if (h === k.TOUCH_ZOOM_PAN) {
      var C = v / x;
      v = x;
      n.multiplyScalar(C)
    } else
      C = 1 + (r.y - t.y) * b.zoomSpeed,
        1 !== C && 0 < C && (n.multiplyScalar(C),
          b.staticMoving ? t.copy(r) : t.y += (r.y - t.y) * this.dynamicDampingFactor)
  }
    ;
  this.panCamera = function () {
    var C = new THREE.Vector2
      , H = new THREE.Vector3
      , T = new THREE.Vector3;
    return function () {
      C.copy(z).sub(E);
      C.lengthSq() && (C.multiplyScalar(n.length() * b.panSpeed),
        T.copy(n).cross(b.object.up).setLength(C.x),
        T.add(H.copy(b.object.up).setLength(C.y)),
        b.object.position.add(T),
        b.target.add(T),
        b.staticMoving ? E.copy(z) : E.add(C.subVectors(z, E).multiplyScalar(b.dynamicDampingFactor)))
    }
  }();
  this.checkDistances = function () {
    b.noZoom && b.noPan || (n.lengthSq() > b.maxDistance * b.maxDistance && b.object.position.addVectors(b.target, n.setLength(b.maxDistance)),
      n.lengthSq() < b.minDistance * b.minDistance && b.object.position.addVectors(b.target, n.setLength(b.minDistance)))
  }
    ;
  this.update = function () {
    n.subVectors(b.object.position, b.target);
    b.noRotate || b.rotateCamera();
    b.noZoom || b.zoomCamera();
    b.noPan || b.panCamera();
    b.object.position.addVectors(b.target, n);
    b.checkDistances();
    b.object.lookAt(b.target);
    1E-6 < g.distanceToSquared(b.object.position) && (b.dispatchEvent(F),
      g.copy(b.object.position))
  }
    ;
  this.reset = function () {
    l = h = k.NONE;
    b.target.copy(b.target0);
    b.object.position.copy(b.position0);
    b.object.up.copy(b.up0);
    n.subVectors(b.object.position, b.target);
    b.object.lookAt(b.target);
    b.dispatchEvent(F);
    g.copy(b.object.position)
  }
    ;
  this.domElement.addEventListener("contextmenu", function (C) {
    C.preventDefault()
  }, !1);
  this.domElement.addEventListener("mousedown", function (C) {
    !1 !== b.enabled && (C.preventDefault(),
      C.stopPropagation(),
      h === k.NONE && (h = C.button),
      h !== k.ROTATE || b.noRotate ? h !== k.ZOOM || b.noZoom ? h !== k.PAN || b.noPan || (E.copy(K(C.pageX, C.pageY)),
        z.copy(E)) : (t.copy(K(C.pageX, C.pageY)),
          r.copy(t)) : (p.copy(Y(C.pageX, C.pageY)),
            q.copy(p)),
      document.addEventListener("mousemove", m, !1),
      document.addEventListener("mouseup", a, !1),
      b.dispatchEvent(U))
  }, !1);
  this.domElement.addEventListener("mousewheel", c, !1);
  this.domElement.addEventListener("DOMMouseScroll", c, !1);
  this.domElement.addEventListener("touchstart", function (C) {
    if (!1 !== b.enabled) {
      switch (C.touches.length) {
        case 1:
          h = k.TOUCH_ROTATE;
          p.copy(Y(C.touches[0].pageX, C.touches[0].pageY));
          q.copy(p);
          break;
        case 2:
          h = k.TOUCH_ZOOM_PAN;
          var H = C.touches[0].pageX - C.touches[1].pageX
            , T = C.touches[0].pageY - C.touches[1].pageY;
          x = v = Math.sqrt(H * H + T * T);
          E.copy(K((C.touches[0].pageX + C.touches[1].pageX) / 2, (C.touches[0].pageY + C.touches[1].pageY) / 2));
          z.copy(E);
          break;
        default:
          h = k.NONE
      }
      b.dispatchEvent(U)
    }
  }, !1);
  this.domElement.addEventListener("touchend", function (C) {
    if (!1 !== b.enabled) {
      switch (C.touches.length) {
        case 1:
          q.copy(Y(C.touches[0].pageX, C.touches[0].pageY));
          p.copy(q);
          break;
        case 2:
          v = x = 0,
            z.copy(K((C.touches[0].pageX + C.touches[1].pageX) / 2, (C.touches[0].pageY + C.touches[1].pageY) / 2)),
            E.copy(z)
      }
      h = k.NONE;
      b.dispatchEvent(Q)
    }
  }, !1);
  this.domElement.addEventListener("touchmove", function (C) {
    if (!1 !== b.enabled)
      switch (C.preventDefault(),
      C.stopPropagation(),
      C.touches.length) {
        case 1:
          q.copy(Y(C.touches[0].pageX, C.touches[0].pageY));
          break;
        case 2:
          var H = C.touches[0].pageX - C.touches[1].pageX
            , T = C.touches[0].pageY - C.touches[1].pageY;
          x = Math.sqrt(H * H + T * T);
          z.copy(K((C.touches[0].pageX + C.touches[1].pageX) / 2, (C.touches[0].pageY + C.touches[1].pageY) / 2));
          break;
        default:
          h = k.NONE
      }
  }, !1);
  window.addEventListener("keydown", e, !1);
  window.addEventListener("keyup", function (C) {
    !1 !== b.enabled && (h = l,
      window.addEventListener("keydown", e, !1))
  }, !1);
  this.handleResize();
  this.update()
}
  ;
THREE.TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
var dat = dat || {};
dat.gui = dat.gui || {};
dat.utils = dat.utils || {};
dat.controllers = dat.controllers || {};
dat.dom = dat.dom || {};
dat.color = dat.color || {};
dat.utils.css = function () {
  return {
    load: function (f, d) {
      d = d || document;
      var e = d.createElement("link");
      e.type = "text/css";
      e.rel = "stylesheet";
      e.href = f;
      d.getElementsByTagName("head")[0].appendChild(e)
    },
    inject: function (f, d) {
      d = d || document;
      var e = document.createElement("style");
      e.type = "text/css";
      e.innerHTML = f;
      d.getElementsByTagName("head")[0].appendChild(e)
    }
  }
}();
dat.utils.common = function () {
  var f = Array.prototype.forEach
    , d = Array.prototype.slice;
  return {
    BREAK: {},
    extend: function (e) {
      this.each(d.call(arguments, 1), function (m) {
        for (var a in m)
          this.isUndefined(m[a]) || (e[a] = m[a])
      }, this);
      return e
    },
    defaults: function (e) {
      this.each(d.call(arguments, 1), function (m) {
        for (var a in m)
          this.isUndefined(e[a]) && (e[a] = m[a])
      }, this);
      return e
    },
    compose: function () {
      var e = d.call(arguments);
      return function () {
        for (var m = d.call(arguments), a = e.length - 1; 0 <= a; a--)
          m = [e[a].apply(this, m)];
        return m[0]
      }
    },
    each: function (e, m, a) {
      if (f && e.forEach === f)
        e.forEach(m, a);
      else if (e.length === e.length + 0)
        for (var c = 0, b = e.length; c < b && !(c in e && m.call(a, e[c], c) === this.BREAK); c++)
          ;
      else
        for (c in e)
          if (m.call(a, e[c], c) === this.BREAK)
            break
    },
    defer: function (e) {
      setTimeout(e, 0)
    },
    toArray: function (e) {
      return e.toArray ? e.toArray() : d.call(e)
    },
    isUndefined: function (e) {
      return void 0 === e
    },
    isNull: function (e) {
      return null === e
    },
    isNaN: function (e) {
      return e !== e
    },
    isArray: Array.isArray || function (e) {
      return e.constructor === Array
    }
    ,
    isObject: function (e) {
      return e === Object(e)
    },
    isNumber: function (e) {
      return e === e + 0
    },
    isString: function (e) {
      return e === e + ""
    },
    isBoolean: function (e) {
      return !1 === e || !0 === e
    },
    isFunction: function (e) {
      return "[object Function]" === Object.prototype.toString.call(e)
    }
  }
}();
dat.controllers.Controller = function (f) {
  var d = function (e, m) {
    this.initialValue = e[m];
    this.domElement = document.createElement("div");
    this.object = e;
    this.property = m;
    this.__onFinishChange = this.__onChange = void 0
  };
  f.extend(d.prototype, {
    onChange: function (e) {
      this.__onChange = e;
      return this
    },
    onFinishChange: function (e) {
      this.__onFinishChange = e;
      return this
    },
    setValue: function (e) {
      this.object[this.property] = e;
      this.__onChange && this.__onChange.call(this, e);
      this.updateDisplay();
      return this
    },
    getValue: function () {
      return this.object[this.property]
    },
    updateDisplay: function () {
      return this
    },
    isModified: function () {
      return this.initialValue !== this.getValue()
    }
  });
  return d
}(dat.utils.common);
dat.dom.dom = function (f) {
  function d (c) {
    if ("0" === c || f.isUndefined(c))
      return 0;
    c = c.match(m);
    return f.isNull(c) ? 0 : parseFloat(c[1])
  }
  var e = {};
  f.each({
    HTMLEvents: ["change"],
    MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
    KeyboardEvents: ["keydown"]
  }, function (c, b) {
    f.each(c, function (k) {
      e[k] = b
    })
  });
  var m = /(\d+(\.\d+)?)px/
    , a = {
      makeSelectable: function (c, b) {
        void 0 !== c && void 0 !== c.style && (c.onselectstart = b ? function () {
          return !1
        }
          : function () { }
          ,
          c.style.MozUserSelect = b ? "auto" : "none",
          c.style.KhtmlUserSelect = b ? "auto" : "none",
          c.unselectable = b ? "on" : "off")
      },
      makeFullscreen: function (c, b, k) {
        f.isUndefined(b) && (b = !0);
        f.isUndefined(k) && (k = !0);
        c.style.position = "absolute";
        b && (c.style.left = 0,
          c.style.right = 0);
        k && (c.style.top = 0,
          c.style.bottom = 0)
      },
      fakeEvent: function (c, b, k, g) {
        k = k || {};
        var h = e[b];
        if (!h)
          throw Error("Event type " + b + " not supported.");
        var l = document.createEvent(h);
        switch (h) {
          case "MouseEvents":
            l.initMouseEvent(b, k.bubbles || !1, k.cancelable || !0, window, k.clickCount || 1, 0, 0, k.x || k.clientX || 0, k.y || k.clientY || 0, !1, !1, !1, !1, 0, null);
            break;
          case "KeyboardEvents":
            h = l.initKeyboardEvent || l.initKeyEvent;
            f.defaults(k, {
              cancelable: !0,
              ctrlKey: !1,
              altKey: !1,
              shiftKey: !1,
              metaKey: !1,
              keyCode: void 0,
              charCode: void 0
            });
            h(b, k.bubbles || !1, k.cancelable, window, k.ctrlKey, k.altKey, k.shiftKey, k.metaKey, k.keyCode, k.charCode);
            break;
          default:
            l.initEvent(b, k.bubbles || !1, k.cancelable || !0)
        }
        f.defaults(l, g);
        c.dispatchEvent(l)
      },
      bind: function (c, b, k, g) {
        c.addEventListener ? c.addEventListener(b, k, g || !1) : c.attachEvent && c.attachEvent("on" + b, k);
        return a
      },
      unbind: function (c, b, k, g) {
        c.removeEventListener ? c.removeEventListener(b, k, g || !1) : c.detachEvent && c.detachEvent("on" + b, k);
        return a
      },
      addClass: function (c, b) {
        if (void 0 === c.className)
          c.className = b;
        else if (c.className !== b) {
          var k = c.className.split(/ +/);
          -1 == k.indexOf(b) && (k.push(b),
            c.className = k.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
        }
        return a
      },
      removeClass: function (c, b) {
        if (b) {
          if (void 0 !== c.className)
            if (c.className === b)
              c.removeAttribute("class");
            else {
              var k = c.className.split(/ +/)
                , g = k.indexOf(b);
              -1 != g && (k.splice(g, 1),
                c.className = k.join(" "))
            }
        } else
          c.className = void 0;
        return a
      },
      hasClass: function (c, b) {
        return (new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)")).test(c.className) || !1
      },
      getWidth: function (c) {
        c = getComputedStyle(c);
        return d(c["border-left-width"]) + d(c["border-right-width"]) + d(c["padding-left"]) + d(c["padding-right"]) + d(c.width)
      },
      getHeight: function (c) {
        c = getComputedStyle(c);
        return d(c["border-top-width"]) + d(c["border-bottom-width"]) + d(c["padding-top"]) + d(c["padding-bottom"]) + d(c.height)
      },
      getOffset: function (c) {
        var b = {
          left: 0,
          top: 0
        };
        if (c.offsetParent) {
          do
            b.left += c.offsetLeft,
              b.top += c.offsetTop;
          while (c = c.offsetParent)
        }
        return b
      },
      isActive: function (c) {
        return c === document.activeElement && (c.type || c.href)
      }
    };
  return a
}(dat.utils.common);
dat.controllers.OptionController = function (f, d, e) {
  var m = function (a, c, b) {
    m.superclass.call(this, a, c);
    var k = this;
    this.__select = document.createElement("select");
    if (e.isArray(b)) {
      var g = {};
      e.each(b, function (h) {
        g[h] = h
      });
      b = g
    }
    e.each(b, function (h, l) {
      var n = document.createElement("option");
      n.innerHTML = l;
      n.setAttribute("value", h);
      k.__select.appendChild(n)
    });
    this.updateDisplay();
    d.bind(this.__select, "change", function () {
      k.setValue(this.options[this.selectedIndex].value)
    });
    this.domElement.appendChild(this.__select)
  };
  m.superclass = f;
  e.extend(m.prototype, f.prototype, {
    setValue: function (a) {
      a = m.superclass.prototype.setValue.call(this, a);
      this.__onFinishChange && this.__onFinishChange.call(this, this.getValue());
      return a
    },
    updateDisplay: function () {
      this.__select.value = this.getValue();
      return m.superclass.prototype.updateDisplay.call(this)
    }
  });
  return m
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.NumberController = function (f, d) {
  var e = function (m, a, c) {
    e.superclass.call(this, m, a);
    c = c || {};
    this.__min = c.min;
    this.__max = c.max;
    this.__step = c.step;
    d.isUndefined(this.__step) ? this.__impliedStep = 0 == this.initialValue ? 1 : Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__impliedStep = this.__step;
    m = this.__impliedStep;
    m = m.toString();
    m = -1 < m.indexOf(".") ? m.length - m.indexOf(".") - 1 : 0;
    this.__precision = m
  };
  e.superclass = f;
  d.extend(e.prototype, f.prototype, {
    setValue: function (m) {
      void 0 !== this.__min && m < this.__min ? m = this.__min : void 0 !== this.__max && m > this.__max && (m = this.__max);
      void 0 !== this.__step && 0 != m % this.__step && (m = Math.round(m / this.__step) * this.__step);
      return e.superclass.prototype.setValue.call(this, m)
    },
    min: function (m) {
      this.__min = m;
      return this
    },
    max: function (m) {
      this.__max = m;
      return this
    },
    step: function (m) {
      this.__step = m;
      return this
    }
  });
  return e
}(dat.controllers.Controller, dat.utils.common);
dat.controllers.NumberControllerBox = function (f, d, e) {
  var m = function (a, c, b) {
    function k () {
      var p = parseFloat(l.__input.value);
      e.isNaN(p) || l.setValue(p)
    }
    function g (p) {
      var q = n - p.clientY;
      l.setValue(l.getValue() + q * l.__impliedStep);
      n = p.clientY
    }
    function h () {
      d.unbind(window, "mousemove", g);
      d.unbind(window, "mouseup", h)
    }
    this.__truncationSuspended = !1;
    m.superclass.call(this, a, c, b);
    var l = this, n;
    this.__input = document.createElement("input");
    this.__input.setAttribute("type", "text");
    d.bind(this.__input, "change", k);
    d.bind(this.__input, "blur", function () {
      k();
      l.__onFinishChange && l.__onFinishChange.call(l, l.getValue())
    });
    d.bind(this.__input, "mousedown", function (p) {
      d.bind(window, "mousemove", g);
      d.bind(window, "mouseup", h);
      n = p.clientY
    });
    d.bind(this.__input, "keydown", function (p) {
      13 === p.keyCode && (l.__truncationSuspended = !0,
        this.blur(),
        l.__truncationSuspended = !1)
    });
    this.updateDisplay();
    this.domElement.appendChild(this.__input)
  };
  m.superclass = f;
  e.extend(m.prototype, f.prototype, {
    updateDisplay: function () {
      var a = this.__input;
      if (this.__truncationSuspended)
        var c = this.getValue();
      else {
        c = this.getValue();
        var b = Math.pow(10, this.__precision);
        c = Math.round(c * b) / b
      }
      a.value = c;
      return m.superclass.prototype.updateDisplay.call(this)
    }
  });
  return m
}(dat.controllers.NumberController, dat.dom.dom, dat.utils.common);
dat.controllers.NumberControllerSlider = function (f, d, e, m, a) {
  function c (k, g, h, l, n) {
    return l + (k - g) / (h - g) * (n - l)
  }
  var b = function (k, g, h, l, n) {
    function p (r) {
      r.preventDefault();
      var v = d.getOffset(t.__background)
        , x = d.getWidth(t.__background);
      t.setValue(c(r.clientX, v.left, v.left + x, t.__min, t.__max));
      return !1
    }
    function q () {
      d.unbind(window, "mousemove", p);
      d.unbind(window, "mouseup", q);
      t.__onFinishChange && t.__onFinishChange.call(t, t.getValue())
    }
    b.superclass.call(this, k, g, {
      min: h,
      max: l,
      step: n
    });
    var t = this;
    this.__background = document.createElement("div");
    this.__foreground = document.createElement("div");
    d.bind(this.__background, "mousedown", function (r) {
      d.bind(window, "mousemove", p);
      d.bind(window, "mouseup", q);
      p(r)
    });
    d.addClass(this.__background, "slider");
    d.addClass(this.__foreground, "slider-fg");
    this.updateDisplay();
    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background)
  };
  b.superclass = f;
  b.useDefaultStyles = function () {
    e.inject(a)
  }
    ;
  m.extend(b.prototype, f.prototype, {
    updateDisplay: function () {
      var k = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = 100 * k + "%";
      return b.superclass.prototype.updateDisplay.call(this)
    }
  });
  return b
}(dat.controllers.NumberController, dat.dom.dom, dat.utils.css, dat.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");
dat.controllers.FunctionController = function (f, d, e) {
  var m = function (a, c, b) {
    m.superclass.call(this, a, c);
    var k = this;
    this.__button = document.createElement("div");
    this.__button.innerHTML = void 0 === b ? "Fire" : b;
    d.bind(this.__button, "click", function (g) {
      g.preventDefault();
      k.fire();
      return !1
    });
    d.addClass(this.__button, "button");
    this.domElement.appendChild(this.__button)
  };
  m.superclass = f;
  e.extend(m.prototype, f.prototype, {
    fire: function () {
      this.__onChange && this.__onChange.call(this);
      this.__onFinishChange && this.__onFinishChange.call(this, this.getValue());
      this.getValue().call(this.object)
    }
  });
  return m
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.BooleanController = function (f, d, e) {
  var m = function (a, c) {
    m.superclass.call(this, a, c);
    var b = this;
    this.__prev = this.getValue();
    this.__checkbox = document.createElement("input");
    this.__checkbox.setAttribute("type", "checkbox");
    d.bind(this.__checkbox, "change", function () {
      b.setValue(!b.__prev)
    }, !1);
    this.domElement.appendChild(this.__checkbox);
    this.updateDisplay()
  };
  m.superclass = f;
  e.extend(m.prototype, f.prototype, {
    setValue: function (a) {
      a = m.superclass.prototype.setValue.call(this, a);
      this.__onFinishChange && this.__onFinishChange.call(this, this.getValue());
      this.__prev = this.getValue();
      return a
    },
    updateDisplay: function () {
      !0 === this.getValue() ? (this.__checkbox.setAttribute("checked", "checked"),
        this.__checkbox.checked = !0) : this.__checkbox.checked = !1;
      return m.superclass.prototype.updateDisplay.call(this)
    }
  });
  return m
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.color.toString = function (f) {
  return function (d) {
    if (1 == d.a || f.isUndefined(d.a)) {
      for (d = d.hex.toString(16); 6 > d.length;)
        d = "0" + d;
      return "#" + d
    }
    return "rgba(" + Math.round(d.r) + "," + Math.round(d.g) + "," + Math.round(d.b) + "," + d.a + ")"
  }
}(dat.utils.common);
dat.color.interpret = function (f, d) {
  var e, m, a = [{
    litmus: d.isString,
    conversions: {
      THREE_CHAR_HEX: {
        read: function (c) {
          c = c.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          return null === c ? !1 : {
            space: "HEX",
            hex: parseInt("0x" + c[1].toString() + c[1].toString() + c[2].toString() + c[2].toString() + c[3].toString() + c[3].toString())
          }
        },
        write: f
      },
      SIX_CHAR_HEX: {
        read: function (c) {
          c = c.match(/^#([A-F0-9]{6})$/i);
          return null === c ? !1 : {
            space: "HEX",
            hex: parseInt("0x" + c[1].toString())
          }
        },
        write: f
      },
      CSS_RGB: {
        read: function (c) {
          c = c.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          return null === c ? !1 : {
            space: "RGB",
            r: parseFloat(c[1]),
            g: parseFloat(c[2]),
            b: parseFloat(c[3])
          }
        },
        write: f
      },
      CSS_RGBA: {
        read: function (c) {
          c = c.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          return null === c ? !1 : {
            space: "RGB",
            r: parseFloat(c[1]),
            g: parseFloat(c[2]),
            b: parseFloat(c[3]),
            a: parseFloat(c[4])
          }
        },
        write: f
      }
    }
  }, {
    litmus: d.isNumber,
    conversions: {
      HEX: {
        read: function (c) {
          return {
            space: "HEX",
            hex: c,
            conversionName: "HEX"
          }
        },
        write: function (c) {
          return c.hex
        }
      }
    }
  }, {
    litmus: d.isArray,
    conversions: {
      RGB_ARRAY: {
        read: function (c) {
          return 3 != c.length ? !1 : {
            space: "RGB",
            r: c[0],
            g: c[1],
            b: c[2]
          }
        },
        write: function (c) {
          return [c.r, c.g, c.b]
        }
      },
      RGBA_ARRAY: {
        read: function (c) {
          return 4 != c.length ? !1 : {
            space: "RGB",
            r: c[0],
            g: c[1],
            b: c[2],
            a: c[3]
          }
        },
        write: function (c) {
          return [c.r, c.g, c.b, c.a]
        }
      }
    }
  }, {
    litmus: d.isObject,
    conversions: {
      RGBA_OBJ: {
        read: function (c) {
          return d.isNumber(c.r) && d.isNumber(c.g) && d.isNumber(c.b) && d.isNumber(c.a) ? {
            space: "RGB",
            r: c.r,
            g: c.g,
            b: c.b,
            a: c.a
          } : !1
        },
        write: function (c) {
          return {
            r: c.r,
            g: c.g,
            b: c.b,
            a: c.a
          }
        }
      },
      RGB_OBJ: {
        read: function (c) {
          return d.isNumber(c.r) && d.isNumber(c.g) && d.isNumber(c.b) ? {
            space: "RGB",
            r: c.r,
            g: c.g,
            b: c.b
          } : !1
        },
        write: function (c) {
          return {
            r: c.r,
            g: c.g,
            b: c.b
          }
        }
      },
      HSVA_OBJ: {
        read: function (c) {
          return d.isNumber(c.h) && d.isNumber(c.s) && d.isNumber(c.v) && d.isNumber(c.a) ? {
            space: "HSV",
            h: c.h,
            s: c.s,
            v: c.v,
            a: c.a
          } : !1
        },
        write: function (c) {
          return {
            h: c.h,
            s: c.s,
            v: c.v,
            a: c.a
          }
        }
      },
      HSV_OBJ: {
        read: function (c) {
          return d.isNumber(c.h) && d.isNumber(c.s) && d.isNumber(c.v) ? {
            space: "HSV",
            h: c.h,
            s: c.s,
            v: c.v
          } : !1
        },
        write: function (c) {
          return {
            h: c.h,
            s: c.s,
            v: c.v
          }
        }
      }
    }
  }];
  return function () {
    m = !1;
    var c = 1 < arguments.length ? d.toArray(arguments) : arguments[0];
    d.each(a, function (b) {
      if (b.litmus(c))
        return d.each(b.conversions, function (k, g) {
          e = k.read(c);
          if (!1 === m && !1 !== e)
            return m = e,
              e.conversionName = g,
              e.conversion = k,
              d.BREAK
        }),
          d.BREAK
    });
    return m
  }
}(dat.color.toString, dat.utils.common);
dat.GUI = dat.gui.GUI = function (f, d, e, m, a, c, b, k, g, h, l, n, p, q, t) {
  function r (A, B, y, u) {
    if (void 0 === B[y])
      throw Error("Object " + B + ' has no property "' + y + '"');
    u.color ? B = new l(B, y) : (B = [B, y].concat(u.factoryArgs),
      B = m.apply(A, B));
    u.before instanceof a && (u.before = u.before.__li);
    E(A, B);
    q.addClass(B.domElement, "c");
    y = document.createElement("span");
    q.addClass(y, "property-name");
    y.innerHTML = B.property;
    var w = document.createElement("div");
    w.appendChild(y);
    w.appendChild(B.domElement);
    u = v(A, w, u.before);
    q.addClass(u, L.CLASS_CONTROLLER_ROW);
    q.addClass(u, typeof B.getValue());
    x(A, u, B);
    A.__controllers.push(B);
    return B
  }
  function v (A, B, y) {
    var u = document.createElement("li");
    B && u.appendChild(B);
    y ? A.__ul.insertBefore(u, params.before) : A.__ul.appendChild(u);
    A.onResize();
    return u
  }
  function x (A, B, y) {
    y.__li = B;
    y.__gui = A;
    t.extend(y, {
      options: function (D) {
        if (1 < arguments.length)
          return y.remove(),
            r(A, y.object, y.property, {
              before: y.__li.nextElementSibling,
              factoryArgs: [t.toArray(arguments)]
            });
        if (t.isArray(D) || t.isObject(D))
          return y.remove(),
            r(A, y.object, y.property, {
              before: y.__li.nextElementSibling,
              factoryArgs: [D]
            })
      },
      name: function (D) {
        y.__li.firstElementChild.firstElementChild.innerHTML = D;
        return y
      },
      listen: function () {
        y.__gui.listen(y);
        return y
      },
      remove: function () {
        y.__gui.remove(y);
        return y
      }
    });
    if (y instanceof g) {
      var u = new k(y.object, y.property, {
        min: y.__min,
        max: y.__max,
        step: y.__step
      });
      t.each(["updateDisplay", "onChange", "onFinishChange"], function (D) {
        var O = y[D]
          , J = u[D];
        y[D] = u[D] = function () {
          var G = Array.prototype.slice.call(arguments);
          O.apply(y, G);
          return J.apply(u, G)
        }
      });
      q.addClass(B, "has-slider");
      y.domElement.insertBefore(u.domElement, y.domElement.firstElementChild)
    } else if (y instanceof k) {
      var w = function (D) {
        return t.isNumber(y.__min) && t.isNumber(y.__max) ? (y.remove(),
          r(A, y.object, y.property, {
            before: y.__li.nextElementSibling,
            factoryArgs: [y.__min, y.__max, y.__step]
          })) : D
      };
      y.min = t.compose(w, y.min);
      y.max = t.compose(w, y.max)
    } else
      y instanceof c ? (q.bind(B, "click", function () {
        q.fakeEvent(y.__checkbox, "click")
      }),
        q.bind(y.__checkbox, "click", function (D) {
          D.stopPropagation()
        })) : y instanceof b ? (q.bind(B, "click", function () {
          q.fakeEvent(y.__button, "click")
        }),
          q.bind(B, "mouseover", function () {
            q.addClass(y.__button, "hover")
          }),
          q.bind(B, "mouseout", function () {
            q.removeClass(y.__button, "hover")
          })) : y instanceof l && (q.addClass(B, "color"),
            y.updateDisplay = t.compose(function (D) {
              B.style.borderLeftColor = y.__color.toString();
              return D
            }, y.updateDisplay),
            y.updateDisplay());
    y.setValue = t.compose(function (D) {
      A.getRoot().__preset_select && y.isModified() && Y(A.getRoot(), !0);
      return D
    }, y.setValue)
  }
  function E (A, B) {
    var y = A.getRoot()
      , u = y.__rememberedObjects.indexOf(B.object);
    if (-1 != u) {
      var w = y.__rememberedObjectIndecesToControllers[u];
      void 0 === w && (w = {},
        y.__rememberedObjectIndecesToControllers[u] = w);
      w[B.property] = B;
      if (y.load && y.load.remembered) {
        y = y.load.remembered;
        if (y[A.preset])
          y = y[A.preset];
        else if (y.Default)
          y = y.Default;
        else
          return;
        y[u] && void 0 !== y[u][B.property] && (u = y[u][B.property],
          B.initialValue = u,
          B.setValue(u))
      }
    }
  }
  function z (A) {
    var B = A.__save_row = document.createElement("li");
    q.addClass(A.domElement, "has-save");
    A.__ul.insertBefore(B, A.__ul.firstChild);
    q.addClass(B, "save-row");
    var y = document.createElement("span");
    y.innerHTML = "&nbsp;";
    q.addClass(y, "button gears");
    var u = document.createElement("span");
    u.innerHTML = "Save";
    q.addClass(u, "button");
    q.addClass(u, "save");
    var w = document.createElement("span");
    w.innerHTML = "New";
    q.addClass(w, "button");
    q.addClass(w, "save-as");
    var D = document.createElement("span");
    D.innerHTML = "Revert";
    q.addClass(D, "button");
    q.addClass(D, "revert");
    var O = A.__preset_select = document.createElement("select");
    A.load && A.load.remembered ? t.each(A.load.remembered, function (ba, I) {
      K(A, I, I == A.preset)
    }) : K(A, "Default", !1);
    q.bind(O, "change", function () {
      for (var ba = 0; ba < A.__preset_select.length; ba++)
        A.__preset_select[ba].innerHTML = A.__preset_select[ba].value;
      A.preset = this.value
    });
    B.appendChild(O);
    B.appendChild(y);
    B.appendChild(u);
    B.appendChild(w);
    B.appendChild(D);
    if (H) {
      var J = function () {
        G.style.display = A.useLocalStorage ? "block" : "none"
      };
      B = document.getElementById("dg-save-locally");
      var G = document.getElementById("dg-local-explain");
      B.style.display = "block";
      B = document.getElementById("dg-local-storage");
      "true" === localStorage.getItem(document.location.href + ".isLocal") && B.setAttribute("checked", "checked");
      J();
      q.bind(B, "change", function () {
        A.useLocalStorage = !A.useLocalStorage;
        J()
      })
    }
    var S = document.getElementById("dg-new-constructor");
    q.bind(S, "keydown", function (ba) {
      !ba.metaKey || 67 !== ba.which && 67 != ba.keyCode || T.hide()
    });
    q.bind(y, "click", function () {
      S.innerHTML = JSON.stringify(A.getSaveObject(), void 0, 2);
      T.show();
      S.focus();
      S.select()
    });
    q.bind(u, "click", function () {
      A.save()
    });
    q.bind(w, "click", function () {
      var ba = prompt("Enter a new preset name.");
      ba && A.saveAs(ba)
    });
    q.bind(D, "click", function () {
      A.revert()
    })
  }
  function F (A) {
    function B (D) {
      D.preventDefault();
      w = D.clientX;
      q.addClass(A.__closeButton, L.CLASS_DRAG);
      q.bind(window, "mousemove", y);
      q.bind(window, "mouseup", u);
      return !1
    }
    function y (D) {
      D.preventDefault();
      A.width += w - D.clientX;
      A.onResize();
      w = D.clientX;
      return !1
    }
    function u () {
      q.removeClass(A.__closeButton, L.CLASS_DRAG);
      q.unbind(window, "mousemove", y);
      q.unbind(window, "mouseup", u)
    }
    A.__resize_handle = document.createElement("div");
    t.extend(A.__resize_handle.style, {
      width: "6px",
      marginLeft: "-3px",
      height: "200px",
      cursor: "ew-resize",
      position: "absolute"
    });
    var w;
    q.bind(A.__resize_handle, "mousedown", B);
    q.bind(A.__closeButton, "mousedown", B);
    A.domElement.insertBefore(A.__resize_handle, A.domElement.firstElementChild)
  }
  function U (A, B) {
    A.domElement.style.width = B + "px";
    A.__save_row && A.autoPlace && (A.__save_row.style.width = B + "px");
    A.__closeButton && (A.__closeButton.style.width = B + "px")
  }
  function Q (A, B) {
    var y = {};
    t.each(A.__rememberedObjects, function (u, w) {
      var D = {};
      t.each(A.__rememberedObjectIndecesToControllers[w], function (O, J) {
        D[J] = B ? O.initialValue : O.getValue()
      });
      y[w] = D
    });
    return y
  }
  function K (A, B, y) {
    var u = document.createElement("option");
    u.innerHTML = B;
    u.value = B;
    A.__preset_select.appendChild(u);
    y && (A.__preset_select.selectedIndex = A.__preset_select.length - 1)
  }
  function Y (A, B) {
    var y = A.__preset_select[A.__preset_select.selectedIndex];
    y.innerHTML = B ? y.value + "*" : y.value
  }
  function C (A) {
    0 != A.length && n(function () {
      C(A)
    });
    t.each(A, function (B) {
      B.updateDisplay()
    })
  }
  f.inject(e);
  try {
    var H = "localStorage" in window && null !== window.localStorage
  } catch (A) {
    H = !1
  }
  var T, M = !0, ca, P = !1, X = [], L = function (A) {
    function B () {
      localStorage.setItem(document.location.href + ".gui", JSON.stringify(u.getSaveObject()))
    }
    function y () {
      var J = u.getRoot();
      J.width += 1;
      t.defer(function () {
        --J.width
      })
    }
    var u = this;
    this.domElement = document.createElement("div");
    this.__ul = document.createElement("ul");
    this.domElement.appendChild(this.__ul);
    q.addClass(this.domElement, "dg");
    this.__folders = {};
    this.__controllers = [];
    this.__rememberedObjects = [];
    this.__rememberedObjectIndecesToControllers = [];
    this.__listening = [];
    A = A || {};
    A = t.defaults(A, {
      autoPlace: !0,
      width: L.DEFAULT_WIDTH
    });
    A = t.defaults(A, {
      resizable: A.autoPlace,
      hideable: A.autoPlace
    });
    t.isUndefined(A.load) ? A.load = {
      preset: "Default"
    } : A.preset && (A.load.preset = A.preset);
    t.isUndefined(A.parent) && A.hideable && X.push(this);
    A.resizable = t.isUndefined(A.parent) && A.resizable;
    A.autoPlace && t.isUndefined(A.scrollable) && (A.scrollable = !0);
    var w = H && "true" === localStorage.getItem(document.location.href + ".isLocal");
    Object.defineProperties(this, {
      parent: {
        get: function () {
          return A.parent
        }
      },
      scrollable: {
        get: function () {
          return A.scrollable
        }
      },
      autoPlace: {
        get: function () {
          return A.autoPlace
        }
      },
      preset: {
        get: function () {
          return u.parent ? u.getRoot().preset : A.load.preset
        },
        set: function (J) {
          u.parent ? u.getRoot().preset = J : A.load.preset = J;
          for (J = 0; J < this.__preset_select.length; J++)
            this.__preset_select[J].value == this.preset && (this.__preset_select.selectedIndex = J);
          u.revert()
        }
      },
      width: {
        get: function () {
          return A.width
        },
        set: function (J) {
          A.width = J;
          U(u, J)
        }
      },
      name: {
        get: function () {
          return A.name
        },
        set: function (J) {
          A.name = J;
          O && (O.innerHTML = A.name)
        }
      },
      closed: {
        get: function () {
          return A.closed
        },
        set: function (J) {
          A.closed = J;
          A.closed ? q.addClass(u.__ul, L.CLASS_CLOSED) : q.removeClass(u.__ul, L.CLASS_CLOSED);
          this.onResize();
          u.__closeButton && (u.__closeButton.innerHTML = J ? L.TEXT_OPEN : L.TEXT_CLOSED)
        }
      },
      load: {
        get: function () {
          return A.load
        }
      },
      useLocalStorage: {
        get: function () {
          return w
        },
        set: function (J) {
          H && ((w = J) ? q.bind(window, "unload", B) : q.unbind(window, "unload", B),
            localStorage.setItem(document.location.href + ".isLocal", J))
        }
      }
    });
    if (t.isUndefined(A.parent)) {
      A.closed = !1;
      q.addClass(this.domElement, L.CLASS_MAIN);
      q.makeSelectable(this.domElement, !1);
      if (H && w) {
        u.useLocalStorage = !0;
        var D = localStorage.getItem(document.location.href + ".gui");
        D && (A.load = JSON.parse(D))
      }
      this.__closeButton = document.createElement("div");
      this.__closeButton.innerHTML = L.TEXT_CLOSED;
      q.addClass(this.__closeButton, L.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);
      q.bind(this.__closeButton, "click", function () {
        u.closed = !u.closed
      })
    } else {
      void 0 === A.closed && (A.closed = !0);
      var O = document.createTextNode(A.name);
      q.addClass(O, "controller-name");
      D = v(u, O);
      q.addClass(this.__ul, L.CLASS_CLOSED);
      q.addClass(D, "title");
      q.bind(D, "click", function (J) {
        J.preventDefault();
        u.closed = !u.closed;
        return !1
      });
      A.closed || (this.closed = !1)
    }
    A.autoPlace && (t.isUndefined(A.parent) && (M && (ca = document.createElement("div"),
      q.addClass(ca, "dg"),
      q.addClass(ca, L.CLASS_AUTO_PLACE_CONTAINER),
      document.body.appendChild(ca),
      M = !1),
      ca.appendChild(this.domElement),
      q.addClass(this.domElement, L.CLASS_AUTO_PLACE)),
      this.parent || U(u, A.width));
    q.bind(window, "resize", function () {
      u.onResize()
    });
    q.bind(this.__ul, "webkitTransitionEnd", function () {
      u.onResize()
    });
    q.bind(this.__ul, "transitionend", function () {
      u.onResize()
    });
    q.bind(this.__ul, "oTransitionEnd", function () {
      u.onResize()
    });
    this.onResize();
    A.resizable && F(this);
    u.getRoot();
    A.parent || y()
  };
  L.toggleHide = function () {
    P = !P;
    t.each(X, function (A) {
      A.domElement.style.zIndex = P ? -999 : 999;
      A.domElement.style.opacity = P ? 0 : 1
    })
  }
    ;
  L.CLASS_AUTO_PLACE = "a";
  L.CLASS_AUTO_PLACE_CONTAINER = "ac";
  L.CLASS_MAIN = "main";
  L.CLASS_CONTROLLER_ROW = "cr";
  L.CLASS_TOO_TALL = "taller-than-window";
  L.CLASS_CLOSED = "closed";
  L.CLASS_CLOSE_BUTTON = "close-button";
  L.CLASS_DRAG = "drag";
  L.DEFAULT_WIDTH = 245;
  L.TEXT_CLOSED = "Close Controls";
  L.TEXT_OPEN = "Open Controls";
  q.bind(window, "keydown", function (A) {
    "text" === document.activeElement.type || 72 !== A.which && 72 != A.keyCode || L.toggleHide()
  }, !1);
  t.extend(L.prototype, {
    add: function (A, B) {
      return r(this, A, B, {
        factoryArgs: Array.prototype.slice.call(arguments, 2)
      })
    },
    addColor: function (A, B) {
      return r(this, A, B, {
        color: !0
      })
    },
    remove: function (A) {
      this.__ul.removeChild(A.__li);
      this.__controllers.slice(this.__controllers.indexOf(A), 1);
      var B = this;
      t.defer(function () {
        B.onResize()
      })
    },
    destroy: function () {
      this.autoPlace && ca.removeChild(this.domElement)
    },
    addFolder: function (A) {
      if (void 0 !== this.__folders[A])
        throw Error('You already have a folder in this GUI by the name "' + A + '"');
      var B = {
        name: A,
        parent: this
      };
      B.autoPlace = this.autoPlace;
      this.load && this.load.folders && this.load.folders[A] && (B.closed = this.load.folders[A].closed,
        B.load = this.load.folders[A]);
      B = new L(B);
      this.__folders[A] = B;
      A = v(this, B.domElement);
      q.addClass(A, "folder");
      return B
    },
    open: function () {
      this.closed = !1
    },
    close: function () {
      this.closed = !0
    },
    onResize: function () {
      var A = this.getRoot();
      if (A.scrollable) {
        var B = q.getOffset(A.__ul).top
          , y = 0;
        t.each(A.__ul.childNodes, function (u) {
          A.autoPlace && u === A.__save_row || (y += q.getHeight(u))
        });
        window.innerHeight - B - 20 < y ? (q.addClass(A.domElement, L.CLASS_TOO_TALL),
          A.__ul.style.height = window.innerHeight - B - 20 + "px") : (q.removeClass(A.domElement, L.CLASS_TOO_TALL),
            A.__ul.style.height = "auto")
      }
      A.__resize_handle && t.defer(function () {
        A.__resize_handle.style.height = A.__ul.offsetHeight + "px"
      });
      A.__closeButton && (A.__closeButton.style.width = A.width + "px")
    },
    remember: function () {
      t.isUndefined(T) && (T = new p,
        T.domElement.innerHTML = d);
      if (this.parent)
        throw Error("You can only call remember on a top level GUI.");
      var A = this;
      t.each(Array.prototype.slice.call(arguments), function (B) {
        0 == A.__rememberedObjects.length && z(A);
        -1 == A.__rememberedObjects.indexOf(B) && A.__rememberedObjects.push(B)
      });
      this.autoPlace && U(this, this.width)
    },
    getRoot: function () {
      for (var A = this; A.parent;)
        A = A.parent;
      return A
    },
    getSaveObject: function () {
      var A = this.load;
      A.closed = this.closed;
      0 < this.__rememberedObjects.length && (A.preset = this.preset,
        A.remembered || (A.remembered = {}),
        A.remembered[this.preset] = Q(this));
      A.folders = {};
      t.each(this.__folders, function (B, y) {
        A.folders[y] = B.getSaveObject()
      });
      return A
    },
    save: function () {
      this.load.remembered || (this.load.remembered = {});
      this.load.remembered[this.preset] = Q(this);
      Y(this, !1)
    },
    saveAs: function (A) {
      this.load.remembered || (this.load.remembered = {},
        this.load.remembered.Default = Q(this, !0));
      this.load.remembered[A] = Q(this);
      this.preset = A;
      K(this, A, !0)
    },
    revert: function (A) {
      t.each(this.__controllers, function (B) {
        this.getRoot().load.remembered ? E(A || this.getRoot(), B) : B.setValue(B.initialValue)
      }, this);
      t.each(this.__folders, function (B) {
        B.revert(B)
      });
      A || Y(this.getRoot(), !1)
    },
    listen: function (A) {
      var B = 0 == this.__listening.length;
      this.__listening.push(A);
      B && C(this.__listening)
    }
  });
  return L
}(dat.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>', ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n", dat.controllers.factory = function (f, d, e, m, a, c, b) {
  return function (k, g, h, l) {
    var n = k[g];
    if (b.isArray(h) || b.isObject(h))
      return new f(k, g, h);
    if (b.isNumber(n))
      return b.isNumber(h) && b.isNumber(l) ? new e(k, g, h, l) : new d(k, g, {
        min: h,
        max: l
      });
    if (b.isString(n))
      return new m(k, g);
    if (b.isFunction(n))
      return new a(k, g, "");
    if (b.isBoolean(n))
      return new c(k, g)
  }
}(dat.controllers.OptionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.StringController = function (f, d, e) {
  var m = function (a, c) {
    function b () {
      k.setValue(k.__input.value)
    }
    m.superclass.call(this, a, c);
    var k = this;
    this.__input = document.createElement("input");
    this.__input.setAttribute("type", "text");
    d.bind(this.__input, "keyup", b);
    d.bind(this.__input, "change", b);
    d.bind(this.__input, "blur", function () {
      k.__onFinishChange && k.__onFinishChange.call(k, k.getValue())
    });
    d.bind(this.__input, "keydown", function (g) {
      13 === g.keyCode && this.blur()
    });
    this.updateDisplay();
    this.domElement.appendChild(this.__input)
  };
  m.superclass = f;
  e.extend(m.prototype, f.prototype, {
    updateDisplay: function () {
      d.isActive(this.__input) || (this.__input.value = this.getValue());
      return m.superclass.prototype.updateDisplay.call(this)
    }
  });
  return m
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.FunctionController, dat.controllers.BooleanController, dat.utils.common), dat.controllers.Controller, dat.controllers.BooleanController, dat.controllers.FunctionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.OptionController, dat.controllers.ColorController = function (f, d, e, m, a) {
  function c (h, l, n, p) {
    h.style.background = "";
    a.each(g, function (q) {
      h.style.cssText += "background: " + q + "linear-gradient(" + l + ", " + n + " 0%, " + p + " 100%); "
    })
  }
  function b (h) {
    h.style.background = "";
    h.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);";
    h.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
    h.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
    h.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
    h.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
  }
  var k = function (h, l) {
    function n (z) {
      r(z);
      d.bind(window, "mousemove", r);
      d.bind(window, "mouseup", p)
    }
    function p () {
      d.unbind(window, "mousemove", r);
      d.unbind(window, "mouseup", p)
    }
    function q () {
      var z = m(this.value);
      !1 !== z ? (x.__color.__state = z,
        x.setValue(x.__color.toOriginal())) : this.value = x.__color.toString()
    }
    function t () {
      d.unbind(window, "mousemove", v);
      d.unbind(window, "mouseup", t)
    }
    function r (z) {
      z.preventDefault();
      var F = d.getWidth(x.__saturation_field)
        , U = d.getOffset(x.__saturation_field)
        , Q = (z.clientX - U.left + document.body.scrollLeft) / F;
      z = 1 - (z.clientY - U.top + document.body.scrollTop) / F;
      1 < z ? z = 1 : 0 > z && (z = 0);
      1 < Q ? Q = 1 : 0 > Q && (Q = 0);
      x.__color.v = z;
      x.__color.s = Q;
      x.setValue(x.__color.toOriginal());
      return !1
    }
    function v (z) {
      z.preventDefault();
      var F = d.getHeight(x.__hue_field)
        , U = d.getOffset(x.__hue_field);
      z = 1 - (z.clientY - U.top + document.body.scrollTop) / F;
      1 < z ? z = 1 : 0 > z && (z = 0);
      x.__color.h = 360 * z;
      x.setValue(x.__color.toOriginal());
      return !1
    }
    k.superclass.call(this, h, l);
    this.__color = new e(this.getValue());
    this.__temp = new e(0);
    var x = this;
    this.domElement = document.createElement("div");
    d.makeSelectable(this.domElement, !1);
    this.__selector = document.createElement("div");
    this.__selector.className = "selector";
    this.__saturation_field = document.createElement("div");
    this.__saturation_field.className = "saturation-field";
    this.__field_knob = document.createElement("div");
    this.__field_knob.className = "field-knob";
    this.__field_knob_border = "2px solid ";
    this.__hue_knob = document.createElement("div");
    this.__hue_knob.className = "hue-knob";
    this.__hue_field = document.createElement("div");
    this.__hue_field.className = "hue-field";
    this.__input = document.createElement("input");
    this.__input.type = "text";
    this.__input_textShadow = "0 1px 1px ";
    d.bind(this.__input, "keydown", function (z) {
      13 === z.keyCode && q.call(this)
    });
    d.bind(this.__input, "blur", q);
    d.bind(this.__selector, "mousedown", function (z) {
      d.addClass(this, "drag").bind(window, "mouseup", function (F) {
        d.removeClass(x.__selector, "drag")
      })
    });
    var E = document.createElement("div");
    a.extend(this.__selector.style, {
      width: "122px",
      height: "102px",
      padding: "3px",
      backgroundColor: "#222",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
    });
    a.extend(this.__field_knob.style, {
      position: "absolute",
      width: "12px",
      height: "12px",
      border: this.__field_knob_border + (.5 > this.__color.v ? "#fff" : "#000"),
      boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
      borderRadius: "12px",
      zIndex: 1
    });
    a.extend(this.__hue_knob.style, {
      position: "absolute",
      width: "15px",
      height: "2px",
      borderRight: "4px solid #fff",
      zIndex: 1
    });
    a.extend(this.__saturation_field.style, {
      width: "100px",
      height: "100px",
      border: "1px solid #555",
      marginRight: "3px",
      display: "inline-block",
      cursor: "pointer"
    });
    a.extend(E.style, {
      width: "100%",
      height: "100%",
      background: "none"
    });
    c(E, "top", "rgba(0,0,0,0)", "#000");
    a.extend(this.__hue_field.style, {
      width: "15px",
      height: "100px",
      display: "inline-block",
      border: "1px solid #555",
      cursor: "ns-resize"
    });
    b(this.__hue_field);
    a.extend(this.__input.style, {
      outline: "none",
      textAlign: "center",
      color: "#fff",
      border: 0,
      fontWeight: "bold",
      textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
    });
    d.bind(this.__saturation_field, "mousedown", n);
    d.bind(this.__field_knob, "mousedown", n);
    d.bind(this.__hue_field, "mousedown", function (z) {
      v(z);
      d.bind(window, "mousemove", v);
      d.bind(window, "mouseup", t)
    });
    this.__saturation_field.appendChild(E);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);
    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);
    this.updateDisplay()
  };
  k.superclass = f;
  a.extend(k.prototype, f.prototype, {
    updateDisplay: function () {
      var h = m(this.getValue());
      if (!1 !== h) {
        var l = !1;
        a.each(e.COMPONENTS, function (q) {
          if (!a.isUndefined(h[q]) && !a.isUndefined(this.__color.__state[q]) && h[q] !== this.__color.__state[q])
            return l = !0,
              {}
        }, this);
        l && a.extend(this.__color.__state, h)
      }
      a.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var n = .5 > this.__color.v || .5 < this.__color.s ? 255 : 0
        , p = 255 - n;
      a.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + "px",
        marginTop: 100 * (1 - this.__color.v) - 7 + "px",
        backgroundColor: this.__temp.toString(),
        border: this.__field_knob_border + "rgb(" + n + "," + n + "," + n + ")"
      });
      this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px";
      this.__temp.s = 1;
      this.__temp.v = 1;
      c(this.__saturation_field, "left", "#fff", this.__temp.toString());
      a.extend(this.__input.style, {
        backgroundColor: this.__input.value = this.__color.toString(),
        color: "rgb(" + n + "," + n + "," + n + ")",
        textShadow: this.__input_textShadow + "rgba(" + p + "," + p + "," + p + ",.7)"
      })
    }
  });
  var g = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
  return k
}(dat.controllers.Controller, dat.dom.dom, dat.color.Color = function (f, d, e, m) {
  function a (h, l, n) {
    Object.defineProperty(h, l, {
      get: function () {
        if ("RGB" === this.__state.space)
          return this.__state[l];
        b(this, l, n);
        return this.__state[l]
      },
      set: function (p) {
        "RGB" !== this.__state.space && (b(this, l, n),
          this.__state.space = "RGB");
        this.__state[l] = p
      }
    })
  }
  function c (h, l) {
    Object.defineProperty(h, l, {
      get: function () {
        if ("HSV" === this.__state.space)
          return this.__state[l];
        k(this);
        return this.__state[l]
      },
      set: function (n) {
        "HSV" !== this.__state.space && (k(this),
          this.__state.space = "HSV");
        this.__state[l] = n
      }
    })
  }
  function b (h, l, n) {
    if ("HEX" === h.__state.space)
      h.__state[l] = d.component_from_hex(h.__state.hex, n);
    else if ("HSV" === h.__state.space)
      m.extend(h.__state, d.hsv_to_rgb(h.__state.h, h.__state.s, h.__state.v));
    else
      throw "Corrupted color state";
  }
  function k (h) {
    var l = d.rgb_to_hsv(h.r, h.g, h.b);
    m.extend(h.__state, {
      s: l.s,
      v: l.v
    });
    m.isNaN(l.h) ? m.isUndefined(h.__state.h) && (h.__state.h = 0) : h.__state.h = l.h
  }
  var g = function () {
    this.__state = f.apply(this, arguments);
    if (!1 === this.__state)
      throw "Failed to interpret color arguments";
    this.__state.a = this.__state.a || 1
  };
  g.COMPONENTS = "r g b h s v hex a".split(" ");
  m.extend(g.prototype, {
    toString: function () {
      return e(this)
    },
    toOriginal: function () {
      return this.__state.conversion.write(this)
    }
  });
  a(g.prototype, "r", 2);
  a(g.prototype, "g", 1);
  a(g.prototype, "b", 0);
  c(g.prototype, "h");
  c(g.prototype, "s");
  c(g.prototype, "v");
  Object.defineProperty(g.prototype, "a", {
    get: function () {
      return this.__state.a
    },
    set: function (h) {
      this.__state.a = h
    }
  });
  Object.defineProperty(g.prototype, "hex", {
    get: function () {
      this.__state.hex = d.rgb_to_hex(this.r, this.g, this.b);
      return this.__state.hex
    },
    set: function (h) {
      this.__state.space = "HEX";
      this.__state.hex = h
    }
  });
  return g
}(dat.color.interpret, dat.color.math = function () {
  var f;
  return {
    hsv_to_rgb: function (d, e, m) {
      var a = d / 60 - Math.floor(d / 60)
        , c = m * (1 - e)
        , b = m * (1 - a * e);
      e = m * (1 - (1 - a) * e);
      d = [[m, e, c], [b, m, c], [c, m, e], [c, b, m], [e, c, m], [m, c, b]][Math.floor(d / 60) % 6];
      return {
        r: 255 * d[0],
        g: 255 * d[1],
        b: 255 * d[2]
      }
    },
    rgb_to_hsv: function (d, e, m) {
      var a = Math.max(d, e, m)
        , c = a - Math.min(d, e, m);
      if (0 == a)
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      d = (d == a ? (e - m) / c : e == a ? 2 + (m - d) / c : 4 + (d - e) / c) / 6;
      0 > d && (d += 1);
      return {
        h: 360 * d,
        s: c / a,
        v: a / 255
      }
    },
    rgb_to_hex: function (d, e, m) {
      d = this.hex_with_component(0, 2, d);
      d = this.hex_with_component(d, 1, e);
      return d = this.hex_with_component(d, 0, m)
    },
    component_from_hex: function (d, e) {
      return d >> 8 * e & 255
    },
    hex_with_component: function (d, e, m) {
      return m << (f = 8 * e) | d & ~(255 << f)
    }
  }
}(), dat.color.toString, dat.utils.common), dat.color.interpret, dat.utils.common), dat.utils.requestAnimationFrame = function () {
  return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (f, d) {
    window.setTimeout(f, 1E3 / 60)
  }
}(), dat.dom.CenteredDiv = function (f, d) {
  var e = function () {
    this.backgroundElement = document.createElement("div");
    d.extend(this.backgroundElement.style, {
      backgroundColor: "rgba(0,0,0,0.8)",
      top: 0,
      left: 0,
      display: "none",
      zIndex: "1000",
      opacity: 0,
      WebkitTransition: "opacity 0.2s linear"
    });
    f.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = "fixed";
    this.domElement = document.createElement("div");
    d.extend(this.domElement.style, {
      position: "fixed",
      display: "none",
      zIndex: "1001",
      opacity: 0,
      WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear"
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var m = this;
    f.bind(this.backgroundElement, "click", function () {
      m.hide()
    })
  };
  e.prototype.show = function () {
    var m = this;
    this.backgroundElement.style.display = "block";
    this.domElement.style.display = "block";
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = "scale(1.1)";
    this.layout();
    d.defer(function () {
      m.backgroundElement.style.opacity = 1;
      m.domElement.style.opacity = 1;
      m.domElement.style.webkitTransform = "scale(1)"
    })
  }
    ;
  e.prototype.hide = function () {
    var m = this
      , a = function () {
        m.domElement.style.display = "none";
        m.backgroundElement.style.display = "none";
        f.unbind(m.domElement, "webkitTransitionEnd", a);
        f.unbind(m.domElement, "transitionend", a);
        f.unbind(m.domElement, "oTransitionEnd", a)
      };
    f.bind(this.domElement, "webkitTransitionEnd", a);
    f.bind(this.domElement, "transitionend", a);
    f.bind(this.domElement, "oTransitionEnd", a);
    this.backgroundElement.style.opacity = 0;
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = "scale(1.1)"
  }
    ;
  e.prototype.layout = function () {
    this.domElement.style.left = window.innerWidth / 2 - f.getWidth(this.domElement) / 2 + "px";
    this.domElement.style.top = window.innerHeight / 2 - f.getHeight(this.domElement) / 2 + "px"
  }
    ;
  return e
}(dat.dom.dom, dat.utils.common), dat.dom.dom, dat.utils.common);
function CWinPanel (f) {
  var d, e, m, a, c, b, k, g, h, l, n;
  this._init = function (p) {
    g = new createjs.Container;
    g.alpha = 0;
    g.visible = !1;
    var q = new createjs.Shape;
    q.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    q.alpha = .5;
    g.addChild(q);
    d = createBitmap(p);
    d.x = CANVAS_WIDTH_HALF;
    d.y = CANVAS_HEIGHT_HALF;
    d.regX = .5 * p.width;
    d.regY = .5 * p.height;
    g.addChild(d);
    e = new CTLText(g, CANVAS_WIDTH / 2 - p.width / 2, CANVAS_HEIGHT_HALF - 180, p.width, 90, 80, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1, 50, 0, TEXT_GAMEOVER, !0, !0, !1, !1);
    e.setOutline(6);
    m = new CTLText(g, CANVAS_WIDTH / 2 - p.width / 2, CANVAS_HEIGHT_HALF - 180, p.width, 90, 80, "center", TEXT_COLOR, FONT_GAME, 1.1, 50, 0, TEXT_GAMEOVER, !0, !0, !1, !1);
    a = new CTLText(g, CANVAS_WIDTH / 2 - p.width / 2, CANVAS_HEIGHT_HALF - 40, p.width, 70, 60, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1, 50, 0, "", !0, !0, !1, !1);
    a.setOutline(5);
    c = new CTLText(g, CANVAS_WIDTH / 2 - p.width / 2, CANVAS_HEIGHT_HALF - 40, p.width, 70, 60, "center", TEXT_COLOR, FONT_GAME, 1.1, 50, 0, "", !0, !0, !1, !1);
    b = new CTLText(g, CANVAS_WIDTH / 2 - p.width / 2 + 120, CANVAS_HEIGHT_HALF + 40, p.width - 240, 70, 60, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1, 0, 0, "", !0, !0, !1, !1);
    b.setOutline(5);
    k = new CTLText(g, CANVAS_WIDTH / 2 - p.width / 2 + 120, CANVAS_HEIGHT_HALF + 40, p.width - 240, 70, 60, "center", TEXT_COLOR, FONT_GAME, 1.1, 0, 0, "", !0, !0, !1, !1);
    p = s_oSpriteLibrary.getSprite("but_restart");
    l = new CGfxButton(.5 * CANVAS_WIDTH + 250, .5 * CANVAS_HEIGHT + 120, p, g);
    l.pulseAnimation();
    l.addEventListener(ON_MOUSE_DOWN, this._onRestart, this);
    p = s_oSpriteLibrary.getSprite("but_home");
    h = new CGfxButton(.5 * CANVAS_WIDTH - 250, .5 * CANVAS_HEIGHT + 120, p, g);
    h.addEventListener(ON_MOUSE_DOWN, this._onExit, this);
    n = new createjs.Container;
    g.addChild(n);
    g.on("click", function () { });
    s_oStage.addChild(g)
  }
    ;
  this.unload = function () {
    g.removeAllEventListeners();
    s_oStage.removeChild(g);
    h && (h.unload(),
      h = null);
    l && (l.unload(),
      l = null)
  };
 let playerPoint;
  this.show = function (p) {
    playerPoint=p;
    e.refreshText(TEXT_GAMEOVER);
    m.refreshText(TEXT_GAMEOVER);
    a.refreshText(TEXT_SCORE + ": " + p);
    c.refreshText(TEXT_SCORE + ": " + p);
    
    b.refreshText(TEXT_BEST_SCORE + ": " + s_iBestScore);
    k.refreshText(TEXT_BEST_SCORE + ": " + s_iBestScore);
    g.visible = !0;
    createjs.Tween.get(g).wait(MS_WAIT_SHOW_GAME_OVER_PANEL).to({
      alpha: 1
    }, 1250, createjs.Ease.cubicOut).call(function () {
      s_iAdsLevel === NUM_LEVEL_FOR_ADS ? ($(s_oMain).trigger("show_interlevel_ad"),
        s_iAdsLevel = 1) : s_iAdsLevel++
    });
    $(s_oMain).trigger("save_score", p);
    $(s_oMain).trigger("share_event", p);

  }
    ;
  this._onContinue = function () {
    var p = this;
    createjs.Tween.get(g, {
      override: !0
    }).to({
      alpha: 0
    }, 750, createjs.Ease.cubicOut).call(function () {
      p.unload()
    });
    _oButContinue.block(!0);
    h.block(!0);
    s_oGame.onContinue();

  }
    ;
  this._onRestart = function () {
    // console.log("score is : ", playerPoint)
    // console.log("best score is : ", s_iBestScore)
    // window.location.href = `https://www.google.com/point=${playerPoint}`;
    l.block(!0);
    this.unload();
    s_oGame.restartGame()
  }
    ;
  this._onExit = function () {
    // window.location.href = `https://www.google.com/point=${playerPoint}`;
    this.unload();
    s_oGame.onExit()
  }
    ;
  this._init(f);
  return this
}
function CAreYouSurePanel (f) {
  var d, e, m, a, c;
  this._init = function () {
    a = new createjs.Container;
    a.alpha = 0;
    b.addChild(a);
    c = new createjs.Shape;
    c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    c.alpha = .5;
    c.on("click", function () { });
    a.addChild(c);
    var k = s_oSpriteLibrary.getSprite("msg_box");
    d = createBitmap(k);
    d.x = CANVAS_WIDTH_HALF;
    d.y = CANVAS_HEIGHT_HALF;
    d.regX = .5 * k.width;
    d.regY = .5 * k.height;
    a.addChild(d);
    new CTLText(a, CANVAS_WIDTH / 2 - k.width / 2, CANVAS_HEIGHT_HALF - 150, k.width, 200, 80, "center", "#ffffff", FONT_GAME, 1, 100, 30, TEXT_ARE_SURE, !0, !0, !0, !1);
    e = new CGfxButton(CANVAS_WIDTH / 2 + 250, .5 * CANVAS_HEIGHT + 120, s_oSpriteLibrary.getSprite("but_yes"), a);
    e.addEventListener(ON_MOUSE_UP, this._onButYes, this);
    m = new CGfxButton(CANVAS_WIDTH / 2 - 250, .5 * CANVAS_HEIGHT + 120, s_oSpriteLibrary.getSprite("but_no"), a);
    m.addEventListener(ON_MOUSE_UP, this._onButNo, this)
  }
    ;
  this.show = function () {
    createjs.Tween.get(a).to({
      alpha: 1
    }, 150, createjs.Ease.quartOut).call(function () {
      s_oGame.pause(!0)
    })
  }
    ;
  this.unload = function () {
    createjs.Tween.get(a).to({
      alpha: 0
    }, 150, createjs.Ease.quartOut).call(function () {
      b.removeChild(a, c)
    })
  }
    ;
  this._onButYes = function () {
    createjs.Ticker.paused = !1;
    this.unload();
    s_oGame.onExit();
    c.removeAllEventListeners()
  }
    ;
  this._onButNo = function () {
    s_oGame.pause(!1);
    this.unload();
    a.visible = !1;
    c.removeAllEventListeners()
  }
    ;
  var b = f;
  this._init()
}
function CCreditsPanel () {
  var f, d, e, m, a, c, b, k;
  this._init = function () {
    k = new createjs.Container;
    s_oStage.addChild(k);
    e = new createjs.Shape;
    d = e.on("click", function () { });
    e.alpha = 0;
    e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    k.addChild(e);
    m = new createjs.Container;
    m.visible = !1;
    k.addChild(m);
    var g = s_oSpriteLibrary.getSprite("msg_box");
    b = createBitmap(g);
    b.regX = g.width / 2;
    b.regY = g.height / 2;
    m.addChild(b);
    f = b.on("click", this._onLogoButRelease);
    m.x = CANVAS_WIDTH / 2;
    m.y = CANVAS_HEIGHT / 2;
    g = new createjs.Text(TEXT_DEVELOPED, " 40px " + FONT_GAME, "#fff");
    g.y = -70;
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    m.addChild(g);
    g = new createjs.Text("www.codethislab.com", " 36px " + FONT_GAME, "#fff");
    g.y = 86;
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    g.lineWidth = 300;
    m.addChild(g);
    g = s_oSpriteLibrary.getSprite("logo_ctl");
    c = createBitmap(g);
    c.regX = g.width / 2;
    c.regY = g.height / 2;
    m.addChild(c);
    g = s_oSpriteLibrary.getSprite("but_exit");
    a = new CGfxButton(270, -140, g, m);
    a.addEventListener(ON_MOUSE_UP, this.unload, this);
    e.alpha = 0;
    createjs.Tween.get(e).to({
      alpha: .7
    }, 500).call(function () {
      m.alpha = 0;
      m.visible = !0;
      createjs.Tween.get(m).to({
        alpha: 1
      }, 300)
    })
  }
    ;
  this.unload = function () {
    createjs.Tween.get(k).to({
      alpha: 0
    }, 500).call(function () {
      s_oStage.removeChild(k);
      a.unload()
    });
    e.off("click", d);
    b.off("click", f)
  }
    ;
  this._onLogoButRelease = function () {
    window.open("http://www.codethislab.com/index.php?&l=en")
  }
    ;
  this._init()
}
function CPause () {
  var f, d;
  this._init = function () {
    f = new createjs.Container;
    f.alpha = 0;
    d = new createjs.Shape;
    d.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    d.alpha = .5;
    d.on("click", function () { });
    f.addChild(d);
    var e = new createjs.Text(TEXT_PAUSE, "70px " + FONT_GAME, TEXT_COLOR);
    e.x = .5 * CANVAS_WIDTH;
    e.y = .5 * CANVAS_HEIGHT - 100;
    e.textAlign = "center";
    f.addChild(e);
    e = new createjs.Text(TEXT_PAUSE, "70px " + FONT_GAME, TEXT_COLOR_STROKE);
    e.x = .5 * CANVAS_WIDTH;
    e.y = .5 * CANVAS_HEIGHT - 100;
    e.outline = OUTLINE_WIDTH;
    e.textAlign = "center";
    f.addChild(e);
    e = s_oSpriteLibrary.getSprite("but_continue");
    (new CGfxButton(.5 * CANVAS_WIDTH, .5 * CANVAS_HEIGHT + 70, e, f)).addEventListener(ON_MOUSE_UP, this._onLeavePause, this);
    s_oStage.addChild(f);
    var m = this;
    createjs.Tween.get(f).to({
      alpha: 1
    }, 150, createjs.Ease.quartOut).call(function () {
      m.onPause(!0)
    })
  }
    ;
  this.onPause = function (e) {
    s_oGame.pause(e)
  }
    ;
  this.unload = function () {
    d.off("click", function () { });
    s_oStage.removeChild(f)
  }
    ;
  this._onLeavePause = function () {
    playSound("click", 1, !1);
    createjs.Ticker.paused = !1;
    createjs.Tween.removeTweens(f);
    var e = this;
    createjs.Tween.get(f).to({
      alpha: 0
    }, 150, createjs.Ease.quartIn).call(function () {
      e.onPause(!1);
      s_oInterface.unloadPause()
    })
  }
    ;
  this._init();
  return this
}
function CGoalKeeper (f, d, e) {
  var m, a, c, b, k, g, h = 0, l = 0, n = IDLE;
  this._init = function (p, q, t) {
    k = t;
    m = p;
    a = q;
    c = new createjs.Container;
    c.x = m;
    c.y = a;
    k.addChild(c);
    c.tickChildren = !1;
    g = [];
    b = [];
    for (t = q = p = 0; t < NUM_SPRITE_GOALKEEPER.length; t++) {
      b[t] = new createjs.Container;
      b[t].x = OFFSET_CONTAINER_GOALKEEPER[t].x;
      b[t].y = OFFSET_CONTAINER_GOALKEEPER[t].y;
      g.push(this.loadAnim(SPRITE_NAME_GOALKEEPER[t], NUM_SPRITE_GOALKEEPER[t], b[t]));
      c.addChild(b[t]);
      var r = s_oSpriteLibrary.getSprite(SPRITE_NAME_GOALKEEPER[t] + 0);
      r.width > p && (p = r.width);
      r.height > q && (q = r.height)
    }
    c.cache(-p, -q, 2 * p, 2 * q);
    g[IDLE][0].visible = !0
  }
    ;
  this.getAnimType = function () {
    return n
  }
    ;
  this.getAnimArray = function () {
    return g[n]
  }
    ;
  this.loadAnim = function (p, q, t) {
    for (var r = [], v = 0; v < q; v++)
      r.push(createBitmap(s_oSpriteLibrary.getSprite(p + v))),
        r[v].visible = !1,
        t.addChild(r[v]);
    return r
  }
    ;
  this.getX = function () {
    return c.x
  }
    ;
  this.getY = function () {
    return c.y
  }
    ;
  this.disableAllAnim = function () {
    for (var p = 0; p < b.length; p++)
      b[p].visible = !1
  }
    ;
  this.setPosition = function (p, q) {
    c.x = p;
    c.y = q
  }
    ;
  this.setVisible = function (p) {
    c.visible = p
  }
    ;
  this.fadeAnimation = function (p) {
    createjs.Tween.get(c, {
      override: !0
    }).to({
      alpha: p
    }, 500)
  }
    ;
  this.setAlpha = function (p) {
    c.alpha = p
  }
    ;
  this.getObject = function () {
    return c
  }
    ;
  this.getFrame = function () {
    return l
  }
    ;
  this.viewFrame = function (p, q) {
    p[q].visible = !0
  }
    ;
  this.hideFrame = function (p, q) {
    p[q].visible = !1
  }
    ;
  this.getDepthPos = function () {
    return GOAL_KEEPER_DEPTH_Y
  }
    ;
  this.animGoalKeeper = function (p, q) {
    h += s_iTimeElaps;
    if (h > BUFFER_ANIM_PLAYER) {
      this.hideFrame(p, l);
      if (l + 1 < q)
        this.viewFrame(p, l + 1),
          l++;
      else
        return h = l = 0,
          this.viewFrame(p, l),
          !1;
      h = 0;
      c.updateCache()
    }
    return !0
  }
    ;
  this.resetAnimation = function (p) {
    this.resetAnimFrame(g[p], NUM_SPRITE_GOALKEEPER[p])
  }
    ;
  this.resetAnimFrame = function (p, q) {
    for (var t = 1; t < q; t++)
      p[t].visible = !1;
    p[0].visible = !0
  }
    ;
  this.setVisibleContainer = function (p, q) {
    b[p].visible = q
  }
    ;
  this.runAnim = function (p) {
    this.disableAllAnim();
    this.resetAnimation(p);
    this.setVisibleContainer(p, !0);
    n = p;
    l = 0
  }
    ;
  this.update = function () {
    return this.animGoalKeeper(g[n], NUM_SPRITE_GOALKEEPER[n])
  }
    ;
  this._init(f, d, e);
  return this
}
function CStartBall (f, d, e) {
  var m;
  this._init = function () {
    var a = s_oSpriteLibrary.getSprite("start_ball");
    m = createBitmap(a);
    m.regX = .5 * a.width;
    m.regY = .5 * a.height;
    this.setPosition(f, d);
    e.addChild(m)
  }
    ;
  this.setPosition = function (a, c) {
    m.x = a;
    m.y = c
  }
    ;
  this.fadeAnim = function (a, c, b) {
    createjs.Tween.get(m, {
      override: !0
    }).wait(b).to({
      alpha: a
    }, c)
  }
    ;
  this.setAlpha = function (a) {
    m.alpha = a
  }
    ;
  this.setVisible = function (a) {
    m.visible = a
  }
    ;
  this._init();
  return this
}
function CVector2 (f, d) {
  var e, m;
  this._init = function (a, c) {
    e = a;
    m = c
  }
    ;
  this.add = function (a, c) {
    e += a;
    m += c
  }
    ;
  this.addV = function (a) {
    e += a.getX();
    m += a.getY()
  }
    ;
  this.scalarDivision = function (a) {
    e /= a;
    m /= a
  }
    ;
  this.subtract = function (a) {
    e -= a.getX();
    m -= a.getY()
  }
    ;
  this.scalarProduct = function (a) {
    e *= a;
    m *= a
  }
    ;
  this.invert = function () {
    e *= -1;
    m *= -1
  }
    ;
  this.dotProduct = function (a) {
    return e * a.getX() + m * a.getY()
  }
    ;
  this.set = function (a, c) {
    e = a;
    m = c
  }
    ;
  this.setV = function (a) {
    e = a.getX();
    m = a.getY()
  }
    ;
  this.length = function () {
    return Math.sqrt(e * e + m * m)
  }
    ;
  this.length2 = function () {
    return e * e + m * m
  }
    ;
  this.normalize = function () {
    var a = this.length();
    0 < a && (e /= a,
      m /= a)
  }
    ;
  this.angleBetweenVectors = function (a) {
    a = Math.acos(this.dotProduct(a) / (this.length() * a.length()));
    return !0 === isNaN(a) ? 0 : a
  }
    ;
  this.getNormalize = function (a) {
    this.length();
    a.set(e, m);
    a.normalize()
  }
    ;
  this.rot90CCW = function () {
    var a = e;
    e = -m;
    m = a
  }
    ;
  this.rot90CW = function () {
    var a = e;
    e = m;
    m = -a
  }
    ;
  this.getRotCCW = function (a) {
    a.set(e, m);
    a.rot90CCW()
  }
    ;
  this.getRotCW = function (a) {
    a.set(e, m);
    a.rot90CW()
  }
    ;
  this.ceil = function () {
    e = Math.ceil(e);
    m = Math.ceil(m)
  }
    ;
  this.round = function () {
    e = Math.round(e);
    m = Math.round(m)
  }
    ;
  this.toString = function () {
    return "Vector2: " + e + ", " + m
  }
    ;
  this.print = function () {
    trace("Vector2: " + e + ", " + m)
  }
    ;
  this.getX = function () {
    return e
  }
    ;
  this.getY = function () {
    return m
  }
    ;
  this.rotate = function (a) {
    var c = e
      , b = m;
    e = c * Math.cos(a) - b * Math.sin(a);
    m = c * Math.sin(a) + b * Math.cos(a)
  }
    ;
  this._init(f, d)
}
function CPlayer (f, d, e) {
  var m, a = [], c, b = 0, k = 0;
  this._init = function (g, h) {
    m = {
      x: g,
      y: h
    };
    c = new createjs.Container;
    c.x = m.x;
    c.y = m.y;
    e.addChild(c);
    for (var l = 0; l < NUM_SPRITE_PLAYER; l++)
      a.push(createBitmap(s_oSpriteLibrary.getSprite("player_" + l))),
        a[l].visible = !1,
        c.addChild(a[l]);
    l = s_oSpriteLibrary.getSprite("player_0");
    c.cache(0, 0, l.width, l.height);
    a[0].visible = !0
  }
    ;
  this.setPosition = function (g, h) {
    c.x = g;
    c.y = h
  }
    ;
  this.getX = function () {
    return c.x
  }
    ;
  this.getY = function () {
    return c.y
  }
    ;
  this.getStartPos = function () {
    return m
  }
    ;
  this.setVisible = function (g) {
    c.visible = g
  }
    ;
  this.animFade = function (g) {
    var h = this;
    createjs.Tween.get(c).to({
      alpha: g
    }, 250).call(function () {
      0 === g && (c.visible = !1,
        h.hideCharacter(NUM_SPRITE_PLAYER - 1),
        h.viewCharacter(b))
    })
  }
    ;
  this.viewCharacter = function (g) {
    a[g].visible = !0
  }
    ;
  this.hideCharacter = function (g) {
    a[g].visible = !1
  }
    ;
  this.getFrame = function () {
    return b
  }
    ;
  this.animPlayer = function () {
    k += s_iTimeElaps;
    if (k > BUFFER_ANIM_PLAYER) {
      this.hideCharacter(b);
      if (b + 1 < NUM_SPRITE_PLAYER)
        this.viewCharacter(b + 1),
          b++;
      else
        return this.viewCharacter(b),
          k = b = 0,
          !1;
      c.updateCache();
      k = 0
    }
    return !0
  }
    ;
  this._init(f, d);
  return this
}
function CScoreBoard (f) {
  var d, e, m, a, c, b, k, g, h, l, n;
  this._init = function () {
    d = {
      x: CANVAS_WIDTH_HALF - 660,
      y: CANVAS_HEIGHT - 64
    };
    l = new createjs.Container;
    l.x = d.x;
    l.y = d.y;
    f.addChild(l);
    m = new createjs.Text(TEXT_SCORE, "50px " + FONT_GAME, TEXT_COLOR);
    m.textAlign = "left";
    l.addChild(m);
    a = new createjs.Text(TEXT_SCORE, "50px " + FONT_GAME, TEXT_COLOR_STROKE);
    a.textAlign = "left";
    a.outline = OUTLINE_WIDTH;
    l.addChild(a);
    c = new createjs.Text(999999, "50px " + FONT_GAME, TEXT_COLOR);
    c.textAlign = "left";
    c.x = 150;
    l.addChild(c);
    b = new createjs.Text(999999, "50px " + FONT_GAME, TEXT_COLOR_STROKE);
    b.textAlign = "left";
    b.x = c.x;
    b.outline = OUTLINE_WIDTH;
    l.addChild(b);
    n = new createjs.Container;
    n.x = 50;
    k = new createjs.Text("+5555 " + TEXT_MULTIPLIER + 1, "36px " + FONT_GAME, TEXT_COLOR);
    k.textAlign = "left";
    n.addChild(k);
    g = new createjs.Text("+5555 " + TEXT_MULTIPLIER + 1, "36px " + FONT_GAME, TEXT_COLOR_STROKE);
    g.textAlign = "left";
    g.outline = OUTLINE_WIDTH;
    n.addChild(g);
    n.y = e = -g.getBounds().height;
    n.visible = !1;
    l.addChild(n);
    h = new CRollingScore
  }
    ;
  this.getStartPosScore = function () {
    return d
  }
    ;
  this.setPosScore = function (p, q) {
    l.x = p;
    l.y = q
  }
    ;
  this.refreshTextScore = function (p) {
    h.rolling(c, b, p)
  }
    ;
  this.effectAddScore = function (p, q) {
    n.visible = !0;
    k.text = "+" + p + " " + TEXT_MULTIPLIER + q;
    g.text = k.text;
    createjs.Tween.get(n).to({
      y: e - 50,
      alpha: 0
    }, MS_EFFECT_ADD, createjs.Ease.cubicOut).call(function () {
      n.visible = !1;
      n.alpha = 1;
      n.y = e
    })
  }
    ;
  this._init();
  return this
}
MS_ROLLING_SCORE = 750;
function CRollingScore () {
  var f = null
    , d = null;
  this.rolling = function (e, m, a) {
    f = createjs.Tween.get(e, {
      override: !0
    }).to({
      text: a
    }, MS_ROLLING_SCORE, createjs.Ease.cubicOut).addEventListener("change", function () {
      e.text = Math.floor(e.text)
    }).call(function () {
      createjs.Tween.removeTweens(f)
    });
    null !== m && (d = createjs.Tween.get(m, {
      override: !0
    }).to({
      text: a
    }, MS_ROLLING_SCORE, createjs.Ease.cubicOut).addEventListener("change", function () {
      m.text = Math.floor(m.text)
    }).call(function () {
      createjs.Tween.removeTweens(d)
    }))
  }
    ;
  return this
}
function CLaunchBoard (f) {
  var d, e, m, a, c, b;
  this._init = function () {
    d = {
      x: CANVAS_WIDTH_HALF + 660,
      y: CANVAS_HEIGHT - 60
    };
    c = new createjs.Container;
    c.x = d.x;
    c.y = d.y;
    f.addChild(c);
    e = new createjs.Text("99" + TEXT_OF + NUM_OF_PENALTY, "50px " + FONT_GAME, TEXT_COLOR);
    e.textAlign = "right";
    e.y = -4;
    c.addChild(e);
    c.y = d.y;
    f.addChild(c);
    m = new createjs.Text("99" + TEXT_OF + NUM_OF_PENALTY, "50px " + FONT_GAME, TEXT_COLOR_STROKE);
    m.textAlign = "right";
    m.y = e.y;
    m.outline = OUTLINE_WIDTH;
    c.addChild(m);
    var k = s_oSpriteLibrary.getSprite("shot_left");
    a = createBitmap(k);
    a.x = 1.4 * -e.getBounds().width;
    a.regX = .5 * k.width;
    a.regY = 10;
    c.addChild(a);
    b = c.getBounds();
    this.updateCache()
  }
    ;
  this.updateCache = function () {
    c.cache(-b.width, -b.height, 2 * b.width, 2 * b.height)
  }
    ;
  this.getStartPos = function () {
    return d
  }
    ;
  this.setPos = function (k, g) {
    c.x = k;
    c.y = g
  }
    ;
  this.refreshTextLaunch = function (k, g) {
    e.text = k + TEXT_OF + g;
    m.text = e.text;
    a.x = 1.4 * -e.getBounds().width;
    this.updateCache()
  }
    ;
  this._init();
  return this
}
function CHandSwipeAnim (f, d, e, m) {
  var a, c, b = !1;
  this._init = function (k) {
    c = new createjs.Container;
    a = createBitmap(k);
    a.x = f.x;
    a.y = f.y;
    a.regX = .5 * k.width;
    a.regY = .5 * k.height;
    a.alpha = 0;
    m.addChild(c);
    c.addChild(a)
  }
    ;
  this.animAllSwipe = function () {
    b = !0;
    var k = this;
    createjs.Tween.get(a).to({
      alpha: 1
    }, .1 * MS_TIME_SWIPE_END).wait(.3 * MS_TIME_SWIPE_END).to({
      alpha: 0
    }, .5 * MS_TIME_SWIPE_END, createjs.Ease.quartOut);
    createjs.Tween.get(a).to({
      x: d[0].x,
      y: d[0].y
    }, MS_TIME_SWIPE_END, createjs.Ease.quartOut).call(function () {
      a.x = f.x;
      a.y = f.y;
      createjs.Tween.get(a).to({
        alpha: 1
      }, .1 * MS_TIME_SWIPE_END).wait(.3 * MS_TIME_SWIPE_END).to({
        alpha: 0
      }, .5 * MS_TIME_SWIPE_END, createjs.Ease.quartOut);
      createjs.Tween.get(a).to({
        x: d[1].x,
        y: d[1].y
      }, MS_TIME_SWIPE_END, createjs.Ease.quartOut).call(function () {
        a.x = f.x;
        a.y = f.y;
        createjs.Tween.get(a).to({
          alpha: 1
        }, .1 * MS_TIME_SWIPE_END).wait(.3 * MS_TIME_SWIPE_END).to({
          alpha: 0
        }, .5 * MS_TIME_SWIPE_END, createjs.Ease.quartOut);
        createjs.Tween.get(a).to({
          x: d[2].x,
          y: d[2].y
        }, MS_TIME_SWIPE_END, createjs.Ease.quartOut).call(function () {
          a.x = f.x;
          a.y = f.y;
          k.animAllSwipe()
        })
      })
    })
  }
    ;
  this.fadeAnim = function (k) {
    createjs.Tween.get(c, {
      override: !0
    }).to({
      alpha: k
    }, 250)
  }
    ;
  this.isAnimate = function () {
    return b
  }
    ;
  this.setVisible = function (k) {
    a.visible = k
  }
    ;
  this.removeTweens = function () {
    createjs.Tween.removeTweens(a);
    b = !1
  }
    ;
  this._init(e);
  return this
}
function CGoal (f, d, e, m) {
  var a;
  this._init = function (b, k, g) {
    a = createBitmap(g);
    this.setPosition(b, k);
    a.cache(0, 0, g.width, g.height);
    c.addChild(a)
  }
    ;
  this.unload = function () {
    c.removeChild(a)
  }
    ;
  this.setPosition = function (b, k) {
    a.x = b;
    a.y = k
  }
    ;
  this.getDepthPos = function () {
    return GOAL_SPRITE_SWAP_Y
  }
    ;
  this.getObject = function () {
    return a
  }
    ;
  var c = m;
  this._init(f, d, e);
  return this
}
CTLText.prototype = {
  constructor: CTLText,
  __autofit: function () {
    if (this._bFitText) {
      for (var f = this._iFontSize; (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV || this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) && !(f--,
        this._oText.font = f + "px " + this._szFont,
        this._oText.lineHeight = Math.round(f * this._fLineHeightFactor),
        this.__updateY(),
        this.__verticalAlign(),
        8 > f);)
        ;
      this._iFontSize = f
    }
  },
  __verticalAlign: function () {
    if (this._bVerticalAlign) {
      var f = this._oText.getBounds().height;
      this._oText.y -= (f - this._iHeight) / 2 + this._iPaddingV
    }
  },
  __updateY: function () {
    this._oText.y = this._y + this._iPaddingV;
    switch (this._oText.textBaseline) {
      case "middle":
        this._oText.y += this._oText.lineHeight / 2 + (this._iFontSize * this._fLineHeightFactor - this._iFontSize)
    }
  },
  __createText: function (f) {
    this._bDebug && (this._oDebugShape = new createjs.Shape,
      this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(this._x, this._y, this._iWidth, this._iHeight),
      this._oContainer.addChild(this._oDebugShape));
    this._oText = new createjs.Text(f, this._iFontSize + "px " + this._szFont, this._szColor);
    this._oText.textBaseline = "middle";
    this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
    this._oText.textAlign = this._szAlign;
    this._oText.lineWidth = this._bMultiline ? this._iWidth - 2 * this._iPaddingH : null;
    switch (this._szAlign) {
      case "center":
        this._oText.x = this._x + this._iWidth / 2;
        break;
      case "left":
        this._oText.x = this._x + this._iPaddingH;
        break;
      case "right":
        this._oText.x = this._x + this._iWidth - this._iPaddingH
    }
    this._oContainer.addChild(this._oText);
    this.refreshText(f)
  },
  setVerticalAlign: function (f) {
    this._bVerticalAlign = f
  },
  setOutline: function (f) {
    null !== this._oText && (this._oText.outline = f)
  },
  setShadow: function (f, d, e, m) {
    null !== this._oText && (this._oText.shadow = new createjs.Shadow(f, d, e, m))
  },
  setColor: function (f) {
    this._oText.color = f
  },
  setAlpha: function (f) {
    this._oText.alpha = f
  },
  removeTweens: function () {
    createjs.Tween.removeTweens(this._oText)
  },
  getText: function () {
    return this._oText
  },
  getY: function () {
    return this._y
  },
  getFontSize: function () {
    return this._iFontSize
  },
  refreshText: function (f) {
    "" === f && (f = " ");
    null === this._oText && this.__createText(f);
    this._oText.text = f;
    this._oText.font = this._iFontSize + "px " + this._szFont;
    this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
    this.__autofit();
    this.__updateY();
    this.__verticalAlign()
  }
};
function CTLText (f, d, e, m, a, c, b, k, g, h, l, n, p, q, t, r, v) {
  this._oContainer = f;
  this._x = d;
  this._y = e;
  this._iWidth = m;
  this._iHeight = a;
  this._bMultiline = r;
  this._iFontSize = c;
  this._szAlign = b;
  this._szColor = k;
  this._szFont = g;
  this._iPaddingH = l;
  this._iPaddingV = n;
  this._bVerticalAlign = t;
  this._bFitText = q;
  this._bDebug = v;
  this._oDebugShape = null;
  this._fLineHeightFactor = h;
  this._oText = null;
  p && this.__createText(p)
}
function extractHostname (f) {
  f = -1 < f.indexOf("://") ? f.split("/")[2] : f.split("/")[0];
  f = f.split(":")[0];
  return f = f.split("?")[0]
}
function extractRootDomain (f) {
  f = extractHostname(f);
  var d = f.split(".")
    , e = d.length;
  2 < e && (f = d[e - 2] + "." + d[e - 1]);
  return f
}
var getClosestTop = function () {
  var f = window
    , d = !1;
  try {
    for (; f.parent.document !== f.document;)
      if (f.parent.document)
        f = f.parent;
      else {
        d = !0;
        break
      }
  } catch (e) {
    d = !0
  }
  return {
    topFrame: f,
    err: d
  }
}
  , getBestPageUrl = function (f) {
    var d = f.topFrame
      , e = "";
    if (f.err)
      try {
        try {
          e = window.top.location.href
        } catch (a) {
          var m = window.location.ancestorOrigins;
          e = m[m.length - 1]
        }
      } catch (a) {
        e = d.document.referrer
      }
    else
      e = d.location.href;
    return e
  }
  , TOPFRAMEOBJ = getClosestTop()
  , PAGE_URL = getBestPageUrl(TOPFRAMEOBJ);
