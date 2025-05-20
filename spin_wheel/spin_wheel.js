function generateSegmentColors(n, startColor, endColor) {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  const colors = [];

  for (let i = 0; i < n; i++) {
    const r = Math.round(start.r + ((end.r - start.r) * i) / (n - 1));
    const g = Math.round(start.g + ((end.g - start.g) * i) / (n - 1));
    const b = Math.round(start.b + ((end.b - start.b) * i) / (n - 1));
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }

  return colors;
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}


class SpinWheel {
  constructor(containerId, segments, color) {
    this.container = document.getElementById(containerId);
    this.segments = segments;
    this.angle = 0;
    this.canvasSize = 500;
    this.segmentColors = generateSegmentColors(segments.length+3, color, '#FFFFFF').slice(0, -3);

    this._initUI();
    this._drawWheel();
  }

  _initUI() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
    this.canvas.style.cssText = `
      background-color: #f4f4f2; /* Soft off-white background for the wheel */
      border-radius: 50%;
      border: 3px solid #d1e0d1; /* Light grey-green border */
    `;

    const pointerColor = "#000";
    this.pointer = document.createElement('div');
    this.pointer.className = 'pointer';
    this.pointer.style.cssText = `
      position: relative;
      top: 50%; /* Vertically center the pointer */
      left: ${this.canvasSize / 2}px; /* Horizontally center the pointer */
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-right: 30px solid ${pointerColor};
      z-index: 10;
      transform: translate(-50%, -50%); /* Correctly offset the pointer to ensure it's centered */
    `;

    const buttonColor = this.segmentColors[this.segmentColors.length - 5];
    const buttonHoverColor = this.segmentColors[this.segmentColors.length - 10];
    this.spinBtn = document.createElement('button');
    this.spinBtn.style.cssText = `
      margin-top: 20px;
      padding: 12px 24px;
      font-size: 1.1rem;
      border: none;
      color: white;
      background-color: ${buttonColor};
      border-radius: 12px; /* Softer round corners */
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
    `;
    this.spinBtn.textContent = 'Spin';
    this.spinBtn.addEventListener('click', () => this.spin());

    const style = document.createElement('style');
    style.innerHTML = `
      button:hover {
        background-color: ${buttonColor};
        transform: scale(1.05); /* Slight scale for hover effect */
      }
    `;
    document.head.appendChild(style);

    this.resultDiv = document.createElement('div');
    this.resultDiv.className = 'result';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      padding: 20px; /* Add some padding around the wheel */
    `;

    this.container.appendChild(this.pointer);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.spinBtn);
    this.container.appendChild(this.resultDiv);

    this.ctx = this.canvas.getContext('2d');
  }

  _drawWheel() {
    const ctx = this.ctx;
    const radius = this.canvasSize / 2;
    const anglePerSegment = (2 * Math.PI) / this.segments.length;

    ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

    this.segments.forEach((label, i) => {
      const startAngle = i * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, endAngle);
      ctx.fillStyle = this.segmentColors[i % this.segmentColors.length];
      ctx.fill();
      ctx.stroke();

      // Add label
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'black';
      ctx.font = '14px sans-serif';
      ctx.fillText(label, radius - 10, 5);
      ctx.restore();
    });
  }

  spin() {
    const fullSpins = 5;
    const randomIndex = Math.floor(Math.random() * this.segments.length);
    const anglePerSegment = 360 / this.segments.length;
    const stopAngle = 360 - (randomIndex * anglePerSegment) - (anglePerSegment / 2);

    const finalAngle = (fullSpins * 360) + stopAngle;

    let currentAngle = 0;
    const increment = 20;
    const spinSpeed = 20;

    const animate = () => {
      currentAngle += increment;
      if (currentAngle < finalAngle) {
        this.canvas.style.transform = `rotate(${currentAngle}deg)`;
        requestAnimationFrame(animate);
      } else {
        const selected = this.segments[randomIndex];
        this.resultDiv.textContent = `Result: ${selected}`;
      }
    };

    animate();
  }
}
