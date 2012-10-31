iD.GeoJSON = {
    mapping: function(entity) {
        if (this.mappings[entity.type]) {
            return this.mappings[entity.type](entity);
        }
    },
    mappings: {
        node: function(entity) {
            return {
                type: 'Feature',
                properties: entity.tags,
                geometry: {
                    type: 'Point',
                    coordinates: [entity.lon, entity.lat]
                }
            };
        },
        way: function(entity) {
            return {
                type: 'Feature',
                properties: entity.tags,
                geometry: {
                    'type': 'LineString',
                    'coordinates': _.map(entity.nodes, function(node) {
                        return [node.lon, node.lat];
                    })
                }
            };
        }
    }
};
