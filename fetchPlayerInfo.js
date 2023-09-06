
async function fetchPlayerInfo(playerId) {
  try {
    // Fetch the player info
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const playerInfo = data.people[0];
    
    // Update card elements based on fetched player info
    const playerNameElementFront = document.getElementById("playerName");
    const playerNameElementBack = document.getElementById("player-name");

    playerNameElementFront.innerText = playerInfo.fullName;
    playerNameElementBack.innerText = playerInfo.fullName;

    // Update headshot background based on the team
    const headshotElement = document.getElementById("headshot");

    if (playerInfo.currentTeam && playerInfo.currentTeam.id) {
      const teamLogoURL = `https://cdn.freebiesupply.com/logos/large/2x/${playerInfo.currentTeam.name
        .toLowerCase()
        .replace(/ /g, "-")}-logo.png`;
      headshotElement.style.backgroundImage = \`url(${teamLogoURL})\`;
    }

    // Adjust font size for long names
    if (playerInfo.fullName.length > 17) {
      playerNameElementFront.style.fontSize = "0.8rem";
      playerNameElementBack.style.fontSize = "0.8rem";
    }
    
    // Update primary and secondary colors
    updateTeamColors(playerInfo);

    // Update other card elements
    // ... (this part remains unchanged)

  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Assuming teamColors is a global object containing the color data
function updateTeamColors(playerInfo) {
  const teamName = playerInfo.currentTeam.name;
  if (teamColors[teamName]) {
    const primaryColor = \`#${teamColors[teamName][0]}\`;
    const secondaryColor = \`#${teamColors[teamName][1]}\`;
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  }
}

// Load team colors (assuming this is done somewhere in your code)
// ... (code to populate the teamColors object)
