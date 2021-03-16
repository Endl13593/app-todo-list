<template>
    <div style="height: 300px;">
        <LoginMenu />

        <AlertMessage
            v-if="response.message"
            :content="response"
        />

        <ValidationObserver
            ref="registerForm"
            tag="form"
            @submit.stop.prevent="register"
        >
            <div class="grid gap-2">
                <div class="flex">
                    <div class="w-1/2 mr-2">
                        <ValidationProvider
                            v-slot="{ errors }"
                            rules="required"
                            name="primeiro nome"
                        >
                            <input
                                v-model="payload.firstName"
                                type="text"
                                placeholder="Digite seu nome"
                                class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                            >
                            <ErrorMessageValidate
                                v-if="!!errors[0]"
                                :errors="errors"
                            />
                        </ValidationProvider>
                    </div>

                    <div class="w-1/2  ml-2">
                        <input
                            v-model="payload.lastName"
                            type="text"
                            placeholder="Digite seu sobrenome"
                            class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                        >
                    </div>
                </div>

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
                    :disabled="spinner.register"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.register"
                        src="@/assets/img/spinner.svg"
                        alt=""
                        class="w-5 h-5 mr-2"
                    >
                    REGISTRAR
                </button>
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
    import LoginMenu from '@/components/Auth/LoginMenu';
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import message from '@/utils/messages';

    export default {
        name: 'Register',

        components: {
            LoginMenu,
            ValidationObserver,
            ValidationProvider,
        },

        data() {
            return {
                payload: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                },
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    register: false,
                },
            };
        },

        methods: {
            async register() {
                const validator = await this.$refs.registerForm.validate();
                if (!validator) { return; }

                this.resetResponse();
                this.spinner.register = true;

                this.$axios.post('v1/register', this.payload).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'Seu cadastro foi feito com sucesso. Verifique seu e-mail';
                    this.resetForm();
                }).catch((error) => {
                    const errorCode = error?.response?.data?.error || 'ServerError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => { this.spinner.register = false; });
            },

            resetResponse() {
                this.response.color   = '';
                this.response.message = '';
            },

            resetForm() {
                this.$refs.registerForm.reset();
                this.payload.firstName = '';
                this.payload.lastName  = '';
                this.payload.email     = '';
                this.payload.password  = '';
            },
        },
    };
</script>
