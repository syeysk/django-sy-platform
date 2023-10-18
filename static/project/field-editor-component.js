FieldEditorComponent = {
    props: ['name', 'modelValue', 'isEdit', 'verboseName', 'nameEditorComponent', 'nameViewerComponent', 'showCancelBtn'],
    data() {
        return {mIsEdit: this.isEdit, errorMessage: '', prevValue: '', has_access_to_edit: HAS_ACCESS_TO_EDIT,};
    },
    components: {FieldInputComponent, FieldTextareaComponent, TeleportToHeaderComponent, FieldMapComponent},
    emits: ['update:modelValue', 'save'],
    computed: {
        value: {
            get() {
               return this.modelValue;
            },
            set(value) {
               this.$emit('update:modelValue', value);
            },
        },
    },
    methods: {
        set_edit(event) {
            this.mIsEdit = true;
            this.prevValue = this.value;
        },
        set_view(event) {
            this.mIsEdit = false;
        },
        cancel(event) {
            this.value = this.prevValue;
            this.set_view();
        },
        save(event) {
            this.$emit('save', event, this);
        },
    },
    template: `
        <div v-if="mIsEdit">
            <component :is="nameEditorComponent" v-model="value" v-bind="$attrs" :name="name">[[verboseName]]</component>
            <div>
								<span>[[ errorMessage ]]</span>
								<br v-if="errorMessage">
								<input type="button" value="Сохранить" @click="save" class="btn btn-primary">
								<input type="button" value="Отменить" @click="cancel" class="btn btn-secondary" v-if="showCancelBtn">
						</div>
        </div>
        <div v-else>
            <component :is="nameViewerComponent">
                <slot/>
                <span v-if="!value">[[verboseName]] отсутствует</span>
                <span @click="set_edit" class="btn_edit" v-if="has_access_to_edit">edit</span>
            </component>
        </div>
    `,
}
