// Demo Viewer JS
// Extracted from demo-viewer.html

// Demo Viewer Logic

// Path to the manifest file
const manifestPath = '../demos-manifest.json';

// DOM elements
const demoList = document.getElementById('demo-list');
const demoFrame = document.getElementById('demo-frame');

// Fetch and render demo list
fetch(manifestPath)
  .then(response => response.json())
  .then(data => {
    if (!data.demos || !Array.isArray(data.demos)) {
      demoList.innerHTML = '<div style="color:red">No demos found in manifest.</div>';
      return;
    }
    // Create nav list
    demoList.innerHTML = '';
    const nav = document.createElement('ul');
    nav.style.listStyle = 'none';
    nav.style.padding = '0';
    nav.style.margin = '0';
    data.demos.forEach(demo => {
      const li = document.createElement('li');
      li.style.marginBottom = '8px';
      const btn = document.createElement('button');
      btn.textContent = demo.name;
      btn.style.width = '100%';
      btn.style.textAlign = 'left';
      btn.style.padding = '8px';
      btn.style.background = '#222';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.onmouseover = () => btn.style.background = '#444';
      btn.onmouseout = () => btn.style.background = '#222';
      btn.onclick = () => {
        demoFrame.src = demo.url;
      };
      li.appendChild(btn);
      nav.appendChild(li);
    });
    demoList.appendChild(nav);
  })
  .catch(err => {
    demoList.innerHTML = `<div style="color:red">Error loading manifest: ${err}</div>`;
  });
