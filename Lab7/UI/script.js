'use strict';

(() => {
  const PROJECTS = [
    { name: 'Портал организации', departments: 'Отдел разработки и отдел сопровождения', status: 'Активный' },
    { name: 'Аналитика', departments: 'Отдел разработки и отдел анализа данных', status: 'Активный' },
    { name: 'Внутренние сервисы', departments: 'Отдел инфраструктуры и отдел разработки', status: 'Планирование' }
  ];


  const STORAGE_KEY = 'sakovich-lab7-data';
  const SESSION_KEY = 'sakovich-lab7-user';
  const TASK_FIELDS = ['id', 'description', 'createdAt', 'author', 'photoLink', 'project', 'assignee', 'deadline', 'plannedVolume', 'complexity', 'plannedHours', 'actualHours', 'status', 'points'];
  const REPORT_FIELDS = ['id', 'description', 'createdAt', 'author', 'photoLink', 'taskId', 'hours', 'overtimeHours', 'status', 'rating', 'reviewComment', 'score'];
  const TASK_STATES = ['Ожидает', 'В работе', 'Готово'];
  const COMPLEXITIES = ['Низкая', 'Средняя', 'Высокая'];
  const REPORT_STATES = ['Обработан', 'Оценён', 'На проверке'];
  const ROLES = ['Сотрудник', 'Начальник отдела', 'Администратор', 'Руководитель организации'];
  const PAGE_SIZE = 10;

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
  }

  function validDate(value) {
    return value instanceof Date && Number.isFinite(value.getTime());
  }

  function validDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
  }

  function nonEmpty(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function nonNegative(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
  }

  function cloneRecord(obj) {
    return { ...obj, createdAt: new Date(obj.createdAt.getTime()) };
  }

  function compareValues(left, right) {
    if (left instanceof Date) left = left.getTime();
    if (right instanceof Date) right = right.getTime();
    if (typeof left === 'number' && typeof right === 'number') return left - right;
    return String(left ?? '').localeCompare(String(right ?? ''), 'ru', { numeric: true, sensitivity: 'base' });
  }

  class Collection {
    constructor(records = []) {
      this._items = [];
      this.addAll(records);
    }

    _fields() {
      return ['id', 'description', 'createdAt', 'author', 'photoLink'];
    }

    _validAdditionalFields() {
      return true;
    }

    validateObj(obj) {
      if (!isObject(obj) || Object.keys(obj).some(key => !this._fields().includes(key))) return false;
      if (!nonEmpty(obj.id) || !nonEmpty(obj.author)) return false;
      if (!nonEmpty(obj.description) || obj.description.length >= 200) return false;
      if (!validDate(obj.createdAt)) return false;
      if (obj.photoLink !== undefined && (typeof obj.photoLink !== 'string' || (obj.photoLink && !/^https?:\/\/\S+$/i.test(obj.photoLink)))) return false;
      return this._validAdditionalFields(obj);
    }

    _matches(obj, filters) {
      for (const [key, wanted] of Object.entries(filters)) {
        if (wanted === undefined || wanted === null || wanted === '' || key === 'sortBy' || key === 'sortOrder') continue;
        if (key === 'query') {
          const text = `${obj.id} ${obj.description} ${obj.project || ''}`.toLocaleLowerCase('ru');
          if (!text.includes(String(wanted).toLocaleLowerCase('ru'))) return false;
        } else if (key === 'createdAtFrom' || key === 'createdAtTo') {
          const start = wanted instanceof Date ? wanted.getTime() : new Date(`${wanted}T00:00:00`).getTime();
          if (!Number.isFinite(start)) return false;
          if (key === 'createdAtFrom' && obj.createdAt.getTime() < start) return false;
          if (key === 'createdAtTo' && obj.createdAt.getTime() >= start + 86400000) return false;
        } else if (key === 'deadlineFrom' || key === 'deadlineTo') {
          if (typeof obj.deadline !== 'string') return false;
          if (key === 'deadlineFrom' && obj.deadline < wanted) return false;
          if (key === 'deadlineTo' && obj.deadline > wanted) return false;
        } else if (key === 'minPoints' || key === 'maxPoints') {
          if (typeof obj.points !== 'number') return false;
          if (key === 'minPoints' && obj.points < wanted) return false;
          if (key === 'maxPoints' && obj.points > wanted) return false;
        } else if (this._fields().includes(key)) {
          const actual = obj[key];
          if (actual instanceof Date) {
            if (wanted instanceof Date ? actual.getTime() !== wanted.getTime() : !actual.toISOString().startsWith(String(wanted))) return false;
          } else if (typeof actual === 'number') {
            if (actual !== wanted) return false;
          } else if (!String(actual ?? '').toLocaleLowerCase('ru').includes(String(wanted).toLocaleLowerCase('ru'))) return false;
        } else return false;
      }
      return true;
    }

    getObjs(skip = 0, top = 10, filterConfig = {}) {
      if (!Number.isSafeInteger(skip) || skip < 0 || !Number.isSafeInteger(top) || top < 0 || !isObject(filterConfig)) return [];
      const sortBy = filterConfig.sortBy ?? 'id';
      const sortOrder = filterConfig.sortOrder ?? 'asc';
      if (!this._fields().includes(sortBy) || !['asc', 'desc'].includes(sortOrder)) return [];
      const sign = sortOrder === 'desc' ? -1 : 1;
      return this._items.filter(item => this._matches(item, filterConfig))
        .sort((a, b) => sign * compareValues(a[sortBy], b[sortBy]) || compareValues(a.id, b.id))
        .slice(skip, skip + top).map(cloneRecord);
    }

    getObj(id) {
      const item = this._items.find(record => record.id === String(id));
      return item ? cloneRecord(item) : null;
    }

    addObj(obj) {
      if (!this.validateObj(obj) || this._items.some(item => item.id === obj.id)) return false;
      this._items.push(cloneRecord(obj));
      return true;
    }

    editObj(id, patch) {
      if (!isObject(patch) || !Object.keys(patch).length || Object.keys(patch).some(key => !this._fields().includes(key) || ['id', 'author', 'createdAt'].includes(key))) return false;
      const index = this._items.findIndex(item => item.id === String(id));
      if (index < 0) return false;
      const updated = { ...this._items[index], ...patch };
      if (!this.validateObj(updated)) return false;
      this._items[index] = cloneRecord(updated);
      return true;
    }

    removeObj(id) {
      const index = this._items.findIndex(item => item.id === String(id));
      if (index < 0) return false;
      this._items.splice(index, 1);
      return true;
    }

    addAll(objects) {
      if (!Array.isArray(objects)) return [];
      return objects.filter(item => this.addObj(item)).map(cloneRecord);
    }

    clear() {
      const length = this._items.length;
      this._items = [];
      return length;
    }

    renameUser(before, after) {
      const changes = [];
      for (const obj of this._items) {
        const modified = { ...obj };
        if (modified.author === before) modified.author = after;
        if (modified.assignee === before) modified.assignee = after;
        if (!this.validateObj(modified)) return false;
        changes.push(modified);
      }
      this._items = changes;
      return true;
    }
  }

  class TaskCollection extends Collection {
    _fields() {
      return TASK_FIELDS;
    }

    _validAdditionalFields(obj) {
      return nonEmpty(obj.project) && nonEmpty(obj.assignee) && validDay(obj.deadline) &&
        nonEmpty(obj.plannedVolume) && COMPLEXITIES.includes(obj.complexity) && TASK_STATES.includes(obj.status) &&
        nonNegative(obj.plannedHours) && obj.plannedHours > 0 && nonNegative(obj.actualHours) && nonNegative(obj.points);
    }
  }

  class ReportCollection extends Collection {
    _fields() {
      return REPORT_FIELDS;
    }

    _validAdditionalFields(obj) {
      return nonEmpty(obj.taskId) && nonNegative(obj.hours) && obj.hours > 0 &&
        nonNegative(obj.overtimeHours) && obj.overtimeHours <= obj.hours && REPORT_STATES.includes(obj.status) &&
        (obj.rating === undefined || obj.rating === null || [2, 3, 4, 5].includes(obj.rating)) &&
        (obj.reviewComment === undefined || typeof obj.reviewComment === 'string') &&
        (obj.score === undefined || nonNegative(obj.score));
    }
  }

  class PostList extends TaskCollection {
    constructor(initial) {
      super(initial);
      this._restored = false;
    }

    save(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks: this.getObjs(0, Number.MAX_SAFE_INTEGER), reports: data.reports, users: data.users }));
        return true;
      } catch (error) {
        return false;
      }
    }

    restore() {
      if (this._restored) return null;
      this._restored = true;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return null;
        const data = JSON.parse(raw);
        if (!data || data.version !== 1 || !Array.isArray(data.tasks) || !Array.isArray(data.reports) || !Array.isArray(data.users)) return null;
        const parsedTasks = data.tasks.map(obj => ({ ...obj, createdAt: new Date(obj.createdAt) }));
        const parsedReports = data.reports.map(obj => ({ ...obj, createdAt: new Date(obj.createdAt) }));
        const verifyTasks = new TaskCollection(parsedTasks);
        const verifyReports = new ReportCollection(parsedReports);
        if (verifyTasks._items.length !== parsedTasks.length || verifyReports._items.length !== parsedReports.length) return null;
        if (!data.users.every(validUser) || new Set(data.users.map(user => user.email.toLowerCase())).size !== data.users.length) return null;
        this.clear();
        this.addAll(parsedTasks);
        return { reports: parsedReports, users: data.users };
      } catch (error) {
        return null;
      }
    }
  }

  function validUser(user) {
    return isObject(user) && nonEmpty(user.name) && nonEmpty(user.position) && nonEmpty(user.department) &&
      typeof user.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
      ROLES.includes(user.role) && typeof user.passwordHash === 'string' && /^[a-f0-9]{64}$/.test(user.passwordHash);
  }

  function element(tag, className = '', value = null) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== null) node.textContent = String(value);
    return node;
  }

  function text(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = String(value);
  }

  function replace(selector, nodes, fallback = 'Записей нет') {
    const node = document.querySelector(selector);
    if (node) node.replaceChildren(...(nodes.length ? nodes : [element('p', 'empty-state', fallback)]));
  }

  function link(label, destination, className = 'text-link', action = '', id = '') {
    const node = element('a', className, label);
    node.href = destination;
    if (action) node.dataset.action = action;
    if (id) node.dataset.id = id;
    return node;
  }

  function formatDate(value) {
    const date = value instanceof Date ? value : new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  function localDate() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function parseForm(form) {
    return Object.fromEntries(new FormData(form));
  }

  function fillOptions(selector, values, label = '', selected = '') {
    const select = document.querySelector(selector);
    if (!select) return;
    const options = [];
    if (label) {
      const first = element('option', '', label);
      first.value = '';
      options.push(first);
    }
    values.forEach(value => {
      const item = element('option', '', value);
      item.value = value;
      options.push(item);
    });
    select.replaceChildren(...options);
    select.value = selected;
  }

  async function passwordHash(password) {
    const bytes = new TextEncoder().encode(password);
    const buffer = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(buffer), item => item.toString(16).padStart(2, '0')).join('');
  }

  const tasks = new PostList([]);
  const restored = tasks.restore();
  const reports = new ReportCollection(restored?.reports ?? []);
  let users = restored?.users ?? [];
  let currentUserName = null;
  try {
    const name = sessionStorage.getItem(SESSION_KEY);
    if (users.some(user => user.name === name)) currentUserName = name;
  } catch (error) {
    currentUserName = null;
  }

  const selection = {
    task: new URLSearchParams(location.search).get('task'),
    report: new URLSearchParams(location.search).get('report'),
    user: new URLSearchParams(location.search).get('user')
  };
  const state = {
    filters: { query: '', project: '', status: '', sort: 'id' },
    reportFilters: { query: '', status: '' },
    projectFilters: { query: '', status: '' },
    userFilters: { query: '', role: '', department: '' },
    period: '2026-11',
    visibleTasks: PAGE_SIZE,
    visibleReports: PAGE_SIZE,
    visibleUsers: PAGE_SIZE,
    assignedUser: ''
  };

  function user() {
    return users.find(item => item.name === currentUserName) ?? null;
  }

  function role() {
    return user()?.role ?? null;
  }

  function getVisibleTasks() {
    const current = user();
    if (!current) return [];
    const records = tasks.getObjs(0, Number.MAX_SAFE_INTEGER);
    if (current.role === 'Сотрудник') return records.filter(task => task.assignee === current.name);
    if (current.role === 'Начальник отдела') return records.filter(task => users.some(person => person.name === task.assignee && person.department === current.department));
    return records;
  }

  function getVisibleReports() {
    const current = user();
    if (!current) return [];
    const records = reports.getObjs(0, Number.MAX_SAFE_INTEGER);
    if (current.role === 'Сотрудник') return records.filter(report => report.author === current.name);
    if (current.role === 'Начальник отдела') return records.filter(report => users.some(person => person.name === report.author && person.department === current.department));
    if (current.role === 'Руководитель организации') return records;
    return [];
  }

  function canCreateTask() {
    return role() === 'Начальник отдела';
  }

  function canManageTask(task) {
    const current = user();
    return !!task && !!current && current.role === 'Начальник отдела' && task.author === current.name &&
      users.some(person => person.name === task.assignee && person.department === current.department);
  }

  function canCreateReport(task) {
    return role() === 'Сотрудник' && !!task && task.assignee === currentUserName && task.status !== 'Готово';
  }

  function canEditReport(report) {
    return role() === 'Сотрудник' && !!report && report.author === currentUserName;
  }

  function canEvaluate(report) {
    return role() === 'Начальник отдела' && !!report && users.some(person => person.name === report.author && person.department === user().department) && !!tasks.getObj(report.taskId);
  }

  function score(name) {
    return tasks.getObjs(0, Number.MAX_SAFE_INTEGER).filter(task => task.assignee === name).reduce((sum, task) => sum + task.points, 0);
  }

  function ranking() {
    const current = user();
    if (!current) return [];
    return users.filter(person => person.role === 'Сотрудник' && (['Администратор', 'Руководитель организации'].includes(current.role) || person.department === current.department))
      .map(person => ({ name: person.name, points: score(person.name) }))
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'ru'));
  }

  function persist() {
    if (!tasks.save({ reports: reports.getObjs(0, Number.MAX_SAFE_INTEGER), users })) throw new Error('Не удалось сохранить данные в браузере.');
    return true;
  }


  class View {
    render() {
      this._header();
      this._projects();
      this._taskLists();
      this._taskDetails();
      this._home();
      this._reports();
      this._analytics();
      this._team();
      this._users();
    }

    _header() {
      const current = user();
      const area = document.querySelector('#account-actions');
      if (current) {
        const name = element('span', 'current-user', `${current.name} · ${current.role}`);
        const logout = element('button', 'text-link', 'Выйти');
        logout.type = 'button';
        logout.dataset.action = 'logout';
        area.replaceChildren(name, logout);
      } else area.replaceChildren(link('Войти', '#login'));
      const allowed = {
        home: !!current,
        tasks: !!current,
        projects: !!current,
        reports: ['Сотрудник', 'Начальник отдела'].includes(role()),
        analytics: !!current,
        team: role() === 'Начальник отдела',
        users: role() === 'Администратор',
        flows: !!current
      };
      document.querySelectorAll('[data-menu]').forEach(node => { node.hidden = !allowed[node.dataset.menu]; });
      document.querySelector('#task-create-link').hidden = !canCreateTask();
      document.querySelector('#home-report-link').hidden = role() !== 'Сотрудник';
      document.querySelector('#report-create-link').hidden = role() !== 'Сотрудник';
      document.querySelector('#task-create-form').hidden = !canCreateTask();
      document.querySelector('#report-create-form').hidden = role() !== 'Сотрудник';
      document.querySelector('#user-create-form').hidden = role() !== 'Администратор';
      document.querySelectorAll('#team .page-heading > a').forEach(node => { node.hidden = role() !== 'Начальник отдела'; });
      const group = location.hash.replace('#', '') || 'home';
      const map = { 'task-detail': 'tasks', 'task-create': 'tasks', 'task-edit': 'tasks', 'task-delete': 'tasks', 'report-create': 'reports', 'report-edit': 'reports', 'report-delete': 'reports', evaluation: 'team', 'user-create': 'users', 'user-edit': 'users', 'user-delete': 'users' };
      const selected = map[group] || group;
      document.querySelectorAll('[data-menu]').forEach(node => { node.classList.toggle('is-active', node.dataset.menu === selected); });
    }

    _projects() {
      const filters = state.projectFilters;
      const query = filters.query.toLocaleLowerCase('ru');
      const visible = PROJECTS.filter(project =>
        (!query || `${project.name} ${project.departments}`.toLocaleLowerCase('ru').includes(query)) &&
        (!filters.status || project.status === filters.status));
      replace('#project-list', visible.map(project => {
        const row = element('article', 'record');
        const info = element('div');
        info.append(element('strong', '', project.name), element('p', '', project.departments));
        row.append(info, element('span', 'tag', project.status));
        return row;
      }));
      document.querySelector('#project-query').value = filters.query;
      fillOptions('#project-status-filter', [...new Set(PROJECTS.map(project => project.status))], 'Все состояния', filters.status);
      fillOptions('#task-project-filter', PROJECTS.map(project => project.name), 'Все проекты', state.filters.project);
      for (const selector of ['#new-task-project', '#edit-task-project']) {
        fillOptions(selector, PROJECTS.map(project => project.name), 'Выберите проект', selector === '#edit-task-project' ? tasks.getObj(selection.task)?.project || '' : '');
      }
      fillOptions('#task-status-filter', TASK_STATES, 'Все состояния', state.filters.status);
      for (const selector of ['#new-task-employee', '#edit-task-employee']) {
        const values = users.filter(person => person.role === 'Сотрудник' && (role() !== 'Начальник отдела' || person.department === user().department)).map(person => person.name);
        fillOptions(selector, values, 'Выберите сотрудника', selector === '#edit-task-employee' ? tasks.getObj(selection.task)?.assignee || '' : state.assignedUser);
      }
    }

    _taskRow(task, compact = false) {
      const row = element('article', compact ? 'record' : 'list-row');
      const info = element('div');
      info.append(link(`#${task.id} — ${task.description}`, '#task-detail', 'record-title', 'open-task', task.id), element('p', '', compact ? `${task.project} · ${formatDate(task.deadline)}` : `${task.project} · ${task.assignee}`));
      if (compact) {
        row.append(info, element('span', 'tag', task.status));
      } else {
        const date = element('time', '', formatDate(task.deadline));
        date.dateTime = task.deadline;
        const actions = element('div', 'row-actions');
        actions.append(link('Открыть', '#task-detail', 'text-link', 'open-task', task.id));
        if (canManageTask(task)) actions.append(link('Изменить', '#task-edit', 'text-link', 'edit-task', task.id));
        row.append(info, element('span', 'tag', task.status), date, actions);
      }
      return row;
    }

    _filteredTasks() {
      const filter = state.filters;
      const allowed = new Set(getVisibleTasks().map(task => task.id));
      const config = { query: filter.query, project: filter.project, status: filter.status, sortBy: filter.sort.startsWith('deadline') ? 'deadline' : 'id', sortOrder: filter.sort === 'deadline-desc' ? 'desc' : 'asc' };
      return tasks.getObjs(0, Number.MAX_SAFE_INTEGER, config).filter(task => allowed.has(task.id));
    }

    _taskLists() {
      const matched = this._filteredTasks();
      replace('#task-list', matched.slice(0, state.visibleTasks).map(task => this._taskRow(task)));
      text('#task-page-label', matched.length ? `Показано ${Math.min(state.visibleTasks, matched.length)} из ${matched.length}` : 'Найдено задач: 0');
      document.querySelector('#task-load-more').hidden = state.visibleTasks >= matched.length;
      document.querySelector('#task-query').value = state.filters.query;
      document.querySelector('#task-sort').value = state.filters.sort;
    }

    _taskDetails() {
      let task = tasks.getObj(selection.task);
      if (!task || !getVisibleTasks().some(value => value.id === task.id)) task = null;
      text('#task-detail-context', task ? `Задачи / Карточка #${task.id}` : 'Задачи / Карточка');
      text('#task-detail-title', task ? task.description : 'Задача не найдена');
      const items = task ? [
        ['Проект', task.project], ['Исполнитель', task.assignee], ['Постановщик', task.author],
        ['Состояние', task.status], ['Срок выполнения', formatDate(task.deadline)],
        ['Плановый объём', task.plannedVolume], ['Сложность', task.complexity],
        ['Плановое время', `${task.plannedHours} ч`], ['Фактическое время', `${task.actualHours} ч`],
        ['Баллы', task.points]
      ] : [];
      replace('#task-details', items.map(([label, value]) => {
        const box = element('div');
        box.append(element('dt', '', label), element('dd', '', value));
        return box;
      }), 'Задача не найдена');
      const history = task ? getVisibleReports().filter(report => report.taskId === task.id).sort((a, b) => b.createdAt - a.createdAt) : [];
      replace('#task-history', history.map(report => this._reportRow(report)));
      document.querySelector('#detail-edit-task').hidden = !canManageTask(task);
      document.querySelector('#detail-delete-task').hidden = !canManageTask(task);
      document.querySelector('#detail-create-report').hidden = !canCreateReport(task);
      document.querySelector('#task-edit-form').hidden = !canManageTask(task);
      document.querySelector('#task-delete-form').hidden = !canManageTask(task);
      text('#task-delete-label', task ? `Задача #${task.id} «${task.description}» и связанные отчёты будут удалены.` : 'Задача не найдена.');
      if (task) {
        const fields = {
          '#edit-task-name': task.description, '#edit-task-project': task.project,
          '#edit-task-employee': task.assignee, '#edit-task-deadline': task.deadline,
          '#edit-task-hours': task.plannedHours, '#edit-task-volume': task.plannedVolume,
          '#edit-task-complexity': task.complexity, '#edit-task-status': task.status
        };
        Object.entries(fields).forEach(([selector, value]) => { document.querySelector(selector).value = value; });
      }
    }

    _home() {
      const visible = getVisibleTasks();
      text('#home-context', role() === 'Сотрудник' ? 'Рабочее пространство сотрудника' : 'Обзор работы организации');
      text('#metric-total', visible.length);
      text('#metric-active', visible.filter(task => task.status === 'В работе').length);
      text('#metric-done', visible.filter(task => task.status === 'Готово').length);
      text('#metric-points', visible.reduce((sum, task) => sum + task.points, 0));
      const list = ranking();
      const rank = list.findIndex(item => item.name === currentUserName);
      text('#metric-rank', rank >= 0 ? `Место в отделе: ${rank + 1} из ${list.length}` : 'Баллы по задачам');
      const upcoming = visible.filter(task => task.status !== 'Готово').sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 3);
      replace('#home-task-list', upcoming.map(task => {
        const row = element('article', 'record');
        const info = element('div');
        info.append(link(task.description, '#task-detail', 'record-title', 'open-task', task.id), element('p', '', `Проект: ${task.project}`));
        const meta = element('div', 'record-right');
        meta.append(element('span', 'tag', task.status), element('small', '', formatDate(task.deadline)));
        row.append(info, meta);
        return row;
      }));
    }

    _reportRow(report) {
      const row = element('article', 'record');
      const task = tasks.getObj(report.taskId);
      const info = element('div');
      info.append(element('strong', '', `Отчёт #${report.id} — ${formatDate(report.createdAt)}`), element('p', '', `${task ? `Задача #${task.id}` : 'Задача удалена'} · ${report.description} · ${report.hours} ч`));
      const right = element('div', 'record-right');
      right.append(element('span', 'tag', report.status));
      if (canEditReport(report)) right.append(link('Изменить', '#report-edit', 'text-link', 'edit-report', report.id));
      if (canEvaluate(report)) right.append(link('Оценить', '#evaluation', 'text-link', 'evaluate-report', report.id));
      row.append(info, right);
      return row;
    }

    _reports() {
      const filters = state.reportFilters;
      const query = filters.query.toLocaleLowerCase('ru');
      const visible = getVisibleReports().filter(report => {
        const task = tasks.getObj(report.taskId);
        const content = `${report.id} ${report.taskId} ${report.description} ${report.author} ${task?.description ?? ''}`.toLocaleLowerCase('ru');
        return (!query || content.includes(query)) && (!filters.status || report.status === filters.status);
      }).sort((a, b) => b.createdAt - a.createdAt);
      document.querySelector('#report-query').value = filters.query;
      fillOptions('#report-status-filter', REPORT_STATES, 'Все состояния', filters.status);
      replace('#report-list', visible.slice(0, state.visibleReports).map(report => this._reportRow(report)));
      text('#report-page-label', visible.length ? `Показано ${Math.min(state.visibleReports, visible.length)} из ${visible.length}` : 'Отчётов нет');
      document.querySelector('#report-load-more').hidden = visible.length <= state.visibleReports;
      const selected = reports.getObj(selection.report);
      text('#report-edit-context', selected ? `Отчёты / Редактирование #${selected.id}` : 'Отчёты / Редактирование');
      const allowed = canEditReport(selected);
      document.querySelector('#report-edit-form').hidden = !allowed;
      document.querySelector('#report-delete-form').hidden = !allowed;
      text('#report-delete-label', selected ? `Отчёт #${selected.id} по задаче #${selected.taskId} будет удалён.` : 'Отчёт не найден.');
      if (selected && allowed) {
        document.querySelector('#report-edit-result').value = selected.description;
        document.querySelector('#report-edit-hours').value = selected.hours;
        document.querySelector('#report-edit-overtime').value = selected.overtimeHours;
      }
      const choices = getVisibleTasks().filter(canCreateReport);
      const selectedTask = choices.some(task => task.id === selection.task) ? selection.task : '';
      const options = document.querySelector('#report-task');
      options.replaceChildren();
      const initial = element('option', '', 'Выберите задачу');
      initial.value = '';
      options.append(initial);
      choices.forEach(task => {
        const option = element('option', '', `#${task.id} — ${task.description}`);
        option.value = task.id;
        options.append(option);
      });
      options.value = selectedTask;
      const list = selectedTask ? getVisibleReports().filter(report => report.taskId === selectedTask) : [];
      text('#report-create-history', list.length ? `Ранее по задаче: ${list.map(report => `${formatDate(report.createdAt)} — ${report.hours} ч`).join('; ')}` : '');
      if (!document.querySelector('#report-date').value) document.querySelector('#report-date').value = localDate();
    }

    _analytics() {
      document.querySelector('#period').value = state.period;
      const dateInPeriod = value => {
        const date = value instanceof Date ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}` : value.slice(0, 7);
        return state.period === 'all' || (state.period === '2026-Q4' ? date >= '2026-10' && date <= '2026-12' : date === state.period);
      };
      const visible = getVisibleTasks().filter(task => dateInPeriod(task.deadline));
      const allowedIds = new Set(getVisibleTasks().map(task => task.id));
      const seen = getVisibleReports().filter(report => allowedIds.has(report.taskId) && dateInPeriod(report.createdAt));
      const hours = seen.reduce((sum, report) => sum + report.hours, 0);
      const overtime = seen.reduce((sum, report) => sum + report.overtimeHours, 0);
      const planned = visible.reduce((sum, task) => sum + task.plannedHours, 0);
      const done = visible.filter(task => task.status === 'Готово').length;
      text('#analytic-hours', hours);
      text('#analytic-overtime', `Внеурочные: ${overtime} ч`);
      text('#analytic-done', done);
      text('#analytic-planned', `Плановые часы: ${planned}`);
      text('#analytic-points', visible.reduce((sum, task) => sum + task.points, 0));
      text('#hours-ratio', `${hours} / ${planned} ч`);
      text('#done-ratio', `${done} / ${visible.length}`);
      document.querySelector('#hours-progress').style.width = `${planned ? Math.min(100, hours / planned * 100) : 0}%`;
      document.querySelector('#done-progress').style.width = `${visible.length ? done / visible.length * 100 : 0}%`;
      const list = ranking();
      const rank = list.findIndex(item => item.name === currentUserName);
      text('#current-rank', rank >= 0 ? rank + 1 : '—');
      text('#rank-total', `${list.length} сотрудников`);
      replace('#rating-list', list.slice(0, 10).map((item, index) => {
        const row = element('div', 'record compact');
        row.append(element('span', '', `${index + 1}. ${item.name === currentUserName ? 'Вы' : item.name}`), element('strong', '', item.points));
        return row;
      }));
    }

    _team() {
      const staff = role() === 'Начальник отдела' ? users.filter(person => person.department === user().department && person.role === 'Сотрудник') : [];
      replace('#team-users', staff.map(person => {
        const row = element('article', 'record');
        const info = element('div');
        info.append(element('strong', '', person.name), element('p', '', `${person.position} · ${score(person.name)} баллов`));
        row.append(info, link('Назначить задачу', '#task-create', 'text-link', 'assign-task', person.name));
        return row;
      }));
      const pending = role() === 'Начальник отдела' ? getVisibleReports().filter(report => report.status !== 'Оценён') : [];
      replace('#team-reports', pending.map(report => this._reportRow(report)), 'Отчётов на проверку нет');
      const selected = reports.getObj(selection.report);
      text('#evaluation-description', selected ? `Отчёт #${selected.id}. ${selected.author}. Задача #${selected.taskId}.` : 'Отчёт не найден.');
      document.querySelector('#evaluation-form').hidden = !canEvaluate(selected);
      if (selected && canEvaluate(selected)) {
        document.querySelector('#evaluation-rating').value = selected.rating ?? '';
        document.querySelector('#evaluation-comment').value = selected.reviewComment || '';
      }
    }

    _users() {
      const filters = state.userFilters;
      const query = filters.query.toLocaleLowerCase('ru');
      const visible = role() === 'Администратор' ? users.filter(person =>
        (!query || `${person.name} ${person.email} ${person.position}`.toLocaleLowerCase('ru').includes(query)) &&
        (!filters.role || person.role === filters.role) &&
        (!filters.department || person.department === filters.department)) : [];
      document.querySelector('#user-query').value = filters.query;
      fillOptions('#user-role-filter', ROLES, 'Все роли', filters.role);
      fillOptions('#user-department-filter', [...new Set(users.map(person => person.department))].sort((a, b) => a.localeCompare(b, 'ru')), 'Все подразделения', filters.department);
      replace('#user-list', visible.slice(0, state.visibleUsers).map(person => {
        const row = element('article', 'list-row');
        const info = element('div');
        info.append(element('strong', '', person.name), element('p', '', person.email));
        const actions = element('div', 'row-actions');
        actions.append(link('Изменить', '#user-edit', 'text-link', 'edit-user', person.name));
        row.append(info, element('span', '', person.role), element('span', '', person.department), actions);
        return row;
      }));
      text('#user-page-label', `Показано ${Math.min(visible.length, state.visibleUsers)} из ${visible.length}`);
      document.querySelector('#user-load-more').hidden = state.visibleUsers >= visible.length;
      const selected = users.find(person => person.name === selection.user);
      document.querySelector('#user-edit-form').hidden = role() !== 'Администратор' || !selected;
      document.querySelector('#user-delete-form').hidden = role() !== 'Администратор' || !selected;
      text('#user-delete-label', selected ? `Учётная запись «${selected.name}» будет удалена.` : 'Учётная запись не найдена.');
      if (selected) {
        for (const [selector, value] of Object.entries({
          '#edit-user-name': selected.name, '#edit-user-email': selected.email,
          '#edit-user-role': selected.role, '#edit-user-dept': selected.department,
          '#edit-user-position': selected.position
        })) document.querySelector(selector).value = value;
        document.querySelector('#edit-user-password').value = '';
      }
    }
  }

  const view = new View();

  class Controller {
    constructor() {
      document.addEventListener('submit', event => this._submit(event));
      document.addEventListener('click', event => this._click(event));
      document.addEventListener('change', event => this._change(event));
      window.addEventListener('hashchange', () => this.route());
      this.route();
    }

    notice(message, error = false) {
      const node = document.querySelector('#notice');
      node.textContent = message;
      node.classList.toggle('is-error', error);
      node.hidden = !message;
    }

    navigate(hash) {
      if (location.hash !== hash) location.hash = hash;
      else this.route();
    }

    route() {
      const hash = location.hash.replace('#', '');
      const aliases = { 'tasks-search': '#tasks', 'tasks-active': '#tasks', 'tasks-sorted': '#tasks', 'tasks-page-2': '#tasks', 'reports-page-2': '#reports', 'users-page-2': '#users' };
      if (hash === 'tasks-active') state.filters.status = 'В работе';
      if (hash === 'tasks-sorted') state.filters.sort = 'deadline';
      if (hash === 'tasks-page-2') state.visibleTasks = 20;
      if (hash === 'reports-page-2') state.visibleReports = 20;
      if (hash === 'users-page-2') state.visibleUsers = 20;
      if (aliases[hash]) {
        this.navigate(aliases[hash]);
        return;
      }
      if (!user() && hash !== 'login') {
        this.navigate('#login');
        return;
      }
      if (user() && hash === 'login') {
        this.navigate('#home');
        return;
      }
      const selectedTask = tasks.getObj(selection.task);
      const selectedReport = reports.getObj(selection.report);
      const selectedUser = users.find(person => person.name === selection.user);
      const allowed = {
        team: role() === 'Начальник отдела', evaluation: canEvaluate(selectedReport),
        users: role() === 'Администратор', 'user-create': role() === 'Администратор',
        'user-edit': role() === 'Администратор' && !!selectedUser,
        'user-delete': role() === 'Администратор' && !!selectedUser,
        reports: ['Сотрудник', 'Начальник отдела'].includes(role()),
        'report-create': role() === 'Сотрудник', 'report-edit': canEditReport(selectedReport),
        'report-delete': canEditReport(selectedReport),
        'task-create': canCreateTask(),
        'task-detail': !!selectedTask && getVisibleTasks().some(task => task.id === selectedTask.id),
        'task-edit': canManageTask(selectedTask), 'task-delete': canManageTask(selectedTask)
      };
      if (hash && Object.hasOwn(allowed, hash) && !allowed[hash]) {
        const fallback = hash.startsWith('task-') ? '#tasks' :
          hash.startsWith('report-') ? '#reports' :
          hash.startsWith('user-') ? '#users' : hash === 'evaluation' ? '#team' : '#home';
        this.navigate(fallback);
        return;
      }
      const target = document.getElementById(hash);
      if (hash && (!target || !target.classList.contains('screen'))) {
        this.navigate('#home');
        return;
      }
      if (user() && !hash) {
        this.navigate('#home');
        return;
      }
      view.render();
      if (!restored) this.notice('Не удалось загрузить данные из localStorage. Проверьте разрешение на хранение данных в браузере.', true);
    }

    _click(event) {
      const node = event.target.closest('[data-action]');
      if (!node) return;
      const action = node.dataset.action;
      const id = node.dataset.id;
      if (!['open-task', 'edit-task', 'edit-report', 'evaluate-report', 'edit-user', 'assign-task', 'logout', 'more-tasks', 'more-reports', 'more-users', 'reset-filters', 'reset-report-filters', 'reset-project-filters', 'reset-user-filters'].includes(action)) return;
      event.preventDefault();
      if (action === 'logout') {
        currentUserName = null;
        selection.task = null;
        selection.report = null;
        selection.user = null;
        state.filters = { query: '', project: '', status: '', sort: 'id' };
        state.reportFilters = { query: '', status: '' };
        state.projectFilters = { query: '', status: '' };
        state.userFilters = { query: '', role: '', department: '' };
        state.assignedUser = '';
        try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { }
        this.notice('');
        this.navigate('#login');
        return;
      }
      const resets = {
        'reset-filters': ['filters', { query: '', project: '', status: '', sort: 'id' }, 'visibleTasks'],
        'reset-report-filters': ['reportFilters', { query: '', status: '' }, 'visibleReports'],
        'reset-project-filters': ['projectFilters', { query: '', status: '' }, null],
        'reset-user-filters': ['userFilters', { query: '', role: '', department: '' }, 'visibleUsers']
      };
      if (Object.hasOwn(resets, action)) {
        const [key, value, page] = resets[action];
        state[key] = value;
        if (page) state[page] = PAGE_SIZE;
        view.render();
        return;
      }
      if (action === 'more-tasks' || action === 'more-reports' || action === 'more-users') {
        const property = { 'more-tasks': 'visibleTasks', 'more-reports': 'visibleReports', 'more-users': 'visibleUsers' }[action];
        state[property] += PAGE_SIZE;
        view.render();
        return;
      }
      if (['open-task', 'edit-task'].includes(action)) {
        const task = tasks.getObj(id);
        if (!task || !getVisibleTasks().some(item => item.id === task.id) || (action === 'edit-task' && !canManageTask(task))) return;
        selection.task = id;
      }
      if (['edit-report', 'evaluate-report'].includes(action)) {
        const report = reports.getObj(id);
        if (!report || (action === 'edit-report' && !canEditReport(report)) || (action === 'evaluate-report' && !canEvaluate(report))) return;
        selection.report = id;
      }
      if (action === 'edit-user') {
        if (role() !== 'Администратор' || !users.some(person => person.name === id)) return;
        selection.user = id;
      }
      if (action === 'assign-task') {
        if (!canCreateTask()) return;
        state.assignedUser = id;
        this.navigate('#task-create');
        return;
      }
      view.render();
      this.navigate(node.getAttribute('href'));
    }

    _change(event) {
      if (event.target.id !== 'report-task') return;
      const taskId = event.target.value;
      const history = getVisibleReports().filter(report => report.taskId === taskId);
      text('#report-create-history', history.length ? `Ранее по задаче: ${history.map(report => `${formatDate(report.createdAt)} — ${report.hours} ч`).join('; ')}` : '');
    }

    async _submit(event) {
      const form = event.target;
      if (!form || !form.id) return;
      const handlers = {
        'login-form': () => this._login(form), 'tasks-filter-form': () => this._filters(form),
        'reports-filter-form': () => this._reportFilters(form), 'projects-filter-form': () => this._projectFilters(form),
        'users-filter-form': () => this._userFilters(form), 'analytics-form': () => this._period(form),
        'task-create-form': () => this._createTask(form), 'task-edit-form': () => this._editTask(form), 'task-delete-form': () => this._deleteTask(),
        'report-create-form': () => this._createReport(form), 'report-edit-form': () => this._editReport(form), 'report-delete-form': () => this._deleteReport(),
        'evaluation-form': () => this._evaluate(form), 'user-create-form': () => this._createUser(form), 'user-edit-form': () => this._editUser(form), 'user-delete-form': () => this._deleteUser()
      };
      if (!handlers[form.id]) return;
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        await handlers[form.id]();
      } catch (error) {
        this.notice(error.message || 'Не удалось выполнить действие', true);
      }
    }

    async _login(form) {
      const data = parseForm(form);
      const error = document.querySelector('#login-error');
      const person = users.find(item => item.email.toLowerCase() === data.email.toLowerCase().trim());
      if (!person || person.passwordHash !== await passwordHash(data.password)) {
        error.textContent = 'Неверная электронная почта или пароль.';
        error.hidden = false;
        return;
      }
      error.hidden = true;
      currentUserName = person.name;
      try { sessionStorage.setItem(SESSION_KEY, currentUserName); } catch (error) { }
      form.reset();
      this.notice('');
      this.navigate('#home');
    }

    _filters(form) {
      const data = parseForm(form);
      state.filters = { query: data.query.trim(), project: data.project, status: data.status, sort: data.sort };
      state.visibleTasks = PAGE_SIZE;
      view.render();
      this.navigate('#tasks');
    }

    _reportFilters(form) {
      const data = parseForm(form);
      state.reportFilters = { query: data.query.trim(), status: data.status };
      state.visibleReports = PAGE_SIZE;
      view.render();
      this.navigate('#reports');
    }

    _projectFilters(form) {
      const data = parseForm(form);
      state.projectFilters = { query: data.query.trim(), status: data.status };
      view.render();
      this.navigate('#projects');
    }

    _userFilters(form) {
      const data = parseForm(form);
      state.userFilters = { query: data.query.trim(), role: data.role, department: data.department };
      state.visibleUsers = PAGE_SIZE;
      view.render();
      this.navigate('#users');
    }

    _period(form) {
      state.period = parseForm(form).period;
      view.render();
      this.navigate('#analytics');
    }

    _createTask(form) {
      if (!canCreateTask()) throw new Error('Недостаточно прав для создания задачи.');
      const fields = parseForm(form);
      const employee = users.find(person => person.name === fields.assignee && person.department === user().department && person.role === 'Сотрудник');
      if (!employee || !PROJECTS.some(project => project.name === fields.project)) throw new Error('Проверьте проект и исполнителя.');
      const obj = {
        id: String(Math.max(100, ...tasks.getObjs(0, Number.MAX_SAFE_INTEGER).map(item => Number(item.id) || 0)) + 1),
        description: fields.description.trim(), createdAt: new Date(), author: currentUserName,
        project: fields.project, assignee: fields.assignee, deadline: fields.deadline,
        plannedVolume: fields.plannedVolume.trim(), complexity: fields.complexity,
        plannedHours: Number(fields.plannedHours), actualHours: 0, status: 'Ожидает', points: 0
      };
      if (!tasks.addObj(obj)) throw new Error('Не удалось добавить задачу. Проверьте заполненные поля.');
      persist();
      selection.task = obj.id;
      state.visibleTasks = PAGE_SIZE;
      state.assignedUser = '';
      form.reset();
      this.notice(`Задача #${obj.id} создана.`);
      this.navigate('#task-detail');
    }

    _editTask(form) {
      const obj = tasks.getObj(selection.task);
      if (!canManageTask(obj)) throw new Error('Недостаточно прав для изменения задачи.');
      const data = parseForm(form);
      const employee = users.find(person => person.name === data.assignee && person.department === user().department && person.role === 'Сотрудник');
      if (!employee || !PROJECTS.some(project => project.name === data.project)) throw new Error('Проверьте проект и исполнителя.');
      if (obj.assignee !== data.assignee && reports.getObjs(0, Number.MAX_SAFE_INTEGER, { taskId: obj.id }).length) throw new Error('Нельзя изменить исполнителя задачи, по которой уже поданы отчёты.');
      const patch = {
        description: data.description.trim(), project: data.project, assignee: data.assignee,
        deadline: data.deadline, plannedVolume: data.plannedVolume.trim(),
        plannedHours: Number(data.plannedHours), complexity: data.complexity, status: data.status
      };
      if (!tasks.editObj(obj.id, patch)) throw new Error('Не удалось сохранить изменения.');
      persist();
      this.notice(`Задача #${obj.id} обновлена.`);
      this.navigate('#task-detail');
    }

    _deleteTask() {
      const task = tasks.getObj(selection.task);
      if (!canManageTask(task)) throw new Error('Недостаточно прав для удаления задачи.');
      tasks.removeObj(task.id);
      reports.getObjs(0, Number.MAX_SAFE_INTEGER, { taskId: task.id }).forEach(report => reports.removeObj(report.id));
      selection.task = null;
      persist();
      this.notice(`Задача #${task.id} удалена.`);
      this.navigate('#tasks');
    }

    _createReport(form) {
      if (role() !== 'Сотрудник') throw new Error('Недостаточно прав для подачи отчёта.');
      const data = parseForm(form);
      const task = tasks.getObj(data.taskId);
      if (!canCreateReport(task)) throw new Error('Выберите свою действующую задачу.');
      if (!validDay(data.createdAt)) throw new Error('Укажите корректную дату.');
      const item = {
        id: String(Math.max(0, ...reports.getObjs(0, Number.MAX_SAFE_INTEGER).map(report => Number(report.id) || 0)) + 1),
        description: data.description.trim(), createdAt: new Date(`${data.createdAt}T12:00:00`),
        author: currentUserName, taskId: task.id, hours: Number(data.hours),
        overtimeHours: Number(data.overtimeHours), status: 'Обработан'
      };
      if (!reports.addObj(item)) throw new Error('Проверьте описание и количество часов.');
      tasks.editObj(task.id, { actualHours: task.actualHours + item.hours });
      persist();
      selection.report = item.id;
      selection.task = task.id;
      form.reset();
      this.notice(`Отчёт #${item.id} сохранён.`);
      this.navigate('#reports');
    }

    _editReport(form) {
      const record = reports.getObj(selection.report);
      if (!canEditReport(record)) throw new Error('Недостаточно прав для изменения отчёта.');
      const data = parseForm(form);
      const patch = {
        description: data.description.trim(), hours: Number(data.hours), overtimeHours: Number(data.overtimeHours),
        status: 'Обработан', rating: null, reviewComment: '', score: 0
      };
      if (!reports.editObj(record.id, patch)) throw new Error('Проверьте введённые данные.');
      const task = tasks.getObj(record.taskId);
      if (task) tasks.editObj(task.id, { actualHours: Math.max(0, task.actualHours + patch.hours - record.hours), points: Math.max(0, task.points - (record.score || 0)) });
      persist();
      this.notice(`Отчёт #${record.id} обновлён.`);
      this.navigate('#reports');
    }

    _deleteReport() {
      const report = reports.getObj(selection.report);
      if (!canEditReport(report)) throw new Error('Недостаточно прав для удаления отчёта.');
      reports.removeObj(report.id);
      const task = tasks.getObj(report.taskId);
      if (task) tasks.editObj(task.id, { actualHours: Math.max(0, task.actualHours - report.hours), points: Math.max(0, task.points - (report.score || 0)) });
      selection.report = null;
      persist();
      this.notice(`Отчёт #${report.id} удалён.`);
      this.navigate('#reports');
    }

    _evaluate(form) {
      const report = reports.getObj(selection.report);
      if (!canEvaluate(report)) throw new Error('Недостаточно прав для оценки отчёта.');
      const data = parseForm(form);
      const rating = Number(data.rating);
      if (![2, 3, 4, 5].includes(rating)) throw new Error('Выберите оценку.');
      const task = tasks.getObj(report.taskId);
      const weight = { 'Низкая': 1, 'Средняя': 1.5, 'Высокая': 2 }[task.complexity];
      const newScore = Math.round(rating * weight * 20 * Math.min(1, report.hours / task.plannedHours));
      if (!reports.editObj(report.id, { status: 'Оценён', rating, reviewComment: data.reviewComment.trim(), score: newScore })) throw new Error('Не удалось сохранить оценку.');
      tasks.editObj(task.id, { points: Math.max(0, task.points + newScore - (report.score || 0)) });
      persist();
      this.notice(`Отчёт #${report.id} оценён.`);
      this.navigate('#team');
    }

    async _createUser(form) {
      if (role() !== 'Администратор') throw new Error('Недостаточно прав.');
      const data = parseForm(form);
      const person = {
        name: data.name.trim(), email: data.email.trim().toLowerCase(), role: data.role,
        department: data.department, position: data.position.trim(), passwordHash: await passwordHash(data.password)
      };
      if (!validUser(person) || users.some(item => item.name.toLowerCase() === person.name.toLowerCase() || item.email.toLowerCase() === person.email)) throw new Error('Проверьте данные: имя и почта должны быть уникальными.');
      if (person.role === 'Начальник отдела' && users.some(item => item.role === 'Начальник отдела' && item.department === person.department)) throw new Error('В подразделении уже назначен начальник отдела.');
      users.push(person);
      persist();
      form.reset();
      this.notice(`Пользователь «${person.name}» добавлен.`);
      this.navigate('#users');
    }

    async _editUser(form) {
      if (role() !== 'Администратор') throw new Error('Недостаточно прав.');
      const old = users.find(person => person.name === selection.user);
      if (!old) throw new Error('Пользователь не найден.');
      const data = parseForm(form);
      const person = { ...old, name: data.name.trim(), email: data.email.trim().toLowerCase(), role: data.role, department: data.department, position: data.position.trim() };
      if (data.password) person.passwordHash = await passwordHash(data.password);
      if (!validUser(person) || users.some(item => item !== old && (item.name.toLowerCase() === person.name.toLowerCase() || item.email.toLowerCase() === person.email))) throw new Error('Проверьте данные: имя и почта должны быть уникальными.');
      if (person.role === 'Начальник отдела' && users.some(item => item !== old && item.role === 'Начальник отдела' && item.department === person.department)) throw new Error('В подразделении уже назначен начальник отдела.');
      if (old.role === 'Начальник отдела' && (person.role !== old.role || person.department !== old.department)) throw new Error('Сначала назначьте другого начальника отдела.');
      if (old.role === 'Сотрудник' && old.department !== person.department && tasks.getObjs(0, Number.MAX_SAFE_INTEGER, { assignee: old.name }).length) throw new Error('Сначала переназначьте задачи сотрудника.');
      if (old.name !== person.name) {
        tasks.renameUser(old.name, person.name);
        reports.renameUser(old.name, person.name);
        if (currentUserName === old.name) {
          currentUserName = person.name;
          try { sessionStorage.setItem(SESSION_KEY, person.name); } catch (error) { }
        }
      }
      users = users.map(item => item === old ? person : item);
      selection.user = person.name;
      persist();
      this.notice(`Данные пользователя «${person.name}» сохранены.`);
      this.navigate('#users');
    }

    _deleteUser() {
      if (role() !== 'Администратор') throw new Error('Недостаточно прав.');
      const person = users.find(item => item.name === selection.user);
      if (!person) throw new Error('Пользователь не найден.');
      if (person.name === currentUserName) throw new Error('Нельзя удалить собственную учётную запись.');
      if (person.role === 'Начальник отдела') throw new Error('Нельзя удалить действующего начальника отдела.');
      if (tasks.getObjs(0, Number.MAX_SAFE_INTEGER).some(task => task.assignee === person.name || task.author === person.name) || reports.getObjs(0, Number.MAX_SAFE_INTEGER).some(report => report.author === person.name)) throw new Error('Нельзя удалить пользователя, связанного с задачами или отчётами.');
      users = users.filter(item => item !== person);
      selection.user = null;
      persist();
      this.notice(`Пользователь «${person.name}» удалён.`);
      this.navigate('#users');
    }
  }

  function start() {
    new Controller();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
