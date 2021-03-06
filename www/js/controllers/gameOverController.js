(function() {
	'use strict';

	var app = angular.module('jurisApp');
	app.controller('gameOverController', ['gameApi', '$scope', '$state', '$window', gameOverController]);

	function gameOverController(gameApi, $scope, $state, $window) {
		var vm = this;

		$scope.startOver = function() {
			gameApi.newGame();
			$state.go('home.newgame');
		}

		$scope.hasWonGame = function() {
			return gameApi.getCurrentStatus().hasWinner;
		}

		$scope.currentScore = function() {
			return gameApi.getCurrentStatus().currentScore;
		}
	}
})();