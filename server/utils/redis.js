const Redis = require("ioredis");

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_SSL.toLowerCase() === "true" ? {} : undefined,
  retryStrategy: function (times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: function (err) {
    const targetError = "READONLY";
    if (err.message.slice(0, targetError.length) === targetError) {
      return true;
    }
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.log(err);
});

module.exports = redis;
