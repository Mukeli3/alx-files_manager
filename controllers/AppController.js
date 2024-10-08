// stats and status endpoints logic
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  // GET /status
  static async getStatus(req, res) {
    try {
      // interact with redis and Mongodb clients
      const rOn = redisClient.isAlive();
      const dbOn = dbClient.isAlive();

      res.status(200).json({ redis: rOn, db: dbOn });
    } catch (err) {
      res.status(500).json({ err: 'Error fetching status' });
    }
  }

  // GET stats
  static async getStats(req, res) {
    try {
      const usr = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();

      res.status(200).json({ usr, files });
    } catch (err) {
      res.status(500).json({ err: 'Error fetching stats' });
    }
  }
}

export default AppController;
