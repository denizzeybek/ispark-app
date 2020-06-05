<template>
    <div class="otopark">
        <vs-table class="otopark__table" :data="parkInfos" search pagination stripe max-items="15">
            <template slot="header">
                <div>
                    <h3 style="padding: 10px">
                        İstanbul Büyükşehir Belediyesi İspark Otopark Listesi
                    </h3>
                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="name">
                    Park Adı
                </vs-th>
                <vs-th sort-key="district">
                    İlçe
                </vs-th>
                <vs-th sort-key="free_parking">
                    Bedava Park Süresi
                </vs-th>
                <vs-th sort-key="monthly_subscribe_price">
                    Aylık Abonelik Ücreti
                </vs-th>
                <vs-th sort-key="type">
                    Park Türü
                </vs-th>
                <vs-th>
                    Çalışma Saatleri
                </vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.name">
                        {{tr.name}}
                    </vs-td>

                    <vs-td :data="tr.district">
                        {{tr.district}}
                    </vs-td>

                    <vs-td v-if="tr.free_parking==0" :data="tr.free_parking">
                        Yok
                    </vs-td>

                    <vs-td v-else :data="tr.free_parking">
                        {{tr.free_parking}} dakika
                    </vs-td>

                    <vs-td :data="tr.monthly_subscribe_price">
                        {{tr.monthly_subscribe_price}} ₺
                    </vs-td>

                    <vs-td v-if="tr.type == 1" :data="tr.type">
                        Kapalı Otopark
                    </vs-td>

                    <vs-td v-else-if="tr.type == 2" :data="tr.type">
                        Yolüstü Otopark
                    </vs-td>

                    <vs-td v-else-if="tr.type == 3" :data="tr.type">
                        Açık Otopark
                    </vs-td>

                    <vs-td :data="tr.working_hours">
                        {{tr.working_hours}}
                    </vs-td>

                    <template class="expand-user" slot="expand">
                        <div class="con-expand-users">
                            <vs-list>
                                <vs-list-item style="padding: 10px;" icon="room" title="Açık adres"
                                    :subtitle="tr.adress"></vs-list-item>
                            </vs-list>
                        </div>
                    </template>

                </vs-tr>
            </template>
        </vs-table>
    </div>

</template>

<script>
    import axios from "axios"

    export default {
        data() {
            return {
                parkInfos: []
            }
        },
        created() {
            axios.get("http://localhost:3000/api/general_park_infos")
                .then(res => {
                    let rawParkData = res.data.response

                    rawParkData.map(item => {
                        axios.get("http://localhost:3000/api/park_properties/" + item.park_id)
                            .then(res => {
                                res.data.response.forEach(item2 => {
                                    if (item2.property_id == 1) {
                                        // Ucretsiz parklama suresi
                                        item.free_parking = item2.property_value
                                    } else if (item2.property_id == 2) {
                                        // Aylik abonelik ucreti 
                                        item.monthly_subscribe_price = item2.property_value
                                    } else if (item2.property_id == 4) {
                                        // Park kapasitesi
                                        item.capacity = item2.property_value
                                    }
                                })
                            })
                        axios.get("http://localhost:3000/api/park_working_hours/" + item.park_id)
                            .then(res => {
                                res.data.response.forEach(item2 => {
                                    item.working_hours =
                                        `${item2.hour_start} : ${item2.hour_end}`
                                })
                            })
                            .then(() => {
                                this.parkInfos.push({
                                    id: item.park_id,
                                    name: item.park_name,
                                    district: item.district_name,
                                    type: item.type_id,
                                    working_hours: item.working_hours,
                                    free_parking: item.free_parking,
                                    adress: item.adress,
                                    capacity: item.capacity,
                                    monthly_subscribe_price: item.monthly_subscribe_price
                                })
                            })

                    })
                })
        }
    }
</script>

<style scoped>
    .otopark {
        width: 75%;
        margin: 1rem auto;
    }

    .otopark__table {
        box-shadow: 0 5px 20px rgba(0, 0, 0, .1);
    }

    .vs-table--header {
        padding: 10px;
    }

    .vs-pagination--mb {
        justify-content: center !important;
    }

    .con-expand-users .vs-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 20px;
    }

    .con-expand-users .con-btns-user .con-userx {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .con-expand-users .list-icon i {
        font-size: 0.9rem !important;
    }

    .content-tr-expand {
        display: flex !important;
        justify-content: flex-start !important;
    }
</style>