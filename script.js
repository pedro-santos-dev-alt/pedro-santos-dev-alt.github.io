(() => {
  document.documentElement.classList.add('js');

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = themeButton?.querySelector('i');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const savedTheme = (() => {
    try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
  })();
  const setTheme = (theme) => {
    document.body.dataset.theme = theme;
    if (themeColor) themeColor.content = theme === 'dark' ? '#090d1b' : '#f3f2fa';
    if (themeButton) {
      const next = theme === 'dark' ? 'claro' : 'escuro';
      themeButton.setAttribute('aria-label', `Ativar tema ${next}`);
      themeButton.title = `Mudar para tema ${next}`;
      if (themeIcon) themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  };
  setTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try { localStorage.setItem('portfolio-theme', nextTheme); } catch { /* Storage can be disabled. */ }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const filters = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const filterStatus = document.querySelector('.filter-status');
  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    let visibleCount = 0;
    filters.forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach((card) => {
      const isVisible = category === 'all' || card.dataset.category === category;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (filterStatus) filterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'projeto apresentado' : 'projetos apresentados'}.`;
  }));

  const projects = {
    gtatrainer: { title: 'GTA V Enhanced Story Trainer', kicker: 'Plugin .asi · C++ · ScriptHookV', copy: 'Trainer nativo para o modo História offline do GTA V Enhanced. O menu abre com F7 e reúne opções para jogador, armas, veículos e mundo. As ações são bloqueadas quando o plugin deteta uma sessão online.', tags: ['C++', 'ScriptHookV', 'ASI plugin', 'GitHub Actions'], url: 'https://github.com/pedro-santos-dev-alt/GTA5-Enhanced-Story-Trainer' },
    saveeditor: { title: 'Construction Simulator 2022 Save Editor', kicker: 'Aplicação desktop · Ferramenta para jogos', copy: 'Editor local de saves que permite selecionar um perfil e gerir dinheiro pessoal, XP e saldo da empresa. Valida os valores antes de gravar, mantém dados espelhados da empresa sincronizados e cria cópias de segurança .bak.', tags: ['Save files', 'Perfis e XP', 'Validação', 'Backups .bak'], url: 'https://github.com/pedro-santos-dev-alt/Save-Game-Editor-Construction-Simulator.git' },
    stock: { title: 'Gestão de stock para loja de reparações', kicker: 'API REST · Node.js · PostgreSQL', copy: 'Projeto de backend para gerir stock, clientes e reparações numa loja de assistência técnica. A API foi construída com Node.js, Express e PostgreSQL. O repositório contém o código e os detalhes de implementação.', tags: ['Node.js', 'Express', 'PostgreSQL', 'API REST'], url: 'https://github.com/pedro-santos-dev-alt/gestao-stock-loja-reparacoes' },
    editor: { title: 'Editor de texto', kicker: 'Aplicação desktop · C#', copy: 'Editor com interface gráfica desenvolvido em C# e Windows Forms. Trabalha com expressões regulares e permite guardar documentos nos formatos TXT e RTF.', tags: ['C#', 'Windows Forms', 'Regex', 'TXT / RTF'], url: 'https://github.com/pedro-santos-dev-alt/POO-PJ-TXT-Editor' },
    benchmarks: { title: 'RTX Benchmarks', kicker: 'Desenvolvimento web', copy: 'Website académico dedicado à apresentação e comparação de placas gráficas e respetivos benchmarks. Consulta o repositório para ver o projeto completo.', tags: ['Web', 'Placas gráficas', 'Benchmarks'], url: 'https://github.com/pedro-santos-dev-alt/RTX-BENCHMARKS' },
    cproject: { title: 'Projeto C — IPB', kicker: 'Programação · C', copy: 'Projeto académico desenvolvido em C para aplicar lógica de programação e algoritmos no contexto do Instituto Politécnico de Bragança.', tags: ['C', 'Algoritmos', 'Projeto académico'], url: 'https://github.com/pedro-santos-dev-alt/C-Ipb-Project' },
    bar: { title: 'Website para um bar', kicker: 'Desenvolvimento web · Projeto académico', copy: 'Projeto de uma unidade curricular de desenvolvimento web, com foco no design de uma página de apresentação para um bar.', tags: ['HTML', 'CSS', 'Web design'], url: 'https://github.com/pedro-santos-dev-alt/Projeto-DWEBII' }
  };
  const dialog = document.querySelector('.project-dialog');
  if (dialog) {
    const closeButton = dialog.querySelector('.dialog-close');
    const tagContainer = dialog.querySelector('[data-dialog-tags]');
    document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => {
      const project = projects[button.dataset.project];
      if (!project) return;
      dialog.querySelector('[data-dialog-title]').textContent = project.title;
      dialog.querySelector('[data-dialog-kicker]').textContent = project.kicker;
      dialog.querySelector('[data-dialog-copy]').textContent = project.copy;
      dialog.querySelector('[data-dialog-link]').href = project.url;
      tagContainer.replaceChildren(...project.tags.map((tag) => {
        const element = document.createElement('span');
        element.textContent = tag;
        return element;
      }));
      dialog.showModal();
      closeButton.focus();
    }));
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
})();
