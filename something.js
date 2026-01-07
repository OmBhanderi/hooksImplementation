let stateStore = [];
let stateIndex = 0;
let effects = [];
let effectIndex = 0;
let memo = [];
let memoIndex = 0;
let reducerStore = 0;
let reducerIndex = 0;

export function useState(initialValue) {
  const currentIndex = stateIndex;
  if (stateStore[stateIndex] === undefined) {
    stateStore[stateIndex] = initialValue;
  }

  function getValue() {
    return stateStore[stateIndex];
  }

  function setValue(newState) {
    stateStore[stateIndex] = newState;
  }
  stateIndex++;

  return [getValue, setValue];
}

export function resetState() {
  stateIndex = 0;
}

export function useEffect(callback, dependencies) {
  const currentIndex = effectIndex;

  const hasNoDeps = !dependencies;
  const hasEmptyDeps = dependencies && dependencies.length === 0;

  const prev = effects[currentIndex];
  let hasChanged = true;

  if (prev && dependencies) {
    hasChanged = dependencies.some((dep, i) => dep !== prev.dependencies[i]);
  }

  if (!prev) {
    effects[currentIndex] = { dependencies };
    callback();
  } else if (hasNoDeps) {
    callback();
  } else if (hasEmptyDeps) {
    // run only once →
  } else if (hasChanged) {
    callback();
    effects[currentIndex].dependencies = dependencies;
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
  return [state, dispatch];
}

export function resetReducer() {
  reducerIndex = 0;
}
