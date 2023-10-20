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
        return {baseLayersGroup: null, feature_id: 1, map: null};
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

				this.view = new ol.View({
						center: [0, 0],
						zoom: 2,
				})

				const map = new ol.Map({
						target: 'project_map',
						layers: [OSMStandard],
						view: this.view,
				});
				map.addLayer(this.baseLayersGroup);
				this.map = map;

        let self = this;
				for (let point of this.value) {
    				this.add_point(point, true);
    		}

 				this.$el.nextElementSibling.style.position = 'fixed';
 				this.$el.nextElementSibling.style.zIndex = 2;
 				this.$el.nextElementSibling.style.bottom = '10px';
 				this.$el.nextElementSibling.style.left = 0;
 				this.$el.nextElementSibling.style.width = '100%';
 				this.$el.nextElementSibling.style.textAlign = 'center';

 				map.on('click', function(event) {
 				    let features_to_delete = [];
            map.forEachFeatureAtPixel(event.pixel, function(feature,layer) {
								features_to_delete.push(feature);
						});
						if (features_to_delete.length > 1) {
    						self.view.animate({zoom: self.view.getZoom() + 1.5})
    						return;
    				}
						if (features_to_delete.length == 1) {
						    self.delete_feature(features_to_delete[0]);
						    self.actualize_value();
						    return;
						}

     				self.add_point(event.coordinate, false);
     				self.actualize_value();
 				})
    },
    methods: {
        select_layer(event) {
						this.baseLayersGroup.getLayers().forEach(function(element, index, array) {
								element.setVisible(element.get('title') === event.target.value);
						});
        },
        add_point(coord, transform) {
						const Point = new ol.geom.Point(
								//ol.proj.fromLonLat(coord)
								transform ? ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857') : coord
						);
						const feature = new ol.Feature(Point);
						feature.setId(this.feature_id);
						this.feature_id += 1;

						let vector_source = new ol.source.Vector({
								features: [feature],
						})

						let point_layer = new ol.layer.VectorImage({
								source: vector_source,
								title: 'Проект',
						});
						this.map.addLayer(point_layer);
				},
				delete_feature(feature) {
    				const featureId = feature.getId();
						this.map.getLayers().getArray().forEach(layer => {
						    if (!layer.getSource) return;
							  const source = layer.getSource();
						    if (!source.getFeatureById) return;
								const featureExists = source.getFeatureById(featureId);
								if (featureExists) {
								  	source.removeFeature(feature);
								  	this.map.removeLayer(layer);
								  	return;
							  }
    		    })
				},
				actualize_value() {
    				let value = []
     				for (let layer of this.map.getAllLayers()) {
     				    let source = layer.getSource();
     				    if (source.getFeatures) {
										let features = source.getFeatures();
										if (features && features[0].getGeometry) {
										    let feature_coords = features[0].getGeometry().getCoordinates();
    										value[value.length] = ol.proj.transform(feature_coords, 'EPSG:3857', 'EPSG:4326');
    							  }
								}
     				}
     				this.value = value;
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
