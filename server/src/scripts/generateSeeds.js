const fs = require('fs');
const path = require('path');
const {
  sequelize,
  Settings,
  Faculty,
  Department,
  AcademicYear,
  Professor,
  Book,
  Community,
  Conference,
  Course,
  Paper,
  Summarize,
} = require('../models'); // Import your models

// Correct the paths to point to the correct seed and seeder directories
const seedsDir = path.join(__dirname, '../seeders/migration/seeds'); // Ensure JSON files go here
const seedersDir = path.join(__dirname, '../seeders/migration'); // Inside 'src/seeders/migration'

// Helper function to clean directory
const cleanDirectory = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const currentPath = path.join(dir, file);
      if (fs.lstatSync(currentPath).isFile()) {
        fs.unlinkSync(currentPath); // Delete file
      }
    });
  }
};

// Clean the 'seeds' and 'seeders/migration' directories before generating files
cleanDirectory(seedsDir); // Clean the JSON files
cleanDirectory(seedersDir); // Clean the JS seeders, but don't delete the 'seeds' folder

// Create the 'seeds' and 'seeders/migration' directories if they don't exist
if (!fs.existsSync(seedsDir)) {
  fs.mkdirSync(seedsDir, { recursive: true });
}
if (!fs.existsSync(seedersDir)) {
  fs.mkdirSync(seedersDir, { recursive: true });
}

// Accept command-line arguments
const args = process.argv.slice(2); // Exclude the first two arguments
const isPostgres = args.includes('postgres'); // Check if 'postgres' was passed

const generateSeedFileContent = (modelName, dataFileName, updateFields) => {
  let optionsString = '';
  if (isPostgres) {
    optionsString = `{
      conflictFields: ['id'],
      updateOnConflict: ${JSON.stringify(updateFields)}
    }`;
  } else {
    optionsString = `{
      updateOnDuplicate: ["id"]
    }`;
  }

  return `'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '${dataFileName}'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('${modelName}', data, ${optionsString});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('${modelName}', null, {});
  }
};
`;
};

const dumpDataAndGenerateSeed = async (Model, modelName, filePrefix, booleanFields = []) => {
  try {
    let data = await Model.findAll({ raw: true });

    // Check if data is empty
    if (!data || data.length === 0) {
      console.log(`No data found for ${modelName}. Skipping seed file generation.`);
      return; // Exit the function if no data is found
    }

    // Convert integer booleans to actual booleans
    data = data.map((record) => {
      booleanFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(record, field)) {
          record[field] = Boolean(record[field]);
        }
      });
      return record;
    });

    const dataFileName = `${filePrefix}-${modelName}.json`;
    const seedFileName = `${filePrefix}-${modelName}.js`;

    // Dump data into JSON file
    fs.writeFileSync(
      path.join(seedsDir, dataFileName),
      JSON.stringify(data, null, 2),
    );

    // Get fields to update on conflict (excluding 'id')
    const updateFields = Object.keys(data[0]).filter((field) => field !== 'id');

    // Generate seed file
    const seedContent = generateSeedFileContent(modelName, dataFileName, updateFields);
    fs.writeFileSync(path.join(seedersDir, seedFileName), seedContent);

    console.log(`Data and seed file generated for ${modelName} successfully!`);
  } catch (error) {
    console.error(`Error dumping data for ${modelName}:`, error);
  }
};

const dumpData = async () => {
  try {
    await dumpDataAndGenerateSeed(Settings, 'Settings', '01');
    await dumpDataAndGenerateSeed(Faculty, 'Faculty', '02');
    await dumpDataAndGenerateSeed(Department, 'Department', '03');
    await dumpDataAndGenerateSeed(AcademicYear, 'AcademicYear', '04', ['active']);
    await dumpDataAndGenerateSeed(
      Professor,
      'Professor',
      '05',
      ['is_admin', 'is_verified'], // Include all boolean fields
    );
    await dumpDataAndGenerateSeed(Book, 'Book', '06');
    await dumpDataAndGenerateSeed(Community, 'Community', '07', ['external']);
    await dumpDataAndGenerateSeed(Conference, 'Conference', '08');
    await dumpDataAndGenerateSeed(Course, 'Course', '09');
    await dumpDataAndGenerateSeed(Paper, 'Paper', '10');
    await dumpDataAndGenerateSeed(Summarize, 'Summarize', '11');
    console.log('Data dumped and seed files generated successfully!');
  } catch (error) {
    console.error('Error dumping data:', error);
  } finally {
    await sequelize.close();
  }
};

dumpData();
