const categoryContainer = document.getElementById("categoryContainer")

const treesContainer = document.getElementById("treesContainer")

async function loadData() {
   // console.log("Hello World!")

   const res = await fetch("https://openapi.programming-hero.com/api/categories")
   const data = await res.json()
   // console.log(data)
   // console.log(categoryContainer)
   data.categories.forEach(category => {
      // console.log(category)
      const btn = document.createElement("button")
      btn.className = "btn btn-outline  w-full rounded-md"
      btn.textContent = category.category_name
      categoryContainer.appendChild(btn)
   })

}

async function loadTrees() {
   const res = await fetch("https://openapi.programming-hero.com/api/plants")
   const data = await res.json()
   //   console.log(data)
   displayTrees(data.plants)

}

/**
 "status": true,
  "message": "successfully fetched plants data",
  "plants": [
    {
      "id": 1,
      "image": "https://i.ibb.co.com/cSQdg7tf/mango-min.jpg",
      "name": "Mango Tree",
      "description": "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green canopy offers shade, while its sweet fruits are rich in vitamins and minerals.",
      "category": "Fruit Tree",
      "price": 500
    },
*/

function displayTrees(trees) {
   console.log(trees)
   trees.forEach((tree) => {
      const card = document.createElement("div")
      card.innerHTML = `<div class="card bg-white shadow-sm">
                     <figure>
                        <img
                           src="${tree.image}"
                           alt="${tree.name}" 
                           class="h-[200px] w-full object-cover"/>
                     </figure>
                     <div class="card-body">
                        <h2 class="card-title">${tree.name}</h2>
                        <p class="line-clamp-2">${tree.description}</p>
                           <div class="badge badge-outline  bg-[#DCFCE7] text-[#15803D]">${tree.category}</div>
                           
                           <div class="flex justify-between items-center">
                           <h2 class="text-[14px] font-semibold">৳${tree.price}</h2>

                           <button class="btn bg-primaryColor text-white rounded-full">Add To Cart</button>
                        </div>
                     </div>
                  </div>`
      treesContainer.appendChild(card)
   })
}


loadData()
loadTrees()