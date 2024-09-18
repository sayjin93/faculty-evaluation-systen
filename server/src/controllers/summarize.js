// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');

const { Summarize } = require('../models');

exports.create = async (req, res) => {
  const userId = req.user.id; // Accessing the user ID from the request object
  const { content } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await axios.post(
      endpoint,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          {
            role: 'user',
            content: `Summarize the following content in the given language:\n\n${content}`,
          },
        ],
        max_tokens: 250,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const newSummary = await Summarize.create({
      content: response.data.choices[0].message.content.trim(),
      professor_id: userId,
    });

    res.json(newSummary);
  } catch (error) {
    console.error('Error summarizing content:', error);
    res.status(500).send('Failed to summarize content');
  }
};

exports.getByProfessor = async (req, res) => {
  try {
    const userId = req.user.id; // Accessing the user ID from the request object
    const summaries = await Summarize.findAll({
      where: { professor_id: userId },
    });

    if (!summaries.length) {
      return res
        .status(404)
        .send({ message: 'No summaries found for this professor.' });
    }

    res.json(summaries);
  } catch (err) {
    console.error('Failed to retrieve summaries:', err);
    res
      .status(500)
      .send({ message: 'Error retrieving summaries for the professor.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const summaryId = req.params.id; // Get summary ID from URL parameter
    const numDeleted = await Summarize.destroy({ where: { id: summaryId } });

    if (numDeleted === 0) {
      return res
        .status(404)
        .send({ message: 'Summary not found or already deleted.' });
    }

    res.send({ message: 'Summary was deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete summary:', err);
    res.status(500).send({ message: 'Could not delete summary.' });
  }
};
