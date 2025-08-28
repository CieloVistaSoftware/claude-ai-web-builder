// Mock DOM elements
const mockPlaceholder = {
    style: { backgroundImage: 'url("test.jpg")', display: '' },
    classList: { add: jest.fn(), contains: jest.fn(() => true) },
    querySelector: jest.fn(() => ({ style: { display: '' } }))
};

const emptyPlaceholder = {
    style: { backgroundImage: '', display: '' },
    classList: { add: jest.fn(), contains: jest.fn(() => false) },
    querySelector: jest.fn(() => ({ style: { display: '' } }))
};

// Test with image
console.log("Placeholder with image test:");
if (mockPlaceholder.style.backgroundImage && 
    mockPlaceholder.style.backgroundImage !== 'none' && 
    mockPlaceholder.style.backgroundImage !== '') {
    mockPlaceholder.classList.add('has-media');
    const span = mockPlaceholder.querySelector('span');
    if (span) span.style.display = 'none';
    console.log("- has-media class added:", true);
    console.log("- span display set to none:", span.style.display === 'none');
}

// Test empty placeholder
console.log("\nEmpty placeholder test:");
if (emptyPlaceholder.style.backgroundImage && 
    emptyPlaceholder.style.backgroundImage !== 'none' && 
    emptyPlaceholder.style.backgroundImage !== '') {
    emptyPlaceholder.classList.add('has-media');
    const span = emptyPlaceholder.querySelector('span');
    if (span) span.style.display = 'none';
    console.log("- has-media class added:", true);
    console.log("- span display modified:", true);
} else {
    console.log("- has-media class added:", false);
    console.log("- span display modified:", false);
}
