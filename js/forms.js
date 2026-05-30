/**
 * Neptune Trading Company (Pvt) Ltd - Enterprise Form & CTA Handler
 * Integrates URL query pre-fills and premium UI feedback.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Interactive input focus effects.
  const formInputs = document.querySelectorAll(".form-field input, .form-field select, .form-field textarea");
  formInputs.forEach(input => {
    // Wrap interactions
    const parent = input.closest(".form-field");
    if (parent) {
      input.addEventListener("focus", () => {
        parent.classList.add("is-focused");
      });
      input.addEventListener("blur", () => {
        parent.classList.remove("is-focused");
        if (input.value.trim() !== "") {
          parent.classList.add("has-value");
        } else {
          parent.classList.remove("has-value");
        }
      });
      // Initial state check
      if (input.value.trim() !== "") {
        parent.classList.add("has-value");
      }
    }
  });

  // 2. Dynamic selection routing on page load.
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get("brand");
  const area = urlParams.get("area");
  
  const businessAreaSelect = document.getElementById("business-area-select");
  if (businessAreaSelect) {
    let targetValue = "";
    
    if (brand) {
      const b = brand.toLowerCase();
      if (b === "hummer" || b === "aliaxis" || b === "snow" || b === "metalco" || b === "metal-alloys") {
        targetValue = "Sourcing and Procurement";
      }
    } else if (area) {
      const a = area.toLowerCase();
      if (a === "sourcing" || a === "procurement" || a === "sourcing and procurement") {
        targetValue = "Sourcing and Procurement";
      } else if (a === "exports" || a === "tea exports") {
        targetValue = "Tea Exports";
      } else if (a === "spices exports") {
        targetValue = "Spices Exports";
      } else if (a === "fibre exports") {
        targetValue = "Fibre Exports";
      } else if (a === "market-entry" || a === "market research and expansion") {
        targetValue = "Market Research and Expansion";
      }
    }
    
    if (targetValue) {
      for (let i = 0; i < businessAreaSelect.options.length; i++) {
        if (businessAreaSelect.options[i].value === targetValue) {
          businessAreaSelect.selectedIndex = i;
          // Trigger a change event so any listeners know it updated
          businessAreaSelect.dispatchEvent(new Event("change"));
          break;
        }
      }
    }
  }
});
