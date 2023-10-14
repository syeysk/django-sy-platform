NewsBlockComponent = {
		props: ['project_news', 'isNew'],
		components: {NewsComponent, FieldInputComponent, FieldTextareaComponent},
		emits: ['publicate'],
		data() {
				return {isView: true, added_title: '', added_text: '', has_access_to_edit: HAS_ACCESS_TO_EDIT};
		},
		methods: {
				startAdding(event) {
						this.isView = false;
				},
				publicate(project_news_for_publicating) {
						this.project_news.unshift(project_news_for_publicating);
						if (this.project_news.length > 10) {
								this.project_news.pop();
						}
						this.isView = true;
						this.added_text = '';
						this.added_title = '';
				},
				on_publicate(event) {
						this.$emit('publicate', this.publicate, event, this)
				},
				cancel(event) {
						this.isView = true;
						this.added_text = '';
						this.added_title = '';
				},
		},
		template: `
		<form v-if="!isNew">
				<input type="button" value="Добавить новость" class="btn btn-outline-secondary" v-if="has_access_to_edit && isView" @click="startAdding">
				<div v-if="!isView">
						<field-input-component v-model="added_title" name="title">Заголовок новости</field-input-component>
						<field-textarea-component v-model="added_text" name="text">Текст новости</field-textarea-component>
						<br>
						<input type="button" value="Опубликовать" class="btn btn-outline-secondary" @click="on_publicate">
						<input type="button" value="Отменить" class="btn btn-outline-secondary" @click="cancel">
						<br><br>
				</div>
		</form>
		<news-component
				v-for="news in project_news"
				:key="news.pk"
				:title="news.title"
				:text="news.text"
				:dt_create="news.dt_create"
		></news-component>
		`,
}
