'use strict';

(() => {
  let currentUser = 'Иван Петров';

  const ObjInf = [
    { id: "101", description: "Настроить окружение разработки", createdAt: new Date('2026-10-01T09:00:00'), author: "Анна Смирнова", project: "Внутренние сервисы", assignee: "Иван Петров", deadline: "2026-11-03", plannedVolume: "Настроенные инструменты и доступ к репозиториям", complexity: "Низкая", plannedHours: 8, actualHours: 8, status: "Готово", points: 100 },
    { id: "102", description: "Подготовить схему прав доступа", createdAt: new Date('2026-10-02T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-05", plannedVolume: "Таблица ролей и разрешений", complexity: "Средняя", plannedHours: 10, actualHours: 6, status: "Готово", points: 80 },
    { id: "103", description: "Проверить структуру базы данных", createdAt: new Date('2026-10-03T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Иван Петров", deadline: "2026-11-07", plannedVolume: "Схема сущностей и связей", complexity: "Средняя", plannedHours: 12, actualHours: 8, status: "Готово", points: 90 },
    { id: "104", description: "Подготовить техническое описание API", createdAt: new Date('2026-10-04T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-12", plannedVolume: "Описание 8 методов API", complexity: "Средняя", plannedHours: 16, actualHours: 9, status: "В работе", points: 120 },
    { id: "105", description: "Проверить отчётный модуль", createdAt: new Date('2026-10-05T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Иван Петров", deadline: "2026-11-15", plannedVolume: "Проверка корректности отчётов", complexity: "Высокая", plannedHours: 12, actualHours: 2, status: "В работе", points: 0 },
    { id: "106", description: "Обновить документацию", createdAt: new Date('2026-10-06T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-19", plannedVolume: "Актуализация разделов справки", complexity: "Низкая", plannedHours: 6, actualHours: 0, status: "Ожидает", points: 0 },
    { id: "107", description: "Подготовить тестовые сценарии", createdAt: new Date('2026-10-07T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-22", plannedVolume: "10 сценариев интеграционного тестирования", complexity: "Средняя", plannedHours: 10, actualHours: 0, status: "Ожидает", points: 0 },
    { id: "108", description: "Проверить права доступа", createdAt: new Date('2026-10-08T09:00:00'), author: "Анна Смирнова", project: "Внутренние сервисы", assignee: "Иван Петров", deadline: "2026-11-24", plannedVolume: "Матрица проверенных полномочий", complexity: "Высокая", plannedHours: 14, actualHours: 3, status: "В работе", points: 0 },
    { id: "109", description: "Реализовать таблицу показателей", createdAt: new Date('2026-10-09T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Мария Соколова", deadline: "2026-11-07", plannedVolume: "Таблица показателей по отделам", complexity: "Высокая", plannedHours: 18, actualHours: 17, status: "Готово", points: 220 },
    { id: "110", description: "Оптимизировать обработку запросов", createdAt: new Date('2026-10-10T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-09", plannedVolume: "Ускорение основных запросов", complexity: "Высокая", plannedHours: 14, actualHours: 12, status: "Готово", points: 120 },
    { id: "111", description: "Настроить экспорт аналитики", createdAt: new Date('2026-10-11T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Мария Соколова", deadline: "2026-11-10", plannedVolume: "Экспорт данных в CSV", complexity: "Высокая", plannedHours: 16, actualHours: 14, status: "Готово", points: 210 },
    { id: "112", description: "Добавить проверку полей формы", createdAt: new Date('2026-10-12T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-11", plannedVolume: "Проверка обязательных полей", complexity: "Средняя", plannedHours: 8, actualHours: 7, status: "Готово", points: 110 },
    { id: "113", description: "Подготовить график нагрузки", createdAt: new Date('2026-10-13T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Мария Соколова", deadline: "2026-11-14", plannedVolume: "График нагрузки по дням", complexity: "Средняя", plannedHours: 12, actualHours: 11, status: "Готово", points: 190 },
    { id: "114", description: "Настроить журнал изменений", createdAt: new Date('2026-10-14T09:00:00'), author: "Анна Смирнова", project: "Внутренние сервисы", assignee: "Иван Петров", deadline: "2026-11-13", plannedVolume: "Журнал действий сотрудников", complexity: "Средняя", plannedHours: 9, actualHours: 8, status: "Готово", points: 110 },
    { id: "115", description: "Проверить сводные показатели", createdAt: new Date('2026-10-15T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Мария Соколова", deadline: "2026-11-18", plannedVolume: "Проверка расчётов за период", complexity: "Средняя", plannedHours: 12, actualHours: 11, status: "Готово", points: 180 },
    { id: "116", description: "Разработать шаблоны уведомлений", createdAt: new Date('2026-10-16T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-15", plannedVolume: "Шаблоны уведомлений о задачах", complexity: "Низкая", plannedHours: 9, actualHours: 8, status: "Готово", points: 110 },
    { id: "117", description: "Подготовить статистику проектов", createdAt: new Date('2026-10-17T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Мария Соколова", deadline: "2026-11-26", plannedVolume: "Статистика выполнения проектов", complexity: "Средняя", plannedHours: 14, actualHours: 6, status: "В работе", points: 100 },
    { id: "118", description: "Провести проверку интерфейса", createdAt: new Date('2026-10-18T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-11-28", plannedVolume: "Проверка основных пользовательских сценариев", complexity: "Низкая", plannedHours: 7, actualHours: 2, status: "В работе", points: 0 },
    { id: "119", description: "Реализовать резервное копирование", createdAt: new Date('2026-10-19T09:00:00'), author: "Анна Смирнова", project: "Внутренние сервисы", assignee: "Алексей Морозов", deadline: "2026-11-04", plannedVolume: "Настроенное резервное копирование данных", complexity: "Высокая", plannedHours: 18, actualHours: 17, status: "Готово", points: 270 },
    { id: "120", description: "Обновить список ошибок API", createdAt: new Date('2026-10-20T09:00:00'), author: "Анна Смирнова", project: "Портал организации", assignee: "Иван Петров", deadline: "2026-12-02", plannedVolume: "Перечень кодов ошибок и сообщений", complexity: "Низкая", plannedHours: 5, actualHours: 0, status: "Ожидает", points: 0 },
    { id: "121", description: "Проверить восстановление данных", createdAt: new Date('2026-10-21T09:00:00'), author: "Анна Смирнова", project: "Внутренние сервисы", assignee: "Алексей Морозов", deadline: "2026-11-08", plannedVolume: "Проверка восстановления из копий", complexity: "Высокая", plannedHours: 16, actualHours: 14, status: "Готово", points: 240 },
    { id: "122", description: "Проверить интеграцию отчётов", createdAt: new Date('2026-10-22T09:00:00'), author: "Анна Смирнова", project: "Аналитика", assignee: "Иван Петров", deadline: "2026-12-05", plannedVolume: "Проверка связей задач и отчётов", complexity: "Средняя", plannedHours: 11, actualHours: 0, status: "Ожидает", points: 0 },
    { id: "123", description: "Настроить мониторинг сервера", createdAt: new Date('2026-10-23T09:00:00'), author: "Анна Смирнова", project: "Внутренние сервисы", assignee: "Алексей Морозов", deadline: "2026-11-12", plannedVolume: "Панель состояния сервера", complexity: "Высокая", plannedHours: 16, actualHours: 15, status: "Готово", points: 260 },
    { id: "124", description: "Подготовить инструкцию администратора", createdAt: new Date('2026-10-24T09:00:00'), author: "Анна Смирнова", project: "Внутренние сервисы", assignee: "Алексей Морозов", deadline: "2026-11-16", plannedVolume: "Инструкция по учётным записям", complexity: "Средняя", plannedHours: 10, actualHours: 9, status: "Готово", points: 200 },
  ];

  const REPORTS = [
    { id: "12", description: "Подготовлено окружение разработки", createdAt: new Date('2026-10-28T12:00:00'), author: "Иван Петров", taskId: "101", hours: 8, overtimeHours: 0, status: "Оценён" },
    { id: "19", description: "Согласованы роли и права доступа", createdAt: new Date('2026-11-03T12:00:00'), author: "Иван Петров", taskId: "102", hours: 6, overtimeHours: 0, status: "Оценён" },
    { id: "21", description: "Описаны базовые методы и структура ответов", createdAt: new Date('2026-11-04T12:00:00'), author: "Иван Петров", taskId: "104", hours: 5, overtimeHours: 0, status: "Обработан" },
    { id: "25", description: "Добавлены примеры запросов и описаны коды ошибок", createdAt: new Date('2026-11-06T12:00:00'), author: "Иван Петров", taskId: "104", hours: 4, overtimeHours: 0, status: "Обработан" },
    { id: "27", description: "Проверены основные сценарии отчётности", createdAt: new Date('2026-11-10T12:00:00'), author: "Иван Петров", taskId: "105", hours: 2, overtimeHours: 0, status: "Обработан" },
    { id: "28", description: "Оптимизированы запросы к порталу", createdAt: new Date('2026-11-11T12:00:00'), author: "Иван Петров", taskId: "110", hours: 7, overtimeHours: 1, status: "Обработан" },
    { id: "29", description: "Проверены показатели по отделам", createdAt: new Date('2026-11-12T12:00:00'), author: "Мария Соколова", taskId: "109", hours: 3, overtimeHours: 0, status: "Оценён" },
    { id: "30", description: "Проверено резервное копирование", createdAt: new Date('2026-11-13T12:00:00'), author: "Алексей Морозов", taskId: "119", hours: 6, overtimeHours: 1, status: "Оценён" },
  ];

  const PROJECTS = [
    { name: 'Портал организации', departments: 'Отдел разработки и отдел сопровождения', status: 'Активный' },
    { name: 'Аналитика', departments: 'Отдел разработки и отдел анализа данных', status: 'Активный' },
    { name: 'Внутренние сервисы', departments: 'Отдел инфраструктуры и отдел разработки', status: 'Планирование' }
  ];

  const USERS = [
    { name: 'Иван Петров', role: 'Сотрудник', department: 'Разработка', position: 'Разработчик', email: 'i.petrov@example.org' },
    { name: 'Анна Смирнова', role: 'Начальник отдела', department: 'Разработка', position: 'Начальник отдела', email: 'a.smirnova@example.org' },
    { name: 'Мария Соколова', role: 'Сотрудник', department: 'Разработка', position: 'Разработчик', email: 'm.sokolova@example.org' },
    { name: 'Алексей Морозов', role: 'Сотрудник', department: 'Разработка', position: 'Инженер', email: 'a.morozov@example.org' },
    { name: 'Елена Ковалева', role: 'Сотрудник', department: 'Разработка', position: 'Аналитик', email: 'e.kovaleva@example.org' },
    { name: 'Ольга Кузнецова', role: 'Администратор', department: 'Инфраструктура', position: 'Администратор', email: 'o.kuznetsova@example.org' },
    { name: 'Сергей Орлов', role: 'Руководитель организации', department: 'Управление', position: 'Директор', email: 's.orlov@example.org' }
  ];

  const TASK_FIELDS = [
    'id', 'description', 'createdAt', 'author', 'photoLink', 'project', 'assignee',
    'deadline', 'plannedVolume', 'complexity', 'plannedHours', 'actualHours',
    'status', 'points'
  ];
  const REPORT_FIELDS = [
    'id', 'description', 'createdAt', 'author', 'photoLink', 'taskId',
    'hours', 'overtimeHours', 'status'
  ];
  const TASK_STATES = ['Ожидает', 'В работе', 'Готово'];
  const COMPLEXITIES = ['Низкая', 'Средняя', 'Высокая'];
  const REPORT_STATES = ['Обработан', 'Оценён', 'На проверке'];

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

  function copyObj(obj) {
    return { ...obj, createdAt: new Date(obj.createdAt.getTime()) };
  }

  function compareValues(left, right) {
    if (left instanceof Date) left = left.getTime();
    if (right instanceof Date) right = right.getTime();
    if (typeof left === 'number' && typeof right === 'number') return left - right;
    return String(left ?? '').localeCompare(String(right ?? ''), 'ru', { numeric: true, sensitivity: 'base' });
  }

  class Collection {
    constructor(objects = []) {
      this._items = [];
      this.addAll(objects);
    }

    _fields() {
      return ['id', 'description', 'createdAt', 'author', 'photoLink'];
    }

    _validAdditionalFields(_obj) {
      return true;
    }

    validateObj(obj) {
      if (!isObject(obj) || !Object.keys(obj).every(key => this._fields().includes(key))) return false;
      if (!nonEmpty(obj.id) || !nonEmpty(obj.author)) return false;
      if (!nonEmpty(obj.description) || obj.description.length >= 200) return false;
      if (!validDate(obj.createdAt)) return false;
      if (obj.photoLink !== undefined) {
        if (typeof obj.photoLink !== 'string') return false;
        if (obj.photoLink && !/^https?:\/\/\S+$/i.test(obj.photoLink)) return false;
      }
      return this._validAdditionalFields(obj);
    }

    _matches(obj, filters) {
      for (const [key, wanted] of Object.entries(filters)) {
        if (wanted === undefined || wanted === null || wanted === '') continue;
        if (key === 'sortBy' || key === 'sortOrder') continue;
        if (key === 'query') {
          const text = `${obj.id} ${obj.description} ${obj.project || ''}`.toLocaleLowerCase('ru');
          if (!text.includes(String(wanted).toLocaleLowerCase('ru'))) return false;
        } else if (key === 'createdAtFrom' || key === 'createdAtTo') {
          const boundary = wanted instanceof Date ? wanted.getTime() : new Date(`${wanted}T00:00:00`).getTime();
          if (!Number.isFinite(boundary)) return false;
          if (key === 'createdAtFrom' && obj.createdAt.getTime() < boundary) return false;
          if (key === 'createdAtTo' && obj.createdAt.getTime() >= boundary + 86400000) return false;
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
            if (wanted instanceof Date) {
              if (actual.getTime() !== wanted.getTime()) return false;
            } else if (!actual.toISOString().startsWith(String(wanted))) return false;
          } else if (typeof actual === 'number') {
            if (actual !== wanted) return false;
          } else if (!String(actual ?? '').toLocaleLowerCase('ru').includes(String(wanted).toLocaleLowerCase('ru'))) {
            return false;
          }
        } else {
          return false;
        }
      }
      return true;
    }

    getObjs(skip = 0, top = 10, filterConfig = {}) {
      if (!Number.isSafeInteger(skip) || skip < 0 || !Number.isSafeInteger(top) || top < 0 || !isObject(filterConfig)) {
        return [];
      }
      const sortBy = filterConfig.sortBy ?? 'id';
      const sortOrder = filterConfig.sortOrder ?? 'asc';
      if (!this._fields().includes(sortBy) || !['asc', 'desc'].includes(sortOrder)) return [];
      const sign = sortOrder === 'desc' ? -1 : 1;
      return this._items.filter(obj => this._matches(obj, filterConfig))
        .sort((a, b) => sign * compareValues(a[sortBy], b[sortBy]) || compareValues(a.id, b.id))
        .slice(skip, skip + top)
        .map(copyObj);
    }

    getObj(id) {
      if (typeof id !== 'string') return null;
      const obj = this._items.find(item => item.id === id);
      return obj ? copyObj(obj) : null;
    }

    addObj(obj) {
      if (!this.validateObj(obj) || this._items.some(item => item.id === obj.id)) return false;
      this._items.push(copyObj(obj));
      return true;
    }

    editObj(id, patch) {
      if (typeof id !== 'string' || !isObject(patch) || Object.keys(patch).length === 0) return false;
      if (Object.keys(patch).some(key => !this._fields().includes(key) || ['id', 'author', 'createdAt'].includes(key))) {
        return false;
      }
      const index = this._items.findIndex(item => item.id === id);
      if (index < 0) return false;
      const changed = { ...this._items[index], ...patch };
      if (!this.validateObj(changed)) return false;
      this._items[index] = copyObj(changed);
      return true;
    }

    removeObj(id) {
      if (typeof id !== 'string') return false;
      const index = this._items.findIndex(item => item.id === id);
      if (index < 0) return false;
      this._items.splice(index, 1);
      return true;
    }

    addAll(objects) {
      if (!Array.isArray(objects)) return [];
      const added = [];
      for (const obj of objects) {
        if (this.addObj(obj)) added.push(copyObj(obj));
      }
      return added;
    }

    clear() {
      const count = this._items.length;
      this._items = [];
      return count;
    }
  }

  class TaskCollection extends Collection {
    _fields() {
      return TASK_FIELDS;
    }

    _validAdditionalFields(obj) {
      return nonEmpty(obj.project) && nonEmpty(obj.assignee) && validDay(obj.deadline) &&
        nonEmpty(obj.plannedVolume) && COMPLEXITIES.includes(obj.complexity) &&
        TASK_STATES.includes(obj.status) && nonNegative(obj.plannedHours) && obj.plannedHours > 0 &&
        nonNegative(obj.actualHours) && nonNegative(obj.points);
    }
  }

  class ReportCollection extends Collection {
    _fields() {
      return REPORT_FIELDS;
    }

    _validAdditionalFields(obj) {
      return nonEmpty(obj.taskId) && nonNegative(obj.hours) && obj.hours > 0 &&
        nonNegative(obj.overtimeHours) && obj.overtimeHours <= obj.hours &&
        REPORT_STATES.includes(obj.status);
    }
  }

  function loadRecords(key, defaults) {
    try {
      const data = JSON.parse(sessionStorage.getItem(key));
      if (Array.isArray(data)) return data.map(obj => ({ ...obj, createdAt: new Date(obj.createdAt) }));
    } catch (_error) {}
    return defaults;
  }

  try {
    const storedUser = sessionStorage.getItem('sakovich-lab6-user');
    if (storedUser !== null) {
      const parsed = JSON.parse(storedUser);
      if (parsed === null || USERS.some(user => user.name === parsed)) currentUser = parsed;
    }
  } catch (_error) {}

  const tasks = new TaskCollection(loadRecords('sakovich-lab6-tasks', ObjInf));
  const reports = new ReportCollection(loadRecords('sakovich-lab6-reports', REPORTS));

  function persist() {
    try {
      sessionStorage.setItem('sakovich-lab6-tasks', JSON.stringify(tasks.getObjs(0, Number.MAX_SAFE_INTEGER)));
      sessionStorage.setItem('sakovich-lab6-reports', JSON.stringify(reports.getObjs(0, Number.MAX_SAFE_INTEGER)));
      sessionStorage.setItem('sakovich-lab6-user', JSON.stringify(currentUser));
    } catch (_error) {}
  }

  function el(tag, className = '', content = null) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== null) element.textContent = String(content);
    return element;
  }

  function asDay(date) {
    if (date instanceof Date) {
      return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    }
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  }

  function createLink(text, href, className = 'text-link') {
    const a = el('a', className, text);
    a.href = href;
    return a;
  }

  function taskHref(id) {
    return `?task=${encodeURIComponent(id)}#task-detail`;
  }

  function reportHref(id) {
    return `?report=${encodeURIComponent(id)}#report-edit`;
  }

  function emptyState(message = 'Записей нет') {
    return el('p', 'empty-state', message);
  }

  class View {
    constructor(taskCollection, reportCollection) {
      this._tasks = taskCollection;
      this._reports = reportCollection;
      this._taskId = new URLSearchParams(location.search).get('task') || '104';
      this._reportId = new URLSearchParams(location.search).get('report') || '25';
      this._userId = new URLSearchParams(location.search).get('user') || 'Иван Петров';
      this._filters = {};
    }

    _get(selector) {
      return document.querySelector(selector);
    }

    _setText(selector, value) {
      const element = this._get(selector);
      if (element) element.textContent = String(value);
    }

    _replace(selector, elements) {
      const target = this._get(selector);
      if (!target) throw new Error(`Контейнер ${selector} не найден`);
      target.replaceChildren(...(elements.length ? elements : [emptyState()]));
    }

    _user() {
      return USERS.find(user => user.name === currentUser) || null;
    }

    _role() {
      return this._user()?.role || null;
    }

    _allTasks() {
      return this._tasks.getObjs(0, Number.MAX_SAFE_INTEGER);
    }

    _allReports() {
      return this._reports.getObjs(0, Number.MAX_SAFE_INTEGER);
    }

    _visibleTasks() {
      if (!currentUser) return [];
      const role = this._role();
      const all = this._allTasks();
      if (role === 'Сотрудник') return all.filter(task => task.assignee === currentUser);
      if (role === 'Начальник отдела') {
        const myDept = this._user().department;
        return all.filter(task => USERS.some(user => user.name === task.assignee && user.department === myDept));
      }
      return all;
    }

    _myReports() {
      return currentUser ? this._allReports().filter(report => report.author === currentUser) : [];
    }

    _canCreateTasks() {
      return ['Начальник отдела', 'Администратор'].includes(this._role());
    }

    _canEditTask(task) {
      return !!task && (this._role() === 'Администратор' ||
        (this._role() === 'Начальник отдела' && task.author === currentUser));
    }

    _canReportTask(task) {
      return !!task && task.assignee === currentUser && task.status !== 'Готово';
    }

    _canEditReport(report) {
      return !!report && report.author === currentUser;
    }

    _score(name) {
      return this._allTasks().filter(task => task.assignee === name)
        .reduce((total, task) => total + task.points, 0);
    }

    _ranking() {
      const user = this._user();
      if (!user) return [];
      const department = ['Сотрудник', 'Начальник отдела'].includes(user.role) ? user.department : null;
      return USERS.filter(person => person.role === 'Сотрудник' && (!department || person.department === department))
        .map(person => ({ name: person.name, points: this._score(person.name) }))
        .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'ru'));
    }

    _lineTask(task, table = false) {
      if (table) {
        const row = el('article', 'list-row');
        const info = el('div');
        info.append(createLink(`#${task.id} — ${task.description}`, taskHref(task.id), 'record-title'));
        info.append(el('p', '', `${task.project} — ${task.assignee}`));
        const status = el('span', 'tag', task.status);
        const date = el('time', '', asDay(task.deadline));
        date.dateTime = task.deadline;
        row.append(info, status, date, createLink('Открыть', taskHref(task.id)));
        return row;
      }
      const row = el('article', 'record');
      const info = el('div');
      info.append(createLink(`#${task.id} — ${task.description}`, taskHref(task.id), 'record-title'));
      info.append(el('p', '', `${task.project} · ${asDay(task.deadline)}`));
      row.append(info, el('span', 'tag', task.status));
      return row;
    }

    _lineReport(report, list = false) {
      const row = el('article', 'record');
      const task = this._tasks.getObj(report.taskId);
      const description = `${task ? `Задача #${task.id}` : 'Задача удалена'} · ${report.description} · ${report.hours} ч`;
      const info = el('div');
      info.append(el('strong', '', `Отчёт #${report.id} — ${asDay(report.createdAt)}`));
      info.append(el('p', '', description));
      const actions = el('div', 'record-right');
      actions.append(el('span', 'tag', report.status));
      if (this._canEditReport(report)) actions.append(createLink('Изменить', reportHref(report.id)));
      if (list) actions.append(el('small', '', report.author));
      row.append(info, actions);
      return row;
    }

    _renderHeader() {
      const target = this._get('.topbar-right');
      if (!target) throw new Error(`Контейнер ${selector} не найден`);
      target.replaceChildren(
        el('span', 'current-user', currentUser || 'Гость'),
        createLink('Сменить пользователя', '#login')
      );
      const loggedIn = !!currentUser;
      for (const link of document.querySelectorAll('#home a[href="#report-create"], #reports a[href="#report-create"], #reports .hint')) {
        link.hidden = !loggedIn || (link.tagName === 'A' && this._role() !== 'Сотрудник');
      }
      const createTask = this._canCreateTasks();
      for (const link of document.querySelectorAll('#tasks a[href="#task-create"], #team a[href="#task-create"]')) {
        link.hidden = !createTask;
      }
      const toolbar = this._get('#tasks form.toolbar');
      if (toolbar) toolbar.hidden = !loggedIn;
      const createReport = this._get('#report-create form');
      if (createReport) createReport.hidden = !loggedIn || this._role() !== 'Сотрудник';
    }

    _renderHome() {
      const relevant = this._visibleTasks();
      const isEmployee = this._role() === 'Сотрудник';
      const myTasks = isEmployee ? relevant.filter(task => task.assignee === currentUser) : relevant;
      const total = myTasks.length;
      const values = [total, myTasks.filter(task => task.status === 'В работе').length,
        myTasks.filter(task => task.status === 'Готово').length,
        myTasks.reduce((sum, task) => sum + task.points, 0)];
      const metrics = document.querySelectorAll('#home .metrics strong');
      metrics.forEach((node, index) => { node.textContent = String(values[index]); });
      const ranking = this._ranking();
      const pos = ranking.findIndex(row => row.name === currentUser);
      this._setText('#home .metrics .metric:last-child small', isEmployee && pos >= 0 ?
        `Позиция в отделе: ${pos + 1} из ${ranking.length}` : 'Баллы по задачам');
      this._setText('#home .metrics .metric:first-child small', isEmployee ? 'Назначено сотруднику' : 'Задач в подразделении');
      this._setText('#home .overline', isEmployee ? 'Рабочее пространство сотрудника' : 'Обзор задач организации');
      const next = myTasks.filter(task => task.status !== 'Готово')
        .sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 3);
      this._replace('#home-task-list', next.map(task => {
        const row = el('div', 'record');
        const main = el('div');
        main.append(createLink(task.description, taskHref(task.id), 'record-title'));
        main.append(el('p', '', `Проект: ${task.project}`));
        const right = el('div', 'record-right');
        right.append(el('span', 'tag', task.status), el('small', '', asDay(task.deadline)));
        row.append(main, right);
        return row;
      }));
    }

    _renderTaskLists() {
      const visible = this._visibleTasks();
      const pageSize = 12;
      this._replace('#task-list', visible.slice(0, pageSize).map(task => this._lineTask(task, true)));
      this._replace('#task-list-page-2', visible.slice(pageSize).map(task => this._lineTask(task)));
      const page1 = this._get('#tasks .pagination');
      if (page1) {
        page1.querySelector('span').textContent = `Показано ${Math.min(pageSize, visible.length)} из ${visible.length}`;
        const next = page1.querySelector('a');
        if (next) next.hidden = visible.length <= pageSize;
      }
      const page2 = this._get('#tasks-page-2 .pagination');
      if (page2) page2.querySelector('span').textContent = `Показано ${Math.max(0, visible.length - pageSize)} из ${visible.length}`;
      this._replace('#task-active-list', visible.filter(task => task.status === 'В работе').map(task => this._lineTask(task)));
      this._replace('#task-sorted-list', [...visible].sort((a, b) => a.deadline.localeCompare(b.deadline))
        .map(task => this._lineTask(task)));

      const params = new URLSearchParams(location.search);
      const queryFilters = {
        query: this._filters.query ?? params.get('q') ?? '',
        project: this._filters.project ?? params.get('project') ?? '',
        status: this._filters.status ?? params.get('status') ?? ''
      };
      const accessible = new Set(visible.map(task => task.id));
      const matched = this._tasks.getObjs(0, Number.MAX_SAFE_INTEGER, queryFilters)
        .filter(task => accessible.has(task.id));
      this._replace('#task-search-list', matched.map(task => this._lineTask(task)));
      this._setText('#task-search-summary', `Найдено задач: ${matched.length}`);
      const queryField = this._get('#task-query');
      const projectField = this._get('#task-project-filter');
      const statusField = this._get('#task-status-filter');
      if (queryField) queryField.value = queryFilters.query;
      if (projectField) projectField.value = queryFilters.project;
      if (statusField) statusField.value = queryFilters.status;
    }

    _renderTaskDetails() {
      const selected = this._tasks.getObj(this._taskId);
      const task = selected && this._visibleTasks().some(item => item.id === selected.id) ? selected : null;
      this._setText('#task-detail .overline', task ? `Задачи / Карточка задачи #${task.id}` : 'Задачи / Карточка задачи');
      this._setText('#task-detail h1', task ? task.description : 'Задача не найдена');
      const fields = task ? [
        ['Проект', task.project], ['Исполнитель', task.assignee], ['Постановщик', task.author],
        ['Состояние', task.status], ['Срок выполнения', asDay(task.deadline)],
        ['Плановый объём', task.plannedVolume], ['Сложность', task.complexity],
        ['Плановое время', `${task.plannedHours} ч`], ['Фактическое время', `${task.actualHours} ч`]
      ] : [];
      const details = fields.map(([label, value]) => {
        const div = el('div');
        div.append(el('dt', '', label), el('dd', '', value));
        return div;
      });
      this._replace('#task-details', details);
      const history = task ? this._allReports().filter(report => report.taskId === task.id)
        .sort((a, b) => b.createdAt - a.createdAt) : [];
      this._replace('#task-history', history.map(report => this._lineReport(report)));
      const canEdit = this._canEditTask(task);
      const canReport = this._canReportTask(task);
      for (const link of document.querySelectorAll('#task-detail a[href="#task-edit"], #task-detail .inline-action')) {
        link.hidden = !canEdit;
      }
      for (const link of document.querySelectorAll('#task-detail .heading-actions a:last-child, #task-detail section[aria-labelledby="history-title"] .panel-heading a')) {
        link.hidden = !canReport;
        link.href = task ? `?task=${encodeURIComponent(task.id)}#report-create` : '#report-create';
      }
      const editForm = this._get('#task-edit form');
      if (editForm) editForm.hidden = !canEdit;
      if (task) {
        const fieldsToFill = {
          '#edit-task-name': task.description, '#edit-task-deadline': task.deadline,
          '#edit-task-hours': task.plannedHours, '#edit-task-volume': task.plannedVolume,
          '#edit-task-status': task.status
        };
        for (const [selector, value] of Object.entries(fieldsToFill)) {
          const field = this._get(selector);
          if (field) field.value = value;
        }
      }
      this._setText('#task-delete-label', task ? `Задача #${task.id} «${task.description}» будет удалена.` : 'Задача не найдена.');
      const deleteForm = this._get('#task-delete form');
      if (deleteForm) deleteForm.hidden = !canEdit;
    }

    _renderProjects() {
      this._replace('#project-list', PROJECTS.map(project => {
        const row = el('article', 'record');
        const info = el('div');
        info.append(el('strong', '', project.name), el('p', '', project.departments));
        row.append(info, el('span', 'tag', project.status));
        return row;
      }));
      const options = this._get('#task-project-filter');
      if (options) {
        const previous = options.value;
        options.replaceChildren(el('option', '', 'Все проекты'));
        options.firstChild.value = '';
        PROJECTS.forEach(project => {
          const option = el('option', '', project.name);
          option.value = project.name;
          options.append(option);
        });
        options.value = previous;
      }
      const status = this._get('#task-status-filter');
      if (status) {
        const previous = status.value;
        status.replaceChildren(el('option', '', 'Все состояния'));
        status.firstChild.value = '';
        TASK_STATES.forEach(value => {
          const option = el('option', '', value);
          option.value = value;
          status.append(option);
        });
        status.value = previous;
      }
      const newProject = this._get('#new-task-project');
      if (newProject) {
        newProject.replaceChildren(el('option', '', 'Выберите проект'));
        newProject.firstChild.value = '';
        PROJECTS.forEach(project => {
          const option = el('option', '', project.name);
          option.value = project.name;
          newProject.append(option);
        });
      }
      const assignee = this._get('#new-task-employee');
      if (assignee) {
        assignee.replaceChildren(el('option', '', 'Выберите сотрудника'));
        assignee.firstChild.value = '';
        USERS.filter(user => user.role === 'Сотрудник').forEach(user => {
          const option = el('option', '', user.name);
          option.value = user.name;
          assignee.append(option);
        });
      }
    }

    _renderReports() {
      const own = this._myReports().sort((a, b) => b.createdAt - a.createdAt);
      const pageSize = 3;
      this._replace('#report-list', own.slice(0, pageSize).map(report => this._lineReport(report)));
      this._replace('#report-list-page-2', own.slice(pageSize).map(report => this._lineReport(report)));
      const paging = this._get('#reports .pagination');
      if (paging) {
        paging.querySelector('span').textContent = `Показано ${Math.min(pageSize, own.length)} из ${own.length}`;
        paging.querySelector('a').hidden = own.length <= pageSize;
      }
      const current = this._reports.getObj(this._reportId);
      this._setText('#report-edit .overline', current ? `Отчёты / Редактирование #${current.id}` : 'Отчёты / Редактирование');
      const canEdit = this._canEditReport(current);
      const editForm = this._get('#report-edit form');
      if (editForm) editForm.hidden = !canEdit;
      const editResult = this._get('#report-edit-result');
      if (editResult) editResult.value = current?.description || '';
      const editHours = this._get('#report-edit-hours');
      if (editHours) editHours.value = current?.hours ?? '';
      const deleteForm = this._get('#report-delete form');
      if (deleteForm) deleteForm.hidden = !canEdit;
      this._setText('#report-delete-label', current ? `Отчёт #${current.id} по задаче #${current.taskId} будет удалён.` : 'Отчёт не найден.');

      const select = this._get('#report-task');
      const selected = this._tasks.getObj(this._taskId);
      if (select) {
        const empty = el('option', '', 'Выберите задачу');
        empty.value = '';
        select.replaceChildren(empty);
        this._visibleTasks().filter(task => task.assignee === currentUser && task.status !== 'Готово')
          .forEach(task => {
            const option = el('option', '', `#${task.id} — ${task.description}`);
            option.value = task.id;
            select.append(option);
          });
        select.value = selected && selected.assignee === currentUser && selected.status !== 'Готово' ? selected.id : '';
      }
      const choice = this._tasks.getObj(select?.value || this._taskId);
      this._setText('#report-create .mini-panel strong', choice ? `Ранее отправлено по задаче #${choice.id}` : 'История отчётов');
      const oldReports = choice ? this._allReports().filter(report => report.taskId === choice.id) : [];
      const summary = oldReports.length ? oldReports.map(report => `${asDay(report.createdAt)} — ${report.hours} ч`).join('; ') : 'Отчётов ещё нет';
      this._setText('#report-create-history', summary);
    }

    _renderAnalytics() {
      const user = this._user();
      const period = new URLSearchParams(location.search).get('period') || 'Ноябрь 2026';
      const timePredicate = day => {
        const s = day instanceof Date ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}` : day.slice(0, 7);
        return period === 'Октябрь 2026' ? s === '2026-10' :
          period === 'Текущий квартал' ? s >= '2026-10' && s <= '2026-12' : s === '2026-11';
      };
      const reportDate = this._get('#report-date');
      if (reportDate && !reportDate.value) reportDate.value = new Date().toLocaleDateString('sv-SE');
      const select = this._get('#period');
      if (select) select.value = period;
      const isEmployee = this._role() === 'Сотрудник';
      const visible = this._visibleTasks();
      const ownTasks = visible.filter(task => (!isEmployee || task.assignee === currentUser) && timePredicate(task.deadline));
      const allowedIds = new Set(visible.map(task => task.id));
      const ownReports = (isEmployee ? this._myReports() :
        this._allReports().filter(report => allowedIds.has(report.taskId)))
        .filter(report => timePredicate(report.createdAt));
      const hours = ownReports.reduce((sum, report) => sum + report.hours, 0);
      const planned = ownTasks.reduce((sum, task) => sum + task.plannedHours, 0);
      const completed = ownTasks.filter(task => task.status === 'Готово').length;
      const points = ownTasks.reduce((sum, task) => sum + task.points, 0);
      const metrics = document.querySelectorAll('#analytics .metrics strong');
      [hours, completed, points].forEach((value, index) => {
        if (metrics[index]) metrics[index].textContent = String(value);
      });
      this._setText('#analytics .metric:first-child small', `План: ${planned} ч`);
      const progress = document.querySelectorAll('#analytics .progress-row');
      if (progress[0]) {
        progress[0].querySelector('strong').textContent = `${hours} / ${planned} ч`;
        progress[0].querySelector('.track span').style.width = `${planned ? Math.min(100, hours / planned * 100) : 0}%`;
      }
      if (progress[1]) {
        progress[1].querySelector('strong').textContent = `${completed} / ${ownTasks.length}`;
        progress[1].querySelector('.track span').style.width = `${ownTasks.length ? completed / ownTasks.length * 100 : 0}%`;
      }
      const ranking = this._ranking();
      const rank = ranking.findIndex(person => person.name === currentUser);
      this._setText('#analytics .rank strong', rank < 0 ? '—' : rank + 1);
      this._setText('#analytics .rank span', rank < 0 ? 'Рейтинг сотрудников' : `из ${ranking.length} сотрудников`);
      this._replace('#rating-list', ranking.slice(0, 5).map((person, index) => {
        const row = el('div', 'record compact');
        const name = index === rank ? `${index + 1}. Вы` : `${index + 1}. ${person.name}`;
        row.append(el(index === rank ? 'strong' : 'span', '', name), el('strong', '', person.points));
        return row;
      }));
      if (!user) this._setText('#analytics .rank span', 'Войдите, чтобы посмотреть рейтинг');
    }

    _renderTeam() {
      const team = USERS.filter(user => user.department === 'Разработка' && user.role === 'Сотрудник');
      this._replace('#team-users', (this._role() === 'Начальник отдела' ? team : []).map(user => {
        const row = el('article', 'record');
        const info = el('div');
        info.append(el('strong', '', user.name), el('p', '', `${user.position} · ${this._score(user.name)} баллов`));
        row.append(info);
        if (this._canCreateTasks()) row.append(createLink('Назначить работу', '#task-create'));
        return row;
      }));
      const reviews = this._role() === 'Начальник отдела' ?
        this._allReports().filter(report => report.status === 'Обработан') : [];
      this._replace('#team-reports', reviews.map(report => {
        const row = el('article', 'record');
        const info = el('div');
        info.append(el('strong', '', `${report.author} — задача #${report.taskId}`));
        info.append(el('p', '', `Отчёт от ${asDay(report.createdAt)} · ${report.hours} ч`));
        row.append(info, createLink('Оценить результат', `?report=${encodeURIComponent(report.id)}#evaluation`, 'button button-secondary button-small'));
        return row;
      }));
      const report = this._reports.getObj(this._reportId);
      this._setText('#evaluation .lead', report ? `Отчёт #${report.id}. Исполнитель: ${report.author}. Задача #${report.taskId}.` : 'Отчёт не найден.');
      const allowed = this._role() === 'Начальник отдела';
      const form = this._get('#evaluation form');
      if (form) form.hidden = !allowed;
    }

    _renderUsers() {
      const usersToShow = this._role() === 'Администратор' ? USERS : [];
      this._replace('#user-list', usersToShow.slice(0, 4).map(user => {
        const row = el('article', 'list-row');
        const info = el('div');
        info.append(el('strong', '', user.name), el('p', '', user.email));
        row.append(info, el('span', '', user.role), el('span', '', user.department));
        const link = createLink('Изменить', `?user=${encodeURIComponent(user.name)}#user-edit`);
        link.hidden = this._role() !== 'Администратор';
        row.append(link);
        return row;
      }));
      this._replace('#user-list-page-2', usersToShow.slice(4).map(user => {
        const row = el('article', 'record');
        const info = el('div');
        info.append(el('strong', '', user.name), el('p', '', `${user.role} · ${user.department}`));
        row.append(info);
        if (this._role() === 'Администратор') row.append(createLink('Изменить', `?user=${encodeURIComponent(user.name)}#user-edit`));
        return row;
      }));
      const selected = USERS.find(user => user.name === this._userId);
      for (const [selector, list, selectedValue] of [
        ['#edit-user-role', [...new Set(USERS.map(user => user.role))], selected?.role || ''],
        ['#edit-user-dept', [...new Set(USERS.map(user => user.department))], selected?.department || '']
      ]) {
        const field = this._get(selector);
        if (field) {
          field.replaceChildren(...list.map(value => { const option = el('option', '', value); option.value = value; return option; }));
          field.value = selectedValue;
        }
      }
      for (const [selector, value] of Object.entries({
        '#edit-user-name': selected?.name || '', '#edit-user-email': selected?.email || '',
        '#edit-user-role': selected?.role || '', '#edit-user-dept': selected?.department || ''
      })) {
        const input = this._get(selector);
        if (input) input.value = value;
      }
      this._setText('#user-delete-label', selected ? `Учётная запись «${selected.name}» будет удалена.` : 'Учётная запись не найдена.');
      const canManage = this._role() === 'Администратор';
      for (const selector of ['#users a[href="#user-create"]', '#user-create form', '#user-edit form', '#user-delete form']) {
        const control = this._get(selector);
        if (control) control.hidden = !canManage;
      }
    }

    render() {
      this._renderHeader();
      this._renderProjects();
      this._renderTaskLists();
      this._renderTaskDetails();
      this._renderHome();
      this._renderReports();
      this._renderAnalytics();
      this._renderTeam();
      this._renderUsers();
    }

    resetSelection() {
      this._taskId = '104';
      this._reportId = '25';
      this._filters = {};
    }

    setFilters(config = {}) {
      if (!isObject(config)) return false;
      this._filters = { ...config };
      this.render();
      location.hash = '#tasks-search';
      return true;
    }

    selectTask(id) {
      if (!this._visibleTasks().some(task => task.id === id)) return false;
      this._taskId = id;
      this.render();
      location.hash = '#task-detail';
      return true;
    }

    selectReport(id) {
      if (!this._reports.getObj(id)) return false;
      this._reportId = id;
      this.render();
      location.hash = '#report-edit';
      return true;
    }
  }

  const view = new View(tasks, reports);
  const refresh = () => { persist(); view.render(); };

  function addObj(obj) {
    const success = tasks.addObj(obj);
    if (success) refresh();
    return success;
  }

  function addAll(objects) {
    const added = tasks.addAll(objects);
    if (added.length) refresh();
    return added;
  }

  function editObj(id, patch) {
    const success = tasks.editObj(id, patch);
    if (success) refresh();
    return success;
  }

  function removeObj(id) {
    const success = tasks.removeObj(id);
    if (!success) return false;
    for (const report of reports.getObjs(0, Number.MAX_SAFE_INTEGER, { taskId: id })) {
      reports.removeObj(report.id);
    }
    refresh();
    return true;
  }

  function addReport(report) {
    const task = tasks.getObj(report?.taskId);
    if (!task || task.assignee !== report.author || task.status === 'Готово') return false;
    const success = reports.addObj(report);
    if (success) {
      tasks.editObj(task.id, { actualHours: task.actualHours + report.hours });
      refresh();
    }
    return success;
  }

  function editReport(id, patch) {
    const old = reports.getObj(id);
    if (!old || !isObject(patch)) return false;
    if (patch.taskId !== undefined) {
      const destination = tasks.getObj(patch.taskId);
      if (!destination || destination.assignee !== old.author) return false;
    }
    if (!reports.editObj(id, patch)) return false;
    const updated = reports.getObj(id);
    if (updated.taskId !== old.taskId) {
      const prevTask = tasks.getObj(old.taskId);
      const nextTask = tasks.getObj(updated.taskId);
      if (prevTask) tasks.editObj(prevTask.id, { actualHours: Math.max(0, prevTask.actualHours - old.hours) });
      if (nextTask) tasks.editObj(nextTask.id, { actualHours: nextTask.actualHours + updated.hours });
    } else {
      const task = tasks.getObj(old.taskId);
      if (task) tasks.editObj(task.id, { actualHours: Math.max(0, task.actualHours + updated.hours - old.hours) });
    }
    refresh();
    return true;
  }

  function removeReport(id) {
    const old = reports.getObj(id);
    if (!old || !reports.removeObj(id)) return false;
    const task = tasks.getObj(old.taskId);
    if (task) tasks.editObj(task.id, { actualHours: Math.max(0, task.actualHours - old.hours) });
    refresh();
    return true;
  }

  function setUser(name) {
    if (name !== null && (typeof name !== 'string' || !USERS.some(user => user.name === name))) return false;
    currentUser = name;
    persist();
    view.render();
    return true;
  }

  function reset() {
    tasks.clear();
    reports.clear();
    tasks.addAll(ObjInf);
    reports.addAll(REPORTS);
    currentUser = 'Иван Петров';
    view.resetSelection();
    refresh();
    return true;
  }

  function runTests() {
    const testTasks = new TaskCollection(ObjInf);
    const valid = copyObj(ObjInf[0]);
    valid.id = '125';
    const invalid = { ...valid, description: 'x'.repeat(200) };
    const checks = [
      ['В коллекции не менее 20 задач', testTasks.getObjs(0, 100).length >= 20],
      ['getObjs: пагинация', testTasks.getObjs(10, 10).length === 10],
      ['getObjs: фильтр', testTasks.getObjs(0, 50, { assignee: 'Иван Петров' }).every(obj => obj.assignee === 'Иван Петров')],
      ['getObjs: сортировка', testTasks.getObjs(0, 50, { sortBy: 'deadline' }).every((obj, index, arr) => index === 0 || arr[index - 1].deadline <= obj.deadline)],
      ['getObjs: некорректный параметр', testTasks.getObjs(-1, 10).length === 0],
      ['getObj: найден', testTasks.getObj('104')?.id === '104'],
      ['getObj: отсутствует', testTasks.getObj('999') === null],
      ['validateObj: корректный объект', testTasks.validateObj(valid)],
      ['validateObj: некорректный объект', !testTasks.validateObj(invalid)],
      ['addObj: новый объект', testTasks.addObj(valid)],
      ['addObj: повторный id', !testTasks.addObj(valid)],
      ['editObj: частичное изменение', testTasks.editObj('125', { status: 'Готово' }) && testTasks.getObj('125').status === 'Готово'],
      ['editObj: запрет изменения id', !testTasks.editObj('125', { id: '126' })],
      ['editObj: проверка ошибок', !testTasks.editObj('125', { plannedHours: -3 })],
      ['removeObj: удаление', testTasks.removeObj('125') && !testTasks.getObj('125')],
      ['removeObj: отсутствующий объект', !testTasks.removeObj('125')],
      ['addAll: проверка массива', testTasks.addAll([valid, invalid]).length === 1],
      ['clear: очистка коллекции', testTasks.clear() >= 20 && testTasks.getObjs().length === 0]
    ];
    console.table(checks.map(([test, passed]) => ({ Проверка: test, Результат: passed ? 'OK' : 'ОШИБКА' })));
    return checks.every(([, passed]) => passed);
  }

  window.lab6 = Object.freeze({
    TaskCollection, ReportCollection, View,
    getObjs: (...args) => tasks.getObjs(...args),
    getObj: id => tasks.getObj(id),
    validateObj: obj => tasks.validateObj(obj),
    addObj, editObj, removeObj, addAll,
    getReports: (...args) => reports.getObjs(...args),
    addReport, editReport, removeReport,
    setUser, getUser: () => currentUser,
    setFilters: filters => view.setFilters(filters),
    selectTask: id => view.selectTask(id),
    selectReport: id => view.selectReport(id),
    reset, runTests
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => view.render(), { once: true });
  } else {
    view.render();
  }
})();
