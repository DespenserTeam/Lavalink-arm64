const { default: axios } = require("axios");

async function main() {
  const lavalink = await axios
    .get(`${process.env.GITHUB_API_URL}/repos/${process.env.LAVALINK_REPO}/releases`, {
      headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "Node.js" },
    })
    .then((res) => res.data);

  const github = await axios
    .get(`${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_REPOSITORY}/releases`, {
      headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "Node.js" },
    })
    .then((res) => res.data);

  if (!lavalink || lavalink.length < 1) return console.error("Failed to get lavalink releases");
  if (!github) return console.error("Failed to get github releases");

  if ((github.length < 1 || lavalink[0].tag_name !== github[0].tag_name) && !lavalink[0].draft && !lavalink[0].prerelease) {
    console.log(`Release ${lavalink[0].tag_name} detected`);

    return await axios
      .post(
        `${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_REPOSITORY}/releases`,
        {
          tag_name: lavalink[0].tag_name,
          name: lavalink[0].name,
          body: `*This release was generated automatically.* [Click here to go to the lavalink release.](${lavalink[0].html_url})\n\n${lavalink[0].body}`,
        },
        {
          auth: { username: process.env.GITHUB_ACTOR, password: process.env.GITHUB_TOKEN },
          headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "Node.js" },
        }
      )
      .then((res) => console.log(`Release ${res.data.tag_name} created successfully. ${res.data.html_url}`));
  } else return console.log("Repository already up to date.");
}

main();
