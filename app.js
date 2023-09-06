// Declare teamColors as a global variable at the top of your script
let teamColors = {};

// Fetch and populate the teamColors variable
fetch("colors.json")
  .then((response) => response.json())
  .then((data) => {
    // Populate the global teamColors variable
    data.forEach((team) => {
      teamColors[team.name] = team.colors.hex;
    });
  })
  .catch((error) => {
    console.error("There was a problem loading the team colors:", error);
  });

document.addEventListener("DOMContentLoaded", function () {
  const flipCard = document.getElementById("flip-card");
  const flipCardInner = document.querySelector(".flip-card-inner");

  flipCard.addEventListener("click", function () {
    flipCardInner.classList.toggle("flipped");
  });
});

async function fetchTeams() {
  const teamDropdown = document.getElementById("teamDropdown");
  try {
    const response = await fetch("https://statsapi.web.nhl.com/api/v1/teams");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const teams = data.teams;

    // Clear any existing options in the dropdown
    teamDropdown.innerHTML = "";

    // Populate the dropdown with teams
    teams.forEach((team) => {
      const option = document.createElement("option");
      option.value = team.id;
      option.text = team.name;
      teamDropdown.add(option);
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function fetchRoster(teamId) {
  const playerDropdown = document.getElementById("playerDropdown"); // Assume you have a dropdown with this id
  try {
    const response = await fetch(
      `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const roster = data.roster;

    // Clear any existing options in the dropdown
    playerDropdown.innerHTML = "";

    // Populate the dropdown with players
    roster.forEach((player) => {
      const option = document.createElement("option");
      option.value = player.person.id;
      option.text = player.person.fullName;
      playerDropdown.add(option);
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
async function fetchPlayerInfo(playerId) {
  try {
    const response = await fetch(
      `https://statsapi.web.nhl.com/api/v1/people/${playerId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const playerInfo = data.people[0];
    console.log(playerInfo);
    const playerNameElementFront = document.getElementById("playerName");
    const playerNameElementBack = document.getElementById("player-name");

    playerNameElementFront.innerText = playerInfo.fullName;
    playerNameElementBack.innerText = playerInfo.fullName;
    // Update headshot background based on the team
    const headshotElement = document.getElementById("headshot");
    const teamId = playerInfo.currentTeam.id;

    if (teamId) {
      const teamLogoURL = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;
      headshotElement.style.backgroundImage = `url(${teamLogoURL})`;
      headshotElement.style.backgroundPosition = "bottom";
    }

    // Adjust font size for long names
    if (playerInfo.fullName.length > 17) {
      // Adjust the length threshold as needed
      playerNameElementFront.style.fontSize = "1.1rem";
      playerNameElementBack.style.fontSize = "0.8rem";
    } else {
      //   playerNameElementFront.style.fontSize = "1rem"; // Reset to default size
      //   playerNameElementBack.style.fontSize = "1rem"; // Reset to default size
    }
    updateTeamColors(playerInfo);
    const playerImageElement = document.getElementById("playerImage");
    const playerImageURL = `https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.png`;
    const teamLogoURL = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;

    // Update card front
    document.getElementById("playerNumber").innerText =
      playerInfo.primaryNumber || "-";
    // document.getElementById("playerName").innerText = playerInfo.fullName;
    document.getElementById("playerPosition").innerText =
      playerInfo.primaryPosition.abbreviation;
    document.getElementById("playerImage").src = playerImageURL;
    playerImageElement.onerror = function () {
      // Set the src to the team logo if the player image fails to load
      playerImageElement.src = teamLogoURL;
    };
    // `https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.png`;
    document.getElementById(
      "playerTeam"
    ).src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;

    // Update card back
    // document.getElementById("player-name").innerText = playerInfo.fullName;
    document.getElementById("player-number").innerText =
      playerInfo.primaryNumber ? `#${playerInfo.primaryNumber}` : "-";

    document.getElementById("player-position").innerText =
      playerInfo.primaryPosition.name;
    document.getElementById("playerHometown").innerText = [
      playerInfo.birthCity,
      playerInfo.birthStateProvince,
      playerInfo.birthCountry,
    ]
      .filter(Boolean)
      .join(", ");
    document.getElementById(
      "playerAge"
    ).innerText = `Age: ${playerInfo.currentAge}`;
    document.getElementById(
      "playerHeight"
    ).innerText = `Height: ${playerInfo.height}`;
    document.getElementById(
      "playerWeight"
    ).innerText = `Weight: ${playerInfo.weight} lbs`;
    document.getElementById(
      "playerHanded"
    ).innerText = `Shoots: ${playerInfo.shootsCatches}`;
    // document.getElementById(
    //   "headshot"
    // ).src = `https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.png`;
    headshotElement.src = playerImageURL;

    // Use the onerror event to handle image loading errors
    headshotElement.onerror = function () {
      // Set the src to the team logo if the player image fails to load
      headshotElement.src = "";
    };
    document.getElementById(
      "team-logo"
    ).src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg`;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Assuming teamColors is a global object containing the color data
function updateTeamColors(playerInfo) {
  const teamName = playerInfo.currentTeam.name;
  if (teamColors[teamName]) {
    const primaryColor = `#${teamColors[teamName][0]}`;
    const secondaryColor = `#${teamColors[teamName][1]}`;
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--secondary-color",
      secondaryColor
    );
  }
}

function setDefaultStats() {
  const statValues = document.querySelectorAll(".stat-value");
  statValues.forEach((statValue) => {
    statValue.innerText = "-";
  });
}

// Fetch and display player stats for the 2022-2023 season
async function fetchPlayerStats(playerId) {
  try {
    const response = await fetch(
      `https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20222023`
    );
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    const data = await response.json();

    // Check if there are stats available
    if (
      data.stats &&
      data.stats[0] &&
      data.stats[0].splits &&
      data.stats[0].splits[0]
    ) {
      const seasonStats = data.stats[0].splits[0].stat;

      // Update card back with stats
      document.querySelector("#gamesPlayed .stat-value").innerText =
        seasonStats.games || "-";
      document.querySelector("#timeonicegames .stat-value").innerText =
        seasonStats.timeOnIcePerGame || "-";
      document.querySelector("#assists .stat-value").innerText =
        seasonStats.assists || "-";
      document.querySelector("#goals .stat-value").innerText =
        seasonStats.goals || "-";
      document.querySelector("#pim .stat-value").innerText =
        seasonStats.pim || "-";
      document.querySelector("#shots .stat-value").innerText =
        seasonStats.shots || "-";
      document.querySelector("#points .stat-value").innerText =
        seasonStats.points || "-";
      document.querySelector("#plusminus .stat-value").innerText =
        seasonStats.plusMinus || "-";
      document.querySelector("#powerplaygoals .stat-value").innerText =
        seasonStats.powerPlayGoals || "-";
      document.querySelector("#powerplaypoints .stat-value").innerText =
        seasonStats.powerPlayPoints || "-";
      document.querySelector("#hits .stat-value").innerText =
        seasonStats.hits || "-";
      document.querySelector("#shifts .stat-value").innerText =
        seasonStats.shifts || "-";
      document.querySelector("#shotpercentage .stat-value").innerText =
        seasonStats.shotPct || "-";
      document.querySelector("#gamewingoals .stat-value").innerText =
        seasonStats.gameWinnignGoals || "-";
      document.querySelector("#overtimegoals .stat-value").innerText =
        seasonStats.overtimeGoals || "-";
      document.querySelector("#faceoffpct .stat-value").innerText =
        seasonStats.faceoffPct || "-";
      document.querySelector("#shorthandedgoals .stat-value").innerText =
        seasonStats.shortHandedGoals || "-";
      document.querySelector("#shorthandedpoints .stat-value").innerText =
        seasonStats.shortHandedPoints || "-";
      document.querySelector("#faceoffpct .stat-value").innerText =
        seasonStats.faceoffPct || "-";
      document.querySelector("#blocked .stat-value").innerText =
        seasonStats.blocked || "-";
      document.querySelector("#shorthandedtimeonice .stat-value").innerText =
        seasonStats.shortHandedTimeOnIce || "-";
      // ... (other stats fields, update as needed)
    } else {
      console.log(
        "No stats data available for this player in the 2022-2023 season"
      );
      setDefaultStats();
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Initialize dropdowns and set up event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the teams dropdown
  fetchTeams();

  // Set up event listener for team selection
  const teamDropdown = document.getElementById("teamDropdown");
  teamDropdown.addEventListener("change", function () {
    const selectedTeamId = this.value;
    if (selectedTeamId) {
      fetchRoster(selectedTeamId);
    }
  });

  // Set up event listener for player selection
  const playerDropdown = document.getElementById("playerDropdown");
  playerDropdown.addEventListener("change", function () {
    const selectedPlayerId = this.value;
    if (selectedPlayerId) {
      fetchPlayerInfo(selectedPlayerId);
      fetchPlayerStats(selectedPlayerId);
    }
  });
});
