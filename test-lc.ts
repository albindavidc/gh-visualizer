import { LeetCode } from "leetcode-query";
async function run() {
    const lc = new LeetCode();
    const { data } = await lc.graphql({
        operationName: "data",
        variables: { username: "jacoblincool" },
        query: `query data($username: String!) { user: matchedUser(username: $username) { username } }`
    });
    console.log(data);
}
run().catch(console.error);
