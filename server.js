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
    const { businessIdea, selectedExperts } = req.body;

    // Validation des entrées
    if (!businessIdea || !selectedExperts) {
        return res.status(400).json({ success: false, error: 'Données manquantes.' });
    }

    if (!Array.isArray(selectedExperts) || selectedExperts.length === 0) {
        return res.status(400).json({ success: false, error: 'Aucun expert sélectionné.' });
    }

    // Construire la liste des experts
    const expertList = selectedExperts.map((expert, index) => `${index + 1}. ${expert}`).join('\n');
    console.log("Liste des experts :", expertList);
    const systemMessage = `Vous êtes un panel composé des experts suivants :

    ${expertList}

    Chaque expert doit répondre de manière indépendante en fournissant des informations détaillées et pertinentes selon son domaine de compétence.`;

    // Format de réponse pour chaque expert
    const expertResponses = selectedExperts.map(expert => `{
    "role": "${expert}",
    "opinion": "Votre avis détaillé ici"
    }`).join(',\n');

    const userMessage = `Vous allez fournir les avis des experts suivants sur l'idée suivante : "${businessIdea}".

    Veuillez répondre en suivant ce format exact (ne fournissez aucun texte supplémentaire en dehors de ce format) :

    {
        "opinions": [
            ${expertResponses}
        ]
    }

    Assurez-vous que la réponse est un JSON valide et qu'elle respecte exactement ce format.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userMessage },
            ],
            max_tokens: 1500,
            n: 1,
            stop: null,
            temperature: 0.7,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
        });
        const content = response.data.choices[0].message.content;
        console.log("Réponse de l'assistant :", content);

        try {
            const jsonResponse = JSON.parse(content);
            if (jsonResponse.opinions && Array.isArray(jsonResponse.opinions)) {
                res.json({ success: true, data: jsonResponse.opinions });
            } else {
                throw new Error('Le format de la réponse n\'est pas valide.');
            }
        } catch (parseError) {
            console.error("Erreur lors du parsing du JSON :", parseError);
            res.status(500).json({ success: false, error: 'Erreur lors du parsing de la réponse de l\'assistant.' });
        }
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur lors de la génération des avis des experts.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
