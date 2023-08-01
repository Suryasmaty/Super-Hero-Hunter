const publicKey = "470413fd381a63bd8243235988a07149";
const privateKey = "6d36cf23c6901763a12bb5edbe0de79e2be11dd8";
const timestamp = new Date().getTime();
const hash = CryptoJS.MD5(`${timestamp}${privateKey}${publicKey}`).toString();

// Function to fetch and display character images based on the character name
function fetchCharacterImages(characterName) {
  const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${characterName}&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const characters = data?.data?.results;
      if (characters && characters.length > 0) {
        const mainContainer = document.getElementById("main");
        mainContainer.innerHTML = "";

        characters.forEach(character => {
          const characterName = character.name;
          const characterFullName = characterName.split(" (")[0];
          var additionalInfo = characterName.match(/\((.*?)\)/)?.[1];
          const description = character.description;

          if (additionalInfo === undefined) {
            additionalInfo = "Unknown";
          }

          //getting character image url
          const characterImageURL = `${character.thumbnail.path}.${character.thumbnail.extension}`;

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
          cardContent.innerHTML = "Discover the epic world of superheroes and dive into their thrilling adventures. Unleash your imagination as you follow these extraordinary beings on their journey to protect the universe from evil forces."

          // Add a "Favorite" button to each card
          const favoriteButton = document.createElement("a");
          favoriteButton.textContent = "Add to Favorite";
          favoriteButton.classList.add("btn");
          favoriteButton.classList.add("btn-info");
          favoriteButton.addEventListener("click", event => {
            event.stopPropagation(); // Prevent card click event from firing
            addToFavorites(characterName, characterImageURL, description);
            favoriteButton.textContent = "Added to Favourites"
            favoriteButton.style.backgroundColor = "green";
          });

          // Add a click event to show superhero details page
          cardDiv.addEventListener("click", () => {
            displaySuperheroModal(characterName, characterImageURL, description);
          });

          favouriteContainer.appendChild(nickName);
          favouriteContainer.appendChild(nameHeader);
          favouriteContainer.appendChild(cardContent);
          cardDiv.appendChild(imgElement);
          cardDiv.appendChild(favouriteContainer);
          favouriteContainer.appendChild(favoriteButton);

          mainContainer.appendChild(cardDiv);
        });
      } else {
        console.error("No characters found.");
      }
    })
    .catch(error => {
      console.error("Error fetching character data:", error);
    });
}

// Calling the function to fetch and display the character images of spiderman on initial page load
fetchCharacterImages("Spider");



const searchDiv = document.getElementById("search");
const searchContainer = document.getElementById("searchContainer");


searchDiv.addEventListener("click", () => {
  searchContainer.style.display = "block";
  document.body.style.overflow = "hidden"; // Disable background scrolling
  document.getElementById("content").style.opacity = "0.2";
});


/*below code is for sending the data entered in search box as input for fetchCharacterImages function and adding eventlistener to keyboard event */
const searchInputBox = document.getElementById("searchInputBox");
const searchButton = document.getElementById("searchButton");

searchInputBox.addEventListener('keypress', function(event) {
  // Check if the pressed key is "Enter" (key code 13)
  if (event.keyCode === 13) {
    // Prevent the default "Enter" key action (e.g., form submission)
    event.preventDefault();

    // Trigger the click event on the search button
    searchButton.click();
  }
});


searchButton.addEventListener('click', function() {
  // Perform the search functionality here (e.g., fetching search results)
  performSearch()
});

// Function that performs the search action
function performSearch() {
  const searchValue = searchInputBox.value.trim();
  
  closeSearchContainer();
  fetchCharacterImages(searchValue);
}

function closeSearchContainer() {
  const searchContainer = document.getElementById("searchContainer");
  searchContainer.style.display = "none";

  const searchInputBox = document.getElementById("searchInputBox");
  searchInputBox.value = "";

  document.body.style.overflow = "auto"; // Enable background scrolling
  document.getElementById("content").style.opacity = "1";
};




//Function for adding superheros to favoruite list
function addToFavorites(superhero, characterImageURL, description) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some(item => item.superhero === superhero)) {
    const favoriteData = { superhero, characterImageURL, description};
    favorites.push(favoriteData);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// JavaScript: Fetch superhero names from Marvel API and provide suggestions
const apiUrl2 = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

let superheroNames = []; // Array to store superhero names

// Function to fetch superhero names from the Marvel API
function fetchSuperheroNames() {
  fetch(apiUrl2)
    .then(response => response.json())
    .then(data => {

      const characters = data?.data?.results;
      if (characters && characters.length > 0) {
        superheroNames = characters.map(character => character.name);
      } else {
        console.error("No characters found.");
      }
    })
    .catch(error => {
      console.error("Error fetching character data:", error);
    });
}

// Call the function to fetch superhero names
fetchSuperheroNames();

// Function to provide suggestions as the user types
function provideSuggestions(inputValue) {
  const filteredSuggestions = superheroNames.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = "";

  filteredSuggestions.forEach(suggestion => {
    const li = document.createElement("li");
    li.textContent = suggestion;
    li.addEventListener("click", () => {
      searchInput.value = suggestion;
      suggestionsList.innerHTML = ""; // Clear suggestions after selection
    });
    suggestionsList.appendChild(li);
  });
}

// Get the search input element
const searchInput = document.getElementById("searchInputBox");

// Listen for the "input" event on the search input
searchInput.addEventListener("input", () => {
  const inputValue = searchInput.value.trim();
  provideSuggestions(inputValue);
});

// Hide suggestions when clicking outside the input box
document.addEventListener("click", event => {
  if (event.target !== searchInput) {
    const suggestionsList = document.getElementById("suggestions");
    suggestionsList.innerHTML = "";
  }
});

//funstion to display superHeroModal
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



const scrollButton = document.getElementById("contact");
const targetElement = document.getElementById("contactFooter");

const superHeroNav = document.getElementById("superhero");
const targetSuperhero = document.getElementById("superHeroSection");

const modalContent = document.querySelector(".modal-content");

modalContent.addEventListener("click", event => {
  event.stopPropagation();
});



//Code for navigation inside the pages
superHeroNav.addEventListener("click", () => {
  targetSuperhero.scrollIntoView({ behavior: "smooth" });
});



scrollButton.addEventListener("click", () => {
  targetElement.scrollIntoView({ behavior: "smooth" });
});

searchButton.addEventListener("click", () => {
  targetSuperhero.scrollIntoView({ behavior: "smooth" });
});










