(function() {
	'use strict';

	var app = angular.module('jurisApp');
	app.controller('gameController', ['gameApi', '$scope', '$state', '$ionicPopup', gameController]);

	function gameController(gameApi, $scope, $state, $ionicPopup) {

		// this is going to execute every time the view is opened
		$scope.$on('$ionicView.enter', function() {
			startGameController();
		});

		$scope.getRemainingSkips = function() {
			return gameApi.getCurrentStatus().remainingSkips;
		} 

		$scope.isFinalQuestion = function() {
			return gameApi.getCurrentStatus().isFinalQuestion;
		} 

		$scope.goToNextQuestion = function(userSkipped) {
			var gameStatus = gameApi.advance($scope.selectedOption.value, userSkipped);

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

				$state.go('home.gametransition');
			}
		};

		$scope.skipQuestion = function() {
			$scope.goToNextQuestion(true);
		};

		$scope.stopGame = function() {
			gameApi.stopGame();
			$state.go('home.gameover');
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

		// Question confirmation dialog
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

		// Stop game confirmation dialog
		$scope.showStopConfirmation = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'Você realmente deseja parar?',
				buttons: [
					{
						text: 'Sim', 
						type: 'button-positive',
						onTap: function(e) {
								$scope.stopGame();
							}						
					},
					{
						text: '<b>Não</b>',
						type: 'button-positive'
					}]				
			});
		};		

		// Skip question confirmation dialog
		$scope.showSkipConfirmation = function() {
			if ($scope.isFinalQuestion()) {
				$ionicPopup.show({
					template: '<h2>Você não pude pular a pergunta do Milhão!</h2>',
					scope: $scope,
					buttons: [
						{ text: 'Ok' },
					]
				});
				return;
			}

			if ($scope.getRemainingSkips() == 0) {
				$ionicPopup.show({
					template: '<h2>Você não tem mais pulos disponíveis!</h2>',
					title: 'Todos os pulos já foram usados',
					scope: $scope,
					buttons: [
						{ text: 'Ok' },
					]
				});
				return;
			}

			var dialogText = "Você tem " + $scope.getRemainingSkips() + " pulos disponíveis."

			var myPopup = $ionicPopup.show({
				template: '<h2>' + dialogText + '</h2>',
				title: 'Confirma que deseja pular questão?',
				scope: $scope,
				buttons: [
				{ text: 'Cancelar' },
				{
					text: '<b>Sim</b>',
					type: 'button-positive',
					onTap: function(e) {
						$scope.skipQuestion();
					}
				}
				]
			});
		}		
				
	}
})();