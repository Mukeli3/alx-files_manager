import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const route = express.Router();

// define stats and status routes
route.get('/status', AppController.getStatus);
route.get('/stats', AppController.getStats);
route.post('/users', UsersController.postNew);

export default route;
