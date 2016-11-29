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
		var selectedQuestions = [];

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
			//gameData.questions = _.sortBy(gameData.questions, 'difficulty');

			// initializes the list of subjects 
			subjects = _.pluck(gameData.questions, 'subject');
			subjects = _.uniq(subjects);
			selectedSubject = subjects[0];
		}
		
 		function hasNextQuestion() {
			//return currentQuestionIndex <= gameData.questions.length-1;
			return currentQuestionIndex <= selectedQuestions.length-1;
		}

		// Advance game
		function advance(userAnswer) {
			console.log('advancing game');

			//var currentQuestion = gameData.questions[currentQuestionIndex];
			var currentQuestion = selectedQuestions[currentQuestionIndex];

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
			// if (selectedSubject !== "") {
			// 	while (++currentQuestionIndex < gameData.questions.length) {
			// 		if (gameData.questions[currentQuestionIndex].subject === selectedSubject)  {
			// 			break;
			// 		}
			// 	}
			// }
			if (selectedSubject !== "") {
				while (++currentQuestionIndex < selectedQuestions.length) {
					if (selectedQuestions[currentQuestionIndex].subject === selectedSubject)  {
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

			// select the questions by the subject chosen by the user
			var level1Questions = _.filter(gameData.questions, function(q) {
				return q.subject === selectedSubject && q.difficulty === 1;  
			});
			var level2Questions = _.filter(gameData.questions, function(q) {
				return q.subject === selectedSubject && q.difficulty === 2;  
			});
			var level3Questions = _.filter(gameData.questions, function(q) {
				return q.subject === selectedSubject && q.difficulty === 3;  
			});
			var level4Questions = _.filter(gameData.questions, function(q) {
				return q.subject === selectedSubject && q.difficulty === 4;  
			});
			var level5Questions = _.filter(gameData.questions, function(q) {
				return q.subject === selectedSubject && q.difficulty === 5;  
			});

			console.log("level 1 questions");
			console.log(level1Questions);

			console.log("sample");
			console.log(_.sample(level1Questions, 5));

			selectedQuestions = [];
			selectedQuestions = selectedQuestions.concat(_.sample(level1Questions, 5));			
			selectedQuestions = selectedQuestions.concat(_.sample(level3Questions, 5));			
			selectedQuestions = selectedQuestions.concat(_.sample(level4Questions, 4));			
			selectedQuestions = selectedQuestions.concat(_.sample(level5Questions, 2));			

			console.log("selected questions");
			console.log(selectedQuestions);

			findNextQuestionIndex();
		}

		function recalculateScores() {
			currentScore = scoreIfRight;
			
			// Calculate new score if right and new score if wrong
			if (scoreIfRight < 5000) {
				scoreIfRight += 1000;	
			}
			else if (scoreIfRight == 5000) {
				scoreIfRight *= 2;	
			}
			else if (scoreIfRight < 50000){
				scoreIfRight += 10000;	
			}
			else if (scoreIfRight == 50000) {
				scoreIfRight *= 2;	
			}
			else if (scoreIfRight < 500000){
				scoreIfRight += 100000;	
			}
			else if (scoreIfRight == 500000) {
				scoreIfRight *= 2;	
			}

			// If this is the million question, then score if wrong is zero!
			if (scoreIfRight <= 500000) {
				scoreIfWrong = currentScore / 2;
			}
			else {
				scoreIfWrong = 0;
			}
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
				//currentQuestion: gameData.questions[currentQuestionIndex],
				currentQuestion: selectedQuestions[currentQuestionIndex],
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