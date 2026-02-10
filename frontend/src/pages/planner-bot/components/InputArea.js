import * as React from 'react';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';

export default function InputArea({
  input,
  setInput,
  handleSend,
  handleFileUpload,
  sending
}) {
  return (
    <div className="px-8 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-2 border border-white/30">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-white/50 backdrop-blur-sm hover:bg-white/70 rounded-xl shadow-sm transition-all duration-300 hover:scale-105 w-8 h-8"
            >
              <AddIcon className="h-4 w-4" />
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about your financial planning..."
              className="flex-1 resize-none border-0 bg-transparent p-2 focus:outline-none max-h-20 placeholder-gray-500 text-sm"
              rows="1"
            />
            
            <Button
              size="icon"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 w-8 h-8"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}