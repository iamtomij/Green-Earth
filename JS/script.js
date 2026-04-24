const categoryContainer = document.getElementById("categoryContainer")

async function loadData() {
   // console.log("Hello World!")

   const res = await fetch("https://openapi.programming-hero.com/api/categories")
   const data = await res.json()
   console.log(data)
   console.log(categoryContainer)
   data.categories.forEach(category => {
      console.log(category)
      const btn= document.createElement("button")
      btn.className="btn btn-outline  w-full rounded-md"
      btn.textContent=category.category_name
      categoryContainer.appendChild(btn)
   })

}

loadData()