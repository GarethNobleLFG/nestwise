// Simple typing animation utility
export const typeText = (text, onUpdate) => {
  const chunkSize = Math.ceil(text.length / 75);
  let i = 0;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      i += chunkSize;
      const partialText = text.slice(0, i);
      
      onUpdate(partialText);

      if (i >= text.length) {
        clearInterval(interval);
        resolve(text);
      }
    }, 100);
  });
};