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

// Objeto de turno que sera guardado segun la especialidad
const Appointment = Record({
  appointmentNum: int8, // numero del turno que sera incremental hasta que acabe el dia
  completeName: text, // nombre compuesto del paciente
  patientCode: text, // codigo generado a partir de sus iniciales y año de nacimiento
  medEsp: text, // especialidad a la que esta optando
});

// Objeto que interectuara con la UI para recoger datos del paciente
const Data = Record({
  name: text,
  firstLastName: text,
  secondLastName: text,
  yearBorn: nat32,
});

// Estructura para almacenar los turnos
let hospital = StableBTreeMap(nat32, Appointment, 0);

export default Canister({
  // Creacion de una nueva cita
  // text: especialidad
  // Datos: datos basicos del paciente
  // Retorna el turno que se genera
  newAppointment: update([text, Data], Appointment, (medEsp, patientData) => {
    let last = lastAppointment(hospital.keys()); // get last date appointment
    let today = currentDate(); // get current date

    // console.log(last === tomorrow);
    console.log({ last, today });
    // console.log('today is ' + today);

    let { name, firstLastName, secondLastName, yearBorn } = patientData;
    let appointment: typeof Appointment = {
      patientCode: setIdPatient(name, firstLastName, secondLastName, yearBorn),
      completeName: `${name} ${firstLastName} ${secondLastName}`,
      appointmentNum: 34, //TODO
      medEsp,
    };

    hospital.insert(createIdAppointment(), appointment);
    return appointment;
  }),

  getAppointments: query([], Vec(Appointment), () => {
    return hospital.values();
  }),

  // Retorna todos los ids de citas realizadas
  getIdsAppointments: query([], Vec(nat32), () => {
    lastAppointment(hospital.keys());
    return hospital.keys();
  }),

  // Retorna un turno segun el id pasado
  getAppointment: query([nat32], Opt(Appointment), id => {
    return hospital.get(id);
  }),
});

// Setea el ID de cada paciente tomando sus iniciales y anio de nacimiento
const setIdPatient = (
  name: string,
  firstLastname: string,
  secondLastName: string,
  yearBorn: number
): string => {
  return (
    name.slice(0, 1).toUpperCase() +
    firstLastname.slice(0, 1).toUpperCase() +
    secondLastName.slice(0, 1).toUpperCase() +
    yearBorn.toString().slice(2, 4)
  );
};

const lastAppointment = (item: any) => {
  // console.log(item[item.length - 1]);
    return item[item.length - 1].toString().slice(1);
};

let count = 0;
const createIdAppointment = () => {
  count += 1;
  let date = new Date();
  let idAppointment = Number(
    `${count}${date.getDate()}${date.getMonth()}${date
      .getFullYear()
      .toString()
      .slice(2, 4)}`
  );

  return idAppointment;
};

// Obtener la fecha actual para comparacion
const currentDate = (): string => {
  let date = new Date();
  let current = `${date.getDate()}${date.getMonth()}${date
    .getFullYear()
    .toString()
    .slice(2, 4)}`;

  return current;
};
