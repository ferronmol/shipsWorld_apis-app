class WG {
  constructor() {
    // this.application_id = "97f4b2c203d63f5db6fd508661fe5ba8";
    this.application_id = "96b472d7bdc2aad0591a995d4ac74b08";
  }
  // Get the actual player's id
  async getPlayerID(playerName, server) {
    const response = await fetch(
      `https://api.worldofwarships.${server}/wows/account/list/?application_id=${this.application_id}&search=${playerName}`
    );

    const playerID = await response.json();

    return {
      playerID,
    };
  }

  // Get a specified player's data
  async getPlayerData(account_id, server) {
    const response = await fetch(
      `https://api.worldofwarships.${server}/wows/account/info/?application_id=${this.application_id}&account_id=${account_id}`
    );

    const playerData = await response.json();

    return {
      playerData,
    };
  }

  // Get clan details
  async getClanDetails() {}
}
