# HITZBIRA 2.11.0 · Visual Polish 2

27/11/2026. Base: 702f4f44f7715c089bec06d053efc9f601467423. Rama exclusiva: feature/guest-access-continuity. Preview: https://hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app/.

## Cambios comprobables

- Ikasi organiza los cinco ámbitos por propósito comunicativo, con objetivos, temas, actividad registrada y acciones de estudio/práctica. Reutiliza familias, IDs, ilustraciones e historial. No interpreta visitas ni aciertos como dominio.
- Entrada inicial orientada y retorno a una ficha abierta anteriormente. Buscador y dificultad se despliegan a demanda; filtros activos siguen visibles. Laboratorios de familia se despliegan sin ocultar su acceso y dejan las fichas a la vista. Deklinabidea conserva su taller completo.
- Praktikatu comparte las tarjetas de objetivos y conserva el ámbito seleccionado al llegar desde Ikasi. Permite consultar el modelo de una ficha abierta y practicar ese mismo ID. El resumen ofrece volver a la ficha cuando pertenece a esa sesión.
- Aditzak propone la primera lección sin práctica registrada y permite abrirla directamente; mantiene selector completo, laboratorio, tablas y trinkoak. Es una propuesta de práctica, sin atribuir competencia.
- Navegación de pasos con botones y estado presionado; controles de avance visibles sobre la navegación móvil. Nueva carga inicial con Bira y estado accesible. Se acepta también ?atala=praktikatu; la ruta canónica sigue siendo praktika.
- Gaur distingue la aventura activa también en móvil; Gaur/Bidea eliminan títulos y contadores redundantes.
- El acceso incorpora diagnóstico de conexión sin credenciales. Las solicitudes de Auth/gateway tienen límite de 12 segundos y mensajes que identifican la etapa de conexión fallida. Se conservan autenticación, autorización, destinos y progresos.

## Pruebas

510 comprobaciones locales en once suites, incluidas diez nuevas de continuidad, ámbito, guardia de invitado, estados sin dominio ficticio y errores/timeout. Comando: node tests/run.cjs. git diff --check sin errores.

Revisión interactiva de las pantallas reales servidas localmente: Ikasi, Praktikatu, Aditzak, Gaur y Bidea; escritorio (1440×900) y móvil (390×844). Se recorrió área → familia → ficha → práctica guiada → feedback → práctica independiente → resumen. La entrada directa de Aditzak abrió HB-L01. Los controles y la estructura se inspeccionaron mediante árbol accesible y capturas; una incidencia de captura en Chrome se resolvió con el navegador integrado. Se comprobó buscador/estado vacío por pruebas de uso al cerrar la revisión.

El servidor de QA está fuera del repositorio y sirve bancos estáticos con una indicación visible. Simula disponibilidad de interfaz de cuenta solo en localhost; no certifica acceso autenticado ni sincronización. No se publica ese servidor ni se cambian guardias de invitado del producto.

## Acceso y límites

El usuario informó de «Failed to fetch». Inspección remota: gateway preview ACTIVE v2, hash a969caec44a59dac400be9cb2da8b485dac19a2bbb515a2e582bbeb4df619beb. Preflight real desde Windows: gateway 204 con origen estable exacto; Auth 200. Sin credenciales, sin altas, sin cambios de permisos. Esto demuestra disponibilidad y CORS del origen estable desde ese entorno, no una sesión real del usuario. La causa individual permanece sin confirmar; el diagnóstico de navegador permite separar red de credenciales.

Producción inspeccionada en Vercel: READY, main f69f1b2178f6d951657cbaee4ce139c69cccf939, 2.10.7. No se modifica main, producción, funciones remotas, DDL, permisos ni cuentas.

Fuentes consultadas: arquitectura y documentación técnica del repositorio; Plan Director, Hoja de Ruta, inventario técnico y prompts operativos en Drive; «HitzBira: el método de estudio», versión 1.1 del 27/11/2026, documento 1g42sF5p3QWGcYf177giFVxRuY12qsp8RtY9Ji14E7vA. Se buscaron los originales 00_PROTOKOLO_KOMUNA, 01_MATERIAL_SORTZAILEA, 04_HIZKUNTZA_LABORATEGIA, 05_EZARPENA_ETA_KALITATE_PROBAK, 08_EZAGUTZA_BANKUAREN_KUDEAKETA y 09_AUDITORIA_2_1 en las fuentes disponibles: no localizados como originales; los documentos de dirección no los sustituyen. No se declara auditoría académica independiente ni conformidad WCAG completa.

Reversión de preview: revertir el commit de esta versión en la misma rama y dejar que la integración Git reconstruya. Los datos y claves de almacenamiento se conservan.

## Evidencia posterior al despliegue

Commit funcional e16b9981db6334839791df4e8c770ccca943c97c. Vercel READY dpl_EvCtetDrDGH2rpJjbrR4fVewSyYF, alias estable confirmado. CI de ese commit: https://github.com/antoniourutz-dev/hitzbira/actions/runs/46068220047, success. En la URL estable, el diagnóstico de navegador devolvió «Konexioa prest dago» sin credenciales y sin errores de consola observados. Meta de versión 2.11.0; navegación Gaur → Bidea con borrador invitado conservado y sin desbordamiento horizontal (639/639 px). Falta sesión real de cuenta: no se declara reparada ni probada.

La revisión final separó visualmente el resultado positivo del diagnóstico (verde) de los errores de acceso. Esta corrección y el registro de evidencia se versionan en un commit posterior de la misma rama.
