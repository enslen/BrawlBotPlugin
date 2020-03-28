(function() {
	var apiKeyPath = "./scripts/custom/bsAPIKey.txt";
	var brawlerJSON = "./scripts/custom/brawlers.json";
	var apiPlayerStr = "https://api.brawlstars.com/v1/players/%23";
	var apiBattleLogStr = "/battlelog";
	var apiLeaderBoardStr = "https://api.brawlstars.com/v1/rankings/";
	var bsTableAlias = "brawlStarsPlayers";
	var bsTableData = "brawlStarsPlayerData";
	var totalBrawlers = "35";
	
	
	function getBrawlStarsData(playerTag, battleLog){
		var apiString = apiPlayerStr + removeHash(playerTag);
		if (battleLog) {
			apiString += apiBattleLogStr;
		}
		var apiKey = $.readFile(apiKeyPath);
		var HttpRequest = Packages.com.gmt2001.HttpRequest;
		var HashMap = Packages.java.util.HashMap;
		var h = new HashMap();
		h.put("authorization", "Bearer " + apiKey[0]);
		var r = HttpRequest.getData(HttpRequest.RequestType.GET, apiString, '', h);
		return r;
	}
	
	function getLeaderBoardData(region, brawler){
		var apiKey = $.readFile(apiKeyPath);
		var HttpRequest = Packages.com.gmt2001.HttpRequest;
		var HashMap = Packages.java.util.HashMap;
		var h = new HashMap();
		h.put("authorization", "Bearer " + apiKey[0]);
		var apiString = apiLeaderBoardStr + region;
		if (brawler !== "") {
			apiString += ("/brawlers/" + brawler);
		} else {
			apiString += "/players"
		}
		var r = HttpRequest.getData(HttpRequest.RequestType.GET, apiString, '', h);
		return r;
	}
	
	function checkValidTag(playerTag){
		var reg = /[^0289CGJLPQRUVY]/i;
		playerTag = removeHash(playerTag);
		if (reg.test(playerTag)) {
			return false;
		}
		return true;
	}

	function removeHash(playerTag) {
		// Convert to Rhino string, otherwise charAt returns character number and not string
		var tag = new String(playerTag);
		while(tag.charAt(0) === "#")
		{
			tag = tag.substr(1);
		}
		return tag;
	}
	
	function gameModeLog(gameMode, pGameMode) {
		this.mode = gameMode;
		this.pMode = pGameMode;
		this.wins = 0;
		this.losses = 0;
		this.draws = 0;
		this.total = function () {
			return (this.wins + this.losses + this.draws);
		};
		this.wld = function () {
			return (this.wins.toString() + "/" + this.losses.toString() + "/" + this.draws.toString());
		};
		this.winrate = function () {
			return (parseFloat(this.wins / (this.total()) * 100).toFixed(1) + "%");
		};
		this.add = function(result) {
            switch(result) {
				case "victory":
					this.wins += 1;
					break;
				case "defeat":
					this.losses += 1;
					break;
				case "draw":
					this.draws += 1;
					break;
			}
        }
	}
	
	function getBattleLogData(jObj){
		var gemGrab = new gameModeLog("gemGrab", "Gem Grab");
		var brawlBall = new gameModeLog("brawlBall", "Brawl Ball");
		var heist = new gameModeLog("heist", "Heist");
		var bounty = new gameModeLog("bounty", "Bounty");
		var siege = new gameModeLog("siege", "Siege");
		var hotZone = new gameModeLog("hotZone", "Hot Zone");
		var presentPlunder = new gameModeLog("presentPlunder", "Present Plunder");
		var reg = /^(gemGrab|brawlBall|heist|bounty|siege|hotZone|presentPlunder)$/i;
		var battleLog = [];
		var battleSummary = [];
		for (i = 0; i < jObj.items.length; i++) {
			if (reg.test(jObj.items[i].battle.mode)) {
				var game = {mode:"", result:""};
				game.mode = jObj.items[i].battle.mode;
				game.result = jObj.items[i].battle.result;
				battleLog.push(game);
			}
		}
		for (i = 0; i < battleLog.length; i++) {
			if (battleLog[i].mode == "gemGrab") {
				gemGrab.add(battleLog[i].result);
			}
			if (battleLog[i].mode == "brawlBall") {
				brawlBall.add(battleLog[i].result);
			}
			if (battleLog[i].mode == "heist") {
				heist.add(battleLog[i].result);
			}
			if (battleLog[i].mode == "bounty") {
				bounty.add(battleLog[i].result);
			}
			if (battleLog[i].mode == "siege") {
				siege.add(battleLog[i].result);
			}
			if (battleLog[i].mode == "hotZone") {
				hotZone.add(battleLog[i].result);
			}
			if (battleLog[i].mode == "presentPlunder") {
				presentPlunder.add(battleLog[i].result);
			}
		}
		if (gemGrab.total() > 0) {
			battleSummary.push(gemGrab);
		}
		if (brawlBall.total() > 0) {
			battleSummary.push(brawlBall);
		}
		if (heist.total() > 0) {
			battleSummary.push(heist);
		}
		if (bounty.total() > 0) {
			battleSummary.push(bounty);
		}
		if (siege.total() > 0) {
			battleSummary.push(siege);
		}
		if (hotZone.total() > 0) {
			battleSummary.push(hotZone);
		}
		if (presentPlunder.total() > 0) {
			battleSummary.push(presentPlunder);
		}
		return battleSummary;
	}
	
	function getSeasonReset(jObj){
		var sReset = {trophies: 0, starPoints:0};
		for (i = 0; i < jObj.brawlers.length; i++) {
			var temp = calcSeasonReset(jObj.brawlers[i].trophies);
			sReset.starPoints += temp.starPoints;
			sReset.trophies += temp.trophies;
		}
		return sReset;
	}
	
	function calcSeasonReset(t) {
		var sReset = {trophies: 0, starPoints:0};
		if (t >= 550 && t <= 599){
			sReset.trophies = t - 525;
			sReset.starPoints = 70;
			return sReset;
		}
		if (t >= 600 && t <= 649){
			sReset.trophies = t - 575;
			sReset.starPoints = 120;
			return sReset;
		}
		if (t >= 650 && t <= 699){
			sReset.trophies = t - 625;
			sReset.starPoints = 160;
			return sReset;
		}
		if (t >= 700 && t <= 749){
			sReset.trophies = t - 650;
			sReset.starPoints = 200;
			return sReset;
		}
		if (t >= 750 && t <= 799){
			sReset.trophies = t - 700;
			sReset.starPoints = 220;
			return sReset;
		}
		if (t >= 800 && t <= 849){
			sReset.trophies = t - 750;
			sReset.starPoints = 240;
			return sReset;
		}
		if (t >= 850 && t <= 899){
			sReset.trophies = t - 775;
			sReset.starPoints = 260;
			return sReset;
		}
		if (t >= 900 && t <= 949){
			sReset.trophies = t - 825;
			sReset.starPoints = 280;
			return sReset;
		}
		if (t >= 950 && t <= 999){
			sReset.trophies = t - 875;
			sReset.starPoints = 300;
			return sReset;
		}
		if (t >= 1000 && t <= 1049){
			sReset.trophies = t - 900;
			sReset.starPoints = 320;
			return sReset;
		}
		if (t >= 1050 && t <= 1099){
			sReset.trophies = t - 925;
			sReset.starPoints = 340;
			return sReset;
		}
		if (t >= 1100 && t <= 1149){
			sReset.trophies = t - 950;
			sReset.starPoints = 360;
			return sReset;
		}
		if (t >= 1150 && t <= 1199){
			sReset.trophies = t - 975;
			sReset.starPoints = 380;
			return sReset;
		}
		if (t >= 1200 && t <= 1249){
			sReset.trophies = t - 1000;
			sReset.starPoints = 400;
			return sReset;
		}
		if (t >= 1250 && t <= 1299){
			sReset.trophies = t - 1025;
			sReset.starPoints = 420;
			return sReset;
		}
		if (t >= 1300 && t <= 1349){
			sReset.trophies = t - 1050;
			sReset.starPoints = 440;
			return sReset;
		}
		if (t >= 1350 && t <= 1399){
			sReset.trophies = t - 1075;
			sReset.starPoints = 460;
			return sReset;
		}
		if (t >= 1400){
			sReset.trophies = t - 1100;
			sReset.starPoints = 480;
			return sReset;
		}
		return sReset;
	}
	
	function getPlayerRank(playerTag, jObj){
		var rank = {name:"", trophies:0, rank:0};
		var lb = [];
		if (jObj.hasOwnProperty("items")) {
			lb = jObj.items;
		} else {
			lb = jObj;
		}
		for (i = 0; i < lb.length; i++) {
			var tag1 = removeHash(playerTag);
			var tag2 = removeHash(lb[i].tag);
			if (tag2.toUpperCase() == tag1.toUpperCase()) {
				if (lb[i].hasOwnProperty("rank")) {
					rank.rank = lb[i].rank;
				}
				if (lb[i].hasOwnProperty("position")) {
					rank.rank = lb[i].position;
				}
				rank.trophies = lb[i].trophies;
				rank.name = lb[i].name;
				return rank;
			}
		}
		return rank;
	}
	
	function getRandomBrawler(brawlers) {
		var brawler = {name:"", trophies:0};
		var x = brawlers.length;
		var r = Math.round(Math.random() * x);
		brawler.name = brawlers[r].name;
		brawler.trophies = brawlers[r].trophies;
		return brawler;
	}
	
	// The list used in this function includes all 33 brawlers and additional shortened values
	// Only applies to 8-BIT, EL PRIMO, JESSIE and DYNAMIKE currently
	// This function and the formatBrawlerName could be optimized better; I imagine you could do some nifty regexs here
	// A proper brawlers object would probably be better
	function checkBrawlers(brawler){
		brawlers = ["SHELLY","NITA","COLT","BULL","JESSIE","JESS","BROCK","DYNAMIKE","DYNA","MIKE","BO","TICK","8-BIT","8BIT","EMZ","ELPRIMO","PRIMO","BARLEY","POCO","ROSA","RICO","DARRYL","PENNY","CARL","PIPER","PAM","FRANK","BIBI","MORTIS","TARA","GENE","SPIKE","CROW","LEON","SANDY","BEA","MAX","MRP","MR.P","JACKY","SPROUT"];
		
		for (i = 0; i < brawlers.length; i++) {
			if (brawlers[i] == brawler.toUpperCase()) {
				return true;
			}
		}
		return false;
	}

	function formatBrawlerName(name){
		name = name.toUpperCase();
		if (name == "ELPRIMO" || name == "PRIMO") {
			return "EL PRIMO";
		}
		if (name == "JESS") {
			return "JESSIE";
		}
		if (name == "DYNA" || name == "MIKE") {
			return "DYNAMIKE";
		}
		if (name == "8BIT") {
			return "8-BIT";
		}
		if (name == "MR.P" || name == "MRP") {
			return "MR. P";
		}
		return name;
	}

	function getBrawlerID(name){
		var jObj = JSON.parse($.readFile(brawlerJSON));
		for (i = 0; i < jObj.items.length; i++) {
			if (name.toUpperCase() == jObj.items[i].name.toUpperCase()) {
				return jObj.items[i].id;
			}	
		}
		return 0;
	}

	function sortByRank(a, b){
		if (a.rank < b.rank) {
			return 1;
		}
		if (a.rank == b.rank) {
			if (a.highestTrophies < b.highestTrophies) {
				return 1;
			}
			if (a.highestTrophies == b.highestTrophies) {
				if (a.name < b.name) {
					return -1;
				} else {
					return 1;
				}
			} else {
				return -1;
			}
		} else {
			return -1;
		}
	}

	function sortByTrophies(a, b){
		if (a.trophies < b.trophies) {
			return 1;
		}
		if (a.trophies == b.trophies) {
			if (a.name < b.name) {
				return -1;
			} else {
				return 1;
			}
		} else {
			return -1;
		}
	}

	function sortBrawlers(arg, list) {
		var top = 5;
		var bList = "top 5 ";
		var sort = false;
		if (list.length < 5) {
			top = list.length - 1;
		}
		if ((arg == "R") || (arg == "RANKS")) {
			sort = true;
			bList += "ranked brawlers are: ";
			list.sort(sortByRank);
		}
		if ((arg == "T") || (arg == "TROPHIES")) {
			bList += "brawlers by trophies are: ";
			list.sort(sortByTrophies);
		}
		for (i = 0; i < top; i++) {
			var a = "";
			if (sort == true){
				a = "rank " + list[i].rank.toString();
			} else {
				a = list[i].trophies.toString() + " trophies";
			}
			bList += "(" + (i + 1).toString() + ") " + list[i].name + " at " + a;
			if (i < (top - 1)) {
				bList += ", "
			}
		}
		return bList;
	}
	
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            arg1 = args[0],
            arg2 = args[1],
			arg3 = args[2];
									
        if (command.equalsIgnoreCase('bs')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			// arg2 = brawler name
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias and optional brawler name. Ex: !bs <alias> OR !bs <alias> <brawler name>");
                return;
            }
			arg1 = arg1.toUpperCase();
			var playerTag = $.getIniDbString(bsTableAlias, arg1);
			
			if (playerTag === undefined) {
				if (checkValidTag(arg1)) {
					playerTag = arg1;
				} else {
					$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			var r = getBrawlStarsData(playerTag, false);
			// Adding try/catch to the JSON parsing for all commands, this probably could be moved under the r.success check and drop the try/catch
			try {
				var jObj = JSON.parse(r.content);
			} catch(err) {
				$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
				return;
			}
			if (r.success) {
				if (arg2 !== undefined) {
					arg2 = arg2.toUpperCase();
					var name = "";
					var power = 0;
					var rank = 0;
					var trophies = 0;
					var hTrophies = 0;
					var check = false;
					for (i = 0; i < jObj.brawlers.length; i++) {
						name = jObj.brawlers[i].name;
						if (name.toUpperCase() == formatBrawlerName(arg2)) {
							power = jObj.brawlers[i].power;
							rank = jObj.brawlers[i].rank;
							trophies = jObj.brawlers[i].trophies;
							hTrophies = jObj.brawlers[i].highestTrophies;
							check = true;
							break;
						}	
					}
					if (check) {
						$.say("Player " + jObj.name + "'s " + name + " is power " + power.toString() + 
							" at rank " + rank.toString() + " with " + trophies.toString() + " trophies. Their highest trophy record is " + 
							hTrophies.toString() + ".");
					} else {
						$.say("Player does not have brawler or invalid brawler; check brawler name. Ensure spaces are removed. Ex: El Primo -> ElPrimo");
					}
				} else {
					var lastTrophies = $.getIniDbNumber(bsTableData, playerTag, jObj.trophies);
					$.setIniDbNumber(bsTableData, playerTag, jObj.trophies);
					var clubInfo = " has no club";
					if (jObj.club !== null) {
						clubInfo = " is currently a member of club " + jObj.club.name;
					}
					$.say("Player " + jObj.name + clubInfo + " and has " + jObj.brawlers.length.toString() + 
						" of " + totalBrawlers + " brawlers with a total of " + jObj.trophies.toString() + " trophies. " +
						"Their highest trophy record is " + jObj.highestTrophies.toString() + ". " +
						"They have a net change of " + (jObj.trophies - lastTrophies).toString() + 
						" trophies since the last check.");
				}
			} else {
				// This will likely never not have a code property but this is technically safer, leaving it as is for now
				if (jObj.code !== undefined) {
					$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
				} else {
					$.say("Error connecting to Brawl Stars API server.");
				}
			}
			return;
		}
		
		if (command.equalsIgnoreCase('bstop5')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			// arg2 = ranks or trophies
			if (arg1 === undefined || arg2 === undefined) {
				$.say("Missing arguments; requires player tag or alias and filter. Ex: !bstop5 <alias> ranks OR r OR trophies OR t");
                return;
			}
			arg1 = arg1.toUpperCase();
			arg2 = arg2.toUpperCase();
			if (!((arg2 == "R") || (arg2 == "RANKS") || (arg2 == "T") || (arg2 == "TROPHIES"))) {
				$.say("Invalid filter. Valid filters are ranks (r) and trophies (t).");
				return;
			}
			var playerTag = $.getIniDbString(bsTableAlias, arg1);
			if (playerTag === undefined) {
				if (checkValidTag(arg1)) {
					playerTag = arg1;
				} else {
					$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			var r = getBrawlStarsData(playerTag, false);
			try {
				var jObj = JSON.parse(r.content);
			} catch(err) {
				$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
				return;
			}
			if (r.success) {
				$.say("Player " + jObj.name + "'s " + sortBrawlers(arg2, jObj.brawlers));
			} else {
				if (jObj.code !== undefined) {
					$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
				} else {
					$.say("Error connecting to Brawl Stars API server.");
				}
			}
			return;
        }
		
		if (command.equalsIgnoreCase('bswins')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias. Ex: !bswins <alias> OR !bswins <player tag>");
                return;
			}
			arg1 = arg1.toUpperCase();
			var playerTag = $.getIniDbString(bsTableAlias, arg1);
			if (playerTag === undefined) {
				if (checkValidTag(arg1)) {
					playerTag = arg1;
				} else {
					$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			var r = getBrawlStarsData(playerTag, false);
			try {
				var jObj = JSON.parse(r.content);
			} catch(err) {
				$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
				return;
			}
			if (r.success) {
				$.say("Player " + jObj.name + " has " + jObj["3vs3Victories"].toString() + 
					" 3v3 wins, " + jObj.soloVictories.toString() + " Solo wins," +
					" and " + jObj.duoVictories.toString() + " Duo wins. " +
					"Their current experience level is: " + jObj.expLevel.toString());
			} else {
				if (jObj.code !== undefined) {
					$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
				} else {
					$.say("Error connecting to Brawl Stars API server.");
				}
			}
			return;
        }
		
		if (command.equalsIgnoreCase('bswinrate')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias. Ex: !bswinrate <alias> OR !bswins <player tag>");
                return;
			}
			arg1 = arg1.toUpperCase();
			var playerTag = $.getIniDbString(bsTableAlias, arg1);
			if (playerTag === undefined) {
				if (checkValidTag(arg1)) {
					playerTag = arg1;
				} else {
					$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			// Will consider querying player data too to get the account name as it appears in BS, for now this is fine
			var r = getBrawlStarsData(playerTag, true);
			try {
				var jObj = JSON.parse(r.content);
			} catch(err) {
				$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
				return;
			}
			if (r.success) {
				var modeLog = getBattleLogData(jObj);
				if (modeLog.length > 0) {
					var results = "";
					for (i = 0; i < modeLog.length; i++) {
						results += "(" + (i+1).toString() + ") " + modeLog[i].pMode + " for " + modeLog[i].wld() + 
							" at " + modeLog[i].winrate();
						if (i < (modeLog.length - 1)) {
								results += ", ";
						}
					}
					$.say("3v3 game results (W/L/D) of the last 25 games for " + arg1 + " are: " + results);
				} else {
					$.say("No 3v3 games found in the last 25 games for player: " + arg1);
				}
			} else {
				if (jObj.code !== undefined) {
					$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
				} else {
					$.say("Error connecting to Brawl Stars API server.");
				}
			}
			return;
        }
		
		if (command.equalsIgnoreCase('bsreset')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias. Ex: !bsreset <alias> OR !bswins <player tag>");
                return;
			}
			arg1 = arg1.toUpperCase();
			var playerTag = $.getIniDbString(bsTableAlias, arg1);
			if (playerTag === undefined) {
				if (checkValidTag(arg1)) {
					playerTag = arg1;
				} else {
					$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			var r = getBrawlStarsData(playerTag, false);
			try {
				var jObj = JSON.parse(r.content);
			} catch(err) {
				$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
				return;
			}
			if (r.success) {
				var sReset = getSeasonReset(jObj);
				$.say("Player " + jObj.name + " will lose " + sReset.trophies.toString() + 
					" Trophies and receive " + sReset.starPoints.toString() + " Star Points at season reset.");
			} else {
				if (jObj.code !== undefined) {
					$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
				} else {
					$.say("Error connecting to Brawl Stars API server.");
				}
			}
			return;
        }
		
		if (command.equalsIgnoreCase('bsrank')) {
            // the following if/else is only required if you have arguments
			// arg1 = player tag or alias
			// arg2 = region
			// arg3 = brawler			
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias and optional 2 character region and brawler name. Ex: !bsrank <alias> OR !bsrank <alias> us OR !bsrank <alias> global <brawler name>");
                return;
			}
			var region = "GLOBAL";
			var brawler = "";
			var brawlerID = "";
			var reg = /^(global)$/i;
			if (arg2 !== undefined) {
				if (!reg.test(arg2)) {
					if (arg2.length() != 2) {
						$.say("Region incorrect; use global or 2 character region. Ex: !bsrank <alias> global OR !bsrank <alias> us");
						return;
					} else {
						region = arg2.toUpperCase();
					}
				}
			}
			if (arg3 !== undefined) {
				if (checkBrawlers(arg3)) {
					brawler = formatBrawlerName(arg3);
					brawlerID = getBrawlerID(brawler).toString();
				} else {
					$.say("Invalid brawler; check brawler name. Ensure spaces are removed. Ex: El Primo -> ElPrimo");
					return;
				}
			}
			arg1 = arg1.toUpperCase();
			var playerTag = $.getIniDbString(bsTableAlias, arg1);
			if (playerTag === undefined) {
				if (checkValidTag(arg1)) {
					playerTag = arg1;
				} else {
					$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			// Will consider querying player data too to get the account name as it appears in BS, for now this is fine
			var r = getLeaderBoardData(region, brawlerID);
			try {
				var jObj = JSON.parse(r.content);
			} catch(err) {
				$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
				return;
			}
			if (r.success) {
				var lb = getPlayerRank(playerTag, jObj);
				if (lb.rank == 0) {
					if (brawler !== "") {
						$.say("Player " + arg1 + "'s " + brawler + " is unranked on the " + region + " leaderboard.");
					} else {
						$.say("Player " + arg1 + " is unranked on the " + region + " leaderboard.");
					}
				} else {
					if (brawler !== "") {
						$.say("Player " + arg1 + "'s " + brawler + " is rank " + lb.rank.toString() + " at " + lb.trophies.toString() +
						" trophies on the " + region + " leaderboard.");
					} else {
						$.say("Player " + arg1 + " is rank " + lb.rank.toString() + " at " + lb.trophies.toString() +
						" trophies on the " + region + " leaderboard.");
					}
				}
			} else {
				if (jObj.code !== undefined) {
					$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
				} else {
					$.say("Error connecting to Brawl Stars API server.");
				}
			}
			return;
        }
		
		if (command.equalsIgnoreCase('bsvs')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			// arg2 = alias or player tag
			if ((arg1 === undefined) || (arg2 === undefined)) {
				$.say("Missing arguments; requires two player tags or aliases. Ex: !bsvs <alias> <alias> OR !bsvs <player tag> <alias> OR !bsvs <player tag> <player tag> ");
                return;
			}
			arg1 = arg1.toUpperCase();
			arg2 = arg2.toUpperCase();
			var playerTag1 = $.getIniDbString(bsTableAlias, arg1);
			if (playerTag1 === undefined) {
				if (checkValidTag(arg1)) {
					playerTag1 = arg1;
				} else {
					$.say("Invalid characters in player tag 1; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			var playerTag2 = $.getIniDbString(bsTableAlias, arg2);
			if (playerTag2 === undefined) {
				if (checkValidTag(arg2)) {
					playerTag2 = arg2;
				} else {
					$.say("Invalid characters in player tag 2; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
					return;
				}
			}
			var r1 = getBrawlStarsData(playerTag1, false);
			var r2 = getBrawlStarsData(playerTag2, false);
			try {
				var jObj1 = JSON.parse(r1.content);
				var jObj2 = JSON.parse(r2.content);
			} catch(err) {
				$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
				return;
			}
			if (r1.success && r2.success) {
				var b1 = getRandomBrawler(jObj1.brawlers);
				var b2 = getRandomBrawler(jObj2.brawlers);
				var t1 = b1.trophies;
				var t2 = b2.trophies;
				var t = Math.abs(t1-t2);
				var r1 = Math.round(Math.random() * (t1));
				var r2 = Math.round(Math.random() * (t2));
				var a = "";
				if (t1 >= t2) {
					a = "advantage";
				} else {
					a = "disadvantage";
				}
				if (r1 > r2) {
					$.say("Player " + jObj1.name + "'s " + b1.name + " (" + b1.trophies.toString() + " trophies) battled " + jObj2.name + "'s " + b2.name +
						" (" + b2.trophies.toString() + " trophies) and WON! They had a " + t + " trophy " + a + ". Booya!");
					return;
				} 
				if (r1 < r2) {
					$.say("Player " + jObj1.name + "'s " + b1.name + " (" + b1.trophies.toString() + " trophies) battled " + jObj2.name + "'s " + b2.name +
						" (" + b2.trophies.toString() + " trophies) and LOST! They had a " + t + " trophy " + a + ". Get rekt!");
					return;
				}
				if (r1 == r2) {
					$.say("Player " + jObj1.name + "'s " + b1.name + " (" + b1.trophies.toString() + " trophies) battled " + jObj2.name + "'s " + b2.name +
						" (" + b2.trophies.toString() + " trophies) and...TIED?! They had a " + t + " trophy " + a + ". Everyone's a winner!");
					return;
				}
			} else {
				// Probably could make this simpler but this just checks both JSON objects for error props
				// Initially just spit out errors for both JSON objects assuming both would have errored out, this accounts for just 1 erroring
				var errCode1 = "(1) NONE";
				var errMessage1 = "(1) NONE";
				var errCode2 = "(2) NONE";
				var errMessage2 = "(2) NONE";
				if (jObj1.code !== undefined) {
					errCode1 = "(1) " + jObj1.code.toString();
					errMessage1 = "(1) " + jObj2.message;
				}
				if (jObj2.code !== undefined) {
					errCode2 = errCode + "(2) " + jObj2.code.toString();
					errMessage2 = errMessage + "(2) " + jObj2.message;
				}
				if ((jObj1.code !== undefined) || (jObj2.code !== undefined)) {
					$.say("Error: " + errCode1 + " / " + errCode2 + ", Message: " + errMessage1 + " / " + errMessage2);
				} else {
					$.say("Error connecting to Brawl Stars API server.");
				}
			}
			return;
        }
		
		if (command.equalsIgnoreCase('bsadd')) {
		// the following if/else is only required if you have arguments
		// arg1 = player tag
		// arg2 = alias
		// arg3 = ignore SC validation
			if (arg1 === undefined || arg2 === undefined) {
				$.say("Missing arguments; requires player tag and alias. Ex: !bsadd <player tag> <alias>");
				return;
			}
			var uPlayerTag = removeHash(arg1.toUpperCase());
			var uAlias = arg2.toUpperCase();
			var tagVal = false;
			if (!checkValidTag(uPlayerTag)) {
				$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
				return;
			}
			if (arg3 == 1) {
				tagVal = true;
			}
			if ($.getIniDbString(bsTableAlias, uAlias, undefined) === undefined) {
				// This could be done better, need to revisit this section
				if (tagVal == true) {
					$.say("Ignoring tag validation. Adding alias \"" + uAlias + "\" to be linked to player tag: " + uPlayerTag);
					$.setIniDbString(bsTableAlias, uAlias, uPlayerTag);
					return;
				}
				var r = getBrawlStarsData(uPlayerTag, false);
				if (r.success) {
					$.say("Adding alias \"" + uAlias + "\" to be linked to player tag: " + uPlayerTag);
					$.setIniDbString(bsTableAlias, uAlias, uPlayerTag);
				} else {
					// While not pretty, this basically accounts for all the different top level errors
					try {
						var jObj = JSON.parse(r.content);
					} catch(err) {
						$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
						return;
					}
					if (jObj.code !== undefined) {
						if (jObj.code == 404) {
							$.say("Brawl Stars account not found for player tag. Please provide a valid player tag.");
						} else {
							$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
						}
					}
				}
			} else {
				$.say("Alias already exists. Use !bsupdate to modify aliases.");
			}
		}

		if (command.equalsIgnoreCase('bsupdate')) {
		// the following if/else is only required if you have arguments
		// arg1 = player tag
		// arg2 = alias
		// arg3 = ignore SC validation
			if (arg1 === undefined || arg2 === undefined) {
				$.say("Missing arguments; requires player tag and alias. Ex: !bsupdate <player tag> <alias>");
				return;
			}
			var uPlayerTag = removeHash(arg1.toUpperCase());
			var uAlias = arg2.toUpperCase();
			var tagVal = false;
			if (!checkValidTag(uPlayerTag)) {
				$.say("Invalid characters in player tag; tags consist of 0289CGJLPQRUVY. Please provide a valid player tag.");
				return;
			}
			if (arg3 == 1) {
				tagVal = true;
			}
			// This could be done better, need to revisit this section
			if (tagVal == true) {
				$.say("Ignoring tag validation. Updating alias \"" + uAlias + "\" to be linked to player tag: " + uPlayerTag);
				$.setIniDbString(bsTableAlias, uAlias, uPlayerTag);
				return;
			}
			var r = getBrawlStarsData(uPlayerTag, false);
			if (r.success) {
				$.say("Updating alias \"" + uAlias + "\" to be linked to player tag: " + uPlayerTag);
				$.setIniDbString(bsTableAlias, uAlias, uPlayerTag);
			} else {
				// While not pretty, this basically accounts for all the different top level errors
				try {
					var jObj = JSON.parse(r.content);
				} catch(err) {
					$.say("Error parsing Brawl Stars API data, possible server issue. Error: " + err);
					return;
				}
				if (jObj.code !== undefined) {
					if (jObj.code == 404) {
						$.say("Brawl Stars account not found for player tag. Please provide a valid player tag.");
					} else {
						$.say("Error: " + jObj.code.toString() + ", Message: " + jObj.message);
					}
				}
			}
		}
		
		if (command.equalsIgnoreCase('bsdelete')) {
		// the following if/else is only required if you have arguments
		// arg1 = alias
			if (arg1 === undefined) {
				$.say("Missing arguments; requires alias. Ex: !bsdelete <alias>");
				return;
			}
			var uAlias = arg1.toUpperCase();
			var playerTag = $.getIniDbString(bsTableAlias, uAlias);
			$.say("Deleting alias \"" + uAlias + "\" and player tag: " + playerTag);
			$.inidb.del(bsTableAlias, uAlias);
		}

		if (command.equalsIgnoreCase('bsalias')) {
		// the following if/else is only required if you have arguments
		// arg1 = alias		
			if (arg1 === undefined) {
				$.say("Missing arguments; requires alias. Ex: !bsalias <alias>");
				return;
			}
			var uAlias = arg1.toUpperCase();
			var playerTag = $.getIniDbString(bsTableAlias, uAlias);
			$.say("Alias \"" + uAlias + "\" is associated with player tag: " + playerTag);
		}
	});

    $.bind('initReady', function() {
		$.registerChatCommand('./custom/bsCommand.js', 'bs', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bstop5', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bswins', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bswinrate', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bsreset', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bsrank', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bsvs', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bsadd', 7);
		$.registerChatCommand('./custom/bsCommand.js', 'bsupdate', 6);
		$.registerChatCommand('./custom/bsCommand.js', 'bsdelete', 6);
		$.registerChatCommand('./custom/bsCommand.js', 'bsalias', 7);
    });
})();
