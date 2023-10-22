const db = require('../models');

async function seed() {
  const conferencesData = [
    {
      name: 'Conference 1',
      location: 'Munich, Germany',
      present_title: 'AI Implementation',
      authors: 'Petraq Papajorgji, Fatos Mustafa',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 1,
    },
    {
      name: 'Conference 2',
      location: 'London, UK',
      present_title: 'Machine Learning Advancements',
      authors: 'John Smith, Emily Johnson',
      dates: '20/06/2022 - 24/06/2022',
      academic_year_id: 1,
      professor_id: 2,
    },
    {
      name: 'Conference 3',
      location: 'New York, USA',
      present_title: 'Ethical AI Development',
      authors: 'Anna Lee, David Brown',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 3,
    },
    {
      name: 'Conference 4',
      location: 'Tokyo, Japan',
      present_title: 'Natural Language Processing',
      authors: 'Yuki Tanaka, Hiroshi Sato',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 4,
    },
    {
      name: 'Conference 5',
      location: 'Paris, France',
      present_title: 'Computer Vision Trends',
      authors: 'Sophie Martin, Pierre Lefebvre',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 5,
    },
    {
      name: 'Conference 6',
      location: 'San Francisco, USA',
      present_title: 'Big Data Analytics',
      authors: 'Michael Johnson, Jennifer Lee',
      dates: '20/08/2022 - 24/08/2022',
      academic_year_id: 1,
      professor_id: 6,
    },
    {
      name: 'Conference 7',
      location: 'Berlin, Germany',
      present_title: 'Robotics and Automation',
      authors: 'Andreas Wagner, Julia Schneider',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 7,
    },
    {
      name: 'Conference 8',
      location: 'Sydney, Australia',
      present_title: 'Data Privacy and Security',
      authors: 'James Wilson, Emma Brown',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 8,
    },
    {
      name: 'Conference 9',
      location: 'Seoul, South Korea',
      present_title: 'AI in Healthcare',
      authors: 'Ji-hoon Kim, Min-ji Lee',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 9,
    },
    {
      name: 'Conference 10',
      location: 'Toronto, Canada',
      present_title: 'Future of Quantum Computing',
      authors: 'Alex Johnson, Sarah Miller',
      dates: '20/06/2023 - 24/06/2023',
      academic_year_id: 2,
      professor_id: 10,
    },
  ];

  for (const conference of conferencesData) {
    const defaultConferencesData = {
      ...conference,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.conferences.findOrCreate({
      where: {
        name: conference.name,
        academic_year_id: conference.academic_year_id,
        professor_id: conference.professor_id,
      },
      defaults: defaultConferencesData,
    });
  }
}

module.exports = seed;
