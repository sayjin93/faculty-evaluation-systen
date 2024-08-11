const { Settings } = require('../models');

exports.getAllSettings = async (req, res) => {
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
};

exports.getEmailSettings = async (req, res) => {
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
};

exports.saveEmailSettings = async (req, res) => {
  try {
    const {
      smtp_sender, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass,
    } = req.body;

    const settingsData = {
      smtp_sender,
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
};
