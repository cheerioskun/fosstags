export const getCardHtml = ({ data }) =>
  `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
        />
        <title>Hi ${data.id}!</title>
        <style>
        body {
            margin: 0;
            padding: 0;
            background: #faf9f6;
            font-family: "Space Mono", monospace;
        }

        .space-mono-regular {
            font-family: "Space Mono", monospace;
            font-weight: 400;
            font-style: normal;
        }
        .fullcenter {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .card {
            width: 90vw;
            max-width: 400px;
            height: 80vh;
            max-height: 600px;
            background: white;
            border: 3px solid black;
            border-radius: 0;
            display: flex;
            flex-direction: column;
            font-family: "Space Mono", monospace;
        }

        .card-shader {
            width: 100%;
            height: 40%;
            border: none;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card-shader canvas {
            width: 100%;
            height: 100%;
            border: none;
        }

        .card-content {
            padding: 20px;
            height: 60%;
            display: flex;
            flex-direction: column;
            gap: 15px;
            overflow-y: auto;
        }

        .card-row {
            display: flex;
            flex-direction: column;
            gap: 5px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
        }

        .card-row:last-child {
            border-bottom: none;
        }

        .card-label {
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
        }

        .card-value {
            font-weight: 400;
            font-size: 14px;
            color: #000;
            word-wrap: break-word;
        }

        .social-row {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .social-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }

        .social-platform {
            font-weight: 700;
            color: #666;
        }

        .social-handle {
            font-weight: 400;
            color: #000;
        }

        .form-card {
            width: 90vw;
            max-width: 500px;
            background: white;
            border: 3px solid black;
            border-radius: 0;
            padding: 30px;
            font-family: "Space Mono", monospace;
        }

        .form-title {
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
            color: #000;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
        }

        .form-input,
        .form-textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ccc;
            font-family: "Space Mono", monospace;
            font-size: 14px;
            background: #fff;
            box-sizing: border-box;
        }

        .form-input:focus,
        .form-textarea:focus {
            outline: none;
            border-color: #000;
        }

        .form-textarea {
            height: 80px;
            resize: vertical;
        }

        .form-button {
            width: 100%;
            padding: 15px;
            background: #000;
            color: white;
            border: none;
            font-family: "Space Mono", monospace;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
        }

        .form-button:hover {
            background: #333;
        }

        .social-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        #claimed-sorry {
            display: none;
            text-align: center;
            color: #900;
            font-weight: 700;
        }
        #claimed-error {
            display: none;
            text-align: center;
            color: #900;
            font-weight: 700;
            margin-bottom: 15px;
        }

        @media (max-width: 768px) {
            .form-card {
                width: 85vw;
                padding: 20px;
            }

            .social-inputs {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .card {
                width: 80vw;
                height: 80vh;
                max-width: none;
                max-height: none;
            }
        }

        .hidden {
            display: none;
        }
        </style>
    </head>
</html>

<body>
    <div class="fullcenter card">
        <div class="card-shader">
            <canvas id="banner-canvas"></canvas>
        </div>
        <div class="card-content">
            <div class="card-row">
                <div class="card-label">Name</div>
                <div class="card-value">${data.name}</div>
            </div>
            <div class="card-row">
                <div class="card-label">Email</div>
                <div class="card-value">${data.email}</div>
            </div>
            <div class="card-row">
                <div class="card-label">Bio</div>
                <div class="card-value">
                    ${data.bio}
                </div>
            </div>
            <div class="card-row">
                <div class="card-label">Social</div>
                <div class="social-row">
                    <div class="social-item ${data.x ? "" : "hidden"}">
                        <span class="social-platform">x</span>
                        <a target="_blank" rel="noopener noreferrer" href="https://x.com/${data.x}" class="social-handle">@${data.x}</a>
                    </div>
                    <div class="social-item ${data.github ? "" : "hidden"}">
                        <span class="social-platform">github</span>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/${data.github}"class="social-handle">@${data.github}</a>
                    </div>
                    <div class="social-item ${data.linkedin ? "" : "hidden"}">
                        <span class="social-platform">linkedin</span>
                        <a target="_blank" rel="noopener noreferrer" href="https://linkedin.com/in/${data.linkedin}" class="social-handle">${data.linkedin}</a>
                    </div>
                    <div class="social-item ${data.site ? "" : "hidden"}">
                        <span class="social-platform">website</span>
                        <a target="_blank" rel="noopener noreferrer" href="https://${data.site}" class="social-handle">${data.site}</a>
                    </div>
            </div>
        </div>
    </div>
    <script>
    function paintAttractor(canvas, attractorType = "lorenz", options = {}) {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      // Default configuration
      const config = {
        iterations: 50000,
        skipPoints: 100, // Skip initial transient behavior
        pointSize: 1.0,
        alpha: 0.15,
        background: "#000011",
        colorMode: "position", // 'position', 'velocity', 'rainbow', 'single'
        singleColor: "#00ffff",
        centerX: width / 2,
        centerY: height / 2,
        ...options,
      };

      // Attractor definitions
      const attractors = {
        lorenz: {
          params: { sigma: 10, rho: 28, beta: 8 / 3, dt: 0.01, scale: 8 },
          startPoint: [1, 1, 1],
          compute: (x, y, z, p) => [
            p.sigma * (y - x),
            x * (p.rho - z) - y,
            x * y - p.beta * z,
          ],
        },
        rossler: {
          params: { a: 0.2, b: 0.2, c: 5.7, dt: 0.02, scale: 20 },
          startPoint: [1, 0, 0],
          compute: (x, y, z, p) => [-y - z, x + p.a * y, p.b + z * (x - p.c)],
        },
        chen: {
          params: { a: 35, b: 3, c: 28, dt: 0.005, scale: 6 },
          startPoint: [1, 1, 1],
          compute: (x, y, z, p) => [
            p.a * (y - x),
            (p.c - p.a) * x - x * z + p.c * y,
            x * y - p.b * z,
          ],
        },
        aizawa: {
          params: {
            a: 0.95,
            b: 0.7,
            c: 0.6,
            d: 3.5,
            e: 0.25,
            f: 0.1,
            dt: 0.01,
            scale: 60,
          },
          startPoint: [0.1, 0, 0],
          compute: (x, y, z, p) => [
            (z - p.b) * x - p.d * y,
            p.d * x + (z - p.b) * y,
            p.c +
              p.a * z -
              z ** 3 / 3 -
              (x * x + y * y) * (1 + p.e * z) +
              p.f * z * x ** 3,
          ],
        },
        thomas: {
          params: { b: 0.208186, dt: 0.1, scale: 50 },
          startPoint: [0.1, 0, 0],
          compute: (x, y, z, p) => [
            Math.sin(y) - p.b * x,
            Math.sin(z) - p.b * y,
            Math.sin(x) - p.b * z,
          ],
        },
      };

      const attractor = attractors[attractorType];
      if (!attractor) {
        console.error("Unknown attractor type:", attractorType);
        return;
      }

      // Override attractor parameters with any provided options
      const params = { ...attractor.params, ...options };

      // Clear canvas
      ctx.fillStyle = config.background;
      ctx.fillRect(0, 0, width, height);

      // Set up drawing
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = config.alpha;

      // Initialize particle
      let [x, y, z] = attractor.startPoint.slice();

      // Skip transient behavior
      for (let i = 0; i < config.skipPoints; i++) {
        const [dx, dy, dz] = attractor.compute(x, y, z, params);
        x += dx * params.dt;
        y += dy * params.dt;
        z += dz * params.dt;
      }

      // Draw the attractor
      for (let i = 0; i < config.iterations; i++) {
        const [dx, dy, dz] = attractor.compute(x, y, z, params);

        x += dx * params.dt;
        y += dy * params.dt;
        z += dz * params.dt;

        // Project to 2D (simple orthographic projection)
        const screenX = config.centerX + x * params.scale;
        const screenY = config.centerY - y * params.scale; // Flip Y

        // Skip points outside canvas
        if (screenX < 0 || screenX >= width || screenY < 0 || screenY >= height)
          continue;

        // Calculate color
        let color;
        switch (config.colorMode) {
          case "velocity":
            const speed = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const hue = (speed * 50) % 360;
            color = \`hsl(\${hue}, 80%, 60%)\`;
            break;
          case "position":
            const posHue = ((x + y + z) * 20 + 180) % 360;
            color = \`hsl(\${posHue}, 70%, 50%)\`;
            break;
          case "rainbow":
            const rainbowHue = ((i / config.iterations) * 360 + 120) % 360;
            color = \`hsl(\${rainbowHue}, 85%, 55%)\`;
            break;
          case "single":
          default:
            color = config.singleColor;
            break;
        }

        // Draw point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, config.pointSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Convenience function for custom configurations
    function paintCustom() {
      // Seed PRNG with data.id
      let seed = 0;
      for (let i = 0; i < "${data.id}".length; i++) {
        seed = (seed * 31 + "${data.id}".charCodeAt(i)) % 2147483647;
      }
      // Simple seeded random number generator
      function seededRandom() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      }
      // Generate 5 numbers
      const attractorNum = seededRandom();
      const sigmaNum = seededRandom();
      const betaNum = seededRandom();
      const rhoNum = seededRandom();
      const colorNum = seededRandom();
      // Select attractor type (5 options)
      const attractorTypes = ["lorenz", "rossler", "chen", "aizawa", "thomas"];
      const selectedAttractor = attractorTypes[Math.floor(attractorNum * attractorTypes.length)];
      // Generate parameters
      const sigma = 8 + sigmaNum * 20; // 8-28
      const beta = 1 + betaNum * 4; // 1-5
      const rho = 20 + rhoNum * 30; // 20-50
      // Generate scale based on attractor type
      let scale;
      switch (selectedAttractor) {

        case "rossler":
          scale = 12 + seededRandom() * 8; // 12-20
          break;
        case "chen":
          scale = 4 + seededRandom() * 4; // 4-8
          break;
        case "aizawa":
          scale = 40 + seededRandom() * 20; // 40-60
          break;
        case "thomas":
          scale = 30 + seededRandom() * 20; // 30-50
          break;
        default:
          scale = 30;
      }
      // Select color mode
      const colorModes = ["position", "velocity", "rainbow", "single"];
      const selectedColorMode = colorModes[Math.floor(colorNum * colorModes.length)];
      // Example of a beautiful Lorenz with custom settings
      paintAttractor(document.getElementById("banner-canvas"), selectedAttractor, {
        sigma: sigma,
        rho: rho,
        beta: beta,
        iterations: 60000,
        colorMode: selectedColorMode,
        pointSize: 0.4,
        alpha: 0.6,
        scale: scale,
      });
    }
    paintCustom();
    </script>
</body>
`;
