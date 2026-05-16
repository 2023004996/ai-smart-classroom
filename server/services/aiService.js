import openai from '../config/openai.js';

export const askAI = async (message, user) => {
  const prompt = `You are an AI classroom assistant for an online course platform. The user says: "${message}". Provide a helpful, concise response appropriate for a student or instructor.`;

  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
    temperature: 0.8,
    max_output_tokens: 250
  });

  const answer = completion.output[0]?.content[0]?.text || 'I could not generate a response at this time.';
  return answer;
};
