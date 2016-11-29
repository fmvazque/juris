(function() {
	'use strict';

	var app = angular.module('jurisApp');
	app.controller('gameNewController', ['gameApi', '$scope', '$state', '$timeout', gameNewController]);

	function gameNewController(gameApi, $scope, $state, $timeout) {
		
		$scope.subjects = ["Carregando disciplinas..."];

		gameApi.getSubjects().then(
			function(res) {
				gameApi.newGame();
				$scope.subjects = res;
			}
		)

		$scope.setSubject = function(selectedSubject) {
			gameApi.setSubject(selectedSubject);
			$state.go('home.game'); 
		};
	}
})();