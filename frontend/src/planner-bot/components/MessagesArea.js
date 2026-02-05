import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../shadcn/lib/utils';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function MessagesArea({ safeMessages }) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {safeMessages.map((message, index) => (
          <motion.div
            key={index}
            className={cn(
              "flex items-start space-x-4",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {message.role === 'bot' && (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <SmartToyIcon className="h-6 w-6 text-white" />
              </div>
            )}
            
            <div
              className={cn(
                "max-w-2xl p-5 rounded-3xl shadow-xl backdrop-blur-xl border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
                message.role === 'user'
                  ? "bg-gradient-to-br from-yellow-400/90 to-amber-500/90 text-white border-yellow-300/30"
                  : "bg-white/90 border-gray-200/30 text-gray-800"
              )}
            >
              {message.isThinking ? (
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                  <span className="text-gray-500 font-medium">AI is thinking...</span>
                </div>
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <PersonIcon className="h-6 w-6 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}