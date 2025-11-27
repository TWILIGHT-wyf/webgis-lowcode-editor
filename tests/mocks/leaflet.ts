// 简易 Leaflet Mock（供测试使用）
export function map() {
  return {
    setView: () => {},
    on: () => {},
    off: () => {},
    addLayer: () => {},
    remove: () => {},
    getCenter: () => ({ lat: 0, lng: 0 }),
    getZoom: () => 1,
  }
}

export function tileLayer() {
  return { addTo: () => {} }
}

export function marker() {
  return { addTo: () => {}, bindPopup: () => {}, on: () => {}, setLatLng: () => {} }
}

export function geoJSON() {
  return { addTo: () => {} }
}

export const control = { layers: () => ({ addTo: () => {} }) }
