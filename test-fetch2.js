fetch("http://localhost:3000/api/github?username=torvalds").then(r=>r.json()).then(d=>console.log(JSON.stringify(d.weeks[0].days))).catch(console.error)
