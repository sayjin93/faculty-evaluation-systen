const express = require('express');
const passport = require('passport');

const Settings = require('../models/settings');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Retrieve all Settings
router.get('/', auth, async (req, res) => {
  try {
    const result = await Settings.findAll();

    if (!result) {
      return res.json({ message: 'No settings found' });
    }

    return res.json(result);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Retrieve Email Settings
router.get('/email', auth, async (req, res) => {
  try {
    const result = await Settings.findOne({ where: { name: 'Email' } });

    if (!result) {
      return res.json({ message: 'SMTP settings not found' });
    }

    return res.json(result);
  } catch (error) {
    console.error('Error retrieving SMTP settings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update or Save Email Settings
router.put('/email', auth, async (req, res) => {
  try {
    const {
      sender_name, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass,
    } = req.body;

    const settingsData = {
      sender_name,
      smtp_host,
      smtp_port,
      smtp_secure,
      smtp_user,
      smtp_pass,
    };

    const [settings, created] = await Settings.findOrCreate({
      where: { name: 'Email' },
      defaults: { settings: settingsData },
    });

    if (!created) {
      settings.settings = settingsData;
      await settings.save();
    }
    return res.json({ message: 'SMTP settings saved successfully', settings });
  } catch (error) {
    console.error('Error saving SMTP settings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
