export const downloadPlanUtil = async (planData) => {
    if (!planData?.data) {
        console.error('No plan data available for download');
        return;
    }

    try {
        const pdfMake = await import('pdfmake/build/pdfmake');
        const pdfFonts = await import('pdfmake/build/vfs_fonts');
        pdfMake.default.vfs = pdfFonts.default;

        // Define PDF document structure in JSON
        const docDefinition = {
            content: [
                // Header
                { text: planData.name || 'Retirement Plan', style: 'header' },
                { text: `Generated on ${new Date().toLocaleDateString()}`, style: 'subheader' },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2, lineColor: '#f59e0b' }] },
                { text: '\n' },

                // Investment Strategy
                ...(planData.data.investment_strategy ? [
                    { text: 'Investment Strategy', style: 'sectionHeader' },
                    ...(planData.data.investment_strategy.asset_allocation ? [
                        { text: 'Asset Allocation', style: 'subSectionHeader' },
                        {
                            ul: [
                                `Stocks: ${planData.data.investment_strategy.asset_allocation.stocks}%`,
                                `Bonds: ${planData.data.investment_strategy.asset_allocation.bonds}%`,
                                `Cash: ${planData.data.investment_strategy.asset_allocation.cash}%`,
                                `Other: ${planData.data.investment_strategy.asset_allocation.other}%`
                            ],
                            margin: [0, 0, 0, 10]
                        }
                    ] : []),
                    ...(planData.data.investment_strategy.justification ? [
                        { text: [{ text: 'Rationale: ', bold: true }, planData.data.investment_strategy.justification], margin: [0, 0, 0, 15] }
                    ] : []),
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#e5e7eb' }], margin: [0, 10, 0, 10] }
                ] : []),

                // Savings Plan Table
                ...(planData.data.savings_plan ? [
                    { text: 'Savings Plan', style: 'sectionHeader' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', '*', '*', '*'],
                            body: [
                                [
                                    { text: 'Year', style: 'tableHeader' },
                                    { text: 'Annual Contribution', style: 'tableHeader' },
                                    { text: 'Expected Growth', style: 'tableHeader' },
                                    { text: 'Source', style: 'tableHeader' }
                                ],
                                ...planData.data.savings_plan.slice(0, 10).map(item => [
                                    item.year?.toString() || '',
                                    `$${item.annual_contribution?.toLocaleString() || 0}`,
                                    `${item.expected_growth || 0}%`,
                                    Array.isArray(item.source) ? item.source.join(', ') : item.source || 'N/A'
                                ])
                            ]
                        },
                        style: 'tableStyle'
                    },
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#e5e7eb' }], margin: [0, 10, 0, 10] }
                ] : []),

                // Risk Assessment
                ...(planData.data.risk_assessment ? [
                    { text: 'Risk Assessment', style: 'sectionHeader' },
                    ...(planData.data.risk_assessment.inflation ? [
                        { text: [{ text: 'Inflation Risk: ', bold: true }, planData.data.risk_assessment.inflation], margin: [0, 0, 0, 8] }
                    ] : []),
                    ...(planData.data.risk_assessment.market_volatility ? [
                        { text: [{ text: 'Market Volatility: ', bold: true }, planData.data.risk_assessment.market_volatility], margin: [0, 0, 0, 8] }
                    ] : []),
                    ...(planData.data.risk_assessment.mitigation_strategy ? [
                        { text: [{ text: 'Mitigation Strategy: ', bold: true }, planData.data.risk_assessment.mitigation_strategy], margin: [0, 0, 0, 15] }
                    ] : []),
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#e5e7eb' }], margin: [0, 10, 0, 10] }
                ] : []),

                // Retirement Milestones
                ...(planData.data.milestones ? [
                    { text: 'Retirement Milestones', style: 'sectionHeader' },
                    ...planData.data.milestones.map(milestone => [
                        { text: `Age ${milestone.age}`, style: 'milestoneHeader' },
                        { text: [{ text: 'Action: ', bold: true }, milestone.action], margin: [10, 0, 0, 5] },
                        { text: [{ text: 'Expected Outcome: ', bold: true }, milestone.expected_outcome], margin: [10, 0, 0, 5] },
                        ...(milestone.source ? [
                            { text: [{ text: 'Source: ', bold: true }, Array.isArray(milestone.source) ? milestone.source.join(', ') : milestone.source], margin: [10, 0, 0, 10] }
                        ] : [{ text: '', margin: [0, 0, 0, 10] }])
                    ]).flat(),
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#e5e7eb' }], margin: [0, 10, 0, 10] }
                ] : []),

                // References & Citations
                ...(planData.data.citations ? [
                    { text: 'References & Citations', style: 'sectionHeader' },
                    {
                        ol: planData.data.citations.map((citation, index) => [
                            { text: citation.fact, bold: true },
                            { text: `Source: ${citation.source} (Page ${citation.page})`, italics: true, margin: [15, 2, 0, 8] }
                        ]).flat()
                    }
                ] : [])
            ],

            styles: {
                header: { fontSize: 24, bold: true, alignment: 'center', margin: [0, 0, 0, 10], color: '#1f2937' },
                subheader: { fontSize: 12, alignment: 'center', margin: [0, 0, 0, 20], color: '#6b7280' },
                sectionHeader: { fontSize: 18, bold: true, margin: [0, 20, 0, 15], color: '#1f2937' },
                subSectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 8], color: '#374151' },
                milestoneHeader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5], color: '#374151' },
                tableStyle: { margin: [0, 10, 0, 15] },
                tableHeader: { bold: true, fillColor: '#f3f4f6', color: '#374151' }
            },

            defaultStyle: {
                fontSize: 11,
                lineHeight: 1.4
            }
        };

        // Generate and download PDF
        pdfMake.default.createPdf(docDefinition).download(`${planData.name || 'retirement-plan'}.pdf`);
    } 
    catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
};