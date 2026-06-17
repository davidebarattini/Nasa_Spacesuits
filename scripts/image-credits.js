/**
 * Crediti per immagini in galleria/lightbox.
 * Chiave: nome file (es. "11-61-mr4-55s.jpg.webp")
 */
export const IMAGE_CREDITS = {
  "11-61-mr4-55s.jpg.webp": {
    title: "Gus Grissom is suited for the Mercury-Redstone 4 flight",
    description:
      "Project Mercury Astronaut Virgil I. Grissom, primary pilot for the Mercury-Redstone 4 (Liberty Bell 7) flight, gets an assist from suit specialist Joe W. Schmidt as he prepares for the Mercury-Redstone 4 space flight. The flight, the second crewed shot in the Mercury program, was postponed because of bad weather in the launch area.",
    place: "Cape Canaveral, Florida",
    credit: "NASA",
    creditUrl: "https://www.nasa.gov/gallery/project-mercury/",
  },
  "13-s88-55875.jpg.webp": {
    title: "Gus Grissom dons his suit",
    description:
      "Donning a spacesuit for the Mercury-Redstone 4 (MR-4) mission, astronaut Virgil I. (Gus) Grissom chats with spaceflight equipment specialist Joe W. Schmidt in the personal equipment room of Hangar S at Cape Canaveral, Florida. Shortly after this photograph was taken, the launch was postponed two days due to unfavorable weather conditions in the area.",
    place: "Hangar S, Cape Canaveral, Florida",
    credit: "NASA",
    creditUrl: "https://www.nasa.gov/gallery/project-mercury/",
  },
  "20-s62-00330.jpg.webp": {
    title: "John Glenn prepares for his Mercury-Atlas 6 flight",
    description:
      "Astronaut John H. Glenn Jr. (left), Dr. William Douglas, astronauts flight surgeon, and equipment specialist Joe Schmitt leave crew quarters prior to Mercury-Atlas 6 (MA-6) mission.",
    place: "Cape Canaveral, Florida",
    credit: "NASA",
    creditUrl: "https://www.nasa.gov/gallery/project-mercury/",
  },
  "21-s64-14855.jpg.webp": {
    title: "John F. Kennedy honors astronaut John Glenn",
    description:
      "Astronaut John Glenn Jr. is honored by President John F. Kennedy after Glenn's historical first manned orbital flight, Mercury-Atlas 6. The ceremony was held in front of Hangar S at Cape Canaveral Air Force Station.",
    place: "Hangar S, Cape Canaveral Air Force Station, Florida",
    credit: "NASA",
    creditUrl: "https://www.nasa.gov/gallery/project-mercury/",
  },
};

export function getImageCredit(src) {
  const raw = String(src || "");
  const base = decodeURIComponent(raw.split("/").pop()?.split("?")[0] ?? "");
  if (!base) return null;
  if (IMAGE_CREDITS[base]) return IMAGE_CREDITS[base];

  const stem = base.replace(/\.(jpg|jpeg|png|webp)+$/i, "");
  const match = Object.entries(IMAGE_CREDITS).find(([key]) => key.startsWith(stem));
  return match ? match[1] : null;
}
