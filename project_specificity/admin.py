from django.contrib import admin
from project_specificity.models import CompostInputResourceSpecificity, CompostInputResourceDetailsSpecificity


class CompostInputResourceSpecificityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


admin.site.register(CompostInputResourceSpecificity, CompostInputResourceSpecificityAdmin)


class CompostInputResourceDetailsSpecificityAdmin(admin.ModelAdmin):
    list_display = ('id', 'input_resource', 'comment')


admin.site.register(CompostInputResourceDetailsSpecificity, CompostInputResourceDetailsSpecificityAdmin)

