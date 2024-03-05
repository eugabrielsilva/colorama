const app = angular.module('app', []);

app.controller('GameController', function($scope) {

    $scope.colors = ['blue', 'red', 'purple', 'green', 'brown', 'yellow'];

    if(window.localStorage.getItem('game')) {
        $scope.game = JSON.parse(window.localStorage.getItem('game'));
    } else {
        $scope.game = {
            answer: generateGame(),
            currentBoard: 0,
            currentBall: 0,
            boards: Array.from({length: 10}, () => ({
                guesses: ['', '', '', ''],
                tips: ['', '', '', '']
            }))
        };

        window.localStorage.setItem('game', JSON.stringify($scope.game));
    }

    if(window.localStorage.getItem('stats')) {
        $scope.stats = JSON.parse(window.localStorage.getItem('stats'));
    } else {
        $scope.stats = {
            wins: 0,
            loss: 0
        };

        window.localStorage.setItem('stats', JSON.stringify($scope.stats));
    }

    $scope.$watch('game', function(newValue, oldValue) {
        if(!$scope.victory && !$scope.fail && newValue != oldValue) window.localStorage.setItem('game', JSON.stringify($scope.game));
    }, true);

    $scope.$watch('stats', function(newValue, oldValue) {
        if(newValue != oldValue) window.localStorage.setItem('stats', JSON.stringify($scope.stats));
    }, true);

    $scope.setGuess = function(color) {
        if(!$scope.game.boards[$scope.game.currentBoard].guesses.includes('') || $scope.colorUsed(color)) return;
        $scope.game.boards[$scope.game.currentBoard].guesses[$scope.game.currentBall] = color;
        $scope.game.currentBall++;
    }

    $scope.colorUsed = function(color) {
        return $scope.game.boards[$scope.game.currentBoard].guesses.includes(color);
    }

    $scope.clearGuess = function() {
        if($scope.game.currentBall != 0) $scope.game.currentBall--;
        $scope.game.boards[$scope.game.currentBoard].guesses[$scope.game.currentBall] = '';
    }

    $scope.submitGuess = function() {
        if($scope.game.boards[$scope.game.currentBoard].guesses.includes('')) {
            alert('Escolha todas as cores antes de fazer um chute!');
            return;
        }

        let tips = [];
        $scope.game.boards[$scope.game.currentBoard].guesses.forEach((guess, key) => {
            if($scope.game.answer[key] == guess) {
                tips.push('correct');
            } else if($scope.game.answer.includes(guess)) {
                tips.push('incorrect');
            }
        });

        tips = tips.sort(() => .5 - Math.random());
        while(tips.length < 4) tips.push('');
        $scope.game.boards[$scope.game.currentBoard].tips = tips;

        if(tips.every(elem => elem === 'correct')) {
            $scope.victory = true;
            $scope.stats.wins++;
            window.localStorage.removeItem('game');
            return;
        }

        if($scope.game.currentBoard == 9) {
            $scope.fail = true;
            $scope.stats.loss++;
            window.localStorage.removeItem('game');
            return;
        }

        $scope.game.currentBall = 0;
        $scope.game.currentBoard++;
    }

    $scope.playAgain = function() {
        window.location.reload();
    }

    if(!window.localStorage.getItem('help')) {
        $scope.help = true;
    }

    $scope.showHelp = function() {
        $scope.help = true;
    }

    $scope.showStats = function() {
        $scope.status = true;
    }

    $scope.closeHelp = function() {
        window.localStorage.setItem('help', true);
        $scope.help = false;
    }

    $scope.closeStats = function() {
        $scope.status = false;
    }

    $scope.share = function(social) {
        let text = prepareShare();
        let url = '';

        switch(social) {
            case 'twitter':
                url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
                break;

            case 'copy':
                navigator.clipboard.writeText(text);
                alert('Resultado copiado para a área de transferência!');
                return;

            default:
                return;
        }

        window.open(url, '_blank');
    }

    function generateGame() {
        let colors = angular.copy($scope.colors);
        return colors.sort(() => .5 - Math.random()).slice(0, 4);
    }

    function prepareShare() {
        let emojis = '';
        let tries = $scope.game.currentBoard + 1;
        if(tries == 10) tries = 'X';

        $scope.game.answer.forEach(color => {
            switch(color) {
                case 'blue':
                    emojis += '🔵';
                    break;

                case 'red':
                    emojis += '🔴';
                    break;

                case 'purple':
                    emojis += '🟣';
                    break;

                case 'green':
                    emojis += '🟢';
                    break;

                case 'brown':
                    emojis += '🟤';
                    break;

                case 'yellow':
                    emojis += '🟡';
                    break;
            }
        });

        let text = `Joguei Colorama! #${$scope.stats.wins + $scope.stats.loss}\n${tries}/10\n${emojis}\n\nhttps://gabrielsilva.dev.br/colorama`;
        return text;
    }
});