document.addEventListener("DOMContentLoaded", function() {
    
    const btnMobile = document.getElementById('btn-mobile');
    const menuPrincipal = document.getElementById('menu-principal');

    if (btnMobile && menuPrincipal) {
        btnMobile.addEventListener('click', function() {
          
            menuPrincipal.classList.toggle('menu-aberto');
    
            if (menuPrincipal.classList.contains('menu-aberto')) {
                btnMobile.innerText = "✖ Fechar";
            } else {
                btnMobile.innerText = "☰ Menu";
            }
        });
    }
            
    const metricCards = document.querySelectorAll('.metric-card');
    

    const dashModal = document.getElementById('dashboard-modal');
    const dashModalTitle = document.getElementById('modal-metric-title');
    const dashModalValue = document.getElementById('modal-metric-value');
    const btnCloseDashModal = document.getElementById('btn-close-dash-modal');

    
    if (metricCards.length > 0 && dashModal) {
        metricCards.forEach(function(card) {
            card.addEventListener('click', function() {
               
                const elementoTitulo = this.querySelector('h3');

                const elementoValor = this.querySelector('.metric-value');
             
                if (elementoTitulo && elementoValor) {
                    const tituloMetrica = elementoTitulo.innerText;
                    
                   
                    const valorMetrica = elementoValor.innerHTML;
                  
                    if (dashModalTitle) dashModalTitle.innerText = tituloMetrica;
                    if (dashModalValue) dashModalValue.innerHTML = valorMetrica;

                    dashModal.style.display = 'flex';

                 
                    const dadosInteracao = {
                        metrica: tituloMetrica,
                        dataVisualizacao: new Date().toLocaleString()
                    };
                    localStorage.setItem("ultimaMetricaECOUP", JSON.stringify(dadosInteracao));
                }
            });
        });

    
        if (btnCloseDashModal) {
            btnCloseDashModal.addEventListener('click', function() {
                dashModal.style.display = 'none';
            });
        }
    }


    const loadingIA = document.getElementById('loading-ia');
    const step0 = document.getElementById('step-0');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    
    const btnStartSim = document.getElementById('btn-start-sim');
    const inputActionName = document.getElementById('custom-action-name');
    const categoryCards = document.querySelectorAll('.category-card');
    const btnGoStep2 = document.getElementById('btn-go-step2');
    const selectedActionDisplay = document.getElementById('selected-action-display');
    const btnFakeUpload = document.getElementById('btn-fake-upload');
    const cameraUpload = document.getElementById('camera-upload');
    const fileNameDisplay = document.getElementById('file-name-display');
    const erroTitulo = document.getElementById('erro-titulo');
    

    const valMessageSim = document.getElementById('validation-message-sim');
    const ecoProgress = document.getElementById('eco-progress');
    const ecoPointsText = document.getElementById('eco-points-text');
    const successModal = document.getElementById('success-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');


    let currentSimPoints = 0;
    let pendingPoints = 0;
    let customActionText = "";


    if (btnStartSim) {
        btnStartSim.addEventListener('click', function() {
            step0.style.display = 'none';
            step1.style.display = 'block';
            valMessageSim.innerText = "Descreva a sua ação e escolha uma categoria...";
        });
    }

    if (categoryCards.length > 0) {
        categoryCards.forEach(function(card) {
            card.addEventListener('click', function() {
                categoryCards.forEach(function(c) { c.classList.remove('selected'); });
                this.classList.add('selected');
                pendingPoints = parseInt(this.getAttribute('data-pontos'));
                btnGoStep2.style.display = 'block';
            });
        });
    }

    if (btnGoStep2) {
        btnGoStep2.addEventListener('click', function() {
            customActionText = inputActionName.value.trim();
            
            if (customActionText === "") {
                if(erroTitulo) erroTitulo.style.display = 'block';
                inputActionName.style.borderColor = "var(--cor-alerta)";
                inputActionName.focus();
                return;
            } else {
                if(erroTitulo) erroTitulo.style.display = 'none';
                inputActionName.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }
            
            selectedActionDisplay.innerText = customActionText;
            step1.style.display = 'none';
            step2.style.display = 'block';
            
            valMessageSim.innerText = "Aguardando o envio do arquivo da galeria...";
            valMessageSim.style.color = "#a0aab2";
        });
    }

  
    if (cameraUpload) {
        cameraUpload.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                let nomeArquivo = this.files[0].name || "evidencia_capturada.jpg";
                
                if(nomeArquivo.length > 25) {
                    nomeArquivo = nomeArquivo.substring(0, 22) + "...";
                }
                
                fileNameDisplay.innerText = `✓ Evidência pronta: ${nomeArquivo}`;
                fileNameDisplay.style.display = 'block';
                btnFakeUpload.style.display = 'block';
            }
        });
    }

    if (btnFakeUpload) {
        btnFakeUpload.addEventListener('click', function() {
            if (valMessageSim.innerText.includes("analisar")) return; 

            btnFakeUpload.innerText = "⏳ Analisando Vídeo...";
            btnFakeUpload.style.opacity = "0.7";
            btnFakeUpload.style.cursor = "not-allowed";
            
            valMessageSim.innerText = `A IA da ECOUP está a analisar o seu vídeo com muito cuidado... 🤖✨`;
            valMessageSim.style.color = "#a0aab2";
            if (loadingIA) loadingIA.style.display = 'flex'; 

            setTimeout(function() {
                step2.style.display = 'none';
                
                btnFakeUpload.innerText = "Simular Envio do Vídeo";
                btnFakeUpload.style.opacity = "1";
                btnFakeUpload.style.cursor = "pointer";

                if (loadingIA) loadingIA.style.display = 'none'; 

                currentSimPoints += pendingPoints;
                let displayPoints = currentSimPoints > 100 ? 100 : currentSimPoints;

                ecoProgress.style.width = displayPoints + '%';
                ecoPointsText.innerText = displayPoints + ' / 100';

                valMessageSim.innerText = `Evidência Validada! Ganhou +${pendingPoints} Pontos Ecoa! 🌿`;
                valMessageSim.style.color = "var(--cor-primaria)"; 

                if (currentSimPoints >= 100) {
                    setTimeout(function() {
                        successModal.style.display = 'flex';
                    }, 800); 
                } else {
                    setTimeout(function() {
                        inputActionName.value = ""; 
                        categoryCards.forEach(function(c) { c.classList.remove('selected'); }); 
                        btnGoStep2.style.display = 'none'; 
                        fileNameDisplay.style.display = 'none';
                        btnFakeUpload.style.display = 'none'; 
                        
                        step1.style.display = 'block';
                        valMessageSim.innerText = "Aguardando nova ação para alcançar os 100 pontos...";
                        valMessageSim.style.color = "#a0aab2";
                    }, 2500); 
                }
            }, 3000); 
        });
    }
    
   
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', function() {
            successModal.style.display = 'none';
            
            currentSimPoints = 0;
            ecoProgress.style.width = '0%';
            ecoPointsText.innerText = '0 / 100';
            
            inputActionName.value = ""; 
            categoryCards.forEach(function(c) { c.classList.remove('selected'); });
            btnGoStep2.style.display = 'none';
            fileNameDisplay.style.display = 'none';
            btnFakeUpload.style.display = 'none';
            
            step1.style.display = 'block';
            valMessageSim.innerText = "Pronto para um novo ciclo de sustentabilidade.";
            valMessageSim.style.color = "#a0aab2";
        });
    }

});