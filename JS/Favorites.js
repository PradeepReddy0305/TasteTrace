let favContainer = document.getElementById("favContainer")
let homeBtn = document.getElementById("homeBtn")
let tt = document.getElementById("tt")

tt.addEventListener("click", () => {
    window.location.href = "Home.html"
})

homeBtn.addEventListener("click", () => {
    window.location.href = "Home.html"
})

let loadFavorites = async () => {
    let savedIds = JSON.parse(localStorage.getItem("tasteTraceFavorites")) || []

    favContainer.innerHTML = ""

    if (savedIds.length === 0) {
        let emptyP = document.createElement("p")
        emptyP.className = "empty-msg"
        emptyP.innerText = "No favorite recipes saved yet!"
        favContainer.appendChild(emptyP)
        return
    }

    for (let id of savedIds) {
        try {
            let res = await fetch(`https://dummyjson.com/recipes/${id}`)
            let recipe = await res.json()

            let card = document.createElement("div")
            card.className = "fav-card"

            let img = document.createElement("img")
            img.className = "fav-card-img"
            img.src = recipe.image
            img.alt = recipe.name

            let h3 = document.createElement("h3")
            h3.className = "fav-card-title"
            h3.innerText = recipe.name

            let actionsDiv = document.createElement("div")
            actionsDiv.className = "fav-actions"

            let viewBtn = document.createElement("button")
            viewBtn.className = "view-btn"
            viewBtn.innerText = "View"
            viewBtn.addEventListener("click", () => {
                window.location.href = `Details.html?id=${recipe.id}`
            })

            let removeBtn = document.createElement("button")
            removeBtn.className = "remove-btn"
            removeBtn.innerText = "Remove"
            removeBtn.addEventListener("click", () => {
                let currentFavs = JSON.parse(localStorage.getItem("tasteTraceFavorites")) || []
                let updatedFavs = currentFavs.filter(favId => favId !== recipe.id)
                localStorage.setItem("tasteTraceFavorites", JSON.stringify(updatedFavs))
                loadFavorites()
            })

            actionsDiv.append(viewBtn, removeBtn)
            card.append(img, h3, actionsDiv)

            favContainer.appendChild(card)
        } catch (err) {
            console.error("Error loading favorite recipe:", err)
        }
    }
}

loadFavorites()