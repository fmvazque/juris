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
				}, 
				{
				text: 'batatinha quando nasce...',
				alternatives: ['pega o aviao', 'Esparrama pelo chao', 'salta do busao', 'chora'],
				correctAnswerIndex: 1,
				selectedIndex: -1
				},
				{
				text: 'Quem reprovava os calouros em seu programa tocando uma buzina?',
				alternatives: ['Raul Gil', 'Bolinha', 'Flavio Cavalcanti', 'Chacrinha'],
				correctAnswerIndex: 3,
				selectedIndex: -1
				},
				{
				text: 'Quem é o pai da Sacha a Filha da Xuxa?',
				alternatives: ['Luciano Cantor', 'Luciano Huck', 'Luciano Szafir', 'Luciano do Vale'],
				correctAnswerIndex: 2,
				selectedIndex: -1
				},
				{
				text: 'Que personagem da Turma do Chaves vive cobrando aluguel do Seu Madruga?',
				alternatives: ['Kiko', 'Chaves', 'Seu Barriga', 'Professor Girafales'],
				correctAnswerIndex: 2,
				selectedIndex: -1
				},
				{
				text: 'Como é chamada a contora que representa o papel primcipal em uma ópera?',
				alternatives: ['Primeira Dama', 'Dona Prima', 'Prima Dona', 'Obra Prima'],
				correctAnswerIndex: 2,
				selectedIndex: -1
				},
				{
				text: 'O que é um Oboé?',
				alternatives: ['Vulcão', 'Comida', 'Instrumento', 'Tribo'],
				correctAnswerIndex: 2,
				selectedIndex: -1
				},
				{
				text: 'Quantos jogadores um jogo de vôlei reune na quadra?',
				alternatives: ['6', '8', '10', '12'],
				correctAnswerIndex: 3,
				selectedIndex: -1
				},
				{
				text: 'De que país europeu dependem politicamente as ilhas Ferroe?',
				alternatives: ['Rússia', 'Suécia', 'Espanha', 'Dimamarca'],
				correctAnswerIndex: 3,
				selectedIndex: -1
				}, 				
				{
				text: 'Quem descobriu o Brasil?',
				alternatives: ['Eu', 'Tu', 'Ele', 'Nós'],
				correctAnswerIndex: 2,
				selectedIndex: -1
				}, 				
				]
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