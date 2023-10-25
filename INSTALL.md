## На Linux

Скачивание репозитория:

```sh
git clone https://github.com/syeysk/django-sy-platform
```

Заполнить переменные окружения, добавив и заполнив файл `.env`

Сборка образа:

```sh
docker-compose build
```

Развёртывание и запуск контейнера

```sh
docker-compose up -d
```

## На Windows

### Установка GDAL

1. Скачать `GDAL-3.4.3-cp311-cp311-win_amd64.whl` из https://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal
2. Установить: `pip install GDAL-3.4.3-cp311-cp311-win_amd64.whl`
3. В `.env` добавить:
    - `GDAL_LIBRARY_PATH=venv/Lib/site-packages/osgeo/gdal304.dll`
    - `GEOS_LIBRARY_PATH=venv/Lib/site-packages/osgeo/geos_c.dll`

Источники:
- https://opensourceoptions.com/how-to-install-gdal-for-python-with-pip-on-windows/

### Установка Spatialite

1. Скачать `mod_spatialite-5.1.0-win-amd64.7z` из http://www.gaia-gis.it/gaia-sins/windows-bin-amd64/
2. Извлечь все *.dll в `venv/Scripts`
3. В `.env` добавить: `SPATIALITE_LIBRARY_PATH=mod_spatialite`

Источники:
- https://docs.djangoproject.com/en/4.2/ref/contrib/gis/install/spatialite/
- https://stackoverflow.com/questions/39787700/unable-to-locate-the-spatialite-library-django

### Запуск

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

Сбор статических файлов:

```sh
python manage.py collectstatic
```


Заполнить переменные окружения, добавив и заполнив файл `.env`

Запуск сервера:

```sh
python manage.py runserver 8001
```

## Проверка доступности сервера

<http://127.0.0.1:8001/project>

## Если хотите, примените Nginx + Debian

Настройки для Nginx:

```
server {
    location / {
        proxy_pass http://127.0.0.1:8001;
    }
    location /static/	 {
        sendfile on;
        root /usr/share/nginx/html/django-sy-platform;
    }
    location /media/	 {
        sendfile on;
        root /usr/share/nginx/html/django-sy-platform;
    }
    location = /favicon.ico {
        sendfile on;
        root /usr/share/nginx/html/django-sy-platform/static;
    }
}
```

Дополнительно:
- [Получение сертификата для домена](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/) - поправка: возможно, на Вашем сервере нужно вместо команды `python` использовать `python3`
