import { formatPlanFromJSON } from './planFormatter';
import { markdownHandlerHTML } from './markdownHandlerHtml';

// Updated function to use your HTML handlers
const convertMarkdownToHTML = (markdown) => {
    return markdown
        .replace(/^### (.*$)/gm, (_, text) => markdownHandlerHTML.h3(text))
        .replace(/^## (.*$)/gm, (_, text) => markdownHandlerHTML.h2(text))
        .replace(/^# (.*$)/gm, (_, text) => markdownHandlerHTML.h1(text))
        .replace(/\*\*(.*?)\*\*/g, (_, text) => markdownHandlerHTML.strong(text))
        .replace(/^- (.*$)/gm, (_, text) => markdownHandlerHTML.li(text))
        .replace(/^---$/gm, markdownHandlerHTML.hr())
        .replace(/\n/g, '<br>');
};

export const downloadPlanUtil = async (planData) => {
    if (!planData?.data) {
        console.error('No plan data available for download');
        return;
    }

    try {
        // Convert plan data to markdown
        const markdownContent = formatPlanFromJSON(planData.data);
        
        // Convert markdown to HTML for PDF generation
        const htmlContent = `
            <html>
            <head>
                <title>${planData.name || 'Retirement Plan'}</title>
            </head>
            <body>
                <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
                    ${convertMarkdownToHTML(markdownContent)}
                </div>
            </body>
            </html>
        `;

        // Generate PDF using html2pdf
        const opt = {
            margin: 1,
            filename: `${planData.name || 'retirement-plan'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Use html2pdf to generate and download
        const { default: html2pdf } = await import('html2pdf.js');
        html2pdf().from(htmlContent).set(opt).save();

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
};
