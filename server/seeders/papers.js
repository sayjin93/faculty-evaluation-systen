const db = require('../models');

async function seed() {
  const papersData = [
    {
      title: 'Paper 1',
      journal: 'Buletini Shkencor',
      publication: new Date('2022-01-21'),
      academic_year_id: 1,
      professor_id: 1,
    },
    {
      title: 'Paper 2',
      journal: 'Buletini Shkencor',
      publication: new Date('2023-01-21'),
      academic_year_id: 2,
      professor_id: 1,
    },
    {
      title: 'Paper 3',
      journal: 'Buletini Shkencor',
      publication: new Date('2023-02-08'),
      academic_year_id: 2,
      professor_id: 2,
    },
    {
      title: 'Paper 4',
      journal: 'Some Journal',
      publication: new Date('2022-03-15'),
      academic_year_id: 1,
      professor_id: 3,
    },
    {
      title: 'Paper 5',
      journal: 'Another Journal',
      publication: new Date('2022-06-10'),
      academic_year_id: 1,
      professor_id: 4,
    },
    {
      title: 'Paper 6',
      journal: 'Science Journal',
      publication: new Date('2022-07-20'),
      academic_year_id: 2,
      professor_id: 5,
    },
    {
      title: 'Paper 7',
      journal: 'Nature',
      publication: new Date('2022-08-17'),
      academic_year_id: 2,
      professor_id: 6,
    },
    {
      title: 'Paper 8',
      journal: 'Buletini Shkencor',
      publication: new Date('2022-11-12'),
      academic_year_id: 1,
      professor_id: 7,
    },
    {
      title: 'Paper 9',
      journal: 'Some Journal',
      publication: new Date('2022-12-05'),
      academic_year_id: 1,
      professor_id: 8,
    },
    {
      title: 'Paper 10',
      journal: 'Another Journal',
      publication: new Date('2023-03-25'),
      academic_year_id: 2,
      professor_id: 9,
    },
  ];

  for (const paper of papersData) {
    const defaultPapersData = {
      ...paper,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.papers.findOrCreate({
      where: {
        title: paper.title,
        academic_year_id: paper.academic_year_id,
        professor_id: paper.professor_id,
      },
      defaults: defaultPapersData,
    });
  }
}

module.exports = seed;
