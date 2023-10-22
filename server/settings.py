from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, True),
    ALLOWED_HOSTS=(list, ['*']),
    SITE_URL=(str, 'http://127.0.0.1'),
)
environ.Env.read_env(env_file=BASE_DIR / '.env')

ALLOWED_HOSTS = env('ALLOWED_HOSTS')
DEBUG = env('DEBUG')
METRIC_SYSTEM_CODE = env.str('METRIC_SYSTEM_CODE', default='', multiline=True)
ROOT_URLCONF = 'server.urls'
WSGI_APPLICATION = 'server.wsgi.application'
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR.parent / 'static'
SITE_URL = env('SITE_URL')
INTERNAL_IPS = ['127.0.0.1']

API_SALT = env('API_SALT')
API_SECRET_KEY = env('API_SECRET_KEY')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drf_spectacular',
    'django_sy_framework.base',
    'django_sy_framework.custom_auth',
    'django_sy_framework.linker',
    'server',
    'pages',
    'project',
    'project_specificity',
    'django.contrib.gis',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django_sy_framework.custom_auth.context_processors.extern_auth_services',
                'django_sy_framework.base.context_processors.settings_variables',
            ],
        },
    },
]

SECRET_KEY = env('SECRET_KEY')

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.spatialite',
        'NAME': BASE_DIR / '.sqlite3.db',
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'main': {
            'format': '{levelname} {asctime} {message}',
            'style': '{',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        }
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / '.debug.log',
            'formatter': 'main',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'API платформы',
    'DESCRIPTION': 'Сервер предоставляет доступ к манипулированию платформой',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': True,
    'SCHEMA_PATH_PREFIX_INSERT': 'api',
    #'SCHEMA_PATH_PREFIX': '/api/v[0-9]',
    'SERVE_URLCONF': 'server.urls_api',
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# External auth

EXTERN_AUTH = {
    'google': {
        'client_id': env('EXTERN_AUTH_GOOGLE_CLIENT_ID'),
        'client_secret': env('EXTERN_AUTH_GOOGLE_CLIENT_SECRET'),
    }
}
AUTH_USER_MODEL = 'custom_auth.CustomAuthUser'
AUTHENTICATION_BACKENDS = ['django_sy_framework.custom_auth.backend.CustomAuthBackend']
MICROSERVICES_TOKENS = {
    'to_auth': env('MICROSERVICE_TOKEN_TO_AUTH'),
    'to_faci': env('MICROSERVICE_TOKEN_TO_FACI'),
    'to_note': env('MICROSERVICE_TOKEN_TO_NOTE'),
}
MICROSERVICES_URLS = {
    'auth': env('MICROSERVICE_URL_AUTH'),
    'faci': env('MICROSERVICE_URL_FACI'),
    'note': env('MICROSERVICE_URL_NOTE'),
}


# for GeoDjango

# gdal_library_path = env('GDAL_LIBRARY_PATH')
# if gdal_library_path:
#     GDAL_LIBRARY_PATH = str(BASE_DIR / gdal_library_path)

GDAL_LIBRARY_PATH = str(BASE_DIR / 'venv/Lib/site-packages/osgeo/gdal304.dll')
GEOS_LIBRARY_PATH = str(BASE_DIR / 'venv/Lib/site-packages/osgeo/geos_c.dll')
SPATIALITE_LIBRARY_PATH = 'mod_spatialite'
