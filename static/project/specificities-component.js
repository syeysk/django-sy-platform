SpecificitiesComponent = {
    props: ['specificity', 'specificityData', 'isNew'],
    data() {
        let specificities = JSON.parse(document.getElementById('specificities_json').textContent);
        return {
            specificities: specificities,
            mSpecificity: this.specificity,
            badMessage: '',
            has_access_to_edit: HAS_ACCESS_TO_EDIT,
        };
    },
    components: {SpecificityWebportalComponent, SpecificityCompostComponent},
    template: `
        <h4 v-if="!isNew && (mSpecificity || has_access_to_edit)">Вид деятельности<span v-if="!has_access_to_edit">: [[ specificities[mSpecificity] ]]</span></h4>
        <form v-if="!isNew && (mSpecificity || has_access_to_edit)">
            <div class="form-floating" v-if="has_access_to_edit">
                <select class="form-select" id="specificity-field" v-model="mSpecificity" name="specificity">
                    <option value="null" :selected="!mSpecificity">Не выбрано</option>
                    <option :value="spec_value" v-for="(spec_name, spec_value) of specificities" :selected="mSpecificity == spec_name">[[ spec_name ]]</option>
                </select>
                <label for="specificity-field">Вид деятельности</label>
            </div>
            <component
                v-if="mSpecificity"
                :is="'Specificity'+mSpecificity[0].toUpperCase()+mSpecificity.slice(1, -11)+'Component'"
                :object="specificityData"
            ></component>
            <div style="text-align: right;" v-if="has_access_to_edit">
                <br>
                <div v-if="badMessage">[[ badMessage ]]</div>
                <input type="button" value="Сохранить" class="btn btn-outline-secondary" @click="save">
            </div>
        </form>
    `,
    methods: {
        save(event) {
            let self = this;
            let form = event.target.form;
            $.ajax({
                url: window.location.href + URL_SAVE_SPECIFICITY,
                headers: {"X-CSRFToken": CSRF_TOKEN},
                dataType: 'json',
                contentType: 'application/json',
                processData: false,
                data: JSON.stringify({specificity: form.specificity.value, data: self.specificityData}),
                success: function(result) {
                    self.badMessage = '';
                    clear_status_fields(form);
                    set_valid_field(form, result.updated_fields);
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
}
