(function() {
	var apiKeyPath = "./scripts/custom/bsAPIKey.txt";
	var apiPlayerStr = "https://api.starlist.pro/v1/player?tag=";
	var apiBattleLogStr = "https://api.starlist.pro/v1/player/battlelog?tag=";
	var apiLeaderBoardStr = "https://api.starlist.pro/v1/leaderboards/players?count=200";
	var bsTableAlias = "brawlStarsPlayers";
	var bsTableData = "brawlStarsPlayerData";
	
	
	function getBrawlStarsData(playerTag, apiString){
		var apiKey = $.readFile(apiKeyPath);
		var HttpRequest = Packages.com.gmt2001.HttpRequest;
		var HashMap = Packages.java.util.HashMap;
		var h = new HashMap();
		h.put("Authorization", apiKey[0]);
		var r = HttpRequest.getData(HttpRequest.RequestType.GET, apiString + removeHash(playerTag), '', h);
		return r;
	}
	
	function getLeaderBoardData(region, brawler, apiString){
		var apiKey = $.readFile(apiKeyPath);
		var HttpRequest = Packages.com.gmt2001.HttpRequest;
		var HashMap = Packages.java.util.HashMap;
		var h = new HashMap();
		h.put("Authorization", apiKey[0]);
		var a = apiString + "&region=" + region;
		if (brawler !== "") {
			a += ("&brawler=" + encodeURIComponent(brawler));
		}
		var r = HttpRequest.getData(HttpRequest.RequestType.GET, a, '', h);
		return r;
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
		var reg = /^(gemGrab|brawlBall|heist|bounty|siege)$/i
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
			sReset.trophies = t - 550;
			sReset.starPoints = 120;
			return sReset;
		}
		if (t >= 650 && t <= 699){
			sReset.trophies = t - 575;
			sReset.starPoints = 160;
			return sReset;
		}
		if (t >= 700 && t <= 749){
			sReset.trophies = t - 600;
			sReset.starPoints = 200;
			return sReset;
		}
		if (t >= 750 && t <= 799){
			sReset.trophies = t - 625;
			sReset.starPoints = 220;
			return sReset;
		}
		if (t >= 800 && t <= 849){
			sReset.trophies = t - 650;
			sReset.starPoints = 240;
			return sReset;
		}
		if (t >= 850 && t <= 899){
			sReset.trophies = t - 675;
			sReset.starPoints = 260;
			return sReset;
		}
		if (t >= 900 && t <= 949){
			sReset.trophies = t - 700;
			sReset.starPoints = 280;
			return sReset;
		}
		if (t >= 950 && t <= 999){
			sReset.trophies = t - 725;
			sReset.starPoints = 300;
			return sReset;
		}
		if (t >= 1000 && t <= 1049){
			sReset.trophies = t - 750;
			sReset.starPoints = 320;
			return sReset;
		}
		if (t >= 1050 && t <= 1099){
			sReset.trophies = t - 775;
			sReset.starPoints = 340;
			return sReset;
		}
		if (t >= 1100 && t <= 1149){
			sReset.trophies = t - 800;
			sReset.starPoints = 360;
			return sReset;
		}
		if (t >= 1150 && t <= 1199){
			sReset.trophies = t - 825;
			sReset.starPoints = 380;
			return sReset;
		}
		if (t >= 1200 && t <= 1249){
			sReset.trophies = t - 850;
			sReset.starPoints = 400;
			return sReset;
		}
		if (t >= 1250 && t <= 1299){
			sReset.trophies = t - 875;
			sReset.starPoints = 420;
			return sReset;
		}
		if (t >= 1300 && t <= 1349){
			sReset.trophies = t - 900;
			sReset.starPoints = 440;
			return sReset;
		}
		if (t >= 1350 && t <= 1399){
			sReset.trophies = t - 925;
			sReset.starPoints = 460;
			return sReset;
		}
		if (t >= 1400){
			sReset.trophies = t - 950;
			sReset.starPoints = 480;
			return sReset;
		}
		return sReset;
	}
	
	function getPlayerRank(playerTag, jObj){
		var rank = {trophies:0, rank:0};
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
				return rank;
			}
		}
		return rank;
	}
	
	function getRandomBrawler(brawlers) {
		var brawler = {name:"", trophies:0};
		var x = brawlers.length;
		var r = Math.floor(Math.random() * x);
		brawler.name = brawlers[r].name;
		brawler.trophies = brawlers[r].trophies;
		return brawler;
	}
	
	function checkBrawlers(brawler){
		brawlers = ["SHELLY","NITA","COLT","BULL","JESSIE","BROCK","DYNAMIKE","BO","TICK","8-BIT","8BIT","EMZ","ELPRIMO","BARLEY","POCO","ROSA","RICO","DARRYL","PENNY","CARL","PIPER","PAM","FRANK","BIBI","MORTIS","TARA","GENE","SPIKE","CROW","LEON","SANDY"];
		
		for (i = 0; i < brawlers.length; i++) {
			if (brawlers[i] == brawler.toUpperCase()) {
				return true;
			}
		}
		return false;
	}
	
	function formatBrawlerName(name){
		if (name.toUpperCase() == "ELPRIMO") {
			return "EL PRIMO";
		}
		if (name.toUpperCase() == "8BIT") {
			return "8-BIT";
		}
		return name.toUpperCase();
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
			if (arg1 !== undefined) {
				var playerTag = $.getIniDbString(bsTableAlias, arg1.toUpperCase());
				if (playerTag === undefined) {
					playerTag = arg1.toUpperCase();
				}
                var r = getBrawlStarsData(playerTag, apiPlayerStr);
				var jObj = JSON.parse(r.content);
				if (r.success) {
					if (arg2 !== undefined) {
						arg2 = arg2.toUpperCase()
						if ((arg2 == "R") || (arg2 == "RANKS") || (arg2 == "T") || (arg2 == "TROPHIES")) {
							$.say("Player " + jObj.name + "'s " + sortBrawlers(arg2, jObj.brawlers));
							return;
						}
						var name = "";
						var power = 0;
						var rank = 0;
						var trophies = 0;
						var hTrophies = 0;
						var check = false;
						for (i = 0; i < jObj.brawlers.length; i++) {
							name = jObj.brawlers[i].name.toUpperCase();
							if (name == formatBrawlerName(arg2)) {
								power = jObj.brawlers[i].power;
								rank = jObj.brawlers[i].rank;
								trophies = jObj.brawlers[i].trophies;
								hTrophies = jObj.brawlers[i].highestTrophies;
								check = true;
								break;
							}	
						}
						if (check) {
							$.say("Player " + jObj.name + "'s " + name + " is power " + power + 
								" at rank " + rank + " with " + trophies + " trophies. Their highest trophy record is " + 
								hTrophies + ".");
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
						$.say("Player " + jObj.name + clubInfo + " and has " + jObj.brawlersUnlocked.toString() + 
							" of 30 brawlers with a total of " + jObj.trophies + " trophies. " +
							"Their highest trophy record is " + jObj.highestTrophies + ". " +
							"They have a net change of " + (jObj.trophies - lastTrophies).toString() + 
							" trophies since the last check.");
					}
				} else {
					if (jObj.code !== undefined) {
						$.say("Error: " + jObj.code + ", Message: " + jObj.message);
					} else {
						$.say("Error connecting to API server.");
					}
				}
                return;
            }
        }
		
		if (command.equalsIgnoreCase('bswins')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias. Ex: !bswins <alias> OR !bswins <player tag>");
                return;
            }
			if (arg1 !== undefined) {
				var playerTag = $.getIniDbString(bsTableAlias, arg1.toUpperCase());
				if (playerTag === undefined) {
					playerTag = arg1.toUpperCase();
				}
                var r = getBrawlStarsData(playerTag, apiPlayerStr);
				var jObj = JSON.parse(r.content);
				if (r.success) {
					$.say("Player " + jObj.name + " has " + jObj.victories.toString() + 
						" 3v3 wins, " + jObj.soloShowdownVictories.toString() + " Solo wins," +
						" and " + jObj.duoShowdownVictories.toString() + " Duo wins. " +
						"Their current experience level is: " + jObj.expLevel.toString());
				} else {
					if (jObj.code !== undefined) {
						$.say("Error: " + jObj.code + ", Message: " + jObj.message);
					} else {
						$.say("Error connecting to API server.");
					}
				}
                return;
			}
        }
		
		if (command.equalsIgnoreCase('bswinrate')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias. Ex: !bswinrate <alias> OR !bswins <player tag>");
                return;
            }
			if (arg1 !== undefined) {
				var playerTag = $.getIniDbString(bsTableAlias, arg1.toUpperCase());
				if (playerTag === undefined) {
					playerTag = arg1.toUpperCase();
				}
                var r = getBrawlStarsData(playerTag, apiBattleLogStr);
				var jObj = JSON.parse(r.content);
				if (r.success) {
					var modeLog = getBattleLogData(jObj);
					if (modeLog.length > 0) {
						var results = ""
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
						$.say("Error: " + jObj.code + ", Message: " + jObj.message);
					} else {
						$.say("Error connecting to API server.");
					}
				}
                return;
            }
        }
		
		if (command.equalsIgnoreCase('bsreset')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias. Ex: !bsreset <alias> OR !bswins <player tag>");
                return;
            }
			if (arg1 !== undefined) {
				var playerTag = $.getIniDbString(bsTableAlias, arg1.toUpperCase());
				if (playerTag === undefined) {
					playerTag = arg1.toUpperCase();
				}
                var r = getBrawlStarsData(playerTag, apiPlayerStr);
				var jObj = JSON.parse(r.content);
				if (r.success) {
					var sReset = getSeasonReset(jObj);
					$.say("Player " + jObj.name + " will lose " + sReset.trophies + 
						" Trophies and receive " + sReset.starPoints + " Star Points at season reset.");
				} else {
					if (jObj.code !== undefined) {
						$.say("Error: " + jObj.code + ", Message: " + jObj.message);
					} else {
						$.say("Error connecting to API server.");
					}
				}
                return;
            }
        }
		
		if (command.equalsIgnoreCase('bsrank')) {
            // the following if/else is only required if you have arguments
			// arg1 = player tag or alias
			// arg2 = region
			// arg3 = brawler
			var region = "global";
			var brawler = "";
			var reg = /^(global)$/i;			
			if (arg1 === undefined) {
				$.say("Missing arguments; requires player tag or alias and optional 2 character region and brawler name. Ex: !bsrank <alias> OR !bsrank <alias> us OR !bsrank <alias> global <brawler name>");
                return;
            }
			if (arg1 !== undefined) {
				if (arg2 !== undefined) {
					if (!reg.test(arg2)) {
						if (arg2.length() != 2) {
							$.say("Region incorrect; use global or 2 character region. Ex: !bsrank <alias> global OR !bsrank <alias> us");
							return;
						} else {
							region = arg2;
						}
					}
				}
				if (arg3 !== undefined) {
					if (checkBrawlers(arg3)) {
						brawler = formatBrawlerName(arg3);
					} else {
						$.say("Invalid brawler; check brawler name. Ensure spaces are removed. Ex: El Primo -> ElPrimo");
						return;
					}
				}
				var playerTag = $.getIniDbString(bsTableAlias, arg1.toUpperCase());
				if (playerTag === undefined) {
					playerTag = arg1.toUpperCase();
				}
				var r = getLeaderBoardData(region, brawler, apiLeaderBoardStr);
				var jObj = JSON.parse(r.content);
				if (r.success) {
					var rank = getPlayerRank(playerTag, jObj);
					if (rank.rank == 0) {
						if (brawler !== "") {
							$.say("Player " + arg1 + "'s " + brawler.toUpperCase() + " is unranked on the " + region.toUpperCase() + " leaderboard.");
						} else {
							$.say("Player " + arg1 + " is unranked on the " + region.toUpperCase() + " leaderboard.");
						}
					} else {
						if (brawler !== "") {
							$.say("Player " + arg1 + "'s " + brawler.toUpperCase() + " is rank " + rank.rank + " at " + rank.trophies +
							" trophies on the " + region.toUpperCase() + " leaderboard.");
						} else {
							$.say("Player " + arg1 + " is rank " + rank.rank + " at " + rank.trophies +
							" trophies on the " + region.toUpperCase() + " leaderboard.");
						}
					}
				} else {
					if (jObj.code !== undefined) {
						$.say("Error: " + jObj.code + ", Message: " + jObj.message);
					} else {
						$.say("Error connecting to API server.");
					}
				}
				return;
			}
        }
		
		if (command.equalsIgnoreCase('bsvs')) {
            // the following if/else is only required if you have arguments
			// arg1 = alias or player tag
			// arg2 = alias or player tag
			if ((arg1 === undefined) || (arg2 === undefined)) {
				$.say("Missing arguments; requires two player tags or aliases. Ex: !bsvs <alias> <alias> OR !bsvs <player tag> <alias> OR !bsvs <player tag> <player tag> ");
                return;
            } else {
				var playerTag1 = $.getIniDbString(bsTableAlias, arg1.toUpperCase());
				if (playerTag1 === undefined) {
					playerTag1 = arg1.toUpperCase();
				}
				var playerTag2 = $.getIniDbString(bsTableAlias, arg2.toUpperCase());
				if (playerTag2 === undefined) {
					playerTag2 = arg2.toUpperCase();
				}
                var r1 = getBrawlStarsData(playerTag1, apiPlayerStr);
				var r2 = getBrawlStarsData(playerTag2, apiPlayerStr);
				var jObj1 = JSON.parse(r1.content);
				var jObj2 = JSON.parse(r2.content);
				if (r1.success && r2.success) {
					var b1 = getRandomBrawler(jObj1.brawlers);
					var b2 = getRandomBrawler(jObj2.brawlers);
					var t1 = b1.trophies;
					var t2 = b2.trophies;
					var t = Math.abs(t1-t2);
					var r1 = Math.random() * (t1);
					var r2 = Math.random() * (t2);
					var a = "";
					if (t1 >= t2) {
						a = "advantage";
					} else {
						a = "disadvantage";
					}
					if (r1 > r2) {
						$.say("Player " + jObj1.name + "'s " + b1.name + " (" + b1.trophies + " trophies) battled " + jObj2.name + "'s " + b2.name +
							" (" + b2.trophies + " trophies) and WON! They had a " + t + " trophy " + a + ". Booya!");
					} else {
						$.say("Player " + jObj1.name + "'s " + b1.name + " (" + b1.trophies + " trophies) battled " + jObj2.name + "'s " + b2.name +
							" (" + b2.trophies + " trophies) and LOST! They had a " + t + " trophy " + a + ". Get rekt!");
					}
				} else {
					if ((jObj1.code !== undefined) || (jObj2.code !== undefined)) {
						$.say("Error: " + jObj1.code + "/" + jObj2.code + ", Message: " + jObj1.message + "/" + jObj2.message);
					} else {
						$.say("Error connecting to API server.");
					}
				}
                return;
            }
        }
		
		if (command.equalsIgnoreCase('bsadd')) {
		// the following if/else is only required if you have arguments
		// arg1 = player tag
		// arg2 = alias
			if (arg1 === undefined || arg2 === undefined) {
				$.say("Missing arguments; requires player tag and alias. Ex: !bsadd <player tag> <alias>");
				return;
			}
			var uAlias = arg2.toUpperCase();
			var uPlayerTag = removeHash(arg1.toUpperCase());
			if ($.getIniDbString(bsTableAlias, uAlias, undefined) === undefined) {
				var r = getBrawlStarsData(arg1, apiPlayerStr);
				if (r.success) {
					$.say("Adding alias \"" + arg2 + "\" to be linked to player tag: " + uPlayerTag);
					$.setIniDbString(bsTableAlias, uAlias, uPlayerTag);
				} else {
					$.say("Invalid player tag. Please provide a valid player tag.");
				}
			} else {
				$.say("Alias already exists. Use !bsupdate to modify aliases; only available to Regular Users");
			}
		}
		
		if (command.equalsIgnoreCase('bsupdate')) {
		// the following if/else is only required if you have arguments
		// arg1 = player tag
		// arg2 = alias
			if (arg1 === undefined || arg2 === undefined) {
				$.say("Missing arguments; requires player tag and alias. Ex: !bsupdate <player tag> <alias>");
				return;
			}
			var r = getBrawlStarsData(arg1, apiPlayerStr);
			if (r.success) {
				var uAlias = arg2.toUpperCase();
				var uPlayerTag = removeHash(arg1.toUpperCase());
				$.say("Updating alias \"" + arg2 + "\" to be linked to player tag: " + uPlayerTag);
				$.setIniDbString(bsTableAlias, uAlias, uPlayerTag);
			} else {
				$.say("Invalid player tag. Please provide a valid player tag.");
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
			$.say("Deleting alias \"" + arg1 + "\" and player tag: " + playerTag);
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
			$.say("Alias \"" + arg1 + "\" is associated with player tag: " + playerTag);
		}
	});

    $.bind('initReady', function() {
        $.registerChatCommand('./custom/bsCommand.js', 'bs', 7);
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
