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

      if(!password) {
        return res.status(400).json({ error: 'Missing password' });
      }
      const usr = await dbClient.db.collection('users').findOne({ email });
      if (usr) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // hashing the password
      const hashed = crypto.createHash('sha1').update(password).digest('hex');

      // creating new user
      const newUsr = await dbClient.db.collection('users').insertOne({ email,
        password: hashed, // storing hashed passwrd
      });
      return res.status(201).json({ // responding with new usr ID and email
        id: newUsr.insertedId,
	email,
      });
    } catch (err) {
      console.error(`Error creating user: ${err}`);
      return res.status(500).json({ error: 'Internal server error'});
    }
  }
}

export default UsersController;
