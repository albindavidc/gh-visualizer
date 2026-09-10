import { LeetCode } from "leetcode-query";
async function run() {
    const lc = new LeetCode();
    const { data } = await lc.graphql({
        operationName: "data",
        query: `query data($username: String!) { user: matchedUser(username: $username) { submissionCalendar } }`,
        variables: { username: "lee215" },
    });
    console.log("data:", data.user.submissionCalendar.slice(0, 50));
}
run().catch(console.error);
