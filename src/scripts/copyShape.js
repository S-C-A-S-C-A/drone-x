function copyOptions (options) {
  let ret = {};
  for (let i in options) {
    let item = options[i];
    if (item && item.copy) {
      ret[i] = item.copy();
    } else if (item instanceof L.Layer) {
      ret[i] = copyShape(item);
    } else {
      ret[i] = item;
    }
  }
  return ret;
}

function copyInternals (internals) {
  let ret = {};
  for (let i in internals) {
    ret[i] = internals[i];
  }
  return ret;
}

export function copyShape (layer) {
  let options = copyOptions(layer.options);
  let internals = copyInternals(layer.internals);

  // Marker layers (unused so far. But, ready for the future, I guess?)
  if (layer instanceof L.Marker) {
    return L.marker(layer.getLatLng(), options);
  }
  if (layer instanceof L.CircleMarker) {
    return L.circleMarker(layer.getLatLng(), options);
  }

  if (layer instanceof L.Circle) {
    let clone = L.circle(layer.getLatLng(), layer.getRadius(), options);
    clone.internals = internals;
    return clone;
  }
  if (layer instanceof L.Rectangle) {
    let clone = L.rectangle(layer.getBounds(), options);
    clone.internals = internals;
    return clone;
  }
  if (layer instanceof L.Polygon) {
    let clone = L.polygon(layer.getLatLngs(), options);
    clone.internals = internals;
    return clone;
  }
  if (layer instanceof L.Polyline) {
    let clone = L.polyline(layer.getLatLngs(), options);
    clone.internals = internals;
    return clone;
  }
}
