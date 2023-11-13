import {
  CandidType,
  Canister,
  int8,
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
  yearBorn: text,
});

// const especialidades = Variant({
//   pediatria: text,
//   cardiologia: text,
// });

// Esta es una variant que presenta campos a ser llenados
// const Especialidad = Variant({
//   nombreEspecialidad: text,
// });
// const testVariant = Variant({
// odontologo: Null,
// pediatria: Null,
// });

let consultorio = StableBTreeMap(text, Turno, 0);

export default Canister({
  newAppointment: update(
    [text, Datos],
    Turno,
    (especialidad, datosPaciente) => {
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
      let ide = newUUID();

      // console.log('hola');
      consultorio.insert(ide, turno);
      return turno;
    }
  ),

  getPosts: query([], Vec(Turno), () => {
    return consultorio.values();
  }),

  // printReaction: query([testVariant], testVariant, especialidad => {
  //   // console.log(typeof reaction);
  //   return especialidad;
  // }),

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
  yearBorn: string
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
    yearBorn.slice(2, 4)
  );
};
