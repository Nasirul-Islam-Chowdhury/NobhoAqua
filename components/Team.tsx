import Image from "next/image";
import { Reveal } from "./Reveal";

const METRO = "Metropolitan University, Bangladesh";
const SAU = "Sylhet Agricultural University";

const MEMBERS = [
  { name: "Pritom Paul", img: "/team/pritom-paul.jpg", role: "Lead Researcher, Data Visualization Specialist & System Architect (Team Lead)", uni: METRO },
  { name: "Md Nasirul Islam Chowdhury", img: "/team/md-nasirul-islam-chowdhury-new.jpg", role: "Software Developer (Full-Stack)", uni: METRO },
  { name: "Joya Roy", img: "/team/joya-roy.jpg", role: "Fisheries Biologist & Marine Ecology Specialist", uni: SAU },
  { name: "Umme Fatema Tarin", img: "/team/umme-fatema-tarin.jpg", role: "Aquatic Environment Analyst & Eco-Modeling Specialist", uni: SAU },
  { name: "Amit Das", img: "/team/amit-das.jpg", role: "Graphics Designer & Vocal Art Specialist", uni: METRO },
  // Name copied from the team slide (it repeats "Pritom Paul") — update when confirmed.
  { name: "Pritom Paul", img: "/team/team-lead-xr.jpg", role: "Lead Researcher, XR Developer & System Architect (Team Lead)", uni: METRO },
];

export function Team() {
  return (
    <section id="team" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-[#03171a] to-[#041f22]">
          <div className="bg-[radial-gradient(60%_140%_at_50%_0%,#9af5e4,#3fb5a6_55%,rgba(10,70,70,0.4)_100%)] px-4 py-7 text-center sm:py-9">
            <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight text-[#04141a] sm:text-6xl">Team NobhoJol</h2>
          </div>
          <ul className="grid gap-x-6 gap-y-12 px-6 pb-14 pt-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
            {MEMBERS.map((m, i) => (
              <li key={m.img} className="group flex flex-col items-center text-center">
                <div className="relative w-44 overflow-hidden border-[3px] border-[#7ff0dc] bg-[#08a58f] shadow-[0_0_0_0_rgba(127,240,220,0)] transition duration-300 [border-radius:8px_42px_8px_8px] group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(127,240,220,0.35)] sm:w-52" style={{ aspectRatio: "4 / 5" }}>
                  <Image src={m.img} alt={`Portrait of ${m.name}`} fill sizes="208px" className="object-cover object-top transition duration-500 group-hover:scale-105" priority={i < 3} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold tracking-wide text-white">{m.name}</h3>
                <p className="mt-1 max-w-[19rem] text-[15px] leading-snug text-slate-200">{m.role}</p>
                <p className="mt-1 max-w-[19rem] text-sm leading-snug text-[#7ff0dc]">{m.uni}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
