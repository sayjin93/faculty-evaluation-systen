const Professor = require('../../models/professor');

// Function to generate a random date between two dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Temp data
const professorsData = [
  {
    first_name: 'Jurgen',
    last_name: 'Kruja',
    gender: 'm',
    username: 'admin',
    password: 'admin',
    email: 'jurgen-kruja@live.com',
    is_admin: 1,
  },
  {
    first_name: 'Professor',
    last_name: 'One',
    gender: 'f',
    username: 'pone',
    password: 'pone@@',
    email: 'pone@uet.edu.al',
    department_id: 1,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Two',
    gender: 'f',
    username: 'ptwo',
    password: 'ptwo@@',
    email: 'ptwo@uet.edu.al',
    department_id: 2,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Three',
    gender: 'm',
    username: 'pthree',
    password: 'pthree@@',
    email: 'pthree@abozdo.edu.al',
    department_id: 3,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Four',
    gender: 'm',
    username: 'pfour',
    password: 'pfour@@',
    email: 'pfour@uet.edu.al',
    department_id: 4,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Five',
    gender: 'f',
    username: 'pfive',
    password: 'pfive@@',
    email: 'pfive@uet.edu.al',
    department_id: 5,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Six',
    gender: 'm',
    username: 'psix',
    password: 'psix@@',
    email: 'psix@uet.edu.al',
    department_id: 6,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Seven',
    gender: 'f',
    username: 'pseven',
    password: 'grisejda@@',
    email: 'pseven@uet.edu.al',
    department_id: 7,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Eight',
    gender: 'f',
    username: 'peight',
    password: 'peight@@',
    email: 'peight@uet.edu.al',
    department_id: 8,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Nine',
    gender: 'f',
    username: 'pnine',
    password: 'pnine@@',
    email: 'pnine@uet.edu.al',
    department_id: 9,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Ten',
    gender: 'm',
    username: 'pten',
    password: 'pten@@',
    email: 'pten@uet.edu.al',
    department_id: 10,
    is_admin: 0,
  },
];

async function seed() {
  const promises = professorsData.map(async (professor) => {
    try {
      // Generate random dates between 2015 and 2023
      const randomCreatedAt = randomDate(new Date('2015-01-01'), new Date('2023-12-31'));
      const randomUpdatedAt = randomDate(randomCreatedAt, new Date('2023-12-31')); // Ensure updatedAt is after createdAt

      const defaultProfessorData = {
        ...professor,
        is_verified: 1,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        verificationToken: null,
        verificationTokenExpires: null,
        createdAt: randomCreatedAt,
        updatedAt: randomUpdatedAt,
      };

      await Professor.findOrCreate({
        where: {
          first_name: professor.first_name,
          last_name: professor.last_name,
        },
        defaults: defaultProfessorData,
      });
    } catch (error) {
      console.error('Error seeding course:', professor, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
