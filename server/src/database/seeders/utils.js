const professorsCount = 144;
const academicYearsCount = 6;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = { professorsCount, academicYearsCount, randomInt };
