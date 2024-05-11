import fs from 'fs';

type VestingsMetadata = {
  height: number;
  addresses: string[];
};

let vestings: VestingsMetadata | undefined;
export function loadVestings(): VestingsMetadata | undefined {
  if (vestings) return vestings;

  const file = fs.readFileSync('./assets/vestings.json', 'utf-8');
  vestings = JSON.parse(file);

  return vestings;
}
