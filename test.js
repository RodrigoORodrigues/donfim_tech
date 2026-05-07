fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

fetch('http://localhost:3000/api/chat', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({text: 'hi'}) })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
