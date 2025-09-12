declare module '@south-paw/react-vector-maps/maps/json/world.json' {
    const map: any;
    export default map;
}

// Optional wildcard to cover other maps if used later
declare module '@south-paw/react-vector-maps/maps/*' {
    const map: any;
    export default map;
} 