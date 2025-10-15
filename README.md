# 🚀 AngularStateSeed

Aplicación Angular con arquitectura basada en componentes y manejo de estado utilizando **NgRx**. Este proyecto demuestra prácticas modernas de desarrollo frontend, incluyendo arquitectura limpia, separación de responsabilidades y uso de herramientas de desarrollo avanzadas.

---

## 🧰 Tecnologías utilizadas

- **Angular**: 17.3.6
- **@ngrx/store**: ^17.2.0
- **@ngrx/effects**: ^17.2.0
- **@ngrx/store-devtools**: ^17.2.0
- **ngrx-store-localstorage**: ^17.x

---

## ⚙️ Instalación y configuración

### Prerrequisitos

- Node.js >= 18.x recomendado
- npm >= 9.x
- Angular CLI

### 🔧 Setup del entorno

```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@17.3.6

# Crear un nuevo proyecto Angular
ng new <NombreProyecto>

# Navegar al directorio del proyecto
cd <NombreProyecto>
```

### 🧱 Instalación de NgRx

```bash
# Agregar NgRx Store
ng add @ngrx/store@17

# Agregar NgRx Effects
ng add @ngrx/effects@17

# Agregar herramientas de desarrollo (DevTools)
ng add @ngrx/store-devtools@17

# Persistencia local del estado (opcional)
npm install ngrx-store-localstorage@17
```

---

## 🧪 Scripts útiles

| Comando            | Descripción                                 |
|--------------------|---------------------------------------------|
| `npm start`        | Levanta servidor en `http://localhost:4200` |
| `ng build`         | Compila la app para producción              |     
| `ng lint`          | Ejecuta el linter del proyecto              |

---

## 📁 Estructura del proyecto (resumen)

```bash
- 📁 src/
    - 📁 app/
        - 📁 api - Entidades , Providers
        - 📁 core - Servicios , guards, interceptors, mappers, models
        - 📁 modules - Módulos especificos del aplicativo
        - 📁 shared - Componentes Generales
        - 📁 store - Gestión de estado con NGRX
    - 📁 assets/ - Recursos estáticos
    - 📁 environments/ - Configuraciones por ambiente
```

---

## 🧠 Principios de arquitectura aplicados

- ✅ Clean Architecture
- ✅ State Management reactivo (NgRx)
- ✅ Separación de capas de dominio y presentación
- ✅ Efectos para lógica de negocio asíncrona
- ✅ Selectores para desacoplar UI de la lógica de estado
- ✅ Persistencia de estado opcional con `ngrx-store-localstorage`

---

## 🧑 Autor

- **Marcos Nicolás Iannello**

