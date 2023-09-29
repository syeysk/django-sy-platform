FieldEditorComponent = {
    props: ['modelValue', 'isEdit', 'verboseName', 'nameEditorComponent', 'nameViewerComponent', 'showCancelBtn'],
    data() {
        return {mIsEdit: this.isEdit, errorMessage: '', prevValue: '', is_auth: IS_AUTHENTICATED};
    },
    components: {FieldInputComponent, FieldTextareaComponent, TeleportToHeaderComponent},
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
        <div v-if="!mIsEdit">
            <component :is="nameViewerComponent">
                [[ value ]]
                <span v-if="!value">[[verboseName]] отсутствует</span>
                <span @click="set_edit" class="btn_edit" v-if="is_auth">edit</span>
            </component>
        </div>
        <div v-else>
            <component :is="nameEditorComponent" v-model="value" v-bind="$attrs"><slot/></component>
            <span>[[ errorMessage ]]</span>
            <br v-if="errorMessage">
            <input type="button" value="Сохранить" @click="save" class="btn btn-primary">
            <input type="button" value="Отменить" @click="cancel" class="btn btn-secondary" v-if="showCancelBtn">
        </div>
    `,
}
