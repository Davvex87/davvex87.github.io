document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para navegação com offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const offset = headerHeight + 20; // 20px extra de espaço
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sistema de sincronização de áudio com transcrição
    const audioPlayer = document.getElementById('audioPlayer');
    const transcriptionContainer = document.getElementById('transcriptionContainer');
    const paragraphs = document.querySelectorAll('.transcription-paragraph');


	let timestamps = []; //{ time: 0, element: paragraphs[0] }

	for (let i = 0; i < paragraphs.length; i++) {
		let ts = paragraphs[i].getAttribute('data-timestamp');
		let te = ts.split(':').reverse();
		let rt = 0;

		for (let j = 0; j < te.length; j++) {
			rt += parseInt(te[j], 10) * Math.pow(60, j);
		}

		timestamps.push({ time: rt,
			element: paragraphs[i]
		});
	}
    
    let currentHighlighted = null;
    let isAutoScrolling = false;
    
    // Função para destacar parágrafo atual
    function highlightParagraph(currentTime) {
        // Encontrar o timestamp correspondente ao tempo atual
        let currentTimestamp = null;
        for (let i = timestamps.length - 1; i >= 0; i--) {
            if (currentTime >= timestamps[i].time) {
                currentTimestamp = timestamps[i];
                break;
            }
        }
        
        // Remover highlight anterior
        if (currentHighlighted) {
            currentHighlighted.classList.remove('highlight');
        }
        
        // Adicionar highlight ao parágrafo atual
        if (currentTimestamp && currentTimestamp.element) {
            currentHighlighted = currentTimestamp.element;
            currentHighlighted.classList.add('highlight');
            
            // Scroll automático para o parágrafo destacado
            if (!isAutoScrolling) {
                isAutoScrolling = true;
                
                const containerRect = transcriptionContainer.getBoundingClientRect();
                const elementRect = currentHighlighted.getBoundingClientRect();
                
                // Verificar se o elemento está visível no container
                const isVisible = elementRect.top >= containerRect.top && 
                                 elementRect.bottom <= containerRect.bottom;
                
                if (!isVisible) {
                    // Calcular posição para centralizar o elemento
                    const scrollTop = currentHighlighted.offsetTop - 
                                   transcriptionContainer.offsetTop - 
                                   (transcriptionContainer.clientHeight / 2) + 
                                   (currentHighlighted.clientHeight / 2);
                    
                    transcriptionContainer.scrollTo({
                        top: scrollTop,
                        behavior: 'smooth'
                    });
                }
                
                // Resetar o flag após o scroll
                setTimeout(() => {
                    isAutoScrolling = false;
                }, 1000);
            }
        }
    }
    
    // Event listener para atualizar highlights durante a reprodução
    audioPlayer.addEventListener('timeupdate', function() {
        highlightParagraph(audioPlayer.currentTime);
    });
    
    // Event listener para quando o áudio termina
    audioPlayer.addEventListener('ended', function() {
        if (currentHighlighted) {
            currentHighlighted.classList.remove('highlight');
        }
        currentHighlighted = null;
    });
    
    // Clique nos parágrafos para saltar para esse ponto no áudio
    paragraphs.forEach((paragraph, index) => {
        paragraph.addEventListener('click', function() {
            if (timestamps[index]) {
                audioPlayer.currentTime = timestamps[index].time;
                if (audioPlayer.paused) {
                    audioPlayer.play();
                }
            }
        });
    });
    
    // Adicionar cursor pointer e tooltip
    paragraphs.forEach(paragraph => {
        paragraph.style.cursor = 'pointer';
        paragraph.title = 'Clique para saltar para esta parte do áudio';
    });
    
    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Animação ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.work-category, .award-item, .podcast-episode').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});