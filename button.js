import { pano, initializePano } from "./shared.js";

async function loadMenuFromXML() {
  try {
    initializePano();

    const response = await fetch("pano.xml");
    if (!response.ok) throw new Error("Failed to load pano.xml");

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const panoramas = xmlDoc.getElementsByTagName("panorama");

    const menuContainer = document.getElementById("menu");

    menuContainer.innerHTML = "";

    Array.from(panoramas).forEach((panorama) => {
      const nodeId = panorama.getAttribute("id");
      const button = document.createElement("button");
      button.textContent = `Node: ${nodeId}`;
      button.style.margin = "5px";
      button.style.padding = "10px 20px";
      button.style.fontSize = "16px";
      button.style.cursor = "pointer";
      button.style.backgroundColor = "#007bff";
      button.style.color = "white";
      button.style.border = "none";
      button.style.borderRadius = "5px";

      button.onclick = () => openNode(nodeId);

      menuContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Error loading menu from XML:", error);
  }
}

function openNode(nodeId) {
  if (pano) {
    pano.openNext(`{${nodeId}}`);
    console.log(`Navigated to node: ${nodeId}`);
  } else {
    console.error("Pano2VR player is not initialized.");
  }
}

window.addEventListener("load", loadMenuFromXML);
