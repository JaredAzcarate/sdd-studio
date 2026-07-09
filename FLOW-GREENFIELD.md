🌱 Greenfield Workflow

1. Inicialización del proyecto

Instala SDD.

sdd init

⸻

2. Configuración de ingeniería

Ejecuta Configure Engineering.

El asistente realiza una serie de preguntas para definir las reglas y convenciones del proyecto.

Se generan los siguientes archivos:

- engineering-principles.md
- engineering-decisions.md
- engineering-conventions.md
- engineering-frontend-patterns.md
- engineering-backend-patterns.md

⸻

3. Confirmación

Una vez creados los archivos, el asistente muestra un resumen y confirma que la configuración inicial fue completada correctamente.

Finalmente sugiere continuar con el siguiente paso:

Ejecutar sdd-idea

⸻

4. Definición de la idea

El usuario abre el chat de IA y comparte la idea de la aplicación.

La idea puede describirse mediante:

- una aplicación completa
- una feature
- una mejora
- un documento
- cualquier descripción funcional

Indicando que desea ejecutar la skill sdd-idea.

⸻

5. Análisis de la idea

La skill sdd-idea analiza la información recibida.

Su objetivo es:

- comprender la idea
- detectar información faltante
- identificar ambigüedades
- encontrar decisiones pendientes

⸻

6. Refinamiento

Si existen puntos poco claros, la IA realiza preguntas al usuario hasta completar el contexto necesario.

⸻

7. Confirmación funcional

Cuando toda la información está clara, la IA presenta un resumen del análisis realizado y solicita confirmación antes de transformar la idea en documentación estructurada.

⸻

8. Generación de documentación de producto

Una vez confirmada la información, sdd-idea genera:

- product-guide.md
- product-principles.md

⸻

9. Resumen del resultado

La IA:

- confirma los archivos generados
- explica brevemente el propósito de cada uno
- recuerda qué pregunta responde cada documento
- recomienda el siguiente paso

Ejecutar sdd-technical

⸻

10. Diseño técnico

El usuario ejecuta:

sdd-technical

La skill realiza las siguientes tareas.

Analiza

Lee los documentos de ingeniería:

- engineering-principles
- engineering-decisions
- engineering-conventions
- engineering-frontend-patterns
- engineering-backend-patterns

Comprende

Analiza las necesidades funcionales del proyecto.

Recomienda

Propone el stack tecnológico más adecuado y realiza las preguntas necesarias para completar la arquitectura técnica.

Por ejemplo:

- frontend
- backend
- base de datos
- autenticación
- almacenamiento
- IA
- realtime
- hosting

⸻

11. Confirmación técnica

El usuario responde las preguntas.

La IA resume la solución propuesta y solicita confirmación antes de generar el documento técnico.

Archivo generado:

- engineering-stack.md

⸻

12. Resultado

Una vez confirmada la propuesta, sdd-technical genera:

- engineering-stack.md

Finalmente recomienda continuar con:

Ejecutar sdd-spec

⸻

13. Generación de especificaciones

El usuario ejecuta:

sdd-spec

La skill realiza el siguiente proceso.

Analiza

Lee todos los documentos disponibles.

Producto

- product-principles
- product-guide

Ingeniería

- engineering-principles
- engineering-decisions
- engineering-conventions
- engineering-frontend-patterns
- engineering-backend-patterns
- engineering-stack

⸻

Comprende

Construye el contexto completo del proyecto combinando:

- visión del producto
- principios
- reglas
- estrategias
- arquitectura
- stack tecnológico

⸻

Genera los módulos del proyecto

A partir del contexto identificado, crea los módulos del sistema diferenciando negocio y aspectos técnicos.

Business

- Domain
- Relations
- Capabilities
- Flows
- Rules
- Security
- Events

Technical

- API
- UI
- Testing
- Architecture
- Database

⸻

14. Finalización

sdd-spec genera todos los documentos de especificación necesarios.

El proyecto queda listo para iniciar el desarrollo.

Finalmente pregunta al usuario con qué workflow desea continuar.

Por ejemplo:

- sdd-studio
- Cursor
- Claude Code
- Codex
- otro proveedor compatible con SDD

Sí, ahora viendo la arquitectura completa creo que la idea queda mucho más clara. En realidad sdd-plan no genera un backlog genérico, sino que inicializa la estructura del workflow dentro del proyecto.

Yo describiría esa parte así:

⸻

🚀 Workflow Extension (sdd-studio)

1. Selección del workflow

Una vez finalizada la generación de las especificaciones, el usuario indica que desea continuar utilizando el workflow de SDD Studio.

⸻

2. Instalación de la extensión

El agente explica cómo instalar la extensión Workflow en el proyecto.

Una vez instalada, el usuario puede ejecutar los comandos del workflow.

⸻

3. Configuración del workflow

El usuario ejecuta:

sdd-studio

La extensión configura el modelo de trabajo del proyecto.

Modelo de seguimiento

Pregunta qué metodología utiliza el equipo.

Por ejemplo:

- Kanban
- Scrum
- Otro

⸻

Convenciones del workflow

Pregunta las convenciones del equipo, como por ejemplo:

- formato de tareas
- nomenclatura
- estados
- prioridades
- reglas del workflow

⸻

Importación del workflow

En base a las respuestas, importa la arquitectura correspondiente al modelo seleccionado.

Se crea la estructura inicial de trabajo dentro de:

.workspace/workflow/

Preparando el proyecto para comenzar la planificación.

⸻

4. Finalización

Una vez configurado el workflow, el asistente confirma la importación y recomienda el siguiente paso.

Ejecutar sdd-plan

⸻

📅 Planificación del proyecto

El usuario ejecuta:

sdd-plan

La skill analiza toda la documentación del proyecto.

Analiza

Business Brief

- Product Guide
- Product Principles

Technical Brief

- Engineering Principles
- Engineering Decisions
- Engineering Conventions
- Engineering Modeling
- Engineering Stack

Specifications

- Business Specs
- Technical Specs

Workflow

- Configuración del workflow

⸻

1. Propone la planificación

A partir del contexto completo del proyecto genera una propuesta inicial con:

- Roadmap
- Milestones
- Releases

⸻

2. Confirmación

El usuario revisa la propuesta.

Puede:

- aprobarla
- modificarla
- solicitar cambios

⸻

3. Generación del plan

Una vez aprobada, sdd-plan crea la estructura de planificación dentro del workflow.

.workspace/
└── workflow/
├── roadmap/
├── milestones/
└── releases/

Se generan el roadmap, los milestones y las releases necesarias para iniciar el desarrollo.

⸻

4. Inicio de la implementación

La IA recomienda comenzar por la primera release y propone las tareas iniciales que deberían implementarse.

⸻

5. Confirmación

El usuario revisa las tareas sugeridas y puede aprobarlas o solicitar modificaciones.

⸻

6. Inicialización de la primera release

Una vez confirmadas las decisiones, sdd-plan crea la primera release.

release-001/
├── release.md
├── tasks.md
├── reviews.md
└── decisions.md

Cada archivo tiene una responsabilidad específica:

- release.md → objetivo, alcance y criterios de éxito de la release.
- tasks.md → backlog priorizado de implementación.
- reviews.md → registro de revisiones funcionales y técnicas durante el desarrollo.
- decisions.md → decisiones tomadas durante la ejecución de la release.

⸻

7. Finalización

La planificación queda completa y el proyecto está listo para comenzar el desarrollo.

El siguiente paso consiste en derivar la primera tarea a un agente de implementación utilizando el workflow configurado.

Claro. Mantendría exactamente el mismo estilo narrativo que utilizaste para el flujo de Greenfield, de forma que parezca una continuación natural.

⸻

Workflow (SDD Studio)

15. Selección del workflow

Una vez finalizada la generación de las especificaciones, el asistente informa que el proyecto ya está listo para comenzar su implementación.

Como siguiente paso, le pregunta al usuario con qué workflow desea trabajar.

Por ejemplo:

- SDD Studio
- Cursor
- Claude Code
- Codex
- Otro proveedor compatible

⸻

16. Instalación de la extensión

Si el usuario selecciona SDD Studio, el asistente explica cómo instalar la extensión Workflow dentro del proyecto.

Una vez instalada, el proyecto queda preparado para utilizar los comandos de planificación e implementación.

⸻

17. Configuración del workflow

El usuario ejecuta:

sdd-studio

La extensión realiza una configuración inicial del workflow.

Primero pregunta qué metodología de trabajo utiliza el equipo.

Por ejemplo:

- Kanban
- Scrum
- Otro

A continuación solicita las convenciones que utilizará el proyecto, como por ejemplo:

- formato de las tareas
- nomenclatura
- estados
- prioridades
- cualquier regla propia del workflow

Con esta información, importa automáticamente la arquitectura del workflow correspondiente y crea la estructura inicial de trabajo dentro del proyecto.

⸻

18. Finalización de la configuración

Una vez completada la configuración, el asistente confirma que el workflow fue instalado correctamente y recomienda continuar con el siguiente paso.

Ejecutar sdd-plan

⸻

Planificación del proyecto

19. Creación del plan

El usuario ejecuta:

sdd-plan

La skill analiza toda la documentación generada durante el proceso SDD.

Incluyendo:

Business

- Product Guide
- Product Principles

Engineering

- Engineering Principles
- Engineering Decisions
- Engineering Conventions
- Engineering Modeling
- Engineering Stack

Specifications

- Business Specifications
- Technical Specifications

Y la configuración del workflow previamente instalada.

⸻

20. Propuesta de planificación

A partir de toda la información disponible, la IA propone una planificación inicial del proyecto.

La propuesta incluye:

- Roadmap
- Milestones
- Releases

Esta planificación representa una primera versión del plan de implementación.

⸻

21. Confirmación

El usuario revisa la propuesta y puede:

- aprobarla
- solicitar modificaciones
- realizar ajustes

Hasta obtener una planificación alineada con sus objetivos.

⸻

22. Generación del plan

Una vez aprobada la propuesta, sdd-plan crea la estructura del workflow dentro del proyecto.

Se generan automáticamente:

- Roadmap
- Milestones
- Releases

Dejando preparado el proyecto para comenzar la implementación.

⸻

23. Inicio de la primera release

A continuación, la IA propone comenzar por la primera release.

Genera las primeras tareas necesarias para iniciar el desarrollo y las presenta al usuario para su revisión.

⸻

24. Confirmación de la implementación

El usuario revisa las tareas sugeridas.

Puede aprobarlas o solicitar modificaciones antes de comenzar el desarrollo.

⸻

25. Inicialización de la release

Una vez confirmadas las decisiones, sdd-plan registra toda la información necesaria para iniciar la primera iteración del proyecto.

Para cada release se generan los siguientes documentos:

- release.md
- tasks.md
- reviews.md
- decisions.md

Estos documentos contienen el objetivo de la release, las tareas planificadas, el registro de revisiones y las decisiones tomadas durante su ejecución.

⸻

26. Finalización

Con la planificación completada, el proyecto queda listo para comenzar su implementación.

El siguiente paso consiste en derivar la primera tarea a un agente de desarrollo utilizando el workflow seleccionado, iniciando así el ciclo iterativo de construcción del producto.
