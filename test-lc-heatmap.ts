import { LeetCode } from "leetcode-query";
async function run() {
    const lc = new LeetCode();
    const { data } = await lc.graphql({
        operationName: "userProfileCalendar",
        query: `query userProfileCalendar($username: String!, $year: Int) { matchedUser(username: $username) { userCalendar(year: $year) { activeYears streak totalActiveDays submissionCalendar } } }`,
        variables: { username: "neal_wu" },
    });
    console.log("data:", JSON.stringify(data).slice(0, 300));
}
run().catch(console.error);
