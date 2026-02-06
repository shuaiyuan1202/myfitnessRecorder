export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        fittrack: {
          "primary": "#6366f1", // Indigo 500
          "secondary": "#ec4899", // Pink 500
          "accent": "#8b5cf6", // Violet 500
          "neutral": "#1f2937", // Gray 800
          "base-100": "#ffffff",
          "base-200": "#f3f4f6", // Gray 100
          "base-300": "#e5e7eb", // Gray 200
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.8rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when clicking on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
      "light",
      "dark",
      "valentine",
      "black",
      "emerald",
      "corporate",
      "halloween",
      "aqua"
    ],
  },
}
