import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        product: path.resolve(__dirname, "product.html"),
        category: path.resolve(__dirname, "category.html"),
        brandStory: path.resolve(__dirname, "brand-story.html"),
        campaign: path.resolve(__dirname, "campaign.html"),
        goods: path.resolve(__dirname, "goods.html"),
        community: path.resolve(__dirname, "community.html"),
        sns: path.resolve(__dirname, "sns.html"),
        faq: path.resolve(__dirname, "faq.html"),
        contact: path.resolve(__dirname, "contact.html"),
      },
    },
  },
});
