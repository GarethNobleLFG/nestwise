// Add this to your planDownloadFormatter.js
export const markdownHandlerHTML = {
    // Typography
    p: (text) => `<p style="font-size: 0.875rem; line-height: 1.625; color: #374151; margin-bottom: 0.75rem;">${text}</p>`,
    h1: (text) => `<h1 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 1rem; margin-top: 1.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem;">${text}</h1>`,
    h2: (text) => `<h2 style="font-size: 1.125rem; font-weight: bold; color: #111827; margin-bottom: 0.75rem; margin-top: 1.25rem;">${text}</h2>`,
    h3: (text) => `<h3 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; margin-top: 1rem;">${text}</h3>`,
    h4: (text) => `<h4 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; margin-top: 0.75rem;">${text}</h4>`,
    h5: (text) => `<h5 style="font-size: 0.875rem; font-weight: 500; color: #4b5563; margin-bottom: 0.25rem; margin-top: 0.75rem;">${text}</h5>`,
    h6: (text) => `<h6 style="font-size: 0.75rem; font-weight: 500; color: #6b7280; margin-bottom: 0.25rem; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">${text}</h6>`,

    // Text formatting
    strong: (text) => `<strong style="font-weight: 600; color: #111827;">${text}</strong>`,
    em: (text) => `<em style="font-style: italic; color: #4b5563;">${text}</em>`,

    // Lists
    ul: (items) => `<ul style="list-style-type: disc; list-style-position: inside; margin-left: 1rem; margin-bottom: 1rem; font-size: 0.875rem; color: #374151;">${items}</ul>`,
    ol: (items) => `<ol style="list-style-type: decimal; list-style-position: inside; margin-left: 1rem; margin-bottom: 1rem; font-size: 0.875rem; color: #374151;">${items}</ol>`,
    li: (text) => `<li style="line-height: 1.625; margin-bottom: 0.25rem;">${text}</li>`,

    // Tables
    table: (content) => `<div style="overflow-x: auto; margin: 1rem 0;"><table style="min-width: 100%; background-color: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${content}</table></div>`,
    thead: (content) => `<thead style="background-color: #f9fafb;">${content}</thead>`,
    tbody: (content) => `<tbody style="border-top: 1px solid #e5e7eb;">${content}</tbody>`,
    tr: (content) => `<tr style="border-bottom: 1px solid #e5e7eb;">${content}</tr>`,
    th: (content) => `<th style="padding: 0.5rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.025em; border-bottom: 1px solid #e5e7eb;">${content}</th>`,
    td: (content) => `<td style="padding: 0.5rem 1rem; font-size: 0.875rem; color: #374151; border-bottom: 1px solid #f3f4f6;">${content}</td>`,

    // Links  
    a: (text, href, title = '') => `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title}" style="color: #2563eb; text-decoration: underline; text-decoration-color: #93c5fd; font-weight: 500;">${text}</a>`,

    // Others
    hr: () => `<hr style="margin: 1.5rem 0; border: none; border-top: 1px solid: #d1d5db;">`,
    br: () => `<br style="margin: 0.25rem 0;">`,
    blockquote: (text) => `<blockquote style="border-left: 4px solid #fbbf24; background-color: #fefce8; padding-left: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; margin: 1rem 0; font-style: italic; color: #4b5563; border-radius: 0 0.5rem 0.5rem 0;">${text}</blockquote>`
};