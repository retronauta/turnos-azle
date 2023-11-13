import {
  CandidType,
  Canister,
  int8,
  Opt,
  query,
  Record,
  StableBTreeMap,
  text,
  update,
  Variant,
  Vec,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Objeto de turno que sera guardado segun la especialidad
const Turno = Record({
  turno: int8,
  nombrePaciente: text,
  idPaciente: text,
});

// const especialidades = Variant({
//   pediatria: text,
//   cardiologia: text,
// });

let cardiologia = StableBTreeMap(text, Turno, 0);
let pediatria = StableBTreeMap(text, Turno, 1);
let medicinaGeneral = StableBTreeMap(text, Turno, 2);
let odontologia = StableBTreeMap(text, Turno, 3);
let ginecologia = StableBTreeMap(text, Turno, 4);

export default Canister({
  getUUID: query([], text, () => {
    let id = newUUID();
    return id;
  }),

  //   addMap: update([text, Turno], Opt(Turno), (key, value) => {
  //     return createMap(key, value, 0);
  //   }),

  //   nuevaEspecialidad: update([text, Turno], Opt(Turno), (key, value) => {
  //     return especialidades.insert(key, value);
  //   }),

  //   getTurnos: query([], Vec(Turno), () => {
  //     return posts.values();
  //   }),
});

// Generador de UUID para identificar cada StableBtreeMap
const newUUID = () => {
  return uuidv4();
};

// const createMap = (key: any, value: any, idMap: any) => {
//   return StableBTreeMap(key, value, idMap);
// };
