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
			
			if (!gameApi.gotRightAnswer($scope.selectedOption.value)) {
				console.log('selectedOption: ' + $scope.selectedOption.value);
				return;
			}

			if (gameApi.hasNextQuestion()) {
				$scope.currentQuestion = gameApi.getNextQuestion();
				$scope.scoreIfRight = gameApi.getScoreIfRight(); 
				$scope.scoreIfWrong = gameApi.getScoreIfWrong(); 
				$scope.currentScore = gameApi.getCurrentScore(); 

				console.log("new desired score from controler: " + $scope.scoreIfRight);

				$state.go($state.current);
			}
			else {
				console.log('transitioning to home.gameover state');
				$state.go('home.gameover');
			}
		};

		function startGameController() {
			console.log('initializing gameController');
			
			$scope.currentQuestion = gameApi.getNextQuestion();

			$scope.selectedOption = {
				value: "-1"
			};

			$scope.scoreIfRight = gameApi.getScoreIfRight();
			$scope.scoreIfWrong = gameApi.getScoreIfWrong();
			$scope.currentScore = gameApi.getCurrentScore();			
		};

		// Confirmation dialog
		$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'Tem certeza?',
				template: 'Você está certo(a) disso?',
				okText: 'Sim',
				cancelText: 'Não'
			});

			confirmPopup.then(function(response) {
				if (response) {
					$scope.goToNextQuestion();
				}
			});
		};		
	}
})();