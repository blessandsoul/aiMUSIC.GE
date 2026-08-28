import assert from 'node:assert/strict';
import test from 'node:test';

import { createDemoLoop } from './demo-loop.mjs';


function createObserverHarness() {
  const instances = [];

  class Observer {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = [];
      this.disconnectCalls = 0;
      instances.push(this);
    }

    observe(target) {
      this.observed.push(target);
    }

    disconnect() {
      this.disconnectCalls += 1;
    }

    emit(target, intersectionRatio, isIntersecting = intersectionRatio > 0) {
      this.callback([{ target, intersectionRatio, isIntersecting }]);
    }
  }

  return { Observer, instances };
}


function createDocumentHarness() {
  const listeners = new Map();
  const removed = [];

  return {
    hidden: false,
    listeners,
    removed,
    addEventListener(type, callback) {
      listeners.set(type, callback);
    },
    removeEventListener(type, callback) {
      removed.push([type, callback]);
      if (listeners.get(type) === callback) listeners.delete(type);
    },
    setHidden(hidden) {
      this.hidden = hidden;
      listeners.get('visibilitychange')?.();
    },
  };
}


function createTimerHarness() {
  let nextId = 1;
  const tasks = new Map();
  const scheduled = [];

  return {
    scheduled,
    schedule(callback, delay) {
      const id = nextId++;
      const task = { id, callback, delay, cancelled: false, fired: false };
      tasks.set(id, task);
      scheduled.push(task);
      return id;
    },
    cancel(id) {
      const task = tasks.get(id);
      if (task) task.cancelled = true;
    },
    fire(id, { retained = false } = {}) {
      const task = tasks.get(id);
      assert.ok(task, `unknown timer ${id}`);
      if (task.cancelled && !retained) return;
      task.fired = true;
      task.callback();
    },
    pending() {
      return [...tasks.values()].filter((task) => !task.cancelled && !task.fired);
    },
  };
}


function createHarness(overrides = {}) {
  const attributes = new Map();
  const target = {
    id: 'demo',
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    getAttribute(name) {
      return attributes.get(name) ?? null;
    },
  };
  const observer = createObserverHarness();
  const pageDocument = createDocumentHarness();
  const timers = createTimerHarness();
  const calls = [];

  const controller = createDemoLoop({
    target,
    cycleMs: 7000,
    play: () => calls.push('play'),
    showFinal: () => calls.push('showFinal'),
    reset: () => calls.push('reset'),
    stop: () => calls.push('stop'),
    Observer: observer.Observer,
    pageDocument,
    schedule: timers.schedule,
    cancelScheduled: timers.cancel,
    ...overrides,
  });

  return { target, observer, pageDocument, timers, calls, controller };
}


test('observes at 0.35 and repeats a 6-10 second pass after the 2000 ms hold', () => {
  const harness = createHarness();
  const observed = harness.observer.instances[0];

  assert.deepEqual(observed.options, { threshold: 0.35 });
  assert.deepEqual(observed.observed, [harness.target]);

  observed.emit(harness.target, 0.34, true);
  assert.deepEqual(harness.calls, []);
  assert.equal(harness.timers.scheduled.length, 0);

  observed.emit(harness.target, 0.35, true);
  assert.deepEqual(harness.calls, ['play']);
  assert.equal(harness.target.getAttribute('data-landing-demo'), 'true');
  assert.equal(harness.target.getAttribute('data-demo-state'), 'playing');
  assert.equal(harness.timers.pending().length, 1);
  assert.equal(harness.timers.pending()[0].delay, 7000);

  const firstFinal = harness.timers.pending()[0];
  harness.timers.fire(firstFinal.id);

  assert.deepEqual(harness.calls, ['play']);
  assert.equal(harness.target.getAttribute('data-demo-state'), 'final');
  assert.equal(harness.timers.pending().length, 1);
  assert.equal(harness.timers.pending()[0].delay, 2000);

  const firstRepeat = harness.timers.pending()[0];
  harness.timers.fire(firstRepeat.id);

  assert.deepEqual(harness.calls, ['play', 'stop', 'reset', 'play']);
  assert.equal(harness.target.getAttribute('data-demo-state'), 'playing');
  assert.equal(harness.timers.pending().length, 1);
  assert.equal(harness.timers.pending()[0].delay, 7000);
});


test('observes the compact sentinel while exposing state on its surrounding demo root', () => {
  const attributes = new Map();
  const contractRoot = {
    setAttribute(name, value) { attributes.set(name, value); },
  };
  const sentinel = {
    matches() { return false; },
    closest(selector) { return selector === '[data-demo-id]' ? contractRoot : null; },
  };
  const observer = createObserverHarness();
  const pageDocument = createDocumentHarness();
  const timers = createTimerHarness();

  createDemoLoop({
    target: sentinel,
    cycleMs: 7000,
    play() {},
    showFinal() {},
    reset() {},
    stop() {},
    Observer: observer.Observer,
    pageDocument,
    schedule: timers.schedule,
    cancelScheduled: timers.cancel,
  });

  assert.deepEqual(observer.instances[0].observed, [sentinel]);
  observer.instances[0].emit(sentinel, 0.35, true);
  assert.equal(attributes.get('data-landing-demo'), 'true');
  assert.equal(attributes.get('data-demo-state'), 'playing');
});


test('off-screen and hidden states stop, reset, and allow a clean visible re-entry', () => {
  const harness = createHarness();
  const observed = harness.observer.instances[0];

  observed.emit(harness.target, 0.8);
  const offScreenStaleTimer = harness.timers.pending()[0];
  observed.emit(harness.target, 0, false);

  assert.deepEqual(harness.calls, ['play', 'stop', 'reset']);
  assert.equal(harness.timers.pending().length, 0);
  harness.timers.fire(offScreenStaleTimer.id, { retained: true });
  assert.deepEqual(harness.calls, ['play', 'stop', 'reset']);

  observed.emit(harness.target, 0.8);
  assert.deepEqual(harness.calls, ['play', 'stop', 'reset', 'play']);
  const hiddenStaleTimer = harness.timers.pending()[0];

  harness.pageDocument.setHidden(true);
  assert.deepEqual(harness.calls, ['play', 'stop', 'reset', 'play', 'stop', 'reset']);
  assert.equal(harness.timers.pending().length, 0);
  harness.timers.fire(hiddenStaleTimer.id, { retained: true });
  assert.deepEqual(harness.calls, ['play', 'stop', 'reset', 'play', 'stop', 'reset']);

  harness.pageDocument.setHidden(false);
  assert.deepEqual(
    harness.calls,
    ['play', 'stop', 'reset', 'play', 'stop', 'reset', 'play'],
  );
  assert.equal(harness.timers.pending().length, 1);
});


test('replay, takeControl, retained callbacks, and cleanup preserve caller ownership', () => {
  const harness = createHarness();
  const observed = harness.observer.instances[0];

  observed.emit(harness.target, 0.7);
  const controlledStaleTimer = harness.timers.pending()[0];
  harness.controller.takeControl();

  assert.deepEqual(harness.calls, ['play', 'stop']);
  assert.equal(harness.target.getAttribute('data-demo-state'), 'manual');
  assert.equal(harness.timers.pending().length, 0);
  harness.timers.fire(controlledStaleTimer.id, { retained: true });
  assert.deepEqual(harness.calls, ['play', 'stop']);

  harness.pageDocument.setHidden(true);
  harness.pageDocument.setHidden(false);
  assert.deepEqual(harness.calls, ['play', 'stop', 'stop']);
  assert.equal(harness.timers.pending().length, 0);

  harness.controller.replay();
  assert.deepEqual(
    harness.calls,
    ['play', 'stop', 'stop', 'stop', 'reset', 'play'],
  );
  assert.equal(harness.timers.pending().length, 1);
  const cleanupStaleTimer = harness.timers.pending()[0];

  harness.controller.cleanup();
  harness.controller.cleanup();

  assert.equal(observed.disconnectCalls, 1);
  assert.equal(harness.pageDocument.listeners.has('visibilitychange'), false);
  assert.equal(harness.pageDocument.removed.length, 1);
  assert.equal(harness.calls.at(-1), 'stop');
  assert.equal(harness.target.getAttribute('data-demo-state'), 'paused');
  const callsAfterCleanup = [...harness.calls];

  harness.timers.fire(cleanupStaleTimer.id, { retained: true });
  observed.emit(harness.target, 0.9);
  assert.deepEqual(harness.calls, callsAfterCleanup);
});


test('controlled activity stops when hidden or off-screen and stays controlled until replay', () => {
  const harness = createHarness();
  const observed = harness.observer.instances[0];

  observed.emit(harness.target, 0.8);
  harness.controller.takeControl();
  assert.deepEqual(harness.calls, ['play', 'stop']);

  harness.pageDocument.setHidden(true);
  assert.deepEqual(harness.calls, ['play', 'stop', 'stop']);

  harness.pageDocument.setHidden(false);
  assert.deepEqual(harness.calls, ['play', 'stop', 'stop']);
  assert.equal(harness.timers.pending().length, 0);

  observed.emit(harness.target, 0, false);
  assert.deepEqual(harness.calls, ['play', 'stop', 'stop', 'stop']);

  observed.emit(harness.target, 0.8);
  assert.deepEqual(harness.calls, ['play', 'stop', 'stop', 'stop']);
  assert.equal(harness.timers.pending().length, 0);

  harness.controller.replay();
  assert.deepEqual(
    harness.calls,
    ['play', 'stop', 'stop', 'stop', 'stop', 'reset', 'play'],
  );
  assert.equal(harness.timers.pending().length, 1);
});


test('a retained stale callback cannot orphan the replacement timer before cleanup', () => {
  const harness = createHarness();
  const observed = harness.observer.instances[0];

  observed.emit(harness.target, 0.7);
  const staleTimer = harness.timers.pending()[0];

  harness.controller.replay();
  const replacementTimer = harness.timers.pending()[0];
  assert.notEqual(replacementTimer.id, staleTimer.id);

  harness.timers.fire(staleTimer.id, { retained: true });
  harness.controller.cleanup();

  assert.equal(replacementTimer.cancelled, true);
  assert.equal(harness.timers.pending().length, 0);
});


test('an off-screen replay restarts cleanly when the target becomes visible', () => {
  const harness = createHarness();
  const observed = harness.observer.instances[0];

  harness.controller.replay();
  assert.deepEqual(harness.calls, ['stop', 'reset', 'play']);
  assert.equal(harness.timers.pending().length, 1);
  assert.equal(harness.target.getAttribute('data-demo-state'), 'playing');

  observed.emit(harness.target, 0, false);
  assert.deepEqual(
    harness.calls,
    ['stop', 'reset', 'play'],
    'a below-threshold observer record must not cancel an explicit Replay',
  );

  observed.emit(harness.target, 0.7);
  assert.deepEqual(
    harness.calls,
    ['stop', 'reset', 'play', 'stop', 'reset', 'play'],
  );
  assert.equal(harness.timers.pending().length, 1);
});


test('an off-screen replay reaches final once without starting an invisible repeat', () => {
  const harness = createHarness();

  harness.controller.replay();
  const completion = harness.timers.pending()[0];
  harness.timers.fire(completion.id);

  assert.equal(harness.target.getAttribute('data-demo-state'), 'final');
  assert.equal(harness.timers.pending().length, 0);
  assert.deepEqual(harness.calls, ['stop', 'reset', 'play']);
});


test('Replay stays paused while the document is hidden', () => {
  const harness = createHarness();

  harness.pageDocument.setHidden(true);
  harness.controller.replay();

  assert.equal(harness.target.getAttribute('data-demo-state'), 'paused');
  assert.equal(harness.timers.pending().length, 0);
  assert.deepEqual(harness.calls, ['stop', 'reset']);
});


test('reduced motion renders the final state without observers, listeners, or timers', () => {
  const observer = createObserverHarness();
  const pageDocument = createDocumentHarness();
  const timers = createTimerHarness();
  const calls = [];

  const controller = createDemoLoop({
    target: { id: 'reduced-demo' },
    reducedMotion: true,
    cycleMs: 6000,
    play: () => calls.push('play'),
    showFinal: () => calls.push('showFinal'),
    reset: () => calls.push('reset'),
    stop: () => calls.push('stop'),
    Observer: observer.Observer,
    pageDocument,
    schedule: timers.schedule,
    cancelScheduled: timers.cancel,
  });

  assert.deepEqual(calls, ['showFinal']);
  assert.equal(observer.instances.length, 0);
  assert.equal(pageDocument.listeners.size, 0);
  assert.equal(timers.scheduled.length, 0);

  controller.cleanup();
  controller.cleanup();
  assert.deepEqual(calls, ['showFinal', 'stop']);
});


test('a missing observer falls back to the accessible final state', () => {
  const calls = [];
  const pageDocument = createDocumentHarness();
  const timers = createTimerHarness();

  createDemoLoop({
    target: { id: 'fallback-demo' },
    cycleMs: 10000,
    play: () => calls.push('play'),
    showFinal: () => calls.push('showFinal'),
    reset: () => calls.push('reset'),
    stop: () => calls.push('stop'),
    Observer: null,
    pageDocument,
    schedule: timers.schedule,
    cancelScheduled: timers.cancel,
  });

  assert.deepEqual(calls, ['showFinal']);
  assert.equal(pageDocument.listeners.size, 0);
  assert.equal(timers.scheduled.length, 0);
});
