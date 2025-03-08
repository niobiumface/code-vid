# CodeVid - Code Animation Engine

CodeVid is a powerful tool for creating beautiful code animations for your videos, tutorials, and presentations. It allows you to animate code appearing character by character, line by line, or as a complete block, with syntax highlighting just like in modern code editors.

## Features

- **Syntax Highlighting**: Uses Prism.js to provide accurate syntax highlighting for multiple languages
- **Multiple Animation Modes**:
  - Character by character
  - Line by line
  - Complete code block
- **Theme Support**:
  - Light mode
  - Dark mode
- **Customizable Speed**: Adjust the animation speed to your preference
- **Multiple Language Support**:
  - JavaScript
  - Python
  - HTML
  - CSS
- **Custom Code Input**: Paste your own code to animate
- **Video Recording**: Record your code animations and download them as video files
- **Responsive Design**: Works on all screen sizes
- **Modern UI**: Clean, intuitive interface with code editor styling

## Getting Started

1. Open `index.html` in your browser
2. Select a code sample from the dropdown or paste your own code
3. Choose an animation mode
4. Adjust the animation speed
5. Click "Play Animation" to start

## Demo Project

The project includes sample code files for different languages:

- JavaScript: `code.txt` (default)
- Python: `samples/python_sample.py`
- HTML: `samples/html_sample.html`
- CSS: `samples/css_sample.css`

## How It Works

CodeVid uses modern JavaScript to animate code appearance with precise timing control. The animation engine can display code character by character, line by line, or as a complete block. Syntax highlighting is applied in real-time using Prism.js.

The UI is designed to mimic modern code editors, with features like:
- Window controls (close, minimize, maximize buttons)
- File name display
- Proper code indentation
- Monospace font
- Syntax coloring

## Customization

You can customize CodeVid by:

1. Modifying the CSS variables in `style.css` to change colors and styling
2. Adding more language samples to the `codeSamples` object in `script.js`
3. Extending the animation modes in the JavaScript code

## Browser Compatibility

CodeVid works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available for any use.
