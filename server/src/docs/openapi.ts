import swaggerJsdoc from 'swagger-jsdoc'

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'TransitFlow API',
    version: '1.0.0',
    description:
      'API REST para la gestion de viajes, lugares, gastos, ahorro, notas y favoritos en TransitFlow.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Base path local',
    },
  ],
  tags: [
    { name: 'Trips' },
    { name: 'Places' },
    { name: 'Expenses' },
    { name: 'Savings' },
    { name: 'Notes' },
    { name: 'Favorites' },
    { name: 'Health' },
  ],
  components: {
    schemas: {
      Trip: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          destination: { type: 'string' },
          startDate: { type: 'string', example: '2026-05-10' },
          endDate: { type: 'string', example: '2026-05-15' },
          budget: { type: 'number', example: 1500 },
          image: { type: 'string', nullable: true },
          totalExpenses: { type: 'number', example: 320 },
          totalSavings: { type: 'number', example: 700 },
          progressPercentage: { type: 'number', example: 47 },
        },
      },
      TripInput: {
        type: 'object',
        required: ['name', 'destination', 'startDate', 'endDate', 'budget'],
        properties: {
          name: { type: 'string' },
          destination: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          budget: { type: 'number' },
          image: { type: 'string', nullable: true },
        },
      },
      Place: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          tripId: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      PlaceInput: {
        type: 'object',
        required: ['tripId', 'name', 'category'],
        properties: {
          tripId: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      Expense: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          tripId: { type: 'string' },
          type: {
            type: 'string',
            enum: ['transporte', 'comida', 'alojamiento', 'ocio'],
          },
          amount: { type: 'number' },
        },
      },
      ExpenseInput: {
        type: 'object',
        required: ['tripId', 'type', 'amount'],
        properties: {
          tripId: { type: 'string' },
          type: {
            type: 'string',
            enum: ['transporte', 'comida', 'alojamiento', 'ocio'],
          },
          amount: { type: 'number' },
        },
      },
      Saving: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          tripId: { type: 'string' },
          amount: { type: 'number' },
          date: { type: 'string' },
        },
      },
      SavingInput: {
        type: 'object',
        required: ['tripId', 'amount', 'date'],
        properties: {
          tripId: { type: 'string' },
          amount: { type: 'number' },
          date: { type: 'string' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          tripId: { type: 'string' },
          text: { type: 'string' },
          createdAt: { type: 'string' },
        },
      },
      NoteInput: {
        type: 'object',
        required: ['tripId', 'text', 'createdAt'],
        properties: {
          tripId: { type: 'string' },
          text: { type: 'string' },
          createdAt: { type: 'string' },
        },
      },
      FavoriteIds: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      FavoriteInput: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/trips': {
      get: {
        tags: ['Trips'],
        summary: 'Obtiene todos los viajes',
        responses: {
          '200': {
            description: 'Lista de viajes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Trip' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Trips'],
        summary: 'Crea un viaje',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TripInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Viaje creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Trip' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/trips/{id}': {
      get: {
        tags: ['Trips'],
        summary: 'Obtiene un viaje por id',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Viaje encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Trip' },
              },
            },
          },
          '404': {
            description: 'Trip not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Trips'],
        summary: 'Actualiza un viaje',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TripInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Viaje actualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Trip' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Trip not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Trips'],
        summary: 'Elimina un viaje',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Viaje eliminado' },
        },
      },
    },
    '/places': {
      get: {
        tags: ['Places'],
        summary: 'Obtiene lugares',
        parameters: [
          { in: 'query', name: 'tripId', schema: { type: 'string' }, required: false },
        ],
        responses: {
          '200': {
            description: 'Lista de lugares',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Place' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Places'],
        summary: 'Crea un lugar',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlaceInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Lugar creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Place' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Trip not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/places/{id}': {
      put: {
        tags: ['Places'],
        summary: 'Actualiza un lugar',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlaceInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Lugar actualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Place' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Place not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Places'],
        summary: 'Elimina un lugar',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Lugar eliminado' },
        },
      },
    },
    '/expenses': {
      get: {
        tags: ['Expenses'],
        summary: 'Obtiene gastos',
        parameters: [
          { in: 'query', name: 'tripId', schema: { type: 'string' }, required: false },
        ],
        responses: {
          '200': {
            description: 'Lista de gastos',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Expense' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Expenses'],
        summary: 'Crea un gasto',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExpenseInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Gasto creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Expense' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Trip not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/expenses/{id}': {
      put: {
        tags: ['Expenses'],
        summary: 'Actualiza un gasto',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExpenseInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Gasto actualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Expense' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Expense not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Expenses'],
        summary: 'Elimina un gasto',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Gasto eliminado' },
        },
      },
    },
    '/savings': {
      get: {
        tags: ['Savings'],
        summary: 'Obtiene movimientos de ahorro',
        parameters: [
          { in: 'query', name: 'tripId', schema: { type: 'string' }, required: false },
        ],
        responses: {
          '200': {
            description: 'Lista de ahorro',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Saving' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Savings'],
        summary: 'Crea un movimiento de ahorro',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SavingInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Ahorro creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Saving' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Trip not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/savings/{id}': {
      put: {
        tags: ['Savings'],
        summary: 'Actualiza un movimiento de ahorro',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SavingInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Ahorro actualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Saving' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Saving not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Savings'],
        summary: 'Elimina un movimiento de ahorro',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Ahorro eliminado' },
        },
      },
    },
    '/notes': {
      get: {
        tags: ['Notes'],
        summary: 'Obtiene notas',
        parameters: [
          { in: 'query', name: 'tripId', schema: { type: 'string' }, required: false },
        ],
        responses: {
          '200': {
            description: 'Lista de notas',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Note' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Notes'],
        summary: 'Crea una nota',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NoteInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Nota creada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Note' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Trip not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/notes/{id}': {
      put: {
        tags: ['Notes'],
        summary: 'Actualiza una nota',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NoteInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Nota actualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Note' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Note not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Notes'],
        summary: 'Elimina una nota',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Nota eliminada' },
        },
      },
    },
    '/favorites': {
      get: {
        tags: ['Favorites'],
        summary: 'Obtiene ids de favoritos',
        responses: {
          '200': {
            description: 'Ids favoritos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FavoriteIds' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Favorites'],
        summary: 'Anade un favorito',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FavoriteInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Lista actualizada de favoritos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FavoriteIds' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Trip not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/favorites/{id}': {
      delete: {
        tags: ['Favorites'],
        summary: 'Elimina un favorito',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Lista actualizada de favoritos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FavoriteIds' },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Comprueba el estado basico del servidor',
        responses: {
          '200': {
            description: 'Servidor disponible',
          },
        },
      },
    },
  },
}

export const swaggerSpec = swaggerJsdoc({
  definition,
  apis: [],
})
