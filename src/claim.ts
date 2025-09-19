export const getClaimHtml = ({ data }) =>
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
        <title>Claim Your Nametag</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background: #faf9f6;
                font-family: "Space Mono", monospace;
            }

            .fullcenter {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
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
        </style>
    </head>
    <body>
        <div class="fullcenter">
            <div class="form-card">
                <h1 class="form-title">Claim Your Nametag</h1>
                <h1 class="form-title">${data.id}</h1>
                <form id="claim-form">
                    <div class="form-group">
                        <label class="form-label" for="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-input"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            class="form-input"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="bio">Bio * </label>
                        <textarea
                            id="bio"
                            name="bio"
                            class="form-textarea"
                            placeholder="Tell us a bit about yourself..."
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Social (optional)</label>
                        <div class="social-inputs">
                            <div>
                                <input
                                    type="text"
                                    id="x"
                                    name="x"
                                    class="form-input"
                                    placeholder="X username (without @)"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="github"
                                    name="github"
                                    class="form-input"
                                    placeholder="GitHub username"
                                />
                            </div>
                        </div>
                        <div style="margin-top: 15px">
                            <input
                                type="text"
                                id="linkedin"
                                name="linkedin"
                                class="form-input"
                                placeholder="LinkedIn profile without url (e.g., john-doe)"
                            />
                        </div>
                    </div>
                    <div id="claimed-error">
                        there was an error, are the required fields filled in?
                    </div>
                    <button type="submit" class="form-button">Claim</button>
                </form>
                <div id="claimed-sorry">
                    <p>
                        someone had faster fingers! This tag got claimed, try
                        scanning another one
                    </p>
                </div>
            </div>
        </div>

        <script>
            document
                .getElementById("claim-form")
                .addEventListener("submit", function (e) {
                    e.preventDefault();

                    const formData = new FormData(e.target);
                    let data = Object.fromEntries(formData);
                    data.id = "${data.id}";
                    fetch("/api/claim", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    })
                        .then((response) => {
                            if (response.ok) {
                                window.location.href = \`/${data.id}\`;
                            } else {
                                document.getElementById(
                                    "claim-form",
                                ).style.display = "none";
                                document.getElementById(
                                    "claimed-sorry",
                                ).style.display = "block";
                            }
                        })
                        .catch((error) => {
                            document.getElementById(
                                "claimed-error",
                            ).style.display = "block";
                        });
                });
        </script>
    </body>
</html>
`;
