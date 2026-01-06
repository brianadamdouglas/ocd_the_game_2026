/*PUT GAME BOARD GLOBALS HERE*/

			var rotaterPosition = $('#rotater').position();
			var g_rotaterX = 190;//rotaterPosition.left//300;
			var g_rotaterY = 300;//rotaterPosition.top;
			var g_stageWidth = 1252;//width of stage
			var g_stageHeight =	1688;//height of stage
			var g_stageStartX = -380; // -380
			var g_stageStartY = -400; // -400
			var g_gameboard = new Array();
			var thoughtAnimations = new Array();
			var g_startScreenElements = new Array();
			var g_instructionElements = new Array();
			var g_disclaimerElements = new Array();
			var g_loadTotal = 0;

/*PUT GAME BOARD GLOBALS HERE*/



			var stageBuilder = new StageBuilder();
			var lastBuildNum = 0;

			/**
			* @description Adds an element to the g_gameboard array which is used to build the stage
			* @param {Object} data 
			*/	
			function addStageElement(data){
				lastBuildNum = stageBuilder.addElement(data, g_gameboard,'tile');
			}


			/**
			* @description Adds an element to the thoughtAnimations array which is used to import thought animations
			* @param {Object} data 
			*/	
			function addThoughtElement(data){
				lastBuildNum = stageBuilder.addElement(data, thoughtAnimations, 'animation');
			}
			
			/**
			* @description Adds an element to the thoughtAnimations array which is used to import thought animations
			* @param {Object} data 
			*/	
			function addStartScreenElement(data){
				lastBuildNum = stageBuilder.addElement(data, g_startScreenElements, 'startScreen');
			}
			
			/**
			* @description Adds an element to the thoughtAnimations array which is used to import thought animations
			* @param {Object} data 
			*/	
			function addInstructionsElement(data){
				lastBuildNum = stageBuilder.addElement(data, g_instructionElements, 'instructions');
			}
			
			/**
			* @description Adds an element to the thoughtAnimations array which is used to import thought animations
			* @param {Object} data 
			*/	
			function addDisclaimerElement(data){
				lastBuildNum = stageBuilder.addElement(data, g_disclaimerElements, 'disclaimer');
			}

			var playerW = 76;
			var playerH = 90;
			var playerX = g_rotaterX - (playerW/2);//the player's x is always centered on the rotater and then subtracts half width to put div on center
			var playerY = g_rotaterY - (playerH/2);//the player's y is always centered on the rotater and then subtracts half height to put div on center
			var playerInfo = {type:'player', x:playerX, y:playerY, w:playerW, h:playerH, stopFrame:0, walkFrames:4, turnLeftFrame:5, turnRightFrame:6, interactFrame:7, stickyLiftOffset:[0,-14,-43,0,4,0,0,-58]};



			addStartScreenElement({type:'logo', x:28, y:25, w:319, h:221});
			addStartScreenElement({type:'startButton', x:139, y:292, w:90, h:23, IDOverride:"start", buttonFunction:"startGame"});
			addStartScreenElement({type:'instructionsButton', x:83, y:341, w:201, h:23, IDOverride:"instructions", buttonFunction:"openInstructions"});
			addStartScreenElement({type:'disclaimerButton', x:96, y:394, w:175, h:23, IDOverride:"disclaimer", buttonFunction:"openDisclaimer"});
			addStartScreenElement({type:'trademark', x:31, y:493, w:306, h:39});
			
			addInstructionsElement({type:'instructionImages', x:0, y:0, w:319, h:508});
			addInstructionsElement({type:'instructionButtonBack', x:3, y:457, w:58, h:47, IDOverride:"back", buttonFunction:"previousPanel"});
			addInstructionsElement({type:'instructionButtonForward', x:258, y:457, w:58, h:47, IDOverride:"forward", buttonFunction:"nextPanel"});
			addInstructionsElement({type:'menuClose', x:258, y:3, w:58, h:47, IDOverride:"close", buttonFunction:"close"});
			
			addDisclaimerElement({type:'disclaimerImage', x:0, y:0, w:319, h:508});
			addDisclaimerElement({type:'menuClose', x:258, y:3, w:58, h:47, IDOverride:"close", buttonFunction:"close"});


/* BATHROOM FLOOR TILE */
			
			addStageElement({type:'interactButton', x:0, y:0, w:g_stageWidth, h:g_stageHeight, IDOverride:"stageBackground"});
			addStageElement({type:'grass', x:-1000, y:-1000, w:g_stageWidth + 2000, h:1000});
			addStageElement({type:'grass', x:-1000, y:0, w:1000, h:g_stageHeight +1000});
			addStageElement({type:'grass', x:0, y:g_stageHeight, w:g_stageWidth + 2000, h:1000});
			addStageElement({type:'grass', x:g_stageWidth - 52, y:0, w:50, h:950});
			addStageElement({type:'grass', x:g_stageWidth- 4, y:0, w:1000, h:g_stageHeight}); 
			
			addStageElement({type:'bathroomTile', x:855, y:634, w:65, h:65});
			addStageElement({type:'bathroomTile', x:920, y:634, w:65, h:65});
			addStageElement({type:'bathroomTile', x:985, y:634, w:65, h:65});
			
			addStageElement({type:'bathroomTile', x:855, y:699, w:65, h:65});
			addStageElement({type:'bathroomTile', x:920, y:699, w:65, h:65});
			addStageElement({type:'bathroomTile', x:985, y:699, w:65, h:65});
			
			addStageElement({type:'bathroomTile', x:855, y:764, w:65, h:65});
			addStageElement({type:'bathroomTile', x:920, y:764, w:65, h:65});
			addStageElement({type:'bathroomTile', x:985, y:764, w:65, h:65});
			
			addStageElement({type:'bathroomTile', x:790, y:829, w:65, h:65});
			addStageElement({type:'bathroomTile', x:855, y:829, w:65, h:65});
			addStageElement({type:'bathroomTile', x:920, y:829, w:65, h:65});
			addStageElement({type:'bathroomTile', x:985, y:829, w:65, h:65});
			
			addStageElement({type:'bathroomTile', x:790, y:894, w:65, h:65});
			addStageElement({type:'bathroomTile', x:855, y:894, w:65, h:65});
			addStageElement({type:'bathroomTile', x:920, y:894, w:65, h:65});
			addStageElement({type:'bathroomTile', x:985, y:894, w:65, h:65});
			
			addStageElement({type:'bathroomTile', x:790, y:959, w:65, h:65});
			addStageElement({type:'bathroomTile', x:855, y:959, w:65, h:65});
			addStageElement({type:'bathroomTile', x:920, y:959, w:65, h:65});
			addStageElement({type:'bathroomTile', x:985, y:959, w:65, h:65});
			
			addStageElement({type:'bathroomTile', x:790, y:1024, w:65, h:65});
			addStageElement({type:'bathroomTile', x:855, y:1024, w:65, h:65});
			addStageElement({type:'bathroomTile', x:920, y:1024, w:65, h:65});
			addStageElement({type:'bathroomTile', x:985, y:1024, w:65, h:65});
			
			addStageElement({type:'bathroomCounterTile', x:1044, y:639, w:40, h:40});
			addStageElement({type:'bathroomCounterTile', x:1084, y:639, w:40, h:40});
			addStageElement({type:'bathroomCounterTile', x:1124, y:639, w:40, h:40});
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:639, w:23, h:40});
			addStageElement({type:'blueShim', x:1044, y:639, w:2, h:40});
			
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:679, w:23, h:40});
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:719, w:23, h:40});
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:759, w:23, h:40});
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:799, w:23, h:40});
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:839, w:23, h:40});
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:879, w:23, h:40});
			
			
			addStageElement({type:'bathroomCounterTile', x:1044, y:903, w:40, h:40});
			addStageElement({type:'bathroomCounterTile', x:1084, y:903, w:40, h:40});
			addStageElement({type:'bathroomCounterTile', x:1124, y:903, w:40, h:40});
			addStageElement({type:'bathroomCounterTileHalf', x:1164, y:903, w:23, h:40});
			addStageElement({type:'blueShim', x:1044, y:903, w:2, h:40});
			
			
			
			/* TOP WALL*/
			
			addStageElement({type:'outerwallCornerInTL', x:0, y:0, w:20, h:20});
			addStageElement({type:'outerwallT', x:20, y:0, w:80, h:20});
			addStageElement({type:'outerwallT', x:100, y:0, w:100, h:20});
			addStageElement({type:'outerwallT', x:200, y:0, w:100, h:20});
			addStageElement({type:'outerwallT', x:300, y:0, w:100, h:20});
			addStageElement({type:'outerwallT', x:400, y:0, w:100, h:20});
			addStageElement({type:'outerwallT', x:500, y:0, w:100, h:20});
			addStageElement({type:'outerwallT', x:600, y:0, w:56, h:20});
			addStageElement({type:'outerwallTT', x:656, y:0, w:20, h:20});
			addStageElement({type:'innerwallCapDTopWall', x:656, y:20, w:20, h:75});////
			addStageElement({type:'outerwallT', x:676, y:0, w:100, h:20});
			addStageElement({type:'outerwallCornerInTR', x:776, y:0, w:20, h:20}); 
			
			/* RIGHT WALL*/
			
			
			addStageElement({type:'outerwallR', x:776, y:20, w:20, h:80});
			addStageElement({type:'outerwallR', x:776, y:100, w:20, h:100});
			addStageElement({type:'outerwallCornerOutBL', x:776, y:200, w:20, h:20});
			addStageElement({type:'outerwallT', x:796, y:200, w:48, h:20});
			addStageElement({type:'outerwallCornerInTR', x:844, y:200, w:20, h:20});
			addStageElement({type:'outerwallR', x:844, y:220, w:20, h:80});
			addStageElement({type:'outerwallR', x:844, y:300, w:20, h:80});
			addStageElement({type:'outerwallR', x:844, y:380, w:20, h:28});
			addStageElement({type:'innerwallCapDDoorRightWall', x:572, y:408, w:20, h:56});
			addStageElement({type:'innerwallH', x:592, y:408, w:64, h:20});
			addStageElement({type:'innerwallTB', x:656, y:408, w:20, h:20});
			addStageElement({type:'innerwallCapUClosetWall', x:656, y:343, w:20, h:65});
			addStageElement({type:'innerwallH', x:676, y:408, w:48, h:20});
			addStageElement({type:'innerwallH', x:724, y:408, w:78, h:20});
			addStageElement({type:'innerwallH', x:802, y:408, w:42, h:20});
			addStageElement({type:'innerAndOuterwallSplitBR', x:844, y:408, w:20, h:20});
			addStageElement({type:'outerwallCapTLEntrance', x:864, y:408, w:54, h:20});
			addStageElement({type:'outerwallCapTREntrance', x:1018, y:408, w:86, h:20});
			addStageElement({type:'outerwallT', x:1104, y:408, w:28, h:20});
			addStageElement({type:'outerwallT', x:1132, y:408, w:48, h:20});
			addStageElement({type:'outerwallCornerInTR', x:1180, y:408, w:20, h:20});
			addStageElement({type:'outerwallR', x:1180, y:428, w:20, h:50});
			addStageElement({type:'windowR', x:1180, y:478, w:20, h:100});
			addStageElement({type:'outerwallR', x:1180, y:578, w:20, h:41});
			addStageElement({type:'innerwallCapRBathroomRight', x:1019, y:619, w:70, h:20});
			addStageElement({type:'innerwallH', x:1089, y:619, w:91, h:20});
			addStageElement({type:'outerwallTR', x:1180, y:619, w:20, h:20});
			addStageElement({type:'outerwallR', x:1180, y:639, w:20, h:50});
			addStageElement({type:'windowR', x:1180, y:689, w:20, h:100});
			addStageElement({type:'windowR', x:1180, y:789, w:20, h:100});
			addStageElement({type:'outerwallR', x:1180, y:889, w:20, h:45});
			addStageElement({type:'innerwallCornerTL', x:1039, y:934, w:20, h:20});
			addStageElement({type:'innerwallH', x:1059, y:934, w:54, h:20});
			addStageElement({type:'innerwallH', x:1113, y:934, w:67, h:20});
			addStageElement({type:'innerAndOuterwallSplitBR', x:1180, y:934, w:20, h:20});
			addStageElement({type:'outerwallT', x:1200, y:934, w:32, h:20});
			addStageElement({type:'outerwallCornerInTR', x:1232, y:934, w:20, h:20});
			addStageElement({type:'outerwallR', x:1232, y:954, w:20, h:100});
			addStageElement({type:'outerwallR', x:1232, y:1054, w:20, h:50});
			addStageElement({type:'innerwallCapRLivingroomClosetRight', x:1179, y:1104, w:53, h:20});
			addStageElement({type:'outerwallTR', x:1232, y:1104, w:20, h:20});
			addStageElement({type:'outerwallR', x:1232, y:1124, w:20, h:100});
			addStageElement({type:'outerwallR', x:1232, y:1224, w:20, h:73});
			addStageElement({type:'windowR', x:1232, y:1297, w:20, h:100});
			addStageElement({type:'windowR', x:1232, y:1397, w:20, h:100});
			addStageElement({type:'outerwallR', x:1232, y:1497, w:20, h:100});
			addStageElement({type:'outerwallR', x:1232, y:1597, w:20, h:71});
			
			
			/* LEFT WALL*/
			addStageElement({type:'outerwallL', x:0, y:20, w:20, h:80});
			addStageElement({type:'windowL', x:0, y:100, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:200, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:300, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:400, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:500, w:20, h:100});
			addStageElement({type:'outerwallL', x:0, y:600, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:700, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:800, w:20, h:100});
			addStageElement({type:'outerwallL', x:0, y:900, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:1000, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:1100, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:1200, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:1300, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:1400, w:20, h:100});
			addStageElement({type:'windowL', x:0, y:1500, w:20, h:100});
			addStageElement({type:'outerwallL', x:0, y:1600, w:20, h:68});
			
			
			
			/* BOTTOM WALL*/
			addStageElement({type:'outerwallCornerInBL', x:0, y:1668, w:20, h:20});
			addStageElement({type:'outerwallB', x:20, y:1668, w:91, h:20});
			addStageElement({type:'windowB', x:111, y:1668, w:100, h:20});
			addStageElement({type:'windowB', x:211, y:1668, w:100, h:20});
			addStageElement({type:'outerwallB', x:311, y:1668, w:100, h:20});
			addStageElement({type:'outerwallB', x:411, y:1668, w:100, h:20});
			addStageElement({type:'outerwallB', x:511, y:1668, w:100, h:20});
			addStageElement({type:'outerwallB', x:611, y:1668, w:100, h:20});
			addStageElement({type:'outerwallB', x:711, y:1668, w:21, h:20});
			addStageElement({type:'windowB', x:732, y:1668, w:100, h:20});
			addStageElement({type:'windowB', x:832, y:1668, w:100, h:20});
			addStageElement({type:'windowB', x:932, y:1668, w:100, h:20});
			addStageElement({type:'windowB', x:1032, y:1668, w:100, h:20});
			addStageElement({type:'outerwallB', x:1132, y:1668, w:100, h:20});
			addStageElement({type:'outerwallCornerInBR', x:1232, y:1668, w:20, h:20});
			
			/* INNER WALL KITCHEN TOP */
			addStageElement({type:'innerwallCapRKitchenTop', x:204, y:620, w:28, h:20});
			addStageElement({type:'innerwallKitchenTopLeft', x:232, y:600, w:41, h:40});
			addStageElement({type:'outerwallT', x:273, y:620, w:63, h:20});
			addStageElement({type:'outerwallT', x:336, y:620, w:100, h:20});
			addStageElement({type:'outerwallT', x:436, y:620, w:50, h:20});
			addStageElement({type:'outerwallT', x:486, y:620, w:66, h:20});
			addStageElement({type:'innerwallCapLKitchenTop', x:588, y:620, w:24, h:20});
			addStageElement({type:'outerwallB', x:273, y:600, w:63, h:20});
			addStageElement({type:'outerwallB', x:336, y:600, w:100, h:20});
			addStageElement({type:'outerwallB', x:436, y:600, w:50, h:20});
			addStageElement({type:'outerwallB', x:486, y:600, w:66, h:20});
			addStageElement({type:'innerwallKitchenTopRight', x:552, y:600, w:40, h:40});
			addStageElement({type:'innerwallCapUKitchenTop', x:572, y:564, w:20, h:36});////
			addStageElement({type:'innerwallV', x:572, y:640, w:20, h:71});
			addStageElement({type:'innerwallCapD', x:572, y:711, w:20, h:20});////
			
			/* INNER WALL KITCHEN SIDE */
			addStageElement({type:'innerwallCapRKitchenSide', x:510, y:1084, w:63, h:20});
			addStageElement({type:'innerwallTB', x:572, y:1084, w:20, h:20});
			addStageElement({type:'innerwallCapLKitchenSide', x:591, y:1084, w:31, h:20});
			addStageElement({type:'innerwallV', x:572, y:988, w:20, h:96});
			addStageElement({type:'innerwallV', x:572, y:944, w:20, h:44});
			addStageElement({type:'innerwallV', x:572, y:868, w:20, h:76});
			addStageElement({type:'innerwallCapU', x:572, y:858, w:20, h:20});////
			
			
			/* BATHROOM WALL BOTTOM */ //innerwallBathroomBottomRight
			addStageElement({type:'innerwallBathroomBottomLeft', x:775, y:1084, w:65, h:40});
			addStageElement({type:'outerwallT', x:840, y:1104, w:39, h:20});
			addStageElement({type:'outerwallT', x:879, y:1104, w:90, h:20});
			addStageElement({type:'outerwallT', x:969, y:1104, w:41, h:20});
			addStageElement({type:'innerwallBathroomBottomRight', x:1010, y:1084, w:49, h:40});
			addStageElement({type:'innerwallCapL', x:1059, y:1104, w:20, h:20});////
			addStageElement({type:'innerwallCapRBathroomBottom', x:747, y:1084, w:28, h:20});////
			addStageElement({type:'outerwallB', x:840, y:1084, w:39, h:20});
			addStageElement({type:'outerwallB', x:879, y:1084, w:90, h:20});
			addStageElement({type:'outerwallB', x:969, y:1084, w:41, h:20});
			addStageElement({type:'innerwallV', x:1039, y:990, w:20, h:94});
			addStageElement({type:'innerwallV', x:1039, y:954, w:20, h:36});
			addStageElement({type:'innerwallCapU', x:775, y:1062, w:20, h:22});////
			
			/* BATHROOM WALL TOP(BOTTOM) */
			addStageElement({type:'innerwallCapUBathroomBottom1', x:755, y:816, w:20, h:62});////
			addStageElement({type:'innerwallTT', x:775, y:858, w:20, h:20});
			addStageElement({type:'innerwallH', x:795, y:858, w:7, h:20});
			addStageElement({type:'innerwallCapUBathroomBottom2', x:802, y:788, w:20, h:90});
			addStageElement({type:'innerwallCapDBathroomBottom', x:775, y:878, w:20, h:84});
			
			/* BATHROOM WALL TOP(TOP) */
			addStageElement({type:'innerwallCapDBathroomTop1', x:755, y:639, w:20, h:65});
			addStageElement({type:'innerwallCapRBathroomTop', x:732, y:619, w:23, h:20});
			addStageElement({type:'innerwallTT', x:755, y:619, w:20, h:20});
			addStageElement({type:'innerwallH', x:775, y:619, w:27, h:20});
			addStageElement({type:'innerwallBathroomTopRight1', x:802, y:619, w:20, h:36});
			addStageElement({type:'innerwallCapDBathroomTop2', x:802, y:655, w:20, h:79});
			addStageElement({type:'innerwallBathroomTopRight2', x:822, y:599, w:60, h:56});
			addStageElement({type:'innerwallCapLBathroomTop', x:880, y:619, w:38, h:20});
			
			
			
			
			
			
			
			/* FURNITURE*/
			
			/* BEDROOM */
			addStageElement({type:'bed1', x:280, y:20, w:100, h:80});
			addStageElement({type:'bed2', x:380, y:20, w:100, h:80});
			addStageElement({type:'bed3', x:280, y:100, w:100, h:100});
			addStageElement({type:'bed4', x:380, y:100, w:100, h:100});
			addStageElement({type:'bed5', x:280, y:200, w:100, h:100});
			addStageElement({type:'bed6', x:380, y:200, w:100, h:100});
			addStageElement({type:'blueChair', x:30, y:180, w:90, h:76});
			//addStageElement({type:'livingroomPlant', x:25, y:100, w:71, h:75});
			addStageElement({type:'bedroomDresserLeft', x:330, y:528, w:100, h:72});
			addStageElement({type:'bedroomDresserRight', x:430, y:528, w:34, h:72});
			addStageElement({type:'garbageCan', x:286, y:548, w:40, h:40});
			addStageElement({type:'hamper', x:678, y:19, w:96, h:74});
			
			
			
			
			/* KITCHEN*/
			
			addStageElement({type:'barStoolHorz', x:160, y:670, w:61, h:53, moveObject:{x:0, y:0, xMax:0, yMax:0, up:false, down:false, left:false, right:false}});
			addStageElement({type:'barStoolHorz', x:160, y:740, w:61, h:53, moveObject:{x:0, y:0, xMax:0, yMax:0, up:false, down:false, left:false, right:false}});
			addStageElement({type:'barStoolHorz', x:160, y:810, w:61, h:53, moveObject:{x:0, y:0, xMax:0, yMax:0, up:false, down:false, left:false, right:false}});
			
			
			
			addStageElement({type:'marbleThinShim', x:222, y:640, w:28, h:20});
			addStageElement({type:'marbleThin', x:222, y:660, w:28, h:50});
			addStageElement({type:'marbleThin', x:222, y:710, w:28, h:50});
			addStageElement({type:'marbleThin', x:222, y:760, w:28, h:50});
			addStageElement({type:'marbleThin', x:222, y:810, w:28, h:50});
			addStageElement({type:'marbleThin', x:222, y:860, w:28, h:50});
			addStageElement({type:'marbleFull', x:252, y:640, w:80, h:80});
			addStageElement({type:'marbleFull', x:252, y:720, w:80, h:80});
			addStageElement({type:'marbleFull', x:252, y:800, w:80, h:80});
			addStageElement({type:'marbleFullHalf', x:252, y:880, w:80, h:30});
			addStageElement({type:'marbleFull', x:332, y:640, w:80, h:80});
			addStageElement({type:'marbleFull', x:412, y:640, w:80, h:80});
			addStageElement({type:'marbleFull', x:492, y:640, w:80, h:80});
			addStageElement({type:'marbleThinDouble', x:222, y:910, w:56, h:50});
			addStageElement({type:'marbleThinDouble', x:278, y:910, w:56, h:50});
			addStageElement({type:'greyShim', x:250, y:640, w:2, h:270});
			addStageElement({type:'greyShim', x:250, y:910, w:84, h:2});
			addStageElement({type:'kitchenSinkRight', x:260, y:744, w:70, h:58});
			addStageElement({type:'kitchenSinkLeft', x:260, y:802, w:70, h:64});
			
			
			
			addStageElement({type:'kitchenMat1', x:358, y:750, w:49, h:50});
			addStageElement({type:'kitchenMat2', x:407, y:750, w:49, h:50});
			addStageElement({type:'kitchenMat3', x:358, y:800, w:49, h:50});
			addStageElement({type:'kitchenMat4', x:407, y:800, w:25, h:25});
			addStageElement({type:'kitchenMat5', x:432, y:800, w:24, h:25});
			addStageElement({type:'kitchenMat6', x:407, y:825, w:25, h:25});
			

			
			/* BATHROOM FIXTURES */
			addStageElement({type:'bathtub1', x:1050, y:679, w:100, h:100});
			addStageElement({type:'bathtub2', x:1150, y:679, w:24, h:100});
			addStageElement({type:'bathtub3', x:1050, y:779, w:100, h:100});
			addStageElement({type:'bathtub4', x:1150, y:779, w:24, h:100});
			addStageElement({type:'bathtub5', x:1050, y:879, w:100, h:24});
			addStageElement({type:'bathtub6', x:1150, y:879, w:24, h:24});
			
			addStageElement({type:'toilet', x:927, y:988, w:62, h:96});
			
			/* LIVING ROOM */
			addStageElement({type:'livingroomRug', x:725, y:1235, w:50, h:50});
			addStageElement({type:'livingroomRug', x:775, y:1235, w:50, h:50});
			addStageElement({type:'livingroomRug', x:825, y:1235, w:50, h:50});
			addStageElement({type:'livingroomRug', x:875, y:1235, w:50, h:50});
			addStageElement({type:'livingroomRug', x:925, y:1235, w:50, h:50});
			addStageElement({type:'livingroomRug', x:975, y:1235, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1025, y:1235, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1075, y:1235, w:50, h:50});
			
			addStageElement({type:'livingroomRug', x:725, y:1285, w:50, h:50});
			addStageElement({type:'livingroomRug', x:775, y:1285, w:50, h:50});
			addStageElement({type:'livingroomRug', x:825, y:1285, w:50, h:50});
			addStageElement({type:'livingroomRug', x:875, y:1285, w:50, h:50});
			addStageElement({type:'livingroomRug', x:925, y:1285, w:50, h:50});
			addStageElement({type:'livingroomRug', x:975, y:1285, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1025, y:1285, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1075, y:1285, w:50, h:50});
			
			addStageElement({type:'livingroomRug', x:725, y:1335, w:50, h:50});
			addStageElement({type:'livingroomRug', x:775, y:1335, w:50, h:50});
			addStageElement({type:'livingroomRug', x:825, y:1335, w:50, h:50});
			addStageElement({type:'livingroomRug', x:875, y:1335, w:50, h:50});
			addStageElement({type:'livingroomRug', x:925, y:1335, w:50, h:50});
			addStageElement({type:'livingroomRug', x:975, y:1335, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1025, y:1335, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1075, y:1335, w:50, h:50});
			
			addStageElement({type:'livingroomRug', x:725, y:1385, w:50, h:50});
			addStageElement({type:'livingroomRug', x:775, y:1385, w:50, h:50});
			addStageElement({type:'livingroomRug', x:825, y:1385, w:50, h:50});
			addStageElement({type:'livingroomRug', x:875, y:1385, w:50, h:50});
			addStageElement({type:'livingroomRug', x:925, y:1385, w:50, h:50});
			addStageElement({type:'livingroomRug', x:975, y:1385, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1025, y:1385, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1075, y:1385, w:50, h:50});
			
			addStageElement({type:'livingroomRug', x:725, y:1435, w:50, h:50});
			addStageElement({type:'livingroomRug', x:775, y:1435, w:50, h:50});
			addStageElement({type:'livingroomRug', x:825, y:1435, w:50, h:50});
			addStageElement({type:'livingroomRug', x:875, y:1435, w:50, h:50});
			addStageElement({type:'livingroomRug', x:925, y:1435, w:50, h:50});
			addStageElement({type:'livingroomRug', x:975, y:1435, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1025, y:1435, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1075, y:1435, w:50, h:50});
			
			addStageElement({type:'livingroomRug', x:725, y:1485, w:50, h:50});
			addStageElement({type:'livingroomRug', x:775, y:1485, w:50, h:50});
			addStageElement({type:'livingroomRug', x:825, y:1485, w:50, h:50});
			addStageElement({type:'livingroomRug', x:875, y:1485, w:50, h:50});
			addStageElement({type:'livingroomRug', x:925, y:1485, w:50, h:50});
			addStageElement({type:'livingroomRug', x:975, y:1485, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1025, y:1485, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1075, y:1485, w:50, h:50});
			
			addStageElement({type:'livingroomRug', x:725, y:1535, w:50, h:50});
			addStageElement({type:'livingroomRug', x:775, y:1535, w:50, h:50});
			addStageElement({type:'livingroomRug', x:825, y:1535, w:50, h:50});
			addStageElement({type:'livingroomRug', x:875, y:1535, w:50, h:50});
			addStageElement({type:'livingroomRug', x:925, y:1535, w:50, h:50});
			addStageElement({type:'livingroomRug', x:975, y:1535, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1025, y:1535, w:50, h:50});
			addStageElement({type:'livingroomRug', x:1075, y:1535, w:50, h:50});
			
			
			addStageElement({type:'livingroomPlant', x:770, y:1125, w:71, h:75});
			addStageElement({type:'coffeeTableLeft', x:856, y:1340, w:100, h:82});
			addStageElement({type:'coffeeTableRight', x:956, y:1340, w:57, h:82});
			
			addStageElement({type:'sofa1', x:784, y:1525, w:100, h:100});
			addStageElement({type:'sofa2', x:884, y:1525, w:100, h:100});
			addStageElement({type:'sofa3', x:984, y:1525, w:98, h:100});
			addStageElement({type:'sofa4', x:784, y:1625, w:100, h:35});
			addStageElement({type:'sofa5', x:884, y:1625, w:100, h:35});
			addStageElement({type:'sofa6', x:984, y:1625, w:98, h:35});
			
			addStageElement({type:'roundChair1', x:645, y:1326, w:55, h:55});
			addStageElement({type:'roundChair2', x:700, y:1326, w:52, h:55});
			addStageElement({type:'roundChair3', x:645, y:1381, w:55, h:55});
			addStageElement({type:'roundChair4', x:700, y:1381, w:52, h:55});
			
			addStageElement({type:'livingroomPlant', x:617, y:1460, w:71, h:75});
			
			
			addStageElement({type:'sofaEndTable1Plug', x:700, y:1635, w:6, h:33});
			addStageElement({type:'sofaEndTable1Plug', x:1139, y:1635, w:6, h:33});
			
			
			/* OFFICE */
			addStageElement({type:'bookcase1', x:544, y:1371, w:76, h:37});
			addStageElement({type:'bookcase2', x:544, y:1408, w:40, h:92});
			addStageElement({type:'bookcase3', x:584, y:1408, w:36, h:92});
			addStageElement({type:'bookcase4', x:544, y:1500, w:76, h:100});
			addStageElement({type:'bookcase5', x:544, y:1600, w:76, h:68});
			addStageElement({type:'bookcase6', x:379, y:1609, w:94, h:59});
			addStageElement({type:'bookcase7', x:473, y:1609, w:71, h:59});
			
			addStageElement({type:'tvTableLeft', x:844, y:1124, w:100, h:84});
			addStageElement({type:'tvTableRight', x:944, y:1124, w:84, h:84});
			addStageElement({type:'tvBack', x:889, y:1137, w:94, h:21});
			addStageElement({type:'bookInBookcase', x:542, y:1424, w:10, h:7, IDOverride:"bookInBookcase"});
			addStageElement({type:'dropTarget', x:680, y:40, w:90, h:75, IDOverride:"hamper", dropTargetFunction:"e_dropTargetHamper"});
			addStageElement({type:'dropTarget', x:520, y:1410, w:47, h:57, IDOverride:"bookcase", dropTargetFunction:"e_dropTargetBookcase"});
			
			addStageElement({type:'deskChair1', x:210, y:1531, w:66, h:70});
			addStageElement({type:'deskChair2', x:210, y:1357, w:68, h:67});
			addStageElement({type:'desk1', x:116, y:1428, w:94, h:80});
			addStageElement({type:'desk2', x:116, y:1508, w:94, h:24});
			addStageElement({type:'desk3', x:210, y:1428, w:85, h:80});
			addStageElement({type:'desk4', x:210, y:1508, w:85, h:23});
			addStageElement({type:'desk6', x:295, y:1508, w:80, h:24});
			addStageElement({type:'livingroomPlant', x:30, y:1590, w:71, h:75});
			
			
			
			/* THIS MUST BE IN BETWEEN ALL ITEMS THAT ARE MERELY OBSTACLES AND THOSE THAT CAN BE INTERACTED WITH AS IT WILL CATCH ALL TOUCH INPUT*/
		//	addStageElement({type:'interactButton', x:0, y:0, w:g_stageWidth, h:g_stageHeight, IDOverride:"swipeInterface"});
			
			
			
			
			
			
			/* INTERACTIVE ITEMS */
			/* DOORS */
			
			// from hall to bedroom
			addStageElement({type:'door0Deg', x:571, y:464, w:22, h:100, listener:'tile' + (lastBuildNum + 2), state:true});
			addStageElement({type:'door90Deg', x:477, y:550, w:100, h:22, listener:'tile' + lastBuildNum, state:false});
			
			// from hall to bathroom top
			addStageElement({type:'door90Deg', x:918, y:618, w:100, h:22, listener:'tile' + (lastBuildNum + 2), state:true});
			addStageElement({type:'door180Deg', x:1001, y:630, w:22, h:100, listener:'tile' + lastBuildNum, state:false});
			
			// from hall to bathroom bottom
			addStageElement({type:'door0Deg', x:774, y:962, w:22, h:100, listener:'tile' + (lastBuildNum + 2), state:true});
			addStageElement({type:'door270Deg', x:788, y:1046, w:100, h:22, listener:'tile' + lastBuildNum, state:false});
			
			// from hall to outside
			addStageElement({type:'door90Deg', x:918, y:407, w:100, h:22, listener:'tile' + (lastBuildNum + 2), state:true});
			addStageElement({type:'door0Deg', x:1001, y:312, w:22, h:100, listener:'tile' + lastBuildNum, state:false, thoughtType:'frontDoor'});		
			
			// closet in living room
			addStageElement({type:'door90Deg', x:1079, y:1103, w:100, h:22, listener:'tile' + (lastBuildNum + 2), state:true});
			addStageElement({type:'door180Deg', x:1162, y:1113, w:22, h:100, listener:'tile' + lastBuildNum, state:false});
			
			// hinged door top
			addStageElement({type:'hingedDoorOpenTop', x:607, y:96, w:64, h:54, listener1:'tile' + (lastBuildNum + 2), listener2:'tile' + (lastBuildNum + 3), state:false});
			addStageElement({type:'hingedDoorClosedTop1', x:660, y:95, w:10, h:62, state:true});
			addStageElement({type:'hingedDoorClosedTop2', x:654, y:157, w:22, h:62, listener1:'tile' + (lastBuildNum - 1), listener2:'tile' + lastBuildNum, state:true});
			
			// hinged door bottom
			addStageElement({type:'hingedDoorOpenBottom', x:607, y:289, w:64, h:54, listener1:'tile' + (lastBuildNum + 2), listener2:'tile' + (lastBuildNum + 3), state:false});
			addStageElement({type:'hingedDoorClosedBottom1', x:660, y:281, w:10, h:62, state:true});
			addStageElement({type:'hingedDoorClosedBottom2', x:654, y:219, w:22, h:62, listener1:'tile' + (lastBuildNum - 1), listener2:'tile' + lastBuildNum, state:true});
			
			
			/* BEDROOM */
			addStageElement({type:'nightstand', x:190, y:20, w:80, h:60});
			addStageElement({type:'plug', x:150, y:20, w:40, h:10, listener:'tile' + lastBuildNum, thoughtType:'lampBR'});
			addStageElement({type:'bedroomCandle', x:334, y:535, w:28, h:28, thoughtType:'candle'});
			/* KITCHEN */
			addStageElement({type:'range', x:360, y:650, w:100, h:66});
			addStageElement({type:'rangeController', x:360, y:720, w:100, h:12,listener:'tile' + lastBuildNum, thoughtType:'kitchenRange'});
			addStageElement({type:'kitchenMat7', x:432, y:825, w:24, h:25, thoughtType:'matCorner'});
			addStageElement({type:'kitchenSinkWater', x:270, y:810, w:50, h:46, thoughtType:'kitchenSink'});
			addStageElement({type:'barStoolHorz', x:160, y:920, w:61, h:53, moveObject:{x:5, y:5, xMax:0, yMax:30, up:true, down:false, left:false, right:false},thoughtType:'chairBar'});
			
			addStageElement({type:'kitchenTableBase', x:222, y:1119, w:102, h:79});
			addStageElement({type:'kitchenChairDown', x:243, y:1065, w:60, h:78});
			addStageElement({type:'kitchenChairUp', x:243, y:1173, w:60, h:78});
			addStageElement({type:'kitchenChairRight', x:112, y:1137, w:78, h:60, moveObject:{x:4, y:4, xMax:16, yMax:30, up:true, down:true, left:true, right:true},thoughtType:'chairTable'});
			addStageElement({type:'kitchenChairLeft', x:387, y:1121, w:78, h:60, moveObject:{x:4, y:4, xMax:16, yMax:30, up:true, down:true, left:true, right:true},thoughtType:'chairTable'});
			addStageElement({type:'kitchenTable1', x:165, y:1098, w:70, h:60});
			addStageElement({type:'kitchenTable2', x:235, y:1098, w:75, h:60});
			addStageElement({type:'kitchenTable3', x:310, y:1098, w:70, h:60});
			addStageElement({type:'kitchenTable4', x:165, y:1158, w:70, h:60});
			addStageElement({type:'kitchenTable5', x:235, y:1158, w:75, h:60});
			addStageElement({type:'kitchenTable6', x:310, y:1158, w:70, h:60});
			//addStageElement({type:'kitchenSinkController', x:322, y:810, w:10, h:46,listener:'tile' + lastBuildNum, thoughtType:'range'});
			/* LIVING ROOM */
			addStageElement({type:'tvFront', x:880, y:1158, w:112, h:11, thoughtType:'tv'});
			addStageElement({type:'tvRemote', x:982, y:1179, w:30, h:30 ,listener:'tile' + lastBuildNum, thoughtType:'range', stickyHoldingOffset:{0:[-3,1], 90:[-2,6], 180:[3,-1], 270:[-8,3]}});//x:982, y:1179
			addStageElement({type:'sofaEndTable1Interact', x:662, y:1537, w:98, h:98, thoughtType:'lampLR'});
			addStageElement({type:'sofaEndTable1Interact', x:1100, y:1537, w:98, h:98, thoughtType:'lampLR'});
			/* OFFICE */
			addStageElement({type:'desk5', x:295, y:1428, w:80, h:80, thoughtType:'lampOffice'});
			
			
			addStageElement({type:'sock', x:720, y:250, w:30, h:30,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]}});//w:19, h:24
			addStageElement({type:'sock', x:734, y:187, w:30, h:30,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]}});//w:19, h:24
			addStageElement({type:'pants', x:689, y:230, w:46, h:37,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]}});//w:19, h:24
			addStageElement({type:'underwear', x:718, y:247, w:48, h:25,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]}});//w:19, h:24
			addStageElement({type:'shirt', x:695, y:200, w:66, h:39,stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]}});//w:19, h:24
			
			addStageElement({type:'book', x:108, y:1480, w:39, h:39,stickyHoldingOffset:{0:[-20,-10], 90:[20,-10], 180:[20,10], 270:[-20,10]},thoughtType:'bookOffice'});//x:187, y:1460
			
			addStageElement({type:'bathWater', x:1065, y:693, w:96, h:200});
			addStageElement({type:'bathWaterTrigger', x:1065, y:703, w:30, h:80,listener:'tile' + lastBuildNum, thoughtType:'bathtub'});
			addStageElement({type:'bathroomTubFaucet', x:1098, y:668, w:36, h:28});

			/* THIS MUST BE IN BETWEEN ALL ITEMS THAT ARE MERELY OBSTACLES AND THOSE THAT CAN BE INTERACTED WITH AS IT WILL CATCH ALL TOUCH INPUT*/
			addStageElement({type:'interactButton', x:0, y:0, w:g_stageWidth, h:g_stageHeight, IDOverride:"swipeInterface"});
			

/* THOUGHT ANIMATIONS*/
			addThoughtElement({name:'candle', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/candleThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'lampBR', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/lampBRThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'lampOffice', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/lampOfficeThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'bookOffice', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/bookOfficeThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'chairBar', x:8, y:8, w:157, h:116, frameCount:6, frameRoot:"/img/gameDev/chairBarThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'chairTable', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/chairTableThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'matCorner', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/matCornerThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'kitchenSink', x:8, y:8, w:157, h:116, frameCount:4, frameRoot:"/img/gameDev/kitchenSinkThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'kitchenRange', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/kitchenRangeThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'frontDoor', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/frontDoorThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'tv', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/tvThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'lampLR', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/lampLRThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'toilet', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/toiletThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'bathtub', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/bathtubThought/animation", frameType:".gif", className:"animationSequence"});
			addThoughtElement({name:'laundry', x:8, y:8, w:157, h:116, frameCount:3, frameRoot:"/img/gameDev/laundryThought/animation", frameType:".gif", className:"animationSequence"});





			var thoughtInfo = {type:'thoughtBubble', x:g_rotaterX - 87, y:g_rotaterY - 190, w:173, h:158, stickyHoldingOffset:{0:[0,0], 90:[0,0], 180:[0,0], 270:[0,0]}};
			
			var maskInfo = {type:'featheredMask', x:0, y:0, w:375, h:559};
			
			//Lookup table for classes associated with parts of the gameBoard
			var gameBoardClasses = {
									player:"player", 
									thoughtBubble:"thoughtBubble", 
									featheredMask:"mask",
									outerwallL:"obstacle", 
									outerwallR:"obstacle", 
									outerwallB:"obstacle", 
									outerwallT:"obstacle",
									outerwallTL:"obstacle", 
									outerwallTR:"obstacle", 
									outerwallTB:"obstacle", 
									outerwallTT:"obstacle",
									innerwallTB:"obstacle",
									innerwallTL:"obstacle",
									innerwallTR:"obstacle",
									innerwallTT:"obstacle",  
									innerwallCapL:"obstacle",
									innerwallCapU:"obstacle",
									innerwallCapR:"obstacle",
									innerwallCapD:"obstacle",
									innerwallCapDTopWall:"obstacle",
									innerwallCapDDoorRightWall:"obstacle",
									innerwallCapDBathroomBottom:"obstacle",
									innerwallCapDBathroomTop1:"obstacle",
									innerwallCapDBathroomTop2:"obstacle",
									innerwallCapLKitchenTop:"obstacle",
									innerwallCapLKitchenSide:"obstacle",
									innerwallCapLBathroomTop:"obstacle",
									innerwallCapRKitchenTop:"obstacle",
									innerwallCapRKitchenSide:"obstacle",
									innerwallCapRBathroomBottom:"obstacle",
									innerwallCapRBathroomRight:"obstacle",
									innerwallCapRBathroomTop:"obstacle",
									innerwallCapRLivingroomClosetRight:"obstacle",
									innerwallCapUBathroomBottom1:"obstacle",
									innerwallCapUBathroomBottom2:"obstacle",
									innerwallCapUClosetWall:"obstacle",
									innerwallCapUKitchenTop:"obstacle",
									innerwallKitchenTopLeft:"obstacle",
									innerwallKitchenTopRight:"obstacle",
									innerwallBathroomBottomLeft:"obstacle",
									innerwallBathroomBottomRight:"obstacle",
									innerwallBathroomTopRight1:"obstacle",
									innerwallBathroomTopRight2:"obstacle",
									outerwallCornerOutBL:"obstacle",
									outerwallCornerOutBR:"obstacle",
									outerwallCornerOutTL:"obstacle",
									outerwallCornerOutTR:"obstacle",
									outerwallCornerInBL:"obstacle",
									outerwallCornerInBR:"obstacle",
									outerwallCornerInTL:"obstacle",
									outerwallCornerInTR:"obstacle",
									outerwallCapBL:"obstacle",
									outerwallCapBR:"obstacle",
									outerwallCapTL:"obstacle",
									outerwallCapTR:"obstacle",
									outerwallCapTLEntrance:"obstacle",
									outerwallCapTREntrance:"obstacle",
									innerwallCornerBL:"obstacle",
									innerwallCornerBR:"obstacle",
									innerwallCornerTL:"obstacle",
									innerwallCornerTR:"obstacle",
									innerwallH:"obstacle",
									innerwallV:"obstacle",
									windowL:"obstacle",
									windowT:"obstacle",
									windowR:"obstacle",
									windowB:"obstacle",
									innerAndOuterwallSplitTL:"obstacle",
									innerAndOuterwallSplitTR:"obstacle",
									innerAndOuterwallSplitBL:"obstacle",
									innerAndOuterwallSplitBR:"obstacle",
									door0Deg:"obstacle interactive door",
									door90Deg:"obstacle interactive door",
									door180Deg:"obstacle interactive door",
									door270Deg:"obstacle interactive door",
									nightstand:"obstacle OnOffTile",
									plug:"obstacle interactive OnOffTileController",
									bed1:"obstacle",
									bed2:"obstacle",
									bed3:"obstacle",
									bed4:"obstacle",
									bed5:"obstacle",
									bed6:"obstacle",
									blueChair:"obstacle",
									bedroomDresserLeft:"obstacle",
									bedroomDresserRight:"obstacle",
									bedroomCandle:"obstacle interactive OnOffTile",
									garbageCan:"obstacle",
									marbleThin:"obstacle",
									marbleThinDouble:"obstacle",
									marbleThinShim:"obstacle",
									marbleFull:"obstacle",
									marbleFullHalf:"obstacle",
									greyShim:"tile",
									blueShim:"tile",
									range:"obstacle OnOffTile",
									rangeController:"obstacle interactive OnOffTileController",
									kitchenSinkRight:"obstacle",
									kitchenSinkLeft:"obstacle",
									kitchenSinkWater:"obstacle interactive OnOffTile",
									kitchenSinkController:"obstacle interactive OnOffTileController",
									bathroomTile:"tile",
									bathroomCounterTile:"obstacle",
									bathroomCounterTileHalf:"obstacle",
									bathroomTubFaucet:"obstacle",
									bathtub1:"obstacle",
									bathtub2:"obstacle",
									bathtub3:"obstacle",
									bathtub4:"obstacle",
									bathtub5:"obstacle",
									bathtub6:"obstacle",
									toilet:"obstacle interactive",
									kitchenMat1:"tile",
									kitchenMat2:"tile",
									kitchenMat3:"tile",
									kitchenMat4:"tile",
									kitchenMat5:"tile",
									kitchenMat6:"tile",
									kitchenMat7:"interactive OnOffTile",
									sock:"interactive sticky",
									tvTableLeft:"obstacle",
									tvTableRight:"obstacle",
									tvBack:"obstacle",
									tvFront:"obstacle OnOffTile",
									tvRemote:"interactive sticky",
									livingroomPlant:"obstacle",
									livingroomRug:"tile",
									coffeeTableLeft:"obstacle",
									coffeeTableRight:"obstacle",
									sofa1:"obstacle",
									sofa2:"obstacle",
									sofa3:"obstacle",
									sofa4:"obstacle",
									sofa5:"obstacle",
									sofa6:"obstacle",
									interactButton:"mobileControl",
									grass:"grass",
									dropTarget:"dropTarget interactive",
									bookcase1:"obstacle",
									bookcase2:"obstacle",
									bookcase3:"obstacle",
									bookcase4:"obstacle",
									bookcase5:"obstacle",
									bookcase6:"obstacle",
									bookcase7:"obstacle",
									book:"interactive sticky",
									bookInBookcase:"targetRevealed interactive",
									hamper:"obstacle interactive OnOffTile",
									underwear:"interactive sticky",
									pants:"interactive sticky",
									shirt:"interactive sticky",
									desk1:"obstacle",
									desk2:"obstacle",
									desk3:"obstacle",
									desk4:"obstacle",
									desk5:"obstacle interactive OnOffTile",
									desk6:"obstacle",
									deskChair1:"obstacle",
									deskChair2:"obstacle",
									sofaEndTable1Interact:"obstacle interactive OnOffTile",
									sofaEndTable1Plug:"tile",
									barStoolHorz:"obstacle interactive movable",//movable
									barStoolVert:"obstacle",
									kitchenTable1:"obstacle overMobileButton",
									kitchenTable2:"obstacle overMobileButton",
									kitchenTable3:"obstacle overMobileButton",
									kitchenTable4:"obstacle overMobileButton",
									kitchenTable5:"obstacle overMobileButton",
									kitchenTable6:"obstacle overMobileButton",
									kitchenTableBase:"tile overMobileButton",
									kitchenChairUp:"obstacle overMobileButton",
									kitchenChairRight:"obstacle interactive movable",
									kitchenChairDown:"obstacle overMobileButton",
									kitchenChairLeft:"obstacle interactive movable",
									hingedDoorOpenTop:"obstacle interactive hingedActive",
									hingedDoorClosedTop1:"obstacle interactive hingedInactive",
									hingedDoorClosedTop2:"obstacle interactive hingedActive",
									hingedDoorOpenBottom:"obstacle interactive hingedActive",
									hingedDoorClosedBottom1:"obstacle interactive hingedInactive",
									hingedDoorClosedBottom2:"obstacle interactive hingedActive",
									bathWater:"obstacle OnOffTile bathWater",
									bathWaterTrigger:"obstacle interactive OnOffTileController",
									roundChair1:"obstacle",
									roundChair2:"obstacle",
									roundChair3:"obstacle",
									roundChair4:"obstacle",
									logo:"tile",
									startButton:"button",
									instructionsButton:"button",
									disclaimerButton:"button",
									trademark:"tile",
									instructionImages:"tile",
									instructionButtonBack:"button",
									instructionButtonForward:"button",
									menuClose:"button",
									disclaimerImage:"tile"
									
			};
			
			//Lookup table for image paths associated with parts of the gameBoard
			var gameBoardImageLookup = {
									player:["/img/gameDev/playerStill.png","/img/gameDev/playerWalk1.png","/img/gameDev/playerWalk2.png","/img/gameDev/playerWalk3.png","/img/gameDev/playerWalk4.png","/img/gameDev/playerTurn90.png","/img/gameDev/playerTurn270.png","/img/gameDev/playerInteract.png"], 
									thoughtBubble:"/img/gameDev/thoughts.gif",
									featheredMask:"/img/gameDev/featheredMask.png",
									outerwallL:"/img/gameDev/outerwallL.gif", 
									outerwallR:"/img/gameDev/outerwallR.gif", 
									outerwallB:"/img/gameDev/outerwallB.gif", 
									outerwallT:"/img/gameDev/outerwallT.gif", 
									outerwallTL:"/img/gameDev/outerwallTL.gif",  
									outerwallTR:"/img/gameDev/outerwallTR.gif",  
									outerwallTB:"/img/gameDev/outerwallTB.gif", 
									outerwallTT:"/img/gameDev/outerwallTT.gif", 
									innerwallTB:"/img/gameDev/innerwallTB.gif",
									innerwallTL:"/img/gameDev/innerwallTL.gif",
									innerwallTR:"/img/gameDev/innerwallTR.gif",
									innerwallTT:"/img/gameDev/innerwallTT.gif",
									innerwallCapL:"/img/gameDev/innerwallCapL.gif",
									innerwallCapU:"/img/gameDev/innerwallCapU.gif",
									innerwallCapR:"/img/gameDev/innerwallCapR.gif",
									innerwallCapD:"/img/gameDev/innerwallCapD.gif",
									innerwallCapDTopWall:"/img/gameDev/innerwallCapDTopWall.gif",
									innerwallCapDDoorRightWall:"/img/gameDev/innerwallCapDDoorRightWall.gif",
									innerwallCapDBathroomBottom:"/img/gameDev/innerwallCapDBathroomBottom.gif",
									innerwallCapDBathroomTop1:"/img/gameDev/innerwallCapDBathroomTop1.gif",
									innerwallCapDBathroomTop2:"/img/gameDev/innerwallCapDBathroomTop2.gif",
									innerwallCapLKitchenTop:"/img/gameDev/innerwallCapLKitchenTop.gif",
									innerwallCapLKitchenSide:"/img/gameDev/innerwallCapLKitchenSide.gif",
									innerwallCapLBathroomTop:"/img/gameDev/innerwallCapLBathroomTop.gif",
									innerwallCapRKitchenTop:"/img/gameDev/innerwallCapRKitchenTop.gif",
									innerwallCapRKitchenSide:"/img/gameDev/innerwallCapRKitchenSide.gif",
									innerwallCapRBathroomBottom:"/img/gameDev/innerwallCapRBathroomBottom.gif",
									innerwallCapRBathroomRight:"/img/gameDev/innerwallCapRBathroomRight.gif",
									innerwallCapRBathroomTop:"/img/gameDev/innerwallCapRBathroomTop.gif",
									innerwallCapRLivingroomClosetRight:"/img/gameDev/innerwallCapRLivingroomClosetRight.gif",
									innerwallCapUBathroomBottom1:"/img/gameDev/innerwallCapUBathroomBottom1.gif",
									innerwallCapUBathroomBottom2:"/img/gameDev/innerwallCapUBathroomBottom2.gif",
									innerwallCapUClosetWall:"/img/gameDev/innerwallCapUClosetWall.gif",
									innerwallCapUKitchenTop:"/img/gameDev/innerwallCapUKitchenTop.gif",
									innerwallKitchenTopLeft:"/img/gameDev/innerwallKitchenTopLeft.gif",
									innerwallKitchenTopRight:"/img/gameDev/innerwallKitchenTopRight.gif",
									innerwallBathroomBottomLeft:"/img/gameDev/innerwallBathroomBottomLeft.gif",
									innerwallBathroomBottomRight:"/img/gameDev/innerwallBathroomBottomRight.gif",
									innerwallBathroomTopRight1:"/img/gameDev/innerwallBathroomTopRight1.gif",
									innerwallBathroomTopRight2:"/img/gameDev/innerwallBathroomTopRight2.gif",
									outerwallCornerOutBL:"/img/gameDev/outerwallCornerOutBL.gif",
									outerwallCornerOutBR:"/img/gameDev/outerwallCornerOutBR.gif",
									outerwallCornerOutTL:"/img/gameDev/outerwallCornerOutTL.gif",
									outerwallCornerOutTR:"/img/gameDev/outerwallCornerOutTR.gif",
									outerwallCornerInBL:"/img/gameDev/outerwallCornerInBL.gif",
									outerwallCornerInBR:"/img/gameDev/outerwallCornerInBR.gif",
									outerwallCornerInTL:"/img/gameDev/outerwallCornerInTL.gif",
									outerwallCornerInTR:"/img/gameDev/outerwallCornerInTR.gif",
									outerwallCapBL:"/img/gameDev/outerwallCapBL.gif",
									outerwallCapBR:"/img/gameDev/outerwallCapBR.gif",
									outerwallCapTL:"/img/gameDev/outerwallCapTL.gif",
									outerwallCapTR:"/img/gameDev/outerwallCapTR.gif",
									outerwallCapTLEntrance:"/img/gameDev/outerwallCapTLEntrance.gif",
									outerwallCapTREntrance:"/img/gameDev/outerwallCapTREntrance.gif",
									innerwallCornerBL:"/img/gameDev/innerwallCornerBL.gif",
									innerwallCornerBR:"/img/gameDev/innerwallCornerBR.gif",
									innerwallCornerTL:"/img/gameDev/innerwallCornerTL.gif",
									innerwallCornerTR:"/img/gameDev/innerwallCornerTR.gif",
									innerwallH:"/img/gameDev/innerwallH.gif",
									innerwallV:"/img/gameDev/innerwallV.gif",
									windowL:"/img/gameDev/windowL.gif",
									windowT:"/img/gameDev/windowT.gif",
									windowR:"/img/gameDev/windowR.gif",
									windowB:"/img/gameDev/windowB.gif",
									innerAndOuterwallSplitTL:"/img/gameDev/innerAndOuterwallSplitTL.gif",
									innerAndOuterwallSplitTR:"/img/gameDev/innerAndOuterwallSplitTR.gif",
									innerAndOuterwallSplitBL:"/img/gameDev/innerAndOuterwallSplitBL.gif",
									innerAndOuterwallSplitBR:"/img/gameDev/innerAndOuterwallSplitBR.gif",
									door0Deg:"/img/gameDev/door0Deg.gif",
									door90Deg:"/img/gameDev/door90Deg.gif",
									door180Deg:"/img/gameDev/door180Deg.gif",
									door270Deg:"/img/gameDev/door270Deg.gif",
									nightstand:["/img/gameDev/nightstandOn.gif","/img/gameDev/nightstandOff.gif"],
									plug:["/img/gameDev/plugIn.gif","/img/gameDev/plugOut.gif"],
									bed1:"/img/gameDev/bed1.gif",
									bed2:"/img/gameDev/bed2.gif",
									bed3:"/img/gameDev/bed3.gif",
									bed4:"/img/gameDev/bed4.gif",
									bed5:"/img/gameDev/bed5.gif",
									bed6:"/img/gameDev/bed6.gif",
									blueChair:"/img/gameDev/blueChair.gif",
									bedroomDresserLeft:"/img/gameDev/bedroomDresserLeft.gif",
									bedroomDresserRight:"/img/gameDev/bedroomDresserRight.gif",
									bedroomCandle:["/img/gameDev/candleOff.gif","/img/gameDev/candleOn.gif"],
									garbageCan:"/img/gameDev/garbageCan.gif",
									marbleThin:"/img/gameDev/marbleThin.gif",
									marbleThinDouble:"/img/gameDev/marbleThinDouble.gif",
									marbleThinShim:"/img/gameDev/marbleThinShim.gif",
									marbleFull:"/img/gameDev/marbleFull.gif",
									marbleFullHalf:"/img/gameDev/marbleFullHalf.gif",
									greyShim:"/img/gameDev/greyShim.gif",
									blueShim:"/img/gameDev/blueShim.gif",
									range:["/img/gameDev/rangeOff.gif","/img/gameDev/rangeOn.gif"],
									rangeController:"/img/gameDev/rangeController.gif",
									kitchenSinkRight:"/img/gameDev/sinkRight.gif",
									kitchenSinkLeft:"/img/gameDev/sinkLeft.gif",
									kitchenSinkWater:["/img/gameDev/kitchenSinkOff.gif","/img/gameDev/kitchenSinkOn.gif"],
									kitchenSinkController:"/img/gameDev/emptyShim.gif",
									bathroomTile:"/img/gameDev/bathroomTile.gif",
									bathroomCounterTile:"/img/gameDev/bathroomCounterTile.gif",
									bathroomCounterTileHalf:"/img/gameDev/bathroomCounterTileHalf.gif",
									bathroomTubFaucet:"/img/gameDev/bathroomTubFaucet.gif",
									bathtub1:"/img/gameDev/bathtub1.gif",
									bathtub2:"/img/gameDev/bathtub2.gif",
									bathtub3:"/img/gameDev/bathtub3.gif",
									bathtub4:"/img/gameDev/bathtub4.gif",
									bathtub5:"/img/gameDev/bathtub5.gif",
									bathtub6:"/img/gameDev/bathtub6.gif",
									toilet:"/img/gameDev/toilet.gif",
									kitchenMat1:"/img/gameDev/kitchenMat1.gif",
									kitchenMat2:"/img/gameDev/kitchenMat2.gif",
									kitchenMat3:"/img/gameDev/kitchenMat3.gif",
									kitchenMat4:"/img/gameDev/kitchenMat4.gif",
									kitchenMat5:"/img/gameDev/kitchenMat5.gif",
									kitchenMat6:"/img/gameDev/kitchenMat6.gif",
									kitchenMat7:["/img/gameDev/kitchenMat7Off.gif","/img/gameDev/kitchenMat7On.png"],
									sock:["/img/gameDev/sockDown.gif","/img/gameDev/sockUp.gif"],
									tvTableLeft:"/img/gameDev/tvTableLeft.gif",
									tvTableRight:"/img/gameDev/tvTableRight.gif",
									tvBack:"/img/gameDev/tvBack.gif",
									tvFront:["/img/gameDev/tvFrontOff.gif","/img/gameDev/tvFrontOn.gif"],
									tvRemote:["/img/gameDev/tvRemote.gif","/img/gameDev/tvRemote.gif"],
									livingroomPlant:"/img/gameDev/livingroomPlant.gif",
									livingroomRug:"/img/gameDev/livingroomRug.gif",
									coffeeTableLeft:"/img/gameDev/coffeeTableLeft.gif",
									coffeeTableRight:"/img/gameDev/coffeeTableRight.gif",
									sofa1:"/img/gameDev/sofa1.gif",
									sofa2:"/img/gameDev/sofa2.gif",
									sofa3:"/img/gameDev/sofa3.gif",
									sofa4:"/img/gameDev/sofa4.gif",
									sofa5:"/img/gameDev/sofa5.gif",
									sofa6:"/img/gameDev/sofa6.gif",
									interactButton:"",
									grass:"/img/gameDev/emptyShim.gif",
									dropTarget:"",
									bookcase1:"/img/gameDev/bookcase1.gif",
									bookcase2:"/img/gameDev/bookcase2.gif",
									bookcase3:"/img/gameDev/bookcase3.gif",
									bookcase4:"/img/gameDev/bookcase4.gif",
									bookcase5:"/img/gameDev/bookcase5.gif",
									bookcase6:"/img/gameDev/bookcase6.gif",
									bookcase7:"/img/gameDev/bookcase7.gif",
									book:["/img/gameDev/book1.gif","/img/gameDev/book2.gif"],
									bookInBookcase:"/img/gameDev/bookInBookcase.gif",
									hamper:["/img/gameDev/hamperOpen.gif","/img/gameDev/hamperClose.gif"],
									underwear:["/img/gameDev/underwearDown.gif","/img/gameDev/underwearUp.gif"],
									pants:["/img/gameDev/pantsDown.gif","/img/gameDev/pantsUp.gif"],
									shirt:["/img/gameDev/shirtDown.gif","/img/gameDev/shirtUp.gif"],
									desk1:"/img/gameDev/desk1.gif",
									desk2:"/img/gameDev/desk2.gif",
									desk3:"/img/gameDev/desk3.gif",
									desk4:"/img/gameDev/desk4.gif",
									desk5:["/img/gameDev/desk5Off.gif","/img/gameDev/desk5On.gif"],
									desk6:"/img/gameDev/desk6.gif",
									deskChair1:"/img/gameDev/deskChair1.gif",
									deskChair2:"/img/gameDev/deskChair2.gif",
									sofaEndTable1Interact:["/img/gameDev/sofaEndTable1Off.gif","/img/gameDev/sofaEndTable1On.gif"],
									sofaEndTable1Plug:"/img/gameDev/sofaEndTable1Plug.gif",
									barStoolHorz:"/img/gameDev/barStoolHorz.gif",
									barStoolVert:"/img/gameDev/barStoolVert.gif",
									kitchenTable1:"/img/gameDev/kitchenTable1.png",
									kitchenTable2:"/img/gameDev/kitchenTable2.png",
									kitchenTable3:"/img/gameDev/kitchenTable3.png",
									kitchenTable4:"/img/gameDev/kitchenTable4.png",
									kitchenTable5:"/img/gameDev/kitchenTable5.png",
									kitchenTable6:"/img/gameDev/kitchenTable6.png",
									kitchenTableBase:"/img/gameDev/kitchenTableBase.gif",
									kitchenChairUp:"/img/gameDev/kitchenChairUp.gif",
									kitchenChairRight:"/img/gameDev/kitchenChairRight.gif",
									kitchenChairDown:"/img/gameDev/kitchenChairDown.gif",
									kitchenChairLeft:"/img/gameDev/kitchenChairLeft.gif",
									hingedDoorOpenTop:"/img/gameDev/hingedDoorOpenTop.png",
									hingedDoorClosedTop1:"/img/gameDev/hingedDoorClosedTop1.gif",
									hingedDoorClosedTop2:"/img/gameDev/hingedDoorClosedTop2.gif",
									hingedDoorOpenBottom:"/img/gameDev/hingedDoorOpenBottom.png",
									hingedDoorClosedBottom1:"/img/gameDev/hingedDoorClosedBottom1.gif",
									hingedDoorClosedBottom2:"/img/gameDev/hingedDoorClosedBottom2.gif",
									bathWater:["/img/gameDev/emptyShim.gif","/img/gameDev/bathWater.gif"],
									bathWaterTrigger:["/img/gameDev/emptyShim.gif","/img/gameDev/emptyShim.gif"],
									roundChair1:"/img/gameDev/roundChair1.gif",
									roundChair2:"/img/gameDev/roundChair2.gif",
									roundChair3:"/img/gameDev/roundChair3.gif",
									roundChair4:"/img/gameDev/roundChair4.gif",
									logo:"/img/gameDev/logo.gif",
									startButton:"/img/gameDev/startButton.gif",
									instructionsButton:"/img/gameDev/instructionsButton.gif",
									disclaimerButton:"/img/gameDev/disclaimerButton.gif",
									trademark:"/img/gameDev/trademark.gif",
									instructionImages:["/img/gameDev/instructions1.png","/img/gameDev/instructions2.png","/img/gameDev/instructions3.png"],
									instructionButtonBack:"/img/gameDev/instructionButtonBack.gif",
									instructionButtonForward:"/img/gameDev/instructionButtonForward.gif",
									menuClose:"/img/gameDev/instructionButtonClose.gif",
									disclaimerImage:"/img/gameDev/disclaimer.gif"
																
			};
			
			
			
			
			
			