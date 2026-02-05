import * as React from 'react';
import { Button } from '../../shadcn/components/ui/button';
import ClearIcon from '@mui/icons-material/Clear';

export default function Header({
  conversationTitle,
  selectedPlan,
  setSelectedPlan,
  clearChat
}) {
  return (
    <div className="px-8 py-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {conversationTitle || 'NestWise AI Assistant'}
            </h2>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg">
            <select 
              className="px-4 py-3 bg-transparent border-0 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 appearance-none cursor-pointer"
              value={selectedPlan || ''}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="">🎯 Select plan to edit</option>
              <option value="retirement">🏡 Retirement Plan</option>
              <option value="investment">📈 Investment Plan</option>
              <option value="emergency">💰 Emergency Fund</option>
            </select>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearChat}
          className="bg-white/40 backdrop-blur-sm hover:bg-red-50/80 border-0 rounded-2xl shadow-lg transition-all duration-300 px-4 py-3"
        >
          <ClearIcon className="h-4 w-4 mr-2" />
          <span>Clear Chat</span>
        </Button>
      </div>
    </div>
  );
}