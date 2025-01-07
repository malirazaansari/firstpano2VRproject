import { pano, initializePano } from "./shared.js";

async function loadMenuFromXML() {
  try {
    // Fetch the XML file
    initializePano();

    const response = await fetch("pano.xml");
    if (!response.ok) throw new Error("Failed to load pano.xml");

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Get all <panorama> elements
    const panoramas = xmlDoc.getElementsByTagName("panorama");

    // Get the menu container
    const menuContainer = document.getElementById("menu");

    // Clear any existing buttons
    menuContainer.innerHTML = "";

    // Loop through panoramas and create buttons
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

      // Add onclick handler
      button.onclick = () => openNode(nodeId);

      // Append the button to the menu
      menuContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Error loading menu from XML:", error);
  }
}

function openNode(nodeId) {
  // Function to open the node
  if (pano) {
    pano.openNext(`{${nodeId}}`);
    console.log(`Navigated to node: ${nodeId}`);
  } else {
    console.error("Pano2VR player is not initialized.");
  }
}

// Call the function on page load
window.addEventListener("load", loadMenuFromXML);
