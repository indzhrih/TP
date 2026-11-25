'use strict';

(() => {
  const STORAGE_KEY = 'sakovich-lab7-data';
  const SEED_KEY = 'sakovich-lab7-initial';
  try {
    if (localStorage.getItem(SEED_KEY) !== null && localStorage.getItem(STORAGE_KEY) !== null) return;
  } catch (error) {
    return;
  }

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

  const USERS = [
    { name: 'Иван Петров', role: 'Сотрудник', department: 'Разработка', position: 'Разработчик', email: 'i.petrov@example.org' },
    { name: 'Анна Смирнова', role: 'Начальник отдела', department: 'Разработка', position: 'Начальник отдела', email: 'a.smirnova@example.org' },
    { name: 'Мария Соколова', role: 'Сотрудник', department: 'Разработка', position: 'Разработчик', email: 'm.sokolova@example.org' },
    { name: 'Алексей Морозов', role: 'Сотрудник', department: 'Разработка', position: 'Инженер', email: 'a.morozov@example.org' },
    { name: 'Елена Ковалева', role: 'Сотрудник', department: 'Разработка', position: 'Аналитик', email: 'e.kovaleva@example.org' },
    { name: 'Ольга Кузнецова', role: 'Администратор', department: 'Инфраструктура', position: 'Администратор', email: 'o.kuznetsova@example.org' },
    { name: 'Сергей Орлов', role: 'Руководитель организации', department: 'Управление', position: 'Директор', email: 's.orlov@example.org' }
  ];


  const initial = { version: 1, tasks: ObjInf, reports: REPORTS, users: USERS.map(user => ({ ...user, passwordHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' })) };
  try {
    if (localStorage.getItem(SEED_KEY) === null) localStorage.setItem(SEED_KEY, JSON.stringify(initial));
    if (localStorage.getItem(STORAGE_KEY) === null) localStorage.setItem(STORAGE_KEY, localStorage.getItem(SEED_KEY));
  } catch (error) {
  }
})();
