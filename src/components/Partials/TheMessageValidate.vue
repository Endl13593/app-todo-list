<template>
    <div
        class="text-red-600 text-sm mb-2"
    >
        {{ errors[0] }}
    </div>
</template>

<script>
    export default {
        name: 'TheMessageValidate',
        props: {
            errors: { type: Array, required: true },
        },
    };
</script>