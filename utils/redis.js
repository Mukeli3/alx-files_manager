import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      // set host config for a db connection, with a fallback value if the env var DB_HOST is not
      // set.
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 6379, // set Redis port, default port
    });
    // transform callback funcs of any redis func to an async method (promise-based function)
    // -> promisify
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.quitAsync = promisify(this.client.quit).bind(this.client);

    // listen for errors and print them
    this.client.on('error', (err) => {
      console.log(`Redis Client Error: ${err}`);
    });
  }

  /**
 * Check if Redis client is alive
 * @returns {boolean} True if the client is alive, false otherwise
 */
  isAlive() {
    return this.client.connected && this.client.ready;
  }

  /**
 * Takes a string key as arg and returns the Redis server value stored for this key
 * @param {string} key - the key to get value for
 * @returns {Promise<string>} promise, resolves to value associated with the specified key
 * null if key does not exist
 */
  async get(key) {
    try {
      const val = await this.getAsync(key);
      return val;
    } catch (error) {
      console.log(`get method Error ${error}`);
      throw error;
    }
  }

  /**
 * Takes a string key, value and duration in sec as args to store in Redis (expiration set by the
 * duration arg)
 * @param {string} key - key to set the value for
 * @param {string} value - value to set
 * @param {number} duration - expiration time in secs
 */
  async set(key, value, duration) {
    try {
      const setVal = await this.setAsync(key, value, 'EX', duration);
      return setVal;
    } catch (error) {
      console.error(`set method Error ${error}`);
      throw error;
    }
  }

  /**
 * Takes a str key as arg and removes the value in Redis for the key
 * @param {string} key - key for which value is to be deleted
 * @returns {Promise<void>} Promise, resolves when the value has been deleted
 */
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (error) {
      console.error(`del method Error ${error}`);
      throw error;
    }
  }

  /**
 * Closes the Redis server connection
 * @returns {Promise<void>} Promise, resolves when connection closes
 */
  async close() {
    try {
      await this.quitAsync();
    } catch (error) {
      console.error('close method Error');
      throw error;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
