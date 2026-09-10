import type { TracePreset } from '../types';
export const PRESETS: TracePreset[] = [
  { id: 'coinbase', name: 'Coinbase · direct', label: 'Coinbase', address: '0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511', shortAddress: '0xb5d8…f511', chain: 'Ethereum', chainType: 'eth', targetExchange: 'Coinbase', tagColor: 'primary' },
  { id: 'bitget', name: 'Bitget · direct', label: 'Bitget', address: '0x4523462420065fd01e883f713a22df0876747fd5', shortAddress: '0x4523…7fd5', chain: 'Ethereum', chainType: 'eth', targetExchange: 'Bitget', tagColor: 'tertiary' },
  { id: 'multihop', name: 'Multi-hop · 2 hops', label: 'Illustrative demo', address: '0x000000000000000000000000000000000000d001', shortAddress: 'Illustrative', chain: 'Ethereum', chainType: 'eth', targetExchange: 'Demo Exchange', tagColor: 'secondary' }
];
