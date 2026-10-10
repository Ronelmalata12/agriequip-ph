import type { Equipment } from '../types'

// Lightweight original vector illustrations: no image downloads or icon packages.
export function EquipmentArt({ kind }: { kind: Equipment['art'] }) {
  return <svg className="equipment-art" viewBox="0 0 360 200" fill="none" aria-hidden="true">
    <ellipse cx="185" cy="171" rx="111" ry="9" fill="#20372e" opacity=".09" />
    {kind === 'tractor' && <g>
      <path d="m145 115 97-61 27 3" stroke="#35433a" strokeWidth="8" strokeLinecap="round" />
      <path d="m155 117 91-40 27 1" stroke="#68776c" strokeWidth="5" strokeLinecap="round" />
      <path d="m93 113-23 22h50" stroke="#68776c" strokeWidth="8" strokeLinejoin="round" />
      <path d="M113 83h72l16 20v33H99V99z" fill="#c56044" />
      <path d="M113 83h72l16 20H99z" fill="#e18462" />
      <rect x="135" y="95" width="37" height="19" rx="3" fill="#efc59f" />
      <path d="M145 82V62h11v20" fill="#39473e" />
      <circle cx="137" cy="142" r="32" fill="#2e3934" />
      <circle cx="137" cy="142" r="19" fill="#7f8a80" />
      <circle cx="137" cy="142" r="9" fill="#d7dbcc" />
      <path d="m111 123 7 7m-10 13h10m5 24 4-10m34-14h-10m-5-25-4 10" stroke="#59635a" strokeWidth="4" />
      <path d="m201 126 32 10 16 25h-29l-19-16" fill="#9baca0" />
    </g>}
    {kind === 'tiller' && <g>
      <path d="m194 115 46-61 27 3m-72 67 63-56 20 3" stroke="#475148" strokeWidth="6" strokeLinecap="round" />
      <path d="M111 92h86l17 42H94z" fill="#d6a348" />
      <path d="M123 78h49v26h-49z" fill="#49564d" />
      <path d="M123 78h49v8h-49" fill="#6a786d" />
      <rect x="137" y="69" width="19" height="9" rx="3" fill="#414b43" />
      <path d="M104 134h101l17 14H93z" fill="#f0c775" />
      <circle cx="119" cy="150" r="21" fill="#334139" /><circle cx="119" cy="150" r="10" fill="#b3beaa" />
      <path d="M183 134v35m-25-18h50m-42-14 34 28m-34 0 34-28" stroke="#59675c" strokeWidth="7" />
    </g>}
    {kind === 'sprayer' && <g>
      <path d="M145 81c-48-27-47 72-13 75" stroke="#73887c" strokeWidth="7" />
      <path d="M149 53h53l17 16v74h-82V69z" fill="#cfddc9" />
      <path d="M149 53h53l17 16h-82z" fill="#e8efde" />
      <rect x="166" y="44" width="26" height="10" rx="3" fill="#637c66" />
      <path d="M135 127h84v34h-84z" fill="#658b75" />
      <rect x="159" y="132" width="34" height="32" rx="7" fill="#344f42" />
      <path d="M168 140h17m-17 7h17m-17 7h17" stroke="#a4b6a1" strokeWidth="3" />
      <path d="M215 148c28 26 42 11 36-19l-8-38" stroke="#4a6053" strokeWidth="5" />
      <path d="m243 91 25-47" stroke="#9da895" strokeWidth="5" /><path d="m268 44 13-3" stroke="#344f42" strokeWidth="7" strokeLinecap="round" />
      <path d="M161 83h39v26h-39z" fill="#96b19a" /><path d="M173 96h15" stroke="#e8efde" strokeWidth="3" />
    </g>}
    {kind === 'pump' && <g>
      <rect x="104" y="70" width="147" height="91" rx="9" stroke="#51695d" strokeWidth="8" />
      <rect x="118" y="86" width="69" height="58" rx="7" fill="#bf7152" />
      <rect x="128" y="77" width="48" height="18" rx="4" fill="#e4a476" />
      <rect x="142" y="70" width="19" height="7" rx="2" fill="#324b3e" />
      <circle cx="156" cy="121" r="18" fill="#43584c" /><circle cx="156" cy="121" r="10" fill="#91a68e" />
      <path d="M193 104h31v42h-31z" fill="#98aca6" />
      <path d="M219 113h38v16h-38M199 104V87h17v17" fill="#c2cfc1" />
      <path d="M111 164h19m95 0h19" stroke="#324b3e" strokeWidth="7" strokeLinecap="round" />
    </g>}
    {kind === 'farm-tractor' && <g>
      <path d="M85 101h73V69h51v66H85z" fill="#64886a" /><path d="M169 79h27v33h-27z" fill="#c8dbcb" />
      <path d="M159 63h54v9h-54M100 103V77h10v26" fill="#354b3c" />
      <rect x="86" y="112" width="67" height="25" rx="4" fill="#a1b890" /><path d="M207 119h24l22 20" stroke="#748875" strokeWidth="7" />
      <circle cx="113" cy="147" r="24" fill="#354438" /><circle cx="113" cy="147" r="12" fill="#bbc6a6" />
      <circle cx="193" cy="139" r="36" fill="#354438" /><circle cx="193" cy="139" r="19" fill="#bbc6a6" /><circle cx="193" cy="139" r="8" fill="#718569" />
    </g>}
    {kind === 'harvester' && <g>
      <rect x="91" y="76" width="140" height="70" rx="6" fill="#d5a958" /><path d="M168 54h44v44h-44z" fill="#395746" /><path d="M174 60h30v31h-30z" fill="#c7dcca" />
      <path d="M114 76V60h49v16" fill="#e1ba77" /><path d="M230 123h34l22 33h-59" fill="#9db296" />
      <rect x="95" y="140" width="142" height="30" rx="15" fill="#3a493d" /><path d="M110 155h111" stroke="#7b8c74" strokeWidth="9" strokeDasharray="7 8" />
      <path d="M268 139v28m-17-11h44" stroke="#54704f" strokeWidth="6" />
    </g>}
    {kind === 'thresher' && <g>
      <path d="M113 140V99h106v41z" fill="#638a76" /><path d="m115 99 20-24h65l22 24" fill="#95b99d" />
      <path d="m219 103 34 10v13h-34M139 77V54h53v23" fill="#d4bd87" />
      <path d="M125 139v25m81-25v25m-91-2h104" stroke="#425a46" strokeWidth="7" /><circle cx="132" cy="166" r="10" fill="#344d40" /><circle cx="202" cy="166" r="10" fill="#344d40" />
      <circle cx="167" cy="120" r="15" fill="#395747" /><circle cx="167" cy="120" r="8" fill="#bbc8a5" />
    </g>}
    {kind === 'trailer' && <g>
      <path d="M84 90h157v59H84z" fill="#91a487" /><path d="M84 90h157v17H84z" fill="#bdc7a5" />
      <path d="M103 94v48m39-48v48m40-48v48m39-48v48" stroke="#708568" strokeWidth="5" />
      <path d="M241 142h43l14 15" stroke="#536b55" strokeWidth="6" /><circle cx="128" cy="151" r="22" fill="#35493b" /><circle cx="128" cy="151" r="11" fill="#bac6a6" />
      <circle cx="214" cy="151" r="22" fill="#35493b" /><circle cx="214" cy="151" r="11" fill="#bac6a6" />
    </g>}
    {kind === 'wheelbarrow' && <g>
      <path d="m79 91 139 8-19 42h-94z" fill="#809b75" /><path d="m79 91 139 8-21-11-98-7z" fill="#b7c8a0" />
      <path d="m112 143 111-3 47-28m-93 27 18 32m-46-30-30 26" stroke="#71836a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="112" cy="158" r="20" fill="#35493b" /><circle cx="112" cy="158" r="8" fill="#c7ceb0" />
    </g>}
    {kind === 'cutter' && <g>
      <path d="m115 150 110-89" stroke="#a8b5a3" strokeWidth="7" /><path d="m208 78 26-19 15 18-25 20z" fill="#b87251" />
      <path d="m161 113-11-24m11 24 25 12" stroke="#45604b" strokeWidth="6" strokeLinecap="round" />
      <path d="m115 150-23 11 30 10 25-23" fill="#57734e" /><circle cx="118" cy="157" r="8" fill="#acbba0" />
    </g>}
    {['hoe', 'rake', 'shovel'].includes(kind) && <g transform="rotate(25 180 105)">
      <path d="M179 41v111" stroke="#b69c73" strokeWidth="10" strokeLinecap="round" />
      {kind === 'hoe' && <path d="M177 143h48v23h-48z" fill="#748775" />}
      {kind === 'shovel' && <><path d="M167 41V25h25v16" stroke="#697f65" strokeWidth="6" /><path d="M161 144h37v16l-18 18-19-18z" fill="#7f947c" /></>}
      {kind === 'rake' && <><path d="M145 147h72" stroke="#7b8f72" strokeWidth="8" /><path d="M145 147v20m14-20v20m14-20v20m14-20v20m14-20v20m14-20v20" stroke="#7b8f72" strokeWidth="5" /></>}
    </g>}
    {kind === 'bolo' && <g transform="rotate(25 180 105)"><path d="M172 40h18v49h-18z" fill="#9c7953" /><path d="M172 86h18l10 60c3 20-21 26-29 14z" fill="#8f9f8d" /><path d="M184 98v53" stroke="#c2ccb9" strokeWidth="3" /></g>}
    {kind === 'sickle' && <g><path d="m124 161 58-54" stroke="#a1845c" strokeWidth="13" strokeLinecap="round" /><path d="M177 109c59 27 92-17 59-54 21 43-2 64-50 44z" fill="#83967c" /></g>}
  </svg>
}

export function FieldArt() {
  return <svg className="field-art" viewBox="0 0 480 280" fill="none" aria-hidden="true">
    <circle cx="347" cy="60" r="32" fill="#e9cb73" />
    <path d="M0 170c116-121 190-76 277-20 90-100 143-106 203-97v227H0z" fill="#426c53" />
    <path d="M0 220c102-60 212-68 480-96v156H0z" fill="#648568" />
    <path d="M0 254c160-92 330-68 480-53v79H0z" fill="#b6b887" />
    <path d="M29 280c65-74 183-107 338-137M123 280c38-40 92-63 169-84M223 280c43-30 118-51 228-63M324 280c39-21 82-33 156-40" stroke="#254f3d" strokeWidth="4" opacity=".55" />
    <path d="M377 153v-37m0 7-12-14m12 8 13-16" stroke="#cfddc1" strokeWidth="3" strokeLinecap="round" />
    <path d="M270 68h34m-17-14h34" stroke="#a3b79a" strokeWidth="3" strokeLinecap="round" opacity=".5" />
  </svg>
}
