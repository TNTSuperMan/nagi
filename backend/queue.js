const queue = [];

function queueMiddleware(_, _2, next) {
  queue.push(next);
}

setInterval(function () {
  queue.shift()?.();
}, 1000);

module.exports = queueMiddleware;
