import express from 'express';
import { signup } from '#controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', (req, res) => {
  // Handle user login logic here
  res.send('User logged in successfully');
});

router.post('/logout', (req, res) => {
  // Handle user logout logic here
  res.send('User logged out successfully');
});

export default router;