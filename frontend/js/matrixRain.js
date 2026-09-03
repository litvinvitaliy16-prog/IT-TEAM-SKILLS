/**
 * Matrix Digital Rain Canvas Animation
 */
class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Japanese Katakana + Latin + Numbers + Math symbols for authentic Matrix look
    this.characters = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF$+-*/=%<>&|~#@';
    this.fontSize = 15;
    this.columns = 0;
    this.drops = [];
    this.speeds = [];
    this.isRunning = true;
    this.speedFactor = 1.0;
    this.lastFrameTime = 0;
    this.interval = 40; // ~25-30 fps for authentic smooth matrix look

    this.init();
    window.addEventListener('resize', () => this.resize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  init() {
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    this.speeds = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -50); // Start at staggered heights
      this.speeds[i] = 0.5 + Math.random() * 0.8; // Varied subtle speeds
    }
  }

  setSpeed(factor) {
    this.speedFactor = factor;
  }

  toggle(running) {
    this.isRunning = running !== undefined ? running : !this.isRunning;
  }

  animate(currentTime) {
    if (!this.isRunning) {
      requestAnimationFrame(this.animate);
      return;
    }

    if (!this.lastFrameTime) this.lastFrameTime = currentTime;
    const delta = currentTime - this.lastFrameTime;

    if (delta > this.interval / this.speedFactor) {
      this.lastFrameTime = currentTime;
      
      // Fade out trailing characters with semi-transparent black
      this.ctx.fillStyle = 'rgba(5, 11, 6, 0.12)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.font = `${this.fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < this.drops.length; i++) {
        const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        const x = i * this.fontSize;
        const y = this.drops[i] * this.fontSize;

        // Leading character is bright white-green, body is neon green
        if (Math.random() > 0.85) {
          this.ctx.fillStyle = '#b8ffc8'; // Bright head glow
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = '#00ff41';
        } else {
          this.ctx.fillStyle = '#00ff41'; // Matrix neon
          this.ctx.shadowBlur = 0;
        }

        if (y > 0 && y < this.canvas.height + 50) {
          this.ctx.fillText(char, x, y);
        }

        // Reset drop when past screen
        if (y > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }

        this.drops[i] += this.speeds[i];
      }
    }

    requestAnimationFrame(this.animate);
  }
}

window.MatrixRain = MatrixRain;

