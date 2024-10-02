import crypto from 'crypto'; // hash the password using SHA1
import dbClient from '../utils/db'; // MongoDB client

class UsersController {
  /**
   * POST /users - creates a new user
   */
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }
      const usr = await dbClient.db.collection('users').findOne({ email });
      if (usr) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // hashing the password
      const hashed = crypto.createHash('sha1').update(password).digest('hex');

      // creating new user
      const newUsr = await dbClient.db.collection('users').insertOne({
        email,
        password: hashed, // storing hashed passwrd
      });
      return res.status(201).json({ // responding with new usr ID and email
        id: newUsr.insertedId,
        email,
      });
    } catch (err) {
      console.error(`Error creating user: ${err}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /users/me - retrieves the user based on used token
   */
  static async getMe(req, res) {
    // getting token from X-Token header
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

     const key = `auth_${token}`;
     const usrId = await redisClient.get(key);
     if (!usrId) {
       return res.status(401).json({ error: 'Unauthorized' });
     }

     // retrieving user from MongoDB by ID
     try {
       const usr = await dbClient.db.collection('users').findOne({_id: dbClient.ObjectId(usrId) }, { projection: { email: 1 } });
       if (!usr) {
         return res.status(401).json({ error: 'Unauthorized' });
       }

       return res.status(200).json({ id: usr._id, email: usr.email });
     } catch (err) {
       console.error(`Error retrieving user: ${err}`);
       return res.status(500).json({ error: 'Internal server error' });
     }
  }
}

export default UsersController;
