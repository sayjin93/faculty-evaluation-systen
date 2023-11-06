const Settings = require('../../models/settings');

async function seed() {
  // Define the initial data for the Settings model
  const settingsData = [
    {
      name: 'Email',
      settings: {
        sender_name: 'UET Support',
        smtp_host: 'mail.jkruja.com',
        smtp_port: 465,
        smtp_secure: 1,
        smtp_user: 'info@jkruja.com',
        smtp_pass: 'Kruja2021..',
      },
    },
  ];

  const promises = settingsData.map(async (setting) => {
    const defaultSettingsData = {
      ...setting,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await Settings.findOrCreate({
      where: {
        name: setting.name,
      },
      defaults: defaultSettingsData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
