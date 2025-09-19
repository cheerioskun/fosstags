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
        <title>placeholder-id</title>
        <style>
        body {
            margin: 0;
            padding: 0;
            background: #faf9f6;
            font-family: "Space Mono", monospace;
        }

        .hidden {
            visibility: hidden;
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

        @media (max-width: 768px) {
            .card {
                width: 80vw;
                height: 80vh;
                max-width: none;
                max-height: none;
            }
        }

        </style>
    </head>
</html>


<body>
    <div class="fullcenter card">
        <div class="card-shader">
            <canvas id="shader-canvas"></canvas>
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
            </div>
        </div>
    </div>
</body>
`;
