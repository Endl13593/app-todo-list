<template>
    <div>
        <h3 class="py-2 mb-8 text-gray-500 text-lg font-medium text-center">
            Recuperar senha
        </h3>

        <AlertMessage
            v-if="response.message"
            :content="response"
        />

        <ValidationObserver
            ref="resetPasswordForm"
            tag="form"
            @submit.stop.prevent="resetPassword"
        >
            <div class="grid gap-2">
                <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|email"
                    name="e-mail"
                >
                    <input
                        v-model="payload.email"
                        type="text"
                        placeholder="Digite seu e-mail"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >

                    <ErrorMessageValidate
                        v-if="!!errors[0]"
                        :errors="errors"
                    />
                </ValidationProvider>

                <ValidationProvider
                    v-slot="{ errors }"
                    :rules="{ required: true, min: 8, max: 30, regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/ }"
                    name="senha"
                >
                    <input
                        v-model="payload.password"
                        type="password"
                        placeholder="Digite sua senha"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >

                    <ErrorMessageValidate
                        v-if="!!errors[0]"
                        :errors="errors"
                    />
                </ValidationProvider>

                <button
                    type="submit"
                    :disabled="spinner.reset_password"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.reset_password"
                        src="@/assets/img/spinner.svg"
                        alt=""
                        class="w-5 h-5 mr-2"
                    >

                    ALETRAR SENHA
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
        name: 'ResetPassword',

        components: {
            ValidationObserver,
            ValidationProvider,
        },

        data() {
            return {
                payload: {
                    email: '',
                    password: '',
                    token: '',
                },
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    reset_password: false,
                },
            };
        },

        beforeRouteEnter(to, from, next) {
            if (!to?.query?.token) {
                next({ name: 'login' });
            }

            next();
        },

        created() {
            this.payload.token = this.$route?.query?.token || '';
        },

        methods: {
            async resetPassword() {
                const validator = await this.$refs.resetPasswordForm.validate();
                if (!validator) { return; }

                this.resetResponse();

                this.spinner.reset_password = true;

                this.$axios.post('v1/reset-password', this.payload).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'Senha alterada com sucesso!';

                    this.resetForm();
                }).catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServerError';
                    this.response.color = 'red';
                    this.response.message = messages[errorCode];
                }).finally(() => {
                    this.spinner.reset_password = false;
                });
            },

            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },

            resetForm() {
                this.$refs.resetPasswordForm.reset();
                this.payload.email = '';
                this.payload.password = '';
                this.payload.token = '';
            },
        },
    };
</script>
