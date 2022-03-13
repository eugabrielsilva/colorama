const app = angular.module('app', []);

app.controller('GameController', function($scope) {

    $scope.colors = ['blue', 'red', 'purple', 'green', 'brown', 'yellow'];

    $scope.boards = [
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        },
        {
            guesses: ['', '', '', ''],
            tips: ['', '', '', '']
        }
    ];

    $scope.currentBoard = 0;
    $scope.currentBall = 0;

    function generateGame() {
        let colors = angular.copy($scope.colors);
        $scope.answer = colors.sort(() => .5 - Math.random()).slice(0, 4);
    }

    generateGame();

    $scope.setGuess = function(color) {
        if(!$scope.boards[$scope.currentBoard].guesses.includes('') || $scope.colorUsed(color)) return;
        $scope.boards[$scope.currentBoard].guesses[$scope.currentBall] = color;
        $scope.currentBall++;
    }

    $scope.colorUsed = function(color) {
        return $scope.boards[$scope.currentBoard].guesses.includes(color);
    }

    $scope.resetGuess = function() {
        $scope.boards[$scope.currentBoard].guesses = ['', '', '', ''];
        $scope.currentBall = 0;
    }

    $scope.submitGuess = function() {
        if($scope.boards[$scope.currentBoard].guesses.includes('')) {
            alert('Escolha todas as cores antes de fazer um chute!');
            return;
        }

        let tips = [];
        $scope.boards[$scope.currentBoard].guesses.forEach((guess, key) => {
            if($scope.answer[key] == guess) {
                tips.push('correct');
            } else if($scope.answer.includes(guess)) {
                tips.push('incorrect');
            }
        });

        tips = tips.sort(() => .5 - Math.random());
        while(tips.length < 4) tips.push('');
        $scope.boards[$scope.currentBoard].tips = tips;

        if(tips.every(elem => elem === 'correct')) {
            $scope.victory = true;
            return;
        }

        if($scope.currentBoard == 9) {
            $scope.fail = true;
            return;
        }

        $scope.currentBall = 0;
        $scope.currentBoard++;
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

    $scope.closeHelp = function() {
        window.localStorage.setItem('help', true);
        $scope.help = false;
    }

    $scope.share = function(social) {
        let text = prepareShare();
        let url = '';

        switch(social) {
            case 'twitter':
                url = 'https://twitter.com/intent/tweet?text=' + encodeURI(text);
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

    function prepareShare() {
        let emojis = '';

        $scope.answer.forEach(color => {
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

        let text = `Joguei Colorama!\n${($scope.currentBoard + 1)}/10\n${emojis}\n\nhttps://eugabrielsilva.tk/colorama`;
        return text;
    }
});