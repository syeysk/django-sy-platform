# Contributing to django-sy-platform

## Термины

- УДАЛЁННЫЙ РЕПОЗИТОРИЙ — изначальный репозиторий, от которого наследуются остальные.
- ОРИГИНАЛЬНЫЙ РЕПОЗИТОРИЙ — репозиторий, унаследованный от удалённого (клон, форк). В данной статье под термином ФОРК подразумевается именно оригинальный репозиторий.
- ЛОКАЛЬНЫЙ РЕПОЗИТОРИЙ — локальная копия оригинального репозитория.

## Подготовка (выполняется один раз)

1. Создание форка на GitHub
2. Создание локальной копии

    ```sh
    git init
    git remote add origin https://github.com/ваш_аккаунт/django-sy-platform
    git pull origin main
    ```

3. Создание ветки, в которой будет вестись разработка

    ```sh
    git branch dev
    ```

## Подготовка (выполняется каждый раз перед работой)

1. Удостоверимся, что мы находимся в ветке `main`:

    ```sh
    git branch
    ```

    Она будет отмечена символом `*`.

2. Перед началом работы всегда получаем свежие изменения из GitHub:

    ```sh
    git pull remote main
    ```

3. Переходим в ветку `dev` и вливаем в неё изменения из ветки `main`:

    ```sh
    git checkout dev
    git merge main
    ```

## Отправляем Pull Request

1. После того как в ветку `dev`  внесены и зафиксированы правки, переходим в ветку `main`  и вливаем в неё изменения из ветки `dev`:

    ```sh
    git checkout main
    git merge --squash dev
    ```

    Обязательно укажем ключ `--sqaush`, чтобы сжать все коммиты в ветке `dev` в один.

2. Отправляем правки из локального репозитория на GitHub:

    ```sh
    git push origin main
    ```
