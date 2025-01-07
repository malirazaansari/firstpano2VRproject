import { pano, initializePano } from "./shared.js";

async function loadPanoramaConfig() {
  try {
    const response = await fetch("pano.xml");
    if (!response.ok) throw new Error("Failed to load pano.xml");

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    return xmlDoc;
  } catch (error) {
    console.error("Error loading pano.xml:", error);
    return null;
  }
}

window.addEventListener("load", async () => {
  try {
    // const pano = new pano2vrPlayer("container");
    // pano.setQueryParameter("ts=68917192");
    initializePano();

    // Handle node change and save to localStorage
    pano.on("changenode", function () {
      const currentNode = pano.getCurrentNode() || "unknown";
      console.log("Node changed to:", currentNode);
      saveLastNode(currentNode);
    });

    // Retrieve startNode from localStorage
    const lastNode = getLastNode();

    const configUrl = lastNode
      ? `pano.xml?ts=68917192&startnode=${lastNode}`
      : `pano.xml?ts=68917192`;

    // Load pano.xml and set the view to the last saved node
    pano.readConfigUrlAsync(`pano.xml?ts=68917192`, () => {
      console.log("Panorama configuration loaded.");
      if (lastNode) {
        pano.openNext(`{${lastNode}}`); // The second argument (true) may force the update if needed
        console.log("Panorama started with node:", lastNode); // Use last saved node as default view
      } else {
        console.warn("No saved node found. Using default view.");
      }
    });
  } catch (error) {
    console.error("An error occurred during initialization:", error);
  }
});

function saveLastNode(nodeId) {
  console.log(`Saving last node: ${nodeId}`);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("lastViewedNode", nodeId);
      console.log("Last node saved to localStorage:", nodeId);
    }
  } catch (e) {
    console.error("Failed to save last node to localStorage:", e);
  }
}

function getLastNode() {
  try {
    const lastNode = localStorage.getItem("lastViewedNode");
    console.log("Last node retrieved from localStorage:", lastNode);
    return lastNode;
  } catch (e) {
    console.error("Failed to retrieve last node from localStorage:", e);
    return null;
  }
}
