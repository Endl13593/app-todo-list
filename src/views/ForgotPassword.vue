<template>
    <div>
        <h3 class="py-2 mb-8 text-gray-500 text-lg font-medium text-center">
            Esqueci minha senha
        </h3>

        <AlertMessage
            v-if="response.message"
            :content="response"
        />

        <ValidationObserver
            ref="forgotPasswordForm"
            tag="form"
            @submit.stop.prevent="forgotPassword()"
        >
            <div class="grid gap-2">
                <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|email"
                    name="e-mail"
                >
                    <input
                        v-model="email"
                        type="text"
                        placeholder="Digite seu e-mail"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >

                    <ErrorMessageValidate
                        v-if="!!errors[0]"
                        :errors="errors"
                    />
                </ValidationProvider>

                <button
                    type="submit"
                    :disabled="spinner.forgot_password"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.forgot_password"
                        src="@/assets/img/spinner.svg"
                        alt=""
                        class="w-5 h-5 mr-2"
                    >

                    RECUPERAR SENHA
                </button>

                <div class="my-4 text-center">
                    <RouterLink
                        :to="{ name: 'login' }"
                        class="text-sm font-light"
                    >
                        Login
                    </RouterLink>
                </div>
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import messages from '@/utils/messages';

    export default {
        name: 'ForgotPassword',

        components: {
            ValidationObserver,
            ValidationProvider,
        },

        data() {
            return {
                email: '',
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    forgot_password: false,
                },
            };
        },

        methods: {
            async forgotPassword() {
                const validator = await this.$refs.forgotPasswordForm.validate();
                if (!validator) { return; }

                this.resetResponse();

                this.spinner.forgot_password = true;

                this.$axios.post('v1/forgot-password', { email: this.email }).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'Enviamos um e-mail com instruções de recuperação de senha.';

                    this.resetForm();
                }).catch((error) => {
                    const errorCode = error?.response?.data?.error || 'ServerError';
                    this.response.color = 'red';
                    this.response.message = messages[errorCode];
                }).finally(() => {
                    this.spinner.forgot_password = false;
                });
            },

            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },

            resetForm() {
                this.$refs.forgotPasswordForm.reset();
                this.email = '';
            },
        },
    };
</script>
