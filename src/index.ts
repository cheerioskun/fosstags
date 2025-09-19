import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { nametags } from "./db/schema";
import { eq } from "drizzle-orm";
import { D1Database } from "@cloudflare/workers-types";

export type Env = {
  DB: D1Database;
};
const app = new Hono<{ Bindings: Env }>();

// Serve homepage
app.get("/", async (c) => {
  return c.html(getHomepageHtml());
});

app.get("/:cutesy-id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("cutesy-id");
  console.log("[info] request received for id: ", id);

  const result = await db
    .select()
    .from(nametags)
    .where(eq(nametags.id, id))
    .get();

  // Check if client wants HTML (browser) or JSON (API)
  const acceptsHtml = c.req.header("accept")?.includes("text/html");

  if (!result) {
    if (acceptsHtml) {
      // Serve profile page that will show "not found" message
      return c.html(await getProfileHtml());
    }
    return c.json({ error: "Tag not found" }, 404);
  }

  if (acceptsHtml) {
    // Serve profile page for browsers
    return c.html(await getProfileHtml());
  }

  // Return JSON for API calls
  return c.json(result);
});

async function getProfileHtml(): Promise<string> {
  // In a real deployment, you'd read this from the static file
  // For now, we'll return a simple HTML that fetches the profile via JS
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="pageTitle">FossTags Profile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏷️</text></svg>">
    <meta property="og:title" content="FossTags Profile" id="ogTitle">
    <meta property="og:description" content="Check out this profile on FossTags" id="ogDescription">
    <meta property="og:type" content="profile">
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-lg">
        <div id="loadingState" class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading profile...</p>
        </div>

        <div id="errorState" class="hidden text-center">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="text-6xl mb-4">❓</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Tag Not Found</h1>
                <p class="text-gray-600 mb-4">This nametag hasn't been claimed yet.</p>
                <a href="/" class="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                    Claim a Tag
                </a>
            </div>
        </div>

        <div id="profileState" class="hidden">
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
                <div class="text-6xl mb-4">👋</div>
                <h1 id="profileName" class="text-2xl font-bold text-gray-800 mb-2"></h1>
                <p id="profileEmail" class="text-blue-600 mb-4"></p>
                <p id="profileBio" class="text-gray-700 mb-6 leading-relaxed"></p>

                <div id="socialLinks" class="flex justify-center space-x-4 mb-6">
                </div>

                <div class="text-xs text-gray-500 border-t pt-4">
                    <a href="/" class="hover:text-blue-600 transition duration-200">
                        Powered by FossTags 🏷️
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script>
        async function loadProfile() {
            const pathSegments = window.location.pathname.split('/').filter(Boolean);

            if (pathSegments.length === 0) {
                window.location.href = '/';
                return;
            }

            const identifier = pathSegments[0];

            try {
                const response = await fetch(\`/\${identifier}\`, {
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const profile = await response.json();
                    displayProfile(profile);
                } else {
                    showError();
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                showError();
            }
        }

        function displayProfile(profile) {
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('profileState').classList.remove('hidden');

            document.getElementById('pageTitle').textContent = \`\${profile.name} - FossTags\`;
            document.getElementById('ogTitle').setAttribute('content', \`\${profile.name} - FossTags\`);
            document.getElementById('ogDescription').setAttribute('content', profile.bio);

            document.getElementById('profileName').textContent = profile.name;
            document.getElementById('profileEmail').textContent = profile.email;
            document.getElementById('profileBio').textContent = profile.bio;

            const socialLinks = document.getElementById('socialLinks');
            socialLinks.innerHTML = '';

            if (profile.github) {
                socialLinks.appendChild(createSocialLink(
                    \`https://github.com/\${profile.github}\`,
                    'GitHub',
                    'bg-gray-800 hover:bg-gray-900'
                ));
            }

            if (profile.x) {
                socialLinks.appendChild(createSocialLink(
                    \`https://x.com/\${profile.x}\`,
                    'X',
                    'bg-black hover:bg-gray-800'
                ));
            }

            if (profile.linkedin) {
                socialLinks.appendChild(createSocialLink(
                    \`https://linkedin.com/in/\${profile.linkedin}\`,
                    'LinkedIn',
                    'bg-blue-700 hover:bg-blue-800'
                ));
            }
        }

        function createSocialLink(url, text, classes) {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = \`px-3 py-1 text-white text-sm rounded-md transition duration-200 \${classes}\`;
            link.textContent = text;
            return link;
        }

        function showError() {
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('errorState').classList.remove('hidden');
        }

        loadProfile();
    </script>
</body>
</html>`;
}

app.post("/claim", async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  const { identifier, data } = body;
  if (!identifier || !data) {
    return c.json({ error: "Missing identifier or data" }, 400);
  }

  const { name, email, bio, x, github, linkedin } = data;
  if (!name || !email || !bio) {
    return c.json({ error: "Missing required fields: name, email, bio" }, 400);
  }

  if (bio.length > 100) {
    return c.json({ error: "Bio must be 100 characters or less" }, 400);
  }

  const existing = await db
    .select()
    .from(nametags)
    .where(eq(nametags.id, identifier))
    .get();

  if (existing) {
    return c.json({ error: "Tag already claimed" }, 409);
  }

  await db.insert(nametags).values({
    id: identifier,
    name,
    email,
    bio,
    x,
    github,
    linkedin,
  });

  return c.json({ success: true, identifier });
});

function getHomepageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FossTags - QR Nametag Service</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏷️</text></svg>">
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">🏷️ FossTags</h1>
            <p class="text-gray-600">QR code-based nametag service</p>
        </header>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">How it works</h2>
            <ol class="list-decimal list-inside space-y-2 text-gray-700">
                <li>Create a nametag with a QR code pointing to your unique URL</li>
                <li>Share your QR code - people can scan it to see your profile</li>
                <li>Claim your identifier below to set up your profile</li>
            </ol>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Claim Your Tag</h2>
            <form id="claimForm" class="space-y-4">
                <div>
                    <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">
                        Identifier (e.g., "happy-penguin")
                    </label>
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        required
                        placeholder="your-awesome-tag"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                </div>

                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Your Name"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                </div>

                <div>
                    <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                        Bio * (max 100 characters)
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        required
                        maxlength="100"
                        placeholder="Tell us about yourself..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                    ></textarea>
                    <div class="text-sm text-gray-500 mt-1">
                        <span id="bioCount">0</span>/100 characters
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label for="github" class="block text-sm font-medium text-gray-700 mb-1">
                            GitHub
                        </label>
                        <input
                            type="text"
                            id="github"
                            name="github"
                            placeholder="username"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>

                    <div>
                        <label for="x" class="block text-sm font-medium text-gray-700 mb-1">
                            X (Twitter)
                        </label>
                        <input
                            type="text"
                            id="x"
                            name="x"
                            placeholder="handle"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>

                    <div>
                        <label for="linkedin" class="block text-sm font-medium text-gray-700 mb-1">
                            LinkedIn
                        </label>
                        <input
                            type="text"
                            id="linkedin"
                            name="linkedin"
                            placeholder="profile-name"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>
                </div>

                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                    Claim Tag
                </button>
            </form>

            <div id="message" class="mt-4 p-3 rounded-md hidden"></div>
        </div>
    </div>

    <script>
        const bioTextarea = document.getElementById('bio');
        const bioCount = document.getElementById('bioCount');

        bioTextarea.addEventListener('input', function() {
            bioCount.textContent = this.value.length;
        });

        document.getElementById('claimForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = {
                identifier: formData.get('identifier'),
                data: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    bio: formData.get('bio'),
                    github: formData.get('github') || undefined,
                    x: formData.get('x') || undefined,
                    linkedin: formData.get('linkedin') || undefined
                }
            };

            const messageDiv = document.getElementById('message');

            try {
                const response = await fetch('/claim', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    messageDiv.className = 'mt-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-700';
                    messageDiv.textContent = \`Success! Your tag is now available at: \${window.location.origin}/\${data.identifier}\`;
                    this.reset();
                    bioCount.textContent = '0';
                } else {
                    messageDiv.className = 'mt-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700';
                    messageDiv.textContent = result.error || 'An error occurred';
                }
            } catch (error) {
                messageDiv.className = 'mt-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700';
                messageDiv.textContent = 'Network error. Please try again.';
            }

            messageDiv.classList.remove('hidden');
        });
    </script>
</body>
</html>`;
}

export default app;
