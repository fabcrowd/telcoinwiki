// Decoded avax.network offset calculation code
// Original (minified):
// const h=document.getElementById("solutions-insights"),
// m=h?.getAttribute("data-show-number")==="true",
// s=()=>{
//   const e=document.querySelectorAll(".insight");
//   e.forEach((t,i)=>{
//     const c=t.querySelector("#insight-number"),
//     n=t.querySelector("#insight-title"),
//     o=t.querySelector("#insight-description"),
//     r=e[i+1];
//     if(!n||!o)return;
//     const l=t.style.getPropertyValue("--offset")||"0",
//     u=t.getBoundingClientRect().top,
//     g=c.getBoundingClientRect().top,
//     d=n.getBoundingClientRect().top,
//     p=o.getBoundingClientRect().top,
//     f=(window.innerWidth>1024?p:m?d:g)-u+parseFloat(l);
//     r?.style.setProperty("--offset",`${f}px`)
//   })
// };
// s();
// window.addEventListener("resize",s);

// DECODED VERSION:
function calculateCardOffsets() {
  const section = document.getElementById("solutions-insights");
  const showNumber = section?.getAttribute("data-show-number") === "true";
  
  const cards = document.querySelectorAll(".insight");
  
  cards.forEach((card, index) => {
    const nextCard = cards[index + 1];
    if (!nextCard) return;
    
    // Get elements within current card
    const numberEl = card.querySelector("#insight-number");
    const titleEl = card.querySelector("#insight-title");
    const descriptionEl = card.querySelector("#insight-description");
    
    if (!titleEl || !descriptionEl) return;
    
    // Get current offset (starts at 0 for first card)
    const currentOffset = card.style.getPropertyValue("--offset") || "0";
    
    // Get positions
    const cardTop = card.getBoundingClientRect().top;
    const numberTop = numberEl?.getBoundingClientRect().top || 0;
    const titleTop = titleEl.getBoundingClientRect().top;
    const descriptionTop = descriptionEl.getBoundingClientRect().top;
    
    // Calculate offset for next card
    // Desktop (>1024px): use description top
    // Mobile with number: use title top
    // Mobile without number: use number top
    const referenceTop = window.innerWidth > 1024 
      ? descriptionTop 
      : (showNumber ? titleTop : numberTop);
    
    const nextOffset = (referenceTop - cardTop) + parseFloat(currentOffset);
    
    // Set offset on next card
    nextCard.style.setProperty("--offset", `${nextOffset}px`);
  });
}

// Run on load and resize
calculateCardOffsets();
window.addEventListener("resize", calculateCardOffsets);

// KEY INSIGHTS:
// 1. First card has --offset: 0px (set in HTML)
// 2. Each subsequent card's offset is calculated based on:
//    - The position of a reference element (description/title/number) in the PREVIOUS card
//    - The current card's top position
//    - The previous card's offset value
// 3. This creates a cascading stack effect where each card sticks at the right position
// 4. The calculation is dynamic and updates on resize

