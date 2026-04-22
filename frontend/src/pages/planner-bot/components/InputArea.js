import * as React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      className="px-6 md:px-8 py-3 md:py-4 mb-[env(keyboard-inset-height,0)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-sm md:max-w-3xl w-full mx-auto"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg p-1.5 md:p-2 border border-white/30"
          whileHover={{
            scale: 1.01,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="flex items-center space-x-1.5 md:space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-white/50 backdrop-blur-sm hover:bg-white/70 rounded-lg md:rounded-xl shadow-sm transition-all duration-300 hover:scale-105 w-10 h-10 md:w-9 md:h-9 flex-shrink-0"
              >
                <AddIcon className="h-4 w-4 md:h-4 md:w-4" />
              </Button>
            </motion.div>

            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            <motion.textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your planning..."
              className="flex-1 resize-none border-0 bg-transparent p-2 focus:outline-none max-h-16 md:max-h-20 placeholder-gray-500 text-base md:text-sm text-center md:text-left self-center mt-1 md:mt-0"
              rows="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileFocus={{
                scale: 1.01,
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
            />

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="icon"
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white rounded-lg md:rounded-xl shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 w-10 h-10 md:w-9 md:h-9 flex-shrink-0"
              >
                <motion.div
                  animate={sending ? { rotate: 360 } : { rotate: 0 }}
                  transition={{
                    duration: 1,
                    repeat: sending ? Infinity : 0,
                    ease: "linear"
                  }}
                >
                  <SendIcon className="h-4 w-4 md:h-4 md:w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}