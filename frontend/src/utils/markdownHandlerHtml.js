const markdownHandlerHTML = {
    // Typography with page break control
    h1: (text) => `<h1 style="font-size: 24px; font-weight: bold; margin: 20px 0 15px 0; border-bottom: 1px solid #ddd; page-break-inside: avoid; break-inside: avoid;">${text}</h1>`,
    h2: (text) => `<h2 style="font-size: 20px; font-weight: bold; margin: 15px 0 10px 0; page-break-inside: avoid; break-inside: avoid;">${text}</h2>`,
    h3: (text) => `<h3 style="font-size: 18px; font-weight: 600; margin: 12px 0 8px 0; page-break-inside: avoid; break-inside: avoid;">${text}</h3>`,
    p: (text) => `<p style="font-size: 14px; line-height: 1.6; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">${text}</p>`,

    // Text formatting
    strong: (text) => `<strong style="font-weight: bold; page-break-inside: avoid; break-inside: avoid;">${text}</strong>`,
    em: (text) => `<em style="font-style: italic; page-break-inside: avoid; break-inside: avoid;">${text}</em>`,

    // Lists
    ul: (items) => `<ul style="margin: 10px 0; padding-left: 20px; page-break-inside: avoid; break-inside: avoid;">${items}</ul>`,
    li: (text) => `<li style="margin: 3px 0; page-break-inside: avoid; break-inside: avoid;">${text}</li>`,

    // Tables
    table: (content) => `<table style="width: 100%; border-collapse: collapse; margin: 15px 0; page-break-inside: avoid; break-inside: avoid;">${content}</table>`,
    thead: (content) => `<thead style="background: #f5f5f5; page-break-inside: avoid; break-inside: avoid;">${content}</thead>`,
    tbody: (content) => `<tbody style="page-break-inside: avoid; break-inside: avoid;">${content}</tbody>`,
    tr: (content) => `<tr style="page-break-inside: avoid; break-inside: avoid;">${content}</tr>`,
    th: (content) => `<th style="padding: 8px; border: 1px solid #ddd; font-weight: bold; page-break-inside: avoid; break-inside: avoid;">${content}</th>`,
    td: (content) => `<td style="padding: 8px; border: 1px solid #ddd; page-break-inside: avoid; break-inside: avoid;">${content}</td>`,

    // Others
    hr: () => `<hr style="margin: 20px 0; border: 1px solid #ddd; page-break-inside: avoid; break-inside: avoid;">`,
    br: () => `<br style="page-break-inside: avoid; break-inside: avoid;">`,
    blockquote: (text) => `<blockquote style="border-left: 3px solid #ffa500; padding: 10px; margin: 15px 0; background: #fafafa; page-break-inside: avoid; break-inside: avoid;">${text}</blockquote>`
};

// Converts markdown to the HMTL component definitions above.
export const convertMarkdownToHTML = (markdown) => {
    let html = markdown;

    // Handle tables first
    html = html.replace(/(\|.*\|.*\n\|[-:\s|]+\|\n(?:\|.*\|.*\n)*)/gm, (tableMatch) => {
        const lines = tableMatch.trim().split('\n');
        const headerLine = lines[0];
        const separatorLine = lines[1];
        const dataLines = lines.slice(2);

        // Parse header
        const headers = headerLine.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        const headerHTML = headers.map(header => markdownHandlerHTML.th(header)).join('');
        const theadHTML = markdownHandlerHTML.thead(markdownHandlerHTML.tr(headerHTML));

        // Parse data rows
        const rowsHTML = dataLines.map(line => {
            const cells = line.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
            const cellsHTML = cells.map(cell => markdownHandlerHTML.td(cell)).join('');
            return markdownHandlerHTML.tr(cellsHTML);
        }).join('');
        const tbodyHTML = markdownHandlerHTML.tbody(rowsHTML);

        return markdownHandlerHTML.table(theadHTML + tbodyHTML);
    });

    // Handle other markdown elements.
    html = html
        .replace(/^### (.*$)/gm, (_, text) => markdownHandlerHTML.h3(text))
        .replace(/^## (.*$)/gm, (_, text) => markdownHandlerHTML.h2(text))
        .replace(/^# (.*$)/gm, (_, text) => markdownHandlerHTML.h1(text))
        .replace(/\*\*(.*?)\*\*/g, (_, text) => markdownHandlerHTML.strong(text))
        .replace(/^- (.*$)/gm, (_, text) => markdownHandlerHTML.li(text))
        .replace(/^---$/gm, markdownHandlerHTML.hr())
        .replace(/\n/g, '<br>');

    return html;
};