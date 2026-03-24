# Battle VFX Stack

Battle page feedback currently leans on three layers:

- `@shopify/react-native-skia` for fast hit flashes, impact rings, and slash overlays.
- `react-native-reanimated` for existing fan-layout, selection, and shake animation.
- `expo-haptics` for selection and damage feedback on supported devices.

Possible future additions:

- `lottie-react-native` for one-shot spell, victory, or defeat sequences.
- `react-native-svg` for lightweight icons and battle timeline markers.

Notes:

- Skia is wired through a web wrapper so the Expo web preview can still render the battle overlay.
- The battle page should keep combat rules visible in the UI, not only in markdown.
