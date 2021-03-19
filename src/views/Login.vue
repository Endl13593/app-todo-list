<template>
    <div style="height: 300px;">
        <LoginMenu />

        <AlertMessage
            v-if="response.message"
            :content="response"
        />

        <ValidationObserver
            ref="loginForm"
            tag="form"
            @submit.stop.prevent="login"
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
                    rules="required"
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
                    :disabled="spinner.login"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.login"
                        src="@/assets/img/spinner.svg"
                        alt=""
                        class="w-5 h-5 mr-2"
                    >
                    ENTRAR
                </button>

                <div class="my-4 text-center">
                    <RouterLink
                        :to="{ name: 'forgotPassword' }"
                        class="text-sm font-light"
                    >
                        Esqueci minha senha
                    </RouterLink>
                </div>
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
    import LoginMenu from '@/components/Auth/LoginMenu';
    import Cookie from '@/service/cookie';
    import { mapActions } from 'vuex';
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import message from '@/utils/messages';

    export default {
        name: 'Login',

        components: {
            LoginMenu,
            ValidationObserver,
            ValidationProvider,
        },

        data() {
            return {
                payload: {
                    email: '',
                    password: '',
                },
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    login: false,
                },
            };
        },

        methods: {
            async login() {
                const validator = await this.$refs.loginForm.validate();
                if (!validator) { return; }

                this.resetResponse();

                this.spinner.login = true;

                this.$axios.post('v1/login', this.payload).then((response) => {

                    const token = `${response.data.token_type} ${response.data.access_token}`;
                    Cookie.setToken(token);
                    this.SET_USER(response.data.data);
                    this.$router.push({ name: 'index' });

                }).catch((error) => {

                    const errorCode = error?.response?.data?.error || 'ServerError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];

                }).finally(() => { this.spinner.login = false; });
            },

            ...mapActions('user', ['SET_USER']),

            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },
        },
    };
</script>
