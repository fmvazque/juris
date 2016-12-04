(function() {
	'use strict';

	var app = angular.module('jurisApp');
	app.controller('gameTransitionController', ['gameApi', '$scope', '$state', '$timeout', gameTransitionController]);

	function gameTransitionController(gameApi, $scope, $state, $timeout) {
		var vm = this;

		$scope.currentScore = gameApi.getCurrentStatus().currentScore; 
		$scope.scoreIfRight = gameApi.getCurrentStatus().scoreIfRight; 
		
		$scope.hasUserSkippedLastQuestion = function() {
			console.log(gameApi.getCurrentStatus().userHasSkippedLastQuestion)
			return gameApi.getCurrentStatus().userHasSkippedLastQuestion;
		}

		$scope.$on('$ionicView.enter', function() {
			$timeout(function() {
				$state.go('home.game'); 
			}, 1000);
		});
	}
})();