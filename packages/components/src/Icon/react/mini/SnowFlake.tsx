import Svg, { SvgProps, Path } from 'react-native-svg';
const SvgSnowFlake = (props: SvgProps) => (
  <Svg viewBox="0 0 20 20" fill="none" accessibilityRole="image" {...props}>
    <Path
      clipRule="evenodd"
      d="M3.05 7.4a.75.75 0 0 1 1.05.15l1.272 1.7h9.252l1.276-1.7a.75.75 0 0 1 1.2.9l-.6.8H18a.75.75 0 1 1 0 1.5H16.5l.6.8a.75.75 0 1 1-1.198.9l-1.279-1.7H5.374L4.1 12.45a.75.75 0 0 1-1.2-.9l.6-.8H2a.75.75 0 0 1 0-1.5h1.498l-.599-.8A.75.75 0 0 1 3.05 7.4Z"
    />
    <Path
      clipRule="evenodd"
      d="M4.273 14.719a.75.75 0 0 1 .656-.834l2.107-.251 4.626-8.013-.834-1.955a.75.75 0 0 1 1.38-.589l.392.92.75-1.3a.75.75 0 1 1 1.3.75l-.751 1.3.992-.12a.75.75 0 0 1 .182 1.489l-2.113.257-4.624 8.009.836 1.953a.75.75 0 1 1-1.38.59l-.393-.92-.75 1.298a.75.75 0 0 1-1.299-.75l.75-1.297-.993.118a.75.75 0 0 1-.834-.655Z"
    />
    <Path
      clipRule="evenodd"
      d="M8.777 2.681a.75.75 0 0 1 .394.985l-.836 1.95 4.626 8.013 2.11.255a.75.75 0 0 1-.18 1.49l-.992-.12.75 1.3a.75.75 0 1 1-1.298.75l-.751-1.301-.392.92a.75.75 0 1 1-1.38-.588l.834-1.957-4.625-8.01-2.109-.253a.75.75 0 0 1 .18-1.489l.992.12-.75-1.3a.75.75 0 1 1 1.3-.75l.749 1.298.393-.919a.75.75 0 0 1 .985-.394Z"
    />
  </Svg>
);
export default SvgSnowFlake;
