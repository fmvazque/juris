(function() {
	'use strict';

	var app = angular.module('jurisApp');
	app.controller('gameOverController', ['gameApi', '$scope', '$state', '$window', gameOverController]);

	function gameOverController(gameApi, $scope, $state, $window) {
		var vm = this;

		$scope.startOver = function() {
			gameApi.newGame();
			$state.go('home.game');
		}

		$scope.hasWonGame = function() {
			return gameApi.getCurrentStatus().hasWinner;
		}
	}
})();