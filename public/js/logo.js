var logoText = document.getElementById('logo-text');
    logoText.classList.add('cute-font', 'white-color');

var glowAnimation = document.createElement('style');
    glowAnimation.type = 'css/styles.css';
    glowAnimation.innerHTML = `
        @keyframes glowing {
            0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.7); }
            50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.9); }
            100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.7); }
        }
    `;
    document.head.appendChild(glowAnimation);
    logoText.classList.add('glowing');