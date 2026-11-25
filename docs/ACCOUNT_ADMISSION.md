# Admisión automática de cuentas HitzBira

Las cuentas confirmadas de Supabase Auth del proyecto Lexikoa (`awdajwrzxceqazmaorxc`) con correo del dominio exacto `hitzbira.app` reciben automáticamente el registro interno que necesitan al iniciar sesión. No requieren una segunda alta manual.

El trigger existente `sustrai_private.hb_auth_domain_guard` asigna a todas las cuentas de ese dominio el rol `hitzbira_isolated` y el permiso administrativo `hitzbira_pilot`. Conserva su restricción actual de nombres: entre 3 y 24 caracteres, letras minúsculas, números, punto, guion y guion bajo; primer carácter alfanumérico. El formulario utiliza la parte anterior a `@hitzbira.app`.

La función `hitzbira-pilot-account` valida el token contra Auth, comprueba la identidad y consulta el estado administrativo actual de la cuenta. Exige correo confirmado, dominio exacto, rol aislado y permiso administrado por el servidor. Rechaza cuentas anónimas, eliminadas y bloqueadas, incluso si presentan un token emitido antes del bloqueo.

Si falta la fila en `hb_registered_accounts`, la función la crea con el UUID de Auth y el nombre derivado de su correo. La operación ignora conflictos por UUID y vuelve a consultar la fila: nunca sobrescribe ni reactiva un registro existente con `enabled=false`. Una inconsistencia o conflicto se rechaza sin modificar otras cuentas. El mismo proceso se aplica antes de leer o guardar progreso, que siempre queda asociado al UUID validado por Auth.

No se cambian contraseñas, confirmaciones, roles, políticas RLS ni datos de aprendizaje. No se habilita un formulario de registro público. Para impedir el acceso a una cuenta se puede conservar su registro con `enabled=false` o bloquearla en Supabase Auth; borrar solamente el registro interno permite que se vuelva a crear al entrar.

Pruebas: `node tests/run.cjs`, incluidas las pruebas de admisión, dominio incorrecto, token inválido, confirmación pendiente, bloqueo, eliminación, cuenta deshabilitada, concurrencia e identidad de los datos de aprendizaje.
