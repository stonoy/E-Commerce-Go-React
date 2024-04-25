const btn = document.getElementById("btn")
const h1 = document.querySelector("h1")

btn.addEventListener("click", async () => {

    h1.classList.toggle("click")

    // const resp = await fetch("/api/v1/getcount")
    // const data = await resp.json()

    // h1.innerText = data.hits
})