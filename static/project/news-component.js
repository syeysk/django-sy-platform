NewsComponent = {
		props: ['title', 'text', 'dt_create'],
		components: {},
		template: `
				<h5 style="padding-left: 25px;">[[ title ]]</h5>
				<span style="font-size: 9pt; color: grey;">[[ dt_create ]]</span>
				<p>[[ text ]]</p>
		`,
}
