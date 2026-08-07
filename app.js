(function () {
  'use strict';

  const all = Array.isArray(window.CPP_INTERVIEW_QUESTIONS) ? window.CPP_INTERVIEW_QUESTIONS : [];
  const els = {
    list: document.getElementById('question-list'),
    search: document.getElementById('search-input'),
    scope: document.getElementById('scope-filter'),
    nav: document.getElementById('category-nav'),
    count: document.getElementById('result-count'),
    empty: document.getElementById('empty-state'),
    clear: document.getElementById('clear-filters'),
    drawer: document.getElementById('category-drawer'),
    menu: document.getElementById('menu-button'),
    close: document.getElementById('close-menu'),
    scrim: document.getElementById('scrim'),
    sentinel: document.getElementById('load-sentinel')
  };
  const mobile = window.matchMedia('(max-width: 760px)');
  const scopes = [...new Set(all.flatMap(question => question.scopes || []))].sort((a, b) => a.localeCompare(b));
  const groups = [
    { id: 'cpp', label: '标准 C++' },
    { id: 'gof', label: 'GoF 设计模式' },
    { id: 'ue5', label: 'UE5 C++' },
    { id: 'windows', label: 'Windows 用户态系统与网络' }
  ];
  const groupNames = Object.fromEntries(groups.map(group => [group.id, group.label]));
  const categoryLabels = {
    'cpp/core-language': '核心语言',
    'cpp/types-expressions-initialization': '类型、表达式与初始化',
    'cpp/classes-object-model': '类与对象模型',
    'cpp/lifetime-raii': '生命周期与 RAII',
    'cpp/smart-pointers-allocators': '智能指针与分配器',
    'cpp/value-categories-move-forwarding': '值类别与移动语义',
    'cpp/templates-sfinae-traits-constexpr': '模板、SFINAE 与 constexpr',
    'cpp/containers-iterators': '容器与迭代器',
    'cpp/lambdas-utility-types': 'Lambda 与实用类型',
    'cpp/exceptions-rtti': '异常与 RTTI',
    'cpp/standard-concurrency': '标准并发',
    'cpp/strings-time-files-streams': '字符串、时间、文件与流',
    'gof/creation': '创建型模式',
    'gof/structural': '结构型模式',
    'gof/behavioral': '行为型模式',
    'ue5/uobject-reflection-gc': 'UObject、反射与 GC',
    'ue5/actor-component-subsystem': 'Actor、Component 与 Subsystem',
    'ue5/delegate-interface-async': 'Delegate、接口与异步',
    'ue5/replication-rpc-serialization': '复制、RPC 与序列化',
    'ue5/modules-plugins-buildcs': '模块、插件与 Build.cs',
    'windows/process-thread-sync': '进程、线程与用户态同步',
    'windows/winsock-protocol-iocp': 'Winsock、协议与 IOCP',
    'windows/dll-files-mmap-unicode-handles': 'DLL、文件、映射、Unicode 与句柄'
  };
  const categories = [...new Set(all.map(question => question.category).filter(Boolean))];
  const categoryName = category => categoryLabels[category] || category.split('/').pop().replace(/-/g, ' / ');
  const categoryCounts = Object.fromEntries(categories.map(category => [category, all.filter(question => question.category === category).length]));
  const groupCounts = Object.fromEntries(groups.map(group => [group.id, all.filter(question => question.group === group.id).length]));
  const defaultGroup = groups[0] ? groups[0].id : '';
  let state = { query: '', scope: '', group: defaultGroup, category: '' };
  let filtered = [];
  let rendered = 0;
  const BATCH = 30;

  scopes.forEach(scope => {
    const option = document.createElement('option');
    option.value = scope;
    option.textContent = scope;
    els.scope.append(option);
  });
  addNavButton({ type: 'all', id: '', group: '', label: '全部题目', count: all.length });
  groups.forEach(group => {
    addNavButton({ type: 'group', id: group.id, group: group.id, label: group.label, count: groupCounts[group.id] });
    categories.filter(category => category.startsWith(group.id + '/')).forEach(category => {
      addNavButton({ type: 'category', id: category, group: group.id, label: categoryName(category), count: categoryCounts[category] });
    });
  });

  function addNavButton(item) {
    const button = document.createElement('button');
    const labelNode = document.createElement('span');
    const countNode = document.createElement('span');
    button.className = 'category-button category-' + item.type;
    button.type = 'button';
    button.dataset.category = item.type === 'category' ? item.id : '';
    button.dataset.group = item.group;
    button.setAttribute('aria-pressed', 'false');
    labelNode.textContent = item.label;
    countNode.className = 'count';
    countNode.textContent = String(item.count);
    button.append(labelNode, countNode);
    els.nav.append(button);
  }

  function apply() {
    const query = state.query.trim().toLowerCase();
    filtered = all.filter(question => (
      (!state.group || question.group === state.group) &&
      (!state.category || question.category === state.category) &&
      (!state.scope || (question.scopes || []).includes(state.scope)) &&
      (!query || [question.title, question.category, question.group, groupNames[question.group], question.answer || '', question.source || '', (question.scopes || []).join(' ')].join(' ').toLowerCase().includes(query))
    ));
    rendered = 0;
    els.list.textContent = '';
    els.empty.hidden = filtered.length > 0;
    els.count.textContent = filtered.length + ' 道题';
    els.clear.hidden = !(state.query || state.scope || state.group !== defaultGroup || state.category);
    els.search.value = state.query;
    els.scope.value = state.scope;
    document.querySelectorAll('.category-button').forEach(button => {
      const isAll = button.classList.contains('category-all');
      const isGroup = button.classList.contains('category-group');
      const active = isAll
        ? (!state.group && !state.category)
        : isGroup
          ? (state.group === button.dataset.group && !state.category)
          : state.category === button.dataset.category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    renderMore();
  }

  function renderMore() {
    const end = Math.min(rendered + BATCH, filtered.length);
    for (let index = rendered; index < end; index += 1) els.list.append(card(filtered[index]));
    rendered = end;
  }

  function card(question) {
    const article = document.createElement('article');
    const top = document.createElement('div');
    const id = document.createElement('span');
    const title = document.createElement('h2');
    const badges = document.createElement('div');
    const refs = document.createElement('div');
    const answer = document.createElement('p');
    const source = document.createElement('p');
    article.className = 'question';
    article.id = 'q-' + question.id;
    top.className = 'question-top';
    id.className = 'question-id';
    id.textContent = '#' + question.id;
    title.textContent = question.title;
    top.append(id, title);
    badges.className = 'badges';
    (question.scopes || []).forEach(scope => {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = scope;
      badges.append(badge);
    });
    answer.className = 'answer';
    source.className = 'answer-source';
    if (question.answer) {
      answer.textContent = '口述简答：' + question.answer;
      source.textContent = question.source || '';
    }
    refs.className = 'refs';
    (question.refs || []).forEach(reference => {
      const link = document.createElement('a');
      link.href = reference.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = reference.label || reference.url;
      refs.append(link);
    });
    article.append(top, badges);
    if (question.answer) article.append(answer, source);
    if ((question.refs || []).length > 0) article.append(refs);
    return article;
  }

  function parseHash() {
    const raw = location.hash.slice(1);
    const [anchor, params = ''] = raw.split('?');
    const values = new URLSearchParams(params);
    const target = /^q-\d+$/.test(anchor) ? anchor : '';
    if (anchor === 'filters') {
      const category = values.get('category') || '';
      const requestedGroup = values.get('group') || '';
      const group = category && category.includes('/') ? category.split('/')[0] : requestedGroup;
      state = { query: values.get('q') || '', scope: values.get('scope') || '', group, category };
    } else if (target) {
      const question = all.find(item => 'q-' + item.id === target);
      if (question) state = { query: '', group: question.group, category: question.category, scope: (question.scopes || [])[0] || '' };
    }
    return target;
  }

  function writeHash() {
    const params = new URLSearchParams();
    if (state.group) params.set('group', state.group);
    if (state.category) params.set('category', state.category);
    if (state.scope) params.set('scope', state.scope);
    if (state.query) params.set('q', state.query);
    const hash = '#' + (params.toString() ? 'filters?' + params : 'filters');
    try { history.replaceState(null, '', hash); } catch (error) { location.hash = hash; }
  }

  function revealTarget(target) {
    if (!target) return;
    const index = filtered.findIndex(question => 'q-' + question.id === target);
    if (index < 0) return;
    while (rendered <= index) renderMore();
    requestAnimationFrame(() => {
      const node = document.getElementById(target);
      if (node) node.scrollIntoView({ block: 'start' });
    });
  }

  function restoreHash() {
    const target = parseHash();
    apply();
    revealTarget(target);
  }

  function updateFilters() {
    apply();
    writeHash();
  }

  els.search.addEventListener('input', event => { state.query = event.target.value; updateFilters(); });
  els.scope.addEventListener('change', event => { state.scope = event.target.value; updateFilters(); });
  els.nav.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.classList.contains('category-all')) { state.group = ''; state.category = ''; }
    else if (button.classList.contains('category-group')) { state.group = button.dataset.group; state.category = ''; }
    else { state.group = button.dataset.group; state.category = button.dataset.category; }
    updateFilters();
    closeMenu();
  });
  els.clear.addEventListener('click', () => { state = { query: '', scope: '', group: defaultGroup, category: '' }; updateFilters(); });

  function openMenu() {
    if (!mobile.matches) return;
    els.drawer.classList.add('open');
    els.scrim.hidden = false;
    els.menu.setAttribute('aria-expanded', 'true');
    els.close.focus();
  }

  function closeMenu() {
    if (!mobile.matches || !els.drawer.classList.contains('open')) return;
    els.drawer.classList.remove('open');
    els.scrim.hidden = true;
    els.menu.setAttribute('aria-expanded', 'false');
    els.menu.focus();
  }

  els.menu.addEventListener('click', openMenu);
  els.close.addEventListener('click', closeMenu);
  els.scrim.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && mobile.matches && els.drawer.classList.contains('open')) closeMenu(); });
  mobile.addEventListener('change', () => {
    if (!mobile.matches) {
      els.drawer.classList.remove('open');
      els.scrim.hidden = true;
      els.menu.setAttribute('aria-expanded', 'false');
    }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) renderMore(); }), { rootMargin: '400px' }).observe(els.sentinel);
  } else {
    window.addEventListener('scroll', () => { if (innerHeight + scrollY > document.body.offsetHeight - 500) renderMore(); });
  }
  window.addEventListener('hashchange', restoreHash);
  restoreHash();
})();
