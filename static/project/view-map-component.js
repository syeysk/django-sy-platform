ViewMapComponent = {
    props: ['value'],
    template: `
        <div>
            <slot/>
            <div id="project_map" style="width: 100%; height:200px; background: white;"></div>
        </div>
    `,
    mounted() {
		    OSMStandard = new ol.layer.Tile({
  					source: new ol.source.OSM(),
  					visible: true,
  					title: 'OSMStandard',
				});

				this.view = new ol.View({
						center: [0, 0],
						zoom: 2,
				})

				const map = new ol.Map({
						target: 'project_map',
						layers: [OSMStandard],
						view: this.view,
				});
				this.map = map;

        let self = this;
				for (let point of this.value) {
    				this.add_point(point, true);
    		}
    },
    methods: {
        add_point(coord, transform) {
						const Point = new ol.geom.Point(
								//ol.proj.fromLonLat(coord)
								transform ? ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857') : coord
						);
						const feature = new ol.Feature(Point);

						let vector_source = new ol.source.Vector({
								features: [feature],
						})

						let point_layer = new ol.layer.VectorImage({
								source: vector_source,
								title: 'Проект',
						});
						this.map.addLayer(point_layer);
				},
    },
}
