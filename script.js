document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const codeDisplay = document.getElementById("codeDisplay");
  const speedRange = document.getElementById("speedRange");
  const speedValue = document.getElementById("speedValue");
  const themeToggle = document.getElementById("themeToggle");
  const animationMode = document.getElementById("animationMode");
  const codeSample = document.getElementById("codeSample");
  const codeInput = document.getElementById("codeInput");
  const applyCode = document.getElementById("applyCode");
  const playBtn = document.getElementById("playBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const recordBtn = document.getElementById("recordBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const currentFile = document.getElementById("currentFile");
  const body = document.body;
  const editorContainer = document.querySelector(".editor-container");

  // State variables
  let animationSpeed = parseInt(speedRange.value);
  let currentCode = "";
  let originalCode = "";
  let animationPaused = false;
  let animationController = null;
  let currentLanguage = "javascript";
  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;
  let videoBlob = null;

  // Sample code for different languages
  const codeSamples = {
    javascript: `/* JavaScript Demo Code */

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate first 10 Fibonacci numbers
const sequence = [];
for (let i = 0; i < 10; i++) {
  sequence.push(fibonacci(i));
}

console.log("Fibonacci Sequence:", sequence);`,

    python: `# Python Demo Code

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Generate first 10 Fibonacci numbers
sequence = []
for i in range(10):
    sequence.append(fibonacci(i))

print("Fibonacci Sequence:", sequence)`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Example</title>
  <style>
    body { font-family: sans-serif; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { color: #007bff; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>This is a simple HTML example.</p>
  </div>
</body>
</html>`,

    css: `/* CSS Demo Code */

:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
}

body {
  font-family: 'Segoe UI', Tahoma, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0069d9;
}`
  };

  // Initialize
  function init() {
    // Set initial speed display
    updateSpeedDisplay();
    
    // Load default code
    loadCodeSample("javascript");
    
    // Set up event listeners
    setupEventListeners();
  }

  // Update the speed display
  function updateSpeedDisplay() {
    speedValue.textContent = `${animationSpeed}ms`;
  }

  // Set up all event listeners
  function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener("click", toggleTheme);
    
    // Speed range
    speedRange.addEventListener("input", handleSpeedChange);
    
    // Code sample selection
    codeSample.addEventListener("change", handleCodeSampleChange);
    
    // Apply custom code
    applyCode.addEventListener("click", applyCustomCode);
    
    // Animation controls
    playBtn.addEventListener("click", playAnimation);
    pauseBtn.addEventListener("click", pauseAnimation);
    resetBtn.addEventListener("click", resetAnimation);
    
    // Recording controls
    recordBtn.addEventListener("click", toggleRecording);
    downloadBtn.addEventListener("click", downloadVideo);
  }

  // Toggle between light and dark mode
  function toggleTheme() {
    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      themeToggle.textContent = "Light Mode";
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      themeToggle.textContent = "Dark Mode";
    }
  }

  // Handle speed change
  function handleSpeedChange(e) {
    animationSpeed = parseInt(e.target.value);
    updateSpeedDisplay();
  }

  // Handle code sample change
  function handleCodeSampleChange(e) {
    const language = e.target.value;
    loadCodeSample(language);
  }

  // Load a code sample
  function loadCodeSample(language) {
    currentLanguage = language;
    currentFile.textContent = getFileNameForLanguage(language);
    
    // Update code editor language class
    codeDisplay.className = `code-editor language-${getLanguageClass(language)}`;
    
    // Set the code
    originalCode = codeSamples[language];
    codeInput.value = originalCode;
    
    // Reset and display the code
    resetAnimation();
  }

  // Get file name based on language
  function getFileNameForLanguage(language) {
    switch (language) {
      case "javascript": return "script.js";
      case "python": return "main.py";
      case "html": return "index.html";
      case "css": return "style.css";
      default: return "script.js";
    }
  }

  // Get Prism.js language class
  function getLanguageClass(language) {
    switch (language) {
      case "javascript": return "javascript";
      case "python": return "python";
      case "html": return "markup";
      case "css": return "css";
      default: return "javascript";
    }
  }

  // Apply custom code from textarea
  function applyCustomCode() {
    const code = codeInput.value.trim();
    if (code) {
      originalCode = code;
      resetAnimation();
    }
  }

  // Play the animation
  function playAnimation() {
    if (animationPaused) {
      animationPaused = false;
      continueAnimation();
      return;
    }
    
    resetAnimation(false);
    
    const mode = animationMode.value;
    switch (mode) {
      case "character":
        animateCharByChar();
        break;
      case "line":
        animateLineByLine();
        break;
      case "block":
        animateCodeBlock();
        break;
      default:
        animateCharByChar();
    }
  }

  // Pause the animation
  function pauseAnimation() {
    animationPaused = true;
    if (animationController) {
      animationController.abort();
    }
  }

  // Continue animation after pause
  function continueAnimation() {
    const mode = animationMode.value;
    const remainingCode = originalCode.substring(currentCode.length);
    
    switch (mode) {
      case "character":
        animateCharByChar(remainingCode);
        break;
      case "line":
        // For line animation, we need to find where we left off
        const allLines = originalCode.split('\n');
        const currentLines = currentCode.split('\n');
        const remainingLines = allLines.slice(currentLines.length - 1);
        animateLineByLine(remainingLines.join('\n'), currentLines.length - 1);
        break;
      case "block":
        // For block animation, just complete it
        animateCodeBlock();
        break;
    }
  }

  // Reset the animation
  function resetAnimation(clearCode = true) {
    if (animationController) {
      animationController.abort();
    }
    
    animationPaused = false;
    
    if (clearCode) {
      currentCode = "";
      codeDisplay.textContent = "";
      highlightCode();
    }
  }

  // Animate code character by character
  async function animateCharByChar(text = originalCode) {
    animationController = new AbortController();
    const signal = animationController.signal;
    
    try {
      for (let i = 0; i < text.length; i++) {
        if (signal.aborted) {
          return;
        }
        
        currentCode += text[i];
        codeDisplay.textContent = currentCode;
        highlightCode();
        
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Animation error:", err);
      }
    }
  }

  // Animate code line by line
  async function animateLineByLine(text = originalCode, startLineIndex = 0) {
    animationController = new AbortController();
    const signal = animationController.signal;
    
    const lines = text.split('\n');
    
    try {
      if (startLineIndex === 0) {
        currentCode = "";
      }
      
      for (let i = 0; i < lines.length; i++) {
        if (signal.aborted) {
          return;
        }
        
        if (i > 0 || startLineIndex > 0) {
          currentCode += '\n';
        }
        
        currentCode += lines[i];
        codeDisplay.textContent = currentCode;
        highlightCode();
        
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 5));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Animation error:", err);
      }
    }
  }

  // Animate entire code block at once
  function animateCodeBlock() {
    currentCode = originalCode;
    codeDisplay.textContent = currentCode;
    highlightCode();
  }

  // Apply syntax highlighting
  function highlightCode() {
    Prism.highlightElement(codeDisplay);
  }

  // Toggle recording state
  async function toggleRecording() {
    if (!isRecording) {
      // Start recording
      try {
        // Reset recording state
        recordedChunks = [];
        videoBlob = null;
        downloadBtn.disabled = true;
        
        // Check if MediaRecorder is supported
        if (!window.MediaRecorder) {
          alert("Your browser doesn't support the MediaRecorder API. Please try a modern browser like Chrome or Firefox.");
          return;
        }
        
        // Determine supported MIME types
        const mimeTypes = [
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm;codecs=h264,opus',
          'video/webm',
          'video/mp4'
        ];
        
        let selectedMimeType = '';
        for (const mimeType of mimeTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            selectedMimeType = mimeType;
            console.log(`Using MIME type: ${selectedMimeType}`);
            break;
          }
        }
        
        if (!selectedMimeType) {
          alert("No supported video MIME types found in your browser.");
          return;
        }
        
        // Create a canvas for capturing frames
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas); // Temporarily add to document for debugging
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0';
        
        // Set canvas size to match the editor container
        const editorRect = editorContainer.getBoundingClientRect();
        canvas.width = editorRect.width;
        canvas.height = editorRect.height;
        
        const ctx = canvas.getContext('2d');
        
        // Create a stream from the canvas
        const stream = canvas.captureStream(30); // 30 FPS
        
        // Create MediaRecorder with the selected MIME type
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: selectedMimeType,
          videoBitsPerSecond: 2500000 // 2.5 Mbps
        });
        
        // Set up event handlers
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = () => {
          handleRecordingStop();
          document.body.removeChild(canvas); // Remove canvas when done
        };
        
        // Start recording
        mediaRecorder.start(100); // Collect data every 100ms
        
        // Update UI
        isRecording = true;
        recordBtn.textContent = "Stop Recording";
        recordBtn.classList.add("recording");
        
        // Start the animation automatically
        resetAnimation();
        playAnimation();
        
        // Set up a function to capture frames by directly rendering the code
        const captureFrame = () => {
          if (!isRecording) return;
          
          try {
            // Get editor dimensions and styles
            const editorRect = editorContainer.getBoundingClientRect();
            const isDarkMode = body.classList.contains('dark-mode');
            const bgColor = isDarkMode ? '#1e1e1e' : '#ffffff';
            const textColor = isDarkMode ? '#dcdcdc' : '#333333';
            
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw editor header
            const headerHeight = 40;
            ctx.fillStyle = isDarkMode ? '#333' : '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, headerHeight);
            
            // Draw window controls
            const controlColors = ['#ff5f56', '#ffbd2e', '#27c93f'];
            let controlX = 20;
            for (let i = 0; i < 3; i++) {
              ctx.fillStyle = controlColors[i];
              ctx.beginPath();
              ctx.arc(controlX, headerHeight/2, 6, 0, Math.PI * 2);
              ctx.fill();
              controlX += 20;
            }
            
            // Draw filename
            ctx.fillStyle = isDarkMode ? '#ccc' : '#333';
            ctx.font = '14px "Consolas", "Courier New", monospace';
            ctx.fillText(currentFile.textContent, 80, headerHeight/2 + 5);
            
            // Draw the code content
            ctx.font = '16px "Consolas", "Courier New", monospace';
            
            // Get the current code and split into lines
            const lines = currentCode.split('\n');
            const lineHeight = 24;
            const paddingLeft = 20;
            const paddingTop = headerHeight + 20;
            
            // Simple syntax highlighting colors
            const colors = {
              keyword: isDarkMode ? '#569cd6' : '#0000ff',
              string: isDarkMode ? '#ce9178' : '#a31515',
              comment: isDarkMode ? '#6a9955' : '#008000',
              function: isDarkMode ? '#dcdcaa' : '#795e26',
              number: isDarkMode ? '#b5cea8' : '#098658',
              default: isDarkMode ? '#dcdcdc' : '#333333'
            };
            
            // Draw each line
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const y = paddingTop + i * lineHeight;
              
              // Simple syntax highlighting
              if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
                // Comment
                ctx.fillStyle = colors.comment;
                ctx.fillText(line, paddingLeft, y);
              } else {
                // Default color for the line
                ctx.fillStyle = colors.default;
                
                // Check for keywords
                const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'new'];
                let x = paddingLeft;
                const words = line.split(/(\s+|[(){}[\],;.])/);
                
                for (const word of words) {
                  if (keywords.includes(word)) {
                    ctx.fillStyle = colors.keyword;
                  } else if (word.startsWith('"') || word.startsWith("'") || word.startsWith('`')) {
                    ctx.fillStyle = colors.string;
                  } else if (!isNaN(Number(word))) {
                    ctx.fillStyle = colors.number;
                  } else if (word.match(/^[A-Za-z_][A-Za-z0-9_]*\(/)) {
                    ctx.fillStyle = colors.function;
                  } else {
                    ctx.fillStyle = colors.default;
                  }
                  
                  ctx.fillText(word, x, y);
                  x += ctx.measureText(word).width;
                }
              }
            }
            
            // Schedule next frame if still recording
            if (isRecording) {
              requestAnimationFrame(captureFrame);
            }
          } catch (err) {
            console.error("Error capturing frame:", err);
            if (isRecording) {
              requestAnimationFrame(captureFrame);
            }
          }
        };
        
        // Start capturing frames
        captureFrame();
        
      } catch (err) {
        console.error("Error starting recording:", err);
        alert(`Error starting recording: ${err.message}`);
        isRecording = false;
      }
    } else {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        
        // Update UI
        isRecording = false;
        recordBtn.textContent = "Record Video";
        recordBtn.classList.remove("recording");
      }
    }
  }
  
  // Handle data available from MediaRecorder
  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      console.log(`Received data chunk: ${event.data.size} bytes`);
      recordedChunks.push(event.data);
    }
  }
  
  // Handle recording stop
  function handleRecordingStop() {
    console.log(`Recording stopped. Total chunks: ${recordedChunks.length}`);
    
    if (recordedChunks.length === 0) {
      alert("No video data was recorded. Please try again.");
      return;
    }
    
    // Create a blob from the recorded chunks
    try {
      videoBlob = new Blob(recordedChunks, {
        type: recordedChunks[0].type || 'video/webm'
      });
      
      console.log(`Created video blob: ${videoBlob.size} bytes, type: ${videoBlob.type}`);
      
      // Enable download button
      downloadBtn.disabled = false;
      
      // Stop all tracks on the stream
      if (mediaRecorder && mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error("Error creating video blob:", err);
      alert(`Error creating video: ${err.message}`);
    }
  }
  
  // Download the recorded video
  function downloadVideo() {
    if (!videoBlob) {
      alert("No video has been recorded yet.");
      return;
    }
    
    try {
      // Create a URL for the blob
      const url = URL.createObjectURL(videoBlob);
      console.log(`Created URL for blob: ${url}`);
      
      // Create a download link
      const a = document.createElement('a');
      a.style.display = 'none';
      
      // Determine file extension based on MIME type
      let fileExtension = '.webm';
      if (videoBlob.type.includes('mp4')) {
        fileExtension = '.mp4';
      }
      
      a.href = url;
      a.download = `codevid_${currentLanguage}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}${fileExtension}`;
      
      // Add to document, click it, and remove it
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Error downloading video:", err);
      alert(`Error downloading video: ${err.message}`);
    }
  }

  // Load initial code from file
  fetch("code.txt")
    .then(response => response.text())
    .then(text => {
      codeSamples.javascript = text;
      init();
    })
    .catch(err => {
      console.error("Error loading code file:", err);
      init(); // Initialize anyway with default samples
    });
});
