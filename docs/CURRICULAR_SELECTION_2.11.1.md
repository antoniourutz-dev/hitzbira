# Ikasi según el recorrido · 2.11.1

27/11/2026. Solo `feature/guest-access-continuity`. Base verificada local/remota: `2cb84d741f5a46556020d5adb2066ab47e17c837` (Visual Polish 2, 2.11.0, trabajo terminado y árbol limpio). Se consultó su chat de Work y se envió aviso de coordinación para evitar ediciones concurrentes. Producción/main: `f69f1b2178f6d951657cbaee4ce139c69cccf939`, 2.10.7; no se modifica.

## Resultado funcional

Ikasi abre por defecto el material del recorrido real guardado por Bidea. La proyección `learningContext()` lee el estado bajo la misma clave de cuenta y conserva episodio actual, misión y memoria de dificultades; no crea otro perfil. Hay dos bandas narrativas disponibles: A1–A2 y B1–B2. El motor **no infiere individualmente A1 frente a A2 ni B1 frente a B2**. La UI lo explica. Una elección de aventura o placement orientativo no acredita nivel.

Sin recorrido/evidencia se propone un comienzo básico provisional, sin prueba inicial ni selector obligatorio. No se deduce un nivel exacto a partir de XP, estrellas, visitas o aciertos. C1/C2 no se habilitan como recorridos: no hay camino autorizado disponible en este incremento.

La selección proyecta únicamente IDs del catálogo cargado por el acceso existente. Las listas editoriales en `learning-selection.js` vinculan material ya disponible con ambos recorridos; no reclasifican automáticamente «Hastapena/Aurrera/Maisutasuna» como MCER. La segunda aventura forestal incorpora las estructuras verbales que realmente utiliza. Se conservan los prerrequisitos disponibles del grafo existente y relaciones editoriales concretas entre fichas: por ejemplo NOR antes de causa, causa antes de consecuencia. Una práctica previa orienta la secuencia; no demuestra dominio. Visitar una ficha no satisface la práctica previa. Un prerrequisito ausente no se considera cumplido.

Gomendatutakoa, Sendotu, Aurretik lantzeko y Jarraitu ikasten separan acciones y evitan tarjetas duplicadas. Se recuperan registros incorrectos o pendientes de comparación y dificultades del episodio (casos, auxiliares, causa/resultado). Las recuperaciones posteriores y los vencimientos existentes se respetan. El repaso puede recuperar una base anterior pertinente; errores B1 de otra aventura no introducen causa en el recorrido inicial A1. El motor sigue siendo provisional, con reglas acotadas: no es diagnóstico lingüístico general ni validación académica independiente.

Grupos, familias, búsqueda, paginación y contadores se calculan sobre el conjunto visible. Buscar no abre otros niveles silenciosamente. «Material osagarria» permite consultar voluntariamente todo el catálogo existente, con indicación visible, sin cambiar aventura ni convertir esa consulta en recomendación principal. Volver a las entradas principales recupera la vista del recorrido. Se conservan consultas profundas y navegación atrás/adelante. El taller de casos comienza con seis casos; A1–A2 comienza en singular. El taller completo continúa accesible como consulta voluntaria.

Praktikatu reutiliza la misma selección en sesiones, familias, práctica breve, refuerzo y siguiente propuesta. Las consultas y prácticas adicionales siguen siendo voluntarias. No cambian los endpoints, permisos, streams, claves de progreso o mecanismos de sincronización. Si no carga la política de selección, el arranque muestra un error y reintento; no muestra silenciosamente el banco completo.

El invitado conserva la guardia existente: únicamente aventuras gratuitas disponibles dentro del límite de las tres primeras. No se abre Ikasi, Praktikatu, B1–B2 ni material complementario al invitado. Actualmente hay dos aventuras gratuitas completas; la tercera continúa pendiente.

## Catálogo y Supabase

Consulta de solo lectura del 27/11/2026 a `hb_runtime_pilot_records`, release `hb-1.2-e461f43`: bank05 30 fichas, bank06 27, bank07 34, bank08 37; decl 60 modelos. Los 128 IDs coinciden con los bancos estáticos usados en pruebas. Se revisó el gateway existente: solo cinco bancos de gramática permitidos, autorización de cuenta y release listo; no se ampliaron lecturas, permisos ni publicación. No se incluyeron borradores adicionales recuperados de tablas privadas.

## Pruebas locales y de navegador

`node tests/run.cjs`: todas las suites superadas, incluidas 34 comprobaciones nuevas. Cubren cambio de recorrido, ausencia de evidencia, placement aproximado, prerrequisitos, respuestas incorrectas/no verificadas, recuperación anterior, aislamiento por cuenta, invitado, material ajeno y catálogo incompleto. Se prueba también la proyección real de Bidea y su conservación de progreso. `git diff --check` sin errores.

Chrome, aplicación real servida localmente con bancos estáticos y una indicación visible de cuenta simulada, sin sincronización: entrada Ikasi sin evidencia; elección de World desde Gaur; búsqueda «balitz» sin resultado en recomendación y una ficha en consulta voluntaria; apertura de ficha y retorno; sesión recomendada, respuesta y feedback; cambio real World → Basorako bidea; taller de seis casos/singular → taller completo → recorrido; navegación atrás. Móvil 390×844: botones utilizables, feedback/avance y ausencia de desbordamiento (ancho y scroll 375/375). Escritorio revisado visualmente. La captura Chrome falló de forma intermitente; se conservó la comprobación DOM/accesible y la captura móvil disponible. No se declara una sesión autenticada real ni sincronización remota verificadas.

## Fuentes y límites del incremento

Consultados el método de estudio v1.1 (`1g42sF5p3QWGcYf177giFVxRuY12qsp8RtY9Ji14E7vA`) y mapa de producto v2.1 (`1HTRcA852PmWtHZ5sAmB8rChJ1MVx3x_J8TJO9tM3F24`), documentación del repositorio y entrega de Visual Polish 2. Se buscaron en Drive y archivos locales los originales 00_PROTOKOLO_KOMUNA, 01_MATERIAL_SORTZAILEA, 04_HIZKUNTZA_LABORATEGIA, 05_EZARPENA_ETA_KALITATE_PROBAK, 08_EZAGUTZA_BANKUAREN_KUDEAKETA y 09_AUDITORIA_2_1: no localizados como originales; no se afirma cumplimiento íntegro de documentos no recuperados.

Se recuperó `JUNIOR_03B_UNIBERTSO_NARRATIBOA.md` (`1KCvI32H7ybS1obHpjMhxRtuCCun27LD5`): K04 «Lamiaren ispilua», contraste de imágenes, adjetivos y comparación, en borrador. No constituye una aventura lista con actividades y revisión cultural. Se priorizó la implementación y verificación de Ikasi. **No se creó ni completó Lamiaren ispilua**, no se añadieron episodios B1–B2 ni recorridos C1/C2 y no se cambiaron estados de aprobación del contenido.

Reversión: revertir este incremento en la misma rama y dejar reconstruir la preview. Sin cambios ni reversión de datos.
