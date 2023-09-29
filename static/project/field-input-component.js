FieldInputComponent = {
    props: ['name', 'modelValue'],
    emits: ['update:modelValue'],
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
    template: `
        <div class="mb-3 form-group" :id="name + '-group'">
            <div class="form-floating">
                <input v-model="value" class="form-control" type="input" :name="name" :id="name + '-field'" v-bind="$attrs">
                <label :for="name + '-field'" class="form-label"><slot/></label>
            </div>
        </div>
    `,
}
