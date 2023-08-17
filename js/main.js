function getRandomIntegerBetween(minimumInteger, maximumInteger) {
    return Math.floor(Math.random() * maximumInteger) + minimumInteger;
}

function getRandomPokemonId() {
    return getRandomIntegerBetween(1, 500);
}

// create a promise for loading pokemon info
function getPokemonInfoPromise(pokemonId) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then((data) => {
            return {
                "pokemonName": data.name,
                "imageUrl": data.sprites.other.dream_world.front_default
            };
        });
}

// create a promise for loading a random activity suggestion
function getRandomActivityNamePromise(numberOfParticipants) {
    return fetch(`https://www.boredapi.com/api/activity?participants=${numberOfParticipants}`)
        .then(response => response.json())
        .then(data => data.activity);
}

function createNewEventCard() {
    let numberOfParticipants = getRandomIntegerBetween(1, 4);
    let pendingPromises = [getRandomActivityNamePromise(numberOfParticipants)]
    for (let i = 0; i < numberOfParticipants; i++) {
        pendingPromises.push(getPokemonInfoPromise(getRandomPokemonId()));
    }

    // wait until all network requests to finish before creating the new event card
    Promise.all(pendingPromises)
    .then(values => {
        let [activityName, ...pokemons] = values;

        // dynamically create the new event card element
        let eventCard = document.createElement("div");
        eventCard.classList.add("eventCard")
        eventCard.innerHTML = `
            <div class="paper-bg">
                <div class="imagesContainer"></div>
                <span class="activityName">${activityName}</span>
            </div>
        `;

        let imageContainer = eventCard.querySelector(".imagesContainer");

        // create an image element for each pokemon
        pokemons.forEach((pokemon, i) => {
            let pokemonImage = new Image(200, 200);
            pokemonImage.src = pokemon.imageUrl;
            imageContainer.append(pokemonImage);
        });

        document.getElementById("eventCardsList").append(eventCard);

        scrollToShowPlanButton();
    })
}

function scrollToShowPlanButton() {
    let planButtonOffsetTop = document.getElementById("planButton").offsetTop;

    // scroll to a position a bit higher than the plan button for convenient access
    window.scrollTo({
        top: planButtonOffsetTop - 200,
        behavior: 'smooth'
    });
}

// add event listeners after DOM has finished loading
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("planButton").addEventListener("click", createNewEventCard);
}, false);

