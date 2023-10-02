from django.contrib import admin
from project_specificity.models import CompostInputResourceSpecificity


class CompostInputResourceSpecificityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


admin.site.register(CompostInputResourceSpecificity, CompostInputResourceSpecificityAdmin)
