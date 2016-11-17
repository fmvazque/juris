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
			questions: []
		}

		var gameHistory = {
			gamesPayed: []
		}

		loadQuestionsFromJson(initializeQuestions);

		function loadQuestionsFromJson(callback) {   
			var xhr = new XMLHttpRequest();
			xhr.overrideMimeType("application/json");
			// we should make sure that the json file with the questions is loaded synchronously
			xhr.open('GET', 'js/testQuestions.json', false); 
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == "200") {
					callback(xhr.responseText);
				}
			};
			xhr.send(null);  
		}

		function initializeQuestions() {
			loadQuestionsFromJson(function(response) {
    			var questions = JSON.parse(response);

				// Transform Json that is on the input format (from questions.json) to the json format that we will use within the application
				for (var i = 0; i < questions.length; i++) {
					var questionFrom = questions[i];
					
					var questionTo = {
						text: questionFrom.text,
						alternatives: [],
						correctAnswerIndex: questionFrom.right_answer - 1,
						difficulty: questionFrom.difficulty,
						selectedIndex: -1
					}

					questionTo.alternatives.push(questionFrom.answer1);
					questionTo.alternatives.push(questionFrom.answer2);
					questionTo.alternatives.push(questionFrom.answer3);
					questionTo.alternatives.push(questionFrom.answer4);

					gameData.questions.push(questionTo);
				}				
			});

			// sort questions by difficulty level
			gameData.questions = _.sortBy(gameData.questions, 'difficulty');
			
			console.log(gameData);
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
			console.log("recalculateScores()")
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