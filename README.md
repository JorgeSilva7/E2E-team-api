# Team-API E2E Tests

Este repositorio contiene pruebas End-to-End (E2E) para el proyecto Team-API. Las pruebas E2E están diseñadas para simular escenarios de usuario reales y asegurar que el sistema funcione integralmente.

## Pruebas Incluidas

- **Login:** Verifica que el proceso de autenticación funcione correctamente.
- **Club Management:** Pruebas relacionadas con la creación, edición y eliminación de clubes.
- **Member Addition:** Pruebas para asegurar que los miembros se puedan agregar correctamente a los clubes.

## Configuración del Entorno

Antes de ejecutar las pruebas, asegúrate de configurar tu entorno correctamente:

1. **Instalar Dependencias:**
   Asegúrate de tener Node.js instalado en tu sistema. Luego, instala las dependencias del proyecto ejecutando:

   ```bash
   npm install
   ```

2. **Servidor API y Base de Datos:**
   Asegúrate de que el servidor API de Team-API esté en ejecución y que la base de datos esté accesible.

## Ejecución de las Pruebas

Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```

Este comando ejecutará todas las pruebas E2E definidas en el repositorio. Los resultados se mostrarán en la consola.

## Integrantes

- Nicolás Rivas
- Nicolas Sanhueza