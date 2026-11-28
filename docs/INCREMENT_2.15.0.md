# HITZBIRA 2.15.0 · Escenas y continuidad del aprendizaje

2026-11-28. Rama única: `feature/guest-access-continuity`.
Base local, remota y preview READY comprobada: `40834b212dba6b1d476fb72cf486b80492da82d1` (2.14.0). Se leyó la sesión Work «Gehitu HITZBIRA eszenak eta zuzentzailea» antes de editar. Sin cambios previos sin guardar en este checkout. Las otras copias de trabajo no se han modificado.

## Incremento

- Quince composiciones SVG nuevas para los ID reales SHELTER/MIRROR/CAUSE, conservando las cinco FOREST y los recursos de marca Bira. Paleta y geometría existentes, objetos y encuadres propios por escena; sin renombrar un mismo fondo. Generador reproducible en `scripts/generate-scene-art.cjs`. Las veinte escenas se asignan por ID en Jokalaria, Bidea y Jolastokia; caché offline y versiones actualizadas juntas.
- Se conservan los cuatro retratos existentes y se amplía su sistema vectorial a Argi y Kai, personajes ya presentes en la narración. Las escenas narradas muestran el reparto que aparece en su texto. No se inventan nuevos protagonistas ni se sustituye la mascota.
- Los contrastes complejos reconocen también el error equivalente en el orden alternativo que ya aceptaba el banco. La reparación cambia solo el auxiliar de la subordinada, incluso si la principal contiene otro «da». Citas, ampliaciones no analizadas y formas desconocidas permanecen sin verificar.
- La dificultad conserva procedencia acotada: tarea, regla, clasificación, estado de fuente y resultado de reescritura. No copia el texto del alumno a esta memoria adicional. El original continúa en el borrador existente. Una reescritura asistida no duplica errores, no aumenta dominio ni adelanta la fecha de recuperación.
- Gogoratu alterna dos contextos por cada categoría de subordinación, concesión y condición. El segundo sondeo se distingue del primero; éxito con pista mantiene intervalo de un día, reconocimiento sin ayuda sigue el calendario existente. Es reconocimiento, no producción autónoma.

## Pruebas lingüísticas y motor

`node tests/run.cjs`: 700 comprobaciones pasan; 62 de integración de escritura/escenas. Fixtures sintéticos, no alumnado real. Pruebas de original, recarga, evidencia, reescritura neutral, no duplicación, fecha, recuperación diferida, rotación y apoyo. Variantes en orden alternativo, concordancia NOR-NORI-NORK en subordinación, citas y cláusulas desconocidas; integración de las veinte escenas. Regresión incluye progreso, aislamiento de cuenta y tres aventuras gratuitas. No se afirma haber realizado auditoría académica independiente.

## Protocolos y fuentes

Aplicadas las copias locales 00/04/05/08 v2.1 y 02 v2.0 identificadas en `INCREMENT_2.14.0.md`. 09 no localizado en los materiales accesibles; no se inventa ni se declara cumplido. Se reutilizan los contrastes y alternativas ya existentes y su estado `berrikusteko`. Los tres sondeos nuevos son adaptaciones sintéticas de esos mecanismos y requieren revisión. No se crean fichas canónicas ni se atribuyen ID o verificación de Drive. Inventario actualizado: `SCENE_INVENTORY_2.15.0.json`; anterior intacto.

## CI y preview

Incremento ejecutable `275d12debe235a91ac42f65418d937d58d8db0fb`: [CI 46124911999](https://github.com/antoniourutz-dev/hitzbira/actions/runs/46124911999) completado con `success`. Vercel `dpl_3n8vfKiryVVhb8jz342rK8A5dpGs`, estado READY, misma rama y SHA, target preview (`null`, no producción). URL inmutable: https://hitzbira-d6bhtu0yb-antoniourutz-devs-projects.vercel.app ; alias estable: https://hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app/ . Este cierre documental no modifica el ejecutable.

## Revisión visual

Navegador real sobre la preview de 2.15.0, meta-versión comprobada. Se inspeccionaron individualmente las quince ilustraciones nuevas: refugio 01–05, espejo 01–05 y agua 01–05. No se heredan como pruebas del nuevo incremento las de 2.14.0.

Smoke real con el borrador previo FOREST-02, Erronka 3/7: abrir, cerrar, reabrir y volver a Bidea conserva el mismo paso; Gaur/Jolastokia y Bidea muestran FOREST-02. Escritorio 1366×900: footer inferior 898.997, viewport 900; móvil solicitado 390×844 (DOM 391×844): footer inferior 843.997. Sin desbordamiento horizontal. Capturas inspeccionadas: texto legible y Jarraitu visible. Imágenes rotas observadas: 0; errores de consola capturados: 0. Viewport restaurado al terminar.

Alcance limitado: las escenas nuevas se verificaron individualmente y su conexión al jugador mediante pruebas de integración; no se recorrieron las veinte escenas completas por UI ni se probó una cuenta autenticada. El smoke no prueba el rendimiento didáctico ni equivale a una auditoría de accesibilidad. No se alteró el progreso previo para desbloquear aventuras durante el smoke.

## Límites

Corrector determinista de contrastes acotados; no análisis semántico general. Revisión académica independiente, pilotaje con producciones autorizadas y flujo completo de cuenta autenticada pendientes. No se afirma aprendizaje causado por el cambio. Ninguna modificación de Supabase, permisos, servicios de IA, producción/main ni claves de progreso. No se muestran niveles MCER nuevos en interfaz.

Rollback: revertir los commits del incremento sobre la misma rama. No requiere migraciones ni reemplazar almacenamiento previo.
