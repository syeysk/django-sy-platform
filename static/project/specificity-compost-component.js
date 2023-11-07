SpecificityCompostComponent = {
    props: ['object'],
    components: {WindowComponent},
    data() {
        if (this.object.resources == undefined) {
            this.object.resources = new Object();
        }
        let compost_input_resources = JSON.parse(
            document.getElementById('compost_input_resources_json').textContent,
        );
        return {
            compostInputResources: compost_input_resources,
            isDisplayResourcesWindow: false,
            has_access_to_edit: HAS_ACCESS_TO_EDIT,
        };
    },
    template: `
        <div v-if="has_access_to_edit">
            <input type="button" value="Указать принимаемое вторсырьё" class="btn btn-outline-secondary" @click="this.isDisplayResourcesWindow = true;">
            <window-component title="Выберите принимаемое вторсырьё" v-if="isDisplayResourcesWindow" @close="this.isDisplayResourcesWindow = false;">
                <div v-for="resource in compostInputResources" :key="resource[0]" class="resource-item" :data-id="resource[0]">
                    <input type="checkbox" :value="resource[0]" :name="'input_resource[' +resource[0]+ ']'" @change="set_resource" :checked="object.resources[resource[0]]">
                    <span>[[ resource[1] ]]</span>
                    <br>
                    <input type="text" :value="object.resources[resource[0]] ? object.resources[resource[0]]['comment'] : ''" :name="'input_resource_comment[' +resource[0]+ ']'" @change="set_comment" :disabled="!(object.resources[resource[0]])">
                </div>
            </window-component>
        </div>
        <div v-else>
            Принимаемое вторсырьё:
            <ul>
                 <li v-for="resourceData, resourceId in object.resources" :key="resourceId">
                     [[ resourceData.name ]] <span v-if="resourceData.comment"> - [[ resourceData.comment ]]</span>
                 </li>
            </ul>
        </div>
    `,
    methods: {
        set_resource(event) {
            let checkbox = event.target;
            if (checkbox.checked) {
                let comment = checkbox.form['input_resource_comment[' +checkbox.value+ ']'].value;
                this.object.resources[checkbox.value] = {comment: comment};
            } else {
                this.object.resources[checkbox.value] = undefined;
            }
        },
        set_comment(event) {
            let comment = event.target.value;
            let resource_id = event.target.closest('.resource-item').dataset.id;
            let checkbox = event.target.form['input_resource[' +resource_id+ ']'];
            if (checkbox.checked) {
                this.object.resources[checkbox.value]['comment'] = comment;
            }
        },
    },
}
