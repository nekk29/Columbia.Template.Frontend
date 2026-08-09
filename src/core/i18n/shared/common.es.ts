export const COMMON = {
  STATUS: {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
  },
  ALERT_LEVEL: {
    INFO: 'Información',
    SUCCESS: 'Éxito',
    WARNING: 'Advertencia',
    ERROR: 'Error',
  },
  FIELDS: {
    ACTIONS: 'Acciones',
    STATUS: 'Estado',
    FILTER: 'Filtro',
    FILTER_PLACEHOLDER: 'Ingrese un criterio de búsqueda',
  },
  ACTIONS: {
    SUBMIT: 'Enviar',
    SEARCH: 'Buscar',
    EXPORT: 'Exportar',
    CLEAR: 'Limpiar',
    ADD: 'Agregar',
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    NEW: 'Nuevo',
    UPDATE: 'Actualizar',
    OK: 'Ok',
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    PERMISSIONS: 'Permisos',
    EXPAND: 'Expandir',
    COLLAPSE: 'Colapsar',
    YES: 'Si',
    NO: 'No',
  },
  MESSAGES: {
    SELECT: {
      TEXT: '-- Seleccione {{field}} --',
      REQUIRED: 'Seleccione {{field}}',
      ALL_1: '-- Todos --',
      ALL_2: '-- Todas --',
    },
    MULTI_SELECT: {
      SELECT_ALL: 'Seleccionar todo',
      ALL_SELECTED: 'Todo Seleccionado',
    },
    SEARCH: {
      NO_RESULTS: 'No hay resultados de búsqueda',
      TOTAL_HINT: 'Total registros: {{total}}',
    },
    EXPORT: {
      NO_RECORDS: 'No hay registros para exportar',
      SUCCESS: 'Registros exportados correctamente',
      ERROR: 'Hubo un error exportando los registros',
    },
    DELETE: {
      TITLE: 'Eliminar',
      QUESTION: '¿Está seguro de eliminar este registro?',
    },
  },
  PAGINATION: {
    ROWS_PER_PAGE: 'Items por página',
    ROWS_INFORMATION: '{{start}} – {{end}} de {{total}}',
  },
}
