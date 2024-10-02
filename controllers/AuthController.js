import { v4 as uuidv4 } from 'uuid'; // generating random strs
import crypto from 'crypto'; // SHA1 password hashing
import redisClient from '../utils/redis'; // token storage
import dbClient from '../utils/db'; // user lookup

class AuthController {
  /**
   * GET /connect - sign-in the user by generating a new authentication token
   */
  static async getConnect(req, res) {
    // get authentication header
    const header = req.headers.authorization; // authorization header
    if (!header || !header.startsWith('Basic')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // decode Base64 to get email and password
    const bCreds = header.split(' ')[1]; // Base64 credentials
    const creds = Buffer.from(bCreds, 'base64').toString('ascii');
    const [email, password] = creds.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // hash password with SHA1
    const hashed = crypto.createHash('sha1').update(password).digest('hex');
    try {
      // find usr in db
      const usr = await dbClient.db.collection('users').findOne({ email, password: hashed });
      if (!usr) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const token = uuidv4(); // generating random token, using uuid
      const key = `auth_${token}`; // store token
      await redisClient.set(key, usr._id.toString(), 86400); // and user ID in Redis for 24hrs
      return res.status(200).json({ token });
    } catch (err) {
      console.error(`Error authenticating: ${err}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /disconnect - sign-out the user based on the token
   */
  static async getDisconnect(req, res) {
    const token = req.headers['x-token']; // get token fron X-Token header
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // remove token from redis
    const key = `auth_${token}`;
    const usrId = await redisClient.get(key);

    if (!usrId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(key); // delete token
    return res.status(204).send(); // No content, successful logout
  }
}

export default AuthController;
