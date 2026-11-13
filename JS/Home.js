let mainContainer = document.getElementById("main")
let recipeContainer = document.getElementById("recipies")
let searchInput = document.getElementById("csearch")
let favBtn = document.getElementById("favbtn")
let home = document.getElementById("homeBtn")

let tt=document.getElementById("tt")
let topBar = document.createElement("div")

let allRecipes = []
let mealTypeMap = {}

// Fetching recipies and adding to allRecipies array
let initApp = async () => {
    try {
        let response = await fetch("https://dummyjson.com/recipes?limit=0")
        let data = await response.json()
        allRecipes = data.recipes

        groupRecipesByMealType()
        renderMealTypeCards(mealTypeMap)
    } catch (error) {
        console.error("Error fetching recipes:", error)
    }
}


tt.addEventListener("click", () => {
    searchInput.style.display = "inline-block"
    searchInput.value = ""
    renderMealTypeCards(mealTypeMap)
})

// Group recipes into categories based on mealType array
let groupRecipesByMealType = () => {
    mealTypeMap = {}
    allRecipes.forEach(recipe => {
        recipe.mealType.forEach(type => {
            if (!mealTypeMap[type]) {
                mealTypeMap[type] = []
            }
            mealTypeMap[type].push(recipe)
        })
    })
}

// Render category cards on initial load
let renderMealTypeCards = (groups) => {

    home.style.display = "none"
    // if (topBar.parentNode) {
    //     topBar.parentNode.removeChild(topBar)
    // }
    topBar.innerHTML = ""

    recipeContainer.innerHTML = ""
    recipeContainer.style.display = "grid"
    recipeContainer.style.gridTemplateColumns = "repeat(3,1fr)"
    recipeContainer.style.gap = "20px"
    recipeContainer.style.marginTop = "30px"

    Object.keys(groups).forEach(mealType => {
        let card = document.createElement("div")
        card.className = "meal-category-card"
        card.style.border = "2px solid goldenrod"
        card.style.borderRadius = "20px"
        card.style.padding = "30px"
        card.style.cursor = "pointer"
        card.style.backgroundColor = "#111"

        let i = document.createElement("img")
        i.src = groups[mealType][0].image
        i.width = 250

        let h = document.createElement("h2")
        h.innerText = mealType

        let p = document.createElement("p")
        p.innerText = groups[mealType].length + " Recipies"

        card.append(i, h, p);

        // Click handler to open specific meal type view
        card.addEventListener("click", () => {
            searchInput.style.display = "none" // hide search when meal type opened
            renderRecipeCards(groups[mealType], mealType)
        })

        recipeContainer.appendChild(card)
    })
}



// Render recipe cards for a selected meal type or search result
let renderRecipeCards = (recipesArray, title) => {
    recipeContainer.innerHTML = ""
    home.style.display = "block"
    topBar.innerHTML = ""


    topBar.style.display = "flex"
    topBar.style.justifyContent = "space-between"
    topBar.style.alignItems = "center"
    topBar.style.width = "100%"
    // topBar.innerHTML = `<h2>${title} (${recipesArray.length})</h2>`
    let h = document.createElement("h2")
    topBar.appendChild(h)
    h.innerText = title + " (" + recipesArray.length + ")"
    recipeContainer.before(topBar)

    home.addEventListener("click", () => {
        searchInput.style.display = "inline-block"
        searchInput.value = ""
        renderMealTypeCards(mealTypeMap)
    })

    if (recipesArray.length === 0) {
        let noRes = document.createElement("p")
        // noRes.style.gridColumn = "1 / -1"
        noRes.textContent = "No recipes found."
        recipeContainer.append(noRes)
        return
    }

    recipesArray.forEach(recipe => {
        let recCard = document.createElement("div")
        recCard.className = "recipe-card"
        recCard.style.border = "1px solid #444"
        recCard.style.borderRadius = "15px"
        recCard.style.display = "grid"
        recCard.style.gridTemplateColumns = "repeat(3,1fr)"
        recCard.style.padding = "15px"
        recCard.style.backgroundColor = "#181818"
        recCard.style.cursor = "pointer"

        recCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px;">
            <h3 style="margin: 10px 0 5px 0; font-size: 1.1rem;">${recipe.name}</h3>
            <p style="color: #aaa; font-size: 0.9rem;">Prep: ${recipe.prepTimeMinutes} mins | ⭐ ${recipe.rating}</p>
        `

        // Click recipe card -> navigate to detail page with id query param
        recCard.addEventListener("click", () => {
            window.location.href = `Details.html?id=${recipe.id}`
        })

        recipeContainer.appendChild(recCard)
    })
}

// Search input listener
searchInput.addEventListener("input", (e) => {
    let query = e.target.value.toLowerCase().trim()
    if (query === "") {
        renderMealTypeCards(mealTypeMap)
        topBar.remove()
        topBar.innerHTML = ""
        home.style.display = "none"
        return
    }

    // Hide search if needed or keep it active while filtering all recipes
    let filtered = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
    )
    renderRecipeCards(filtered, `Search Results for "${query}"`)
})

// Navigate to favorites page
favBtn.addEventListener("click", () => {
    window.location.href = "Favorites.html"
})

initApp()