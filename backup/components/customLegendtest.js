import colorScales from "./scales.js";

/**
 * Create custom styles for radio buttons based on color scales
 * This adds a style tag to the document that styles radio buttons
 */
export function styleRadioButtons(uniqueValues, radioFormId) {
  // Create a style element
  const style = document.createElement("style");

  // Generate CSS for each value
  const cssRules = uniqueValues
    .map((value, index) => {
      const fillScale = colorScales();
      const color = fillScale.getColor(value, 100);

      // Calculate contrast color
      const rgb = color.match(/\d+/g).map(Number);
      const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      const textColor = brightness < 128 ? "white" : "black";

      return `
      #${radioFormId} label:nth-of-type(${index + 1}) {
        background-color: ${color};
        color: ${textColor};
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        margin: 0 6px 6px 0;
      }
      
      #${radioFormId} label:nth-of-type(${index + 1}):hover {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        transform: translateY(-2px);
      }
      
      #${radioFormId} input:nth-of-type(${index + 1}):checked + label {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);
        position: relative;
      }
      
      #${radioFormId} input:nth-of-type(${index + 1}):checked + label::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 40%;
        height: 3px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 2px;
      }
    `;
    })
    .join("\n");

  // Add general styles for the form
  const generalStyles = `
    #${radioFormId} {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    
    #${radioFormId} input[type="radio"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
  `;

  // Set the style content
  style.textContent = generalStyles + cssRules;

  // Add the style to the document head
  document.head.appendChild(style);

  return {
    id: radioFormId,
    className: "custom-radio-form",
  };
}
