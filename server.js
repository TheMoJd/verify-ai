// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/getExpertOpinions', async (req, res) => {
    const { businessIdea } = req.body;

    const experts = [
        {
            role: 'Expert technique informatique avec 30 ans d\'expérience',
            prompt: `En tant qu'expert technique informatique avec 30 ans d'expérience, donnez votre avis sur l'idée suivante : ${businessIdea}`,
        },
        {
            role: 'Entrepreneur à succès ayant créé plusieurs entreprises',
            prompt: `En tant qu'entrepreneur à succès ayant créé plusieurs entreprises, donnez votre avis sur l'idée suivante : ${businessIdea}`,
        },
        {
            role: 'Analyste business avec plus de 30 ans d\'expérience',
            prompt: `En tant qu'analyste business avec plus de 30 ans d'expérience, donnez votre avis sur l'idée suivante : ${businessIdea}`,
        },
    ];

    try {
        // Call OpenAI API to get expert opinions FOR EACH expert
        const responses = await Promise.all(experts.map(async (expert) => {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4",
                messages: [
                    { role: 'system', content: expert.prompt },
                ],
                max_tokens: 500,
                n: 1,
                stop: null,
                temperature: 0.7,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            });

            return {
                role: expert.role,
                opinion: response.data.choices[0].message.content,
            };
        }));

        res.json({ success: true, data: responses });
        console.log(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur lors de la génération des avis des experts.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
