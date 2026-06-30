// Shared, design-system-wide types (Component Authoring Contract, Task 1.0).
// Color reaches components ONLY as a semantic Signal role — never a raw color.

export type Signal = 'ambient' | 'decay' | 'active' | 'hazard' | 'ok';

export type Size = 'sm' | 'md' | 'lg';
