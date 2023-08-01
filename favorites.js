// Function to remove a superhero to the favorites list
function removeFromFavorites(superhero) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(item => item.superhero === superhero);
  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Function to display the list of favorite superheroes on the superhero.html page
function displayFavoritesList() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesListContainer = document.getElementById("favoritesList");

  // Clear existing cards from the favorites list container
  favoritesListContainer.innerHTML = "";

  favorites.forEach(item => {

    const characterName = item.superhero;
    const description = item.description;
    const characterFullName = characterName.split(" (")[0];
    var additionalInfo = characterName.match(/\((.*?)\)/)?.[1];
    if (additionalInfo === undefined) {
      additionalInfo = "Unknown";
    }
    const characterImageURL = item.characterImageURL;

    //creating bootstrap card and inserting superhero data into them
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const imgElement = document.createElement("img");
    imgElement.classList.add("card-img-top");
    imgElement.setAttribute("src", characterImageURL);
    imgElement.setAttribute("alt", characterName);

    const containerDiv = document.createElement("div");
    containerDiv.className = "container";

    const favouriteContainer = document.createElement("div");
    favouriteContainer.classList.add("card-body");
    const nameHeader = document.createElement("h5");
    nameHeader.classList.add("card-title");
    nameHeader.innerHTML = `${characterFullName}`;

    const nickName = document.createElement("small");
    nickName.innerHTML = `${additionalInfo}`;

    const cardContent = document.createElement("p");
    cardContent.classList.add("card-text");
    cardContent.innerHTML = "Some quick example text to build on the card title and make up the bulk of the card's content."

    // Add a "remove from Favorite" button to each card
    const removeFromFavoritesButton = document.createElement("a");
    removeFromFavoritesButton.textContent = "Remove";
    removeFromFavoritesButton.classList.add("btn");
    removeFromFavoritesButton.classList.add("btn-danger");

    favouriteContainer.appendChild(nickName);
    favouriteContainer.appendChild(nameHeader);
    favouriteContainer.appendChild(cardContent);
    cardDiv.appendChild(imgElement);
    cardDiv.appendChild(favouriteContainer);

    favouriteContainer.appendChild(removeFromFavoritesButton);
    favoritesListContainer.appendChild(cardDiv);

    imgElement.addEventListener("click", () => {
      displaySuperheroModal(characterName, characterImageURL, description);
    });

    //Event listener to remove the card whenever remove button is clicked
    removeFromFavoritesButton.addEventListener("click", () => {
      removeFromFavorites(item.superhero);
      displayFavoritesList(); // Update the list after removal
    });


  });
}


// Call the function to display the favorite superheroes list on page load
document.addEventListener("DOMContentLoaded", () => {
  const favNavBar = document.getElementById("favourites");
  const iconElement = favNavBar.querySelector("i");
  iconElement.style.borderColor ="blue";
  displayFavoritesList();
});


const scrollButton = document.getElementById("contact");
const targetElement = document.getElementById("contactFooter");

//page navigation when contact in side  navbar is clicked
scrollButton.addEventListener("click", () => {
  targetElement.scrollIntoView({ behavior: "smooth" });
});

//function to display superHeroModal
function displaySuperheroModal(superhero, imageURL, description) {
  const modal = document.getElementById("superheroModal");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const descriptionModal = document.getElementById("description");

  // Set the superhero details in the modal
  modalImage.src = imageURL;
  modalName.textContent = superhero;

  if (description.length < 10) {
    descriptionModal.textContent = "No description about the character is available";
  }
  else {
    descriptionModal.textContent = description;
  }


  // Show the modal
  modal.style.display = "block";

  // Disable background scrolling
  document.body.style.overflow = "hidden";
}

// Close the modal when the close button is clicked
document.querySelector(".close-btn").addEventListener("click", () => {
  const modal = document.getElementById("superheroModal");
  modal.style.display = "none";

  // Enable background scrolling
  document.body.style.overflow = "auto";
});
