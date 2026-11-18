  document.getElementById('year').textContent = new Date().getFullYear();

  document.querySelectorAll('button.menu__label').forEach(function(btn){
    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.parentElement.classList.toggle('is-open', !open);
    });
  });

// barra de navegação fixa: aparece quando a dobra inicial sai de vista
(function(){
  var hero = document.getElementById('inicio');
  var nav = document.querySelector('.sitenav');
  if(!hero || !nav) return;
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        nav.classList.toggle('is-visible', !entry.isIntersecting);
      });
    }, {threshold:0, rootMargin:'-10% 0px 0px 0px'});
    io.observe(hero);
  } else {
    nav.classList.add('is-visible');
  }
})();

// galeria de fotos: botões, contador e posição atual
(function(){
  var track = document.querySelector('.gallery__track');
  if(!track) return;
  var slides = Array.prototype.slice.call(track.children);
  var prev = document.querySelector('.gallery__btn--prev');
  var next = document.querySelector('.gallery__btn--next');
  var counter = document.querySelector('.gallery__count b');
  var ticking = false;

  function current(){
    var center = track.scrollLeft + track.clientWidth / 2, best = 0, bestDist = Infinity;
    slides.forEach(function(s, i){
      var d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center);
      if(d < bestDist){ bestDist = d; best = i; }
    });
    return best;
  }
  function update(){
    var i = current();
    counter.textContent = i + 1;
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
    ticking = false;
  }
  function go(i){
    i = Math.max(0, Math.min(slides.length - 1, i));
    var s = slides[i];
    track.scrollTo({left: s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2, behavior: (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth")});
  }
  prev.addEventListener('click', function(){ go(current() - 1); });
  next.addEventListener('click', function(){ go(current() + 1); });
  track.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, {passive:true});
  window.addEventListener('resize', update);
  update();
})();

// menu do celular: botão hambúrguer abre/fecha o painel de tópicos
(function(){
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('menu-panel');
  if(!toggle || !panel) return;
  var root = document.documentElement;
  function set(open){
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function(){ set(!root.classList.contains('menu-open')); });
  panel.addEventListener('click', function(e){ if(e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') set(false); });
  window.matchMedia('(min-width:861px)').addEventListener('change', function(e){ if(e.matches) set(false); });
})();
