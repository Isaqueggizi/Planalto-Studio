import { GoogleGenAI, Type } from "@google/genai";
import type { AppConfig, ProjectFiles } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const appConfigSchema = {
  type: Type.OBJECT,
  properties: {
    appName: { type: Type.STRING, description: "A creative and fitting name for the app." },
    description: { type: Type.STRING, description: "A one-sentence description of the app's purpose." },
    colorPalette: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "Primary color hex code (e.g., #1E90FF)." },
        secondary: { type: Type.STRING, description: "Secondary color hex code (e.g., #FFD700)." },
        background: { type: Type.STRING, description: "Background color hex code (e.g., #0D0D0D)." },
        text: { type: Type.STRING, description: "Text color hex code (e.g., #FFFFFF)." },
      },
      required: ["primary", "secondary", "background", "text"],
    },
    screens: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the app screen (e.g., 'Home Feed')." },
          description: { type: Type.STRING, description: "A brief description of the screen's function." },
          icon: { type: Type.STRING, description: "A single, relevant keyword for an icon for this screen (e.g., 'home', 'user', 'settings')." },
          components: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of UI components on this screen (e.g., 'Recipe Card', 'Search Bar')."
          },
        },
        required: ["name", "description", "icon", "components"],
      },
    },
  },
  required: ["appName", "description", "colorPalette", "screens"],
};

export const generateAppConfig = async (prompt: string): Promise<AppConfig> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a detailed app configuration based on this user request: "${prompt}"`,
      config: {
        systemInstruction: "You are an expert AI application architect. Your task is to take a user's high-level app description and break it down into a structured JSON configuration. This configuration will be used to automatically generate the application. Be creative and logical in your design. Ensure the icon keywords are simple and one word.",
        responseMimeType: "application/json",
        responseSchema: appConfigSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedConfig: AppConfig = JSON.parse(jsonString);
    return parsedConfig;
  } catch (error) {
    console.error("Error generating app config:", error);
    throw new Error("Failed to get a valid configuration from the AI model.");
  }
};

const projectFilesSchema = {
    type: Type.OBJECT,
    properties: {
        "index.html": { type: Type.STRING, description: "The complete, self-contained HTML file content with embedded CSS and React JSX." },
    },
    required: ["index.html"],
};

export const generateProjectFiles = async (config: AppConfig): Promise<ProjectFiles> => {
    const prompt = `
    Based on the following JSON configuration, generate a single, self-contained, runnable HTML file.

    **Instructions:**
    1.  **Single File Output:** The output must be a single JSON object with one key: \`index.html\`. The value will be the complete string content of the HTML file.
    2.  **HTML Structure:**
        -   Create a standard HTML5 boilerplate.
        -   In the \`<head>\`:
            -   Include a \`<title>\` using the app name from the config.
            -   Include the Tailwind CSS CDN: <script src="https://cdn.tailwindcss.com"></script>.
            -   Include React, ReactDOM, and Babel Standalone CDNs.
            -   Embed ALL CSS inside a single \`<style>\` tag.
        -   In the \`<body>\`:
            -   Include a \`<div id="root"></div>\`.
            -   Embed ALL JavaScript/React code inside a single \`<script type="text/babel">\` tag right before the closing \`</body>\` tag.
    3.  **CSS (\`<style>\` tag):**
        -   Start with a modern CSS reset to ensure browser consistency.
        -   Define CSS variables for the color palette from the config in the \`:root\` selector. For example: \`--primary: ${config.colorPalette.primary};\`.
        -   Add beautiful, subtle base styles, like a smooth scroll behavior and a body background color using the \`--background\` variable.
    4.  **JavaScript (\`<script type="text/babel">\` tag):**
        -   This script will contain the entire React application. Use functional components and hooks (useState is essential for navigation).
        -   Create a main \`App\` component that orchestrates the layout.
        -   The layout must have a header showing the current screen name and a fixed bottom navigation bar for switching screens.
        -   The bottom navigation bar must be fully functional. Use \`useState\` to track the \`activeScreen\`. Clicking a nav item should update this state. The active icon should be styled differently.
        -   The main content area should conditionally render the component for the \`activeScreen\` and have appropriate padding.
        -   Create separate, well-structured components for each screen defined in the config (e.g., \`HomeScreen\`, \`ProfileScreen\`).
        -   Populate each screen component with high-quality, visually appealing placeholder content that matches the config's components list. Use varied and realistic content. Use placeholder images from services like picsum.photos.
        -   Create a generic, reusable \`Icon\` component that takes an \`iconName\` prop and returns an inline SVG based on the keyword. It should be stylish and handle unknown icons gracefully (e.g., return a default circle icon).
        -   Use Tailwind CSS classes for all styling. Use the CSS variables defined in \`styles.css\` for colors (e.g., \`bg-[--primary]\`, \`text-[--text]\`).
        -   The code must be clean, well-structured, production-quality, and include helpful comments explaining key parts.
        -   Add smooth transitions when changing screens.
        -   End the script with \`ReactDOM.render(<App />, document.getElementById('root'));\`.
    5.  **Final Output:**
        -   Respond with ONLY the raw JSON object containing the \`"index.html"\` key and its content. Do not add any explanations or markdown backticks.

    **JSON Configuration:**
    \`\`\`json
    ${JSON.stringify(config, null, 2)}
    \`\`\`
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: projectFilesSchema,
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating app code:", error);
    throw new Error("Failed to get a valid code from the AI model.");
  }
};