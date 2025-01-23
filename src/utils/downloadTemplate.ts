import { saveAs } from 'file-saver';

export const downloadTemplate = (templateName: string, htmlContent: string) => {
  const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateName}</title>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

  const blob = new Blob([completeHTML], { type: 'text/html' });
  saveAs(blob, `${templateName || 'email-template'}.html`);
};
