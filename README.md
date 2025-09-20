# Colombian Working Days API

API REST que calcula fechas hábiles en Colombia, considerando días festivos, horarios laborales y zona horaria local.

## Instalación

```bash
yarn install
```

## Desarrollo Local

```bash
yarn dev
```

La API estará disponible en: `http://localhost:8787`

## Despliegue

```bash
yarn deploy
```

## Uso

### Endpoint

```
GET /working-days
```

### Parámetros (query string)

- `days` (opcional): Número de días hábiles a sumar (entero positivo)
- `hours` (opcional): Número de horas hábiles a sumar (entero positivo)
- `date` (opcional): Fecha inicial en UTC ISO 8601 con Z (ej: `2025-08-01T14:00:00Z`)

**Nota**: Se requiere al menos uno de `days` o `hours`.

### Ejemplos

```bash
# Agregar 1 día hábil
GET /working-days?days=1

# Agregar 5 horas hábiles
GET /working-days?hours=5

# Agregar 2 días y 3 horas desde fecha específica
GET /working-days?date=2025-08-01T14:00:00Z&days=2&hours=3
```

### Respuesta

**Éxito (200 OK):**

```json
{
  "date": "2025-08-01T14:00:00Z"
}
```

**Error (400):**

```json
{
  "error": "InvalidParameters",
  "message": "Either days or hours parameter is required"
}
```

## Reglas de Negocio

- **Días hábiles**: Lunes a viernes
- **Horario laboral**: 8:00 AM - 5:00 PM (Colombia)
- **Almuerzo**: 12:00 PM - 1:00 PM (excluido)
- **Zona horaria**: America/Bogota para cálculos, UTC para respuesta
- **Días festivos**: Se excluyen automáticamente (API colombiana)

## Testing

```bash
yarn test
```
