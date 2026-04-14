// Singapore constituencies (GRCs + SMCs) with associated postal-code prefixes.
// Postal prefixes are the first 3 digits of the 6-digit SG postal code and
// map to the sector / town served by each constituency. Ranges are expanded
// so seeded notices spread across the whole area (and can be found by radius
// search from any home postal code within the sector).
export interface Constituency {
  name: string;
  type: 'GRC' | 'SMC';
  postalPrefixes: string[];
}

// Inclusive range helper: range(520, 529) -> ['520','521',...,'529']
const range = (start: number, end: number): string[] => {
  const out: string[] = [];
  for (let i = start; i <= end; i++) out.push(String(i).padStart(3, '0'));
  return out;
};

export const CONSTITUENCIES: Constituency[] = [
  // GRCs
  { name: 'Aljunied',            type: 'GRC', postalPrefixes: [...range(380, 389), ...range(400, 409)] },
  { name: 'Ang Mo Kio',          type: 'GRC', postalPrefixes: range(560, 566) },
  { name: 'Bishan-Toa Payoh',    type: 'GRC', postalPrefixes: [...range(570, 573), ...range(310, 319)] },
  { name: 'Chua Chu Kang',       type: 'GRC', postalPrefixes: range(680, 689) },
  { name: 'East Coast',          type: 'GRC', postalPrefixes: range(460, 469) },
  { name: 'Holland-Bukit Timah', type: 'GRC', postalPrefixes: [...range(260, 269), '588'] },
  { name: 'Jalan Besar',         type: 'GRC', postalPrefixes: range(200, 219) },
  { name: 'Jurong',              type: 'GRC', postalPrefixes: [...range(600, 609), ...range(640, 649)] },
  { name: 'Marine Parade',       type: 'GRC', postalPrefixes: range(440, 449) },
  { name: 'Marsiling-Yew Tee',   type: 'GRC', postalPrefixes: range(730, 739) },
  { name: 'Nee Soon',            type: 'GRC', postalPrefixes: range(760, 769) },
  { name: 'Pasir Ris-Punggol',   type: 'GRC', postalPrefixes: [...range(510, 519), ...range(820, 829)] },
  { name: 'Sembawang',           type: 'GRC', postalPrefixes: range(750, 759) },
  { name: 'Sengkang',            type: 'GRC', postalPrefixes: range(540, 549) },
  { name: 'Tampines',            type: 'GRC', postalPrefixes: range(520, 529) },
  { name: 'Tanjong Pagar',       type: 'GRC', postalPrefixes: [...range(80, 99), ...range(150, 169)] },
  { name: 'West Coast',          type: 'GRC', postalPrefixes: [...range(120, 129), ...range(610, 619)] },
  // SMCs
  { name: 'Bukit Batok',         type: 'SMC', postalPrefixes: range(650, 659) },
  { name: 'Bukit Panjang',       type: 'SMC', postalPrefixes: range(670, 679) },
  { name: 'Hougang',             type: 'SMC', postalPrefixes: range(530, 539) },
  { name: 'Kebun Baru',          type: 'SMC', postalPrefixes: range(567, 569) },
  { name: 'MacPherson',          type: 'SMC', postalPrefixes: range(360, 369) },
  { name: 'Marymount',           type: 'SMC', postalPrefixes: range(574, 579) },
  { name: 'Mountbatten',         type: 'SMC', postalPrefixes: [...range(397, 399), ...range(438, 439)] },
  { name: 'Pioneer',             type: 'SMC', postalPrefixes: [...range(638, 639), ...range(640, 649)] },
  { name: 'Potong Pasir',        type: 'SMC', postalPrefixes: range(350, 359) },
  { name: 'Radin Mas',           type: 'SMC', postalPrefixes: range(90, 99) },
  { name: 'Yio Chu Kang',        type: 'SMC', postalPrefixes: range(556, 566) },
  { name: 'Yuhua',               type: 'SMC', postalPrefixes: range(600, 609) },
];

export const CONSTITUENCY_NAMES: string[] = CONSTITUENCIES.map((c) => c.name).sort();
