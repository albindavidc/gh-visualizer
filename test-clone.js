async function run() {
    const res = await fetch("https://example.com");
    await res.json().catch(e=>console.log("first err", e));
    try {
        await res.clone().json();
    } catch(e) {
        console.log("second err", e.message);
    }
}
run();
