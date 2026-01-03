import React, { useState } from 'react';
import { Brain, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const AISummaryCard = ({ docId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleGenerateSummary = async () => {
    if (!docId) {
      toast.error('Document ID is required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/communication/summarize/${docId}`);
      setSummary(response.data.summary);
      toast.success('AI summary generated successfully!');
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast.error('Failed to generate AI summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatSummary = (summaryText) => {
    // Convert markdown-style bullet points to JSX
    const lines = summaryText.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={index} className="ml-4 mb-2 text-sm text-gray-700">
            {line.trim().substring(2)}
          </li>
        );
      }
      return (
        <p key={index} className="mb-2 text-sm text-gray-700 font-medium">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">AI Document Summary</h4>
            <p className="text-xs text-gray-600">Powered by advanced language models</p>
          </div>
        </div>

        {!summary && (
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-3 h-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-3 h-3" />
                Generate Summary
              </>
            )}
          </button>
        )}

        {summary && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="text-xs font-medium">
              {expanded ? 'Collapse' : 'Expand'}
            </span>
          </button>
        )}
      </div>

      {summary && (
        <div className={`transition-all duration-300 ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">AI Analysis</span>
            </div>
            <div className="text-sm text-gray-700">
              <ul className="list-disc pl-4 space-y-1">
                {formatSummary(summary)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!summary && !loading && (
        <div className="text-center py-4">
          <Brain className="w-8 h-8 text-purple-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            Click "Generate Summary" to analyze this document with AI
          </p>
        </div>
      )}
    </div>
  );
};

export default AISummaryCard;
