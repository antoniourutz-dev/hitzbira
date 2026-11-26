-- HB-CYCLE/0.9 internal practice checkpoint; no publication or academic evidence.
-- Compatible with old streams. The existing generic RPC must continue to reject this new stream.
set local lock_timeout='3s';
alter table public.hb_learning_state drop constraint hb_learning_state_stream_check,
 add constraint hb_learning_state_stream_check check(stream in ('hitzbira-unified-09','hitzbira-goal-v1','hitzbira-assessment-v1','hitzbira-journey-v1','sustrai-aditzak-v1','hitzbira-path-v1','hitzbira-cycle-v1'));
alter table public.hb_learning_events drop constraint hb_learning_events_stream_check,
 add constraint hb_learning_events_stream_check check(stream in ('hitzbira-unified-09','hitzbira-goal-v1','hitzbira-assessment-v1','hitzbira-journey-v1','sustrai-aditzak-v1','hitzbira-path-v1','activity','hitzbira-cycle-v1'));

create function sustrai_private.hb_cycle_snapshot_valid(s jsonb) returns boolean
language plpgsql immutable security invoker set search_path='' as $fn$
declare catalog constant jsonb:='{"HB-GOLD-A1-001@0.2:D01@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"diagnostic","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:D02@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"diagnostic","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:D03@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"diagnostic","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P01@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P02@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P03@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P04@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P05@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P06@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P07@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P08@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P09@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P10@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P11@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-GOLD-A1-001@0.2:P12@0.2":{"unit":"HB-GOLD-A1-001@0.2","phase":"practice","node":"V-0","vid":"6e018414-539a-4322-9a3f-dff8e5b88c50","criteria":[]},"HB-LAB-IZE-001@0.1:GB-ize-01@0.5":{"unit":"HB-LAB-IZE-001@0.1","phase":"practice","node":"IZE-1","vid":"24fddc4f-7cfb-4495-b305-114d4cc121dd","criteria":[]},"HB-LAB-IZE-001@0.1:GB-ize-02@0.5":{"unit":"HB-LAB-IZE-001@0.1","phase":"practice","node":"IZE-1","vid":"24fddc4f-7cfb-4495-b305-114d4cc121dd","criteria":[]},"HB-LAB-IZE-001@0.1:GB-ize-03@0.5":{"unit":"HB-LAB-IZE-001@0.1","phase":"practice","node":"IZE-1","vid":"24fddc4f-7cfb-4495-b305-114d4cc121dd","criteria":[]},"HB-GOLD-B1-001@0.2:D01@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"diagnostic","node":"V-1","vid":"4b74f423-0c4c-4567-ba87-0c1a8eab638a","criteria":["V-1.01"]},"HB-GOLD-B1-001@0.2:D02@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"diagnostic","node":"DEN-1","vid":"2d7dfa06-0b1d-40a2-9dd0-910a43740bb9","criteria":["DEN-1.03"]},"HB-GOLD-B1-001@0.2:D03@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"diagnostic","node":"KAU-1","vid":"36176776-6175-4e24-a83d-ba423d0caac9","criteria":["KAU-1.01"]},"HB-GOLD-B1-001@0.2:P01@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"V-1","vid":"4b74f423-0c4c-4567-ba87-0c1a8eab638a","criteria":["V-1.01"]},"HB-GOLD-B1-001@0.2:P02@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"V-1","vid":"4b74f423-0c4c-4567-ba87-0c1a8eab638a","criteria":["V-1.01"]},"HB-GOLD-B1-001@0.2:P03@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"V-1","vid":"4b74f423-0c4c-4567-ba87-0c1a8eab638a","criteria":["V-1.01"]},"HB-GOLD-B1-001@0.2:P04@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"V-1","vid":"4b74f423-0c4c-4567-ba87-0c1a8eab638a","criteria":["V-1.01"]},"HB-GOLD-B1-001@0.2:P05@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"DEN-1","vid":"2d7dfa06-0b1d-40a2-9dd0-910a43740bb9","criteria":["DEN-1.01","DEN-1.03"]},"HB-GOLD-B1-001@0.2:P06@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"DEN-1","vid":"2d7dfa06-0b1d-40a2-9dd0-910a43740bb9","criteria":["DEN-1.01","DEN-1.03"]},"HB-GOLD-B1-001@0.2:P07@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"DEN-1","vid":"2d7dfa06-0b1d-40a2-9dd0-910a43740bb9","criteria":["DEN-1.02"]},"HB-GOLD-B1-001@0.2:P08@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"DEN-1","vid":"2d7dfa06-0b1d-40a2-9dd0-910a43740bb9","criteria":["DEN-1.01","DEN-1.03"]},"HB-GOLD-B1-001@0.2:P09@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"KAU-1","vid":"36176776-6175-4e24-a83d-ba423d0caac9","criteria":["KAU-1.02"]},"HB-GOLD-B1-001@0.2:P10@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"KAU-1","vid":"36176776-6175-4e24-a83d-ba423d0caac9","criteria":["KAU-1.01"]},"HB-GOLD-B1-001@0.2:P11@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"KAU-1","vid":"36176776-6175-4e24-a83d-ba423d0caac9","criteria":["KAU-1.03","KAU-1.01"]},"HB-GOLD-B1-001@0.2:P12@0.2":{"unit":"HB-GOLD-B1-001@0.2","phase":"practice","node":"KAU-1","vid":"36176776-6175-4e24-a83d-ba423d0caac9","criteria":["KAU-1.02","KAU-1.03"]}}'::jsonb; k text; v jsonb; u text; r jsonb; e jsonb; target jsonb; q jsonb; sess jsonb; j jsonb;
begin
 if s is null or jsonb_typeof(s) is distinct from 'object' or octet_length(s::text)>300000
 or not (s ?& array['schema','revision','active','records','events','session'])
 or s-array['schema','revision','active','records','events','session']<>'{}'::jsonb
 or s->'schema' is distinct from '2'::jsonb or coalesce(s->>'revision','') !~ '^[0-9]{1,10}$'
 or coalesce(s->>'active','') not in ('HB-GOLD-A1-001','HB-LAB-IZE-001','HB-GOLD-B1-001')
 or jsonb_typeof(s->'records') is distinct from 'object' or jsonb_typeof(s->'events') is distinct from 'array'
 or jsonb_array_length(s->'events')>1500 then return false; end if;
 for u,r in select key,value from jsonb_each(s->'records') loop
  if u not in ('HB-GOLD-A1-001@0.2','HB-LAB-IZE-001@0.1','HB-GOLD-B1-001@0.2') or jsonb_typeof(r) is distinct from 'object' or not (r ?& array['diagnostic','attempts','agenda','lessonSeen']) or r-array['diagnostic','attempts','agenda','lessonSeen']<>'{}'::jsonb or jsonb_typeof(r->'lessonSeen') is distinct from 'boolean' then return false; end if;
  for k,v in select key,value from jsonb_each(r->'diagnostic') loop
   target:=catalog->k;
   if target is null or target->>'unit'<>u or target->>'phase'<>'diagnostic' or coalesce(v#>>'{}','') not in ('match','incorrect','unverified','skipped') then return false; end if;
  end loop;
  for k,v in select key,value from jsonb_each(r->'attempts') loop
   target:=catalog->k;
   if target is null or target->>'unit'<>u or target->>'phase'<>'practice' or jsonb_typeof(v) is distinct from 'object' or not(v ?& array['n','lastResult','lastMode','lastAssisted']) or v-array['n','lastResult','lastMode','lastAssisted']<>'{}'::jsonb or coalesce(v->>'n','') !~ '^[1-9][0-9]{0,5}$' or coalesce(v->>'lastResult','') not in ('match','incorrect','unverified','exposure') or coalesce(v->>'lastMode','') not in ('choose','write') or jsonb_typeof(v->'lastAssisted') is distinct from 'boolean' then return false; end if;
  end loop;
  for k,v in select key,value from jsonb_each(r->'agenda') loop
   target:=catalog->k;
   if target is null or target->>'unit'<>u or target->>'phase'<>'practice' or jsonb_typeof(v) is distinct from 'object' or not(v ?& array['policy','version','step','at','due','session','event','reason']) or v-array['policy','version','step','at','due','session','event','reason']<>'{}'::jsonb
   or v->>'policy' is distinct from 'HB-ADAPT-001/0.1.0-agenda-p1.03' or v->>'version' is distinct from target->>'vid' or coalesce(v->>'step','') !~ '^[0-4]$' or coalesce(v->>'at','') !~ '^[1-9][0-9]{0,15}$' or coalesce(v->>'due','') !~ '^[1-9][0-9]{0,15}$' or (v->>'due')::numeric<(v->>'at')::numeric+86400000
   or coalesce(v->>'session','') !~* '^[0-9a-f-]{36}$' or coalesce(v->>'event','') !~* '^[0-9a-f-]{36}$' or coalesce(v->>'reason','') not in ('initial','delayed_model_match','practice_review','compare_pending','practice_exposure','early_model_match') then return false; end if;
  end loop;
 end loop;
 for e in select value from jsonb_array_elements(s->'events') loop
  target:=catalog->(e->>'key');
  if target is null or jsonb_typeof(e) is distinct from 'object' or not(e ?& array['id','key','unit','session','at','result','assisted','attempt','mode','academicEvidence','hint']) or e-array['id','key','unit','node','capabilityVersionId','criteria','session','at','result','assisted','attempt','mode','academicEvidence','hint']<>'{}'::jsonb or e->>'unit' is distinct from target->>'unit'
   or e->'academicEvidence' is distinct from 'false'::jsonb or (e ? 'node' and e->>'node' is distinct from target->>'node') or (e ? 'capabilityVersionId' and e->>'capabilityVersionId' is distinct from target->>'vid') or (e ? 'criteria' and e->'criteria' is distinct from target->'criteria')
   or coalesce(e->>'id','') !~* '^[0-9a-f-]{36}$' or coalesce(e->>'session','') !~* '^[0-9a-f-]{36}$' or coalesce(e->>'at','') !~ '^[1-9][0-9]{0,15}$' or coalesce(e->>'attempt','') !~ '^[1-9][0-9]{0,5}$' or coalesce(e->>'hint','') not in ('0','5') or jsonb_typeof(e->'assisted') is distinct from 'boolean' or coalesce(e->>'mode','') not in ('choose','write') or coalesce(e->>'result','') not in ('match','incorrect','unverified','skipped','model_seen') then return false; end if;
 end loop;
 if (select count(distinct value->>'id') from jsonb_array_elements(s->'events'))<>jsonb_array_length(s->'events') then return false; end if;
 sess:=s->'session';
 if sess='null'::jsonb then return true; end if;
 if jsonb_typeof(sess) is distinct from 'object' or not(sess ?& array['id','primary','focus','budget','seen','units','reviews','novel','done','paused','current']) or sess-array['id','primary','focus','budget','seen','units','reviews','novel','done','paused','current']<>'{}'::jsonb or coalesce(sess->>'id','') !~* '^[0-9a-f-]{36}$' or coalesce(sess->>'primary','') not in ('HB-GOLD-A1-001','HB-LAB-IZE-001','HB-GOLD-B1-001') or coalesce(sess->>'budget','') not in ('3','6') or jsonb_typeof(sess->'focus') is distinct from 'boolean' or jsonb_typeof(sess->'paused') is distinct from 'boolean' or coalesce(sess->>'done','') !~ '^[0-6]$' or coalesce(sess->>'reviews','') !~ '^[0-6]$' or coalesce(sess->>'novel','') !~ '^[0-6]$' or (sess->>'done')::int>(sess->>'budget')::int or jsonb_array_length(sess->'seen')<>(sess->>'done')::int or jsonb_array_length(sess->'units')>2 then return false; end if;
 for j in select value from jsonb_array_elements(sess->'seen') loop if not(catalog ? (j#>>'{}')) then return false; end if; end loop;
 for j in select value from jsonb_array_elements(sess->'units') loop if coalesce(j#>>'{}','') not in ('HB-GOLD-A1-001','HB-LAB-IZE-001','HB-GOLD-B1-001') then return false; end if; end loop;
 q:=sess->'current';
 if jsonb_typeof(q) is distinct from 'object' then return false; end if;
 if q->>'type'='summary' then return q-array['type','reason']='{}'::jsonb and coalesce(q->>'reason','') in ('budget','no_candidate'); end if;
 if q->>'type'='learn' then return q-array['type','unit','attempt','hint']='{}'::jsonb and coalesce(q->>'unit','') in ('HB-GOLD-A1-001','HB-LAB-IZE-001','HB-GOLD-B1-001') and q->>'attempt'='0' and q->>'hint'='0'; end if;
 target:=catalog->(q->>'key');
 if target is null or q-array['type','unit','key','intent','mode','attempt','hint','feedback']<>'{}'::jsonb or q->>'type' is distinct from target->>'phase' or q->>'unit' is distinct from split_part(target->>'unit','@',1) or coalesce(q->>'attempt','') !~ '^[0-9]{1,6}$' or coalesce(q->>'hint','') not in ('0','5') or coalesce(q->>'mode','') not in ('choose','write') or coalesce(q->>'intent','') not in ('diagnostic','review','compare','spaced','unseen','observe','supported','recognition','recall') then return false; end if;
 v:=q->'feedback'; if v='null'::jsonb then return true; end if;
 return coalesce(jsonb_typeof(v)='object' and v-array['result','closed']='{}'::jsonb and jsonb_typeof(v->'closed')='boolean' and v->>'result' in ('match','incorrect','unverified','skipped','model_seen'),false);
exception when others then return false;
end $fn$;
revoke all on function sustrai_private.hb_cycle_snapshot_valid(jsonb) from public,anon,authenticated;
grant execute on function sustrai_private.hb_cycle_snapshot_valid(jsonb) to service_role;

create function public.hb_commit_cycle_checkpoint(p_user uuid,p_event uuid,p_expected bigint,p_snapshot jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $fn$
declare prior jsonb; prior_revision bigint; previous public.hb_learning_events%rowtype; signature text; stamp jsonb; next_revision bigint;
begin
 if p_user is null or not exists(select 1 from public.hb_registered_accounts where user_id=p_user and enabled) then return jsonb_build_object('ok',false,'reason','account_disabled'); end if;
 if p_event is null or p_expected is null or p_expected<0 or p_expected>9007199254740990 or sustrai_private.hb_cycle_snapshot_valid(p_snapshot) is distinct from true then return jsonb_build_object('ok',false,'reason','invalid'); end if;
 signature:=encode(sha256(convert_to(p_snapshot::text,'UTF8')),'hex');
 stamp:=jsonb_build_object('t','cycle_checkpoint','expected',p_expected,'sha256',signature);
 perform pg_advisory_xact_lock(hashtextextended(p_user::text,0));
 select * into previous from public.hb_learning_events where user_id=p_user and event_id=p_event;
 if found then
  if previous.stream='hitzbira-cycle-v1' and previous.patch=stamp then return jsonb_build_object('ok',true,'duplicate',true,'revision',p_expected+1); end if;
  return jsonb_build_object('ok',false,'reason','event_id_conflict');
 end if;
 select payload,revision into prior,prior_revision from public.hb_learning_state where user_id=p_user and stream='hitzbira-cycle-v1';
 prior_revision:=coalesce(prior_revision,0);
 if p_expected<>prior_revision then return jsonb_build_object('ok',false,'reason','conflict','revision',prior_revision); end if;
 if prior is not null and ((p_snapshot->>'revision')::bigint<=(prior->>'revision')::bigint or jsonb_array_length(p_snapshot->'events')<jsonb_array_length(prior->'events') or exists(select 1 from jsonb_array_elements(prior->'events') with ordinality old(value,pos) where old.value is distinct from p_snapshot->'events'->((old.pos-1)::int))) then return jsonb_build_object('ok',false,'reason','regressive'); end if;
 next_revision:=prior_revision+1;
 insert into public.hb_learning_state(user_id,stream,payload,revision) values(p_user,'hitzbira-cycle-v1',p_snapshot,next_revision) on conflict(user_id,stream) do update set payload=excluded.payload,revision=excluded.revision,updated_at=now();
 insert into public.hb_learning_events(user_id,event_id,stream,patch,details,active_day) values(p_user,p_event,'hitzbira-cycle-v1',stamp,jsonb_build_object('kind','cycle_checkpoint','practice_only',true,'academicEvidence',false),null);
 return jsonb_build_object('ok',true,'revision',next_revision);
end $fn$;
revoke all on function public.hb_commit_cycle_checkpoint(uuid,uuid,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.hb_commit_cycle_checkpoint(uuid,uuid,bigint,jsonb) to service_role;
