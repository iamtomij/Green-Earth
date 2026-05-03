const categoryContainer = document.getElementById("categoryContainer")
const treesContainer = document.getElementById("treesContainer")
const loadingSpinner = document.getElementById("loadingSpinner")
const treeModal = document.getElementById("treeModal")
const modalImage = document.getElementById("modalImage")
const modalCategory = document.getElementById("modalCategory")
const modalPrice = document.getElementById("modalPrice")
const modalDescription = document.getElementById("modalDescription")
const modalTitle = document.getElementById("modalTitle")
const cartContainer = document.getElementById("cartContainer")
const totalPriceEl = document.querySelector(".totalPrice")
const emptyCartMessage = document.getElementById("emptyCartMessage")
const cart = []



let allPlants = []   //  global data store

// ---------------- LOADING ----------------
function showLoading() {
   loadingSpinner.classList.remove("hidden")
   loadingSpinner.classList.add("flex")
}

function hideLoading() {
   loadingSpinner.classList.add("hidden")
   loadingSpinner.classList.remove("flex")
}

// ---------------- LOAD CATEGORIES ----------------
async function loadData() {
   const res = await fetch("https://openapi.programming-hero.com/api/categories")
   const data = await res.json()

   data.categories.forEach(category => {
      const btn = document.createElement("button")
      btn.className = "btn btn-outline w-full rounded-md"
      btn.textContent = category.category_name

      //  FIX: pass category name (not id)
      btn.onclick = () => selectCategory(category.category_name, btn)

      categoryContainer.appendChild(btn)
   })
}

// ---------------- CATEGORY FILTER ----------------
async function selectCategory(categoryName, btn) {

   showLoading()

   const allBtns = document.querySelectorAll("#categoryContainer button")
   allBtns.forEach(b => {
      b.classList.remove("bg-primaryColor", "text-white")
      b.classList.add("btn-outline")
   })

   btn.classList.add("bg-primaryColor", "text-white")
   btn.classList.remove("btn-outline")

   //  API call once (or reuse global data)
   const res = await fetch("https://openapi.programming-hero.com/api/plants")
   const data = await res.json()

   const filtered = data.plants.filter(
      plant => plant.category === categoryName
   )

   treesContainer.innerHTML = ""
   displayTrees(filtered)

   hideLoading()
}



// ---------------- LOAD ALL TREES ----------------
async function loadTrees() {
   showLoading()

   const res = await fetch("https://openapi.programming-hero.com/api/plants")
   const data = await res.json()

   allPlants = data.plants

   treesContainer.innerHTML = ""
   displayTrees(allPlants)

   hideLoading()
}


// ---------------- ALL TREES BUTTON (FIX) ----------------
document.getElementById("allTreesbtn").addEventListener("click", () => {

   showLoading()

   const allBtns = document.querySelectorAll("#categoryContainer button")

   // সব category button reset
   allBtns.forEach(b => {
      b.classList.remove("bg-primaryColor", "text-white")
      b.classList.add("btn-outline")
   })

   // 👉 ALL button active style
   const allBtn = document.getElementById("allTreesbtn")
   allBtn.classList.add("bg-primaryColor", "text-white")

   // 👉 সব data দেখাও (global store থেকে)
   treesContainer.innerHTML = ""
   displayTrees(allPlants)

   hideLoading()
})


// ---------------- DISPLAY TREES ----------------
function displayTrees(trees) {

   treesContainer.innerHTML = ""

   trees.forEach(tree => {
      const card = document.createElement("div")

      card.innerHTML = `
         <div class="card bg-white shadow-sm">
            <figure>
               <img 
                  src="${tree.image}" 
                  alt="${tree.name}" 
                  class="h-[200px] w-full object-cover"
               />
            </figure>

            <div class="card-body">
               <h2 class="card-title cursor-pointer hover:text-[#15803D]" onclick="openTreeModal(${tree.id})">${tree.name}</h2>
               <p class="line-clamp-2">${tree.description}</p>

               <div class="badge badge-outline bg-[#DCFCE7] text-[#15803D]">
                  ${tree.category}
               </div>

               <div class="flex justify-between items-center">
                  <h2 class="text-[14px] font-semibold">৳${tree.price}</h2>

                  <button class="btn bg-primaryColor text-white rounded-full" onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})">
                     Add To Cart
                  </button>
               </div>
            </div>
         </div>
      `

      treesContainer.appendChild(card)
   })
}

async function openTreeModal(treeId) {
   const res = await fetch(
      `https://openapi.programming-hero.com/api/plant/${treeId}`,
   );
   const data = await res.json();
   const plantDetails = data.plants;
   modalTitle.textContent = plantDetails.name;
   modalImage.src = plantDetails.image;
   modalCategory.textContent = plantDetails.category;
   modalDescription.textContent = plantDetails.description;
   modalPrice.textContent = plantDetails.price;
   treeModal.showModal();
}


function addToCart(id, name, price) {
   const existingItem = cart.find(item => item.id === id)

   if (existingItem) {
      // 👉 আগেই থাকলে quantity বাড়াও
      existingItem.quantity++
   } else {
      // 👉 না থাকলে নতুন item add
      cart.push({
         id,
         name,
         price,
         quantity: 1
      })
   }

   updateCartUI()
}

function updateCartUI() {
   cartContainer.innerHTML = ""
   if(cart.length === 0){
      emptyCartMessage.classList.remove("hidden")
      totalPriceEl.textContent = `৳${0}`
      return
   }
   emptyCartMessage.classList.add("hidden")

   let total = 0   // 👉 total variable

   cart.forEach(item => {
      const cartItem = document.createElement("div")

      cartItem.className = "card card-body bg-slate-100"

      const itemTotal = item.price * (item.quantity || 1)
      total += itemTotal   // 👉 total add

      cartItem.innerHTML = `                     
         <div class="flex justify-between items-center">
            <div>
               <h2 class="font-semibold text-[#1F2937]">${item.name}</h2>
               <p>৳${item.price} x Quantity: ${item.quantity || 1}</p>
            </div>
            <button 
               class="btn btn-ghost "
               onclick="removeFromCart(${item.id})"
            >
               X
            </button>
         </div>
         <p class="font-semibold text-xl">৳${itemTotal}</p>
      `

      cartContainer.appendChild(cartItem)
   })

   // 👉 শেষে total update
   totalPriceEl.textContent = `৳${total}`
}

function removeFromCart(id) {
   const item = cart.find(item => item.id === id)

   if (item.quantity > 1) {
      item.quantity--
   } else {
      const index = cart.findIndex(i => i.id === id)
      cart.splice(index, 1)
   }

   updateCartUI()
}

loadData()
loadTrees()