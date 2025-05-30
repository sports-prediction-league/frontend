/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        "spl-green": {
          100: "#2D947A",
          200: "#4EFFD51A",
          300: "#00644C",
          400: "#05231F",
          500: "#042822",
          600: "#031614",
        },
        "spl-white": "#FFFFFF",
        "spl-black": "#000000",
        "spl-orange": "#FBAE0C",
      },
      backgroundImage: {
        "gradient-green":
          "linear-gradient(0deg, #0E131E, #0E131E), radial-gradient(176.68% 982.5% at 0% 0%, rgba(0, 202, 154, 0.6) 0%, rgba(0, 100, 76, 0.6) 100%)",
        "button-gradient": "linear-gradient(to right, #0E131E, #4EFFD51A)",
        "input-gradient":
          "linear-gradient(219.65deg, #757575 3.77%, #DBDBDB 49.02%, #B7B7B7 67.48%, #B7B7B7 71.75%, #B7B7B7 98.1%)",
      },
    },

    screens: {
      // xxs: "300px",
      xs: "320px",
      smm: "375px",
      smmm: "425px",
      sm: "576px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      xxl: "2560px",
    },
  },
  plugins: [],
};
