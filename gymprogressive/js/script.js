// https://learn.javascript.ru/advanced-functions
// https://questu.ru/articles/157714/
// https://medium.com/codebuddies/getting-to-know-asynchronous-javascript-callbacks-promises-and-async-await-17e0673281ee

const appOn = true;

const app = (function (onoff) {

})(appOn);

let Gym = (function () {

  function addListener(target, name, listener) {
    target.addEventListener(name, listener);
  }

  function removeListener(target, name, listener) {
    target.removeEventListener(name, listener);
  }

  const ease = {
    linear: function linear(t) {
        return t;
    },
    quadIn: function quadIn(t) {
      return t * t;
    },
    quadOut: function quadOut(t) {
      return t * (2 - t);
    },
    quadInOut: function quadInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    cubicIn: function cubicIn(t) {
      return t * t * t;
    },
    cubicOut: function cubicOut(t) {
      return --t * t * t + 1;
    },
    cubicInOut: function cubicInOut(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    quartIn: function quartIn(t) {
      return t * t * t * t;
    },
    quartOut: function quartOut(t) {
      return 1 - --t * t * t * t;
    },
    quartInOut: function quartInOut(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    quintIn: function quintIn(t) {
      return t * t * t * t * t;
    },
    quintOut: function quintOut(t) {
      return 1 + --t * t * t * t * t;
    },
    quintInOut: function quintInOut(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

	let sort = {
		programm: function programm(_programm) {
			_programm.sort = _programm.queued(sort);

			function sort(next, reverse) {
				let excersises = _programm.excersises;

				excersises.sort(function (a, b) {
					if (reverse) {
						return a.i - b.i;
					} else {
						return b.i - a.i;
					}
				});

				excersises.forEach(function (excersise, i) {
					excersise.sort(i, excersises.length, function (i) {
						if (i === excersises.length - 1) {
							next();
						}
					}, reverse);
				});
			}
		},
		excersise: function excersise(_excersise) {
			let $el = _excersise.$el;

			_excersise.sort = function (i, len, cb, reverse) {
				let z = i / 4;
				let delay = i * 10;

				_excersise.animateTo({
					delay: delay,
					duration: 400,

					x: -z,
					y: -150,
					rot: 0,

					onComplete: function onComplete() {
						$el.style.zIndex = i;
					}
				});

				_excersise.animateTo({
					delay: delay + 500,
					duration: 400,

					x: -z,
					y: -z,
					rot: 0,

					onComplete: function onComplete() {
						cb(i);
					}
				});
			};
		}
	};

	function queue(target) {
		let array = Array.prototype;

		let queueing = [];

		target.queue = queue;
		target.queued = queued;

		return target;

		function queued(action) {
			return function () {
				let self = this;
				let args = arguments;

				queue(function (next) {
					action.apply(self, array.concat.apply(next, args));
				});
			};
		}

		function queue(action) {
			if (!action) {
				return;
			}

			queueing.push(action);

			if (queueing.length === 1) {
				next();
			}
		}

		function next() {
			queueing[0](function (err) {
				if (err) {
				throw err;
				}

				queueing = queueing.slice(1);

				if (queueing.length) {
				next();
				}
			});
		}
	}

	function observable(target) {
		target || (target = {});
		let listeners = {};

		target.on = on;
		target.one = one;
		target.off = off;
		target.trigger = trigger;

		return target;

		function on(name, cb, ctx) {
			listeners[name] || (listeners[name] = []);
			listeners[name].push({ cb: cb, ctx: ctx });
		}

		function one(name, cb, ctx) {
			listeners[name] || (listeners[name] = []);
			listeners[name].push({
				cb: cb, ctx: ctx, once: true
			});
		}

		function trigger(name) {
			let self = this;
			let args = Array.prototype.slice(arguments, 1);

			let currentListeners = listeners[name] || [];

			currentListeners.filter(function (listener) {
				listener.cb.apply(self, args);

				return !listener.once;
			});
		}

		function off(name, cb) {
			if (!name) {
				listeners = {};
				return;
			}

			if (!cb) {
				listeners[name] = [];
				return;
			}

			listeners[name] = listeners[name].filter(function (listener) {
				return listener.cb !== cb;
			});
		}
	}
  
    function Gym() {
        let excersises = new Array();

        let $el = createElement('div');
        let self = observable({ mount: mount, unmount: unmount, excersises: excersises, $el: $el });
        let $root;

        let modules = Deck.modules;
        let module;

        // make queueable
        queue(self);

        // load modules
        for (module in modules) {
            addModule(modules[module]);
        }

        return self;

        function mount(root) {
            // mount to root
            $root = root;
            $root.appendChild($el);
        }

        function unmount() {
            // unmount from root
            $root.removeChild($el);
        }

        function addModule(module) {
            module.gym && module.gym(self);
        }
    };
  
    Gym.modules = { };
    //Deck.modules = { bysuit: bysuit, fan: fan, intro: intro, poker: poker, shuffle: shuffle, sort: sort, flip: flip, remove: remove, forward: forward, backward: backward };

	return Gym;
})();
