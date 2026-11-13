let recipeContent = document.getElementById("recipeContent")
let homeBtn = document.getElementById("homeBtn")
let favNavBtn = document.getElementById("favNavBtn")
let tt = document.getElementById("tt")

tt.addEventListener("click", () => {
    window.location.href = "Home.html"
})

homeBtn.addEventListener("click", () => {
    window.location.href = "Home.html"
})

favNavBtn.addEventListener("click", () => {
    window.location.href = "Favorites.html"
})

let urlParams = new URLSearchParams(window.location.search)
let recipeId = urlParams.get("id")

let fetchRecipeDetails = async () => {
    if (!recipeId) {
        recipeContent.innerHTML = ""
        let msg = document.createElement("p")
        msg.innerText = "No recipe selected."
        recipeContent.appendChild(msg)
        return
    }

    try {
        let response = await fetch(`https://dummyjson.com/recipes/${recipeId}`)
        let recipe = await response.json()
        renderDetails(recipe)
    } catch (err) {
        console.error("Failed to load recipe details:", err)
        recipeContent.innerHTML = ""
        let errStr = document.createElement("p")
        errStr.innerText = "Failed to load recipe details."
        recipeContent.appendChild(errStr)
    }
}

let renderDetails = (recipe) => {
    recipeContent.innerHTML = ""

    // Title
    let titleH1 = document.createElement("h1")
    titleH1.className = "recipe-header-title"
    titleH1.innerText = recipe.name

    // Image
    let img = document.createElement("img")
    img.className = "detail-img"
    img.src = recipe.image
    img.alt = recipe.name

    // Meta details container
    let metaDiv = document.createElement("div")
    metaDiv.className = "meta-info-container"

    let cuisineP = document.createElement("p")
    cuisineP.innerText = "Cuisine: " + recipe.cuisine

    let prepP = document.createElement("p")
    prepP.innerText = "Prep Time: " + recipe.prepTimeMinutes + " mins"

    let cookP = document.createElement("p")
    cookP.innerText = "Cook Time: " + recipe.cookTimeMinutes + " mins"

    let ratingP = document.createElement("p")
    ratingP.innerText = "Rating: ⭐ " + recipe.rating

    metaDiv.append(cuisineP, prepP, cookP, ratingP)

    // Favorites Button
    let favorites = JSON.parse(localStorage.getItem("tasteTraceFavorites")) || []
    let isFav = favorites.includes(recipe.id)

    let favBtn = document.createElement("button")
    favBtn.className = isFav ? "fav-toggle-btn active" : "fav-toggle-btn"
    favBtn.innerText = isFav ? "♥ Remove from Favorites" : "♡ Add to Favorites"

    favBtn.addEventListener("click", () => {
        let currentFavs = JSON.parse(localStorage.getItem("tasteTraceFavorites")) || []
        if (currentFavs.includes(recipe.id)) {
            currentFavs = currentFavs.filter(id => id !== recipe.id)
            favBtn.className = "fav-toggle-btn"
            favBtn.innerText = "♡ Add to Favorites"
        } else {
            currentFavs.push(recipe.id)
            favBtn.className = "fav-toggle-btn active"
            favBtn.innerText = "♥ Remove from Favorites"
        }
        localStorage.setItem("tasteTraceFavorites", JSON.stringify(currentFavs))
    })

    // Ingredients Section
    let ingTitle = document.createElement("h2")
    ingTitle.className = "section-title"
    ingTitle.innerText = "Ingredients (Check off as you prep)"

    let ingUl = document.createElement("ul")
    ingUl.className = "ingredients-list"

    recipe.ingredients.forEach(ing => {
        let li = document.createElement("li")
        li.className = "ingredient-item"

        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.className = "ingredient-checkbox"

        let span = document.createElement("span")
        span.innerText = ing

        li.append(checkbox, span)
        ingUl.appendChild(li)
    })

    // Instructions Section
    let instTitle = document.createElement("h2")
    instTitle.className = "section-title"
    instTitle.innerText = "Cooking Instructions"

    let instOl = document.createElement("ol")
    instOl.className = "instructions-list"

    recipe.instructions.forEach(step => {
        let li = document.createElement("li")
        li.innerText = step
        instOl.appendChild(li)
    })

    // Append everything to main container
    recipeContent.append(titleH1, img, metaDiv, favBtn, ingTitle, ingUl, instTitle, instOl)
}

fetchRecipeDetails()