fetch("http://localhost:3000/api/github?username=torvalds").then(r=>r.json()).then(d=>console.log("Weeks:", d.weeks?.length, "Days in week 0:", d.weeks?.[0]?.days?.length)).catch(console.error)
