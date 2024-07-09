import { useState } from 'react';
import { apiService } from '../../api';
import $ from './index.module.css'

const TextProcessor = () => {
  const [promptText, setPromptText] = useState('');
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.processText({ promptText, text: inputText });
      setProcessedText(response.processedText || '');
    } catch (err) {
      setError('Failed to process text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={$.container}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Prompt Text"
        />
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Input Text"
        />
        <button type="submit" disabled={loading}>Process Text</button>
      </form>
      {loading && <div>Processing...</div>}
      {error && <div>Error: {error}</div>}
      {processedText && (
        <div>
          <h3>Processed Text:</h3>
          <p>{processedText}</p>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;