/**
 * Matrix Avatar Generator and Image Filter
 * Converts uploaded images to Matrix-style green phosphor pixel/ascii art
 * and generates procedural Matrix cyber avatars.
 */
class MatrixAvatar {
  /**
   * Generates a procedural default avatar for a developer based on their name & grade
   */
  static generateDefaultAvatar(devName, grade = 'Junior') {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // Dark cyber background
    ctx.fillStyle = '#030a04';
    ctx.fillRect(0, 0, 160, 160);

    // Matrix Grid Pattern
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 160; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 160);
      ctx.stroke();
    }
    for (let y = 0; y < 160; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(160, y);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 152, 152);

    // Cyber Hex Initials
    const initials = devName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'OP';

    ctx.font = 'bold 36px "Orbitron", "Fira Code", monospace';
    ctx.fillStyle = '#00ff41';
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 80, 75);

    // Subtitle
    ctx.shadowBlur = 0;
    ctx.font = '9px "Fira Code", monospace';
    ctx.fillStyle = '#00aa2a';
    ctx.fillText(`// [${grade.toUpperCase()}]`, 80, 120);

    // Corner targeting brackets
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 3;
    // Top Left
    ctx.beginPath(); ctx.moveTo(8, 20); ctx.lineTo(8, 8); ctx.lineTo(20, 8); ctx.stroke();
    // Top Right
    ctx.beginPath(); ctx.moveTo(140, 8); ctx.lineTo(152, 8); ctx.lineTo(152, 20); ctx.stroke();
    // Bottom Left
    ctx.beginPath(); ctx.moveTo(8, 140); ctx.lineTo(8, 152); ctx.lineTo(20, 152); ctx.stroke();
    // Bottom Right
    ctx.beginPath(); ctx.moveTo(140, 152); ctx.lineTo(152, 152); ctx.lineTo(152, 140); ctx.stroke();

    return canvas.toDataURL('image/png');
  }

  /**
   * Applies Matrix Phosphor Green & Pixelation filter to any uploaded user image
   */
  static async filterImageToMatrix(fileOrUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const size = 160;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Draw and crop image to square
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        // Get pixel data
        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;

        // Apply Matrix Monochromatic Green transformation
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Luminance calculation
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

          if (brightness < 40) {
            // Deep Matrix Black/Dark Green
            data[i] = 2;
            data[i + 1] = Math.floor(brightness * 0.4);
            data[i + 2] = 2;
          } else if (brightness > 210) {
            // Bright Matrix Neon Flare
            data[i] = Math.floor(brightness * 0.7);
            data[i + 1] = 255;
            data[i + 2] = Math.floor(brightness * 0.7);
          } else {
            // Vivid Matrix Green Scale
            data[i] = Math.floor(brightness * 0.15);
            data[i + 1] = Math.min(255, Math.floor(brightness * 1.3));
            data[i + 2] = Math.floor(brightness * 0.15);
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Draw Scanlines overlay on avatar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        for (let y = 0; y < size; y += 4) {
          ctx.fillRect(0, y, size, 2);
        }

        // Draw Cyber Neon Frame
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, size - 4, size - 4);

        // Cyber Corners
        ctx.fillStyle = '#00ff41';
        ctx.fillRect(0, 0, 8, 8);
        ctx.fillRect(size - 8, 0, 8, 8);
        ctx.fillRect(0, size - 8, 8, 8);
        ctx.fillRect(size - 8, size - 8, 8, 8);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (err) => reject(err);

      if (typeof fileOrUrl === 'string') {
        img.src = fileOrUrl;
      } else if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(fileOrUrl);
      } else {
        reject(new Error('Invalid image input'));
      }
    });
  }
}

window.MatrixAvatar = MatrixAvatar;

