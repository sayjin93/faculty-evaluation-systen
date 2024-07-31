const professorsCount = 10;
const academicYearsCount = 4;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = { professorsCount, academicYearsCount, randomInt };
