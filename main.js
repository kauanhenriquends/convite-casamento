(function () {
  var C = window.CASAMENTO;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.querySelector('.page');
  var casamento = new Date(C.data);

  // ---------- Datas ----------
  var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var semana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  var unidades = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  var dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  function extenso(n) { // 0 a 99
    if (n < 20) return unidades[n];
    return dezenas[Math.floor(n / 10)] + (n % 10 ? ' e ' + unidades[n % 10] : '');
  }
  function anoExtenso(a) { // 2000 a 2099
    var r = a - 2000;
    return 'dois mil' + (r ? ' e ' + extenso(r) : '');
  }
  function dois(n) { return (n < 10 ? '0' : '') + n; }

  // Partes da data no fuso de Brasília, independente do fuso do celular.
  var br = new Date(casamento.getTime() - 3 * 3600 * 1000);
  var dia = br.getUTCDate(), mes = br.getUTCMonth(), ano = br.getUTCFullYear();
  var prazo = C.confirmarAte ? C.confirmarAte.split('-') : null;

  var valores = {
    noiva: C.noivos[0],
    noivo: C.noivos[1],
    nomes: C.noivos[0] + ' & ' + C.noivos[1],
    monograma: C.noivos[0].charAt(0) + ' & ' + C.noivos[1].charAt(0),
    abertura: C.abertura || '',
    cidade: C.cidade || '',
    diaSemana: semana[br.getUTCDay()].split('-')[0],
    dataCurta: dois(dia) + ' · ' + dois(mes + 1) + ' · ' + ano,
    dataExtenso: semana[br.getUTCDay()] + ', ' + (dia === 1 ? 'primeiro' : extenso(dia)) + ' de ' + meses[mes] + ' de ' + (ano >= 2000 && ano < 2100 ? anoExtenso(ano) : ano),
    cerimoniaHora: C.cerimonia.hora,
    cerimoniaLocal: C.cerimonia.local,
    cerimoniaEndereco: C.cerimonia.endereco,
    recepcaoHora: C.recepcao.hora,
    recepcaoLocal: C.recepcao.local,
    traje: C.traje,
    prazo: prazo ? 'Pedimos a gentileza de confirmar até ' + Number(prazo[2]) + ' de ' + meses[Number(prazo[1]) - 1] + '.' : 'Pedimos a gentileza de confirmar sua presença.'
  };
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    el.textContent = valores[el.dataset.bind] || '';
  });
  document.title = valores.nomes + ' · Convite de casamento';
  var mapa = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.cerimonia.local + ', ' + C.cerimonia.endereco);
  document.querySelectorAll('[data-bind-href="mapa"]').forEach(function (a) { a.href = mapa; });

  // ---------- Aviso rápido ----------
  var toast = document.querySelector('.toast');
  var toastTimer;
  function avisar(texto) {
    toast.textContent = texto;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-shown'); }, 3600);
  }

  // ---------- Contagem regressiva ----------
  var cDias = document.querySelector('[data-count="dias"]');
  function contar() { cDias.textContent = Math.max(0, Math.ceil((casamento - Date.now()) / 864e5)); }
  contar();
  setInterval(contar, 60000);

  // ---------- Salvar na agenda (.ics) ----------
  function ics(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  document.getElementById('add-cal').addEventListener('click', function () {
    var fim = new Date(casamento.getTime() + 6 * 3600 * 1000);
    var texto = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//convite//PT-BR', 'BEGIN:VEVENT',
      'UID:' + ics(casamento) + '@convite',
      'DTSTAMP:' + ics(new Date()),
      'DTSTART:' + ics(casamento),
      'DTEND:' + ics(fim),
      'SUMMARY:Casamento ' + valores.nomes,
      'LOCATION:' + (C.cerimonia.local + ', ' + C.cerimonia.endereco).replace(/,/g, '\\,'),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var url = URL.createObjectURL(new Blob([texto], { type: 'text/calendar' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = 'casamento.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  });

  // ---------- História ----------
  var lista = document.querySelector('.milestones');
  var marcos = C.historia.map(function (h) {
    var li = document.createElement('li');
    li.innerHTML = '<span class="yr"></span><span class="tt"></span><span class="tx"></span>';
    li.querySelector('.yr').textContent = h.ano;
    li.querySelector('.tt').textContent = h.titulo;
    li.querySelector('.tx').textContent = h.texto;
    lista.appendChild(li);
    return li;
  });

  // ---------- Presentes ----------
  var real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var giftList = document.querySelector('.gift-list');
  var tabs = document.querySelector('.tabs');
  var categorias = ['Todos'];
  var gifts = C.presentes.map(function (g) {
    if (categorias.indexOf(g.categoria) < 0) categorias.push(g.categoria);
    var li = document.createElement('li');
    li.className = 'gift';
    li.dataset.cat = g.categoria;
    li.innerHTML = '<div class="gift-head"><span class="gift-title"></span><span class="gift-dots"></span><span class="gift-price"></span></div><p class="gift-text"></p><a class="gift-link" target="_blank" rel="noopener">Presentear</a>';
    li.querySelector('.gift-title').textContent = g.titulo;
    li.querySelector('.gift-price').textContent = real.format(g.valor);
    li.querySelector('.gift-text').textContent = g.texto;
    var link = li.querySelector('.gift-link');
    link.setAttribute('aria-label', 'Presentear: ' + g.titulo + ', ' + real.format(g.valor));
    if (/^https:\/\//.test(g.link || '')) {
      link.href = g.link;
    } else {
      link.href = '#presentes';
      link.removeAttribute('target');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        avisar('O link de pagamento deste presente ainda não foi configurado.');
      });
    }
    giftList.appendChild(li);
    return li;
  });
  categorias.forEach(function (cat, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.textContent = cat;
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function () {
      tabs.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-pressed', t === b ? 'true' : 'false'); });
      gifts.forEach(function (li) { li.hidden = !(cat === 'Todos' || li.dataset.cat === cat); });
    });
    tabs.appendChild(b);
  });

  // ---------- Confirmação de presença ----------
  var form = document.querySelector('.form');
  var done = document.querySelector('.done');
  var erro = form.querySelector('.form-error');
  var pessoasBox = form.querySelector('.field-people');
  var pessoasOut = form.querySelector('output[name="pessoas"]');
  var menos = form.querySelector('[data-step="-1"]');
  var mais = form.querySelector('[data-step="1"]');
  var pessoas = 1;
  var max = C.maxPessoas || 6;

  function atualizarPessoas() {
    pessoasOut.textContent = pessoas;
    menos.disabled = pessoas <= 1;
    mais.disabled = pessoas >= max;
  }
  [menos, mais].forEach(function (b) {
    b.addEventListener('click', function () {
      pessoas = Math.min(max, Math.max(1, pessoas + Number(b.dataset.step)));
      atualizarPessoas();
    });
  });
  atualizarPessoas();

  form.addEventListener('change', function (e) {
    if (e.target.name === 'presenca') pessoasBox.hidden = e.target.value !== 'sim';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    erro.textContent = '';
    var nomeEl = form.elements.nome;
    var nome = nomeEl.value.trim().replace(/\s+/g, ' ');
    var presenca = (form.querySelector('input[name="presenca"]:checked') || {}).value;
    nomeEl.removeAttribute('aria-invalid');

    if (nome.length < 3) {
      nomeEl.setAttribute('aria-invalid', 'true');
      erro.textContent = 'Escreva seu nome completo.';
      nomeEl.focus();
      return;
    }
    if (!presenca) {
      erro.textContent = 'Escolha sua resposta.';
      form.querySelector('input[name="presenca"]').focus();
      return;
    }
    if (!/^https:\/\/script\.google\.com\//.test(C.planilhaUrl || '')) {
      erro.textContent = 'A planilha de confirmações ainda não foi conectada.';
      return;
    }

    var dados = new URLSearchParams({
      nome: nome,
      presenca: presenca,
      pessoas: presenca === 'sim' ? String(pessoas) : '0',
      recado: form.elements.recado.value.trim()
    });
    var botao = form.querySelector('[type="submit"]');
    botao.disabled = true;
    botao.textContent = 'Enviando...';

    // O Google não devolve uma resposta legível para o navegador (no-cors),
    // então o envio conta como feito se a rede não falhar.
    fetch(C.planilhaUrl, { method: 'POST', mode: 'no-cors', body: dados })
      .then(function () {
        var primeiro = nome.split(' ')[0];
        var extra = pessoas - 1;
        done.querySelector('.done-title').textContent = presenca === 'sim' ? 'Até lá, ' + primeiro + '!' : 'Obrigado, ' + primeiro + '.';
        done.querySelector('.done-text').textContent = presenca === 'sim'
          ? (extra > 0 ? 'Sua presença e a de mais ' + extra + (extra > 1 ? ' pessoas' : ' pessoa') + ' estão confirmadas.' : 'Sua presença está confirmada.')
          : (dados.get('recado') ? 'Vamos sentir sua falta. Seu recado chegou até nós.' : 'Vamos sentir sua falta. Obrigado por avisar.');
        form.hidden = true;
        done.hidden = false;
        done.focus();
      })
      .catch(function () {
        erro.textContent = 'Não foi possível enviar agora. Confira sua internet e tente de novo.';
      })
      .then(function () {
        botao.disabled = false;
        botao.textContent = 'Enviar resposta';
      });
  });

  document.getElementById('again').addEventListener('click', function () {
    form.reset();
    pessoas = 1;
    atualizarPessoas();
    pessoasBox.hidden = true;
    done.hidden = true;
    form.hidden = false;
    form.elements.nome.focus();
  });

  // ---------- O fio dourado e a aliança ----------
  // Uma aliança desce por um fio conforme a pessoa rola a página,
  // acende cada momento da história e, no fim, encontra a segunda aliança.
  var svg = document.querySelector('.route');
  var ghost = svg.querySelector('.route-ghost');
  var line = svg.querySelector('.route-line');
  var ringMove = svg.querySelector('.ring-move');
  var ringEnd = svg.querySelector('.ring-end');
  var startEl = document.querySelector('.route-start');
  var endEl = document.querySelector('.route-end');
  var bends = Array.prototype.slice.call(document.querySelectorAll('.bend'));
  var total = 0, amostras = [], startY = 0, marcosY = [];

  function topo(el) { return el.getBoundingClientRect().top - page.getBoundingClientRect().top; }

  function montarFio() {
    var W = page.clientWidth;
    var H = page.scrollHeight;
    var cx = W / 2;
    var gx = parseFloat(getComputedStyle(page).getPropertyValue('--gx')) || 26;
    function xDe(code) { return code === 'g' ? gx : cx; }

    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.style.height = H + 'px';

    startY = topo(startEl);
    var d = 'M' + cx + ' ' + startY;
    bends.forEach(function (b) {
      var t = topo(b), h = b.offsetHeight;
      var fx = xDe(b.dataset.from), tx = xDe(b.dataset.to);
      d += ' L' + fx + ' ' + t +
        ' C' + fx + ' ' + (t + h * 0.6) + ' ' + tx + ' ' + (t + h * 0.4) + ' ' + tx + ' ' + (t + h);
    });
    var endY = topo(endEl) + endEl.offsetHeight / 2;
    d += ' L' + cx + ' ' + endY;

    ghost.setAttribute('d', d);
    line.setAttribute('d', d);
    total = line.getTotalLength();
    line.style.strokeDasharray = total + ' ' + total;
    ringEnd.setAttribute('transform', 'translate(' + (cx + 14) + ' ' + endY + ')');

    // Pontos ao longo do fio, para achar rápido onde a aliança deve estar.
    amostras = [];
    for (var l = 0; l <= total; l += 3) {
      var p = line.getPointAtLength(l);
      amostras.push({ l: l, x: p.x, y: p.y });
    }
    var fim = line.getPointAtLength(total);
    amostras.push({ l: total, x: fim.x, y: fim.y });

    marcosY = marcos.map(function (li) { return topo(li) + 10; });
    desenhar();
  }

  function pontoNoY(y) {
    if (y <= amostras[0].y) return amostras[0];
    var lo = 0, hi = amostras.length - 1;
    if (y >= amostras[hi].y) return amostras[hi];
    while (hi - lo > 1) {
      var mid = (lo + hi) >> 1;
      if (amostras[mid].y < y) lo = mid; else hi = mid;
    }
    return amostras[hi];
  }

  function desenhar() {
    if (!amostras.length) return;
    var alvo = reduced ? Infinity : window.scrollY + window.innerHeight * 0.62 - (page.getBoundingClientRect().top + window.scrollY);
    var p = reduced ? amostras[amostras.length - 1] : pontoNoY(alvo);
    line.style.strokeDashoffset = (total - p.l).toFixed(1);
    ringMove.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
    ringEnd.classList.toggle('is-joined', p.l >= total - 1);

    var atual = -1;
    marcos.forEach(function (li, i) {
      var on = alvo >= marcosY[i];
      li.classList.toggle('is-on', on);
      if (on) atual = i;
    });
    marcos.forEach(function (li, i) { li.classList.toggle('is-current', i === atual); });
  }

  // ---------- Rolagem ----------
  var hero = document.querySelector('.hero');
  var rsvp = document.querySelector('.rsvp');
  var flutuante = document.querySelector('.float-cta');
  var ticking = false;
  function aoRolar() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      desenhar();
      var passouHero = hero.getBoundingClientRect().bottom < 0;
      var naConfirmacao = rsvp.getBoundingClientRect().top < window.innerHeight;
      flutuante.classList.toggle('is-shown', passouHero && !naConfirmacao);
      ticking = false;
    });
  }
  window.addEventListener('scroll', aoRolar, { passive: true });

  // Refaz o fio quando a página muda de tamanho (fontes, foto, filtros, formulário).
  var refazer = (function () {
    var t;
    return function () { clearTimeout(t); t = setTimeout(montarFio, 60); };
  })();
  window.addEventListener('resize', refazer);
  window.addEventListener('load', refazer);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refazer);
  if ('ResizeObserver' in window) new ResizeObserver(refazer).observe(page);
  montarFio();

  // ---------- Entrada suave dos blocos ----------
  if (reduced || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('anim');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
})();
