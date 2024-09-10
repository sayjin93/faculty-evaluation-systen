const { Settings } = require('../../models');

module.exports = {
  up: async () => {
    // Define the initial data for the Settings model
    const settingsData = [
      {
        name: 'Email',
        settings: JSON.stringify({
          smtp_sender: 'UET Support',
          smtp_host: 'mail.jkruja.com',
          smtp_port: 465,
          smtp_secure: true, // Use boolean for smtp_secure
          smtp_user: 'info@jkruja.com',
          smtp_pass: 'Kruja2021..',
        }),
      },
    ];

    const promises = settingsData.map(async (setting) => {
      try {
        const defaultSettingsData = {
          ...setting,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Settings.findOrCreate({
          where: {
            name: setting.name,
          },
          defaults: defaultSettingsData,
        });

        if (created) {
          console.log(`Settings "${setting.name}" created.`);
        } else {
          console.log(`Settings "${setting.name}" already exist.`);
        }
      } catch (error) {
        console.error('Error seeding settings:', setting.name, error);
      }
    });

    await Promise.all(promises);
    console.log('Settings seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the settings records
    await Settings.destroy({
      where: {
        name: 'Email',
      },
    });
    console.log('Settings seeding reverted.');
  },
};
