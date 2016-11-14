(function() {
	'use strict';

	var app = angular.module('jurisApp');
	app.controller('gameController', ['gameApi', '$scope', '$state', '$ionicPopup', gameController]);

	function gameController(gameApi, $scope, $state, $ionicPopup) {

		// this is going to execute every time the view is opened
		$scope.$on('$ionicView.enter', function() {
			startGameController();
		});

		$scope.goToNextQuestion = function() {
			console.log('gameController::goToNextQuestion called');
			
			var gameStatus = gameApi.advance($scope.selectedOption.value);

			if (gameStatus.hasWinner) {
				console.log('game has winner')
				// User won!!!
				$state.go('home.gameover');
			}
			else if (gameStatus.isGameOver) {
				console.log('game is over')
				// User stopped in the middle of the game
				$state.go('home.gameover');
			}
			else {
				console.log('game continues')
				// We still have more game ahead
				$scope.scoreIfRight = gameStatus.scoreIfRight; 
				$scope.scoreIfWrong = gameStatus.scoreIfWrong; 
				$scope.currentScore = gameStatus.currentScore; 

				//$state.go($state.current);
				$state.go('home.gametransition');
			}
		};

		function startGameController() {
			var gameStatus = gameApi.getCurrentStatus();

			$scope.currentQuestion = gameStatus.currentQuestion;

			$scope.selectedOption = {
				value: "-1"
			};

			$scope.scoreIfRight = gameStatus.scoreIfRight;
			$scope.scoreIfWrong = gameStatus.scoreIfWrong;
			$scope.currentScore = gameStatus.currentScore;			
		};

		// Confirmation dialog
		$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'Você está certo(a) disso?',
				buttons: [
					{
						text: 'Sim', 
						type: 'button-positive',
						onTap: function(e) {
								$scope.goToNextQuestion();
							}						
					},
					{
						text: '<b>Não</b>',
						type: 'button-positive'
					}]				
			});
		};		
	}
})();