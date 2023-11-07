SpecificityWebportalComponent = {
    props: ['object'],
    components: {FieldInputComponent},
    data() {
        if (this.object.url == undefined) {
            this.object.url = '';
        }
        return {has_access_to_edit: HAS_ACCESS_TO_EDIT}
    },
    template: `
        <div v-if="has_access_to_edit">
            <field-input-component v-model="object.url" name="url">URL</field-input-component>
        </div>
        <ul v-else>
             <li>Ссылка: <a :href="object.url">[[ object.url ]]</a></li>
        </ul>
    `
}
