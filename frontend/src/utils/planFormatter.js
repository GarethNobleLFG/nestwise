// Formats a retirement plan JSON object into readable markdown

export const formatPlanFromJSON = (planData) => {
  // if (typeof planData === 'string') {
  //   // Try to parse if it's a JSON string
  //   try {
  //     planData = JSON.parse(planData);
  //   } catch (e) {
  //     // If it's not valid JSON, return as is
  //     return planData;
  //   }
  // }

  // if (!planData || typeof planData !== 'object') {
  //   return 'Unable to format plan data';
  // }

  let markdown = '';

  // Investment Strategy Section
  if (planData.investment_strategy) {
    markdown += '## Investment Strategy\n';

    markdown += '---\n';

    if (planData.investment_strategy.asset_allocation) {
      markdown += '## Asset Allocation\n';
      const allocation = planData.investment_strategy.asset_allocation;
      markdown += `- **Stocks**: ${allocation.stocks}%\n`;
      markdown += `- **Bonds**: ${allocation.bonds}%\n`;
      markdown += `- **Cash**: ${allocation.cash}%\n`;
      markdown += `- **Other**: ${allocation.other}%\n\n`;
    }

    if (planData.investment_strategy.justification) {
      markdown += `**Rationale**: ${planData.investment_strategy.justification}\n\n`;
    }
  }

  markdown += '---\n';

  // Savings Plan Section
  if (planData.savings_plan && Array.isArray(planData.savings_plan)) {
    markdown += '## Savings Plan\n\n';

    markdown += '| Year | Annual Contribution | Expected Growth | Source |\n';
    markdown += '|------|-------------------|-----------------|--------|\n';

    planData.savings_plan.slice(0, 10).forEach(item => {
      const sources = Array.isArray(item.source) ? item.source.join(', ') : item.source || 'N/A';
      const sourceLink = sources !== 'N/A' ? `[Source](# "${sources}")` : 'N/A';
      markdown += `| ${item.year} | $${item.annual_contribution?.toLocaleString() || 0} | ${item.expected_growth}% | ${sourceLink} |\n`;
    });
    markdown += '\n';
  }

  markdown += '---\n';

  // Risk Assessment Section
  if (planData.risk_assessment) {
    markdown += '## Risk Assessment\n\n';

    if (planData.risk_assessment.inflation) {
      markdown += `**Inflation Risk**: ${planData.risk_assessment.inflation}\n\n`;
    }

    if (planData.risk_assessment.market_volatility) {
      markdown += `**Market Volatility**: ${planData.risk_assessment.market_volatility}\n\n`;
    }

    if (planData.risk_assessment.mitigation_strategy) {
      markdown += `**Mitigation Strategy**: ${planData.risk_assessment.mitigation_strategy}\n\n`;
    }
  }

  markdown += '---\n';

  // Milestones Section
  if (planData.milestones && Array.isArray(planData.milestones)) {
    markdown += '## Retirement Milestones\n\n';

    planData.milestones.forEach(milestone => {
      markdown += `### Age ${milestone.age}\n`;
      markdown += `**Action**: ${milestone.action}\n`;
      markdown += `**Expected Outcome**: ${milestone.expected_outcome}\n\n`;
      if (milestone.source) {
        const sources = Array.isArray(milestone.source) ? milestone.source.join(', ') : milestone.source;
        markdown += `**Source**: ${sources}\n`;
      }
      markdown += '\n';
    });
  }

  markdown += '---\n';

  // Citations Section
  if (planData.citations && Array.isArray(planData.citations)) {
    markdown += '## References & Citations\n\n';

    planData.citations.forEach((citation, index) => {
      markdown += `**${index + 1}**. **${citation.fact}**\n`;
      markdown += `   - *Source: ${citation.source} (Page ${citation.page})*\n\n`;
    });
  }

  // If there's additional content that doesn't fit the schema
  if (markdown === '') {
    // Fallback: just pretty-print the JSON
    markdown = `\`\`\`json\n${JSON.stringify(planData, null, 2)}\n\`\`\``;
  }

  return markdown;
};

// Keep the raw JSON for database storage
