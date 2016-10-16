(function () {
	'use strict';

	angular.module('jurisApp').factory('gameApi', [gameApi]);

	function gameApi() {
		var currentQuestionIndex = 0;
		var currentScore = 0;
		var scoreIfRight = 1000;
		var scoreIfWrong = 0;
		var isGameOver = false;

		var gameData = {
			gameLevel: 1,
			questions: [{
				text: 'quanto é 2+2?',
				alternatives: ['2', '1', '4', '22'],
				correctAnswerIndex: 2,
				selectedIndex: -1
				}, {
				text: 'Quem descobriu o Brasil?',
				alternatives: ['Eu', 'Tu', 'Ele', 'Nós'],
				correctAnswerIndex: 2,
				selectedIndex: -1
				}, {
				text: 'batatinha quando nasce...',
				alternatives: ['pega o aviao', 'Esparrama pelo chao', 'salta do busao', 'chora'],
				correctAnswerIndex: 1,
				selectedIndex: -1
				}]
		}

		var gameHistory = {
			gamesPayed: []
		}

		function hasNextQuestion() {
			return currentQuestionIndex <= gameData.questions.length-1;
		}

		// Advance game
		function advance(userAnswer) {
			console.log('advancing game');

			var currentQuestion = gameData.questions[currentQuestionIndex];

			if (currentQuestion && userAnswer === currentQuestion.alternatives[currentQuestion.correctAnswerIndex]) {
				currentQuestionIndex++;
				recalculateScores();
			}
			else {
				isGameOver = currentQuestionIndex >= 0;
			}

			return getCurrentStatus();
		}

		function newGame() {
			console.log('new game');
			
			// If there was a previous game, saves it's information on the user's performance data
			if (currentQuestionIndex > 0) {
				var gamePlayed = {
					score: currentScore
				};
				gameHistory.gamesPayed.push(gamePlayed);
			}

			isGameOver = false;
			currentQuestionIndex = 0;
			currentScore = 0;
			scoreIfRight = 1000;
			scoreIfWrong = 0;

			console.log('currentQuestionIndex: ' + currentQuestionIndex);
		}

		function recalculateScores() {
			currentScore = scoreIfRight;
			scoreIfRight = scoreIfRight * 2;
			scoreIfWrong = currentScore / 2;
		}

		function getCurrentStatus() {
			return {
				isGameOver: isGameOver,
				hasWinner: !hasNextQuestion(),
				currentQuestion: gameData.questions[currentQuestionIndex],
				currentScore: currentScore,
				scoreIfWrong: scoreIfWrong,
				scoreIfRight: scoreIfRight
			}
		}

		return {
			newGame : newGame,
			advance : advance,
			getCurrentStatus: getCurrentStatus
		};
	};
})();