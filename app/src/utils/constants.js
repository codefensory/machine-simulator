export const states = {
  ESPERA_LOOP: {
    name: 'ESPERA_LOOP',
    next: 'EXPLICACION',
  },
  EXPLICACION: {
    name: 'EXPLICACION',
    next: 'ESPERA_BOTON_INICIO',
  },
  ESPERA_BOTON_INICIO: {
    name: 'ESPERA_BOTON_INICIO',
    next: 'ELEGIR_FONDO',
  },
  ELEGIR_FONDO: {
    name: 'ELEGIR_FONDO',
    next: 'TUTORIAL',
  },
  TUTORIAL: {
    name: 'TUTORIAL',
    next: 'MOVIMIENTO_EXCAVADORA',
  },
  MOVIMIENTO_EXCAVADORA: {
    name: 'MOVIMIENTO_EXCAVADORA',
    next: 'CIBER_ATAQUE',
  },
  CIBER_ATAQUE: {
    name: 'CIBER_ATAQUE',
    next: 'ESPERA_ACTIVAR_LIMPIEZA',
  },
  ESPERA_ACTIVAR_LIMPIEZA: {
    name: 'ESPERA_ACTIVAR_LIMPIEZA',
    next: 'LIMPIEZA',
  },
  LIMPIEZA: {
    name: 'LIMPIEZA',
    next: 'ESPERA_RETOMAR',
  },
  ESPERA_RETOMAR: {
    name: 'ESPERA_RETOMAR',
    next: 'MOVIMIENTO_EXCAVADORA_FINAL',
  },
  MOVIMIENTO_EXCAVADORA_FINAL: {
    name: 'MOVIMIENTO_EXCAVADORA_FINAL',
    next: 'TERMINANDO',
  },
  TERMINANDO: {
    name: 'TERMINANDO',
    next: 'AGRADECIMIENTO',
  },
  AGRADECIMIENTO: {
    name: 'AGRADECIMIENTO',
    next: 'ESPERA_LOOP',
  },
};
