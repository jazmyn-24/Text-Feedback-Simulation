import { useState } from 'react';

export default function FeedbackSimulation() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer YOUR_API_KEY`// Replace with your OpenAI API key
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You're an AI assistant that analyzes feedback and returns sentiment, urgency, themes, and keywords as JSON."
            },
            {
              role: "user",
              content: `Analyze the following feedback and return this as JSON:\n{
  sentiment: 'Positive/Neutral/Negative',
  urgency: 'Low/Medium/High',
  themes: ['Theme1', 'Theme2'],
  keywords: ['word1', 'word2']
}\nFeedback: ${input}`
            }
          ]
        })
      });

      const data = await response.json();
      const messageContent = data.choices[0].message.content;
      const parsed = JSON.parse(messageContent);
      setResult(parsed);
    } catch (error) {
      console.error("Error analyzing feedback:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Text Feedback Intelligence</h1>

      <textarea
        className="w-full p-3 border rounded mb-4 bg-white text-black"
        placeholder="Paste or type feedback here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        onClick={handleAnalyze}
      >
        Analyze Feedback
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div>
            <strong>Sentiment:</strong>
            <span className={`ml-2 px-3 py-1 rounded-full text-white ${result.sentiment === 'Positive' ? 'bg-green-500' : result.sentiment === 'Neutral' ? 'bg-gray-500' : 'bg-red-500'}`}>{result.sentiment}</span>
          </div>
          <div>
            <strong>Urgency Level:</strong>
            <span className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-full">{result.urgency}</span>
          </div>
          <div>
            <strong>Themes Identified:</strong>
            <div className="mt-1 flex gap-2 flex-wrap">
              {result.themes.map((theme, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">{theme}</span>
              ))}
            </div>
          </div>
          <div>
            <strong>Keywords:</strong>
            <div className="mt-1 flex gap-2 flex-wrap">
              {result.keywords.map((word, idx) => (
                <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">{word}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
