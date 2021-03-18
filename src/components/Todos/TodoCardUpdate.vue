<template>
    <ValidationObserver
        ref="todoUpdateForm"
        tag="form"
        @submit.stop.prevent="onSave"
    >
        <div class="flex items-center bg-gray-300 rounded-sm px-4 h-15 mb-2">
            <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                name="label"
                class="w-full mr-3"
            >
                <input
                    ref="label"
                    v-model="localLabel"
                    type="text"
                    placeholder="Digite o nome da sua lista ..."
                    class="bg-gray-300 placeholder-gray-500 text-gray-700 font-light focus:outline-none block w-full appearance-none leading-normal"
                >

                <ErrorMessageValidate
                    v-if="!!errors[0]"
                    :errors="errors"
                />
            </ValidationProvider>

            <div class="flex items-center ml-auto">
                <a
                    href=""
                    class="text-xs text-gray-900 mr-2 focus:outline-none"
                    @click.stop.prevent="onCancel"
                >
                    Cancelar
                </a>

                <button
                    type="submit"
                    class="bg-blue-700 text-blue-100 text-xs font-semibold px-2.5 py-1 rounded focus:outline-none"
                >
                    OK
                </button>
            </div>
        </div>
    </ValidationObserver>
</template>

<script>
    import { ValidationObserver, ValidationProvider } from 'vee-validate';

    export default {
        name: 'TodoCardUpdate',

        data() {
            return {
                localLabel: this.todo.label,
            };
        },

        mounted() {
            this.$refs.label.focus();
        },

        components: {
            ValidationObserver,
            ValidationProvider,
        },

        props: {
            todo: {
                type: Object,
                default: () => ({}),
            },
        },

        methods: {
            onCancel() {
                this.$emit('cancel');
            },

            async onSave() {
                const validator = await this.$refs.todoUpdateForm.validate();
                if (!validator) { return; }

                this.$axios.put(`v1/todos/${this.todo.id}`, {label: this.localLabel}).then(() => {
                    this.todo.label = this.localLabel;
                    this.onCancel();
                });
            },
        },
    };
</script>

<style scoped>

</style>