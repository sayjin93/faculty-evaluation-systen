const { Professor } = require('../models');

// Function to generate a random date between two dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Temp data
const professorsData = [
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
  {
    first_name: 'Professor',
    last_name: 'Eleven',
    gender: 'm',
    username: 'peleven',
    password: 'peleven@@',
    email: 'peleven@uet.edu.al',
    department_id: 11,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Twelve',
    gender: 'm',
    username: 'ptwelve',
    password: 'ptwelve@@',
    email: 'ptwelve@uet.edu.al',
    department_id: 12,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Thirteen',
    gender: 'f',
    username: 'pthirteen',
    password: 'pthirteen@@',
    email: 'pthirteen@uet.edu.al',
    department_id: 13,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Fourteen',
    gender: 'm',
    username: 'pfourteen',
    password: 'pfourteen@@',
    email: 'pfourteen@uet.edu.al',
    department_id: 14,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Fifteen',
    gender: 'f',
    username: 'pfifteen',
    password: 'pfifteen@@',
    email: 'pfifteen@uet.edu.al',
    department_id: 15,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Sixteen',
    gender: 'm',
    username: 'psixteen',
    password: 'psixteen@@',
    email: 'psixteen@uet.edu.al',
    department_id: 3,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Seventeen',
    gender: 'f',
    username: 'pseventeen',
    password: 'pseventeen@@',
    email: 'pseventeen@uet.edu.al',
    department_id: 7,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Eighteen',
    gender: 'm',
    username: 'peighteen',
    password: 'peighteen@@',
    email: 'peighteen@uet.edu.al',
    department_id: 12,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Nineteen',
    gender: 'f',
    username: 'pnineteen',
    password: 'pnineteen@@',
    email: 'pnineteen@uet.edu.al',
    department_id: 10,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'Twenty',
    gender: 'm',
    username: 'ptwenty',
    password: 'ptwenty@@',
    email: 'ptwenty@uet.edu.al',
    department_id: 1,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'TwentyOne',
    gender: 'f',
    username: 'ptwentyone',
    password: 'ptwentyone@@',
    email: 'ptwentyone@uet.edu.al',
    department_id: 14,
    is_admin: 0,
  },
  {
    first_name: 'Professor',
    last_name: 'TwentyTwo',
    gender: 'm',
    username: 'ptwentytwo',
    password: 'ptwentytwo@@',
    email: 'ptwentytwo@uet.edu.al',
    department_id: 8,
    is_admin: 0,
  },
];

module.exports = {
  up: async () => {
    const promises = professorsData.map(async (professor) => {
      try {
        // Generate random dates between 2015 and 2023
        const randomCreatedAt = randomDate(new Date('2015-01-01'), new Date('2023-12-31'));
        const randomUpdatedAt = randomDate(randomCreatedAt, new Date('2023-12-31')); // Ensure updatedAt is after createdAt

        const defaultProfessorData = {
          ...professor,
          is_verified: true, // Use true instead of 1
          resetPasswordToken: null,
          resetPasswordExpires: null,
          verificationToken: null,
          verificationTokenExpires: null,
          createdAt: randomCreatedAt,
          updatedAt: randomUpdatedAt,
        };

        const [created] = await Professor.findOrCreate({
          where: {
            first_name: professor.first_name,
            last_name: professor.last_name,
            email: professor.email,
          },
          defaults: defaultProfessorData,
        });

        if (created) {
          console.log(`Professor "${professor.first_name} ${professor.last_name}" created.`);
        } else {
          console.log(`Professor "${professor.first_name} ${professor.last_name}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding professor:', professor.first_name, professor.last_name, error);
      }
    });

    await Promise.all(promises);
    console.log('Professors seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the professor records
    await Professor.destroy({
      where: {
        email: professorsData.map((professor) => professor.email),
      },
    });
    console.log('Professors seeding reverted.');
  },
};
