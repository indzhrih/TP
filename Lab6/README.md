# Лабораторная работа №6 (6.a + 6.b)

АИС «Система организации работы». Откройте `index.html` в браузере. Все файлы находятся в одной папке, дополнительных библиотек не требуется.

- `index.html` — страницы системы и контейнеры для данных.
- `styles.css` — оформление из лабораторной №5.
- `script.js` — 24 задачи, отчёты, классы `TaskCollection`, `ReportCollection`, `View` и функции работы с данными.

## Проверка в консоли браузера (F12 → Console)

```js
lab6.runTests();
lab6.getObjs(0, 10);
lab6.getObjs(10, 10);
lab6.getObjs(0, 10, { assignee: 'Иван Петров', sortBy: 'deadline', sortOrder: 'asc' });
lab6.getObj('104');
lab6.getObjs(-1, 10); // неверная пагинация: []
```

Добавление задачи:

```js
lab6.addObj({
  id: '125',
  description: 'Проверить импорт задач',
  createdAt: new Date('2026-11-15T10:00:00'),
  author: 'Анна Смирнова',
  project: 'Аналитика',
  assignee: 'Иван Петров',
  deadline: '2026-12-12',
  plannedVolume: 'Проверить пять сценариев импорта',
  complexity: 'Средняя',
  plannedHours: 8,
  actualHours: 0,
  status: 'Ожидает',
  points: 0
});
lab6.editObj('125', { status: 'В работе', plannedHours: 10 });
lab6.removeObj('125');
```

После вызовов данные автоматически обновляются на страницах. Для изменения набора отображаемых задач и проверки ролей:

```js
lab6.setFilters({ project: 'Аналитика', status: 'В работе' });
lab6.setUser('Анна Смирнова');
lab6.setUser('Иван Петров');
lab6.setUser(null);
lab6.reset();
```

Доступны также `lab6.addAll`, `lab6.validateObj`, `lab6.selectTask`, `lab6.getReports`, `lab6.addReport`, `lab6.editReport`, `lab6.removeReport`. Состояние текущего пользователя задаётся в начале `script.js` и может изменяться через `setUser`.
