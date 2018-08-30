import Game from './Game'
import Player from './Player'

class Server {


	// Games[] games
	//

	// games[0].getPlayers
	constructor() {
		this.games = []

		this.games.push(
			new Game(
				new Player('toetoe', 1)
			)
		)
		this.games.push(
			new Game(
				new Player('barf', 2)
			)
		)
		this.games.push(
			new Game(
				new Player('foofoo', 3)
			)
		)
	}

	// Events Methods

	// on open connection
		// save the uuid
		// get nb rooms (states)

	onOpenConnection() {
		console.log("onOpenConnection");
		let joinableGames = [];

		this.games.forEach( game => {
			// console.log("foreach: ");
			// console.dir(game);
			if (!game.isPlaying) {
				joinableGames.push(game.getInfo())
			}
		});
		return joinableGames;
	}

	onSelectGame(player, gameID) {
		console.log("onSelectGame");
		// if (!gameId) {
			// create new game with player as host
			// let game = new Game(player.id)
		// } else {
			// add player to game
			// this.games[gameID].players.push(player);
		// }


		if (!this.games[gameID]) {
			this.games[gameID] = new Game(player);
		} else {
			this.games[gameID].players.push(player);
		}

		console.log("Number of player in the Game", gameID,": ", this.games[gameID].players.length);
	}

	// on select game,
		// add to game / create new game
		// update player info

	// on update game
		// update game info
		//


}

export default Server

// class Player {

	// socket id

// }
//
