// get json parsed rankings using ajax
function startDraft () {
	// http://localhost/keeper/rankings.json
	// http://trevorpostma.com/keeper/rankings.json
	var url = 'http://trevorpostma.com/keeper/rankings.json';
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			if (xhr.status === 200) {
				NAMESPACE.rankings = JSON.parse(xhr.responseText);
			} else if (xhr.status === 404) {
				console.log("404 error: file not found");
			} else if (xhr.status === 500) {
				console.log("500 error: server had a problem");
			};
		};
	};
	xhr.open('GET', url, false);
	xhr.send();
}

// configure the draft
function config (preset) {
	// preset parameter used when a BIB member clicks on the preset link in the configuration form

	// permit the preset parameter to be optional
	if (!preset) {
		var preset = "";
	};

	// get the configuration dropdowns
	var keepers = document.getElementById('configKeepers');
	var teams = document.getElementById('configTeams');

	// custom presets for Bros Icing Bros
	if (preset == "bib") {
		keepers.value = 2;
		teams.value = 10;
		var players = [["Jimmy Graham", 2], ["Jordy Nelson", 5], ["Alshon Jeffery", 12], [""], ["Rob Gronkowski", 5], ["Percy Harvin", 14], ["Montee Ball", 7], ["DeMarco Murray", 8], ["Keenan Allen", 13], ["Cam Newton", 14], ["Giovani Bernard", 6], ["Andrew Luck", 11], ["Adrian Peterson", 1], [""], ["Jamaal Charles", 1], ["LeSean McCoy", 2], ["Calvin Johnson", 1], ["Andre Ellington", 13], ["Eddie Lacy", 4], ["Dez Bryant", 7]];
	};

	// parent of the all the keeper selection dropdowns
	var parent = document.getElementById('selectKeepers');
	
	// remove all keeper dropdowns when a configuration change occurs
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}

	// only need to display teams for selection if keepers are required
	if (keepers.value > 0) {

		// create keeper dropdowns for each team
		for (var i = 0; i < teams.value; i++) {
			
			// team titles
			var teamNumber = i + 1;
			var team = document.createElement('p');
			var teamText = document.createTextNode("Team " + teamNumber);
			team.appendChild(teamText);
			parent.appendChild(team);

			// populate the dropdown options
			for (var j = 0; j < keepers.value; j++) {

				// establish an id and class for each keeper player, for easy reference
				var keeperNumber = j + 1;
				var selectKeeper = document.createElement('select');
				selectKeeper.id = "t" + teamNumber + "k" + keeperNumber;
				selectKeeper.className = "keeperData";

				// set a blank default keeper option
				var defaultKeeper = document.createElement('option');
				defaultKeeper.value = "";
				defaultKeeper.textContent = "--select keeper--";
				selectKeeper.appendChild(defaultKeeper);

				// add each player as an option
				for (var n=0; n < NAMESPACE.rankings.length; n++) {
					var keeperOpt = document.createElement('option');
					keeperOpt.value = NAMESPACE.rankings[n]["Position "] + " " + NAMESPACE.rankings[n][" Player Name "] + " " + NAMESPACE.rankings[n]["Team "];
					keeperOpt.textContent = NAMESPACE.rankings[n][" Player Name "];
					selectKeeper.appendChild(keeperOpt);
				}

				// establish an id and class for each round, for easy reference
				var selectRound = document.createElement('select');
				selectRound.id = "t" + teamNumber + "k" + keeperNumber + "round";
				selectRound.className = "keeperData";

				// set a blank default round option
				var defaultRound = document.createElement('option');
				defaultRound.value = "";
				defaultRound.textContent = "--select round--";
				selectRound.appendChild(defaultRound);

				// add the round options
				for (var k = 0; k < 15; k++) {
					var roundOpt = document.createElement('option');
					var round = k + 1;
					roundOpt.value = round;
					roundOpt.textContent = round;
					selectRound.appendChild(roundOpt);
				}

				// append it all
				parent.appendChild(selectKeeper);
				parent.appendChild(selectRound);
				var newLine = document.createElement('br');
				parent.appendChild(newLine);
			}
		}
	}; // end of if
	
	// update the keeper and round dropdowns if it's a BIB member
	if (preset == "bib") {

		// team number
		var t = 1;

		// get the dropdown values
		for (var m = 0; m < (players.length * 2); m+=2) {
			// player[m][keeper, round]

			// get the first keeper
			var player1 = document.getElementById('t' + t + 'k1');
			
			// account for an empty keeper
			if (player1 == null) {
				break;
			};
			
			// check each option to find keeper player
			for (var o = 0; o < player1.options.length; o++) {
				if (player1.options[o].text == players[m][0]) {
					player1.selectedIndex = o;
					break;
				};
			}
			
			// set the round for the first keeper
			document.getElementById('t' + t + 'k1round').value = players[m][1];

			// get the second keeper
			var player2 = document.getElementById('t' + t + 'k2');

			// account for an empty keeper
			if (player2 == null) {
				break;
			};

			// check each option to find keeper player
			for (var p = 0; p < player2.options.length; p++) {
				if (player2.options[p].text == players[m+1][0]) {
					player2.selectedIndex = p;
					break;
				};
			}

			// set the round for the second keeper
			document.getElementById('t' + t + 'k2round').value = players[m+1][1];

			// go to the next team
			t++;
		}

		// autosubmit the bib presets
		configSubmit();

	}; // end if
}

// submit the selected keepers and rounds
function configSubmit () {

	// get the configuration dropdowns
	var keepers = document.getElementById('configKeepers');
	var teams = document.getElementById('configTeams');

	// create a keeper object to store the settings
	NAMESPACE.keeperObj = {};
	NAMESPACE.keeperObj.teams = teams.value;
	NAMESPACE.keeperObj.keepers = keepers.value;
	NAMESPACE.keeperObj.pairs = [];

	// team needs are stored in an object
	if (teams.value == 10) {
		NAMESPACE.teams = {
			team1: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team2: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team3: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team4: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team5: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team6: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team7: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team8: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team9: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team10: {qb: 1, rb: 2, wr: 3, te:1, count: 0}
		};
	} else if (teams.value == 12) {
		NAMESPACE.teams = {
			team1: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team2: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team3: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team4: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team5: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team6: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team7: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team8: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team9: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team10: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team11: {qb: 1, rb: 2, wr: 3, te:1, count: 0},
			team12: {qb: 1, rb: 2, wr: 3, te:1, count: 0}
		};
	} else {
		NAMESPACE.teams = {};
	};

	// get all keeper data elements (keepers and rounds)
	var keeperData = document.getElementsByClassName("keeperData");

	// pair each keeper with their correct round and store the data in an array
	var pairs = [];
	for (var i = 0; i < keeperData.length; i +=2) {
		pairs.push([keeperData[i].value, keeperData[i + 1].value]);
	}

	// counters
	var teamCount = 0;
	var pick;

	// add each keepers team number and overall pick to the array of keepers
	for (var j = 0; j < pairs.length; j++) {

		// add team number to each keeper
		if (j % keepers.value == 0) {
			teamCount++;
		};
		pairs[j].push(teamCount);

		// add overall pick number to each keeper
		if (pairs[j][1] % 2 == 0) {
			// even rounds = teams * (round - 1) + teams - teamNumber + 1
			pick = teams.value * (pairs[j][1] - 1) + (teams.value - teamCount + 1);
		} else {
			// odd rounds = teams * (round - 1) + teamNumber
			pick = teams.value * (pairs[j][1] - 1) + teamCount;
		};
		pairs[j].push(pick);
	}

	// add the array of keepers to the keeper object
	NAMESPACE.keeperObj.pairs = pairs;

	// remove the form from the dom
	var form = document.getElementById('form');
	form.remove();

	// remove the keepers from the dom
	removeKeepers();

	// display the teams for selection
	displayTeams();
}

// remove selected keepers from the list of available players
function removeKeepers () {

	// [pos player name team, round, team#, overallPick]
	var keepers = NAMESPACE.keeperObj.pairs;

	// remove each player
	for (var i = 0; i < keepers.length; i++) {
		var player = keepers[i][0];
		offTheBoard(player);
	}
}

// remove the selected player from the official rankings
function offTheBoard (player) {
	for (var i = 0; i < NAMESPACE.rankings.length; i++) {
		if (player.indexOf(NAMESPACE.rankings[i][" Player Name "]) > -1) {
			NAMESPACE.rankings.splice(i, 1);
		}
	}
}

// display the teams for selection
function displayTeams () {

	// get the parent div
	var parent = document.getElementById('teams');

	// update the instructions
	var instructions = document.getElementById('instructions');
	instructions.textContent = "Select your team.";

	// add the team headers and empty positions
	for (var i = 0; i < NAMESPACE.keeperObj.teams; i++) {
		
		// each team gets it's own div
		var div = document.createElement('div');
		div.id = "team" + (i + 1);
		
		// add the clickable team headers
		var anchor = document.createElement('a');
		anchor.href = "javascript:void(0)";
		anchor.className = "teamHeader";
		anchor.textContent = "Team " + (i + 1);

		// create an empty team structure
		var p1 = document.createElement('p');
		p1.className = "qb";
		var p2 = document.createElement('p');
		p2.className = "rb";
		var p3 = document.createElement('p');
		p3.className = "rb";
		var p4 = document.createElement('p');
		p4.className = "wr";
		var p5 = document.createElement('p');
		p5.className = "wr";
		var p6 = document.createElement('p');
		p6.className = "wr";
		var p7 = document.createElement('p');
		p7.className = "te";
		var p8 = document.createElement('p');
		p8.className = "dst";
		var p9 = document.createElement('p');
		p9.className = "k";

		// append that shit
		div.appendChild(anchor);
		div.appendChild(p1);
		div.appendChild(p2);
		div.appendChild(p3);
		div.appendChild(p4);
		div.appendChild(p5);
		div.appendChild(p6);
		div.appendChild(p7);
		div.appendChild(p8);
		div.appendChild(p9);
		parent.appendChild(div);
	}

	// add onclicks to each team dynamically so that 'this' refers to the element rather than window
	addTeamClicks();
}

// add onclick events to all the team headers when selecting teams
function addTeamClicks () {
	var getTeams;

	// get all team headers
	getTeams = document.getElementsByClassName('teamHeader');
	
	// add onclick event to each team name
	for (var j = 0; j < getTeams.length; j++) {
		getTeams[j].onclick = selectTeam;
	};
}

// get the user's team
function selectTeam () {
	var oldHeaders, newHeaders, newText, parent, team1Div, myTeamDiv, parentDiv;

	// update the instructions
	var instructions = document.getElementById('instructions');
	instructions.textContent = "Select your players.";

	// get the user's team
	NAMESPACE.myTeam = this.parentNode.id;

	// get all the old headers
	oldHeaders = document.getElementsByClassName('teamHeader');

	// track the team number to be added to the header
	var teamNumber = 1;

	// declare count before oldHeaders.length begins to decrease
	var count = oldHeaders.length;

	// replace the 'old' clickable headers with 'new' non-clickable headers
	for (var i = 0; i < count; i++) {

		// create a new header with the appropriate team name
		newHeaders = document.createElement('h2');
		newText = document.createTextNode("Team " + teamNumber);
		newHeaders.appendChild(newText);

		// get the parent of the old header
		parent = oldHeaders[0].parentNode;

		// swap the headers
		parent.replaceChild(newHeaders, oldHeaders[0]);

		teamNumber++;

	};

	// move the user's team to the top
	team1Div = document.getElementById('team1');
	myTeamDiv = document.getElementById(NAMESPACE.myTeam);
	myTeamDiv.style.background = '#ffa';
	parentDiv = team1Div.parentNode;
	parentDiv.insertBefore(myTeamDiv, team1Div);

	// remove the previously selected keepers from the list of available players
	removeKeepers();

	// add the previously selected keepers to their teams
	addKeepers();

	// display the list of players available to be drafted
	availablePlayersHeader();
	availablePlayers(NAMESPACE.rankings, 'all');

	// begin simulation
	simulate();
}

// add the selected keepers to their teams
function addKeepers () {
	var player, position, element;

	// [pos player name team, round, team#, overallPick]
	var keepers = NAMESPACE.keeperObj.pairs;

	// add each player to their team
	for (var i = 0; i < keepers.length; i++) {

		// go to next keeper if this keeper is empty
		if (keepers[i][0] == "") {
			continue;
		};

		// player name with a keeper indicator
		player = keepers[i][0] + " - k";

		// player position
		position = player.substr(0, player.indexOf(' '));

		// player's team element
		element = document.getElementById("team" + keepers[i][2]);
		
		// add the player to their team
		addPlayer(element, player, position);

		// update the needs of the player's team
		NAMESPACE.teams["team" + keepers[i][2]][position.toLowerCase()] -= 1;
		NAMESPACE.teams["team" + keepers[i][2]]["count"] += 1;
	}
}

// create a header for the list of available players, which permits filtering the list
function availablePlayersHeader () {
	var parent = document.getElementById('players');
	var header = document.createElement('h2');
	header.textContent = "Available Players";
	var ul = document.createElement('ul');
	var filters = ["all", "qb", "rb", "wr", "te", "dst", "k"];

	// create a menu item for each filter
	for (var i = 0; i < filters.length; i++) {
		var li = document.createElement('li');
		var anchor = document.createElement('a');
		anchor.href = "javascript:void(0)";
		anchor.id = filters[i];
		anchor.onclick = function () {
			filter(this);
		};
		anchor.textContent = filters[i].toUpperCase();
		li.appendChild(anchor)
		ul.appendChild(li);
	}

	// append the header and the filter menu to the available players div
	parent.appendChild(header);
	parent.appendChild(ul);
}

// filter the list of available players based on which position is selected
function filter (element) {

	// get the id/position of the link/element selected
	var filterBy = element.id;

	// list players based on the position selected
	availablePlayers(NAMESPACE.rankings, filterBy);
}

// list all available players
function availablePlayers (r, position) {
	var playerRank, playerName, playerPosition, playerTeam, p, text, anchor, link;
	var parent = document.getElementById('players');
	var children = parent.getElementsByTagName('p');

	// clear the list after each selection
	while (children[0] != undefined) {
		children[0].remove();
	};

	// get all the available players from the official rankings
	for (var rank = 0; rank < r.length; rank++) {

		// the required data for each player
		playerRank = r[rank]["ADP "];
		playerName = r[rank][" Player Name "];
		playerPosition = r[rank]["Position "];
		playerTeam = r[rank]["Team "];

		// add a player if they match the position filter, or if all is selected
		if (playerPosition.toLowerCase() == position || position == 'all') {
			p = document.createElement("p");
			text = document.createTextNode(playerRank + ". ");
			anchor = document.createElement("a");
			link = document.createTextNode(
				playerPosition + " " +
				playerName + " " +
				playerTeam + " ");
			anchor.appendChild(link);
			anchor.href = "javascript:void(0)";
			anchor.id = "p" + r[rank]["ADP "];
			p.appendChild(text);
			p.appendChild(anchor);
			parent.appendChild(p);
		};
	};

	// add onclick events to each player
	addPlayerClicks();
}

// add the onclick event to all the list of available players
function addPlayerClicks () {
	var parent, playerCount, element;

	// get the number of child elements so you know how many onclicks to add
	parent = document.getElementById('players');
	var children = parent.getElementsByTagName('p');
	
	// add the onclicks
	for (var i = 0; i < children.length; i++) {
		children[i].onclick = select;
	}
}

// autodraft until the users next pick
function simulate () {
	var parent, nextPlayerNode, nextPlayerAnchor, nextPlayer, para, text, element, order, forward, reverse,position, player;

	var teams = NAMESPACE.keeperObj.teams;
	// create the available draft orders to account for a serpentine format
	if (teams == 10) {
		forward = ["team1", "team2", "team3", "team4", "team5", "team6", "team7", "team8", "team9", "team10"];
		reverse = ["team10", "team9", "team8", "team7", "team6", "team5", "team4", "team3", "team2", "team1"];
	} 
	if (teams == 12) {
		forward = ["team1", "team2", "team3", "team4", "team5", "team6", "team7", "team8", "team9", "team10","team11", "team12"];
		reverse = ["team12", "team11", "team10", "team9", "team8", "team7", "team6", "team5", "team4", "team3", "team2", "team1"];
	};

	// change direction and reset pick count if necessary
	if (NAMESPACE.pick >= forward.length && NAMESPACE.direction == "forward") {
		NAMESPACE.pick = 0;
		NAMESPACE.direction = "reverse";
		NAMESPACE.round++;
	} else if (NAMESPACE.pick >= forward.length && NAMESPACE.direction == "reverse") {
		NAMESPACE.pick = 0;
		NAMESPACE.direction = "forward";
		NAMESPACE.round++;
	}

	// prevent displaying "Round 16" at end of draft
	var round = NAMESPACE.round;
	if (round > 15) {
		round = 15;
	};

	// display draft round for user
	var instructions = document.getElementById('instructions');
	instructions.textContent = "Select your player for round " + round + ".";

	// end draft after 15 rounds
	if (NAMESPACE.round > 15) {
		endDraft();
		return;
	};

	// set the draft order based on current direction in a snake format draft
	if (NAMESPACE.direction == "forward") {
		order = forward;
	} else {
		order = reverse;
	};

	// complete picks for each non-user team
	for (NAMESPACE.pick; NAMESPACE.pick < order.length; NAMESPACE.pick++) {

		var overallPick = NAMESPACE.results.length + 1;
		// pairs[pos player name team, round, team#, overallPick]
		var pairs = NAMESPACE.keeperObj.pairs;
		// check if current overall pick matches a keeper pick
		for (var i = 0; i < pairs.length; i++) {
			if (overallPick == pairs[i][3]) {
				keeperPick(pairs[i]);
				return;
			};
		}

		// get the next team to draft
		var nextTeam = order[NAMESPACE.pick];

		// stop simulation of it's the user's pick
		if (nextTeam == NAMESPACE.myTeam) {
			return;
		};

		var nextPlayerNeeded = false;
		var nextPlayerCheck = 0;
		// scan the list of players until the team needs the player
		while (nextPlayerNeeded == false) {

			// get next player from Available Players
			parent = document.getElementById('players');
			nextPlayerNode = parent.getElementsByTagName('p')[nextPlayerCheck];
			nextPlayerAnchor = nextPlayerNode.getElementsByTagName('a')[0];
			nextPlayer = nextPlayerAnchor.textContent;

			// parse the details of the selected player
			position = nextPlayer.substr(0, nextPlayer.indexOf(' ')).toLowerCase();
			player = nextPlayer.substr(nextPlayer.indexOf(' ')+1);

			// check if the drafting team needs the selected player
			if (NAMESPACE.teams[nextTeam][position] > 0 || (NAMESPACE.teams[nextTeam]["count"] >= 7 && position != 'qb' && position != 'te')) {

				// add pick to draft results;
				nextPlayerNeeded = true;
				NAMESPACE.teams[nextTeam][position] -= 1;
				NAMESPACE.teams[nextTeam]["count"] += 1;
				NAMESPACE.results.push(nextPlayer);
				nextPlayerNode.remove();

				// remove the selected player from the official rankings
				offTheBoard(player);
			};

			// go the next player
			nextPlayerCheck++;
		}

		// get the appropriate team div
		element = document.getElementById(nextTeam);

		// add the player to the team
		addPlayer(element, nextPlayer, position);
	};

	// continue with the simulation at the end of each order
	simulate();
}

// account for the current pick being a keeper pick, during simulation
function keeperPick (keeper) {
	// keeper[pos player name team, round, team#, overallPick]

	// add pick to draft results
	NAMESPACE.results.push(keeper[0]);

	// increase the pick count
	NAMESPACE.pick++;

	// continue simulation
	simulate();
}

// add selected player (user or auto selected) to the correct team/element
function addPlayer (element, player, position) {
	var teamParent, slot;

	// get total number of starter roster slots (minus 1 to account for the h2 element)
	var starters = element.childElementCount - 1;

	// add player to correct paragraph based on position and current roster
	for (var i = 0; i <= starters; i++) {
		slot = element.getElementsByTagName('p')[i];
		
		// add player to starting position, or else the bench
		if (slot.className == position.toLowerCase() && slot.textContent == "") {
			text = document.createTextNode(player);
			slot.appendChild(text);
			break;
		} else if (i > 7) {
			// create the bench slot and add selected player to it
			para = document.createElement("p");
			text = document.createTextNode("b. " + player);
			para.appendChild(text);
			para.id = "bench";
			teamParent = slot.parentNode;
			teamParent.appendChild(para);
			break;
		}
	};
}

// add selected player to the user's team and remove selected player from the list of available players
function select () {
	var para, selected, position, player, text, element

	// user must select a team before they can draft a player
	if (NAMESPACE.myTeam == "") {
		return alert("You need to select a team first.");
	};

	// get and parse the details of the selected player
	selected = this.textContent;
	selected = selected.substr(selected.indexOf(' ')+1); // remove rank
	position = selected.substr(0, selected.indexOf(' '));
	player = selected.substr(selected.indexOf(' ')+1);

	// add pick to draft results
	NAMESPACE.results.push(selected);

	// get the appropriate team div
	element = document.getElementById(NAMESPACE.myTeam);

	// add the player to the team
	addPlayer(element, selected, position);

	// remove player from the list of available players
	this.remove();

	// remove the selected player from the official rankings
	offTheBoard(player);

	// increase the pick count
	NAMESPACE.pick++;

	// list the available players
	availablePlayers(NAMESPACE.rankings, "all");

	// continue simulation
	simulate();
}

// execute the end of the draft
function endDraft () {

	// remove the list of available players
	var playersDiv = document.getElementById('players');
	playersDiv.remove();

	// update the instructions
	var instructions = document.getElementById('instructions');
	instructions.textContent = "View the draft results.";

	// add sub-intructions
	var p = document.createElement('p');
	var a = document.createElement('a');
	a.href = "#bottom";
	a.textContent = "Round by round results are at the bottom.";
	p.appendChild(a);
	instructions.appendChild(p);

	// create the structure for listing the draft results
	var resultsDiv = document.createElement('div');
	var header = document.createElement('h2');
	var headerText = document.createTextNode('Round by Round Results');
	header.id = "bottom";
	header.appendChild(headerText);
	resultsDiv.appendChild(header);

	// number of teams
	var teams = NAMESPACE.keeperObj.teams;
	// round count
	var r = 1;
	// list draft results by round
	for (var i = 0; i < NAMESPACE.results.length; i++) {

		// create a round header after each team has picked
		if (i % teams == 0) {
			var roundHeader = document.createElement('h3');
			var roundText = document.createTextNode("Round " + r);
			roundHeader.appendChild(roundText);
			resultsDiv.appendChild(roundHeader);
			r++;
		};

		// add the selected player from the draft results
		var p = document.createElement('p');
		var text = document.createTextNode(NAMESPACE.results[i]);
		p.appendChild(text);
		resultsDiv.appendChild(p);
	}

	resultsDiv.id = "results";
	document.body.appendChild(resultsDiv);
}



/***************************
Start
***************************/

// global variables to be stored in a global namespace
var NAMESPACE = {};

// player selection will prompt the user to select a team first if myTeam is empty
NAMESPACE.myTeam = "";

// direction references the serpintine draft order
NAMESPACE.direction = "forward";

// pick is required to track picks between auto and user
NAMESPACE.pick = 0;

// round is required to know when to end the draft
NAMESPACE.round = 1;

// results for the entire draft are tracked in an array
NAMESPACE.results = [];

startDraft();