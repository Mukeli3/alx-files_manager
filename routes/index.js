import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const route = express.Router();

// define stats and status routes
route.get('/status', AppController.getStatus);
route.get('/stats', AppController.getStats);
route.post('/users', UsersController.postNew);
route.get('/connect', AuthController.getConnect);
route.get('/disconnect', AuthController.getDisconnect);
route.get('/users/me', UsersController.getMe);

export default route;
