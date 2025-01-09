let pano;
let skin;

// Ensure pano is initialized only once
function initializePano() {
  if (!pano) {
    pano = new pano2vrPlayer("container");
    pano.setQueryParameter("ts=68917192");
    skin = new pano2vrSkin(pano);
  }
}

export { pano, initializePano };
