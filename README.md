# Платформа межкомандного взаимодействия

## Введение

Проект воплощает идею творческого пространства как набора отдельных, простых, но взаимосвязанных функций, подключаемых по мере необходимости.

Данный репозиторий – это микросервис, предоставляющий единую точку входа в мир единого пространства

### Концепция архитектуры

1. Отдельный микросервис работает как полноценное приложение.
1. Все микросервисы вместе работают как единая платформа, с общим дизайном.
1. Интеграция с внешними сервисами подразумевает встраивание функционала внешнего сервиса в графический и API интерфейс, будто он составляет микросервис единой платформы.
1. Запущенные одновременно копии микросервисов работают как альтернативные площадки единой платформы, имея возможность получать доступ к содержимому другихкопий.
1. Данные, введённые одним пользователем, доступны для других пользователей, в том числе и для не зарегистрированных



### Состав Платформы

1. [Фреймворк](https://github.com/syeysk/django-sy-framework) - django-фреймворк, обеспечивает микросервисы общим шаблоном, механизмом авторизации, статикой.
2. [Микросервис авторизации](https://github.com/syeysk/django-sy-auth) - обеспечивает единую точку управления учётными записями пользователей
3. [Микросервис Платформы](https://github.com/syeysk/django-sy-platform), в репозитории которого Вы сейчас находитесь, - даёт представление о возможностях
4. [Микросервис заметок](https://github.com/syeysk/django-sy-notes) - создание, хранение и обмен фантастическими заметками пользователей
5. [Микросервис фасилитации](https://github.com/syeysk/django-sy-faci) - проведение продуктивных встреч между пользователями

### Предыстория

Сервис является форком сервиса https://github.com/tvp-support/knowledge-api,
который реализовался как спешный и экспериментальный вариант приложения https://github.com/tvp-support/activista,
которое, в свою очередь основано на концепции Елены.

### Веб интерфейс

Пространство (space) состоит из площадей (square). На площади организованы комнаты-приложения (apps)

У всех людей общее пространство, каждый человек может иметь площади под разные потребности (разные бизнесы, НКО, например)

## Запуск

Скачивание репозитория:

```sh
git clone https://github.com/syeysk/django-sy-platform
```

Установка зависимостей:

```sh
pip install -r requirements.txt
```

Применение миграций:

```sh
python manage.py migrate
```

Заполнить переменные окружения, добавив и заполнив файл `.env`

Запуск сервера:

```sh
python manage.py runserver
```

Проверка доступности сервера:

<http://127.0.0.1:8000/api/v1/note/search/query/>

HTTP/2 200 возвращает JSON ответ.

## API сервера

[Документация API](https://github.com/TVP-Support/django_knowledge/wiki)

## План разработки сервиса и микросервисов

1. [Трансформация форка](ROADMAP_001_transformation_of_fork.md)
2. [Улучшение сервиса и добавление новых модулей](ROADMAP_002_improvements_and_new_modules.md)
3. [Интеграция сервиса с внешними сервисами](ROADMAP_003_integration_with_external_services.md)

## Вдохновение

Источником вдохновения стали программы:

- Blender - идентичные комбинации клавиш для схожего функционала в разных рабочих пространствах, переиспользование созданного в одном пространстве объекта в другом пространстве;
- FreeCAD - взгляд на CAD-систему как на набор отдельных кардинально различающихся по функциям и назначению верстаков, переиспользование созданного в одном пространстве объекта в другом пространстве;
- [activista](https://github.com/TVP-Support/activista) - идея объединить разнообразные по назначению микросервисы для создания пространства для активистов некоммерческих сообществ.
