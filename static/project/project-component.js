ProjectComponent = {
		props: [],
		components: {FieldEditorComponent, LinkerComponent, NewsBlockComponent, SpecificitiesComponent},
		data() {
				let project_object = JSON.parse(document.getElementById('project_json').textContent);
				let isNew = !Boolean(project_object);
				return {
						title: isNew ? '' : project_object.title,
						short_description: isNew ? '' : project_object.short_description,
						description: isNew ? '' : project_object.description,
						created_by: isNew ? USERNMAE : project_object.created_by,
						specificity: isNew ? '' : project_object.specificity,
						specificityData: isNew ? {} : project_object.specificity_data,
						facis: isNew ? {} : project_object.facis,
						notes: isNew ? {} : project_object.notes,
						news: isNew ? [] : project_object.news,
						isNew: isNew,
						titleVerboseName: TITLE_VERBOSE_NAME,
						shortDescriptionVerboseName: SHORT_DESCRIPTION_VERBOSE_NAME,
						descriptionVerboseName: DESCRIPTION_VERBOSE_NAME,
				};
		},
		methods: {
				save_project(event, fieldComponent) {
						let self = this;
						let form = event.target.form;
						if (this.isNew) {
								send_form({
										url: window.location.href + URL_PROJECT,
										form: form,
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
										'self': fieldComponent,
								});
						} else {
								send_form({
										url: window.location.href + URL_PROJECT,
										form: form,
										success: function(result) {
												clear_status_fields(form);
												set_valid_field(form, result.updated_fields);
												self.successMessage = '';
												fieldComponent.set_view();
										},
										'self': fieldComponent,
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
										>[[ titleVerboseName ]]</field-editor-component>
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
												:title="isNew ? 'Пожалуйста заполните и сохраните название проекта' : ''"
												:show-cancel-btn="!isNew"
										>[[ shortDescriptionVerboseName ]]</field-editor-component>
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
												:title="isNew ? 'Пожалуйста заполните и сохраните название проекта' : ''"
												:show-cancel-btn="!isNew"
										>[[ descriptionVerboseName ]]</field-editor-component>
								</form>

								<br>

								<p>
										<li>Автор проекта: [[created_by]]</li>
								</p>

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

						</div>
				</div>
		`,
}
