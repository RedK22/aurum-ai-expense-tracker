export const themes = {
  purple: {
    label: "Purple",
    base: "bg-[#020617]",
    style: {
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)",
    },
  },
  aurora: {
    label: "Aurora",
    base: "bg-[#0a0a0a]",
    style: {
      backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(56,189,248,0.4), transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.3), transparent 70%),
          radial-gradient(ellipse at 60% 20%, rgba(236,72,153,0.25), transparent 50%),
          radial-gradient(ellipse at 40% 80%, rgba(34,197,94,0.2), transparent 65%)
        `,
    },
  },
  crimson: {
    label: "Crimson",
    base: "bg-black",
    style: {
      backgroundImage: `
          linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
          radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%)
        `,
    },
  },
  emerald: {
    label: "Emerald",
    base: "bg-[#020617]",
    style: {
      backgroundImage:
        "radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)",
    },
  },
  ember: {
    label: "Ember",
    base: "bg-black",
    style: {
      backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(255,69,0,0.6), transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(255,140,0,0.4), transparent 70%)
        `,
    },
  },
  orchid: {
    label: "Orchid",
    base: "bg-black",
    style: {
      backgroundImage:
        "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
    },
  },
  emeraldStack: {
    label: "Rich Emerald",
    base: "bg-[#051F20]",
    style: {
      backgroundImage: `
      radial-gradient(circle at 50% 120%, #0B2B26 0%, transparent 60%),
      radial-gradient(circle at 50% 100%, #163832 0%, transparent 70%),
      radial-gradient(circle at 50% 80%, #235347 0%, transparent 80%)
    `,
    },
  },

  luna: {
    label: "Luna",
    base: "bg-[#011C40]",
    style: {
      backgroundImage: `
      radial-gradient(circle at 20% 0%, #002859 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, #54ACBF 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, #26658C 0%, transparent 60%),
      radial-gradient(circle at 50% 100%, #023859 0%, transparent 70%)
    `,
    },
  },

  nebula: {
    label: "Nebula",
    base: "bg-[#050510]",
    style: {
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(168,85,247,0.4), transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(59,130,246,0.35), transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(236,72,153,0.25), transparent 60%)
      `,
      filter: "blur(60px)",
    },
  },

  oceanDepth: {
    label: "Ocean Depth",
    base: "bg-[#020617]",
    style: {
      backgroundImage: `
        radial-gradient(circle at 50% 20%, rgba(56,189,248,0.35), transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(2,132,199,0.3), transparent 60%)
      `,
      filter: "blur(50px)",
    },
  },

  frost: {
    label: "Frost",
    base: "bg-[#020617]",
    style: {
      backgroundImage: `
        radial-gradient(circle at 30% 30%, rgba(226,232,240,0.25), transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(148,163,184,0.2), transparent 60%)
      `,
      filter: "blur(40px)",
    },
  },

  forestMist: {
    label: "Forest Mist",
    base: "bg-[#020617]",
    style: {
      backgroundImage: `
        radial-gradient(circle at 40% 30%, rgba(34,197,94,0.35), transparent 50%),
        radial-gradient(circle at 60% 70%, rgba(16,185,129,0.25), transparent 60%)
      `,
      filter: "blur(50px)",
    },
  },

  cyberpunk: {
    label: "Cyberpunk",
    base: "bg-black",
    style: {
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(236,72,153,0.4), transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(59,130,246,0.35), transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(168,85,247,0.3), transparent 60%)
      `,
      filter: "blur(60px)",
    },
  },
};
