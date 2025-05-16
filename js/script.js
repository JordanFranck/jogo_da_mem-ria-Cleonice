document.addEventListener('DOMContentLoaded', () => {
    const cartas = document.querySelectorAll('.carta');
    const jogadasElement = document.getElementById('jogadas');
    const pontosElement = document.getElementById('pontos');
    const vitoriasElement = document.getElementById('vitorias');
    const resetButton = document.getElementById('reset');
    const mensagemVitoria = document.querySelector('.mensagem-vitoria');
    const estatisticasVitoria = document.querySelector('.mensagem-vitoria .estatisticas-vitoria');
    const jogarNovamenteButton = document.getElementById('jogar-novamente');

    let cartasViradas = [];
    let podeVirar = true;
    let jogadas = 0;
    let pontos = 0;
    let vitorias = localStorage.getItem('vitorias') ? parseInt(localStorage.getItem('vitorias')) : 0;

    vitoriasElement.textContent = vitorias;
    function atualizarPlacar() {
        jogadasElement.textContent = jogadas;
        pontosElement.textContent = pontos;
        vitoriasElement.textContent = vitorias;
    }

    function embaralharCartas() {
        cartas.forEach(carta => {
            const posicaoAleatoria = Math.floor(Math.random() * 16);
            carta.style.order = posicaoAleatoria;
        });
    }

    function virarCarta() {
        if (!podeVirar || this === cartasViradas[0] || this.classList.contains('virada')) {
            return;
        }

        this.classList.add('virada');
        cartasViradas.push(this);

        if (cartasViradas.length === 2) {
            checarMatch();
        }
    }

    function checarMatch() {
        podeVirar = false;
        jogadas++;
        atualizarPlacar();

        const primeiraCarta = cartasViradas[0].dataset.imagem;
        const segundaCarta = cartasViradas[1].dataset.imagem;

        if (primeiraCarta === segundaCarta) {
            pontos++;
            atualizarPlacar();
            cartasViradas = [];
            podeVirar = true;
            checarVitoria();
        } else {
            setTimeout(() => {
                cartasViradas.forEach(carta => carta.classList.remove('virada'));
                cartasViradas = [];
                podeVirar = true;
            }, 1000);
        }
    }

    function checarVitoria() {
        const cartasViradasPermanente = document.querySelectorAll('.carta.virada');
        if (cartasViradasPermanente.length === 16) {
            setTimeout(() => {
                estatisticasVitoria.textContent = `Você venceu com ${jogadas} jogadas e ${pontos} pontos.`;
                mensagemVitoria.classList.add('mostrar');
                vitorias++;
                localStorage.setItem('vitorias', vitorias);
                atualizarPlacar();
            }, 1000);
        }
    }

    function resetarJogo() {
        cartas.forEach(carta => carta.classList.remove('virada'));
        embaralharCartas();
        jogadas = 0;
        pontos = 0;
        cartasViradas = [];
        podeVirar = true;
        atualizarPlacar();
        mensagemVitoria.classList.remove('mostrar');
    }   


    cartas.forEach(carta => carta.addEventListener('click', virarCarta));
    resetButton.addEventListener('click', resetarJogo);
    jogarNovamenteButton.addEventListener('click', resetarJogo);

    embaralharCartas();
    atualizarPlacar();
});

