// wb-show-htmlfiles.js
// Web Component: <wb-show-htmlfiles>
// Lists all .html files in components/ by most recently updated
// Clicking an item opens the file in a new tab

class WbShowHtmlfiles extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.fileList = [];
  }

  async connectedCallback() {
    try {
      const res = await fetch('./files.json');
      this.fileList = await res.json();
    } catch (e) {
      this.fileList = [];
      this.shadowRoot.innerHTML = '<div style="color:red">Could not load files.json</div>';
      return;
    }
    this.render();
  }

  render() {
    const style = `<style>
      :host { background: #181a20; color: #e0e0e0; font-family: 'Segoe UI', Arial, sans-serif; height: 100%; display: block; }
      ul { list-style: none; padding: 0; margin: 0; }
      li {
        margin: 0.5em 0.5em;
        padding: 0.75em 1em;
        background: #23262e;
        border: none;
        border-radius: 8px;
        color: #e0e0e0;
        font-size: 1em;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        box-shadow: 0 1px 4px 0 #0002;
        display: flex;
        align-items: center;
        gap: 0.5em;
      }
      li:hover {
        background: #2d313a;
        box-shadow: 0 2px 8px 0 #0004;
      }
      .path {
        font-size: 0.85em;
        color: #888;
        margin-left: auto;
        opacity: 0.7;
      }
      .date {
        font-size: 0.8em;
        color: #666;
        margin-left: 1em;
        opacity: 0.6;
      }
    </style>`;
    const items = this.fileList.map((f, idx) =>
      `<li data-url="${f.url}" data-idx="${idx}">
        <span>${f.name}</span>
        <span class='path'>${f.relPath}</span>
        <span class='date'>${new Date(f.lastModified).toLocaleString()}</span>
      </li>`
    ).join('');
    this.shadowRoot.innerHTML = `${style}<ul>${items}</ul>`;
    // Add click listeners to each item
    this.shadowRoot.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', e => {
        const url = li.getAttribute('data-url');
        this.dispatchEvent(new CustomEvent('file-selected', {
          detail: { url },
          bubbles: true,
          composed: true
        }));
      });
    });
  }
}

customElements.define('wb-show-htmlfiles', WbShowHtmlfiles);
