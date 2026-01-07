export function useState(intialValue) {
  let state = intialValue;

  function getValue() {
    return state;
  }

  function setValue(newState) {
    state = newState;
  }

  return [getValue, setValue];
}

export function useEffect(...args) {
  let oldDependecies = [];
  let newDependecies = [];
  let callCount = 0;

  return function (...args) {
    callCount++;
    if (args.length === 1) {
      args[0]();
    }

    if (args.length === 2) {
        if(args[1].length===0&&callCount===1){
            args[0]();
        }
        if(callCount===1){
            oldDependecies = args[1];
        }else{
            newDependecies = args[1];
            let isSame = oldDependecies.every((val,ind)=>val===newDependecies[ind]);
            if(!isSame){
                return args[0]();
            }else return;
        }
      
    }
  };
}
