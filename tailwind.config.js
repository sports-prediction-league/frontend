/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
      },
    },

    // screens: {
    //   // xxs: "300px",
    //   xs: "320px",
    //   sm: "576px",
    //   // => @media (min-width: 576px) { ... }

    //   md: "768px",
    //   // => @media (min-width: 768px) { ... }

    //   lg: "992px",
    //   // => @media (min-width: 992px) { ... }

    //   xl: "1200px",
    // },
  },
  plugins: [],
};
