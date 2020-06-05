<template>
    <div>
        <app-header />
        <park-tables />
    </div>
</template>

<script>
    import appHeader from "@/components/Header"
    import parkTables from "@/components/ParkTables"

    export default {
        components: {
            appHeader,
            parkTables,
        }
    }
</script>