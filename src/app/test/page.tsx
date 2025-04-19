import React from 'react';

function TestComponent() {
  const handleExport = () => {
    const data = { message: 'Hello, world!' };
    const contents = JSON.stringify(data, null, 2);
    const blob = new Blob([contents], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'test-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        console.log(json);
        alert('Imported successfully!');
      } catch {
        alert('Failed to import—invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button onClick={handleExport}>Export</button>
      <input type="file" accept="application/json" onChange={handleImport} />
    </div>
  );
}

export default TestComponent;