import { Canister, query, text, update, Void } from 'azle';
import { v4 as uuidv4 } from 'uuid';

export default Canister({
  getUUID: query([], text, () => {
    let id = newUUID();
    return id;
  }),
});

// Generador de UUID para identificar cada StableBtreeMap
const newUUID = () => {
  return uuidv4();
};
