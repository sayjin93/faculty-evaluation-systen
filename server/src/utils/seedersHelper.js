const professorsCount = 22;
const academicYearsCount = 2;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = { professorsCount, academicYearsCount, randomInt };
