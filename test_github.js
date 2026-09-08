const token = process.env.GITHUB_TOKEN;
const username = 'albindavidc';
const query = `
      query($username: String!) {
        user(login: $username) {
          repositories(ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], isFork: false, first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              name
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query, variables: { username } }),
}).then(res => res.json()).then(data => {
  console.log(JSON.stringify(data, null, 2).slice(0, 500));
}).catch(console.error);
