import express from 'express';
import AppController from '../controllers/AppController';

const route = express.Router();

// define stats and status routes
route.get('/status', AppController.getStatus);
route.get('/stats', AppController.getStats);

export default route;
