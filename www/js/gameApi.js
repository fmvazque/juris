(function () {
	'use strict';

	angular.module('jurisApp').factory('gameApi', ['$http', '$q', '$timeout', gameApi]);

	function gameApi($http, $q, $timeout) {
		var currentQuestionIndex = 0;
		var currentScore = 0;
		var scoreIfRight = 1000;
		var scoreIfWrong = 0;
		var isGameOver = false;
		var selectedSubject = "";

		var gameData = {
			gameLevel: 1,
			questions: []
		}

		var gameHistory = {
			gamesPayed: []
		}

		var subjects = [];

		loadQuestionsFromJson(initializeQuestions);

		function loadQuestionsFromJson(callback) {   
			$http.get("js/questions.json")
			.success(function(data) {
				callback(data);
			})
			.error(function(data) {
				console.log("could not load data from testQuestions.json");
			});
		}

		function initializeQuestions(data) {
			var questions = data;

			// Transform Json that is on the input format (from questions.json) to the json format that we will use within the application
			for (var i = 0; i < questions.length; i++) {
				var questionFrom = questions[i];

				console.log(questionFrom);
				
				var questionTo = {
					subject: questionFrom.subject,
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

				console.log(questionTo);

				gameData.questions.push(questionTo);
			}				

			// sort questions by difficulty level
			gameData.questions = _.sortBy(gameData.questions, 'difficulty');

			// initializes the list of subjects 
			subjects = _.pluck(gameData.questions, 'subject');
			subjects = _.uniq(subjects);
			selectedSubject = subjects[0];
		}
		
 		function hasNextQuestion() {
			return currentQuestionIndex <= gameData.questions.length-1;
		}

		// Advance game
		function advance(userAnswer) {
			console.log('advancing game');

			var currentQuestion = gameData.questions[currentQuestionIndex];

			if (currentQuestion && userAnswer === currentQuestion.alternatives[currentQuestion.correctAnswerIndex]) {
				recalculateScores();
				findNextQuestionIndex();
			}
			else 
				isGameOver = currentQuestionIndex >= 0;
			
			return getCurrentStatus();
		}

		function findNextQuestionIndex() {
			// if we are using one specific subject, filter by that subject
			if (selectedSubject !== "") {
				while (++currentQuestionIndex < gameData.questions.length) {
					if (gameData.questions[currentQuestionIndex].subject === selectedSubject)  {
						break;
					}
				}
			}
			else 
				currentQuestionIndex++;
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
			currentQuestionIndex = -1;
			currentScore = 0;
			scoreIfRight = 1000;
			scoreIfWrong = 0;

			findNextQuestionIndex();
		}

		function recalculateScores() {
			console.log("recalculateScores()")
			currentScore = scoreIfRight;
			scoreIfRight = scoreIfRight * 2;
			scoreIfWrong = currentScore / 2;
		}

		function getSubjects() {
			var d = $q.defer();
			$timeout(function(){
				d.resolve(subjects);
			}, 1000); 
		    return d.promise;		
		}

		function setSubject(subject) {
			selectedSubject = subject;
			newGame();
		}

		function getSelectedSubject() {
			return selectedSubject;
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
			getSubjects: getSubjects,
			setSubject: setSubject,
			getSelectedSubject: getSelectedSubject,
			getCurrentStatus: getCurrentStatus
		};
	};
})();