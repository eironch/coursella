/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5F5F5",
        secondary: "#DBDBDB",
        tertiary: "#565656",
        highlight: "#134713",
        component: "#F5F5F550",
        "highlight-light": "#1b651b",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans"],
        "helvetica-compressed": ["Helvetica Compressed", "sans"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".q-w-5-12": {
          "@apply 2xl:w-5/12 lg:w-7/12 md:w-9/12": {},
        },
        ".q-w-5": {
          "@apply 2xl:w-5 lg:w-4 w-3": {},
        },
        ".q-w-20": {
          "@apply 2xl:w-20 lg:w-16 w-12": {},
        },
        ".q-h-20": {
          "@apply 2xl:h-20 lg:h-16 h-12": {},
        },
        ".q-h-10": {
          "@apply 2xl:h-10 lg:h-8 h-5": {},
        },
        ".q-h-16": {
          "@apply 2xl:h-16 lg:h-14 h-12": {},
        },
        ".q-h-12": {
          "@apply 2xl:h-12 lg:h-10 h-8": {},
        },
        ".q-gap-20": {
          "@apply 2xl:gap-20 lg:gap-16 gap-14": {},
        },
        ".q-gap-10": {
          "@apply 2xl:gap-10 lg:gap-8 gap-5": {},
        },
        ".q-gap-12": {
          "@apply 2xl:gap-12 lg:gap-10 gap-8": {},
        },
        ".q-gap-5": {
          "@apply 2xl:gap-5 lg:gap-4 gap-3": {},
        },
        ".q-mb-10": {
          "@apply 2xl:mb-10 lg:mb-8 mb-6": {},
        },
        ".q-mb-6": {
          "@apply 2xl:mb-6 lg:mb-4 mb-2": {},
        },
        ".q-p-20": {
          "@apply 2xl:p-20 lg:p-10 px-5 py-10": {},
        },
        ".q-p-10": {
          "@apply 2xl:p-10 lg:p-8 px-5 py-10": {},
        },
        ".q-px-10": {
          "@apply 2xl:px-10 lg:px-8 px-5": {},
        },
        ".q-px-5": {
          "@apply 2xl:px-5 lg:px-4 px-3": {},
        },
        ".q-py-4": {
          "@apply 2xl:py-4 lg:py-3 py-4": {},
        },
        ".q-py-5": {
          "@apply 2xl:py-5 lg:py-4 py-4": {},
        },
        ".q-pl-10": {
          "@apply 2xl:pl-10 lg:pl-8 pl-5": {},
        },
        ".q-pr-10": {
          "@apply 2xl:pr-10 lg:pr-8 pr-5": {},
        },
        ".q-text-4xl": {
          "@apply 2xl:text-4xl lg:text-3xl text-2xl": {},
        },
        ".q-text-3xl": {
          "@apply 2xl:text-3xl lg:text-2xl text-xl": {},
        },
        ".q-text-2xl": {
          "@apply 2xl:text-2xl lg:text-xl text-lg": {},
        },
        ".q-text-xl": {
          "@apply 2xl:text-xl lg:text-lg text-base": {},
        },
        ".q-text-lg": {
          "@apply 2xl:text-lg lg:text-base text-sm": {},
        },
        ".q-text-base": {
          "@apply 2xl:text-base lg:text-sm text-xs": {},
        },
        ".q-text-sm": {
          "@apply 2xl:text-sm lg:text-xs text-xs": {},
        },
        ".q-leading-8": {
          "@apply 2xl:leading-8 lg:leading-none leading-none": {},
        },
        ".q-rounded-3xl": {
          "@apply 2xl:rounded-3xl lg:rounded-2xl rounded-2xl": {},
        },
        ".q-rounded-2xl": {
          "@apply 2xl:rounded-2xl lg:rounded-xl rounded-xl": {},
        },
        ".q-rounded-xl": {
          "@apply 2xl:rounded-xl lg:rounded-lg rounded-lg": {},
        },
        ".q-rounded-l-xl": {
          "@apply 2xl:rounded-l-xl lg:rounded-l-lg rounded-l-lg": {},
        },
        ".q-rounded-r-xl": {
          "@apply 2xl:rounded-r-xl lg:rounded-r-lg rounded-r-lg": {},
        },
        ".q-scroll-mt": {
          "@apply md:mt-0 mt-3": {},
        },
        ".q-scroll-pl": {
          "@apply md:pl-0 pl-3": {},
        },
        ".q-scroll-page": {
          "@apply 2xl:pl-10 2xl:pr-5 lg:pl-8 lg:pr-4 pr-2 pl-5": {},
        },
      });
    },
  ],
};
