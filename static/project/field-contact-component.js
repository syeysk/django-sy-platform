FieldContactComponent = {
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
    data() {
        return {
            contact_types: JSON.parse(document.getElementById('contact_types_json').textContent),
        };
    },
    methods: {
        add() {
            this.value.push({sign: '', contact_type: this.contact_types[1], value: ''});
        },
        save(event) {
            let index = parseInt(event.target.closest('tr').dataset.index);
            let contact = this.value[index];
            let self = this;
            $.ajax({
                url: window.location.href + '/contact/' + (contact.id ? contact.id+'/edit/' : 'create/'),
                headers: {"X-CSRFToken": CSRF_TOKEN},
                dataType: 'json',
                data: {sign: contact.sign, value: contact.value, contact_type: contact.contact_type},
                success: function(result) {
                    contact.id = result.pk;
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
                },
                method: "post",
            });
        },
        del(event) {
            let index = parseInt(event.target.closest('tr').dataset.index);
            let contact = this.value[index];
            if (!contact.id) {
                this.value.splice(index, 1);
                return;
            }
            let self = this;
            $.ajax({
                url: window.location.href + '/contact/' + contact.id + '/delete/',
                headers: {"X-CSRFToken": CSRF_TOKEN},
                dataType: 'json',
                data: {},
                success: function(result) {
                    self.value.splice(index, 1);
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
                },
                method: "post",
            });
        }
    },
    template: `
        <table>
            <tr v-for="(contact, index) in value" :key="contact.id" :data-index="index">
                <td>
                    <input type="text" name="sign" v-model="contact.sign">
                </td>
                <td>
                    <select name="contact_type" v-model="contact.contact_type">
                        <option :value="ctype_id" v-for="(ctype_name, ctype_id) in contact_types" :selected="ctype_id == contact.contact_type">[[ctype_name]]</option>
                    </select>
                </td>
                <td>
                    <input type="text" name="value" v-model="contact.value">
                </td>
                <td>
                    <span @click="save">V</span>
                    <span @click="del">X</span>
                </td>
            </tr>
            <tr cols="4">
                 <td><input type="button" value="Добавить контакт" @click="add"></td>
            </tr>
        </table>
    `,
}
