(function() {
	'use strict';

	var app = angular.module('jurisApp');
	app.controller('gameController', ['gameApi', '$scope', '$state', gameController]);

	function gameController(gameApi, $scope, $state) {

		// this is goint to execute every time view the is opened
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
	}
})();