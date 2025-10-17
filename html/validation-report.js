// Extracted from validation-report.html
// This file should be imported as a module in the HTML

async function loadReport() {
  try {
    const response = await fetch('validation-report.txt');
    if (!response.ok) throw new Error('Report not found. Run validation first.');
    const text = await response.text();
    document.getElementById('report-output').textContent = text;
    // Try to extract summary
    const errorMatch = text.match(/(\d+) validation errors/);
    const warnMatch = text.match(/(\d+) warnings/);
    let summary = '';
    if (errorMatch) summary += `<span class="error">${errorMatch[1]} errors</span> `;
    if (warnMatch) summary += `<span class="warning">${warnMatch[1]} warnings</span>`;
    if (!summary) summary = 'No summary found.';
    document.getElementById('summary').innerHTML = summary;
  } catch (e) {
    document.getElementById('report-output').textContent = e.message;
    document.getElementById('summary').textContent = 'Failed to load report.';
  }
}
