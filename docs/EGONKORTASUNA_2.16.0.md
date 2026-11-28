# HITZBIRA 2.16.0 · Primer lote de consolidación

Base 67a36ae. Informe de revisión 28-11-2026, pp. 2–8. Alcance: correcciones inequívocas y coherencia de feedback. Sin cambios en main, esquema, permisos o producción.

| Hallazgo | Cambio | Revalidación prevista |
|---|---|---|
| Didáctica A1 | MC barajadas al crear estado, conservadas durante reintentos; draft existente preserva opciones actuales | prueba interacción; no se añade persistencia de lecciones |
| A7 | escritura en lecciones usa el corrector acotado y cierre neutral; no XP ni acierto por texto no verificado | prueba interacción |
| Alumno: parejas rojas | asociaciones completas se cierran como completadas; errores previos no cuentan como primer acierto y conservan ayuda | regresión |
| Alumno: Egiaztatu | estilo deshabilitado explícito | prueba visual pendiente |
| Ling. M2, N1–N5, B12 | Gaurko, clave fiel, consignas, definición, dativo coherente y marco de la causa | revisión académica independiente pendiente |
| Ling. M5 | se desambigua KAUS-A02-6, conserva rv hasta revisión | revisión académica pendiente |
| Ling. M1 | no se sustituye indiscriminadamente parte-hartzaileak por partizipioak: ERR-1 describe participantes, casos y auxiliar; revisar V-0 y fuentes antes de cambiar currículo | pendiente contraste |

Pendientes sin declarar resueltos: Zeren y restantes rv, KON-1-5, dudas léxicas/nahiz eta, gauetik y laboratorio, todas las demás incidencias del informe; login, accesibilidad, navegación, recuentos, unificación curricular, repaso, adaptación, bancos Supabase y revisión visual real. No se amplía alcance. Las pruebas sintéticas no acreditan eficacia educativa ni corrección completa.
