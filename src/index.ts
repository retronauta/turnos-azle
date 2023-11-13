import {
  CandidType,
  Canister,
  int8,
  nat32,
  nat8,
  Null,
  Opt,
  query,
  Record,
  StableBTreeMap,
  text,
  update,
  Variant,
  Vec,
  Void,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Objeto de turno que sera guardado segun la especialidad
const Turno = Record({
  turno: int8, // numero del turno que sera incremental hasta que acabe el dia
  nombreCompleto: text, // nombre compuesto del paciente
  codigoPaciente: text, // codigo generado a partir de sus iniciales y año de nacimiento
  especialidad: text, // especialidad a la que esta optando
});

const Datos = Record({
  name: text,
  firstLastName: text,
  secondLastName: text,
  yearBorn: nat32,
});

let consultorio = StableBTreeMap(nat32, Turno, 0);

export default Canister({
  //TODO debe recibir
  newAppointment: update(
    [text, Datos],
    nat32,
    (especialidad, datosPaciente) => {
      let date = new Date();
      let numberTurno = 1;
      let idAppointment = Number(
        `${numberTurno}${date.getDate()}${date.getMonth()}${date
          .getFullYear()
          .toString()
          .slice(2, 4)}`
      );
      // let idAppointment = numberTurno`

      let { name, firstLastName, secondLastName, yearBorn } = datosPaciente;
      //TODO verificar fecha para generar turno
      let turno: typeof Turno = {
        codigoPaciente: setIdPatient(
          name,
          firstLastName,
          secondLastName,
          yearBorn
        ),
        nombreCompleto: `${name} ${firstLastName} ${secondLastName}`,
        turno: 34,
        especialidad,
      };
      // let ide = newUUID();

      // console.log('hola');
      consultorio.insert(idAppointment, turno);
      return idAppointment;
    }
  ),

  getPosts: query([], Vec(Turno), () => {
    return consultorio.values();
  }),

  // printReaction: query([testVariant], testVariant, especialidad => {
  //   // console.log(typeof reaction);
  //   return especialidad;
  // }),

  getPost: query([nat32], Opt(Turno), id => {
    return consultorio.get(id);
  }),
  //TODO Crear funcion para consultar turnos, quiza con switch
});

// Generador de UUID para identificar cada StableBtreeMap
const newUUID = () => {
  return uuidv4();
};

const comprobarFecha = () => {
  const fechaActual = new Date();
  return fechaActual;
};

const setIdPatient = (
  name: string,
  firstLastname: string,
  secondLastName: string,
  yearBorn: number
): string => {
  // let date = new Date();
  // let day = date.getDate().toString();
  // let month = date.getMonth().toString();
  // let year = date.getFullYear().toString().slice(2);
  // console.log(day + month + year);
  // console.log(fecha.toString().slice())
  return (
    name.slice(0, 1).toUpperCase() +
    firstLastname.slice(0, 1).toUpperCase() +
    secondLastName.slice(0, 1).toUpperCase() +
    yearBorn.toString().slice(2, 4)
  );
};
