import {
  useEffect,
  useDebounce,
  useState,
  resetEffects,
  resetState,
} from "../something.js";

let setValueRef;

function App() {
  const [value, setValue] = useState("");
  setValueRef = setValue;
    if(value.trim()==="") return;
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    console.log(debouncedValue);
  }, [debouncedValue]);
}

function render() {
  resetState();
  resetEffects();
  console.log("render")
  App();
}

window.render = render;

const input = document.getElementById("searchInput");

input.addEventListener("input", (e) => {
  setValueRef(e.target.value);
});

render();
