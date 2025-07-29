// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Internet Accountability Compass",
  base: "/dfi/",
  root: "src",

  assets: [
    { from: "src/data", to: "_file/data" }, // copies data
  ],

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    { name: "🌐 Map", path: "/index" },
    { name: "🏴󠁥󠁳󠁰󠁶󠁿 Country overview", path: "/countries" },
    { name: "⁉️ Issues", path: "/issues" },
    { name: "👓 Perspectives", path: "/perspectives" },
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  // head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // theme
  theme: "air", // try "light", "dark", "slate", etc.
  // custom stylesheet
  style: "style.css",

  // Some additional configuration options and their defaults:
  // header: "Internet Accountability Compass", // what to show in the header (HTML)
  footer: false, // what to show in the footer (HTML)
  sidebar: false, // whether to show the sidebar
  toc: false, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // cleanUrls: true, // drop .html from URLs
};
