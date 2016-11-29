// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('jurisApp', ['ionic'])
	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don't remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
	})
	.config(function($stateProvider, $urlRouterProvider) {

		$stateProvider.state('home', {
			abstract: true,
			url: '/home',
			templateUrl: 'app/home/home.html'
		});

		$stateProvider.state('home.newgame', {
			url: '/gamenew',
			views: {
				"home-view": {
					templateUrl: "app/home/home-newGame.html",
					controller: 'gameNewController'
				}
			}
		});

		$stateProvider.state('home.game', {
			url: '/game',
			views: {
				"home-view": {
					templateUrl: "app/home/home-game.html",
					controller: 'gameController'
				}
			}
		});

		$stateProvider.state('home.gametransition', {
			url: '/gametransition',
			views: {
				"home-view": {
					templateUrl: "app/home/home-gameTransition.html",
					controller: 'gameTransitionController'
				}
			}
		});

		$stateProvider.state('home.gameover', {
			url: '/gameover',
			views: {
				"home-view": {
					templateUrl: "app/home/home-gameover.html",
					controller: 'gameOverController'
				}
			}
		});
		
		$urlRouterProvider.otherwise('/home/gamenew')
	});
