var GiocoDeiNomi = (function () {
    var nomi = [];
    var punteggi = [];
    var gameStarted = false;
    var winner = null;

    var elements = {
        nomeInput: document.getElementById('nome-input'),
        aggiungiBtn: document.getElementById('aggiungi-btn'),
        iniziaBtn: document.getElementById('inizia-btn'),
        nomiLista: document.getElementById('nomi-lista'),
        controlliGioco: document.getElementById('controlli-gioco'),
        primoNumero: document.getElementById('primo-numero'),
        secondoNumero: document.getElementById('secondo-numero'),
        contaBtn: document.getElementById('conta-btn'),
        messageArea: document.getElementById('message-area'),
        resetBtn: document.getElementById('reset-btn')
    };

    function updateUI() {
        if (gameStarted) {
            elements.nomiLista.innerHTML = '';
            for (var i = 0; i < nomi.length; i++) {
                elements.nomiLista.innerHTML += `<p>${i + 1}. ${nomi[i]}: ${punteggi[i]}</p>`;
            }
        } else {
            elements.nomiLista.innerHTML = `<p>Nomi aggiunti: ${nomi.length}</p>`;
        }
    }

    function addName() {
        var nome = elements.nomeInput.value.trim();
        if (nome && !gameStarted) {
            nomi.push(nome);
            punteggi.push(0);
            elements.nomeInput.value = '';
            updateUI();
        }
    }

    function startGame() {
        if (nomi.length < 2) {
            alert('Aggiungi almeno due nomi per iniziare il gioco.');
            return;
        }
        gameStarted = true;
        shuffleNames();
        updateUI();
        elements.controlliGioco.style.display = 'block';
        elements.iniziaBtn.disabled = true;
        elements.aggiungiBtn.disabled = true;
        elements.nomeInput.disabled = true;
        elements.messageArea.textContent = 'Gioco iniziato! Inserisci i numeri per contare.';
    }

    function shuffleNames() {
        for (var i = nomi.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [nomi[i], nomi[j]] = [nomi[j], nomi[i]];
            [punteggi[i], punteggi[j]] = [punteggi[j], punteggi[i]];
        }
    }

    function conta() {
        if (!gameStarted) return;

        shuffleNames(); // Rimescola l'ordine ad ogni conta

        var primoNumero = parseInt(elements.primoNumero.value);
        var secondoNumero = parseInt(elements.secondoNumero.value);

        if (isNaN(primoNumero) || isNaN(secondoNumero) || primoNumero < 1 || primoNumero > nomi.length || secondoNumero < 1 || secondoNumero > 20) {
            alert('Inserisci numeri validi!');
            return;
        }

        var startIndex = primoNumero - 1;
        var currentIndex = startIndex;
        var count = 0;

        while (count < secondoNumero) {
            count++;
            if (count === secondoNumero) {
                punteggi[currentIndex]++;
                break;
            }
            currentIndex = (currentIndex + 1) % nomi.length;
        }

        updateUI();

        elements.messageArea.textContent = `Conta terminata su: ${nomi[currentIndex]}`;

        if (punteggi[currentIndex] >= 3) {
            winner = nomi[currentIndex];
            gameStarted = false;
            elements.messageArea.textContent += ` - Il vincitore è: ${winner}!`;
            elements.controlliGioco.style.display = 'none';
            elements.resetBtn.style.display = 'inline-block';
        }
    }

    function reset() {
        nomi = [];
        punteggi = [];
        gameStarted = false;
        winner = null;
        elements.iniziaBtn.disabled = false;
        elements.aggiungiBtn.disabled = false;
        elements.nomeInput.disabled = false;
        elements.controlliGioco.style.display = 'none';
        elements.resetBtn.style.display = 'none';
        elements.messageArea.textContent = '';
        updateUI();
    }

    elements.aggiungiBtn.addEventListener('click', addName);
    elements.iniziaBtn.addEventListener('click', startGame);
    elements.contaBtn.addEventListener('click', conta);
    elements.resetBtn.addEventListener('click', reset);

    // Aggiunta di funzionalità per premere Invio
    elements.nomeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addName();
        }
    });

    elements.primoNumero.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            elements.secondoNumero.focus();
        }
    });

    elements.secondoNumero.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            conta();
        }
    });

    return {
        reset: reset
    };
})();
