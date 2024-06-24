/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      //프사 효과
      animation: {
        "flip-front-back": "flipFrontBack 1s ease-in-out forwards",
        "flip-back-front": "flipBackFront 1s ease-in-out forwards",
      },
      keyframes: {
        flipFrontBack: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        flipBackFront: {
          "0%": { transform: "rotateY(-180deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
      },
    },
    screens: {
      md: "768px",
      mmd: "1250px",
    },
  },
  plugins: [],
};
