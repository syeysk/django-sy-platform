FieldMapComponent = {
    props: ['name', 'modelValue'],
    emits: ['update:modelValue'],
    computed: {
        value: {
            get() {
               return this.modelValue;
            },
            set(value) {
               this.$emit('update:modelValue', value);
            },
        },
    },
    data() {
        return {baseLayersGroup: null};
    },
    mounted() {
		    OSMStandard = new ol.layer.Tile({
  					source: new ol.source.OSM(),
  					visible: true,
  					title: 'OSMStandard',
				});
		    OSMHumanitarian = new ol.layer.Tile({
  					source: new ol.source.OSM({
  					    url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  					}),
  					visible: false,
  					title: 'OSMHumanitarian',
				});
		    StamenTerrain = new ol.layer.Tile({
  					source: new ol.source.XYZ({
  					    url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
  					    attributions: 'Map tiles by <a href="https://stamen.com">',
  					}),
  					visible: false,
  					title: 'StamenTerrain',
				});

				this.baseLayersGroup = new ol.layer.Group({
				    layers: [OSMStandard, OSMHumanitarian, StamenTerrain],
				});

				const map = new ol.Map({
						target: 'project_map',
						layers: [OSMStandard],
						view: new ol.View({
				  			center: [0, 0],
					   		zoom: 2,
						}),
				});
				map.addLayer(this.baseLayersGroup);

        function add_point(coord, transform) {
						const Point = new ol.geom.Point(
								//ol.proj.fromLonLat(coord)
								transform ? ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857') : coord
						);
						const feature = new ol.Feature(Point);

						this.vector_source = new ol.source.Vector({
								features: [feature],
						})

						this.point_layer = new ol.layer.VectorImage({
								source: this.vector_source,
								title: 'Проект',
						});
						map.addLayer(this.point_layer);
				}

				for (let point of this.value) {
    				add_point(point, true);
    		}

 				this.$el.nextElementSibling.style.position = 'fixed';
 				this.$el.nextElementSibling.style.zIndex = 2;
 				this.$el.nextElementSibling.style.bottom = '10px';
 				this.$el.nextElementSibling.style.left = 0;
 				this.$el.nextElementSibling.style.width = '100%';
 				this.$el.nextElementSibling.style.textAlign = 'center';

        let self = this;
 				map.on('click', function(event) {
     				add_point(event.coordinate, false);
     				let value = []
     				for (let layer of this.getAllLayers()) {
     				    let source = layer.getSource();
     				    if (source.getFeatures) {
										let features = source.getFeatures();
										if (features && features[0].getGeometry) {
										    let feature_coords = features[0].getGeometry().getCoordinates();
    										value[value.length] = ol.proj.transform(feature_coords, 'EPSG:3857', 'EPSG:4326');
    							  }
								}
     				}
     				self.value = value;
 				    //let vectorContext = ol.render.getVectorContext(event);
						//let point = new ol.geom.Point(event.coordinate);
						//let feature = new ol.Feature(Point);
						//self.vector_source.addFeature(feature);
						//vectorContext.drawGeometry(point);
						//map.render();
 				})
    },
    methods: {
        select_layer(event) {
						this.baseLayersGroup.getLayers().forEach(function(element, index, array) {
								element.setVisible(element.get('title') === event.target.value);
						});
        },
    },
    template: `
        <div>
            <input v-model="value" type="hidden" :name="name" v-bind="$attrs">
            <div id="filter_form" style="right: 0; max-width: 150px; z-index: 2; position: fixed; top: 41.4px; background: white; opacity: 0.8">
								<input type="radio" name="baseLayerRadioButton" value="OSMStandard" checked @change="select_layer">OSM Standard<br>
								<input type="radio" name="baseLayerRadioButton" value="OSMHumanitarian" @change="select_layer">OSM Humanitarian<br>
								<input type="radio" name="baseLayerRadioButton" value="StamenTerrain" @change="select_layer">Stamen Terrain<br>
						</div>
            <div id="project_map" style="left: 0; width: 100%; z-index: 1; position: fixed; height: calc(100vh - 41.4px); top: 41.4px; background: white;"></div>
        </div>
    `,
}
