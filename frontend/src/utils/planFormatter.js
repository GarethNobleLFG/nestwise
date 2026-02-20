const formatValue = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') return value.toLocaleString();
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const renderObject = (obj, level = 2) => {
  let md = '';
  const headerPrefix = '#'.repeat(level);

  for (const [key, value] of Object.entries(obj)) {
    const title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Arrays
    if (Array.isArray(value)) {
      md += `${headerPrefix} ${title}\n\n`;

      // Detect table-like objects
      if (value.length && typeof value[0] === 'object') {
        const columns = Object.keys(value[0]);

        // Render table
        md += `| ${columns.join(' | ')} |\n`;
        md += `| ${columns.map(() => '---').join(' | ')} |\n`;

        value.forEach(row => {
          const rowValues = columns.map(col => formatValue(row[col]));
          md += `| ${rowValues.join(' | ')} |\n`;
        });
        md += '\n';
      } 
      else {
        // Bullet list
        value.forEach(item => {
          if (typeof item === 'object') {
            md += renderObject(item, level + 1);
          } else {
            md += `- ${formatValue(item)}\n`;
          }
        });
        md += '\n';
      }
    }

    // Nested object
    else if (typeof value === 'object' && value !== null) {
      md += `${headerPrefix} ${title}\n\n`;
      md += renderObject(value, level + 1);
    }

    // Primitive values
    else {
      md += `**${title}:** ${formatValue(value)}\n\n`;
    }
  }

  return md;
};

export const formatPlanFromJSON = (planData) => {
  // Parse string JSON safely
  if (typeof planData === 'string') {
    try {
      planData = JSON.parse(planData);
    } catch {
      return planData; // already markdown/text
    }
  }

  if (!planData || typeof planData !== 'object') {
    return '⚠️ Unable to format plan data.';
  }

  // Auto unwrap common wrappers
  if (planData.plan) planData = planData.plan;
  if (planData.data) planData = planData.data;
  if (planData.retirement_plan) planData = planData.retirement_plan;

  let markdown = `# 🧠 Personalized Financial Plan\n\n`;
  markdown += renderObject(planData);

  return markdown;
};

export const extractRawPlanJSON = (planData) => {
  if (typeof planData === 'string') {
    try {
      return JSON.parse(planData);
    } catch {
      return null;
    }
  }
  return planData;
};