LinkerComponent = {
    props: [
        'title',
        'objects',
        'numPages',
        'item',
        'page',
        'createObjectText',
        'createObjectUrl',
        'showCreateBtn',
        'error',
    ],
    data() {
       return {is_auth: IS_AUTHENTICATED};
    },
    components: {LinkerItemFaciComponent, LinkerItemNoteComponent},
    template: `
        <h4>[[ title ]]</h4>
        <ul>
            <component :is="item" v-for="object in objects" :object="object" :key="object.id"></component>
       </ul>
       <p v-if="error" style="color: grey;">[[ error ]]</p>
       <div v-if="is_auth">
           <div style="text-align:right;" v-if="showCreateBtn">
               <a :href="createObjectUrl" target="_blank"><button class="btn btn-outline-secondary">[[createObjectText]]</button></a>
           </div>
           <p v-else style="color: grey;">
               добавление объектов станет доступно после сохранения названия проекта
           </p>
       </div>
    `,
}
