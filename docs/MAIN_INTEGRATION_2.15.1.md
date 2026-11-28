# HITZBIRA 2.15.1 · Integración de main

2026-11-28. Destino: `feature/guest-access-continuity`. Main y producción no se modifican.

Padres revisados: desarrollo `00df61a8772c760f9108b35da3f84ae59e9ef3c0` y main `10c3aa8` (avatares de cuenta, menú de perfil y mensajes de sincronización). Base común: `f69f1b2`. Integración mediante merge, conservando ambas historias.

Conflictos resueltos:

- `index.html`: cabecera de perfil de main, comprobación de conexión, carga inicial y política de recursos de desarrollo.
- `data.js`: avatares, selección por cuenta, menú y estado de sincronización de main; diagnóstico de conexión y gestión de acceso de desarrollo. Se conserva el aviso preciso de que puede existir actividad pendiente de sincronizar al salir.
- `package.json` y `sw.js`: versión coherente 2.15.1, caché con las veinte escenas y política de selección existente.

Se conservan los seis avatares de main tal como estaban, sin convertirlos en nuevos protagonistas de la narración ni reemplazar el reparto ya existente. La elección de avatar sigue siendo local por cuenta, conforme a main; no se añade sincronización remota de preferencias. Las escenas, el corrector y Gogoratu no se reescriben.

Pruebas locales: `node tests/run.cjs`, 703 comprobaciones superadas. Incluyen pruebas heredadas de ambas ramas y dos nuevas de integración: selección de avatar aislada por cuenta sin modificar progreso/borrador/memoria; convivencia del menú de perfil, bolada y diagnóstico de conexión. Identidades sintéticas, sin credenciales ni llamadas a cuentas reales.

CI y revisión visual de la preview se comprobarán para el SHA resultante y se comunicarán con el cierre. La prueba autenticada real y la revisión académica independiente siguen pendientes. Sin cambios de Supabase, permisos, IA externa ni claves de progreso.
