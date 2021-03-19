<template>
    <div>
        <img
            v-if="spinner.verify_email"
            src="@/assets/img/spinner.svg"
            alt=""
            class="w-5 h-5 mr-2"
        >

        <AlertMessage
            v-if="response.message"
            :content="response"
        />
    </div>
</template>

<script>
    import message from '@/utils/messages';

    export default {
        name: 'VerifyEmail',

        data() {
            return {
                token: '',
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    verify_email: false,
                },
            };
        },

        created() {
            this.token = this.$route?.query?.token || '';
            this.verifyEmail();
        },

        beforeRouteEnter(to, from, next) {
            if (!to?.query?.token) {
                next({ name: 'login' });
            }

            next();
        },

        methods: {
            verifyEmail() {
                this.spinner.verify_email = true;

                this.$axios.post('v1/verify-email', { token: this.token }).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'E-mail verificado com sucesso!';
                }).catch((error) => {
                    const errorCode = error?.response?.data?.error || 'ServerError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => { this.spinner.verify_email = false; });
            },
        },
    };
</script>

<style scoped>

</style>