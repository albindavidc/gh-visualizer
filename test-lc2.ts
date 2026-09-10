import { LeetCode } from "leetcode-query";
async function run() {
    const lc = new LeetCode();
    const result = await lc.graphql({
        operationName: "calendar",
        query: `query calendar($username: String!, $year: Int) { user: matchedUser(username: $username) { calendar: userCalendar(year: $year) { calendar: submissionCalendar } } }`,
        variables: { username: "jacoblincool" },
    });
    console.log(Object.keys(result.data));
}
run().catch(console.error);
