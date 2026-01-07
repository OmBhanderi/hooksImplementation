import { useState, useEffect, resetEffects } from "../something.js";

const counterValue = document.querySelector("#counterValue");
const [count, setCount] = useState(0);
render();

document.addEventListener("click", (e) => {
  const btn = e.target;

  if (!btn) return;

  if (btn.id === "decrementBtn") {
    if (count() > 0) {
      setCount(count() - 1);
      render();
    } else return;
  }

  if (btn.id === "incrementBtn") {
    setCount(count() + 1);
    render();
  }
});

function render() {
    resetEffects();
  counterValue.textContent = `${count()}`;
  useEffect(() => {
    console.log("Count changed:", count());
  }, [count()]);
}
