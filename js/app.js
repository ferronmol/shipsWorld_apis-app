// Create a new WG
const wg = new WG();
// Init UI
const ui = new UI();

// nickname
const searchPlayer = document.querySelector("#searchPlayer");
// Selected server
const serverName = document.querySelector("#server");

const playerOptions = document.getElementById("playerOptions");

let selectedPlayer;

// Event listener for the searchPlayer
searchPlayer.addEventListener("keyup", (e) => {
  if (searchPlayer !== "") {
    wg.getPlayerID(searchPlayer.value, serverName.value)
      .then((data) => {
        //console.log(data.playerID);
        if (data.playerID.status !== "error") {
          if (data.playerID.data.length >= 2) {
            ui.fillNames(data.playerID.data);
            // selectedPlayer
            selectedPlayer = document.querySelector("#names");
          } else {
            // Only 1 result...
            const currentAccId = data.playerID.data[0].account_id;
            wg.getPlayerData(currentAccId, serverName.value)
              .then((player) => {
                console.log(player.playerData.data[currentAccId]);
                ui.playerData(player.playerData.data[currentAccId]);
              })
              .catch((err) => console.log(err));
            ui.emptyPlayerData();
            ui.emptyNames();
          }
        } else {
          // Create an error msg
          ui.emptyPlayerData();
          ui.emptyNames();
        }
        if (
          selectedPlayer !== "undefined" &&
          playerOptions.contains(selectedPlayer)
        ) {
          selectedPlayer.addEventListener("change", nameChange);
        }
      })
      .catch((err) => console.log(err));
  }
});

// if you select an option

function nameChange() {
  wg.getPlayerData(selectedPlayer.value, serverName.value).then((player) => {
    //console.log(player.playerData.data[selectedPlayer.value]);
    ui.playerData(player.playerData.data[selectedPlayer.value]);
  });
}
