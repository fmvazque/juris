(function () {
	'use strict';

	angular.module('jurisApp').factory('gameApi', [gameApi]);

	function gameApi() {
		var currentQuestionIndex = -1;
		var currentScore = 0;
		var scoreIfRight = 1000;
		var scoreIfWrong = 0;

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
			return currentQuestionIndex < gameData.questions.length-1;
		}

		function getNextQuestion() {
			console.log("getNestQuestion: " + currentQuestionIndex);
			return gameData.questions[++currentQuestionIndex];
		}

		function newGame() {
			console.log('new game');
			
			// If there was a previous game, saves it's information on the user's performance data
			if (currentQuestionIndex > -1) {
				var gamePlayed = {
					score: currentScore
				};
				gameHistory.gamesPayed.push(gamePlayed);
			}

			currentQuestionIndex = -1;
			currentScore = 0;
			scoreIfRight = 1000;
			scoreIfWrong = 0;

			console.log('currentQuestionIndex: ' + currentQuestionIndex);
		}

		function gotRightAnswer(userAnswer) {
			var currentQuestion = gameData.questions[currentQuestionIndex];

			if (currentQuestion && userAnswer === currentQuestion.alternatives[currentQuestion.correctAnswerIndex]) {
				console.log("User's answer is correct!")
				recalculateScores();
				console.log("new desired score: " + scoreIfRight);
				return true;
			}

			return false;
		}

		function recalculateScores() {
			currentScore = scoreIfRight;
			scoreIfRight = scoreIfRight * 2;
			scoreIfWrong = currentScore / 2;
		}

		function getScoreIfRight() {
			return scoreIfRight;
		}

		function getScoreIfWrong() {
			return scoreIfWrong;
		}

		function getCurrentScore() {
			return currentScore;
		}

		return {
			newGame : newGame,
			hasNextQuestion : hasNextQuestion,
			getNextQuestion : getNextQuestion,
			gotRightAnswer : gotRightAnswer,
			getScoreIfRight : getScoreIfRight,
			getScoreIfWrong : getScoreIfWrong,
			getCurrentScore : getCurrentScore
		};
	};
})();