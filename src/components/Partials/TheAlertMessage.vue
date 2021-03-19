<template>
    <div :class="`rounded-sm bg-${content.color}-100 p-4 mb-4 text-center`">
        <h3 :class="`text-sm leading-5 font-medium text-${content.color}-800`">
            {{ content.message }}
        </h3>
    </div>
</template>

<script>
    export default {
        name: 'TheAlertMessage',
        props: {
            content: { type: Object, required: true },
        },
    };
</script>