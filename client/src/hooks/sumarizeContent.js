import axios from 'axios';

const summarizeContent = async (content) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(
            endpoint,
            {
                model: 'gpt-3.5-turbo', // Using the gpt-3.5-turbo model
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: `Summarize the following content:\n\n${content}` }
                ],
                max_tokens: 100, // Adjust as needed
                temperature: 0.7, // Adjust as needed
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error summarizing content:', error);
        return null;
    }
};

export default summarizeContent;
