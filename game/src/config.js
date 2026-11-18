// Port Azahar's six-job ledger run. Coordinates are shared with the street plan.
export const JOBS = [
  ['Dockside Customs Shed', 'Dockside', -48, 34],
  ['The Velvet Cannery', 'Cannery Row', 8, 34],
  ['Saltline Casino Vault', 'Saltline', 52, 0],
  ["The Harbourmaster's Safe", 'Harbour Quarter', -38, -34],
  ['The Azahar Mint', 'North Causeway', 34, -34],
  ['Causeway Dawn', 'North Causeway', 56, -53],
];

export const CARS = [
  { name: 'Crew van', speed: 16, grip: .65, color: [.57, .25, .16] },
  { name: 'Port sedan', speed: 16, grip: .65, color: [.15, .49, .58] },
  { name: 'Warden cruiser', speed: 16, grip: .65, color: [.08, .32, .82] },
];
export const DISTRICTS = ['Dockside', 'Cannery Row', 'Saltline', 'Harbour Quarter', 'North Causeway'];
export const UPGRADES = [
  ['Deep Bags', 'Carry two extra ledger bags.', 'bags'],
  ['Quiet Tyres', 'Wanted cools more quickly.', 'silent'],
  ['Better Engine', 'The getaway car pulls harder.', 'engine'],
  ['Wet Grip', 'Hold a line on rain-slick streets.', 'grip'],
  ['Silent Entry', 'Move through the case more quietly.', 'soft'],
  ['Route Map', 'Wardens and escape routes stay visible farther away.', 'map'],
];
export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
