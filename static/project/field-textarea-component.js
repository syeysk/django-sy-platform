fieldTextareaComponent = {
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
                <textarea v-model="value" :name="name" style="width: 100%;" rows="5" class="form-control" v-bind="$attrs"></textarea>
                <label :for="name + '-field'" class="form-label"><slot/></label>
            </div>
        </div>
    `,
}
