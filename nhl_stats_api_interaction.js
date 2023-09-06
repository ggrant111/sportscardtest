const BASE_URL = "https://statsapi.web.nhl.com/api/v1";

let playerId; // Global variable to store the ID of the currently selected player

// Function to fetch all teams
function fetchAllTeams() {
  fetch(`${BASE_URL}/teams`)
    .then((response) => response.json())
    .then((data) => displayTeams(data.teams))
    .catch((error) => console.error("Error fetching teams:", error));
}

// Function to display all teams
function displayTeams(teams) {
  const resultsArea = document.getElementById("results");
  let teamListHTML = "<ul>";
  for (const team of teams) {
    teamListHTML += `<li><a href="#" onclick="getPlayersByTeam(${team.id})">${team.name}</a></li>`;
  }
  teamListHTML += "</ul>";
  resultsArea.innerHTML = teamListHTML;
}

function getTeamsByDivision() {
  clearResults(); // Clear previous results first
  const divisions = [
    { id: 17, name: "Atlantic" },
    { id: 18, name: "Central" },
    { id: 16, name: "Metropolitan" },
    { id: 15, name: "Pacific" },
  ];
  const resultsElement = document.getElementById("results");
  divisions.forEach((division) => {
    const divisionLink = document.createElement("a");
    divisionLink.href = "#";
    divisionLink.textContent = division.name;
    divisionLink.onclick = () => getTeamsInDivision(division.id);
    resultsElement.appendChild(divisionLink);
    resultsElement.appendChild(document.createElement("br")); // New line
  });
}

async function getTeamsInDivision(divisionId) {
  try {
    const response = await fetch(`${BASE_URL}/teams`);
    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }
    const data = await response.json();
    const teamsInDivision = data.teams.filter(
      (team) => team.division.id === divisionId
    );
    displayTeams(teamsInDivision);
  } catch (error) {
    displayError(error);
  }
}

function clearResults() {
  const resultsElement = document.getElementById("results");
  resultsElement.innerHTML = "";
}
function getAllPositions() {
  const positions = [
    "Center",
    "Left Wing",
    "Right Wing",
    "Defenseman",
    "Goalie",
  ];
  const resultsElement = document.getElementById("results");
  resultsElement.innerHTML = ""; // Clear previous results
  positions.forEach((position) => {
    const positionLink = document.createElement("a");
    positionLink.href = "#";
    positionLink.textContent = position;
    positionLink.onclick = () => getPlayersByPosition(position);
    resultsElement.appendChild(positionLink);
    resultsElement.appendChild(document.createElement("br")); // New line
  });
}

async function getPlayersByPosition(position) {
  try {
    const response = await fetch(`${BASE_URL}/teams`);
    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }
    const data = await response.json();
    const teamIds = data.teams.map((team) => team.id);
    let allPlayers = [];

    for (const teamId of teamIds) {
      const rosterResponse = await fetch(`${BASE_URL}/teams/${teamId}/roster`);
      const rosterData = await rosterResponse.json();
      const playersOfPosition = rosterData.roster.filter(
        (player) => player.position.name === position
      );
      allPlayers = allPlayers.concat(playersOfPosition);
    }

    displayRosterByPosition(allPlayers);
  } catch (error) {
    displayError(error);
  }
}

function displayRosterByPosition(players) {
  const resultsElement = document.getElementById("results");
  resultsElement.innerHTML = ""; // Clear previous results
  players.forEach((playerEntry) => {
    const playerLink = document.createElement("a");
    playerLink.href = "#";
    playerLink.textContent = playerEntry.person.fullName;
    playerLink.onclick = () => getPlayerInfo(playerEntry.person.id);
    resultsElement.appendChild(playerLink);
    resultsElement.appendChild(document.createElement("br")); // New line
  });
}

// Function to fetch players by team
function getPlayersByTeam(teamId) {
  fetch(`${BASE_URL}/teams/${teamId}/roster`)
    .then((response) => response.json())
    .then((data) => displayPlayers(data.roster))
    .catch((error) => console.error("Error fetching players:", error));
}

// Function to display players
function displayPlayers(players) {
  const resultsArea = document.getElementById("results");
  let playerListHTML = "<ul>";
  for (const player of players) {
    playerListHTML += `<li><a href="#" onclick="getPlayerInfo(${player.person.id})">${player.person.fullName}</a></li>`;
  }
  playerListHTML += "</ul>";
  resultsArea.innerHTML = playerListHTML;
}

function goBack() {
  const lastView = navigationStack.pop();
  if (lastView === "teams") {
    clearResults();
  } else if (lastView === "roster") {
    getTeamsData();
  } else if (lastView === "player") {
    const teamId = document.getElementById("teamId").value;
    getTeamRoster(teamId);
  }
}
// Function to fetch player info and stats
function getPlayerInfo(playerId) {
  fetch(
    `${BASE_URL}/people/${playerId}?expand=person.stats&stats=statsSingleSeason&season=20202021`
  )
    .then((response) => response.json())
    .then((data) => formatAndDisplayPlayer(data))
    .catch((error) => console.error("Error fetching player info:", error));
}

// Function to format and display player info and stats
function formatAndDisplayPlayer(data) {
  playerId = data.people[0].id; // Store the player's ID in the global variable
  const resultsArea = document.getElementById("results");
  if (
    !data.stats ||
    !data.stats[0].splits ||
    data.stats[0].splits.length === 0
  ) {
    resultsArea.innerHTML =
      "No data available for this player with the chosen modifier.";
    return;
  }
  const stats = data.stats[0].splits[0].stat;
  let tableHTML = "<table><thead><tr>";
  for (const key in stats) {
    tableHTML += `<th>${key}</th>`;
  }
  tableHTML += "</tr></thead><tbody><tr>";
  for (const key in stats) {
    tableHTML += `<td>${stats[key]}</td>`;
  }
  tableHTML += "</tr></tbody></table>";
  resultsArea.innerHTML = tableHTML;
}

// Function to fetch player stats with a given modifier
function fetchPlayerStatsWithModifier(modifier) {
  if (!playerId) {
    alert("Please select a player first.");
    return;
  }
  fetch(`${BASE_URL}/people/${playerId}/stats?${modifier}`)
    .then((response) => response.json())
    .then((data) => formatAndDisplayPlayer(data))
    .catch((error) =>
      console.error("Error fetching player stats with modifier:", error)
    );
}

// Event listeners for the modifier buttons
document
  .getElementById("yearByYear")
  .addEventListener("click", () =>
    fetchPlayerStatsWithModifier("stats=yearByYear")
  );
document
  .getElementById("homeAndAway")
  .addEventListener("click", () =>
    fetchPlayerStatsWithModifier("stats=homeAndAway&season=20162017")
  );
// ... (add similar lines for other buttons)

// Initial call to fetch and display all teams
fetchAllTeams();
