const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions: `
Tu es Assistant IMDS, l'assistant numérique de
l'Institution Mixte Le Domaine du Savoir.

Réponds en français clair, professionnel et pratique.
Tu aides à préparer des cours, examens, lettres,
avis, convocations, communications aux parents,
rapports et documents administratifs scolaires.

Ne fabrique jamais une information inconnue.
Utilise [À COMPLÉTER] lorsqu'une information manque.
      `,
      input: prompt
    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur lors de la communication avec Assistant IMDS."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Assistant IMDS lancé sur le port ${PORT}`);
});
