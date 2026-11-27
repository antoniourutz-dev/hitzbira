# Unificación Work + Chat · 2026-11-27

Destino único de desarrollo: `feature/guest-access-continuity`.
URL estable: https://hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app/

## Evidencia previa

- Estable: `84fc1c90000f9fb1dcdfc2a10d3e30b9dff5aeb4` (12 exclusivos).
- Work actual: `ceaf07bc0903581fb8f81f82726e8d5ae4deb124` (3 exclusivos).
- Merge-base: `9e67332df5458e37e06b49fc756e79ce1c9de915`.
- Compare en ambas direcciones y clon local coinciden. No se usó el antiguo SHA de Work como su punta actual.

## Resolución

Merge de dos padres, estable primero y Work segundo; reversible con `git revert -m 1 <merge-sha>`.
`bidea/bidea.js`: conservar guardas invitado y logros; incorporar chooseAdventure a través de setLevel protegido, dificultad interna por aventura, temas persistentes y reintentos por palabra. No selector manual de nivel oficial. Etiquetas narrativas también para invitados.
`data.js`, `app.js` y gateway preview de estable se conservan byte a byte; contienen continuidad, consentimiento e importación sin sobrescribir cuentas. Tests de ambas ramas combinados y dos regresiones para el punto de entrada nuevo. Datos de los diez episodios, motor contextual, assets e iconos conservados. Work no había cambiado assets/iconos respecto al merge-base.
Versión y cache PWA: 2.10.6. No cambio de claves de almacenamiento/progreso.

## Verificación local

`node tests/run.cjs`: 477 comprobaciones, diez suites, todas superadas (20+27+206+29+28+20+42+19+49+37).
Incluye diez episodios, diagnóstico contextual, aislamiento de cuentas, hidratación previa a importación, consentimiento, no sobreescritura de cuenta existente, rutas de invitado, vocabulario y rechazo de orígenes parecidos o de producción.

Gateway remoto inspeccionado: hitzbira-learning-preview ACTIVE v2, hash a969caec44a59dac400be9cb2da8b485dac19a2bbb515a2e582bbeb4df619beb.
Allowlist exacta: https://hitzbira-git-feature-hitzbira-171a80-antoniourutz-devs-projects.vercel.app y la URL estable anterior; sin comodines. Autenticación por sesión y autorización de cuenta en el manejador compartido. No se ha redesplegado ningún gateway.

## Límites

Protocolos originales 00/05/08/09 no localizados en repositorio, archivos locales ni búsquedas conectadas Drive/Pages; no se afirma haberlos leído. Se consultaron los documentos técnicos existentes del repositorio. Las pruebas locales usan fixtures; no certifican login real ni lecturas autenticadas de Supabase en esta integración. La evidencia previa de vocabulario C1 permanece en LEXIKOA_VOCABULARY.md; Work asigna A1/B1 por aventura y esos niveles pueden usar fallback explícito si no hay contenido aprobado suficiente. No ampliar nivel ni permisos para forzar vocabulario real.

No se modifica main, gateway de producción, DDL, permisos ni cuentas. No se crea otra rama de destino. La rama histórica Work no se borra ni se reescribe.
