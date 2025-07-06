const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateCaption = async (description) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative assistant that writes short, engaging captions for social media posts.",
        },
        {
          role: "user",
          content: `Generate a creative caption for a media post about: ${description}`,
        },
      ],
    });

    const caption = completion.choices[0]?.message?.content?.trim();

    return caption || null;
  } catch (err) {
    console.error("OpenAI API Error:", err.message);
    return null;
  }
};

module.exports = generateCaption;
