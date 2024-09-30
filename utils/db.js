import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // setting up connection params, MongoDB
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_HOST || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // MongoDB URI
    const url = `mongodb://${host}:${port}`;
	
    // initialize the client and connect to the db
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;

    this.client.connect() // connect client to MongoDB server
      .then(() => {
        this.db = this.client.db(this.dbName);
      })
      .catch((err) => {
        console.error(`Connection to MongoDB failed: ${err}`);
      });
  }

  /**
   * Checks for MongoDB connection
   * @returns {boolean} true if connected, else false
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Returns the number of docs in the collection
   * @returns {Promise<number>} users in the db number
   */
  async nbUsers() {
    try {
      const usrColn = this.db.collection('users');
      const usrCount = await usrcoln.countDocuments();
      return usrCount;
    } catch (err) {
      console.error(`Getting user count failed: ${err}`);
      throw err;
    }
  }

  /**
   * Returns docs in the 'files' collection number
   * @returns {Promse<number>} files in the db number
   */
  async nbFiles() {
    try {
      const flsColn = this.db.collection('files'); // files collection
      const flCount = await flsColn.countDocuments(); // files count
      return flCount;
    } catch (err) {
      console.error(`Getting file count failed: ${err}`);
      throw err;
    }
  }
}

// create DBClient instance and export
const dbClient = new DBClient();
export default dbClient;
