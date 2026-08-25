import { defineConfig } from "tinacms";
import { EditorialCollection } from "./collections/editorial";
import { EventCollection } from "./collections/event";
import { GlobalConfigCollection } from "./collections/global-config";
import { MentoringCollection } from "./collections/mentoring";
import { PublicationCollection } from "./collections/publication";
import { ServiceCollection } from "./collections/service";
import { TalkCollection } from "./collections/talk";
import { TrainingCollection } from "./collections/training";

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH ||
	process.env.VERCEL_GIT_COMMIT_REF ||
	process.env.WORKERS_CI_BRANCH || // Cloudflare Workers Builds
	process.env.CF_PAGES_BRANCH || // Cloudflare Pages
	process.env.HEAD || // Netlify
	"main";

export default defineConfig({
	branch,

	// Get this from tina.io
	clientId: process.env.PUBLIC_TINA_CLIENT_ID,
	// Get this from tina.io
	token: process.env.TINA_TOKEN,

	build: {
		outputFolder: "admin",
		publicFolder: "public",
	},
	media: {
		tina: {
			mediaRoot: "",
			publicFolder: "public",
		},
	},
	// See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
	schema: {
		collections: [
			EditorialCollection,
			ServiceCollection,
			EventCollection,
			TalkCollection,
			TrainingCollection,
			MentoringCollection,
			PublicationCollection,
			GlobalConfigCollection,
		],
	},
});
