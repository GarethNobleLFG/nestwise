export const markdownHandler = {
    // Typography
    p: ({ children }) => <p className="text-xs md:text-sm lg:text-base leading-relaxed text-gray-700 mb-3 last:mb-0">{children}</p>,
    h1: ({ children }) => <h1 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg mb-4 mt-6 first:mt-0 border-b border-gray-200 pb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg mb-3 mt-5 first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base md:text-lg lg:text-xl font-semibold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg mb-2 mt-4 first:mt-0">{children}</h3>,
    h4: ({ children }) => <h4 className="text-sm md:text-base lg:text-lg font-semibold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg mb-2 mt-3 first:mt-0">{children}</h4>,
    h5: ({ children }) => <h5 className="text-sm md:text-base lg:text-lg font-medium bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg mb-1 mt-3 first:mt-0">{children}</h5>,
    h6: ({ children }) => <h6 className="text-xs md:text-sm lg:text-base font-medium bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg mb-1 mt-2 first:mt-0 uppercase tracking-wide">{children}</h6>,

    // Text formatting
    strong: ({ children }) => <strong className="font-semibold text-gray-700">{children}</strong>,
    em: ({ children }) => <em className="italic bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">{children}</em>,

    // Code and preformatted
    code: ({ children, className }) => {
        const isInline = !className;
        if (isInline) {
            return <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-mono border">{children}</code>;
        }
        return <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed">{children}</code>;
    },
    pre: ({ children }) => <pre className="bg-gray-900 rounded-lg my-4 overflow-hidden shadow-sm border border-gray-200">{children}</pre>,

    // Lists
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-xs md:text-sm lg:text-base text-yellow-500 ml-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-xs md:text-sm lg:text-base text-yellow-500 ml-4">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    // Links
    a: ({ children, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors font-medium"
        >
            {children}
        </a>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-yellow-400 bg-yellow-50 pl-4 py-2 my-4 italic text-gray-600 rounded-r-lg">
            {children}
        </blockquote>
    ),

    // Tables
    table: ({ children }) => (
        <div className="overflow-x-auto my-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">{children}</td>,

    // Images
    img: ({ src, alt }) => (
        <div className="my-4">
            <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
            />
            {alt && <p className="text-xs text-gray-500 mt-1 text-center italic">{alt}</p>}
        </div>
    ),

    // Horizontal rule
    hr: () => <hr className="my-6 border-t border-gray-300" />,

    // Line breaks
    br: () => <br className="my-1" />,

    // Task lists (if supported)
    input: ({ type, checked, disabled }) => {
        if (type === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    className="mr-2 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 focus:ring-2"
                />
            );
        }
        return null;
    },
};