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
          parent.classList.remove("has-error");
          const err = parent.querySelector(".field-error");
          if (err) err.remove();
        } else {
          parent.classList.remove("has-value");
          if (input.hasAttribute("required")) {
            parent.classList.add("has-error");
            if (!parent.querySelector(".field-error")) {
              const label = parent.querySelector("span")?.childNodes[0]?.textContent?.trim() || "This field";
              const msg = document.createElement("span");
              msg.className = "field-error";
              msg.textContent = label + " is required";
              parent.appendChild(msg);
            }
          }
        }
      });
      // Clear error on input
      input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
          parent.classList.remove("has-error");
          const err = parent.querySelector(".field-error");
          if (err) err.remove();
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
  const division = urlParams.get("division");
  
  const businessAreaSelect = document.getElementById("business-area-select");
  if (businessAreaSelect) {
    let targetValue = "";
    
    const d = (division || "").toLowerCase();
    const b = (brand || "").toLowerCase();
    const a = (area || "").toLowerCase();
    
    if (d.includes("hummer") || b.includes("hummer") || a.includes("hummer")) {
      targetValue = "HUMMER Power Products";
    } else if (d.includes("aliaxis") || d.includes("snow") || b.includes("aliaxis") || b.includes("snow") || a.includes("aliaxis") || a.includes("snow")) {
      targetValue = "Snow / Aliaxis Piping Systems";
    } else if (d.includes("metal") || d.includes("alloy") || b.includes("metalco") || b.includes("metal-alloys") || a.includes("metal") || a.includes("alloy")) {
      targetValue = "Metal Alloys Corporation";
    } else if (a.includes("tea") || a.includes("spice") || a.includes("fibre") || a.includes("export")) {
      targetValue = "Ceylon Tea & Agricultural Exports";
    } else if (a.includes("source") || a.includes("procure")) {
      targetValue = "Strategic Sourcing Briefs";
    } else if (a.includes("market") || a.includes("entry") || a.includes("expand")) {
      targetValue = "Market Entry Coordination";
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
