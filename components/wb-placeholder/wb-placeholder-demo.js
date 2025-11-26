// Component-specific JS for wb-placeholder-demo
// Handles API demo button actions and avatar color mapping

document.addEventListener('DOMContentLoaded', function () {
  const placeholder = document.getElementById('apiDemo');
  const buttons = document.querySelectorAll('.demo-api-buttons wb-button');

  function setPlaceholder(w, h, color, label) {
    if (placeholder) {
      placeholder.setOptions({ width: w, height: h, color: color, label: label });
    }
  }

  function randomPlaceholder() {
    const colors = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#0ea5e9', '#8b5cf6', '#ec4899'];
    const labels = ['Random', 'Demo', 'Test', 'Sample', 'Placeholder', 'Image'];
    const w = Math.floor(Math.random() * 300) + 200;
    const h = Math.floor(Math.random() * 200) + 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const label = labels[Math.floor(Math.random() * labels.length)];
    setPlaceholder(w, h, color, label);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      switch (btn.getAttribute('data-action')) {
        case 'default':
          setPlaceholder(400, 200, '#6366f1', 'Default');
          break;
        case 'square':
          setPlaceholder(300, 300, '#22c55e', 'Square');
          break;
        case 'wide':
          setPlaceholder(500, 150, '#ef4444', 'Wide');
          break;
        case 'portrait':
          setPlaceholder(200, 300, '#f59e0b', 'Portrait');
          break;
        case 'random':
          randomPlaceholder();
          break;
      }
    });
  });

  // Avatar color mapping and dynamic generation
  const avatarData = [
    { label: 'AA', color: '#a78bfa' },
    { label: 'BB', color: '#8b5cf6' },
    { label: 'CC', color: '#7c3aed' },
    { label: 'DD', color: '#6d28d9' },
    { label: 'EE', color: '#4c1d95' },
    { label: 'FG', color: '#22c55e' },
    { label: 'HI', color: '#f59e0b' },
    { label: 'JK', color: '#ef4444' },
    { label: 'LM', color: '#0ea5e9' },
    { label: 'NO', color: '#ec4899' }
  ];

  const avatarDemo = document.getElementById('avatar-demo');
  const avatarDemoHtml = document.getElementById('avatar-demo-html');
  if (avatarDemo && avatarDemoHtml) {
    let html = '';
    avatarData.forEach(({ label, color }) => {
      const el = document.createElement('wb-placeholder');
      el.setAttribute('width', '60');
      el.setAttribute('height', '60');
      el.setAttribute('color', color);
      el.setAttribute('label', label);
      avatarDemo.appendChild(el);
      html += `&lt;wb-placeholder width="60" height="60" color="${color}" label="${label}"&gt;&lt;/wb-placeholder&gt;\n`;
    });
    avatarDemoHtml.innerHTML = html.trim();
  }
});
