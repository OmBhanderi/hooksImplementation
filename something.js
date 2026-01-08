let stateStore = [];
let stateIndex = 0;
let effects = [];
let effectIndex = 0;
let memo = [];
let memoIndex = 0;
let reducerStore = [];
let reducerIndex = 0;

export function useState(initialValue) {
  const currentIndex = stateIndex;
  if (stateStore[currentIndex] === undefined) {
    stateStore[currentIndex] = initialValue;
  }

  function getValue() {
    return stateStore[currentIndex];
  }

  function setValue(newState) {
    stateStore[currentIndex] = newState;
    render();
  }
  stateIndex++;

  return [stateStore[currentIndex], setValue];
}

export function resetState() {
  stateIndex = 0;
}

export function useEffect(callback, dependencies) {
  const currentIndex = effectIndex;
  const prev = effects[currentIndex];

  let hasChanged = true;

  if (prev && dependencies) {
    hasChanged =
      dependencies.length !== prev.dependencies.length ||
      dependencies.some((dep, i) => dep !== prev.dependencies[i]);
  }

  const shouldRun =  !prev || !dependencies || hasChanged;
  if (shouldRun) {
    if (prev && typeof prev.cleanup === "function") {
      prev.cleanup();
    }

    const cleanup = callback();

    effects[currentIndex] = {
      dependencies,
      cleanup,
    };
  }

  effectIndex++;
}

export function resetEffects() {
  effectIndex = 0;
}

export function useMemo(callback, dependencies) {
  const currentIndex = memoIndex;

  const prev = memo[currentIndex];
  let hasChanged = true;

  if (prev && dependencies) {
    hasChanged = dependencies.some((dep, i) => dep !== prev.dependencies[i]);
  }

  if (!prev || !dependencies || hasChanged) {
    const result = callback();
    memo[currentIndex] = { result, dependencies };
    memoIndex++;
    return result;
  }

  memoIndex++;
  return prev.result;
}

export function resetMemo() {
  memoIndex = 0;
}

export function useReducer(reducer, intialState) {
  const currentIndex = reducerIndex;

  if (reducerStore[currentIndex] === undefined) {
    reducerStore[currentIndex] = intialState;
  }

  function dispatch(action) {
    reducerStore[currentIndex] = reducer(reducerStore[currentIndex], action);
  }

  reducerIndex++;
  return [reducerStore[currentIndex], dispatch];
}

export function resetReducer() {
  reducerIndex = 0;
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // if(debouncedValue.trim()==="") return;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
