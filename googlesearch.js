const fetchPlayerImage = async (playerName) => {
  const apiKey = "AIzaSyAKI7duqzUhaZ7cQAOFE64_xhxJTroJfFY";
  const searchEngineId = "31f64cbdac70941fa";
  const query = `${playerName} NHL`;

  const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${searchEngineId}&key=${apiKey}&searchType=image`;

  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    const firstImageLink = data.items[0].link;

    // Now set this link as the src for your image element
    document.getElementById("playerImage").src = firstImageLink;
  } else {
    console.error("Failed to fetch player image.");
  }
};

fetchPlayerImage("Wayne Gretzky");
