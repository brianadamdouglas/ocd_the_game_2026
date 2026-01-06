/*GAME ENGINE OVERRIDES(OCD)*/		
		
		/**
		* @description Override - Resets the position of the stage if the character has intersected object
		* @param {Array} hitObstacle
		* @param {Array} previousMoves
		*/			
		function resetPosition(hitObstacle, previousMoves){//array
			var hits = hitObstacle[2];
			var type = hitObstacle[3];//getDiv
			var targetRect = hits[0]._classReference.getRect();
			var targetRectAdjusted = returnStageRectAdjustedForOffset(targetRect);
			var targetName = hits[0]._classReference.getID();//using for debugging, remove later
			var playerPointOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
			if(type=="head"){
				var playerRectAdjusted = g_player.getTransformedHeadRect(playerPointOnStage, g_stageRotation);
			}else if (type=="torso"){
				var playerRectAdjusted = g_player.getTransformedTorsoRect(playerPointOnStage, g_stageRotation);
			}
	
			var direction = g_stage.repositionStage(targetRectAdjusted, playerRectAdjusted, g_stageRotation, previousMoves);
			e_stageMovementProgressCallback();		
			return direction	
		}
		
		
		//$('#domElementIdToTest').hitTestPoint({"x":positionX,"y":positionY, "transparency":true});	
		
		/**
		* @description Override - Calculates which items the character has intersected 
		* @return {Array} [{Boolean}, {Array} obstacles]
		*/			
		function getHits(){
			var mergedQuadrants = returnPossibleTargets();
			//console.log(mergedQuadrants);
				
			var hits = new Array();
			for(var i = 0; i<mergedQuadrants.length; i++){
				var k = '#' + g_stageSpriteArray[mergedQuadrants[i]]._name;
					
				var hit = false;
				
				 if($('#playerHead').objectHitTest({"object":$(k), "transparency":false})){
					var playerSegment = 'head';
					hit = true;
				} 
				if($('#playerTorso').objectHitTest({"object":$(k), "transparency":false})){
					var playerSegment = 'torso';
					hit = true;
				}
				
					
					
				if(hit && g_stageSpriteArray[mergedQuadrants[i]]._classReference.getVisibility()){// if it hits an item
					hits.push(g_stageSpriteArray[mergedQuadrants[i]]);
				}
			}
				
				
			if(hits.length > 0){
				return ([true, mergedQuadrants,hits,playerSegment]);
			}else{
				return ([false, mergedQuadrants]);
			}
				
		}
		
		
			