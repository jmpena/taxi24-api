Taxi24 - Documentación de Arquitectura
======================================

Instalación y Configuración
---------------------------

### 1\. Clonar el Repositorio

    git clone https://github.com/jmpena/taxi24-api.git
    cd taxi24-api

### 2\. Instalar Dependencias

    # Usando pnpm (recomendado)
    pnpm install
    
    # O usando npm
    npm install

### 3\. Configurar Base de Datos

Crear archivo .env en la raíz del proyecto:

    DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/taxi24db"

### 4\. Ejecutar Migraciones

    # Generar el cliente de Prisma
    npx prisma generate
    
    # Ejecutar migraciones
    npx prisma migrate dev

### 5\. Cargar Datos Iniciales (Seed)

    # Ejecutar seed
    npx prisma db seed

### 6\. Ejecutar Tests

    # Ejecutar todos los tests
    pnpm test
    
    # Ejecutar tests en modo watch
    pnpm test:watch
    
    # Ejecutar tests con coverage
    pnpm test:cov
    
    # Ejecutar un archivo específico de test
    pnpm test src/domain/usecases/__tests__/driver/create-driver.usecase.spec.ts

### 7\. Iniciar la Aplicación

    # Modo desarrollo
    pnpm start:dev
    
    # Modo producción
    pnpm build
    pnpm start:prod

Descripción General
-------------------

Taxi24 es una API REST implementada con Clean Architecture y NestJS. Esta arquitectura está diseñada para mantener el código organizado, testeable y mantenible, siguiendo los principios SOLID.

Estructura del Proyecto
-----------------------

src/ ├── core/ # Núcleo de la aplicación │ └── exceptions/ # Excepciones personalizadas ├── domain/ # Lógica de negocio │ ├── entities/ # Entidades │ ├── repositories/ # Interfaces de repositorios │ └── usecases/ # Casos de uso ├── data/ # Capa de datos │ ├── datasources/ # Fuentes de datos (Prisma) │ └── repositories/ # Implementación de repositorios ├── presentation/ # Capa de presentación │ └── controllers/ # Controladores HTTP └── infrastructure/ # Configuración y servicios └── config/ # Configuraciones

Capas de la Arquitectura
------------------------

### 1\. Core Layer

Contiene las excepciones personalizadas del sistema:

*   `license-exists.exception.ts`: Error cuando existe licencia duplicada
*   `driver-not-available.exception.ts`: Error cuando un conductor no está disponible

### 2\. Domain Layer

Define las entidades y lógica de negocio:

#### Entities:

*   `driver.entity.ts`: Modelo de conductor
*   `passenger.entity.ts`: Modelo de pasajero
*   `trip.entity.ts`: Modelo de viaje
*   `invoice.entity.ts`: Modelo de factura

#### Use Cases:

Implementan la lógica de negocio específica:

*   `create-driver.usecase.ts`: Crear nuevo conductor
*   `find-nearby-drivers.usecase.ts`: Buscar conductores cercanos
*   `get-available-drivers.usecase.ts`: Listar conductores disponibles
*   `create-trip.usecase.ts`: Crear nuevo viaje
*   `complete-trip.usecase.ts`: Completar un viaje

### 3\. Data Layer

Maneja el acceso a datos:

*   `prisma.datasource.ts`: Cliente Prisma para PostgreSQL
*   `driver.repository.impl.ts`: Implementación del repositorio de conductores
*   `passenger.repository.impl.ts`: Implementación del repositorio de pasajeros
*   `trip.repository.impl.ts`: Implementación del repositorio de viajes

### 4\. Presentation Layer

Controladores que manejan las peticiones HTTP:

*   `driver.controller.ts`: Endpoints de conductores
*   `passenger.controller.ts`: Endpoints de pasajeros
*   `trip.controller.ts`: Endpoints de viajes
*   `invoice.controller.ts`: Endpoints de facturas

Testing
-------

Cada capa tiene sus propios tests unitarios:

*   Use Cases: `src/domain/usecases/__tests__/`
*   Controllers: `src/presentation/controllers/__tests__/`
*   Repositories: `src/data/repositories/__tests__/`

Flujo de Datos
--------------

1.  Cliente hace una petición HTTP al controlador
2.  Controlador valida la petición y llama al caso de uso apropiado
3.  Caso de uso ejecuta la lógica de negocio usando repositorios
4.  Repositorio interactúa con la base de datos vía Prisma
5.  Respuesta fluye de vuelta al cliente

Dependencias Principales
------------------------

*   **NestJS**: Framework de backend
*   **Prisma**: ORM para PostgreSQL
*   **Jest**: Framework de testing
*   **Swagger**: Documentación de API

Convenciones de Código
----------------------

*   Use Cases: `verb-noun.usecase.ts`
*   Controllers: `noun.controller.ts`
*   Repositories: `noun.repository.ts`
*   Tests: `*.spec.ts`