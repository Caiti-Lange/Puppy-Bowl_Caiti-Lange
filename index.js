// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2508-Caiti"; // Make sure to change this!
const API = BASE + COHORT;

// === State ===
let puppies = [];
let teams = [];
let selectedPuppy = {};

/** Get all players */
const getPuppies = async () => {
  try {
    const res = await fetch(`${API}/players`);
    const result = await res.json();
    puppies = result.data.players;
  } catch (err) {
    console.log("error");
  }
};

getPuppies();

/** Get a player by ID */
const getPlayerId = async (id) => {
  try {
    const res = await fetch(`${API}/players/${id}`);
    const result = await res.json();
    selectedPuppy = result;
  } catch (err) {
    console.log("error");
  }
};

getPlayerId();

/** Invite a new player
 * @param {Player} Player - invites new player
 */
const addPlayer = async (player) => {
  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify(player),
    });
  } catch (err) {
    console.log(err);
  }
};

addPlayer();

/** Remove a player by ID
 * @param {string | number} id
 */
async function removePlayer(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    //clear selected player
    selectedPuppy = null;

    getPuppies();
  } catch (err) {
    console.log(err);
  }
}

/** Get all teams */
const getTeams = async (teams) => {
  try {
    const res = await fetch(`${API}/teams`);
    const result = await res.json();
    teams = result;
  } catch (err) {
    console.log("error");
  }
};

getTeams();


// === Components ===

/** Puppy name that shows more details about the puppy when clicked */
function PuppyListItem(puppy) {
  const $li = document.createElement("li");
  console.log(puppy)
  $li.innerHTML = `
    <a href="#selected">${puppy.name}</a>
  `;
  $li.addEventListener("click", () => {
    getPlayerId(puppy.id)
    PuppyDetails(puppy)
  });
  
  return $li;
};

/** A list of names of all puppies */
function PuppyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("PuppyRoster")

  const puppies = puppies.map((puppy) => PuppyListItem(puppy));
  $ul.replaceChildren(...puppies);

  return $ul;
}

/** Detailed information about the selected player */
function PuppyDetails(puppy) {
  if (!selectedPuppy) {
    const p = document.createElement("p");
    p.textcontent = "Please select a player to learn more.";
    return p;
  }

  const puppy = document.querySelector("selected");
  puppy.classList.add("puppy");
  console.log("PLAYER DETAILS", puppy);
  puppy.innerHTML = `
    <h3>${puppy.name} #${puppy.id}</h3>
    <p>${puppy.decription}</p>
    <button>RemovePlayer</button>
  `;

  return puppy;
}

function NewPuppyForm()

// === Render ===

function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
  <h1>Puppy Bowl</h1>
    <main>
      <section>
        <h2>Player Roster</h2>
        <PuppyList></PuppyList>
        <h3>Add a New Player</h3>
        <NewPlayerForm></NewPlayerForm>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <PuppyDetails></PuppyDetails>
      </section>
    </main>
  `;
  $app.querySelector("PuppyList").replaceWith(PuppyList());
  $app.querySelector("NewPlayerForm").replaceWith(NewPlayerForm());
  $app.querySelector("PuppyDetails").replaceWith(PuppyDetails());
}

async function init() {
  await getParties();
  render();
}

init();