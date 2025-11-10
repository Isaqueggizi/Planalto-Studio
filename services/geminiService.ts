import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { AppConfig, ProjectFiles } from '../types';

// Helper function to validate the API key format.
const isApiKeyValid = (apiKey: string | null): apiKey is string => {
  return !!apiKey && apiKey.startsWith('AIzaSy') && apiKey.length > 30;
};

// Centralized function to get the AI instance or throw a specific error.
const getAiInstance = (apiKey: string) => {
  if (!isApiKeyValid(apiKey)) {
    throw new Error("API Key is not valid. Please check your key in the settings.");
  }
  return new GoogleGenAI({ apiKey });
};

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

export const generateAppConfig = async (prompt: string, apiKey: string): Promise<AppConfig> => {
  let response: GenerateContentResponse;
  try {
    const ai = getAiInstance(apiKey);
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Generate a detailed app configuration based on this user request: "${prompt}"`,
      config: {
        systemInstruction: "You are an expert AI application architect. Your task is to take a user's high-level app description and break it down into a structured JSON configuration. This configuration will be used to automatically generate the application. Be creative and logical in your design. Ensure the icon keywords are simple and one word.",
        responseMimeType: "application/json",
        responseSchema: appConfigSchema,
      },
    });
  } catch (apiError) {
      console.error("Gemini API call failed in generateAppConfig:", apiError);
      if (apiError instanceof Error && (apiError.message.includes('API Key is not valid') || apiError.message.includes('API key') || apiError.message.includes('400'))) {
          throw new Error("API Key is not valid. Please check your setup.");
      }
      throw new Error("The AI service could not be reached. Please check your network connection.");
  }

  try {
    const jsonString = response.text.trim();
    const parsedConfig: AppConfig = JSON.parse(jsonString);
    return parsedConfig;
  } catch (parseError) {
    console.error("Failed to parse AI response for config:", parseError);
    console.log("Malformed response from AI:", response.text);
    throw new Error("The AI returned an invalid response format (not valid JSON).");
  }
};

const projectFilesSchema = {
    type: Type.OBJECT,
    properties: {
        "index.html": { type: Type.STRING, description: "The complete, self-contained HTML file content with embedded CSS and React code written in plain JavaScript using React.createElement." },
    },
    required: ["index.html"],
};

export const generateProjectFiles = async (config: AppConfig, apiKey: string, isThinkingMode: boolean): Promise<ProjectFiles> => {
    
    // Programmatically generate the App component and screen stubs
    // This is a more robust approach than asking the AI to do it.
    const screenComponentsMap = config.screens.map(screen => {
        const componentName = `${screen.name.replace(/[^a-zA-Z0-9]/g, '')}Screen`;
        return `'${screen.name}': React.createElement(${componentName})`;
    }).join(',\n                ');

    const appComponent = `
            // --- MAIN APP COMPONENT (DO NOT MODIFY LOGIC) ---
            const App = () => {
              const [activeScreen, setActiveScreen] = React.useState('${config.screens[0].name}');
              const screenComponents = {
                ${screenComponentsMap}
              };
              const CurrentScreenComponent = screenComponents[activeScreen];

              return React.createElement('div', { className: "h-screen w-screen flex flex-col font-sans text-text", style: { height: '100dvh' } },
                React.createElement('main', { className: "flex-grow overflow-y-auto" }, CurrentScreenComponent),
                React.createElement(NavBar, {
                    screens: ${JSON.stringify(config.screens)},
                    activeScreen: activeScreen,
                    setActiveScreen: setActiveScreen
                })
              );
            };
    `;

    const prompt = `
    **Persona:** You are a hyper-specialized AI that ONLY writes React code using \`React.createElement\`. You are a master of creating single-file, dependency-free HTML documents that run in any browser from the local filesystem. You are also a world-class UI/UX designer with a taste for futuristic and sleek designs.

    **The Golden Rule (UNBREAKABLE):** Your output MUST be a single \`index.html\` file that works perfectly when opened from the local filesystem (\`file://\`). This means NO build tools, NO bundlers, and NO modules.

    **CRITICAL TECHNICAL REQUIREMENT: NO JSX SYNTAX.**
    You MUST NOT use JSX (e.g., \`<div />\`). You MUST use \`React.createElement(component, props, ...children)\` for all elements. This is the only way to guarantee functionality without a build step.

    ---
    **A Simple Example of \`React.createElement\`:**
    To create this HTML: \`<div className="p-4 bg-primary rounded"><h1>Hello</h1></div>\`
    You MUST write this JavaScript:
    \`React.createElement('div', { className: 'p-4 bg-primary rounded' }, React.createElement('h1', null, 'Hello'))\`

    **Constraint: Your generated screen components MUST be stateless functional components.** 
    Do not use \`React.useState\` or \`React.useEffect\` inside the screen components you generate. They should only receive props and render UI. All state is managed by the main \`App\` component which is already provided to you.
    ---

    **The Perfect Template (Your Blueprint):**
    This is the only valid structure. Your task is to implement the placeholder screen components inside the JavaScript section with rich, detailed, and beautifully designed UIs using \`React.createElement\`.

    \`\`\`html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.appName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '${config.colorPalette.primary}',
                  secondary: '${config.colorPalette.secondary}',
                  background: '${config.colorPalette.background}',
                  text: '${config.colorPalette.text}',
                }
              }
            }
          }
        </script>
        <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.development.js"></script>
        <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.development.js"></script>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.5s ease-in-out forwards; }
          .glass-nav { background-color: rgba(0,0,0,0.5); backdrop-filter: blur(10px); }
        </style>
    </head>
    <body class="bg-background">
        <div id="root">Loading Application...</div>
        <script type="text/javascript">
            // NO JSX HERE. USE React.createElement ONLY.

            // --- Pre-built Icon Component (Use this) ---
            const Icon = ({ name, className }) => {
              const iconPaths = {
                home: React.createElement('path', { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
                user: [React.createElement('path', { key: 1, d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), React.createElement('circle', { key: 2, cx: "12", cy: "7", r: "4" })],
                settings: React.createElement('path', { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" }),
                search: [React.createElement('circle', { key: 1, cx: "11", cy: "11", r: "8" }), React.createElement('line', { key: 2, x1: "21", y1: "21", x2: "16.65", y2: "16.65" })],
                bell: [React.createElement('path', { key: 1, d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }), React.createElement('path', { key: 2, d: "M13.73 21a2 2 0 0 1-3.46 0" })],
                heart: React.createElement('path', { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }),
                upload: React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' }),
                default: React.createElement('circle', { cx: "12", cy: "12", r: "10" })
              };
              const path = iconPaths[name] || iconPaths.default;
              return React.createElement('svg', { className: className, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, path);
            };

            // YOUR TASK:
            // Implement the screen components below with a rich, professional UI.
            // Use placeholder content and imagery (picsum.photos) that fits the app's purpose.
            // Adhere strictly to the React.createElement syntax and the stateless component constraint.
            
            // --- SCREEN COMPONENTS START ---
            ${config.screens.map(screen => `const ${screen.name.replace(/[^a-zA-Z0-9]/g, '')}Screen = () => { /* IMPLEMENT ME */ return React.createElement('div', { className: 'p-4 animate-fade-in' }, React.createElement('h1', { className: 'text-2xl font-bold text-text' }, '${screen.name} Screen')); };`).join('\n            ')}
            // --- SCREEN COMPONENTS END ---

            // --- NAVBAR COMPONENT (DO NOT MODIFY) ---
            const NavBar = ({ screens, activeScreen, setActiveScreen }) => {
                const navButtons = screens.map(screen =>
                    React.createElement('button',
                        {
                            key: screen.name,
                            onClick: () => setActiveScreen(screen.name),
                            className: \`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all text-xs w-20 h-16 \${activeScreen === screen.name ? 'text-primary scale-110' : 'text-text/60 hover:text-text'}\`
                        },
                        React.createElement(Icon, { name: screen.icon, className: 'w-6 h-6' }),
                        React.createElement('span', null, screen.name)
                    )
                );
                return React.createElement('nav', { className: 'glass-nav border-t border-white/10 p-1 flex justify-around items-center' }, ...navButtons);
            };

            ${appComponent}

            const container = document.getElementById('root');
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(App));
        </script>
    </body>
    </html>
    \`\`\`

    ---
    **JSON Configuration to Implement:**
    \`\`\`json
    ${JSON.stringify(config, null, 2)}
    \`\`\`

    Now, generate the complete, production-quality \`index.html\` file.
    `;

  const modelConfig: {
    responseMimeType: "application/json";
    responseSchema: typeof projectFilesSchema;
    thinkingConfig?: { thinkingBudget: number };
  } = {
    responseMimeType: "application/json",
    responseSchema: projectFilesSchema,
  };

  if (isThinkingMode) {
    modelConfig.thinkingConfig = { thinkingBudget: 32768 };
  }

  let response: GenerateContentResponse;
  try {
    const ai = getAiInstance(apiKey);
    response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: modelConfig,
    });
  } catch (apiError) {
      console.error("Gemini API call failed in generateProjectFiles:", apiError);
      if (apiError instanceof Error && (apiError.message.includes('API Key is not valid') || apiError.message.includes('API key') || apiError.message.includes('400'))) {
          throw new Error("API Key is not valid. Please check your setup.");
      }
      throw new Error("The AI service could not be reached while generating code.");
  }

  try {
    const jsonString = response.text.trim();
    const parsedFiles = JSON.parse(jsonString);
    if (!parsedFiles || !parsedFiles['index.html']) {
        throw new Error("The AI returned an empty or invalid project structure.");
    }
    return parsedFiles;
  } catch (parseError) {
    console.error("Failed to parse AI response for project files:", parseError);
    console.log("Malformed response from AI:", response.text);
    throw new Error("The AI returned an invalid code format (not valid JSON).");
  }
};

export const modifyProjectFiles = async (
  currentFiles: ProjectFiles,
  userRequest: string,
  config: AppConfig,
  apiKey: string,
): Promise<ProjectFiles> => {
    const ai = getAiInstance(apiKey);
    const currentHtml = currentFiles['index.html'];

    // This is a "surgical" approach. We extract only the JS part for the AI to modify.
    const scriptRegex = /<script type="text\/javascript">([\s\S]*?)<\/script>/;
    const match = currentHtml.match(scriptRegex);
    if (!match || !match[1]) {
        throw new Error("Could not find the main JavaScript block in the HTML file.");
    }
    const currentJsCode = match[1];

    const jsSchema = {
        type: Type.OBJECT,
        properties: {
            "javascript_code": { 
                type: Type.STRING, 
                description: "The complete, updated JavaScript code block for the application, written using React.createElement syntax." 
            },
        },
        required: ["javascript_code"],
    };

    const prompt = `
    **Persona:** You are an elite AI frontend developer agent specializing in futuristic and sleek designs. Your task is to modify an existing JavaScript code block based on a user's request. You are an expert in React using ONLY the \`React.createElement\` syntax.

    **The Golden Rule (UNBREAKABLE):** The JavaScript code you generate MUST remain compatible with the existing HTML structure and MUST use \`React.createElement\`. It MUST NOT introduce any new dependencies or JSX.

    ---
    **CONTEXT: The App's Blueprint**
    This is the original configuration for the app. Use it for context if needed (e.g., color names, screen names).
    \`\`\`json
    ${JSON.stringify(config, null, 2)}
    \`\`\`

    ---
    **TASK: The User's Modification Request**
    "${userRequest}"

    ---
    **CURRENT JAVASCRIPT CODE: This is the code you must modify.**
    \`\`\`javascript
    ${currentJsCode}
    \`\`\`

    ---
    **Your Mission:**
    1.  Analyze the user's request and the current JavaScript code.
    2.  Apply the requested changes directly to the JavaScript code.
    3.  Return the ENTIRE, UPDATED JavaScript code block in the specified JSON format. Do not return only a snippet.
    4.  Ensure the application logic (state management, navbar) remains intact and functional.
    `;

    let response: GenerateContentResponse;
    try {
        response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jsSchema,
            },
        });
    } catch (apiError) {
        console.error("Gemini API call failed in modifyProjectFiles:", apiError);
        throw new Error("The AI agent could not process the modification request.");
    }

    try {
        const jsonString = response.text.trim();
        const parsedJs = JSON.parse(jsonString);
        if (!parsedJs || !parsedJs.javascript_code) {
            throw new Error("The AI agent returned an empty or invalid JavaScript code block.");
        }
        
        const updatedHtml = currentHtml.replace(scriptRegex, `<script type="text/javascript">${parsedJs.javascript_code}</script>`);
        
        return { 'index.html': updatedHtml };

    } catch (parseError) {
        console.error("Failed to parse AI response for file modification:", parseError);
        console.log("Malformed response from AI:", response.text);
        throw new Error("The AI agent returned an invalid code format (not valid JSON).");
    }
};