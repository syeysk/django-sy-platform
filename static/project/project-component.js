ProjectComponent = {
    props: [],
    components: {FieldEditorComponent, LinkerComponent, NewsBlockComponent, SpecificitiesComponent},
    data() {
        $('h1')[0].textContent = '';
        let project_object = JSON.parse(document.getElementById('project_json').textContent);
        let isNew = !Boolean(project_object);
        return {
            title: isNew ? '' : project_object.title,
            short_description: isNew ? '' : project_object.short_description,
            description: isNew ? '' : project_object.description,
            seo_description: isNew ? '' : project_object.seo_description,
            seo_keywords: isNew ? '' : project_object.seo_keywords,
            created_by: isNew ? USERNAME : project_object.created_by,
            specificity: isNew ? '' : project_object.specificity,
            specificityData: isNew ? {} : project_object.specificity_data,
            facis: isNew ? {} : project_object.facis,
            notes: isNew ? {} : project_object.notes,
            resources: isNew ? {} : project_object.resources,
            news: isNew ? [] : project_object.news,
            isNew: isNew,
            titleVerboseName: TITLE_VERBOSE_NAME,
            shortDescriptionVerboseName: SHORT_DESCRIPTION_VERBOSE_NAME,
            descriptionVerboseName: DESCRIPTION_VERBOSE_NAME,
            has_access_to_edit: HAS_ACCESS_TO_EDIT,
            geoPoints: isNew ? [] : project_object.geo_points,
            contacts: isNew ? [] : project_object.contacts,
        };
    },
    methods: {
        save_project(event, fieldComponent) {
            let self = this;
            let form = event.target.form;
            data = {};
            data[fieldComponent.name] = fieldComponent.value;
            if (this.isNew) {
                $.ajax({
                    url: window.location.href + URL_PROJECT,
                    headers: {'X-CSRFToken': CSRF_TOKEN},
                    dataType: 'json',
                    contentType: 'application/json',
                    processData: false,
                    data: JSON.stringify(data),
                    success: function(result) {
                        fieldComponent.errorMessage = '';
                        history.pushState(
                            null,
                            null,
                            location.href.replace('/new', '/' + result.project_id),
                        );
                        fieldComponent.set_view();
                        self.isNew = false;
                    },
                    statusCode: {
                        500: function(xhr) {
                            clear_status_fields(form);
                            self.errorMessage = 'ошибка создания';
                        },
                        400: function(xhr) {
                            self.errorMessage = '';
                            clear_status_fields(form);
                            set_invalid_field(form, xhr.responseJSON);
                        },
                    },
                    method:'post',
                });
            } else {
                $.ajax({
                    url: window.location.href + URL_PROJECT,
                    headers: {'X-CSRFToken': CSRF_TOKEN},
                    dataType: 'json',
                    contentType: 'application/json',
                    processData: false,
                    data: JSON.stringify(data),
                    success: function(result) {
                        clear_status_fields(form);
                        set_valid_field(form, result.updated_fields);
                        self.successMessage = '';
                        fieldComponent.set_view();
                    },
                    statusCode: {
                        500: function(xhr) {
                            clear_status_fields(form);
                            self.errorMessage = 'ошибка сохранения';
                        },
                        400: function(xhr) {
                            self.errorMessage = '';
                            clear_status_fields(form);
                            set_invalid_field(form, xhr.responseJSON);
                        },
                    },
                    method:'post',
                });
            }
        },
        publicate_news(publicate_func, event, news_component) {
            let self = this;
            let form = event.target.form;
            $.ajax({
                url: window.location.href + URL_ADD_NEWS,
                headers: {"X-CSRFToken": CSRF_TOKEN},
                dataType: 'json',
                data: {title: news_component.added_title, text: news_component.added_text},
                success: function(result) {
                    publicate_func({title: news_component.added_title, text: news_component.added_text, pk: result.id, dt_create: result.dt_create});
                    self.$.vnode.key = result.id;
                    self.badMessage = '';
                },
                statusCode: {
                    500: function(xhr) {
                        self.badMessage = 'ошибка сервера'
                    },
                    400: function(xhr) {
                        clear_status_fields(form);
                        set_invalid_field(form, xhr.responseJSON);
                        self.badMessage = '';
                    },
                    404: function(xhr) {
                        self.badMessage = 'такой проект не существует'
                    },
                },
                method: "post"
            });
        }
    },
    template: `
        <div class="row">
            <div class="col sm-6">
                <form>
                    <field-editor-component
                         name-editor-component="field-input-component"
                         name-viewer-component="teleport-to-header-component"
                         v-model="title"
                         name="title"
                         :is-edit="isNew"
                         @save="save_project"
                         :verbose-name="titleVerboseName"
                         :show-cancel-btn="!isNew"
                    >[[ title ]]</field-editor-component>
                    <br>
                    <field-editor-component
                        name-editor-component="field-textarea-component"
                        name-viewer-component="div"
                        v-model="short_description"
                        name="short_description"
                        :disabled="isNew"
                        :is-edit="isNew"
                        @save="save_project"
                        :verbose-name="shortDescriptionVerboseName"
                        :title="isNew ? 'Пожалуйста, заполните и сохраните название проекта' : ''"
                        :show-cancel-btn="!isNew"
                    >[[ short_description ]]</field-editor-component>
                    <br>
                    <field-editor-component
                        name-editor-component="field-textarea-component"
                        name-viewer-component="div"
                        v-model="description"
                        name="description"
                        :disabled="isNew"
                        :is-edit="isNew"
                        @save="save_project"
                        :verbose-name="descriptionVerboseName"
                        :title="isNew ? 'Пожалуйста, заполните и сохраните название проекта' : ''"
                        :show-cancel-btn="!isNew"
                    >[[ description ]]</field-editor-component>
                    <br v-if="has_access_to_edit">
                    <field-editor-component
                        name-editor-component="field-input-component"
                        name-viewer-component="div"
                        v-if="has_access_to_edit"
                        v-model="seo_keywords"
                        name="seo_keywords"
                        :disabled="isNew"
                        :is-edit="isNew"
                        @save="save_project"
                        verbose-name="SEO ключевые слова"
                        :title="isNew ? 'Пожалуйста, заполните и сохраните название проекта' : ''"
                        :show-cancel-btn="!isNew"
                    >[[ seo_keywords ]]</field-editor-component>
                    <field-editor-component
                        name-editor-component="field-textarea-component"
                        name-viewer-component="div"
                        v-if="has_access_to_edit"
                        v-model="seo_description"
                        name="seo_description"
                        :disabled="isNew"
                        :is-edit="isNew"
                        @save="save_project"
                        verbose-name="SEO-описание"
                        :title="isNew ? 'Пожалуйста, заполните и сохраните название проекта' : ''"
                        :show-cancel-btn="!isNew"
                    >[[ seo_description ]]</field-editor-component>
                    <br>
                    <field-editor-component
                        name-editor-component="field-contact-component"
                        name-viewer-component="div"
                        v-model="contacts"
                        name="contacts"
                        :disabled="isNew"
                        :is-edit="isNew"
                        @save="save_project"
                        verbose-name="Контакты"
                        :title="isNew ? 'Пожалуйста, заполните и сохраните название проекта' : ''"
                        :show-cancel-btn="!isNew"
                    >
                        <button v-if="has_access_to_edit" class="btn btn-outline-secondary">Показать контакты</button>
                        <span v-else>Всего контактов: [[ contacts.length ]]</span>
                        <ul>
                            <li v-for="contact in contacts">
                                [[ contact.sign ]]:
                                <a v-if="contact.contact_type == 4" :href="contact.value">[[ contact.value ]]</a>
                                <a v-else-if="contact.contact_type == 2" :href="'tel:'+contact.value">[[ contact.value ]]</a>
                                <a v-else-if="contact.contact_type == 3" :href="'mailto:'+contact.value">[[ contact.value ]]</a>
                                <span v-else>[[ contact.value ]]</span>
                            </li>
                        </ul>
                    </field-editor-component>
                    <br>
                    <field-editor-component
                        name-editor-component="field-map-component"
                        name-viewer-component="view-map-component"
                        v-model="geoPoints"
                        name="geo_points"
                        :disabled="isNew"
                        :is-edit="false"
                        @save="save_project"
                        verbose-name="Местоположения"
                        :show-cancel-btn="!isNew"
                    >Всего местоположений: [[ geoPoints.length ]]</field-editor-component>
                </form>

                <!--<br><p>
                    <li>Добавлено пользователем: [[created_by]]</li>
                </p>-->

                <h4>Новости проекта</h4>

                <news-block-component
                    :isNew="isNew"
                    :project_news="news"
                    @publicate="publicate_news"
                ></news-block-component>

            </div>

            <div class="col sm-6">
                <!--
                <h4>Цели проекта</h4>
                <h4>Связь с участниками</h4>
                -->

                <specificities-component
                    :isNew="isNew"
                    :specificity="specificity"
                    :specificity-data="specificityData"
                ></specificities-component>

                <linker-component
                    item="LinkerItemFaciComponent"
                    title="Холсты фасилитации"
                    :objects="facis.objects"
                    :num-pages="facis.num_pages"
                    :page="facis.page"
                    create-object-text="Новая встреча"
                    :create-object-url="facis.url_new"
                    :show-create-btn="!isNew"
                    :error="facis.error"
                ></linker-component>

                <linker-component
                    item="LinkerItemNoteComponent"
                    title="База знаний"
                    :objects="notes.objects"
                    :num-pages="notes.num_pages"
                    :page="notes.page"
                    create-object-text="Новая заметка"
                    :create-object-url="notes.url_new"
                    :show-create-btn="!isNew"
                    :error="notes.error"
                ></linker-component>

                <linker-component
                    item="LinkerItemResourceComponent"
                    title="Ресурсы"
                    :objects="resources.objects"
                    :num-pages="resources.num_pages"
                    :page="resources.page"
                    create-object-text="Добавить ресурс"
                    :create-object-url="resources.url_new"
                    :show-create-btn="!isNew"
                    :error="resources.error"
                ></linker-component>
            </div>
        </div>
    `,
}
