import StoryblokClient from "storyblok-js-client";

let Storyblok = new StoryblokClient({
	oauthToken: process.env.OAUTH_TOKEN,
});

export default Storyblok;
