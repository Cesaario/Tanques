var abaSelecionada = 0;
var spanTanques, spanServidor;
var spanDt, spanCv, spanVazaoAzul, spanVazaoAmarelo, spanAreaAmarelo, spanAreaAzul, spanAreaVerde, spanIp, spanPorta, spanpos;
var inputDt, inputCv, inputVazaoAzul, inputVazaoAmarelo, inputAreaAmarelo, inputAreaAzul, inputAreaVerde, inputIp, inputPorta;
var botaoAtualizarTanques, botaoAtualizarServidor;
var imgCasa, imgGear, imgGrafico, imgTanques, imgSwitch1, imgSwitch2, imgLuzVerde, imgLuzVermelha, imgValvula1, imgValvula2, imgBotao1, imgBotao2;
var grafico, grafico1, grafico2, grafico3;
var divGrafico, divGrafico1, divGrafico2, divGrafico3; 
var areaAzul, vazaoAzul, areaAmarelo, vazaoAmarelo, areaVerde, valorCv, valorDt = 0;
var tanque = [];
var botaoEmergencia;
var onoff = false, emergencia = false, valvula1 = false, valvula2 = false, valvula3 = false, valvula4 = false;

var dimensaoGrafico = 100;
var taxaGrafico = 50; //(ms)
//var taxaTanques = 100;
var taxaDesenho = 100;

var data = new Date();
var taxaRelogio = 10;
var tempoAtual = data.getTime();
var tempoAlvo = data.getTime() + valorDt;

var dataTanque = [[0,0,0],[0,0,0],[0,0,0]];
var tempo = [];
for(var i = 0; i < dimensaoGrafico; i++) tempo.push(i);

var contadorTempo = dimensaoGrafico;

p5.disableFriendlyErrors = true;

setInterval(function relogio(){
    tempoAtual = new Date().getTime();
    if(tempoAtual >= tempoAlvo){
        tempoAlvo = tempoAlvo + valorDt*1000;
        if(!onoff) return;
        vazaoTanques();
    }else{
        if(botaoEmergencia){
            onoff = false;
            botaoEmergencia = false;
        }
    }
}, taxaRelogio);

var socket = io.connect('http://localhost:2003');
socket.on('connect', function() {
	console.log("Conectado ao servidor python com sucesso!");
	//spansv = ("Servidor ONLINE");
    //spansv.style("color:rgb(75, 180, 50)");
    socket.on('respostaAlturaFinal', function(id, msg) {
        var i = parseInt(id);
        tanque[i].updateAltura(parseFloat(msg));
       // console.log("Altura final de " + i + ":" + area[i]);
    });
    socket.on('respostaQo', function(id, msg){
        var i = parseInt(id);
        tanque[i].updateQo(parseFloat(msg));
       // console.log("Altura final de " + i + ":" + area[i]);
    });
});

function preload(){
    imgCasa = loadImage('imagens/casa.png');
    imgGear = loadImage('imagens/engrenagem.png');
    imgGrafico = loadImage('imagens/grafico.png');
    imgTanques = loadImage('imagens/PainelTanques1.png');
    imgSwitch1 = loadImage('imagens/Switch1.png');
    imgSwitch2 = loadImage('imagens/Switch2.png');
    imgLuzVerde = loadImage('imagens/LuzVerde.png');
    imgLuzVermelha = loadImage('imagens/LuzVermelha.png');
    imgValvula1 = loadImage('imagens/Valvula1.png');
    imgValvula2 = loadImage('imagens/Valvula2.png');
    imgBotao1 = loadImage('imagens/BotaoPressionado.png');
    imgBotao2 = loadImage('imagens/BotaoNaoPressionado.png');
}

function setup(){
    createCanvas(1024,600); //Era 800*480
    background(240);
    layout();
    mostrarEsconder();
	tanque.push(new Tanque(195, 125, 310, 125, 0, inputAreaAzul.value(), 0));
	tanque.push(new Tanque(610, 125, 165, 125, 0, inputAreaAmarelo.value(), 1));
	tanque.push(new Tanque(200, 440, 550, 120, 0, inputAreaVerde.value(), 2));
	fill(255,150,0);
    gerarGrafico();
    divGrafico.style('position:absolute');
    noLoop(); //Desabilitar o draw pois ele não era mais preciso por ser executado muito rapidamente.
}

setInterval(function desenho(){
    if(abaSelecionada == 0){
        fill(240);
        rect(50,0,974,600);
        for(var i = 0; i < 3; i++) tanque[i].mostrar();
        layoutImagens();
    }else if(abaSelecionada == 1){
        fill(240);
        rect(50,0,974,600);
        fill(51);
        rect(675,40,5,520,20,20,20,20);
    }else if(abaSelecionada == 2){
        fill(240);
        rect(50,0,974,600);
    }else console.error("Aba inválida!!!");
	spanpos.style("color:orange");
	spanpos.html(mouseX + ", " + mouseY);
}, taxaDesenho);

function mouseClicked(){
    if(mouseX <= 50){
        var sel = Math.floor(mouseY/50);
        if(sel <= 2){
            abaSelecionada = sel;
            mostrarEsconder();
            layoutBarra();
        }
    }else{
        if(abaSelecionada == 0){
            if(checkMouse(70,152,100,308)){
                if(!onoff) onoff = true;
                else onoff = false;
            }else if(checkMouse(825, 910, 435, 510)){
                if(!onoff) return;
                if(valvula1) valvula1 = false;
                else valvula1 = true;
            }else if(checkMouse(900, 990, 435, 510)){
                if(!onoff) return;
                if(valvula2) valvula2 = false;
                else valvula2 = true;
            }else if(checkMouse(437, 510, 350, 430)){
                if(!onoff) return;
                if(valvula3) valvula3 = false;
                else valvula3 = true;
            }else if(checkMouse(437, 510, 560, 640)){
                if(!onoff) return;
                if(valvula4) valvula4 = false;
                else valvula4 = true;
            }else if(checkMouse(70, 150, 450, 530)){
                botaoEmergencia = true;
            }
        }
    }
}

function checkMouse(x1, x2, y1, y2){
    if(mouseX >= x1 && mouseX <= x2){
        if(mouseY >= y1 && mouseY <= y2){
            return true;
        }
    }
    return false;
}

function mostrarEsconder(){
    if(abaSelecionada == 1){
        spanDt.show();
        spanCv.show();
        spanVazaoAzul.show();
        spanVazaoAmarelo.show();
        spanAreaAmarelo.show();
        spanAreaAzul.show();
        spanAreaVerde.show();
        inputDt.show();
        inputCv.show();
        inputVazaoAzul.show();
        inputVazaoAmarelo.show();
        inputAreaAmarelo.show();
        inputAreaAzul.show();
        inputAreaVerde.show();
        spanTanques.show();
        spanServidor.show();
        spanIp.show();
        spanPorta.show();
        inputIp.show();
        inputPorta.show();
        botaoAtualizarServidor.show();
        botaoAtualizarTanques.show();
    }else{
        spanDt.hide();
        spanCv.hide();
        spanVazaoAzul.hide();
        spanVazaoAmarelo.hide();
        spanAreaAmarelo.hide();
        spanAreaAzul.hide();
        spanAreaVerde.hide();
        inputDt.hide();
        inputCv.hide();
        inputVazaoAzul.hide();
        inputVazaoAmarelo.hide();
        inputAreaAmarelo.hide();
        inputAreaAzul.hide();
        inputAreaVerde.hide();
        spanTanques.hide();
        spanServidor.hide();
        spanIp.hide();
        spanPorta.hide();
        inputIp.hide();
        inputPorta.hide();
        botaoAtualizarServidor.hide();
        botaoAtualizarTanques.hide();
    }
    if(abaSelecionada == 2){
        divGrafico.show();
        divGrafico.style('position:absolute');
        divGrafico1.show();
        divGrafico1.style('position:absolute');
        divGrafico2.show();
        divGrafico2.style('position:absolute');
        divGrafico3.show();
        divGrafico3.style('position:absolute');
    }else{
    	divGrafico.hide();
    	divGrafico1.hide();
    	divGrafico2.hide();
    	divGrafico3.hide();
    } 
}

function layoutImagens(){
    image(imgTanques, 50, 0);
    if(onoff){
        image(imgSwitch1, 70, 100);
        image(imgLuzVerde, 70, 10);
    }else{
        image(imgSwitch2, 70, 170);
        image(imgLuzVermelha, 70, 10);
    }
    if(valvula1) image(imgValvula2, 848,432);
    else image(imgValvula1, 830, 450);
    
    if(valvula2) image(imgValvula2, 936,432);
    else image(imgValvula1, 918, 450);
    
    if(valvula3) image(imgValvula2, 455,332);
    else image(imgValvula1, 437, 350);
    
    if(valvula4) image(imgValvula2, 455,542);
    else image(imgValvula1, 437, 560);
    
    image(imgBotao2, 70, 450);
}

function layout(){
    
    imgCasa.resize(30,30);
    imgCasa.filter('INVERT');
    imgGear.resize(30,30);
    imgGear.filter('INVERT');
    imgGrafico.resize(30,30);
    imgGrafico.filter('INVERT');
    
    layoutBarra();
    
    spanDt = createSpan("Intervalo de Amostragem");
    spanDt.position(112,137);
    spanDt.style("color:rgb(10, 10, 10)");
    spanDt.hide();
	
	inputDt = createInput();
	inputDt.value("0.1");
	inputDt.position(112,175);
	inputDt.hide();
	valorDt = inputDt.value();
    
    spanCv = createSpan("Coeficiente de Vazão");
    spanCv.position(385,137);
    spanCv.style("color:rgb(10, 10, 10)");
    spanCv.hide();
	
	inputCv = createInput();
	inputCv.value("2");
	inputCv.position(385,175);
	inputCv.hide();
	valorCv = inputCv.value();
    
    spanVazaoAzul = createSpan("Vazão Tanque Azul");
    spanVazaoAzul.position(385,237);
    spanVazaoAzul.style("color:rgb(10, 10, 180)");
    spanVazaoAzul.hide();
	
	inputVazaoAzul = createInput();
	inputVazaoAzul.value("100");
	inputVazaoAzul.position(385,275);
	inputVazaoAzul.hide();
	vazaoAzul = inputVazaoAzul.value();
    
    spanVazaoAmarelo = createSpan("Vazão Tanque Amarelo");
    spanVazaoAmarelo.position(385,337);
    spanVazaoAmarelo.style("color:rgb(180, 180, 10)");
    spanVazaoAmarelo.hide();
	
	inputVazaoAmarelo = createInput();
	inputVazaoAmarelo.value("100");
	inputVazaoAmarelo.position(385,362);
	inputVazaoAmarelo.hide();
	vazaoAmarelo = inputVazaoAmarelo.value();
    
    spanAreaAzul = createSpan("Área Tanque Azul (m²)");
    spanAreaAzul.position(112,237);
    spanAreaAzul.style("color:rgb(10, 10, 180)");
    spanAreaAzul.hide();
	
	inputAreaAzul = createInput();
	inputAreaAzul.value("3.6");
	inputAreaAzul.position(112,275);
	inputAreaAzul.hide();
	areaAzul = inputAreaAzul.value();
    
    spanAreaAmarelo = createSpan("Área Tanque Amarelo (m²)");
    spanAreaAmarelo.position(112,337);
    spanAreaAmarelo.style("color:rgb(180, 180, 10)");
    spanAreaAmarelo.hide();
	
	inputAreaAmarelo = createInput();
	inputAreaAmarelo.value("2.4");
	inputAreaAmarelo.position(112,362);
	inputAreaAmarelo.hide();
	areaAmarelo = inputAreaAmarelo.value();
    
    spanAreaVerde = createSpan("Área Tanque Verde (m²)");
    spanAreaVerde.position(112,437);
    spanAreaVerde.style("color:rgb(10, 180, 10)");
    spanAreaVerde.hide();
	
	inputAreaVerde = createInput();
	inputAreaVerde.value("2.4");
	inputAreaVerde.position(112,462);
	inputAreaVerde.hide();
	areaVerde = inputAreaVerde.value();
	
	spanTanques = createSpan("Configuração dos Tanques");
	spanTanques.position(112,37);
	spanTanques.style("font-weight:bold; color:rgb(10, 10, 10); font-size:25px");
	spanTanques.hide();
	
	spanServidor = createSpan("Configuração do<br> Servidor");
	spanServidor.position(800,37);
	spanServidor.style("font-weight:bold; color:rgb(10, 10, 10); font-size:25px");
	spanServidor.hide();
	
	spanIp = createSpan("IP do servidor");
	spanIp.position(800,137);
	spanIp.style("color:rgb(10, 10, 10)");
	spanIp.hide();
	
	inputIp = createInput();
	inputIp.value("http://localhost");
	inputIp.position(800,175);
	inputIp.hide();
	
	spanPorta = createSpan("Porta do Servidor");
	spanPorta.position(800,237);
	spanPorta.style("color:rgb(10, 10, 10)");
	spanPorta.hide();
	
	inputPorta = createInput();
	inputPorta.value("2003");
	inputPorta.position(800,275);
	inputPorta.hide();
	
	botaoAtualizarTanques = createButton("Atualizar Tanques");
	botaoAtualizarTanques.position(385,462);
	botaoAtualizarTanques.size(180,50);
	botaoAtualizarTanques.mousePressed(atualizarTanques);
	botaoAtualizarTanques.hide();
	
	botaoAtualizarServidor = createButton("Atualizar Servidor");
	botaoAtualizarServidor.position(800,375);
	botaoAtualizarServidor.size(180,50);
	botaoAtualizarServidor.mousePressed(atualizarServidor);
	botaoAtualizarServidor.hide();
	
	spanpos = createSpan();
	spanpos.position(60, 580);
	
	divGrafico = createDiv("");
    divGrafico.position(50,10);
    divGrafico.id("grafico");
	divGrafico.hide();
	
	divGrafico1 = createDiv("");
    divGrafico1.position(775,-75);
    divGrafico1.id("grafico1");
	divGrafico1.hide();
	
	divGrafico2 = createDiv("");
    divGrafico2.position(775,125);
    divGrafico2.id("grafico2");
	divGrafico2.hide();
	
	divGrafico3 = createDiv("");
    divGrafico3.position(775,325);
    divGrafico3.id("grafico3");
	divGrafico3.hide();
}

function layoutBarra(){
    noStroke();
    fill(52);
    rect(0,0,50,600);
    fill(10, 200, 200);
    rect(0,0+abaSelecionada*50,50,50);
    
    image(imgCasa,10,10);
    image(imgGear,10,60);
    image(imgGrafico,10,110);
}

function vazaoTanques(){
	
	var dt = valorDt;
	var cv = valorCv;

	if(valvula1) tanque[0].qi = vazaoAzul;
	else tanque[0].qi = 0;

	if(valvula2) tanque[1].qi = vazaoAmarelo;
	else tanque[1].qi = 0;

	if(valvula3){
		if(tanque[0].altura >= 0){
			socket.emit('qo', 0, cv, tanque[0].altura);
		}else tanque[0].qi = 0;
		if(tanque[1].altura >= 0){
			socket.emit('qo', 1, cv, tanque[1].altura);
		}else tanque[1].qo = 0;
		//Em tese isso só poderia ser executado depois de receber a resposta do qo.
		tanque[2].qi = tanque[0].qo + tanque[1].qo;
	}else{
		tanque[0].qo = 0;
		tanque[1].qo = 0;
		tanque[2].qi = 0;
	}

	if(valvula4){
		if(tanque[2].altura >= 0){
			socket.emit('qo', 2, cv, tanque[2].altura);
		}else tanque[2].qo = 0;
	}else tanque[2].qo = 0;
	
	//console.log(tanque[0].altura + ", " + tanque[1].altura + ", " + tanque[2].altura);
	
	for(var i = 0; i < 3; i++) socket.emit('alturaFinal', i, tanque[i].altura, dt, tanque[i].area, tanque[i].qi, tanque[i].qo);
}

function atualizarTanques(){
    areaAzul = inputAreaAzul.value();
    areaAmarelo = inputAreaAmarelo.value();
    vazaoAzul = inputVazaoAzul.value();
    vazaoAmarelo = inputVazaoAmarelo.value();
    areaVerde = inputAreaVerde.value();
    valorCv = inputCv.value();
    valorDt = inputDt.value();
    
    tanque[0].area = areaAzul;
    tanque[1].area = areaAmarelo;
    tanque[2].area = areaVerde;
    
    onoff = false;
    var dt = valorDt;
    
    for(var i = 0; i < 3; i++){
        socket.emit('alturaFinal', i, 0, dt, tanque[i].area, 0, tanque[i].qo);
        tanque[i].mostrar();
    } 
    
    console.log("Tanques atualizados com sucesso!");
}

function atualizarServidor(){
    socket.disconnect(true);
    console.log("Desconectado.");
    var servidor = inputIp.value()+":"+inputPorta.value();
    console.log(servidor);
    socket = io.connect(servidor);
    socket.on('connect', function() {
	console.log("Conectado ao servidor python com sucesso!");
	//spansv = ("Servidor ONLINE");
    //spansv.style("color:rgb(75, 180, 50)");
        socket.on('respostaAlturaFinal', function(id, msg) {
            var i = parseInt(id);
            tanque[i].updateAltura(parseFloat(msg))
           // console.log("Altura final de " + i + ":" + area[i]);
        });
        socket.on('respostaQo', function(id, msg){
            var i = parseInt(id);
            tanque[i].updateQo(parseFloat(msg));
           // console.log("Altura final de " + i + ":" + area[i]);
        });
    });
}

setInterval(function gerarValoresGrafico(){
    if(!onoff) return;
    for(var i = 0; i < 3; i++){
        if(dataTanque[i].length > dimensaoGrafico) dataTanque[i].shift();
        dataTanque[i].push(tanque[i].altura);
    }
    
    if(tempo.length > dimensaoGrafico) tempo.shift();
    tempo.push(contadorTempo);
    contadorTempo++;
    tempo[0] = 'x';
    
    dataTanque[0][0] = "Tanque 1";
    dataTanque[1][0] = "Tanque 2";
    dataTanque[2][0] = "Tanque 3";
    //console.log(dataTanque[0]);
},taxaGrafico);

setInterval(function atualizarGrafico(){
    if(!onoff) return;
    grafico.load({
        columns: [
            tempo,
            dataTanque[0],
            dataTanque[1],
            dataTanque[2]
        ],
        duration: 0,
    });
    atualizarGraficoMedidor(grafico1, 1);
    atualizarGraficoMedidor(grafico2, 2);
    atualizarGraficoMedidor(grafico3, 3);
}, taxaGrafico);

/*setInterval(function atualizarTanques(){
    if(!onoff) return;
    vazaoTanques();
}, taxaTanques);*/
/*FOI RETIRADO POIS FOI UTILIZADO OUTRO MODO DE RELÓGIO*/

function gerarGrafico(){
    console.log("Gerando gráfico...");

    grafico = c3.generate({
        bindto: "#grafico",
        size: {
            height: 550,
            width: 700
        },
        data: {
            x: 'x',
            columns: [
                ['x', 1,2,3,4,5,6,7,8,9,10],
                ['Tanque 1', 0],
                ['Tanque 2', 0],
                ['Tanque 3', 0]
            ]
        },
	    transition: {
	        duration: 0
	    },
        axis: {
            x: {
                type: 'category' // this needed to load string x value
            }
        },
        point: {
            show: false
        }
    });
    grafico.axis.max(130);
    grafico.axis.min(0);

    grafico1 = graficoMedidor(1);
    grafico2 = graficoMedidor(2);
    grafico3 = graficoMedidor(3);
}

function graficoMedidor(n){
    var medidor = c3.generate({
        bindto: "#grafico"+n,
	    data: {
	        columns: [
	            ['Tanque '+n, 0]
	        ],
	        type: 'gauge',
	    },
	    color: {
	        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
	        threshold: {
	            values: [30, 60, 90, 100]
	        }
	    },
	    size: {
	        height: 250,
            width: 250
	    },
	    transition: {
	        duration: 0
	    }
	});
	return medidor;
}

function atualizarGraficoMedidor(graficoMedidor, n){
    graficoMedidor.load({
        columns: [
            ['Tanque '+n, (tanque[n-1].altura/tanque[n-1].h)*100]
        ],
        duration: 0,
    });
}

//TODO: TELA COM TANQUES E GRAFICOS